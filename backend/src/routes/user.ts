import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Todos los endpoints de user requieren autenticación
router.use(requireAuth);

const updateProfileSchema = z.object({
  location: z.string().max(100).optional(),
  deliveryDay: z.enum(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']).optional(),
  deliveryTime: z.string().max(20).optional(),
});

// GET /user/profile
router.get('/profile', async (req: Request, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
    select: {
      id: true, username: true, email: true, avatarUrl: true,
      location: true, deliveryDay: true, deliveryTime: true,
      totalOrders: true, totalSpent: true, createdAt: true, provider: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }

  res.json({ user });
});

// PATCH /user/profile
router.patch('/profile', async (req: Request, res: Response): Promise<void> => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors[0].message });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: req.session.userId },
    data: parsed.data,
    select: {
      id: true, username: true, email: true, avatarUrl: true,
      location: true, deliveryDay: true, deliveryTime: true,
      totalOrders: true, totalSpent: true,
    },
  });

  res.json({ user: updated, message: 'Perfil actualizado.' });
});

export default router;
