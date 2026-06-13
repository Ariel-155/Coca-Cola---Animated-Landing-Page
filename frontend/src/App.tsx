import React from 'react';

function App() {
  return (
    <div className="bg-coca-black min-h-screen text-coca-white font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-coca-black/80 backdrop-blur-md border-b border-coca-red/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-coca-red tracking-widest uppercase">
            Coca-Cola
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            <a href="#hero" className="hover:text-coca-red transition-colors">Inicio</a>
            <a href="#transition" className="hover:text-coca-red transition-colors">Productos</a>
            <a href="#pouring" className="hover:text-coca-red transition-colors">Experiencia</a>
            <a href="#cta" className="hover:text-coca-red transition-colors">Mayoristas</a>
          </div>
          <button className="bg-coca-red hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105">
            Únete
          </button>
        </div>
      </nav>

      {/* Hero Section - Botellas chocando */}
      <section id="hero" className="relative h-screen w-full flex items-center justify-center bg-coca-red overflow-hidden">
        {/* Placeholder for video animation */}
        <div className="absolute inset-0 border-8 border-dashed border-coca-black/30 m-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-coca-black tracking-tight">
            TASTE THE <span className="text-white">FEELING</span>
          </h1>
          <p className="text-lg md:text-2xl text-coca-black max-w-2xl px-4 font-medium">
            [Animación de Scroll: Dos botellas girando, acercándose, chocando y destapándose con efervescencia]
          </p>
        </div>
      </section>

      {/* Transition Section - Lata Normal a Lata Zero */}
      <section id="transition" className="relative h-screen w-full flex items-center justify-center bg-coca-white text-coca-black">
        <div className="absolute inset-0 border-8 border-dashed border-coca-red/30 m-8 rounded-3xl flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-coca-red tracking-tight">
            CERO AZÚCAR, <br/> MISMO SABOR
          </h2>
          <p className="text-lg md:text-2xl text-gray-700 max-w-2xl px-4 font-medium">
            [Animación de Scroll: Vista de lata Coca-Cola Original. Al scrollear, la lata gira o se transforma en Coca-Cola Zero Sugar]
          </p>
        </div>
      </section>

      {/* Pouring Section - Sirviendo Gaseosa */}
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

      {/* CTA Section - Contacto Bodegas */}
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
          <p className="text-xs text-gray-500 mt-6">
            * Promoción válida solo para nuevos clientes mayoristas. Sujeto a términos y condiciones.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-coca-black border-t border-coca-red/20 py-8 text-center text-sm text-gray-500">
        <p>&copy; 2026 Coca-Cola Company. Landing Page Project for Cibertec.</p>
      </footer>
    </div>
  );
}

export default App;
