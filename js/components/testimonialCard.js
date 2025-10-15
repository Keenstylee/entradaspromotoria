export function createTestimonialCard(testimonial) {
    return `
        <div class="bg-white/5 dark:bg-white/5 rounded-lg p-6 flex flex-col gap-4 shadow-lg">
            <div class="flex items-center gap-4">
                <img 
                    class="w-12 h-12 rounded-full object-cover"
                    src="${testimonial.avatar}"
                    alt="${testimonial.name}"
                    loading="lazy"
                />
                <div>
                    <h4 class="font-bold text-black dark:text-white">${testimonial.name}</h4>
                    <p class="text-sm text-black/60 dark:text-white/60">${testimonial.username}</p>
                </div>
            </div>
            <p class="text-black/80 dark:text-white/80">${testimonial.comment}</p>
        </div>
    `;
}

export function renderTestimonials(testimonials, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    container.innerHTML = '';
    
    testimonials.forEach(testimonial => {
        container.innerHTML += createTestimonialCard(testimonial);
    });
}