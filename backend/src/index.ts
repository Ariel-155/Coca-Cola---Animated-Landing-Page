import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import { globalLimiter } from './middleware/rateLimiter';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4000;

// ── CORS ──────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsers ──────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Sessions (In-Memory Fallback) ─────────────
app.use(session({
  name: 'coca.sid',
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
  },
}));

// ── Rate Limiting Global ──────────────────────
app.use('/api', globalLimiter);

// ── Routes ────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// ── Health Check ──────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado.' });
});

// ── Error handler ─────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ── Start ─────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});

export default app;
