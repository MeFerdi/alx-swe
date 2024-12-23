document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.single-hero-slide');
    let currentSlide = 0;

    function showSlide(index) {
        // Fade out current slide
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('fade-out');

        // Fade in next slide
        slides[index].classList.add('active');
        slides[index].classList.remove('fade-out');

        // After transition, remove fade-out class from previous slide
        setTimeout(() => {
            slides[currentSlide].classList.remove('fade-out');
            currentSlide = index;
        }, 1000); // This should match the transition duration in CSS
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Set initial state
    slides[currentSlide].classList.add('active');

    // Change slide every 12 seconds
    setInterval(nextSlide, 12000);
});