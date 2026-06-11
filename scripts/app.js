// Initialize Lenis smooth scroll with safety guards
let lenis;
try {
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothTouch: false
        });

        window.lenis = lenis;

        // Sync Lenis with GSAP ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Sync Lenis → ScrollTrigger on every scroll event
            lenis.on('scroll', ScrollTrigger.update);

            // Drive Lenis from GSAP's ticker for perfect sync
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        } else {
            // Fallback manual requestAnimationFrame loop if GSAP/ScrollTrigger is not available
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    } else {
        console.warn('Lenis CDN is not available. Falling back to native scroll.');
    }
} catch (e) {
    console.error('Failed to initialize Lenis smooth scroll:', e);
}

// Reduced Motion Detection Helper
const allowMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.allowMotion = allowMotion;

// Custom Cursor (Pointer: fine only, GSAP guarded)
if (allowMotion && window.matchMedia("(pointer: fine)").matches && typeof gsap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            const cursor = document.querySelector('.custom-cursor');
            const dot = document.querySelector('.cursor-dot');
            const ring = document.querySelector('.cursor-ring');
            const label = document.querySelector('.cursor-label');
            
            if (cursor && dot && ring) {
                document.documentElement.classList.add('custom-cursor-active');
                
                // Set initial cursor positions
                gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
                
                const xDotTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3" });
                const yDotTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3" });
                
                const xRingTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
                const yRingTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });
                
                window.addEventListener('mousemove', (e) => {
                    xDotTo(e.clientX);
                    yDotTo(e.clientY);
                    
                    xRingTo(e.clientX);
                    yRingTo(e.clientY);
                });
                
                const addHover = (el, text) => {
                    el.addEventListener('mouseenter', () => {
                        cursor.classList.add('hovering');
                        if (text) {
                            label.innerText = text;
                            cursor.classList.add('has-label');
                        }
                    });
                    el.addEventListener('mouseleave', () => {
                        cursor.classList.remove('hovering');
                        cursor.classList.remove('has-label');
                        label.innerText = '';
                    });
                };
                
                document.querySelectorAll('a, button, .btn, [role="button"]').forEach(el => {
                    let text = 'Go';
                    if (el.classList.contains('btn-primary') || el.tagName === 'BUTTON') {
                        text = 'Book';
                    } else if (el.getAttribute('href') && el.getAttribute('href').startsWith('https://wa.me')) {
                        text = 'Chat';
                    }
                    addHover(el, text);
                });
                
                document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
                    addHover(el, 'View');
                });
                
                document.querySelectorAll('.blog-card-mini').forEach(el => {
                    addHover(el, 'Read');
                });
                
                document.querySelectorAll('.testimonials-scroller').forEach(el => {
                    addHover(el, 'Drag');
                });
                
                document.querySelectorAll('[data-cursor]').forEach(el => {
                    addHover(el, el.getAttribute('data-cursor'));
                });
            }
        } catch (err) {
            console.error('Failed to init custom cursor:', err);
        }
    });
}



document.addEventListener('DOMContentLoaded', () => {

    // Mobile Overlay Navigation
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    
    if (mobileToggle && mobileOverlay) {
        let isMenuOpen = false;
        
        const toggleScrollLock = (lock) => {
            if (lock) {
                document.body.style.overflow = 'hidden';
                if (window.lenis) window.lenis.stop();
            } else {
                document.body.style.overflow = '';
                if (window.lenis) window.lenis.start();
            }
        };

        const openMenu = () => {
            isMenuOpen = true;
            mobileToggle.classList.add('active');
            mobileOverlay.classList.add('active');
            toggleScrollLock(true);
            
            if (window.allowMotion) {
                gsap.fromTo('.mobile-nav-link', 
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" }
                );
                gsap.fromTo('.mobile-nav-footer > *', 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3, ease: "power3.out" }
                );
            } else {
                gsap.set('.mobile-nav-link, .mobile-nav-footer > *', { y: 0, opacity: 1 });
            }
        };

        const closeMenu = () => {
            isMenuOpen = false;
            mobileToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            toggleScrollLock(false);
        };

        mobileToggle.addEventListener('click', () => {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // Header Scroll frosted state & hide-on-scroll-down
    const header = document.querySelector('.header');
    let isNavHidden = false;
    
    if (header && window.lenis && typeof gsap !== 'undefined') {
        window.lenis.on('scroll', (e) => {
            const scrollY = e.scroll;
            
            // Update scroll progress bar
            const progressBar = document.querySelector('.scroll-progress-bar');
            if (progressBar) {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (maxScroll > 0) {
                    const percentage = (scrollY / maxScroll) * 100;
                    progressBar.style.width = `${percentage}%`;
                }
            }

            // Toggle frosted background
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/Show navbar based on scroll direction
            if (scrollY > 400) {
                if (e.direction === 1 && !isNavHidden) {
                    gsap.to(header, { yPercent: -100, duration: 0.4, ease: "power2.out" });
                    isNavHidden = true;
                } else if (e.direction === -1 && isNavHidden) {
                    gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.out" });
                    isNavHidden = false;
                }
            } else {
                if (isNavHidden) {
                    gsap.to(header, { yPercent: 0, duration: 0.4, ease: "power2.out" });
                    isNavHidden = false;
                }
            }
        });
    }

    // Active Section Link Persistent Underline
    const navLinks = document.querySelectorAll('.nav-list a:not(.btn)');
    const sections = document.querySelectorAll('section[id], header[id]');
    
    if (navLinks.length > 0 && sections.length > 0 && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        sections.forEach(section => {
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-list a[href="#${id}"]`);
            if (link) {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 150px",
                    end: "bottom 150px",
                    onToggle: self => {
                        if (self.isActive) {
                            navLinks.forEach(l => l.classList.remove('active'));
                            link.classList.add('active');
                        }
                    }
                });
            }
        });
    }

    // Smooth Scroll for anchor links using Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target && window.lenis) {
                    window.lenis.scrollTo(target, { offset: -80 });
                } else if (target) {
                    // Fallback if lenis is not initialized
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // All scroll animations and reveals are handled by GSAP in animations.js

    // Back to top button smooth scroll
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.lenis) {
                window.lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

});
