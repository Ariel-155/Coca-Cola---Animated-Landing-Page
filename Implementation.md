# Guía de Implementación: Coca-Cola Animated Landing Page

Este documento detalla la estructura del proyecto, las decisiones técnicas y el flujo de las secciones donde se implementarán las animaciones interactivas basadas en scroll.

## Estructura del Proyecto

Se ha definido una arquitectura de monorepo con las siguientes carpetas principales:

- `/frontend`: Contiene la aplicación principal construida con React, TypeScript y Vite.
  - `/frontend/src/assets`: Destinada para los videos y/o secuencias de imágenes generadas por IA que se usarán en las animaciones.
  - `/frontend/src/components`: Componentes reutilizables de UI (Shadcn UI, Navbar, Botones).
  - `/frontend/src/sections`: Componentes que representan cada sección específica del flujo.
- `/backend`: Carpeta preparada para la futura integración con Node.js y Prisma (para guardar contactos).

## Stack Tecnológico para Animaciones
- **GSAP (GreenSock) + ScrollTrigger**: Se utilizará como motor principal para vincular el progreso de las animaciones (o la reproducción de videos) con el scroll del usuario.
- **HTML5 `<video>` / Canvas**: Dependiendo del peso de los assets generados por IA, las animaciones se renderizarán como videos reproduciéndose por fotogramas según el scroll, o secuencias de imágenes dibujadas en un Canvas para mejor rendimiento.

---

## Flujo de Secciones y Animaciones

### 1. Hero Section (Inicio)
- **Visual**: Fondo inmersivo (probablemente en tonos rojo/negro).
- **Animación**: Dos botellas de Coca-Cola empiezan a girar. Al hacer scroll, avanzan hacia el centro de la pantalla, chocan y se destapan, liberando burbujas o partículas de efervescencia.
- **Propósito**: Captar la atención inmediata del usuario con un efecto "WOW".

### 2. Transición Original a Zero (Sección Media)
- **Visual**: Enfoque de producto (Lata).
- **Animación**: Se mostrará una lata de Coca-Cola Original (roja) en alta definición. A medida que el usuario hace scroll hacia abajo, la iluminación o la cámara girará, y la lata se transformará/reemplazará suavemente por una lata de Coca-Cola Zero (negra).
- **Propósito**: Destacar el portafolio y el contraste entre el sabor original y la opción sin azúcar, manteniendo una estética fluida y moderna.

### 3. Servido de Gaseosa (Sección Pre-CTA)
- **Visual**: Ambiente refrescante y dinámico.
- **Animación**: Una botella inclinada servirá gaseosa (con hielo) de forma fluida. El líquido acompañará el movimiento del usuario hacia el final de la página.
- **Propósito**: Generar apetito ("craveability") y preparar al usuario para la conversión (CTA).

### 4. Call to Action (CTA) - B2B Contacto
- **Visual**: Diseño limpio, profesional y claro, respetando los colores de la marca (blanco, rojo, negro).
- **Funcionalidad**: Un formulario de contacto orientado a tiendas y bodegas ("¿Quieres trabajar con nosotros?").
- **Oferta**: Texto destacando un **12% de descuento** en todos los productos para la primera compra de abastecimiento al mayoreo.
- **Implementación futura**: Conectar este formulario con la base de datos (Prisma) en el backend.

---

## Notas para el Equipo
- Los videos de IA deben exportarse preferiblemente a **30fps o 60fps constantes** para evitar saltos al hacer scrubbing con el scroll.
- Asegurarse de tener un "fallback" estático para dispositivos móviles de gama baja que puedan tener problemas reproduciendo videos por scroll.
- El diseño debe mantener una paleta de colores coherente: **Rojo Coca-Cola (#F40009), Blanco (#FFFFFF) y Negro (#000000)**.
