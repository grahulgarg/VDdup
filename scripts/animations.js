/**
 * animations.js — Consolidated Awwwards-grade animation controller
 * GSAP + ScrollTrigger + Lenis
 *
 * Reusable systems:
 *  1. Universal [data-reveal] scroll entrance
 *  2. Headline mask-reveal (line split + overflow clip)
 *  3. [data-parallax] scrub transforms
 *  4. [data-count] counter animation
 *  5. Magnetic buttons (.btn, [data-magnetic])
 *  6. Section-specific: hero, accordion, about, slider, contact, footer
 *  7. Reduced-motion fallback
 */
function initAnimations() {

    // ── Fallback: show everything if JS/GSAP fails ──────────────────────
    const revealAll = () => {
        document.querySelectorAll(
            '[data-reveal], .fade-in, .fade-up, .split-text, .service-card, .testimonial-card, ' +
            '.blog-card, .detail-card, .about-image img, .article-content img, .h1-line, ' +
            '.draw-underline, .hero-eyebrow, .hero-subcopy, .hero-actions, .hero-trust-row, ' +
            '.hero-image-wrapper, .circular-badge, .hero-pill-card, .accordion-row, ' +
            '.accordion-desc, .about-image-wrapper, .amenity-chip, .quote-author, .word, ' +
            '.results-title, .results-subcopy, .results-tabs-container, .comparison-slider-container, ' +
            '.contact-left, .contact-right, .booking-card .form-group, .booking-card .submit-btn, ' +
            '.footer-cta-band, .footer-column, .footer-giant-wordmark, .footer-content-wrap'
        ).forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
            el.style.clipPath = 'none';
        });
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Showing static elements.');
        revealAll();
        return;
    }

    try {
        // ── 0. Plugin Registration ───────────────────────────────────────
        gsap.registerPlugin(ScrollTrigger);

        const allowMotion = window.allowMotion !== undefined
            ? window.allowMotion
            : !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ── 1. Line/Word Splitter Utility ───────────────────────────────
        function splitIntoLines(el) {
            const text = el.textContent.trim();
            if (!text) return [];

            el.setAttribute('data-original-text', text);

            // Measure by temporarily setting words as inline spans
            const words = text.split(/\s+/);
            el.innerHTML = words.map(w => `<span class="word-measure" style="display:inline">${w}</span>`).join(' ');

            const spans = el.querySelectorAll('.word-measure');
            const lines = [];
            let currentLine = [];
            let lastTop = null;

            spans.forEach(span => {
                const top = span.getBoundingClientRect().top;
                if (lastTop !== null && Math.abs(top - lastTop) > 2) {
                    lines.push(currentLine.join(' '));
                    currentLine = [];
                }
                currentLine.push(span.textContent);
                lastTop = top;
            });
            if (currentLine.length) lines.push(currentLine.join(' '));

            // Rebuild with overflow-hidden wrappers
            el.innerHTML = lines.map(line =>
                `<span class="line-mask" style="display:block;overflow:hidden;">` +
                `<span class="line-inner" style="display:block;">${line}</span></span>`
            ).join('');

            return el.querySelectorAll('.line-inner');
        }

        // Split .split-text elements into words (for quote reveals)
        document.querySelectorAll('.split-text').forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split(' ').forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.style.display = 'inline-block';
                wordSpan.innerText = word;
                el.appendChild(wordSpan);
                el.appendChild(document.createTextNode(' '));
            });
            el.style.opacity = 1;
            el.style.visibility = 'visible';
        });

        // ══════════════════════════════════════════════════════════════════
        //  INTERACTIVE COMPONENTS (always active, motion-independent)
        // ══════════════════════════════════════════════════════════════════

        // ── Comparison Slider Interactivity ──────────────────────────────
        const slider = document.getElementById('before-after-slider');
        const sliderHandle = document.getElementById('slider-handle');
        const beforeImg = document.getElementById('slider-before-img');
        const afterImg = document.getElementById('slider-after-img');
        const tabButtons = document.querySelectorAll('.results-tabs .tab-btn');

        const casesData = {
            whitening: {
                beforeSrc: 'Photos/whitening_demo.webp', afterSrc: 'Photos/whitening_demo.webp',
                beforeClass: 'before-img-filter', afterClass: '',
                beforeAlt: 'Before dental whitening treatment placeholder',
                afterAlt: 'After dental whitening treatment placeholder'
            },
            veneers: {
                beforeSrc: 'Photos/veneers_demo.webp', afterSrc: 'Photos/veneers_demo.webp',
                beforeClass: 'before-img-filter-veneers', afterClass: '',
                beforeAlt: 'Before dental veneers treatment placeholder',
                afterAlt: 'After dental veneers treatment placeholder'
            },
            alignment: {
                beforeSrc: 'Photos/whitening_demo.webp', afterSrc: 'Photos/whitening_demo.webp',
                beforeClass: 'before-img-filter-alignment', afterClass: '',
                beforeAlt: 'Before dental alignment treatment placeholder',
                afterAlt: 'After dental alignment treatment placeholder'
            }
        };

        let isDragging = false;
        let isAutoDemoPlaying = false;
        let autoDemoTween = null;

        function setSliderPosition(pct) {
            const clamped = Math.max(0, Math.min(100, pct));
            if (slider) slider.style.setProperty('--slider-pos', `${clamped}%`);
            if (sliderHandle) sliderHandle.setAttribute('aria-valuenow', Math.round(clamped));
        }

        function handleSliderMove(clientX) {
            if (!slider) return;
            const rect = slider.getBoundingClientRect();
            setSliderPosition(((clientX - rect.left) / rect.width) * 100);
        }

        function killAutoDemo() {
            if (isAutoDemoPlaying && autoDemoTween) { autoDemoTween.kill(); isAutoDemoPlaying = false; }
        }

        if (slider && sliderHandle) {
            slider.addEventListener('mousedown', (e) => {
                e.preventDefault(); isDragging = true; killAutoDemo();
                handleSliderMove(e.clientX); document.body.style.cursor = 'ew-resize';
            });
            window.addEventListener('mousemove', (e) => { if (isDragging) handleSliderMove(e.clientX); });
            window.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; document.body.style.cursor = ''; } });

            slider.addEventListener('touchstart', (e) => {
                isDragging = true; killAutoDemo(); handleSliderMove(e.touches[0].clientX);
            }, { passive: true });
            window.addEventListener('touchmove', (e) => { if (isDragging) handleSliderMove(e.touches[0].clientX); }, { passive: true });
            window.addEventListener('touchend', () => { if (isDragging) isDragging = false; });

            sliderHandle.addEventListener('keydown', (e) => {
                const pos = parseFloat(slider.style.getPropertyValue('--slider-pos') || '50');
                const step = e.shiftKey ? 15 : 5;
                if (e.key === 'ArrowLeft')  { e.preventDefault(); killAutoDemo(); setSliderPosition(pos - step); }
                if (e.key === 'ArrowRight') { e.preventDefault(); killAutoDemo(); setSliderPosition(pos + step); }
                if (e.key === 'Home')       { e.preventDefault(); setSliderPosition(0); }
                if (e.key === 'End')        { e.preventDefault(); setSliderPosition(100); }
            });
        }

        // Tab switcher
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const data = casesData[btn.getAttribute('data-case')];
                if (!data) return;
                killAutoDemo(); setSliderPosition(50);
                tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
                btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
                if (beforeImg && afterImg) {
                    gsap.to([beforeImg, afterImg], { opacity: 0, duration: 0.2, onComplete: () => {
                        beforeImg.src = data.beforeSrc; afterImg.src = data.afterSrc;
                        beforeImg.alt = data.beforeAlt; afterImg.alt = data.afterAlt;
                        beforeImg.className = data.beforeClass || '';
                        afterImg.className = data.afterClass || '';
                        gsap.to([beforeImg, afterImg], { opacity: 1, duration: 0.3 });
                    }});
                }
            });
        });

        // ── Clinic Status Pill ───────────────────────────────────────────
        function updateClinicOpenStatus() {
            const pill = document.getElementById('open-status-pill');
            if (!pill) return;
            const now = new Date();
            const day = now.getDay();
            const t = now.getHours() * 100 + now.getMinutes();
            const isOpen = day !== 6 && ((t >= 1000 && t < 1400) || (t >= 1600 && t < 2000));
            pill.className = `status-pill ${isOpen ? 'open' : 'closed'}`;
            pill.innerHTML = `<span class="status-dot"></span>${isOpen ? 'Open Now' : 'Closed'}`;
        }
        updateClinicOpenStatus();

        // ── Booking Form Select Label & WhatsApp Submit ──────────────────
        const serviceSelect = document.getElementById('booking-service');
        if (serviceSelect) {
            const check = () => serviceSelect.classList.toggle('has-value', !!serviceSelect.value);
            check(); serviceSelect.addEventListener('change', check);
        }

        const appointmentForm = document.getElementById('appointment-form');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fields = {
                    name:    document.getElementById('booking-name'),
                    phone:   document.getElementById('booking-phone'),
                    service: document.getElementById('booking-service'),
                    time:    document.getElementById('booking-time')
                };
                let valid = true;
                Object.values(fields).forEach(inp => {
                    if (!inp || !inp.value.trim()) {
                        valid = false;
                        if (inp) {
                            inp.style.borderColor = '#ef4444';
                            inp.addEventListener('input', function fix() { this.style.borderColor = ''; this.removeEventListener('input', fix); });
                        }
                    }
                });
                if (!valid) { alert('Please fill out all the fields before submitting.'); return; }

                let fmtTime = fields.time.value;
                try {
                    const dt = new Date(fields.time.value);
                    if (!isNaN(dt.getTime())) {
                        fmtTime = dt.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
                            + ' at ' + dt.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
                    }
                } catch (_) { /* keep raw value */ }

                const msg = `Hi Vital Dental, I would like to request an appointment:\n\n*Name:* ${fields.name.value.trim()}\n*Phone:* ${fields.phone.value.trim()}\n*Service:* ${fields.service.value}\n*Preferred Date/Time:* ${fmtTime}`;
                window.open(`https://wa.me/919286898353?text=${encodeURIComponent(msg)}`, '_blank');
            });
        }

        // ══════════════════════════════════════════════════════════════════
        //  MOTION-GATED ANIMATIONS
        // ══════════════════════════════════════════════════════════════════
        if (allowMotion) {

            // ── System 1: Universal [data-reveal] ────────────────────────
            document.querySelectorAll('[data-reveal]').forEach(el => {
                // Skip accordion rows (they have their own stagger)
                if (el.classList.contains('accordion-row')) return;
                // Skip elements handled by section-specific code
                if (el.closest('.contact-left') || el.closest('.contact-right')) return;
                if (el.closest('.about-left') || el.closest('.about-content')) return;

                gsap.fromTo(el,
                    { yPercent: 18, opacity: 0 },
                    {
                        yPercent: 0, opacity: 1, duration: 1, ease: "power3.out",
                        scrollTrigger: {
                            trigger: el, start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // ── [data-reveal-stagger] parents → stagger children ─────────
            document.querySelectorAll('[data-reveal-stagger]').forEach(parent => {
                const children = parent.children;
                if (children.length === 0) return;
                gsap.fromTo(children,
                    { yPercent: 18, opacity: 0 },
                    {
                        yPercent: 0, opacity: 1, duration: 1, stagger: 0.08, ease: "power3.out",
                        scrollTrigger: {
                            trigger: parent, start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // ── System 2: Headline Mask Reveal ───────────────────────────
            // Apply to all section H2s
            document.querySelectorAll('.section-header h2, .results-title, .about-title, .booking-card h3').forEach(h2 => {
                const lines = splitIntoLines(h2);
                if (lines.length > 0) {
                    gsap.fromTo(lines,
                        { yPercent: 110 },
                        {
                            yPercent: 0, duration: 1, stagger: 0.08, ease: "expo.out",
                            scrollTrigger: {
                                trigger: h2, start: "top 85%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }
            });

            // ── System 3: Parallax [data-parallax] ───────────────────────
            if (window.matchMedia("(pointer: fine)").matches) {
                document.querySelectorAll('[data-parallax]').forEach(el => {
                    const speed = parseFloat(el.getAttribute('data-speed') || '-15');
                    gsap.to(el, {
                        yPercent: speed, ease: "none",
                        scrollTrigger: {
                            trigger: el.closest('section') || el.parentElement,
                            start: "top bottom", end: "bottom top", scrub: true
                        }
                    });
                });
            }

            // ── System 4: Counters [data-count] ─────────────────────────
            const countEls = document.querySelectorAll('[data-count]');
            if (countEls.length > 0) {
                // Initialize to 0
                countEls.forEach(el => {
                    const raw = el.getAttribute('data-count');
                    el.innerText = raw.includes('.') ? '0.0' : '0';
                });

                const counterParent = countEls[0].closest('.stats-band') || countEls[0].parentElement;
                ScrollTrigger.create({
                    trigger: counterParent,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        countEls.forEach(el => {
                            const raw = el.getAttribute('data-count');
                            const target = parseFloat(raw);
                            const isFloat = raw.includes('.');
                            const obj = { value: 0 };
                            gsap.to(obj, {
                                value: target, duration: 2.0, ease: "power3.out",
                                onUpdate: () => {
                                    el.innerText = isFloat ? obj.value.toFixed(1) : Math.floor(obj.value).toLocaleString();
                                }
                            });
                        });
                    }
                });
            }

            // ── System 5: Magnetic Buttons ───────────────────────────────
            if (window.matchMedia("(pointer: fine)").matches) {
                document.querySelectorAll('.btn, [data-magnetic]').forEach(btn => {
                    btn.addEventListener('mousemove', (e) => {
                        const rect = btn.getBoundingClientRect();
                        const x = e.clientX - rect.left - rect.width / 2;
                        const y = e.clientY - rect.top - rect.height / 2;
                        gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
                        const span = btn.querySelector('span');
                        if (span) gsap.to(span, { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: "power2.out" });
                    });
                    btn.addEventListener('mouseleave', () => {
                        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                        const span = btn.querySelector('span');
                        if (span) gsap.to(span, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
                    });
                });
            }

            // ══════════════════════════════════════════════════════════════
            //  SECTION-SPECIFIC ANIMATIONS
            // ══════════════════════════════════════════════════════════════

            // ── Hero Load Sequence & Preloader ───────────────────────────
            const preloader = document.getElementById('preloader');
            const preloaderNum = document.querySelector('.preloader-number');

            const playHeroTimeline = () => {
                const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
                heroTl
                    .fromTo('.hero-eyebrow',    { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.0)
                    .fromTo('.h1-line',          { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.08, ease: "expo.out" }, 0.1)
                    .fromTo('.draw-underline',   { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.out" }, 0.5)
                    .fromTo('.hero-subcopy',     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.6)
                    .fromTo('.hero-actions > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 0.7)
                    .fromTo('.hero-trust-row',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.8)
                    .fromTo('.hero-image-wrapper',
                        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
                        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.4, ease: "power3.out" }, 0.3)
                    .fromTo(['.circular-badge', '.hero-pill-card'],
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" }, 0.9);

                // Hero parallax
                if (window.matchMedia("(pointer: fine)").matches) {
                    gsap.to('.hero-image-wrapper img', {
                        yPercent: -12, ease: "none",
                        scrollTrigger: { trigger: '#hero', start: "top top", end: "bottom top", scrub: true }
                    });
                }
            };

            if (preloader && preloaderNum) {
                // Pause scrolling during preload
                if (window.lenis) window.lenis.stop();

                const valObj = { value: 0 };
                const preloaderTl = gsap.timeline({
                    onComplete: () => {
                        preloader.style.display = 'none';
                        if (window.lenis) window.lenis.start();
                    }
                });

                preloaderTl
                    // 1. Count 0 to 100
                    .to(valObj, {
                        value: 100,
                        duration: 0.8,
                        ease: "none",
                        onUpdate: () => {
                            preloaderNum.innerText = Math.floor(valObj.value);
                        }
                    })
                    // 2. Fade out text/svg content
                    .to('.preloader-content', {
                        opacity: 0,
                        y: -30,
                        duration: 0.3,
                        ease: "power2.in"
                    }, "-=0.05")
                    // 3. Wipe curtain up
                    .to(preloader, {
                        yPercent: -100,
                        duration: 0.5,
                        ease: "power3.inOut"
                    }, "-=0.1")
                    // 4. Trigger hero animations
                    .add(() => {
                        playHeroTimeline();
                    }, "-=0.3");
            } else {
                // If preloader is missing, just trigger hero loading immediately
                playHeroTimeline();
            }

            // ── Card Grid Entrances ──────────────────────────────────────
            document.querySelectorAll('.services-grid, .testimonials-track, .blog-grid, .services-detail-grid').forEach(grid => {
                const cards = grid.querySelectorAll('.service-card, .testimonial-card, .blog-card, .detail-card');
                if (cards.length > 0) {
                    gsap.fromTo(cards,
                        { y: 80, opacity: 0, rotationX: -15 },
                        {
                            y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: "back.out(1.5)",
                            scrollTrigger: { trigger: grid, start: "top 80%", toggleActions: "play none none reverse" }
                        }
                    );
                }
            });

            // ── Image Reveals ────────────────────────────────────────────
            gsap.utils.toArray('.about-image img, .article-content img:not(.whatsapp-icon)').forEach(el => {
                gsap.fromTo(el,
                    { scale: 1.1, opacity: 0, clipPath: "inset(10% 10% 10% 10% round 15px)" },
                    {
                        scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 15px)", duration: 1.2, ease: "power4.out",
                        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
                    }
                );
            });

            // ── General .fade-in (legacy support) ────────────────────────
            gsap.utils.toArray('.fade-in').forEach(el => {
                gsap.fromTo(el,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)",
                        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
                    }
                );
            });

            // ── WhatsApp Float Oscillation ───────────────────────────────
            gsap.to('.whatsapp-float', { y: -10, repeat: -1, yoyo: true, duration: 1.5, ease: "sine.inOut" });

            // ── Accordion Rows Stagger ────────────────────────────────────
            const accordionRows = document.querySelectorAll('.accordion-row[data-reveal]');
            if (accordionRows.length > 0) {
                gsap.fromTo(accordionRows,
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out",
                        scrollTrigger: { trigger: '.accordion-list', start: "top 80%", toggleActions: "play none none reverse" }
                    }
                );
            }

            // ── Accordion Interaction (Desktop Hover & Mobile Tap) ───────
            const rows = document.querySelectorAll('.accordion-row');
            rows.forEach(row => {
                const href = row.getAttribute('data-href');
                const body = row.querySelector('.accordion-body');
                const img = row.querySelector('.accordion-image-wrapper');
                const desc = row.querySelector('.accordion-desc');
                const arrow = row.querySelector('.accordion-arrow');

                row.addEventListener('click', (e) => {
                    if (!window.matchMedia("(max-width: 767px)").matches) {
                        window.location.href = href;
                    } else {
                        const isOpen = row.classList.contains('active');
                        if (isOpen) {
                            if (e.target.closest('.accordion-link')) return;
                            row.classList.remove('active');
                            gsap.to(body, { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
                            gsap.to(arrow, { rotation: 0, duration: 0.3 });
                        } else {
                            rows.forEach(r => {
                                if (r !== row && r.classList.contains('active')) {
                                    r.classList.remove('active');
                                    gsap.to(r.querySelector('.accordion-body'), { height: 0, opacity: 0, duration: 0.3 });
                                    gsap.to(r.querySelector('.accordion-arrow'), { rotation: 0, duration: 0.3 });
                                }
                            });
                            row.classList.add('active');
                            gsap.to(body, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
                            gsap.to(arrow, { rotation: 90, duration: 0.3 });
                        }
                    }
                });

                if (window.matchMedia("(pointer: fine)").matches) {
                    row.addEventListener('mouseenter', () => {
                        gsap.to(row, { backgroundColor: "var(--brand)", color: "var(--bg)", duration: 0.4, ease: "power2.out" });
                        gsap.to(body, { height: "auto", duration: 0.4, ease: "power2.out" });
                        gsap.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
                        gsap.fromTo(img, { opacity: 0, scale: 0.9, x: 20 }, { opacity: 1, scale: 1, x: 0, duration: 0.4 });
                        gsap.to(arrow, { rotation: 45, duration: 0.3 });
                    });
                    row.addEventListener('mouseleave', () => {
                        gsap.to(row, { backgroundColor: "transparent", color: "var(--ink)", duration: 0.4 });
                        gsap.to(body, { height: 0, duration: 0.4 });
                        gsap.to(desc, { opacity: 0, y: 15, duration: 0.2 });
                        gsap.to(img, { opacity: 0, scale: 0.9, x: 20, duration: 0.2 });
                        gsap.to(arrow, { rotation: 0, duration: 0.3 });
                    });
                }
            });

            // ── About Section Parallax & Reveals ─────────────────────────
            if (document.querySelector('#about')) {
                gsap.fromTo('.about-image-wrapper',
                    { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 },
                    {
                        clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "power3.out",
                        scrollTrigger: { trigger: '.about-left', start: "top 80%", toggleActions: "play none none reverse" }
                    }
                );

                if (window.matchMedia("(pointer: fine)").matches) {
                    gsap.to('.about-image-wrapper img', {
                        yPercent: -15, ease: "none",
                        scrollTrigger: { trigger: '#about', start: "top bottom", end: "bottom top", scrub: true }
                    });
                    gsap.to('.about-bg-text', {
                        y: -80, ease: "none",
                        scrollTrigger: { trigger: '#about', start: "top bottom", end: "bottom top", scrub: true }
                    });
                }

                const quoteText = document.querySelector('.about-quote .quote-text');
                if (quoteText) {
                    const words = quoteText.querySelectorAll('.word');
                    if (words.length > 0) {
                        gsap.fromTo(words,
                            { y: 15, opacity: 0 },
                            {
                                y: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power3.out",
                                scrollTrigger: { trigger: '.about-quote', start: "top 85%", toggleActions: "play none none reverse" }
                            }
                        );
                    }
                }

                gsap.fromTo('.quote-author',
                    { opacity: 0, y: 10 },
                    {
                        opacity: 1, y: 0, duration: 1.0, delay: 0.4, ease: "power2.out",
                        scrollTrigger: { trigger: '.about-quote', start: "top 85%", toggleActions: "play none none reverse" }
                    }
                );

                gsap.fromTo('.amenity-chip',
                    { y: 20, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)",
                        scrollTrigger: { trigger: '.about-amenities', start: "top 85%", toggleActions: "play none none reverse" }
                    }
                );
            }

            // ── Real Results Slider Reveal & Auto-Demo ───────────────────
            if (slider) {
                gsap.fromTo('.results-title, .results-subcopy, .results-tabs-container',
                    { y: 30, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
                        scrollTrigger: { trigger: '.results-section', start: "top 80%", toggleActions: "play none none reverse" }
                    }
                );
                gsap.fromTo('.comparison-slider-container',
                    { scale: 0.95, opacity: 0 },
                    {
                        scale: 1, opacity: 1, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: '.results-section', start: "top 75%", toggleActions: "play none none reverse" }
                    }
                );

                ScrollTrigger.create({
                    trigger: slider, start: "top 70%", once: true,
                    onEnter: () => {
                        if (isDragging) return;
                        isAutoDemoPlaying = true;
                        const obj = { pos: 50 };
                        autoDemoTween = gsap.timeline({
                            onUpdate: () => setSliderPosition(obj.pos),
                            onComplete: () => { isAutoDemoPlaying = false; }
                        });
                        autoDemoTween
                            .to(obj, { pos: 20, duration: 0.8, ease: "power2.out" })
                            .to(obj, { pos: 80, duration: 1.2, ease: "power2.inOut" })
                            .to(obj, { pos: 50, duration: 0.8, ease: "power2.in" });
                    }
                });
            }

            // ── Contact Section Reveal & Form Stagger ────────────────────
            if (document.querySelector('.contact-section')) {
                gsap.fromTo('.contact-left',
                    { x: -50, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: '.contact-section', start: "top 75%", toggleActions: "play none none reverse" }
                    }
                );
                gsap.fromTo('.contact-right',
                    { x: 50, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: '.contact-section', start: "top 75%", toggleActions: "play none none reverse" }
                    }
                );
                gsap.fromTo('.booking-card .form-group, .booking-card .submit-btn',
                    { y: 20, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out",
                        scrollTrigger: { trigger: '.booking-card', start: "top 80%", toggleActions: "play none none reverse" }
                    }
                );
            }

            // ── Footer Animations ────────────────────────────────────────
            if (document.querySelector('.footer')) {
                if (window.innerWidth > 768) {
                    gsap.fromTo('.footer-content-wrap',
                        { yPercent: -20 },
                        {
                            yPercent: 0, ease: "none",
                            scrollTrigger: { trigger: '.footer', start: "top bottom", end: "bottom bottom", scrub: true }
                        }
                    );
                }
                gsap.fromTo('.footer-cta-band',
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1.0, ease: "power3.out",
                        scrollTrigger: { trigger: '.footer-cta-band', start: "top 90%", toggleActions: "play none none reverse" }
                    }
                );
                gsap.fromTo('.footer-column',
                    { y: 50, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
                        scrollTrigger: { trigger: '.footer-main-grid', start: "top 85%", toggleActions: "play none none reverse" }
                    }
                );
                gsap.fromTo('.footer-giant-wordmark',
                    { opacity: 0, scale: 0.96 },
                    {
                        opacity: 1, scale: 1, duration: 1.2, ease: "power2.out",
                        scrollTrigger: { trigger: '.footer-giant-wordmark', start: "top 95%", toggleActions: "play none none reverse" }
                    }
                );
            }

        } else {
            // ── Reduced Motion: Static Fallback ──────────────────────────
            const preloaderFallback = document.getElementById('preloader');
            if (preloaderFallback) preloaderFallback.style.display = 'none';
            gsap.set('.h1-line', { yPercent: 0 });
            gsap.set('.draw-underline', { scaleX: 1 });
            gsap.set('.hero-eyebrow, .hero-subcopy, .hero-actions, .hero-trust-row', { opacity: 1, y: 0 });
            gsap.set('.hero-image-wrapper', { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
            gsap.set(['.circular-badge', '.hero-pill-card'], { opacity: 1, scale: 1 });
            gsap.set('.about-image-wrapper', { clipPath: "inset(0% 0% 0% 0%)", scale: 1 });
            gsap.set('.about-bg-text', { y: 0 });
            gsap.set('.about-image-wrapper img', { yPercent: 0 });
            gsap.set('.line-inner', { yPercent: 0 });
            gsap.set('[data-reveal]', { yPercent: 0, opacity: 1 });
            revealAll();
        }

        // ── System: Pinned & Scrubbed Process Section ────────────────
        const processSection = document.getElementById('process');
        const lottieContainer = document.getElementById('process-lottie');
        const stepItems = document.querySelectorAll('.process-step-item');
        const progressFill = document.querySelector('.process-progress-fill');

        if (processSection && lottieContainer && typeof lottie !== 'undefined') {
            const anim = lottie.loadAnimation({
                container: lottieContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: window.toothCleanLottieData,
                rendererSettings: {
                    progressiveLoad: true,
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });

            const startScrollTrigger = () => {
                const totalFrames = anim.totalFrames;
                ScrollTrigger.refresh();

                if (!allowMotion) {
                    // Reduced Motion: Freeze Lottie at final frame and show steps statically
                    anim.goToAndStop(totalFrames - 1, true);
                    gsap.set(stepItems, { opacity: 1, scale: 1 });
                    return;
                }

                const isDesktop = window.matchMedia("(min-width: 992px)").matches;

                if (isDesktop) {
                    // Create a playhead object to animate smoothly via GSAP scrub
                    const playhead = { frame: 0, progress: 0 };

                    gsap.to(playhead, {
                        frame: totalFrames - 1,
                        progress: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: processSection,
                            start: "top top",
                            end: "+=180%",
                            pin: true,
                            scrub: 1,
                            invalidateOnRefresh: true
                        },
                        onUpdate: () => {
                            // 1. Scrub Lottie frame smoothly
                            anim.goToAndStop(playhead.frame, true);

                            // 2. Animate vertical progress line height
                            if (progressFill) {
                                progressFill.style.height = `${playhead.progress * 100}%`;
                            }

                            // 3. Highlight step items based on progress
                            const progress = playhead.progress;
                            let activeIndex = 0;
                            if (progress < 0.33) {
                                activeIndex = 0;
                            } else if (progress < 0.66) {
                                activeIndex = 1;
                            } else {
                                activeIndex = 2;
                            }

                            stepItems.forEach((item, idx) => {
                                if (idx === activeIndex) {
                                    if (!item.classList.contains('active')) {
                                        item.classList.add('active');
                                        gsap.to(item, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
                                    }
                                } else {
                                    if (item.classList.contains('active')) {
                                        item.classList.remove('active');
                                        gsap.to(item, { opacity: 0.3, scale: 0.97, duration: 0.3, ease: "power2.out", overwrite: "auto" });
                                    }
                                }
                            });
                        }
                    });
                } else {
                    // Mobile fallback: stack normally and play Lottie once on enter
                    gsap.set(stepItems, { opacity: 1, scale: 1 });
                    ScrollTrigger.create({
                        trigger: processSection,
                        start: "top 75%",
                        onEnter: () => {
                            anim.play();
                        }
                    });
                }
            };

            // If Lottie loads the animation synchronously (common with local animationData),
            // totalFrames is available immediately. Otherwise, listen for DOMLoaded.
            if (anim.isLoaded || anim.totalFrames > 0) {
                startScrollTrigger();
            } else {
                anim.addEventListener('DOMLoaded', startScrollTrigger);
            }
        }

        // ── ScrollTrigger Refresh: Fonts, Resize & Page Load ─────────────
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
        });

    } catch (err) {
        console.error('Animation error, falling back:', err);
        revealAll();
    }
}

// Bulletproof execution
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initAnimations();
} else {
    window.addEventListener('load', initAnimations);
}
