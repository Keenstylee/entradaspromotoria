import { events } from './data/events.js';
import { testimonials } from './data/testimonials.js';
import { screens } from './data/screens.js';
import { renderEvents } from './components/eventCard.js';
import { renderTestimonials } from './components/testimonialCard.js';
import { renderCarousel } from './components/carousel.js';
import createWhoIamSection from './components/whoIam.js';

// ===== Util: ancho de scroll (para layout estable) =====
function calculateScrollbarWidth() {
  const scrollDiv = document.createElement('div');
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

// ===== App Init =====
function initApp() {
  console.log('🎫 Web-Eventos - Inicializando aplicación...');

  calculateScrollbarWidth();

  // Tarjetas y secciones dinámicas
  renderEvents(events, 'events-grid');
  console.log(`✅ ${events.length} eventos cargados`);

  renderTestimonials(testimonials, 'testimonials-grid');
  console.log(`✅ ${testimonials.length} testimonios cargados`);

  renderCarousel(screens, 'carousel-container', 'carousel-track', 'carousel-prev', 'carousel-next');
  console.log(`✅ ${screens.length} capturas de ventas cargadas en el carrusel`);

  createWhoIamSection();
  console.log('✅ Sección Quien Soy cargada');

  // HERO: fondo carrusel con flyers
  renderHeroBackgroundCarousel(events, 'hero-bg', 4000);
  console.log('✅ Hero con carrusel de fondo inicializado');

  // Interacciones
  initHeaderInteractions();
  initImageModal();
  initMobileMenu();

  console.log('🎉 Aplicación lista!');
}

// ===== Interacciones header (placeholders seguros) =====
function initHeaderInteractions() {
  const searchBtn = document.querySelector('#search-button');
  if (searchBtn) searchBtn.addEventListener('click', () => console.log('🔍 Búsqueda activada'));

  const favoriteBtn = document.querySelector('#favorite-button');
  if (favoriteBtn) favoriteBtn.addEventListener('click', () => console.log('❤️ Favoritos activados'));

  const accountBtn = document.querySelector('#account-button');
  if (accountBtn) accountBtn.addEventListener('click', () => console.log('👤 Cuenta activada'));
}

// ===== Modal de imagen (zoom de flyers) =====
function initImageModal() {
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const eventsGrid = document.getElementById('events-grid');

  if (eventsGrid && imageModal && modalImage) {
    eventsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.expand-button');
      if (!btn) return;
      const imageSrc = btn.dataset.image;
      if (!imageSrc) return;
      modalImage.src = imageSrc;
      imageModal.classList.remove('hidden');
    });

    imageModal.addEventListener('click', () => {
      imageModal.classList.add('hidden');
      modalImage.src = '';
    });
  }
}

// ===== Menú móvil =====
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isHidden));
  });

  // Cierra al hacer click en cualquier link del menú
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (!menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== HERO: carrusel de fondo con flyers =====
function renderHeroBackgroundCarousel(fromEvents, containerId = 'hero-bg', intervalMs = 4000) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const images = Array.from(new Set(fromEvents.map(e => e.image))).filter(Boolean);
  if (images.length === 0) return;

  // Precarga
  images.forEach(src => { const im = new Image(); im.src = src; });

  // Slides
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

  function show(i) {
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
  }

  // Pausa si cambia visibilidad de pestaña
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  // Pausa si el usuario pasa el mouse por el hero
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => { paused = true; });
    hero.addEventListener('mouseleave', () => { paused = document.hidden ? true : false; });
  }

  // Rotación automática
  setInterval(() => {
    if (paused) return;
    idx = (idx + 1) % slides.length;
    show(idx);
  }, intervalMs);
}

// ===== DOM Ready =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { events, testimonials };
