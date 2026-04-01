document.addEventListener('DOMContentLoaded', () => {

    // Mobile Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            // Toggle body scroll
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when a non-dropdown link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            // If this link is the Services toggle on mobile, handle dropdown instead
            const parentLi = link.closest('.nav-item.has-dropdown');
            if (parentLi && window.innerWidth <= 768) {
                e.preventDefault();
                parentLi.classList.toggle('mobile-open');
                return;
            }
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

    // Hero Slideshow
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function nextSlide() {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Testimonials Slider
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && cards.length > 0) {
        let currentIndex = 0;

        const updateSlider = () => {
            // Calculate width of card + gap
            const cardWidth = cards[0].offsetWidth;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap || 0);
            const slideAmount = cardWidth + gap;

            track.style.transform = `translateX(-${currentIndex * slideAmount}px)`;
        };

        const goNext = () => {
            // Determine how many cards are visible
            const containerWidth = document.querySelector('.testimonials-slider-container').offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            const maxIndex = cards.length - visibleCards;

            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back
            }
            updateSlider();
        };

        const goPrev = () => {
            const containerWidth = document.querySelector('.testimonials-slider-container').offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const visibleCards = Math.floor(containerWidth / cardWidth);
            const maxIndex = cards.length - visibleCards; // Use maxIndex for consistency in loop

            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex > 0 ? maxIndex : 0; // Loop to end
            }
            updateSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', goNext);
        if (prevBtn) prevBtn.addEventListener('click', goPrev);

        // Window resize handling
        window.addEventListener('resize', updateSlider);

        // Touch support (simple swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) goNext();
            if (touchEndX > touchStartX + 50) goPrev();
        }
    }
});
