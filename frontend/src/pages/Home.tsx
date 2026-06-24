import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import tapChapaMp4 from '../assets/video_secciones/Tap_Chapa.mp4';
import calles from '../assets/calles/calle11sma.png';
import calles2 from '../assets/calles/calle2sma.png';

const FRAME_COUNT = 134; // 0.webp → 133.webp
const FRAME_PATH = '/frames/coca-zero/';

const FRAME_START2 = 70;
const FRAME_END2 = 129;
const FRAME_COUNT2 = FRAME_END2 - FRAME_START2 + 1; // 60 frames
const FRAME_PREFIX2 = '/frames2/video-coca-cola_';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });
  const tapChapaVideoRef = useRef<HTMLVideoElement>(null);

  // ── Hero canvas refs ──
  const heroScrollContainerRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroImagesRef = useRef<HTMLImageElement[]>([]);
  const heroFrameIndexRef = useRef({ value: 0 });

  const pouringSectionRef = useRef<HTMLDivElement>(null);
  const beforeImgContainerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [isChapaSpinning, setIsChapaSpinning] = useState(false);

  const handleChapaClick = () => {
    if (!tapChapaVideoRef.current || isChapaSpinning) return;
    setIsChapaSpinning(true);
    tapChapaVideoRef.current.playbackRate = 2.0;
    tapChapaVideoRef.current.currentTime = 0;
    tapChapaVideoRef.current.play();
  };

  // ── Render helper (reutilizable para cualquier canvas) ──
  const renderFrameOnCanvas = useCallback(
    (
      canvas: HTMLCanvasElement | null,
      images: HTMLImageElement[],
      index: number
    ) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const safeIndex = Math.max(0, Math.min(index, images.length - 1));
      const img = images[safeIndex];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      }

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = w / h;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        if (imgRatio > canvasRatio) {
          drawW = w;
          drawH = w / imgRatio;
          drawX = 0;
          drawY = (h - drawH) / 2;
        } else {
          drawH = h;
          drawW = h * imgRatio;
          drawX = (w - drawW) / 2;
          drawY = 0;
        }
      } else {
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
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    []
  );

  // Wrappers individuales para mantener compatibilidad
  const renderFrame = useCallback(
    (index: number) => {
      renderFrameOnCanvas(canvasRef.current, imagesRef.current, index);
    },
    [renderFrameOnCanvas]
  );

  const renderHeroFrame = useCallback(
    (index: number) => {
      renderFrameOnCanvas(heroCanvasRef.current, heroImagesRef.current, index);
    },
    [renderFrameOnCanvas]
  );

  useEffect(() => {
    // ── Precargar frames del canvas principal (transition) ──
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${i}.webp`;
      img.onload = () => {
        loadedCount++;
        if (i === 0) renderFrame(0);
        if (loadedCount === FRAME_COUNT) renderFrame(frameIndexRef.current.value);
      };
      images[i] = img;
    }
    imagesRef.current = images;

    // ── Precargar frames del hero (/frames2) ──
    const heroImages: HTMLImageElement[] = [];
    let heroLoadedCount = 0;

    for (let i = 0; i < FRAME_COUNT2; i++) {
      const img = new Image();
      const frameNum = String(FRAME_START2 + i).padStart(3, '0');
      img.src = `${FRAME_PREFIX2}${frameNum}.webp`;
      img.onload = () => {
        heroLoadedCount++;
        if (i === 0) renderHeroFrame(0);
        if (heroLoadedCount === FRAME_COUNT2) renderHeroFrame(heroFrameIndexRef.current.value);
      };
      heroImages[i] = img;
    }
    heroImagesRef.current = heroImages;

    const ctx = gsap.context(() => {

      // ── Animación canvas hero (frames2) ──
      gsap.to(heroFrameIndexRef.current, {
        value: FRAME_COUNT2 - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroScrollContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: () => {
          renderHeroFrame(Math.round(heroFrameIndexRef.current.value));
        },
      });

      // ── Animación canvas transition (frames originales) ──
      gsap.to(frameIndexRef.current, {
        value: FRAME_COUNT - 1,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
        onUpdate: () => {
          renderFrame(Math.round(frameIndexRef.current.value));
        },
      });

      // ── Slider de calles ──
      const pouringEl = pouringSectionRef.current;
      const beforeEl = beforeImgContainerRef.current;
      const handleEl = handleRef.current;

      if (pouringEl && beforeEl && handleEl) {
        gsap.set(handleEl, { left: '0%' });
        gsap.set(beforeEl, { clipPath: 'inset(0% 100% 0% 0%)' });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pouringEl,
            start: 'top top',
            end: '+=1500',
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
          }
        });

        tl.to(handleEl, { left: '100%', ease: 'none' }, 0);
        tl.to(beforeEl, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0);
      }

    }, mainRef);

    const handleResize = () => {
      renderFrame(Math.round(frameIndexRef.current.value));
      renderHeroFrame(Math.round(heroFrameIndexRef.current.value));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame, renderHeroFrame]);

  return (
    <div ref={mainRef}>
      {/* Hero Section — Canvas Frame Sequence con /frames2 */}
      <div
        ref={heroScrollContainerRef}
        id="hero"
        className="relative w-full"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <canvas ref={heroCanvasRef} className="w-full h-full" />
        </div>
      </div>

      {/* Interactive Tap Chapa Section */}
      <section
        className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden cursor-pointer"
        onClick={handleChapaClick}
      >
        <video
          ref={tapChapaVideoRef}
          src={tapChapaMp4}
          className="absolute inset-0 w-full h-full max-md:object-contain md:object-cover"
          muted
          playsInline
          onEnded={() => setIsChapaSpinning(false)}
        />
        <div
          className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-500"
          style={{ opacity: isChapaSpinning ? 0 : 0.4 }}
        />
        <div className="absolute bottom-32 right-12 z-20 flex flex-col items-center animate-bounce pointer-events-none">
          <svg className="w-12 h-12 text-coca-red mb-2 drop-shadow-[0_0_8px_rgba(244,0,0,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Transition Section — Canvas Frame Sequence (coca-zero) */}
      <div
        ref={scrollContainerRef}
        id="transition"
        className="relative w-full"
        style={{ height: '400vh' }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      {/* Pouring Section — Slider de Calles */}
      <section
        ref={pouringSectionRef}
        id="pouring"
        className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center"
      >
        <div className="relative w-full h-full overflow-hidden shadow-2xl select-none">
          <img
            src={calles2}
            alt="Calle Barranco Limpia"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div
            ref={beforeImgContainerRef}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
          >
            <img
              src={calles}
              alt="Calle Barranco Coca Cola"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div
            ref={handleRef}
            className="absolute top-0 bottom-0 w-1 bg-white z-20 flex items-center justify-center drop-shadow-xl"
            style={{ left: '0%' }}
          >
            <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 border-gray-100 pointer-events-none" />
          </div>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none text-center p-4">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            Transformando <br />
            <span className="text-coca-red">Espacios</span>
          </h2>
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
              <input type="text" className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all" placeholder="Mi Bodega Ejemplar" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all" placeholder="contacto@mibodega.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
              <input type="tel" className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coca-red focus:border-transparent transition-all" placeholder="+51 987 654 321" />
            </div>
            <button type="button" className="mt-4 bg-coca-red hover:bg-red-700 text-white font-bold text-lg py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Solicitar Contacto y Descuento
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}