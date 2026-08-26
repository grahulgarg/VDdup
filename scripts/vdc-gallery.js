/* ============================================================
   GALLERY — category filters + lightbox
   Vanilla; degrades to a plain photo wall without JS.
   ============================================================ */
(function () {
    "use strict";

    var grid = document.getElementById("vgal-grid");
    var lb = document.getElementById("vgal-lightbox");
    if (!grid || !lb) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(".vgal-item"));
    var filters = Array.prototype.slice.call(document.querySelectorAll(".vgal-f"));
    var lbImg = document.getElementById("vgal-lb-img");
    var lbCap = document.getElementById("vgal-lb-cap");
    var btnClose = lb.querySelector(".vgal-lb-close");
    var btnPrev = lb.querySelector(".vgal-lb-prev");
    var btnNext = lb.querySelector(".vgal-lb-next");

    /* ---------- keyboard reachability ---------- */
    items.forEach(function (el) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        var cap = el.getAttribute("data-caption") || "";
        el.setAttribute("aria-label", "View photograph: " + cap);
    });

    /* ---------- filters ---------- */
    function applyFilter(cat) {
        items.forEach(function (el) {
            var show = cat === "all" || el.getAttribute("data-cat") === cat;
            el.classList.toggle("is-hidden", !show);
        });
        if (window.ScrollTrigger) ScrollTrigger.refresh();
    }

    filters.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filters.forEach(function (b) {
                b.classList.remove("is-on");
                b.setAttribute("aria-selected", "false");
            });
            btn.classList.add("is-on");
            btn.setAttribute("aria-selected", "true");
            applyFilter(btn.getAttribute("data-filter"));
        });
    });

    /* ---------- lightbox ---------- */
    var current = -1;

    function visibleItems() {
        return items.filter(function (el) { return !el.classList.contains("is-hidden"); });
    }

    function show(el) {
        var full = el.getAttribute("data-full");
        var thumb = el.querySelector("img");
        lbImg.src = full || (thumb ? thumb.src : "");
        lbImg.alt = thumb ? thumb.alt : "";
        lbCap.textContent = el.getAttribute("data-caption") || "";
        current = visibleItems().indexOf(el);
    }

    function open(el) {
        show(el);
        lb.hidden = false;
        document.body.classList.add("vgal-locked");
        if (window.lenis) window.lenis.stop();
        requestAnimationFrame(function () { lb.classList.add("is-open"); });
        btnClose.focus();
    }

    function close() {
        lb.classList.remove("is-open");
        document.body.classList.remove("vgal-locked");
        if (window.lenis) window.lenis.start();
        setTimeout(function () {
            lb.hidden = true;
            lbImg.src = "";
            if (current > -1) {
                var back = visibleItems()[current];
                if (back) back.focus();
            }
        }, 320);
    }

    function step(dir) {
        var list = visibleItems();
        if (!list.length) return;
        current = (current + dir + list.length) % list.length;
        show(list[current]);
    }

    items.forEach(function (el) {
        el.addEventListener("click", function () { open(el); });
        el.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(el); }
        });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { step(-1); });
    btnNext.addEventListener("click", function () { step(1); });

    lb.addEventListener("click", function (e) {
        // click the backdrop (not the image or a control) to dismiss
        if (e.target === lb || e.target.classList.contains("vgal-lb-figure")) close();
    });

    document.addEventListener("keydown", function (e) {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowLeft") step(-1);
        else if (e.key === "ArrowRight") step(1);
    });

    /* ---------- gentle entrance ---------- */
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(items,
            { y: 26, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8, stagger: 0.035, ease: "power3.out",
                scrollTrigger: window.ScrollTrigger ? { trigger: grid, start: "top 88%" } : undefined
            }
        );
    }
})();
