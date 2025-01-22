document.addEventListener('DOMContentLoaded', () => {
    const onasTxt1 = document.querySelector('.start_txt1');
    const onasTxt2 = document.querySelector('.start_txt2');
    const onasTxt3 = document.querySelector('.start_txt3');

    const handleScroll = () => {
        const rect1 = onasTxt1.getBoundingClientRect();
        const rect2 = onasTxt2.getBoundingClientRect();
        const rect3 = onasTxt3.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect1.top <= windowHeight) {
            onasTxt1.classList.add('visible');
        }

        if (rect2.top <= windowHeight) {
            onasTxt2.classList.add('visible');
        }

        if (rect3.top <= windowHeight) {
            onasTxt3.classList.add('visible');
        }

        // Usuń nasłuchiwanie po animacji
        if (rect1.top <= windowHeight && rect2.top <= windowHeight && rect3.top <= windowHeight) {
            window.removeEventListener('scroll', handleScroll);
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Sprawdź, czy elementy są już widoczne po załadowaniu strony
    handleScroll();
});

document.addEventListener('DOMContentLoaded', function() {
    const services = document.querySelectorAll('.fot');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    services.forEach(service => {
        observer.observe(service);
    });
});

