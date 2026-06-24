
// ==========================================
// 1. CONFIGURACIÓN INICIAL Y ELEMENTOS
// ==========================================
const modal = document.getElementById("nutricion-modal");
const btnCerrar = document.getElementById("cerrar-modal");
const buscador = document.getElementById('buscador');
const btnTop = document.getElementById('btn-top');
const nav = document.querySelector('.barra-navegacion');

// ==========================================
// 2. SISTEMA DEL MODAL
// ==========================================
document.querySelectorAll('.btn-info').forEach(boton => {
    boton.addEventListener('click', function() {
        const contenedorInfo = this.closest('.producto-info');
        const bloqueDatos = contenedorInfo.querySelector(".datos-nutricionales");

        if (bloqueDatos && modal) {
            document.getElementById("modal-body").innerHTML = bloqueDatos.innerHTML;
            modal.style.display = "flex";
            document.body.style.overflow = 'hidden'; // Bloquea scroll al abrir modal
        }
    });
});

function ocultarModal() {
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Reactiva scroll
    }
}

if (btnCerrar) btnCerrar.addEventListener('click', ocultarModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) ocultarModal();
});

// ==========================================
// 3. BUSCADOR CON MENSAJE DE "SIN RESULTADOS"
// ==========================================
if (buscador) {
    buscador.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        const productos = document.querySelectorAll('.producto');
        let encontrados = 0;

        productos.forEach(producto => {
            const nombre = producto.querySelector('h2').innerText.toLowerCase();
            const esVisible = nombre.includes(filtro);
            producto.style.display = esVisible ? 'flex' : 'none';
            if (esVisible) encontrados++;
        });

        // Opcional: Si tienes un div con id="mensaje-no-resultados" en tu HTML
        const mensaje = document.getElementById('mensaje-no-resultados');
        if (mensaje) {
            mensaje.style.display = encontrados === 0 ? 'block' : 'none';
        }
    });
}

// ==========================================
// 4. NAVEGACIÓN Y EFECTOS DE SCROLL
// ==========================================

// Barra de navegación que cambia al bajar
window.addEventListener('scroll', () => {
    if (nav) {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
});

// Botón de Regresar
const btnRegresar = document.getElementById('btn-regresar');
if (btnRegresar) {
    btnRegresar.addEventListener('click', () => window.history.back());
}

// Botón Top
if (btnTop) {
    btnTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 5. EFECTO FADE-IN PARA PRODUCTOS
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.producto').forEach(prod => {
    prod.classList.add('fade-in'); // Asegúrate de tener esta clase en tu CSS
    observer.observe(prod);
});

function toggleLocationMenu() {
    const menu = document.getElementById('location-menu');
    menu.classList.toggle('show');
}