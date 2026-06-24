import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIMES = ['08:00 - 11:00', '11:00 - 14:00', '14:00 - 17:00', '17:00 - 20:00'];

export default function Dashboard() {
  const { user, logout, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState('');
  const [deliveryDay, setDeliveryDay] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Numbers animation
  const [displayedOrders, setDisplayedOrders] = useState(0);
  const [displayedSpent, setDisplayedSpent] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    // Animate numbers
    const orderTarget = user.totalOrders;
    const spentTarget = user.totalSpent;
    let frame = 0;
    const totalFrames = 60;
    const timer = setInterval(() => {
      frame++;
      setDisplayedOrders(Math.round((orderTarget * frame) / totalFrames));
      setDisplayedSpent(Math.round((spentTarget * frame) / totalFrames * 100) / 100);
      if (frame >= totalFrames) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [user]);

  const handleSave = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const res = await fetch(`${API}/user/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ location, deliveryDay, deliveryTime }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      await refreshUser();
      setEditing(false);
      setSaveMsg('¡Guardado con éxito!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const avatarLetter = user?.username?.[0]?.toUpperCase() || '?';
  const joinDate = user ? new Date(user.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' }) : '';

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-coca-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-coca-red/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vh] bg-coca-red/3 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 bg-black/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-16 h-16 rounded-2xl object-cover border-2 border-coca-red/50 shadow-[0_0_20px_rgba(244,0,9,0.3)]" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coca-red to-red-900 flex items-center justify-center text-2xl font-black shadow-[0_0_20px_rgba(244,0,9,0.4)]">
                  {avatarLetter}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">Bienvenido de vuelta,</p>
              <h1 className="text-3xl font-black tracking-tight mt-0.5">@{user.username}</h1>
              <p className="text-gray-600 text-xs mt-1 bg-white/5 inline-block px-2 py-0.5 rounded-full">Socio desde {joinDate}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-coca-red/10 hover:border-coca-red hover:text-coca-red transition-all text-sm font-medium group"
          >
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>

        {/* Save feedback */}
        {saveMsg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
            saveMsg.includes('éxito')
              ? 'bg-green-950 border-green-500/40 text-green-300'
              : 'bg-red-950 border-coca-red/40 text-red-300'
          }`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {saveMsg.includes('éxito') ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {saveMsg}
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Pedidos Totales', 
              value: displayedOrders.toString(), 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            },
            { 
              label: 'Total Invertido', 
              value: `S/ ${displayedSpent.toFixed(2)}`, 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            },
            { 
              label: 'Estado', 
              value: 'Activo', 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            },
            { 
              label: 'Método Acceso', 
              value: user.provider === 'google' ? 'Google' : 'Email', 
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/40 border border-white/5 rounded-3xl p-6 hover:border-coca-red/30 hover:bg-[#111] transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 bg-white/5 text-coca-red rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-coca-red/10">
                {stat.icon}
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1.5">{stat.label}</p>
              <p className="text-3xl font-black text-white group-hover:text-coca-red transition-colors">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Información de cuenta */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-coca-red/10 text-coca-red rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                Información de Cuenta
              </h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Usuario', value: `@${user.username}` },
                { label: 'Email', value: user.email },
                { label: 'ID del Sistema', value: user.id, mono: true },
              ].map(item => (
                <div key={item.label} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 bg-black/50 border border-white/5 rounded-2xl">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{item.label}</span>
                  <span className={`text-white font-medium ${item.mono ? 'font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md' : 'text-sm'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferencias de entrega */}
          <div className="bg-[#111] border border-white/5 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h2 className="text-xl font-black flex items-center gap-3">
                <div className="w-10 h-10 bg-coca-red/10 text-coca-red rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                Logística de Envíos
              </h2>
              <button
                onClick={() => {
                  if (!editing) {
                    setLocation(user?.location || '');
                    setDeliveryDay(user?.deliveryDay || '');
                    setDeliveryTime(user?.deliveryTime || '');
                  }
                  setEditing(!editing);
                }}
                className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${
                  editing ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-coca-red hover:bg-red-700 text-white shadow-[0_0_15px_rgba(244,0,9,0.3)]'
                }`}
              >
                {editing ? 'Cancelar' : 'Configurar'}
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Ubicación */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Ubicación de tienda</p>
                {editing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Ej: Lima, Miraflores, Av. Principal 123"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-coca-red transition-colors"
                  />
                ) : (
                  <p className="text-white font-medium text-sm">{user.location || <span className="text-gray-600 italic">No configurado</span>}</p>
                )}
              </div>

              {/* Día preferido */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Día de entrega</p>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDeliveryDay(d)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          deliveryDay === d
                            ? 'bg-coca-red text-white shadow-[0_0_15px_rgba(244,0,9,0.4)]'
                            : 'bg-black border border-white/10 text-gray-400 hover:border-coca-red/50 hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-white font-medium text-sm">{user.deliveryDay || <span className="text-gray-600 italic">No configurado</span>}</p>
                )}
              </div>

              {/* Horario */}
              <div className="bg-black/50 border border-white/5 rounded-2xl p-4">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Rango de horario</p>
                {editing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {TIMES.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDeliveryTime(t)}
                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                          deliveryTime === t
                            ? 'bg-coca-red text-white shadow-[0_0_15px_rgba(244,0,9,0.4)]'
                            : 'bg-black border border-white/10 text-gray-400 hover:border-coca-red/50 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-white font-medium text-sm">{user.deliveryTime || <span className="text-gray-600 italic">No configurado</span>}</p>
                )}
              </div>

              {editing && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-coca-red to-red-800 hover:from-red-600 hover:to-coca-red disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(244,0,9,0.4)] hover:shadow-[0_0_30px_rgba(244,0,9,0.6)] mt-4"
                >
                  {saving ? 'Guardando cambios...' : 'Guardar preferencias'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer brand */}
        <div className="text-center mt-16 pb-8 text-gray-600 text-xs font-medium uppercase tracking-widest">
          <p>© 2026 Panel de Socio Mayorista · Coca-Cola</p>
        </div>
      </div>
    </div>
  );
}
