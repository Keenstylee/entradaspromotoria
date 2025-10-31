import { events } from '../data/events.js';

export function createEventCard(event) {
    const whatsappButtonHtml = event.whatsappGroupUrl ? `
        <a href="${event.whatsappGroupUrl}" target="_blank" class="mt-2 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold leading-normal tracking-wide hover:bg-green-600 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459l-6.323 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.852-1.107 4.054 4.144-1.085.826.495z"></path>
            </svg>
            <span class="truncate">Unirse a Grupo de WhatsApp</span>
        </a>
    ` : '';

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
                ${whatsappButtonHtml}
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
        console.log('Generated ticket HTML:', ticketHtml);
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