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

    // Clear existing slides
    track.innerHTML = '';

    // Clone slides for infinite loop effect
    const numClones = 5; // Number of slides to clone from each end
    const clonedScreens = [
        ...screens.slice(-numClones).map(screen => ({ ...screen, isClone: true })),
        ...screens,
        ...screens.slice(0, numClones).map(screen => ({ ...screen, isClone: true })),
    ];

    clonedScreens.forEach(screen => {
        track.innerHTML += createCarouselSlide(screen);
    });

    const slides = Array.from(track.children);
    let currentIndex = numClones; // Start at the first actual slide
    let slideWidth;

    function getSlideWidth() {
        return slides[0].getBoundingClientRect().width;
    }

    function updateCarousel(smooth = true) {
        slideWidth = getSlideWidth();
        track.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
    }

    // Initial positioning
    updateCarousel(false);

    prevButton.addEventListener('click', () => {
        if (currentIndex <= 0) {
            currentIndex = screens.length + numClones; // Jump to the end of the real slides + clones
            updateCarousel(false);
        }
        currentIndex--;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex >= screens.length + numClones - 1) {
            currentIndex = numClones - 1; // Jump to the beginning of the real slides - 1
            updateCarousel(false);
        }
        currentIndex++;
        updateCarousel();
    });

    // Auto-play carousel
    setInterval(() => {
        if (currentIndex >= screens.length + numClones - 1) {
            currentIndex = numClones - 1;
            updateCarousel(false);
        }
        currentIndex++;
        updateCarousel();
    }, 3000); // Change slide every 3 seconds

    // Adjust carousel on window resize
    window.addEventListener('resize', () => {
        updateCarousel(false);
    });
}
