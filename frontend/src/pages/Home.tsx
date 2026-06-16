import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import videoRefresh from '../assets/video_secciones/Coca-Cola _Refresh_.mp4';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    // Forzamos pausa y posición inicial ANTES de que el navegador intente reproducir
    video.pause();
    video.currentTime = 0;

    // Bloqueamos cualquier intento de autoplay del navegador
    const preventAutoplay = () => {
      video.pause();
    };
    video.addEventListener('play', preventAutoplay);

    const initVideoScroll = () => {
      video.pause();
      video.currentTime = 0;

      // Eliminamos triggers anteriores para evitar duplicados
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=2500",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Controlamos el video SOLO con el progreso del scroll
          video.currentTime = video.duration * self.progress;
        },
        onEnter: () => video.pause(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.pause(),
        onLeaveBack: () => {
          video.pause();
          video.currentTime = 0;
        }
      });
    };

    // Esperamos a que el video tenga suficientes metadatos
    if (video.readyState >= 2) {
      initVideoScroll();
    } else {
      video.addEventListener('loadeddata', initVideoScroll);
    }

    return () => {
      video.removeEventListener('play', preventAutoplay);
      video.removeEventListener('loadeddata', initVideoScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="relative h-[calc(100vh-76px)] w-full flex items-center justify-center bg-coca-red overflow-hidden">
        <div className="absolute inset-0 border-8 border-dashed border-coca-black/30 m-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-coca-black tracking-tight">
            TASTE THE <span className="text-white">FEELING</span>
          </h1>
          <p className="text-lg md:text-2xl text-coca-black max-w-2xl px-4 font-medium">
            [Animación de Scroll: Dos botellas girando, acercándose, chocando y destapándose con efervescencia]
          </p>
        </div>
      </section>

      {/* Transition Section - Video controlado por Scroll */}
      <section
        ref={sectionRef}
        id="transition"
        className="relative h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden"
      >
        <video
          ref={videoRef}
          src={videoRefresh}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          muted
          playsInline
          preload="auto"
          autoPlay={false}        // Desactiva autoplay explícitamente
          onPlay={(e) => e.currentTarget.pause()}  // Doble seguro contra autoplay
        />

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        <div className="relative z-10 border-8 border-dashed border-white/30 w-[calc(100%-4rem)] h-[calc(100%-4rem)] m-8 rounded-3xl flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
            CERO AZÚCAR, <br /> MISMO SABOR
          </h2>
        </div>
      </section>

      {/* Pouring Section */}
      <section id="pouring" className="relative h-screen w-full flex items-center justify-center bg-coca-black">
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
      <section id="cta" className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-coca-black to-coca-red px-4">
        <div className="max-w-4xl w-full bg-coca-white text-coca-black rounded-3xl shadow-2xl p-8 md:p-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-coca-red tracking-tight">
            POTENCIA TU NEGOCIO
          </h2>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 font-medium">
            ¿Tienes una tienda o bodega? Contáctanos y obtén un <span className="font-bold text-coca-red bg-red-100 px-2 rounded">12% de descuento</span> en tu primera compra al por mayor.
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
    </>
  );
}