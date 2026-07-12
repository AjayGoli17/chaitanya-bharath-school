document.addEventListener("DOMContentLoaded", () => {

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Scroll Reveal (Intersection Observer) ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  // Reusable: call this after injecting new .reveal elements into the DOM
  // (e.g. cms-content.js adding cards after fetching from GitHub).
  window.observeReveal = function (root) {
    const scope = root || document;
    const els = scope.querySelectorAll(".reveal:not(.in-view)");
    if (reduceMotion) {
      els.forEach(el => el.classList.add("in-view"));
    } else {
      els.forEach(el => revealObserver.observe(el));
    }
  };

  window.observeReveal();

});