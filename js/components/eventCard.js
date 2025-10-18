import { events } from '../data/events.js';

export function createEventCard(event) {
    return `
        <div class="group flex flex-col overflow-hidden rounded-lg bg-white/5 dark:bg-white/5 shadow-lg hover:shadow-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div class="image-container">
                <img 
                    alt="${event.title}" 
                    class="w-full h-48 object-cover object-top"
                    src="${event.image}" 
                    loading="lazy"
                />
                <button class="expand-button" data-image="${event.image}">
                    <span class="material-symbols-outlined">expand_content</span>
                </button>
            </div>
            <div class="p-4 flex flex-col flex-grow bg-background-light dark:bg-background-dark">
                <h3 class="text-lg font-bold text-black dark:text-white mb-2">
                    ${event.title}
                </h3>
                <p class="text-sm text-black/60 dark:text-white/60 mb-2">${event.description}</p>
                <p class="text-sm text-black/60 dark:text-white/60 flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-base">calendar_today</span>
                    ${event.date}
                </p>
                <p class="text-sm text-black/60 dark:text-white/60 flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-base">location_on</span>
                    ${event.location}
                </p>
                <button 
                    class="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors"
                    data-event-id="${event.id}"
                >
                    <span class="truncate">Ver Detalles</span>
                </button>
            </div>
        </div>
    `;
}

export function renderEvents(events, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    container.innerHTML = '';

    events.forEach(event => {
        container.innerHTML += createEventCard(event);
    });
    
    attachEventListeners(container);
}

function attachEventListeners(container) {
    const buttons = container.querySelectorAll('button[data-event-id]');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const eventId = e.currentTarget.dataset.eventId;
            handleEventClick(parseInt(eventId)); // Parse eventId to integer
        });
    });

    // Attach event listener to close button
    const closeButton = document.querySelector('#ticketModal button');
    if (closeButton) {
        closeButton.addEventListener('click', closeTicketModal);
    }
}

function handleEventClick(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) {
        console.error(`Evento con ID ${eventId} no encontrado.`);
        return;
    }

    const modal = document.getElementById('ticketModal');
    const modalTitle = document.getElementById('modal-event-title');
    const modalTicketTypes = document.getElementById('modal-ticket-types');
    const whatsappBuyLink = document.getElementById('whatsapp-buy-link');

    modalTitle.textContent = event.title;
    modalTicketTypes.innerHTML = '';

    event.tickets.forEach(ticket => {
        const ticketHtml = `
            <div
                class="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-dashed border-white/20 hover:border-primary hover:bg-primary/10 transition-all duration-300">
                <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
                    <div>
                        <h4 class="font-bold text-white">${ticket.type}</h4>
                        <p class="text-sm text-white/60">${ticket.description}</p>
                    </div>
                </div>
                <span class="text-lg font-bold text-white">${ticket.price.toFixed(2)}</span>
            </div>
        `;
        modalTicketTypes.innerHTML += ticketHtml;
    });

    const phoneNumber = "51968424445";
    const whatsappMessage = encodeURIComponent(`Hola, quisiera comprar una entrada para el evento ${event.title} (${event.date} en ${event.location}).`);
    whatsappBuyLink.href = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

    modal.classList.remove('hidden');
    modal.classList.add('is-active');
}

function closeTicketModal() {
    const modal = document.getElementById('ticketModal');
    modal.classList.remove('is-active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}