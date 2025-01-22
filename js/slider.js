document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.slider_tlo');
    const slides = document.querySelectorAll('.slider_tlo img');
    let currentIndex = 0;

    function moveSlider() {
        currentIndex = (currentIndex + 1) % slides.length;
        const offset = -currentIndex * (100 / slides.length);
        slider.style.transform = `translateX(${offset}%)`;
    }

    setInterval(moveSlider, 3000);
});
