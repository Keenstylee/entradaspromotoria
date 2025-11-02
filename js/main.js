import { events } from './data/events.js';
import { testimonials } from './data/testimonials.js';
import { screens } from './data/screens.js';
import { renderEvents } from './components/eventCard.js';
import { renderTestimonials } from './components/testimonialCard.js';
import { renderCarousel } from './components/carousel.js';
import createWhoIamSection from './components/whoIam.js';

// ===== Calcula ancho del scroll (para diseño estable) =====
function calculateScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

// ===== Inicialización general =====
function initApp() {
    console.log('🎫 Web-Eventos - Inicializando aplicación...');

    calculateScrollbarWidth();

    renderEvents(events, 'events-grid');
    console.log(`✅ ${events.length} eventos cargados`);

    renderTestimonials(testimonials, 'testimonials-grid');
    console.log(`✅ ${testimonials.length} testimonios cargados`);

    renderCarousel(screens, 'carousel-container', 'carousel-track', 'carousel-prev', 'carousel-next');
    console.log(`✅ ${screens.length} capturas de ventas cargadas en el carrusel`);

    createWhoIamSection();
    console.log('✅ Sección Quien Soy cargada');

    // HERO: fondo con flyers
    renderHeroBackgroundCarousel(events, 'hero-bg', 4000);
    console.log('✅ Hero con carrusel de fondo inicializado');

    initHeaderInteractions();
    initImageModal();
    initMobileMenu(); // 👈 Menú móvil activado

    console.log('🎉 Aplicación lista!');
}

// ===== Interacciones del header =====
function initHeaderInteractions() {
    const searchBtn = document.querySelector('#search-button');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('🔍 Búsqueda activada');
        });
    }

    const favoriteBtn = document.querySelector('#favorite-button');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            console.log('❤️ Favoritos activados');
        });
    }

    const accountBtn = document.querySelector('#account-button');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            console.log('👤 Cuenta activada');
        });
    }
}

// ===== Modal de imagen (zoom de flyers) =====
function initImageModal() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const eventsGrid = document.getElementById('events-grid');

    if (eventsGrid) {
        eventsGrid.addEventListener('click', (e) => {
            if (e.target.closest('.expand-button')) {
                const button = e.target.closest('.expand-button');
                const imageSrc = button.dataset.image;
                if (imageSrc) {
                    modalImage.src = imageSrc;
                    imageModal.classList.remove('hidden');
                }
            }
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', () => {
            imageModal.classList.add('hidden');
        });
    }
}

// ===== Menú móvil (toggle de hamburguesa) =====
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const isHidden = menu.classList.toggle('hidden'); // alterna .hidden
        const isOpen = !isHidden;
        btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú al hacer clic en un enlace (opcional pero recomendado)
    menu.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        if (!menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== HERO: carrusel de fondo con flyers de events =====
function renderHeroBackgroundCarousel(fromEvents, containerId = 'hero-bg', intervalMs = 4000) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const images = Array.from(new Set(fromEvents.map(e => e.image))).filter(Boolean);
    if (images.length === 0) return;

    // Precarga de imágenes
    images.forEach(src => { const im = new Image(); im.src = src; });

    // Crear slides de fondo
    container.innerHTML = '';
    images.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'hero-slide';
        slide.style.backgroundImage = `url('${src}')`;
        if (i === 0) slide.classList.add('active');
        container.appendChild(slide);
    });

    const slides = Array.from(container.children);
    let idx = 0;
    let paused = false;

    // Pausar si la pestaña está inactiva
    document.addEventListener('visibilitychange', () => {
        paused = document.hidden;
    });

    // Pausar si el usuario pasa el mouse sobre el hero
    const hero = document.getElementById('hero');
    if (hero) {
        hero.addEventListener('mouseenter', () => { paused = true; });
        hero.addEventListener('mouseleave', () => { paused = document.hidden ? true : false; });
    }

    function show(i) {
        slides.forEach(s => s.classList.remove('active'));
        slides[i].classList.add('active');
    }

    // Rotación automática de fondo
    setInterval(() => {
        if (paused) return;
        idx = (idx + 1) % slides.length;
        show(idx);
    }, intervalMs);
}

// ===== Inicia todo cuando el DOM está listo =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export { events, testimonials };
