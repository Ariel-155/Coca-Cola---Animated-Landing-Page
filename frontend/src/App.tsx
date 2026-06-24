import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from './context/AuthContext';

gsap.registerPlugin(ScrollTrigger);
import Home from './pages/Home';
import Experiencia from './pages/Experiencia';
import Mayoristas from './pages/Mayoristas';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Limpiar todos los ScrollTriggers "huérfanos" para evitar que bloqueen el DOM
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // 2. Posicionarse en la parte superior
    window.scrollTo(0, 0);

    // 3. Recalcular GSAP después de que el nuevo DOM se haya montado
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function App() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Limpieza en caso de desmontaje
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Ocultar si hacemos scroll hacia abajo y ya pasamos el umbral
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsNavVisible(false);
      } else {
        // Mostrar si hacemos scroll hacia arriba
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-coca-black min-h-screen text-coca-white font-sans">
        <Navigation 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isNavVisible={isNavVisible} 
        />
        <ContentWrapper />
      </div>
    </BrowserRouter>
  );
}

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isNavVisible: boolean;
}

function Navigation({ isMobileMenuOpen, setIsMobileMenuOpen, isNavVisible }: NavigationProps) {
  return (
    <>
      {/* Navbar */}
        <nav 
          className={`fixed w-full z-50 top-0 bg-coca-black/80 backdrop-blur-md border-b border-coca-red/20 transition-transform duration-500 ease-in-out ${
            isNavVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className='Logo'>
              <Link to="/">
                <img src="/src/assets/logo2.png" alt="Coca-cola" style={{ width: '150px', height: 'auto' }}/>
              </Link>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
              <Link to="/" className="hover:text-coca-red transition-colors">Inicio</Link>
              <Link to="/productos" className="hover:text-coca-red transition-colors">Productos</Link>
              <Link to="/experiencia" className="hover:text-coca-red transition-colors">Experiencia</Link>
              <Link to="/mayoristas" className="hover:text-coca-red transition-colors">Mayoristas</Link>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <NavAuthButtons />
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-[6px] z-50 relative focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-8 h-[3px] rounded-full bg-white transform transition duration-300 ease-in-out origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''}`} />
              <span className={`block w-8 h-[3px] rounded-full bg-white transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block w-8 h-[3px] rounded-full bg-white transform transition duration-300 ease-in-out origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Full Screen Menu */}
        <div className={`fixed inset-0 bg-coca-black/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-10 text-3xl font-black tracking-wide text-center">
            <Link to="/" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link to="/productos" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
            <Link to="/experiencia" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Experiencia</Link>
            <Link to="/mayoristas" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mayoristas</Link>
          </div>
          <div className="mt-16 flex flex-col items-center gap-4">
            <MobileAuthButtons closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
    </>
  );
}

function NavAuthButtons() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (user) {
    return (
      <>
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-coca-red/50 text-coca-red font-bold text-sm hover:bg-coca-red hover:text-white transition-all"
        >
          <span className="w-5 h-5 bg-coca-red text-white rounded-full text-xs flex items-center justify-center font-black">
            {user.username[0].toUpperCase()}
          </span>
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:border-coca-red hover:text-coca-red transition-all text-sm font-medium"
        >
          Salir
        </button>
      </>
    );
  }

  return (
    <Link to="/login">
      <button className="bg-coca-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
        Únete
      </button>
    </Link>
  );
}

function MobileAuthButtons({ closeMobileMenu }: { closeMobileMenu: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    navigate('/');
  };

  if (user) {
    return (
      <>
        <Link to="/dashboard" onClick={closeMobileMenu} className="bg-coca-red text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(244,0,0,0.4)] hover:bg-red-700 transition-all">
          Dashboard
        </Link>
        <button onClick={handleLogout} className="text-gray-400 hover:text-white text-lg font-medium transition-colors">
          Cerrar sesión
        </button>
      </>
    );
  }

  return (
    <Link to="/login" onClick={closeMobileMenu}>
      <button className="bg-coca-red hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(244,0,0,0.4)]">
        Únete
      </button>
    </Link>
  );
}

function ContentWrapper() {
  const location = useLocation();
  const isFullPage = location.pathname === '/login' || location.pathname === '/dashboard';

  return (
    <>
      <div className={isFullPage ? '' : 'pt-[76px]'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/experiencia" element={<Experiencia />} />
          <Route path="/mayoristas" element={<Mayoristas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      {!isFullPage && (
        <footer className="bg-coca-black border-t border-coca-red/20 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Coca-Cola Company. Landing Page Project for Cibertec.</p>
        </footer>
      )}
    </>
  );
}

export default App;
