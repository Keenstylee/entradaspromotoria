import { events } from '../data/events.js';

/* ====================== Helpers YouTube ====================== */
function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v)
        return `https://www.youtube.com/embed/${v}?rel=0&modestbranding=1`;
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

function normalizeYouTubeSources(youtubeProp) {
  if (!youtubeProp) return [];
  if (isStr(youtubeProp)) {
    return [{ title: 'YouTube 1', url: youtubeProp.trim() }];
  }
  if (Array.isArray(youtubeProp)) {
    return youtubeProp
      .map((it, i) => {
        if (isStr(it)) return { title: `YouTube ${i + 1}`, url: it.trim() };
        if (isObj(it) && isStr(it.url)) {
          return {
            title: isStr(it.title) ? it.title.trim() : `YouTube ${i + 1}`,
            url: it.url.trim(),
          };
        }
        return null;
      })
      .filter(Boolean);
  }
  if (isObj(youtubeProp) && isStr(youtubeProp.url)) {
    return [
      {
        title: isStr(youtubeProp.title) ? youtubeProp.title.trim() : 'YouTube 1',
        url: youtubeProp.url.trim(),
      },
    ];
  }
  return [];
}

/* ====================== Tarjeta de evento ====================== */
export function createEventCard(event) {
  const whatsappButtonHtml = event.whatsappGroupUrl
    ? `
      <a href="${event.whatsappGroupUrl}" target="_blank" class="mt-2 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459l-6.323 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.474.852-1.107 4.054 4.144-1.085.826.495z"></path>
        </svg>
        <span class="truncate">Unirse a Grupo de WhatsApp</span>
      </a>
    `
    : '';

  return `
    <div class="group flex flex-col overflow-hidden rounded-lg bg-white/5 dark:bg-white/5 shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1 relative">

      ${renderBadgesForDate(event.date)}

      <div class="image-container relative">
        <img 
          alt="${event.title}" 
          class="w-full h-48 object-cover object-top"
          src="${event.image}" 
          loading="lazy"
        />
        <button class="expand-button absolute bottom-2 right-2 bg-black/60 text-white p-1 rounded-full" data-image="${event.image}">
          <span class="material-symbols-outlined">expand_content</span>
        </button>
      </div>

      <div class="p-4 flex flex-col flex-grow bg-background-light dark:bg-background-dark">
        
        <h3 class="text-lg font-bold text-black dark:text-white mb-2">${event.title}</h3>

        <p class="text-sm text-black/60 dark:text-white/60 mb-2">${event.description}</p>

        <p class="text-sm text-black/60 dark:text-white/60 flex items-center gap-2 mb-2">
          <span class="material-symbols-outlined text-base">calendar_today</span>
          ${event.date}
        </p>

        <p class="text-sm text-black/60 dark:text-white/60 flex items-center gap-2 mb-4">
          <span class="material-symbols-outlined text-base">location_on</span>
          ${event.location}
        </p>

        <!-- 🔥 BOTÓN CORRECTO HACIA evento.html-->
        <a 
          href="evento.html?id=${event.id}" 
          class="mt-auto w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <span class="truncate">Ver Detalles</span>
        </a>

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

  if (diff < -0.5) {
    badgeLabel = 'Finalizado';
    badgeColor = 'bg-red-600';
  } else if (Math.abs(diff) <= 0.5) {
    badgeLabel = 'Hoy';
    badgeColor = 'bg-yellow-500';
  } else {
    badgeLabel = 'Próximo evento';
    badgeColor = 'bg-green-600';
  }

  return `
    <div class="absolute top-3 left-3 z-10">
      <span class="px-2 py-1 text-xs font-semibold rounded-full text-white shadow ${badgeColor}">
        ${badgeLabel}
      </span>
    </div>
  `;
}