/* =========================================================
   facilities.js
   Page-specific behaviour for the Facilities page.
   Nav + footer are handled globally by main.js
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    // --- Scroll Fade-Up (Intersection Observer) ---
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const fadeEls = document.querySelectorAll(".fade-up");
  
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px",
        }
      );
  
      fadeEls.forEach((el) => observer.observe(el));
    } else {
      // Reduced motion: make all elements visible immediately
      document.querySelectorAll(".fade-up").forEach((el) => {
        el.classList.add("visible");
      });
    }
  
  });