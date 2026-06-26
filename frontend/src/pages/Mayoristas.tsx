import React, { useState, useEffect, useRef, useId } from 'react';
import { Link } from 'react-router-dom';
import imgMayoristas from '../assets/coca_cola_mayoristas.png';
import imgComunidad from '../assets/coca_cola_comunidad.png';
import logo from '../assets/logo2.png';

import imgPromoPack from '../assets/promo_pack.png';
import imgPromoCombo from '../assets/promo_combo.png';
import imgPromoCooler from '../assets/promo_cooler.png';
import imgPromoPoints from '../assets/promo_points.png';

// --- SVGs DE REFERENCIA (FONDOS) ---
const StarSilhouette = ({ fill }: { fill: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={fill}>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const BallSilhouette = ({ fill }: { fill: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const BoxSilhouette = ({ fill }: { fill: string }) => (
  <svg width="30" height="24" viewBox="0 0 30 24" fill={fill}>
    <path d="M2 4h26v16H2V4zm2 2v12h22V6H4zm4 2h14v2H8V8zm0 4h10v2H8v-2z" />
  </svg>
);

const PopcornSVG = () => (
  <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_15px_30px_rgba(244,0,9,0.9)]">
    <path d="M5 9h14l-2 13H7L5 9z" fill="#F40009" stroke="#FFF" strokeWidth="0.5"/>
    <path d="M8 9v13M12 9v13M16 9v13" stroke="#FFF" strokeWidth="1" strokeDasharray="3 3"/>
    <path d="M4 9c0-3 2-4 4-4s3 2 4 2 2-2 4-2 4 1 4 4" fill="#FFF" />
    <circle cx="8" cy="4" r="2.5" fill="#FFF" />
    <circle cx="16" cy="4" r="2.5" fill="#FFF" />
    <circle cx="12" cy="2" r="3" fill="#FFF" />
  </svg>
);

const CokeCupSVG = () => (
  <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="filter drop-shadow-[0_15px_30px_rgba(244,0,9,0.9)]">
    <path d="M6 7h12l-1.5 15h-9L6 7z" fill="#F40009" stroke="#FFF" strokeWidth="0.5"/>
    <path d="M5 5h14v2H5z" fill="#FFF"/>
    <path d="M12 5V1l2-1" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 12c1.5 0 2.5 1 4 1s2.5-1 4-1" stroke="#FFF" strokeWidth="1"/>
    <path d="M9 16c1 0 2 .5 3 .5s2-.5 3-.5" stroke="#FFF" strokeWidth="1"/>
  </svg>
);

const SectionBackground = ({ patternFill, opacity }: { patternFill: string, opacity: number }) => {
  const patternId = useId();
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity }}>
      <svg className="w-full h-full">
        <defs>
          <pattern id={patternId} x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
            <g transform="translate(20, 20) rotate(15) scale(1.5)"><StarSilhouette fill={patternFill} /></g>
            <g transform="translate(100, 50) rotate(-15) scale(1.5)"><BallSilhouette fill={patternFill} /></g>
            <g transform="translate(50, 100) rotate(45) scale(1.2)"><BoxSilhouette fill={patternFill} /></g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

// --- BANDERAS SVG ---
const flags = [
  { country: 'Perú', colors: ['#D91023','#FFF','#D91023'], dir: 'col' },
  { country: 'México', colors: ['#006847','#FFF','#CE1126'], dir: 'col' },
  { country: 'Argentina', colors: ['#74ACDF','#FFF','#74ACDF'], dir: 'row' },
  { country: 'Colombia', colors: ['#FCD116','#003893','#CE1126'], dir: 'row' },
  { country: 'Alemania', colors: ['#000','#DD0000','#FFCE00'], dir: 'row' },
  { country: 'Francia', colors: ['#002395','#FFF','#ED2939'], dir: 'col' },
  { country: 'Italia', colors: ['#009246','#FFF','#CE2B37'], dir: 'col' },
  { country: 'España', colors: ['#AA151B','#F1BF00','#AA151B'], dir: 'row' },
  { country: 'Bélgica', colors: ['#000','#FDDA24','#EF3340'], dir: 'col' },
  { country: 'Países Bajos', colors: ['#AE1C28','#FFF','#21468B'], dir: 'row' },
  { country: 'Irlanda', colors: ['#169B62','#FFF','#FF883E'], dir: 'col' },
  { country: 'Austria', colors: ['#ED2939','#FFF','#ED2939'], dir: 'row' },
  { country: 'Bolivia', colors: ['#D52B1E','#F9E500','#007A33'], dir: 'row' },
  { country: 'Paraguay', colors: ['#D52B1E','#FFF','#0038A8'], dir: 'row' },
  { country: 'Nigeria', colors: ['#008751','#FFF','#008751'], dir: 'col' },
  { country: 'Egipto', colors: ['#CE1126','#FFF','#000'], dir: 'row' },
];

const FlagCard = ({ country, colors, dir }: { country: string, colors: string[], dir: string }) => (
  <div className="flex-shrink-0 flex flex-col items-center gap-2">
    <div className={`w-20 h-14 rounded-lg overflow-hidden shadow-lg border border-white/20 flex ${dir === 'row' ? 'flex-col' : 'flex-row'}`}>
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
    <span className="text-white/70 text-xs font-bold tracking-wider uppercase">{country}</span>
  </div>
);

// --- SECCIÓN ANIMADA STICKY: MUNDIAL (EL BALÓN RODANDO) ---
const WorldCupSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;
      if (scrollableDistance <= 0) return;
      let p = -rect.top / scrollableDistance;
      p = Math.max(0, Math.min(p, 1));
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Físicas del Balón calculadas a través del scroll progress (0 a 1)
  const x = progress * 130 - 15; // Inicia en -15vw y termina en 115vw
  
  // Rebotes (Y axis)
  let heightOffset;
  if (progress < 0.2) {
    const p = progress / 0.2;
    heightOffset = (1 - p * p) * 50; // Caída libre
  } else if (progress < 0.4) {
    const p = (progress - 0.2) / 0.2;
    heightOffset = Math.sin(p * Math.PI) * 25; // Primer rebote
  } else if (progress < 0.55) {
    const p = (progress - 0.4) / 0.15;
    heightOffset = Math.sin(p * Math.PI) * 12; // Segundo rebote
  } else if (progress < 0.65) {
    const p = (progress - 0.55) / 0.1;
    heightOffset = Math.sin(p * Math.PI) * 4; // Tercer rebote
  } else {
    heightOffset = 0; // Rueda en el pasto
  }

  const rotation = progress * 1800;

  return (
    <div ref={containerRef} className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-gradient-to-b from-[#1a0000] via-[#8B0000] to-[#0a1a0a]">
        
        {/* Cabecera del Mundial Estática */}
        <div className="absolute top-[12vh] md:top-[18vh] w-full z-10 px-4">
          {/* Vaso de Gaseosa (Izquierda absoluta) */}
          <div className="absolute left-8 lg:left-32 top-10 md:top-16 animate-[bounce_3s_ease-in-out_infinite] hidden md:block">
            <CokeCupSVG />
          </div>

          {/* Palomitas (Derecha absoluta) */}
          <div className="absolute right-8 lg:right-32 top-10 md:top-16 animate-[bounce_4s_ease-in-out_infinite] hidden md:block">
            <PopcornSVG />
          </div>

          <div className="text-center w-full max-w-5xl mx-auto">
            <h2 className="text-6xl md:text-[8rem] font-black tracking-normal leading-none mb-4 uppercase drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] text-[#FFDF00]">
              FIFA WORLD CUP<br/>
              <span className="text-white text-5xl md:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                2026!
              </span>
            </h2>
            <p className="text-xl md:text-3xl text-red-100 font-extrabold tracking-widest uppercase mt-4 drop-shadow-[0_4px_6px_rgba(0,0,0,1)]">
              OFERTAS POSIBLES POR EL MUNDIAL
            </p>
          </div>
        </div>

        {/* Cancha de Fútbol (Grass) */}
        <div className="absolute bottom-0 w-full h-[25vh] bg-gradient-to-t from-green-900 to-green-600 border-t-8 border-green-400 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
           <div className="absolute inset-0 opacity-30" style={{
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.4) 100px, rgba(255,255,255,0.4) 105px)'
           }}></div>
           <div className="absolute top-1/2 left-0 w-full h-1 bg-white/40 shadow-[0_0_10px_#FFF]"></div>
        </div>

        {/* El Balón */}
        <div 
          className="absolute z-20 pointer-events-none"
          style={{
            top: `calc(75vh - 15vh - ${heightOffset}vh)`,
            left: `${x}vw`,
            transform: `rotate(${rotation}deg)`,
            width: '15vh',
            height: '15vh',
            filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.7)) drop-shadow(0 0 20px rgba(244,0,9,0.4))',
            transition: 'none'
          }}
        >
          <svg viewBox="0 0 122.88 122.88" className="w-full h-full">
            <circle cx="61.44" cy="61.44" r="59" fill="#FFFFFF" />
            <path d="M61.44,0c16.97,0,32.33,6.88,43.44,18c11.12,11.12,18,26.48,18,43.44c0,16.97-6.88,32.33-18,43.44 c-11.12,11.12-26.48,18-43.44,18S29.11,116,18,104.88C6.88,93.77,0,78.41,0,61.44C0,44.47,6.88,29.11,18,18 C29.11,6.88,44.47,0,61.44,0L61.44,0z M76.85,117.08L76.73,117l6.89-23.09L69.41,78.15L52.66,78L39.38,94.62l6.66,22.32l-0.15,0.1 c4.95,1.38,10.16,2.12,15.55,2.12C66.78,119.16,71.95,118.44,76.85,117.08L76.85,117.08z M12.22,91.61l24.34,0.12L49.28,75.8 l-5.26-16.12l-21.42-9.3L3.78,64.08C4.23,74.14,7.26,83.53,12.22,91.61L12.22,91.61z M16.77,24.88l7.4,22.14l19.98,8.68 l15.44-11.97V20.94L40.51,7.63c-7.52,2.93-14.28,7.39-19.89,13C19.27,21.98,17.98,23.4,16.77,24.88L16.77,24.88z M81.7,7.37 L63.3,20.77V43.7L77.8,54.91l20.81-8.92l7.18-21.49c-1.12-1.35-2.3-2.64-3.54-3.88C96.48,14.85,89.49,10.29,81.7,7.37L81.7,7.37z M119.09,64.36l-0.02,0.01L99.09,49.82l-19.81,8.49l-6.08,18.03l13.73,15.23c0.06,0.06,0.09,0.13,0.11,0.21l23.6-0.11 C115.56,83.65,118.59,74.34,119.09,64.36L119.09,64.36z" fill="#F40009"/>
          </svg>
        </div>

      </div>
    </div>
  );
};

