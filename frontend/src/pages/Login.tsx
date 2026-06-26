import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo2.png';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

type Step = 'form' | 'otp';
type Mode = 'login' | 'register';

export default function Login() {
  const { user, login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');
  const [step, setStep] = useState<Step>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const googleInitialized = useRef(false);

  // UI state
  const [googleLoaded, setGoogleLoaded] = useState(!!window.google);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 min

  // Google Script
  useEffect(() => {
    if (window.google) {
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  // OTP countdown
  useEffect(() => {
    if (step !== 'otp') return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatCountdown = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[index] = val.slice(-1);
    setOtp(next);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  // Ref estable para el callback de Google — no cambia entre renders
  const googleLoginRef = useRef(googleLogin);
  useEffect(() => { googleLoginRef.current = googleLogin; }, [googleLogin]);
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // Render the Google button whenever googleLoaded or mode changes
  useEffect(() => {
    const el = googleButtonRef.current;
    if (!el || !window.google) return;

    if (!googleInitialized.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '65952804171-ne7heser2g5ntfro5bvsncfjrdhc5rl3.apps.googleusercontent.com',
        callback: async (response: { credential: string }) => {
          setSubmitting(true); setError('');
          try {
            await googleLoginRef.current(response.credential);
            navigateRef.current('/dashboard');
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error con Google');
          } finally {
            setSubmitting(false);
          }
        },
      });
      googleInitialized.current = true;
    }

    el.innerHTML = '';
    window.google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      text: mode === 'login' ? 'signin_with' : 'signup_with',
      shape: 'pill',
      logo_alignment: 'center',
    });
  }, [googleLoaded, mode]); // Sólo corre cuando carga el script o cambia el modo

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else {
        // Register step 1: send OTP
        const res = await fetch(`${API}/auth/register/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPendingEmail(email);
        setCountdown(180);
        setStep('otp');
        setSuccess(`Código enviado a ${email}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Ingresa los 6 dígitos.'); return; }
    setError(''); setSubmitting(true);

    try {
      const res = await fetch(`${API}/auth/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: pendingEmail, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Código incorrecto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-coca-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-12">
      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-coca-red/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-coca-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="mb-8 block">
            <img src={logoImg} alt="Coca-Cola" className="h-10 mx-auto object-contain" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(244,0,9,0.15)]">
          
          {step === 'form' ? (
            <>
              {/* Mode toggle */}
              <div className="flex bg-black rounded-2xl p-1 mb-8">
                {(['login', 'register'] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      mode === m
                        ? 'bg-coca-red text-white shadow-[0_0_15px_rgba(244,0,9,0.4)]'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {m === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                  </button>
                ))}
              </div>

              <h1 className="text-2xl font-black text-white mb-1">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {mode === 'login' ? 'Accede a tu panel de socio mayorista.' : 'Únete a la red de socios Coca-Cola.'}
              </p>

              {/* Error / success */}
              {error && (
                <div className="bg-red-950 border border-coca-red/50 text-red-300 text-sm rounded-xl p-3 mb-4 flex items-start gap-2">
                  <span>⚠</span><span>{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-950 border border-green-500/50 text-green-300 text-sm rounded-xl p-3 mb-4">
                  ✓ {success}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="ej: coca_fan_2026"
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-coca-red transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-coca-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-coca-red transition-colors"
                  />
                  {mode === 'register' && (
                    <p className="text-gray-600 text-xs mt-1">Mínimo 8 caracteres, una mayúscula y un número.</p>
                  )}
                  {mode === 'register' && (
                    <div className="mt-4 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-black border border-white/20 rounded accent-coca-red"
                      />
                      <label htmlFor="terms" className="text-gray-400 text-xs">
                        Acepto los <Link to="/terminos" target="_blank" className="text-coca-red hover:underline">Términos y Condiciones</Link> y el <Link to="/privacidad" target="_blank" className="text-coca-red hover:underline">Aviso de Privacidad</Link>. Entiendo que este sitio es un trabajo práctico open-source.
                      </label>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || (mode === 'register' && !acceptedTerms)}
                  className="w-full bg-coca-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(244,0,9,0.3)] hover:shadow-[0_0_30px_rgba(244,0,9,0.5)] transform hover:-translate-y-0.5"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {mode === 'login' ? 'Entrando...' : 'Enviando código...'}
                    </span>
                  ) : (
                    mode === 'login' ? 'Iniciar Sesión' : 'Continuar →'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-gray-600 text-xs">o continúa con</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google Button — div estático, nunca se desmonta */}
              <div className="relative flex justify-center w-full min-h-[44px]">
                {mode === 'register' && !acceptedTerms && (
                  <div className="absolute inset-0 z-10 bg-black/50 cursor-not-allowed" title="Debes aceptar los términos y condiciones primero." />
                )}
                {!googleLoaded && (
                  <div className="w-full h-11 border border-white/10 rounded-full flex items-center justify-center bg-white/5 animate-pulse">
                    <span className="text-gray-500 text-sm">Cargando Google...</span>
                  </div>
                )}
                <div
                  ref={googleButtonRef}
                  className={`w-full flex justify-center ${googleLoaded ? '' : 'hidden'} ${mode === 'register' && !acceptedTerms ? 'opacity-50' : ''}`}
                />
              </div>
            </>
          ) : (
            /* OTP Step */
            <>
              <button
                onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors"
              >
                ← Volver
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-coca-red/10 border border-coca-red/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-coca-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-white mb-1">Verifica tu email</h2>
                <p className="text-gray-500 text-sm">
                  Enviamos un código de 6 dígitos a<br />
                  <strong className="text-white">{pendingEmail}</strong>
                </p>
              </div>

              {error && (
                <div className="bg-red-950 border border-coca-red/50 text-red-300 text-sm rounded-xl p-3 mb-4">
                  ⚠ {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                {/* OTP inputs */}
                <div className="flex gap-3 justify-center mb-6">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 bg-black border-2 border-white/10 rounded-xl text-center text-xl font-black text-white focus:outline-none focus:border-coca-red transition-colors caret-transparent"
                    />
                  ))}
                </div>

                {/* Countdown */}
                <p className="text-center text-sm mb-6">
                  {countdown > 0 ? (
                    <span className="text-gray-500">Expira en <strong className="text-coca-red">{formatCountdown(countdown)}</strong></span>
                  ) : (
                    <span className="text-red-400">El código expiró. Vuelve al formulario.</span>
                  )}
                </p>

                <button
                  type="submit"
                  disabled={submitting || otp.join('').length !== 6 || countdown === 0}
                  className="w-full bg-coca-red hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base py-3.5 rounded-xl transition-all"
                >
                  {submitting ? 'Verificando...' : 'Verificar y crear cuenta'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <Link to="/" className="hover:text-coca-red transition-colors">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  );
}

// Declaración global para Google Identity
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
          prompt: () => void;
        };
      };
    };
  }
}
