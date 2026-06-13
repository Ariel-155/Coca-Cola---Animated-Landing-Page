Este documento contiene las reglas técnicas obligatorias para el manejo de assets de IA y la generación de código. Léelo antes de empezar a programar o generar videos.

📂 Estructura de Carpetas Obligatoria
Para que la IA de programación sepa exactamente dónde está cada asset y componente, mantengamos este orden estricto dentro de /frontend/src:

Plaintext
src/
├── assets/
│   └── videos/
│       ├── hero-coca.mp4          <-- Video de la sección 1 (Choque de botellas)
│       ├── transition-zero.mp4    <-- Video de la sección 2 (Original a Zero)
│       └── pour-coca.mp4          <-- Video de la sección 3 (Servido con hielo)
├── components/
│   └── ui/                        <-- Componentes de Shadcn UI
├── sections/
│   ├── Hero.tsx                   <-- Consume hero-coca.mp4 con GSAP
│   ├── Transition.tsx             <-- Consume transition-zero.mp4 con GSAP
│   ├── Pour.tsx                   <-- Consume pour-coca.mp4 con GSAP
│   └── Contact.tsx                <-- Formulario B2B (Oferta 12% desc.)
├── App.tsx
└── main.tsx
🎬 Reglas de Oro para los Videos de IA (Higgsfield / Luma)
Para que el scroll con GSAP vaya fluido y no consuma toda la RAM del navegador, cada video que generemos debe cumplir con esto:

Duración: Máximo 3 a 5 segundos por video. Esos segundos se estirarán a lo largo del scroll de su respectiva sección.

Peso: Cada archivo .mp4 debe pesar menos de 10MB. Si pesa más, pásalo por un compresor web (como Handbrake o Convertio) usando el códec H.264.

Framerate: Exportar estrictamente a 30fps o 60fps constantes. Si el framerate es variable, el scroll dará saltos feos.

🤖 ¿Cómo pedirle el código a la IA? (Prompt Base)
Cuando le pidan a la IA que programe un componente de scroll, usen este prompt base para que no intente usar librerías incorrectas:

"Estoy usando React, TypeScript, Vite y Tailwind CSS. Necesito crear un componente que reproduzca un video local (.mp4) frame por frame sincronizado con el scroll del usuario usando GSAP y ScrollTrigger. El video debe avanzar cuando bajo y retroceder cuando subo. Asegúrate de limpiar los listeners de GSAP en el desmontaje del componente con gsap.context() y añade un contenedor de scroll con la altura suficiente para que la animación se note."