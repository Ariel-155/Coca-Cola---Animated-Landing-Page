import rateLimit from 'express-rate-limit';

// Rate limit para envío de OTP: 3 intentos por 15 minutos por IP
export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    error: 'Demasiadas solicitudes de código. Espera 15 minutos antes de volver a intentarlo.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || 'unknown',
});

// Rate limit para verificar OTP: 5 intentos por 15 minutos por IP
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'Demasiados intentos de verificación. Espera 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para login: 10 intentos por 15 minutos por IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Demasiados intentos de inicio de sesión. Espera 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit global de API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});
