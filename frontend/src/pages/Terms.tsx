import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-coca-black text-coca-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-[#111] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-coca-red mb-8 tracking-tight">Términos y Condiciones</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500 italic">Última actualización: Junio de 2026</p>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Naturaleza del Proyecto</h2>
            <p>
              Este sitio web es un <strong>TRABAJO PRÁCTICO OPEN-SOURCE</strong> desarrollado exclusivamente con fines educativos y de demostración tecnológica (Landing Page Project for Cibertec).
              <strong> NO TENEMOS NINGUNA AFILIACIÓN, PATROCINIO NI RELACIÓN COMERCIAL CON THE COCA-COLA COMPANY.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Uso de Marcas y Materiales</h2>
            <p>
              Todos los logotipos, marcas registradas, nombres de productos, y material visual relacionado con "Coca-Cola" utilizados en este sitio son propiedad exclusiva de The Coca-Cola Company. Su uso en este proyecto se realiza bajo el concepto de uso justo ("fair use") con fines académicos y de diseño de interfaz de usuario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Registro de Cuentas y Datos</h2>
            <p>
              Al registrarse en este sitio (panel de socios mayoristas ficticio), usted comprende que es un entorno de pruebas. No ingrese contraseñas reales ni información financiera verdadera. La funcionalidad de creación de cuenta y autenticación se provee únicamente como demostración del sistema informático construido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Limitación de Responsabilidad</h2>
            <p>
              Los desarrolladores de este proyecto open-source no asumen ninguna responsabilidad por el uso de la plataforma, caídas del servicio, pérdida de información ficticia, o cualquier interpretación errónea sobre la validez de las promociones aquí mostradas, las cuales son completamente inexistentes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