// --- CARRUSEL DE BANDERAS SEPARADO ---
const FlagsCarousel = () => (
  <section className="relative w-full bg-gradient-to-r from-[#5a0000] via-[#8B0000] to-[#5a0000] py-16 border-y-4 border-white/10 overflow-hidden z-40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(244,0,9,0.3)]">
    <SectionBackground patternFill="#ffffff" opacity={0.05} />
    
    <div className="relative z-10 w-full flex flex-col items-center">
      <h3 className="flex flex-col md:flex-row items-center gap-4 text-3xl md:text-5xl font-black text-white mb-16 tracking-widest uppercase text-center drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
        <span>¡ENCUENTRA</span>
        <img src={logo} alt="Coca-Cola" className="h-12 md:h-16 object-contain -mt-2 filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]" />
        <span>EN TU PAÍS!</span>
      </h3>
      
      {/* Carrusel Seamless (Dos sets idénticos moviéndose) */}
      <div className="w-full overflow-hidden flex justify-start">
        <div className="flex animate-[marquee_20s_linear_infinite] w-max">
          <div className="flex gap-8 px-4">
            {flags.map((flag, idx) => (
              <React.Fragment key={idx}>
                <FlagCard country={flag.country} colors={flag.colors} dir={flag.dir} />
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-8 px-4">
            {flags.map((flag, idx) => (
              <React.Fragment key={idx}>
                <FlagCard country={flag.country} colors={flag.colors} dir={flag.dir} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- DATA ---
const promos = [
  { id: 1, title: 'Pack Mundialista', desc: 'Lleva 5 cajas de Coca-Cola Original y obtén merchandising oficial del mundial para tu tienda.', discount: '15%', image: imgPromoPack },
  { id: 2, title: 'Combo Refrescante', desc: 'Mix de Coca-Cola Zero y Original. Ideal para el verano y las previas de los partidos.', discount: '20%', image: imgPromoCombo },
  { id: 3, title: 'Equipa tu Bodega', desc: 'En pedidos mayores a 10 cajas, llévate un cooler exhibidor iluminado gratis.', discount: 'GRATIS', image: imgPromoCooler },
  { id: 4, title: 'Doble Puntaje', desc: 'Acumula doble puntaje en el programa de socios por cada pedido realizado durante el mundial.', discount: 'X2', image: imgPromoPoints },
];

const testimonials = [
  { quote: "Las promociones de Coca-Cola aumentaron mis ventas un 40% durante los partidos. ¡Mis clientes siempre buscan su botella bien fría!", author: "María Fernández", store: "Minimarket El Sol" },
  { quote: "El equipo de logística siempre llega a tiempo. El descuento mayorista me ha permitido expandir mi negocio más rápido.", author: "Carlos Ruiz", store: "Bodega La Esquina" },
  { quote: "Recibí mi cooler exhibidor y ha sido un éxito total. La marca vende por sí sola.", author: "Ana Torres", store: "Comercial Torres" }
];

export interface Promo {
  id: number;
  title: string;
  desc: string;
  discount: string;
  image: string;
}

export default function Mayoristas() {
  const [activeModal, setActiveModal] = useState<Promo | null>(null);

  return (
    <div className="relative w-full bg-coca-black">
      
      {/* --- HERO MAYORISTAS --- */}
      <section className="relative min-h-[calc(100vh-76px)] flex items-center py-20 px-4 bg-coca-white overflow-hidden">
        <SectionBackground patternFill="#F40009" opacity={0.05} />
        
        <div className="relative z-20 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(244,0,9,0.3)] group border-4 border-white">
            <img 
              src={imgMayoristas} 
              alt="Coca Cola para Mayoristas" 
              className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-r from-coca-red to-red-800 text-white p-8 transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
              <p className="font-black text-2xl mb-1">Distribución Global</p>
              <p className="text-base text-red-100 font-medium">Llegamos a tu negocio, siempre a tiempo.</p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="neon-orbit-label mb-6 w-max">
              <span className="neon-orbit-label-inner">Socios Comerciales B2B</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-coca-black tracking-tighter leading-[0.9]">
              CRECEMOS <br /> <span className="text-coca-red">CONTIGO</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-medium leading-relaxed">
              Únete a nuestra red de socios. Como mayorista oficial, disfrutarás de promociones exclusivas, atención personalizada y equipamiento para tu local.
            </p>
            <Link to="/#cta" className="bg-coca-black hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] w-full md:w-auto text-center border-b-4 border-gray-900 active:border-b-0 active:translate-y-0 inline-block">
              Afíliate Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN STICKY SCROLL ANIMATION: EL BALÓN MUNDIAL --- */}
      <WorldCupSection />

      {/* --- SECCIÓN PROMOCIONES (MUNDIAL) --- */}
      <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-coca-black to-[#3a0000] overflow-hidden flex flex-col justify-center">
        <SectionBackground patternFill="#F40009" opacity={0.15} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-md">
              Fiebre Mundialista
            </h2>
            <p className="text-xl text-red-100 mt-4 max-w-2xl mx-auto font-medium">
              Aprovecha nuestras ofertas de temporada para que tu negocio esté listo para los partidos.
            </p>
          </div>

          {/* Scroll hint for mobile */}
          <p className="text-center text-red-200/60 text-sm font-medium tracking-widest uppercase mb-4 md:hidden animate-pulse">
            ← Desliza para ver más →
          </p>

          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible gap-5 pt-2 pb-10 snap-x snap-mandatory scroll-smooth">
            {promos.map(promo => (
              <div 
                key={promo.id} 
                className="w-[78vw] sm:w-[55vw] md:w-auto md:min-h-[420px] bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(244,0,9,0.3)] snap-center cursor-pointer transform transition-transform hover:-translate-y-2 relative overflow-hidden group border border-white flex flex-col flex-shrink-0 md:flex-shrink"
                onClick={() => setActiveModal(promo)}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 w-[200%] -translate-x-[150%] group-hover:translate-x-[50%] skew-x-12 ease-in-out"></div>
                
                <h3 className="text-5xl font-black text-coca-red mb-2">{promo.discount}</h3>
                <h4 className="text-xl font-bold text-coca-black mb-3 uppercase leading-tight">{promo.title}</h4>
                <p className="text-gray-600 font-medium mb-6 text-sm leading-relaxed">{promo.desc}</p>
                <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-4">
                  <span className="text-coca-red font-bold text-sm tracking-widest uppercase">Ver Detalles</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F40009" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN BANDERAS --- */}
      <FlagsCarousel />

      {/* --- SECCIÓN TESTIMONIOS Y TIENDAS --- */}
      <section className="relative min-h-screen py-24 px-4 bg-gradient-to-b from-[#3a0000] to-coca-black overflow-hidden flex flex-col justify-center">
        <SectionBackground patternFill="#111111" opacity={0.4} />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight drop-shadow-lg">
              Historias de Éxito
            </h2>
            <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto font-medium">
              Bodegueros y dueños de tiendas ya disfrutan de los beneficios de ser socios de Coca-Cola.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div key={idx} className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-coca-red/50 transition-colors">
                <div className="absolute top-4 left-4 text-coca-red opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <div className="relative z-10 pt-10">
                  <p className="text-lg text-gray-300 font-medium italic mb-8 leading-relaxed">"{testi.quote}"</p>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white font-bold text-lg">{testi.author}</p>
                    <p className="text-coca-red font-medium text-sm">{testi.store}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
             <div className="relative w-full max-w-4xl h-80 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(244,0,9,0.3)] border border-white/10 group cursor-pointer">
                <img src={imgComunidad} alt="Nuestra Comunidad" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <h3 className="text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-[0_5px_10px_rgba(0,0,0,1)] text-center px-4">
                      SE PARTE DE NUESTRA COMUNIDAD
                   </h3>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Modal Brilloso Interactivo (Ofertas) */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300" onClick={() => setActiveModal(null)}></div>
          
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-coca-red rounded-3xl max-w-lg w-full p-10 shadow-[0_0_100px_rgba(244,0,9,0.6)] z-10 overflow-hidden animate-fade-in-up transform transition-all duration-500 scale-100">
            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] animate-[shine_3s_infinite]" />

            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-coca-red p-2 rounded-full z-20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-white/20 mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative group">
                <img src={activeModal.image} alt={activeModal.title} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                  <div className="inline-block bg-coca-red text-white font-black text-4xl px-8 py-2 rounded-2xl shadow-[0_0_15px_rgba(244,0,9,0.8)] border border-red-500/50 backdrop-blur-md">
                    {activeModal.discount}
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase">{activeModal.title}</h3>
              <p className="text-lg text-gray-300 leading-relaxed font-light mb-10">
                {activeModal.desc}
              </p>
              <p className="text-sm text-red-300 mb-6 font-bold">*Válido solo para clientes registrados durante el mes del Mundial.</p>
              
              <button className="bg-white text-coca-red px-10 py-4 rounded-full font-black text-lg hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all w-full">
                Solicitar Promoción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes text-shine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

    </div>
  );
}
