import { events } from '../data/events.js';

/* ====================== Helpers YouTube ====================== */
function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    // youtu.be/VIDEO
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
    }
    // youtube.com/watch?v=VIDEO
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
      // playlist
      if (u.pathname.includes('/playlist') && u.searchParams.get('list')) {
        return `https://www.youtube.com/embed/videoseries?list=${u.searchParams.get('list')}`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

const isStr = v => typeof v === 'string' && v.trim().length > 0;
const isObj = v => v && typeof v === 'object';

/**
 * Normaliza a un array de objetos { title, url }
 * Acepta:
 *  - string
 *  - array de strings
 *  - array de objetos { title?, url }
 */
function normalizeYouTubeSources(youtubeProp) {
  if (!youtubeProp) return [];
  // string único
  if (isStr(youtubeProp)) {
    return [{ title: 'YouTube 1', url: youtubeProp.trim() }];
  }
  // array
  if (Array.isArray(youtubeProp)) {
    // array de objetos o strings mixto
    const items = youtubeProp.map((it, i) => {
      if (isStr(it)) return { title: `YouTube ${i + 1}`, url: it.trim() };
      if (isObj(it) && isStr(it.url)) {
        return { title: isStr(it.title) ? it.title.trim() : `YouTube ${i + 1}`, url: it.url.trim() };
      }
      return null;
    }).filter(Boolean);
    return items;
  }
  // objeto suelto (por si acaso)
  if (isObj(youtubeProp) && isStr(youtubeProp.url)) {
    return [{ title: isStr(youtubeProp.title) ? youtubeProp.title.trim() : 'YouTube 1', url: youtubeProp.url.trim() }];
  }
  return [];
}

/* ====================== Tarjeta de evento ====================== */
export function createEventCard(event) {
  const whatsappButtonHtml = event.whatsappGroupUrl
    ? `
      <a href="${event.whatsappGroupUrl}" target="_blank" class="mt-2 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold leading-normal tracking-wide hover:bg-green-600 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459l-6.323 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.852-1.107 4.054 4.144-1.085.826.495z"></path>
        </svg>
        <span class="truncate">Unirse a Grupo de WhatsApp</span>
      </a>
    `
    : '';

  return `
    <div class="group flex flex-col overflow-hidden rounded-lg bg-white/5 dark:bg-white/5 shadow-lg hover:shadow-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 relative">
      ${renderBadgesForDate(event.date)}
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
        <h3 class="text-lg font-bold text-black dark:text-white mb-2">${event.title}</h3>
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

/* ====================== Render de tarjetas ====================== */
export function renderEvents(eventsArr, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }
  container.innerHTML = '';
  eventsArr.forEach(ev => (container.innerHTML += createEventCard(ev)));
  attachEventListeners(container);
}

/* ====================== Badges por fecha ====================== */
function renderBadgesForDate(eventDateString) {
  const now = new Date();
  const eventDate = new Date(
    eventDateString.replace(/(\d{1,2}) de (\w+),? (\d{4})/, (m, day, month, year) => {
      const months = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      };
      return `${year}-${String(months[month.toLowerCase()] + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    })
  );

  const diff = (eventDate - now) / (1000 * 60 * 60 * 24);
  let badgeLabel = '';
  let badgeColor = '';
  let animationClass = '';
  let glowClass = '';

  if (diff < -0.5) {
    badgeLabel = 'Finalizado';
    badgeColor = 'bg-red-600';
  } else if (Math.abs(diff) <= 0.5) {
    badgeLabel = 'Hoy';
    badgeColor = 'bg-yellow-500';
    animationClass = 'animate-pulse';
    glowClass = 'badge-glow';
  } else {
    badgeLabel = 'Próximo evento';
    badgeColor = 'bg-green-600';
    glowClass = 'badge-glow-green';
  }

  return `
    <div class="absolute top-3 left-3 flex gap-2 z-10">
      <span class="px-2 py-1 text-xs font-semibold rounded-full text-white shadow ${badgeColor} ${animationClass} ${glowClass}">
        ${badgeLabel}
      </span>
    </div>
  `;
}

/* ====================== Listeners y modal ====================== */
function attachEventListeners(container) {
  const buttons = container.querySelectorAll('button[data-event-id]');
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      const eventId = parseInt(e.currentTarget.dataset.eventId, 10);
      handleEventClick(eventId);
    });
  });

  const closeButton = document.querySelector('#ticketModal button');
  if (closeButton) closeButton.addEventListener('click', closeTicketModal);
}

