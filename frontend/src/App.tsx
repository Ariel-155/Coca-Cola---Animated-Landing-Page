import { useEffect } from 'react';
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
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-coca-black min-h-screen text-coca-white font-sans">
        
        {/* Navbar */}
        <nav className="fixed w-full z-50 top-0 bg-coca-black/80 backdrop-blur-md border-b border-coca-red/20">
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
            <a href="https://www.coca-colacompany.com/" target='_blank' rel='noopener noreferrer'>
                <button className="bg-coca-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
                  Únete
                </button>         
            </a>
          </div>
        </nav>

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
