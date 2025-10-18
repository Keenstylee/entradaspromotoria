import { events } from './data/events.js';
import { testimonials } from './data/testimonials.js';
import { renderEvents } from './components/eventCard.js';
import { renderTestimonials } from './components/testimonialCard.js';

function initApp() {
    console.log('🎫 Web-Eventos - Inicializando aplicación...');
    
    renderEvents(events, 'events-grid');
    console.log(`✅ ${events.length} eventos cargados`);
    
    renderTestimonials(testimonials, 'testimonials-grid');
    console.log(`✅ ${testimonials.length} testimonios cargados`);
    
    initHeaderInteractions();
    initImageModal();
    
    console.log('🎉 Aplicación lista!');
}

function initHeaderInteractions() {
    const searchBtn = document.querySelector('#search-button');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('🔍 Búsqueda activada');
            // Aquí puedes implementar la lógica de búsqueda
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
            // Aquí puedes implementar la lógica de cuenta de usuario
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