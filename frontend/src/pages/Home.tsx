import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import tapChapaMp4 from '../assets/video_secciones/Tap_Chapa.mp4';

// ─── Configuración de la secuencia de frames ───
const FRAME_COUNT = 146; // 0.webp → 145.webp
const FRAME_PATH = '/frames/coca-zero/'; // Desde /public

/**
 * Componente reutilizable: Scroll-driven Canvas Frame Sequence
 * Técnica inspirada en las páginas de Apple (iPhone, MacBook Pro).
 * 
 * En lugar de un video MP4 (que depende del decodificador del navegador
 * y genera tirones al hacer seek aleatorio), se precargan imágenes
 * individuales en memoria y se dibujan en un <canvas> con
 * requestAnimationFrame — garantizando fluidez absoluta.
 */
export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });
  const tapChapaVideoRef = useRef<HTMLVideoElement>(null);

  // Estado para la interactividad de la chapa
  const [isChapaSpinning, setIsChapaSpinning] = useState(false);

  const handleChapaClick = () => {
    if (!tapChapaVideoRef.current || isChapaSpinning) return;
    
    // Reproducimos una sola vez a 2x de velocidad desde el inicio
    setIsChapaSpinning(true);
    tapChapaVideoRef.current.playbackRate = 2.0;
    tapChapaVideoRef.current.currentTime = 0;
    tapChapaVideoRef.current.play();
  };

  // Dibuja el frame actual en el canvas, ajustando resolución y aspect ratio
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Ajustar resolución del canvas al tamaño real del viewport
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // Cover: calcular dimensiones para que la imagen cubra todo el canvas sin distorsión
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgRatio > canvasRatio) {
      drawH = h;
      drawW = h * imgRatio;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgRatio;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // ─── Paso 1: Precargar TODAS las imágenes en memoria ───
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${i}.webp`;
      img.onload = () => {
        loadedCount++;
        // Cuando la primera imagen carga, renderizamos para que no se vea negro
        if (i === 0) renderFrame(0);
        // Cuando todas cargan, re-renderizamos el frame actual por si acaso
        if (loadedCount === FRAME_COUNT) renderFrame(frameIndexRef.current.value);
      };
      images[i] = img;
    }
    imagesRef.current = images;

    // ─── Paso 2: GSAP ScrollTrigger anima el índice de frame ───
    const ctx = gsap.context(() => {
      gsap.to(frameIndexRef.current, {
        value: FRAME_COUNT - 1, // Del frame 0 al 145
        ease: 'none',
        snap: 1, // Siempre enteros — no hay "frame 23.7"
        scrollTrigger: {
          trigger: scrollContainer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5, // Suavizado mínimo para que sea responsive pero no brusco
        },
        onUpdate: () => {
          renderFrame(Math.round(frameIndexRef.current.value));
        },
      });
    }, scrollContainerRef);

    // ─── Paso 3: Re-dibujar al redimensionar la ventana ───
    const handleResize = () => {
      renderFrame(Math.round(frameIndexRef.current.value));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  return (
    <>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-[calc(100vh-76px)] w-full flex items-center justify-center bg-coca-red overflow-hidden"
      >
        <div className="absolute inset-0 border-8 border-dashed border-coca-black/30 m-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-coca-black tracking-tight">
            TASTE THE <span className="text-white">FEELING</span>
          </h1>
          <p className="text-lg md:text-2xl text-coca-black max-w-2xl px-4 font-medium">
            [Animación de Scroll: Dos botellas girando, acercándose, chocando y destapándose con efervescencia]
          </p>
        </div>
      </section>

      {/* Interactive Tap Chapa Section */}
      <section 
        className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden cursor-pointer"
        onClick={handleChapaClick}
      >
        <video
          ref={tapChapaVideoRef}
          src={tapChapaMp4}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          onEnded={() => setIsChapaSpinning(false)}
        />

        <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-500" style={{ opacity: isChapaSpinning ? 0 : 0.4 }} />

        {/* Indicador de Click reposicionado más abajo */}
        <div className="absolute bottom-32 right-12 z-20 flex flex-col items-center animate-bounce pointer-events-none">
          <svg className="w-12 h-12 text-coca-red mb-2 drop-shadow-[0_0_8px_rgba(244,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-white font-bold text-sm uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full border border-coca-red">
            CLICKEAME
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none mt-64">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
            DESTAPA LA <span className="text-coca-red">MAGIA</span>
          </h2>
        </div>
      </section>

      {/*
        Transition Section — Canvas Frame Sequence (estilo Apple)
        ┌─ div (400vh) ← scroll container
        │   └─ div.sticky (100vh) ← se fija al viewport
        │       └─ canvas ← dibuja el frame correspondiente al progreso del scroll
        └─ [al llegar al final, el canvas muestra el último frame y la sección se libera]
      */}
      <div
        ref={scrollContainerRef}
        id="transition"
        className="relative w-full"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Pouring Section */}
      <section
        id="pouring"
        className="relative h-screen w-full flex items-center justify-center bg-coca-black"
      >
        <div className="absolute inset-0 border-8 border-dashed border-coca-red/30 m-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-coca-white tracking-tight">
            REFRESCANTE <span className="text-coca-red">HASTA LA ÚLTIMA GOTA</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl px-4 font-medium">
            [Animación de Scroll: Botella de vidrio inclinándose y sirviendo gaseosa espumante sobre hielo]
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-coca-black to-coca-red px-4"
      >
        <div className="max-w-4xl w-full bg-coca-white text-coca-black rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-coca-red tracking-tight">
            POTENCIA TU NEGOCIO
          </h2>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 font-medium">
            ¿Tienes una tienda o bodega? Contáctanos y obtén un{' '}
            <span className="font-bold text-coca-red bg-red-100 px-2 rounded">12% de descuento</span>{' '}
            en tu primera compra al por mayor.
          </p>

          <form className="flex flex-col gap-4 max-w-md mx-auto text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la Tienda</label>
              <input
                type="text"
                className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all"
                placeholder="Mi Bodega Ejemplar"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all"
                placeholder="contacto@mibodega.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all"
                placeholder="+51 987 654 321"
              />
            </div>
            <button
              type="button"
              className="mt-4 bg-coca-red hover:bg-red-700 text-white font-bold text-lg py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Solicitar Contacto y Descuento
            </button>
          </form>
        </div>
      </section>
    </>
  );
}