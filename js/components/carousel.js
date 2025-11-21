export function createCarouselSlide(screen) {
  return `
    <div class="carousel-slide flex-shrink-0">
      <img alt="Captura de venta ${screen.id}"
        class="rounded-lg shadow-lg w-full h-auto object-contain"
        src="${screen.image}"
        loading="lazy"
      />
    </div>
  `;
}

export function renderCarousel(screens, containerId, trackId, prevButtonId, nextButtonId) {
  const container = document.getElementById(containerId);
  const track = document.getElementById(trackId);
  const prevButton = document.getElementById(prevButtonId);
  const nextButton = document.getElementById(nextButtonId);

  if (!container || !track || !prevButton || !nextButton) {
    console.error('One or more carousel elements not found');
    return;
  }

  // Asegurar foco para navegación por teclado
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '0');
  }

  // Clear existing slides
  track.innerHTML = '';

  // Clone slides for infinite loop effect
  const numClones = 5;
  const clonedScreens = [
    ...screens.slice(-numClones).map(screen => ({ ...screen, isClone: true })),
    ...screens,
    ...screens.slice(0, numClones).map(screen => ({ ...screen, isClone: true })),
  ];

  clonedScreens.forEach(screen => {
    track.innerHTML += createCarouselSlide(screen);
  });

  const slides = Array.from(track.children);
  let currentIndex = numClones;
  let slideWidth = 0;

  function getSlideWidth() {
    return slides[0]?.getBoundingClientRect().width || 0;
  }

  function updateCarousel(smooth = true) {
    slideWidth = getSlideWidth();
    track.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  }

  // Movimiento básico
  function goNext({ smooth = true } = {}) {
    if (currentIndex >= screens.length + numClones - 1) {
      currentIndex = numClones - 1;
      updateCarousel(false);
    }
    currentIndex++;
    updateCarousel(smooth);
  }

  function goPrev({ smooth = true } = {}) {
    if (currentIndex <= 0) {
      currentIndex = screens.length + numClones;
      updateCarousel(false);
    }
    currentIndex--;
    updateCarousel(smooth);
  }

  // Initial positioning
  updateCarousel(false);

  // Controles de botones
  prevButton.addEventListener('click', () => goPrev());
  nextButton.addEventListener('click', () => goNext());

  // ---- Autoplay con control ----
  const INTERVAL_MS = 4500;
  let autoplayId = null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startAutoplay() {
    if (autoplayId || prefersReducedMotion) return;
    autoplayId = setInterval(() => {
      goNext();
    }, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  // Pausa al pasar mouse / tener foco / pestaña oculta
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);
  container.addEventListener('focusin', stopAutoplay);
  container.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  // Navegación por teclado
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      stopAutoplay();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      stopAutoplay();
      goNext();
    }
  });

  // Ajuste en resize
  window.addEventListener('resize', () => {
    updateCarousel(false);
  });

  // Iniciar autoplay si procede
  startAutoplay();
}