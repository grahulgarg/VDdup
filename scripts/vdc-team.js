/* ============================================================
   OUR DOCTORS — scroll reveals
   Sections fade up as they come into view, only when the visitor
   allows motion. Everything is readable without this script.
   ============================================================ */
(function () {
  "use strict";

  const page = document.querySelector(".vt");
  if (!page) return;

  const items = page.querySelectorAll(".vt-rv");
  const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!allowMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }

  page.classList.add("vt-motion");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px" });
  items.forEach((el) => io.observe(el));
})();
