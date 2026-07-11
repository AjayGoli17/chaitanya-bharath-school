/* =========================================================
   gallery.js  —  Filter tabs, scroll reveals, inline video slider
   ========================================================= */

   function initGalleryPage() {

    /* ── 1. FILTER TABS ── */
    const tabs  = document.querySelectorAll('.filter-tabs button');
    const items = document.querySelectorAll('.g-item');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // swap active state
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
  
        const filter = tab.getAttribute('data-filter');
  
        items.forEach((item, i) => {
          const match = filter === 'All' || item.getAttribute('data-category') === filter;
  
          if (match) {
            // show with staggered entrance animation
            item.style.display = '';
            item.classList.remove('filter-show', 'visible');
            // force reflow so the animation re-triggers
            void item.offsetWidth;
            item.classList.add('filter-show', 'visible');
            item.style.animationDelay = (i % 6) * 0.07 + 's';
          } else {
            item.style.display = 'none';
            item.classList.remove('filter-show', 'visible');
          }
        });
      });
    });
  
  
    /* ── 2. SCROLL-REVEAL (IntersectionObserver) ── */
    const revealEls = document.querySelectorAll('.scroll-reveal, .reveal-item');
  
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // slight stagger for items inside the same batch
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  
    // assign stagger delays to items already visible in viewport on load
    revealEls.forEach((el, i) => {
      if (el.classList.contains('reveal-item')) {
        el.dataset.revealDelay = (i % 6) * 70;
      }
      revealObs.observe(el);
    });
  
  
    /* ── 3. INLINE VIDEOS ──
       Featured video + video cards use native <video> elements with a
       custom play/pause button overlay (.video-toggle-btn). Clicking
       the button toggles playback on its associated <video>, swaps the
       play/pause icon, and pauses any other currently-playing video so
       only one plays at a time. */
    const videoWraps = document.querySelectorAll('.video-wrap');

    videoWraps.forEach(wrap => {
      const video  = wrap.querySelector('video');
      const btn    = wrap.querySelector('.video-toggle-btn');
      if (!video || !btn) return;

      const iconPlay  = btn.querySelector('.icon-play');
      const iconPause = btn.querySelector('.icon-pause');

      function showPauseIcon() {
        if (iconPlay)  iconPlay.style.display  = 'none';
        if (iconPause) iconPause.style.display = '';
        btn.setAttribute('aria-label', 'Pause video');
        wrap.classList.add('is-playing');       // ← hides button via CSS
      }

      function showPlayIcon() {
        if (iconPlay)  iconPlay.style.display  = '';
        if (iconPause) iconPause.style.display = 'none';
        btn.setAttribute('aria-label', 'Play video');
        wrap.classList.remove('is-playing');    // ← shows button via CSS
      }

      btn.addEventListener('click', () => {
        if (video.paused) {
          video.muted = true;
          video.play();
        } else {
          video.pause();
        }
      });

      // Keep icon + wrapper class in sync no matter what triggers play/pause
      video.addEventListener('play',  showPauseIcon);
      video.addEventListener('pause', showPlayIcon);
      video.addEventListener('ended', showPlayIcon);
    });

    // Only one video plays at a time
    const allVideos = document.querySelectorAll('.featured-video-el, .video-card-el');
    allVideos.forEach(video => {
      video.addEventListener('play', () => {
        allVideos.forEach(other => {
          if (other !== video) other.pause();
        });
      });
    });
  
  
    /* ── 4. IMAGE SKELETON LOADER — remove shimmer once image loads ── */
    const galleryImgs = document.querySelectorAll('.g-item img');
    galleryImgs.forEach(img => {
      function onLoad() {
        if (img.closest('.g-item')) {
          img.closest('.g-item').style.animation = 'none';
          img.closest('.g-item').style.background = 'none';
        }
      }
      if (img.complete) { onLoad(); }
      else { img.addEventListener('load', onLoad); }
    });
  
  
    /* ── 5. FILTER TABS HORIZONTAL SCROLL INDICATOR (mobile) ── */
    const filterWrap = document.querySelector('.filter-tabs');
    if (filterWrap && window.innerWidth <= 560) {
      filterWrap.addEventListener('scroll', () => {
        const atEnd = filterWrap.scrollLeft + filterWrap.clientWidth >= filterWrap.scrollWidth - 4;
        filterWrap.style.maskImage = atEnd
          ? 'none'
          : 'linear-gradient(to right, #000 80%, transparent 100%)';
        filterWrap.style.webkitMaskImage = filterWrap.style.maskImage;
      }, { passive: true });
    }
  
  
    /* ── 6. VIDEO SLIDER DOT INDICATORS (mobile) ──
       On mobile, .video-grid becomes a 1-up swipe-snap slider.
       Build dots to reflect scroll position; tapping a dot scrolls
       to that card. Uses direct scrollLeft math (not scrollIntoView)
       so it never drags the whole page along with it. */
    const videoGrid = document.getElementById('videoGrid');
    const dotsWrap   = document.getElementById('videoSliderDots');

    if (videoGrid && dotsWrap) {
      const cards = Array.from(videoGrid.children);

      function buildDots() {
        dotsWrap.innerHTML = '';
        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Go to video ' + (i + 1));
          dot.addEventListener('click', () => {
            videoGrid.scrollTo({
              left: cards[i].offsetLeft - videoGrid.offsetLeft,
              behavior: 'smooth'
            });
          });
          dotsWrap.appendChild(dot);
        });
      }

      function updateActiveDot() {
        const dotEls = dotsWrap.querySelectorAll('.dot');
        if (!dotEls.length) return;
        const center = videoGrid.scrollLeft + videoGrid.clientWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
          const cardCenter = (card.offsetLeft - videoGrid.offsetLeft) + card.offsetWidth / 2;
          const dist = Math.abs(cardCenter - center);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
          }
        });
        dotEls.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
      }

      buildDots();
      updateActiveDot();

      let scrollTicking = false;
      videoGrid.addEventListener('scroll', () => {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(() => {
            updateActiveDot();
            scrollTicking = false;
          });
        }
      }, { passive: true });

      window.addEventListener('resize', updateActiveDot);
    }


    /* ── 7. VIDEO CARD ENTRANCE + "SWIPE ME" HINT (mobile only) ──
       On first load, mobile users land on a row of video cards with no
       indication it's a horizontally-swipeable slider. To fix that:
       1. Cards fade-up + scale in with a stagger, once the slider
          scrolls into view (uses IntersectionObserver, same pattern
          as section 2).
       2. Right after the entrance finishes, the whole track nudges a
          few px to the right and eases back — a quick, wordless cue
          that there's more content to swipe to. Runs once per page
          load, only if there's more than one card (i.e. something to
          actually swipe to). */
    if (videoGrid && window.innerWidth <= 560) {
      const videoCards = Array.from(videoGrid.querySelectorAll('.video-card'));

      videoCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(18px) scale(0.96)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transitionDelay = (i * 0.09) + 's';
      });

      let hintPlayed = false;

      function playSwipeHint() {
        if (hintPlayed || videoCards.length < 2) return;
        hintPlayed = true;

        videoGrid.style.scrollSnapType = 'none';
        videoGrid.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        videoGrid.style.transform = 'translateX(-28px)';

        setTimeout(() => {
          videoGrid.style.transform = 'translateX(0)';
          setTimeout(() => {
            videoGrid.style.transition = '';
            videoGrid.style.transform = '';
            videoGrid.style.scrollSnapType = '';
          }, 480);
        }, 420);
      }

      const gridObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            videoCards.forEach((card, i) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, i * 90);
            });

            // fire the swipe hint once cards have finished animating in
            const totalEntrance = videoCards.length * 90 + 500;
            setTimeout(playSwipeHint, totalEntrance + 250);

            gridObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      gridObs.observe(videoGrid);

      // If the user starts swiping manually before the hint fires,
      // cancel it so it doesn't fight their own scroll gesture.
      videoGrid.addEventListener('touchstart', () => { hintPlayed = true; }, { passive: true, once: true });
    }

  }

  window.initGalleryPage = initGalleryPage;

  // Fallback: if js/gallery-render.js isn't present for some reason,
  // still run the static behaviour on the hardcoded markup.
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.__galleryRenderPending) {
      initGalleryPage();
    }
  });