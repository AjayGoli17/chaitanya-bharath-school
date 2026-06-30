/* =========================================================
   faculty.js
   Page-specific behaviour for the Faculty page.
   Nav + footer are handled globally by main.js
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    /* ── 1. SCROLL REVEAL — leader & teacher cards fade up on scroll ── */
    document.querySelectorAll(".leader-card, .teacher-card").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 0.09 + "s";
    });
  
    if (!reduceMotion) {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  
      document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));
    } else {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    }
  
    /* ── 2. IMAGE SKELETON SHIMMER ── */
    document.querySelectorAll(".leader-card img, .teacher-card img").forEach(img => {
      const card = img.closest(".leader-card, .teacher-card");
      if (!card) return;
  
      img.style.position = "relative";
      img.style.zIndex   = "1";
      card.classList.add("img-skeleton");
  
      const onLoad = () => card.classList.remove("img-skeleton");
      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      } else {
        img.addEventListener("load",  onLoad);
        img.addEventListener("error", onLoad);
      }
    });
  
    /* ── 3. FILTER TABS ── */
    const tabs   = document.querySelectorAll(".filter-tabs button");
    const blocks = document.querySelectorAll(".category-block");
  
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
  
        const filter = tab.getAttribute("data-filter");
  
        blocks.forEach(block => {
          if (block.getAttribute("data-category") === filter) {
            block.classList.add("active");
  
            if (!reduceMotion) {
              block.querySelectorAll(".reveal").forEach((card, i) => {
                card.classList.remove("is-visible");
                card.style.transitionDelay = i * 0.09 + "s";
                void card.offsetWidth;
                card.classList.add("is-visible");
              });
            }
          } else {
            block.classList.remove("active");
          }
        });
      });
    });
  
  });