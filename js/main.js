import { events } from './data/events.js';
import { testimonials } from './data/testimonials.js';
import { screens } from './data/screens.js';
import { renderEvents } from './components/eventCard.js';
import { renderTestimonials } from './components/testimonialCard.js';
import { renderCarousel } from './components/carousel.js';
import createWhoIamSection from './components/whoIam.js';

function calculateScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

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
    
    initHeaderInteractions();
    initImageModal();
    
    console.log('🎉 Aplicación lista!');
}

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export { events, testimonials };