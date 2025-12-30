import { events as localEvents } from "./data/events.js";
import { getEvents } from "./eventsService.js";
import { getScreens } from "./screensService.js";
import { testimonials } from "./data/testimonials.js";

import { renderEvents } from "./components/eventCard.js";
import { renderTestimonials } from "./components/testimonialCard.js";
import { renderCarousel } from "./components/carousel.js";
import createWhoIamSection from "./components/whoIam.js";



console.log("✅ EVENTOS LOCALES:", localEvents);

// ===== Util: ancho de scroll (para layout estable) =====
function calculateScrollbarWidth() {
  const scrollDiv = document.createElement("div");
  scrollDiv.style.cssText =
    "width:99px;height:99px;overflow:scroll;position:absolute;top:-9999px;";
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${scrollbarWidth}px`
  );
}

// ✅ Convertir fecha en formato "20 de diciembre, 2025" a Date real
function parseSpanishDate(dateStr) {
  if (!dateStr) return null;

  // si ya es ISO (Supabase)
  if (dateStr.includes("T")) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  // si es tipo "20 de diciembre, 2025"
  const months = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    setiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
  };

  try {
    const cleaned = dateStr.toLowerCase().replace(",", "");
    const parts = cleaned.split(" "); // [20, de, diciembre, 2025]

    const day = parseInt(parts[0], 10);
    const monthName = parts[2];
    const year = parseInt(parts[3], 10);

    const monthIndex = months[monthName];
    if (monthIndex === undefined) return null;

    return new Date(year, monthIndex, day);
  } catch (e) {
    return null;
  }
}

// ✅ Mezclar eventos Supabase + Locales sin duplicar por ID
function mergeEvents(supabaseEvents, localEvents) {
  const map = new Map();

  // primero locales
  localEvents.forEach((e) => map.set(Number(e.id), e));

  // luego supabase encima (si hay mismo id lo reemplaza)
  supabaseEvents.forEach((e) => map.set(Number(e.id), e));

  return Array.from(map.values());
}

// ✅ Ordenar eventos: próximos primero, finalizados al final
function sortEvents(events) {
  const now = new Date();

  return events.sort((a, b) => {
    const dateA = parseSpanishDate(a.date);
    const dateB = parseSpanishDate(b.date);

    // si no hay fecha, mandarlos al final
    if (!dateA) return 1;
    if (!dateB) return -1;

    const isPastA = dateA < now;
    const isPastB = dateB < now;

    // ✅ primero los futuros
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;

    // ✅ si ambos son futuros => orden por fecha cercana
    if (!isPastA && !isPastB) return dateA - dateB;

    // ✅ si ambos son pasados => orden por fecha más reciente primero
    return dateB - dateA;
  });
}

// ===== App Init =====
async function initApp() {
  console.log("🎫 Web-Eventos - Inicializando aplicación...");

  calculateScrollbarWidth();

  // Traer eventos desde Supabase
  let supabaseEvents = [];

  try {
    supabaseEvents = await getEvents();
    console.log("✅ Eventos desde Supabase:", supabaseEvents);
  } catch (e) {
    console.warn("⚠️ Supabase falló, usando solo locales", e);
    supabaseEvents = [];
  }

  // ✅ MEZCLA FINAL
  let eventsData = mergeEvents(supabaseEvents, localEvents);

  // ✅ ORDEN FINAL
  eventsData = sortEvents(eventsData);

  console.log("🔥 Eventos finales ordenados:", eventsData);

  // Render tarjetas
  renderEvents(eventsData, "events-grid");
  console.log(`✅ ${eventsData.length} eventos cargados (ordenados)`);

  // Otras secciones
 renderTestimonials(testimonials, "testimonials-grid");

const screens = await getScreens(); 
console.log("🖼️ Capturas desde Supabase:", screens);

renderCarousel(
  screens,
  "carousel-container",
  "carousel-track",
  "carousel-prev",
  "carousel-next"
);

createWhoIamSection();

  // HERO: fondo carrusel con flyers
  renderHeroBackgroundCarousel(eventsData, "hero-bg", 4000);

  // Interacciones
  initHeaderInteractions();
  initImageModal();
  initMobileMenu();

  console.log("🎉 Aplicación lista!");
}

// ===== Interacciones header =====
function initHeaderInteractions() {
  const searchBtn = document.querySelector("#search-button");
  if (searchBtn)
    searchBtn.addEventListener("click", () =>
      console.log("🔍 Búsqueda activada")
    );
}

// ===== Modal de imagen =====
function initImageModal() {
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const eventsGrid = document.getElementById("events-grid");

  if (eventsGrid && imageModal && modalImage) {
    eventsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".expand-button");
      if (!btn) return;

      const imageSrc = btn.dataset.image;
      if (!imageSrc) return;

      modalImage.src = imageSrc;
      imageModal.classList.remove("hidden");
    });

    imageModal.addEventListener("click", () => {
      imageModal.classList.add("hidden");
      modalImage.src = "";
    });
  }
}

// ===== Menú móvil =====
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isHidden = menu.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", String(!isHidden));
  });

  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    if (!menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== HERO: carrusel de fondo con flyers =====
function renderHeroBackgroundCarousel(
  fromEvents,
  containerId = "hero-bg",
  intervalMs = 4000
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const images = Array.from(new Set(fromEvents.map((e) => e.image))).filter(
    Boolean
  );
  if (images.length === 0) return;

  // Precarga
  images.forEach((src) => {
    const im = new Image();
    im.src = src;
  });

  // Slides
  container.innerHTML = "";
  images.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide";
    slide.style.backgroundImage = `url('${src}')`;
    if (i === 0) slide.classList.add("active");
    container.appendChild(slide);
  });

  const slides = Array.from(container.children);
  let idx = 0;
  let paused = false;

  function show(i) {
    slides.forEach((s) => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });

  const hero = document.getElementById("hero");
  if (hero) {
    hero.addEventListener("mouseenter", () => (paused = true));
    hero.addEventListener(
      "mouseleave",
      () => (paused = document.hidden ? true : false)
    );
  }

  setInterval(() => {
    if (paused) return;
    idx = (idx + 1) % slides.length;
    show(idx);
  }, intervalMs);
}

// ===== DOM Ready =====
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
