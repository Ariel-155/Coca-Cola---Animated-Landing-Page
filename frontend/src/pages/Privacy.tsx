import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-coca-black text-coca-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-[#111] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-black text-coca-red mb-8 tracking-tight">Aviso de Privacidad</h1>
        
        <div className="space-y-6 text-gray-300 leading-relaxed">
          <p className="text-sm text-gray-500 italic">Última actualización: Junio de 2026</p>

          <div className="bg-red-950/30 border border-coca-red/30 p-4 rounded-xl text-red-200 text-sm mb-6">
            <strong>IMPORTANTE:</strong> Este es un <strong>TRABAJO PRÁCTICO OPEN-SOURCE</strong>. No tenemos ninguna afiliación con Coca-Cola. Por favor, no ingrese datos personales reales o sensibles.
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Recopilación de Información</h2>
            <p>
              Dado el propósito académico de esta aplicación web, recopilamos la mínima cantidad de datos necesarios para demostrar el funcionamiento de la autenticación de usuarios. Esto incluye: nombre de usuario, dirección de correo electrónico, y de forma opcional (en el panel ficticio): nombre de tienda, dirección y teléfono.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Uso de la Información</h2>
            <p>
              La información suministrada se almacena en una base de datos de desarrollo (SQLite local o similar provisto para el entorno). Se utiliza exclusivamente para simular un proceso de login, actualización de perfil de usuario y recuperación de sesión. No se venderá, compartirá ni usará con fines de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. Autenticación con Google</h2>
            <p>
              Nuestra plataforma puede ofrecer el inicio de sesión a través de Google. Al utilizar este método, Google nos proporciona su correo electrónico, nombre e imagen de perfil. No tenemos acceso a ninguna otra información de su cuenta de Google.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Eliminación de Datos</h2>
            <p>
              Dado que se trata de un entorno de pruebas, la base de datos es reiniciada periódicamente. Cualquier información introducida podría ser eliminada sin previo aviso. Si usted es un revisor del proyecto y desea que sus datos de prueba sean eliminados manualmente, por favor, evite colocar información real.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