/* ===== Bloque YouTube (tabs si hay varios links y títulos) ===== */
function buildYouTubeBlock(youtubeItems) {
  // youtubeItems: [{ title, url }]
  const first = youtubeItems[0];
  const embed0 = toYouTubeEmbed(first?.url || '');
  const hasMultiple = youtubeItems.length > 1;

  const tabs = hasMultiple
    ? `
      <div class="flex flex-wrap gap-2 mb-3" id="modal-video-tabs">
        ${youtubeItems
          .map((item, i) => `
            <button data-idx="${i}"
              class="tab-pill inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 ${i===0 ? 'bg-white/10' : ''}">
              ${item.title || `YouTube ${i + 1}`}
            </button>
          `)
          .join('')}
      </div>`
    : '';

  return `
    <h3 class="text-white font-bold mb-3 flex items-center gap-2">
      <span class="material-symbols-outlined text-base text-primary">play_circle</span>
      Mira un set del artista
    </h3>
    ${tabs}
    <div class="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black/40">
      <div class="relative pt-[56.25%]">
        <iframe
          id="modal-video"
          class="absolute inset-0 w-full h-full rounded-lg"
          src="${embed0}"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="mt-3">
      <a href="${first?.url || '#'}" target="_blank" rel="noopener"
         id="modal-video-open"
         class="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white underline decoration-white/30">
        <span class="material-symbols-outlined text-base">open_in_new</span>
        Ver en YouTube${first?.title ? ` — ${first.title}` : ''}
      </a>
    </div>
  `;
}

function wireYouTubeTabs(youtubeItems) {
  if (youtubeItems.length <= 1) return;
  const tabs = document.querySelectorAll('#modal-video-tabs .tab-pill');
  const iframe = document.getElementById('modal-video');
  const open = document.getElementById('modal-video-open');
  if (!tabs || !iframe) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('bg-white/10'));
      tab.classList.add('bg-white/10');
      const idx = parseInt(tab.dataset.idx, 10) || 0;
      const item = youtubeItems[idx];
      iframe.src = toYouTubeEmbed(item.url);
      if (open) {
        open.href = item.url;
        open.innerHTML = `
          <span class="material-symbols-outlined text-base">open_in_new</span>
          Ver en YouTube${item.title ? ' — ' + item.title : ''}
        `;
      }
    });
  });
}

/* ====================== Click en tarjeta → abrir modal ====================== */
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
  const videoWrap = document.getElementById('modal-video-wrap');

  // Título y tickets
  modalTitle.textContent = event.title;
  modalTicketTypes.innerHTML = '';
  event.tickets.forEach(ticket => {
    modalTicketTypes.innerHTML += `
      <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-dashed border-white/20 hover:border-primary hover:bg-primary/10 transition-all duration-300">
        <div class="flex items-center gap-4">
          <span class="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
          <div>
            <h4 class="font-bold text-white">${ticket.type}</h4>
            <p class="text-sm text-white/60">${ticket.description || ""}</p>
          </div>
        </div>
        <span class="text-lg font-bold text-white">S/ ${ticket.price.toFixed(2)}</span>
      </div>
    `;
  });

  // YouTube (opcional)
  const ytItems = normalizeYouTubeSources(event.youtube); // => [{title,url}]
  if (videoWrap) {
    if (ytItems.length) {
      videoWrap.classList.remove('hidden');
      videoWrap.innerHTML = buildYouTubeBlock(ytItems);
      wireYouTubeTabs(ytItems);
    } else {
      videoWrap.classList.add('hidden');
      videoWrap.innerHTML = '';
    }
  }

  // WhatsApp CTA
  const phoneNumber = "51968424445";
  const whatsappMessage = encodeURIComponent(
    `Hola, quisiera comprar una entrada para el evento ${event.title} (${event.date} en ${event.location}).`
  );
  whatsappBuyLink.href = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  // Mostrar modal
  modal.classList.remove('hidden');
  modal.classList.add('is-active');
}

/* ============== Cerrar modal (limpia video) ============== */
function closeTicketModal() {
  const modal = document.getElementById('ticketModal');
  const iframe = document.getElementById('modal-video');
  const videoWrap = document.getElementById('modal-video-wrap');
  if (iframe) iframe.src = '';
  if (videoWrap) {
    videoWrap.innerHTML = '';
    videoWrap.classList.add('hidden');
  }
  modal.classList.remove('is-active');
  setTimeout(() => modal.classList.add('hidden'), 300);
}