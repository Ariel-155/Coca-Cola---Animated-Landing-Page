import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import Home from './pages/Home';
import Experiencia from './pages/Experiencia';
import Mayoristas from './pages/Mayoristas';

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
              <a href="/pages/Productos.html" className="hover:text-coca-red transition-colors">Productos</a>
              <Link to="/experiencia" className="hover:text-coca-red transition-colors">Experiencia</Link>
              <Link to="/mayoristas" className="hover:text-coca-red transition-colors">Mayoristas</Link>
            </div>
            
            {/* Desktop Join Button */}
            <div className="hidden md:block">
              <a href="https://www.coca-colacompany.com/" target='_blank' rel='noopener noreferrer'>
                  <button className="bg-coca-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
                    Únete
                  </button>         
              </a>
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
            <a href="/pages/Productos.html" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Productos</a>
            <Link to="/experiencia" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Experiencia</Link>
            <Link to="/mayoristas" className="hover:text-coca-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Mayoristas</Link>
          </div>
          <a href="https://www.coca-colacompany.com/" target='_blank' rel='noopener noreferrer' className="mt-16">
            <button className="bg-coca-red hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(244,0,0,0.4)]">
              Únete
            </button>         
          </a>
        </div>

        {/* Content Wrapper */}
        <div className="pt-[76px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiencia" element={<Experiencia />} />
            <Route path="/mayoristas" element={<Mayoristas />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-coca-black border-t border-coca-red/20 py-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 Coca-Cola Company. Landing Page Project for Cibertec.</p>
        </footer>

      </div>
    </BrowserRouter>
  );
}

export default App;
