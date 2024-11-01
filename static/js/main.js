document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.single-hero-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    // Change slide every 5 seconds
    setInterval(nextSlide, 3000);
});