import { Request, Response, NextFunction } from 'express';

// Extiende la sesión de Express para incluir userId
declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.userId) {
    next();
  } else {
    res.status(401).json({ error: 'No autenticado. Inicia sesión para continuar.' });
  }
}

export function requireGuest(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.userId) {
    res.status(400).json({ error: 'Ya tienes una sesión activa.' });
  } else {
    next();
  }
}
