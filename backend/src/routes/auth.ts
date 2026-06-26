import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../lib/prisma';
import {
  setOtp, getOtp, deleteOtp,
  setPendingRegistration, getPendingRegistration, deletePendingRegistration
} from '../lib/redis';
import { sendOtpEmail, generateOtp } from '../services/emailService';
import { otpSendLimiter, otpVerifyLimiter, loginLimiter } from '../middleware/rateLimiter';
import { requireAuth } from '../middleware/auth';
import { OAuth2Client } from 'google-auth-library';

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ──────────────────────────────────────────────
// Schemas de validación (Zod)
// ──────────────────────────────────────────────
const registerInitSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
});

const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'El código debe tener 6 dígitos').regex(/^\d+$/, 'Solo números'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const googleTokenSchema = z.object({
  credential: z.string().min(1),
});

// ──────────────────────────────────────────────
// POST /auth/register/init
// Paso 1: Validar datos, enviar OTP
// ──────────────────────────────────────────────
router.post('/register/init', otpSendLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = registerInitSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { username, email, password } = parsed.data;

  // Verificar unicidad de email
  const existingEmail = await prisma.user.findUnique({ where: { email } });

  if (existingEmail) {
    res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const otp = generateOtp();

  await Promise.all([
    setOtp(email, otp),
    setPendingRegistration(email, { username, passwordHash }),
  ]);

  await sendOtpEmail(email, otp, username);

  res.json({ 
    message: 'Código enviado a tu email. Tienes 3 minutos para verificarlo.',
    email, // lo devolvemos para que el frontend lo use en el paso 2
  });
});

// ──────────────────────────────────────────────
// POST /auth/register/verify
// Paso 2: Verificar OTP y crear usuario
// ──────────────────────────────────────────────
router.post('/register/verify', otpVerifyLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = otpVerifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { email, otp } = parsed.data;

  const [savedOtp, pendingData] = await Promise.all([
    getOtp(email),
    getPendingRegistration(email),
  ]);

  if (!savedOtp || !pendingData) {
    res.status(400).json({ error: 'No hay registro pendiente o el código expiró. Inicia el proceso de nuevo.' });
    return;
  }

  if (savedOtp !== otp) {
    res.status(400).json({ error: 'Código incorrecto. Verifica e intenta de nuevo.' });
    return;
  }

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      username: pendingData.username,
      email,
      password: pendingData.passwordHash,
      provider: 'local',
      isVerified: true,
    },
    select: { 
      id: true, username: true, email: true, avatarUrl: true, 
      location: true, storeName: true, phone: true, deliveryDay: true, deliveryTime: true,
      totalOrders: true, totalSpent: true, createdAt: true, provider: true 
    },
  });

  // Limpiar Redis
  await Promise.all([deleteOtp(email), deletePendingRegistration(email)]);

  // Iniciar sesión automáticamente
  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Error al iniciar sesión.' });
      return;
    }
    res.status(201).json({ message: '¡Cuenta creada! Bienvenido.', user });
  });
});

// ──────────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────────
router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    res.status(401).json({ error: 'Credenciales incorrectas.' });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: 'Credenciales incorrectas.' });
    return;
  }

  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Error al iniciar sesión.' });
      return;
    }
    res.json({
      message: '¡Sesión iniciada!',
      user: {
        id: user.id, username: user.username, email: user.email, avatarUrl: user.avatarUrl,
        location: user.location, storeName: user.storeName, phone: user.phone, deliveryDay: user.deliveryDay, deliveryTime: user.deliveryTime,
        totalOrders: user.totalOrders, totalSpent: user.totalSpent, createdAt: user.createdAt, provider: user.provider
      },
    });
  });
});

// ──────────────────────────────────────────────
// POST /auth/google
// Google One Tap / OAuth token verification
// ──────────────────────────────────────────────
router.post('/google', async (req: Request, res: Response): Promise<void> => {
  const parsed = googleTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Token inválido.' });
    return;
  }

  const { credential } = parsed.data;

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    res.status(400).json({ error: 'No se pudo verificar el token de Google.' });
    return;
  }

  const { email, name, sub: googleId, picture } = payload;

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (!user) {
    // Generar username único basado en el nombre de Google
    const username = (name || email.split('@')[0])
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .slice(0, 18);

    user = await prisma.user.create({
      data: {
        username,
        email,
        googleId,
        avatarUrl: picture,
        provider: 'google',
        isVerified: true,
      },
    });
  } else if (!user.googleId) {
    // Vincular cuenta existente con Google
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId, avatarUrl: picture || user.avatarUrl, provider: 'google' },
    });
  }

  req.session.userId = user.id;
  req.session.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Error al iniciar sesión.' });
      return;
    }
    res.json({
      message: '¡Bienvenido!',
      user: {
        id: user!.id, username: user!.username, email: user!.email, avatarUrl: user!.avatarUrl,
        location: user!.location, storeName: user!.storeName, phone: user!.phone, deliveryDay: user!.deliveryDay, deliveryTime: user!.deliveryTime,
        totalOrders: user!.totalOrders, totalSpent: user!.totalSpent, createdAt: user!.createdAt, provider: user!.provider
      },
    });
  });
});

// ──────────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────────
router.post('/logout', requireAuth, (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Error al cerrar sesión.' });
      return;
    }
    res.clearCookie('coca.sid');
    res.json({ message: 'Sesión cerrada.' });
  });
});

// ──────────────────────────────────────────────
// GET /auth/me — Verificar sesión activa
// ──────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  if (!req.session.userId) {
    res.json({ user: null });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: {
      id: true, username: true, email: true,
      avatarUrl: true, location: true,
      storeName: true, phone: true,
      deliveryDay: true, deliveryTime: true,
      totalOrders: true, totalSpent: true,
      createdAt: true, provider: true,
    },
  });

  if (!user) {
    req.session.destroy(() => {});
    res.json({ user: null });
    return;
  }

  res.json({ user });
});

export default router;
