/* =========================================================
   Event Video Cards: Play / Pause toggle
   ========================================================= */
function toggleVideo(wrapper) {
    const video = wrapper.querySelector('video');
    const btn   = wrapper.querySelector('.play-btn i');

    // Pause & mute every other card so only one plays at a time
    document.querySelectorAll('.event-vid').forEach(vid => {
        if (vid !== wrapper) {
            const v = vid.querySelector('video');
            const b = vid.querySelector('.play-btn i');
            if (v) { v.pause(); v.muted = true; }
            if (b) { b.classList.remove('fa-pause'); b.classList.add('fa-play'); }
            vid.classList.remove('playing');
        }
    });

    // Toggle play/pause on this card
    if (video.paused) {
        video.muted = true;
        video.play().catch(err => console.error('Video play failed:', err));
        btn.classList.remove('fa-play');
        btn.classList.add('fa-pause');
        wrapper.classList.add('playing');
    } else {
        video.pause();
        btn.classList.remove('fa-pause');
        btn.classList.add('fa-play');
        wrapper.classList.remove('playing');
    }
}

/* =========================================================
   Stacking Cards: fade/slide-in entrance (mobile/tablet)
   ========================================================= */
   (function () {
    const cards = document.querySelectorAll('.feature-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

    cards.forEach(card => observer.observe(card));
})();

/* =========================================================
   Testimonials Slider (mobile/tablet only)
   ========================================================= */
(function () {
    const slider = document.getElementById('testSlider');
    const prevBtn = document.getElementById('testPrev');
    const nextBtn = document.getElementById('testNext');
    const dotsContainer = document.getElementById('testDots');
    const hint = document.getElementById('testSwipeHint');

    if (!slider || !prevBtn || !nextBtn) return;

    const cards = slider.querySelectorAll('.test-card');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    let current = 0;
    const total = cards.length;

    function isSliderActive() {
        return window.innerWidth <= 1024;
    }

    // Cards are intentionally narrower than the wrapper on mobile so
    // the next card peeks in as a visual cue. That means a slide is
    // no longer 100% of the track width, so measure the real step
    // (card width + gap) instead of assuming 100%.
    function getSlideStep() {
        if (!cards[0]) return 0;
        const gap = parseFloat(getComputedStyle(slider).columnGap || getComputedStyle(slider).gap || '0');
        return cards[0].getBoundingClientRect().width + gap;
    }

    function goTo(index) {
        if (!isSliderActive()) return;
        if (cards[current]) {
            cards[current].style.opacity = '0.4';
            cards[current].style.transform = 'scale(0.97)';
        }
        current = (index + total) % total;
        slider.style.transform = `translateX(-${getSlideStep() * current}px)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        setTimeout(() => {
            if (cards[current]) {
                cards[current].style.opacity = '1';
                cards[current].style.transform = 'scale(1)';
            }
        }, 40);
        dismissHint();
    }

    // Swipe hint: fade in and nudge once the first time the section
    // scrolls into view on mobile, then disappear once the person
    // has interacted with the slider at all.
    let hintDismissed = false;
    function dismissHint() {
        if (!hint || hintDismissed) return;
        hintDismissed = true;
        hint.classList.remove('show', 'nudge');
    }

    if (hint && isSliderActive() && 'IntersectionObserver' in window) {
        const hintObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hintDismissed) {
                    hint.classList.add('show', 'nudge');
                    setTimeout(() => {
                        if (!hintDismissed) hint.classList.remove('nudge');
                    }, 2400);
                    setTimeout(dismissHint, 5000);
                    hintObserver.disconnect();
                }
            });
        }, { threshold: 0.4 });
        hintObserver.observe(slider);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    let touchStartX = 0;
    let touchStartY = 0;
    slider.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    slider.addEventListener('touchend', e => {
        if (!isSliderActive()) return;
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;
        // Only treat as a slide swipe if the movement is mostly horizontal.
        // A vertical page-scroll over the slider was previously being
        // misread as a swipe, which pushed the whole card track off-screen.
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            goTo(diffX > 0 ? current + 1 : current - 1);
        }
    });

    window.addEventListener('resize', () => {
        if (!isSliderActive()) {
            slider.style.transform = '';
            cards.forEach(c => { c.style.opacity = ''; c.style.transform = ''; });
        } else {
            slider.style.transform = `translateX(-${getSlideStep() * current}px)`;
        }
    });
})();

/* =========================================================
   ANIMATION 1 — Stats Counter (count-up on scroll)
   ========================================================= */
(function () {
    const statsCard = document.querySelector('.stats-card');
    if (!statsCard || !('IntersectionObserver' in window)) return;

    const statHeadings = statsCard.querySelectorAll('.stat-item h3');

    function easeOutQuad(t) { return t * (2 - t); }

    function countUp(el, target, duration) {
        const suffix = el.textContent.replace(/[0-9]/g, '');
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(easeOutQuad(progress) * target);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statHeadings.forEach(h3 => {
                    const raw = h3.textContent.trim();
                    const num = parseInt(raw.replace(/\D/g, ''), 10);
                    if (!isNaN(num)) countUp(h3, num, 1200);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsCard);
})();

/* =========================================================
   ANIMATION 2 — Section scroll-reveal
   NOTE: Events header is EXCLUDED here because it has a
   flex-row layout (title left, link right) — animating the
   whole wrapper hides both and breaks layout on mobile.
   Instead we animate only its inner children below.
   ========================================================= */
(function () {
    if (!('IntersectionObserver' in window)) return;

    const revealSelectors = [
        '.leadership .lead-image',
        '.leadership .lead-content',
        /* Why Choose — title + subtitle only, not the whole centered block */
        '.why-choose .section-title',
        '.why-choose .section-subtitle',
        /* Beyond the Classroom — whole header block (left-aligned, safe to animate) */
        '.beyond .section-header-new',
        /* Curriculum — whole header block */
        '.curriculum .section-header-new',
        /* Testimonials */
        '.testimonials .section-title',
        /* Safety */
        '.safety .safety-content',
        '.safety .safety-img',
        /* CTA */
        '.cta-container',
    ];

    revealSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
    });

    /* Events header has flex-row layout (title left, link right).
       Animating the wrapper collapses the row on mobile.
       Animate only its two direct children separately instead. */
    const eventsHeaderChildren = document.querySelectorAll('.events .section-header-new > *');
    eventsHeaderChildren.forEach(child => child.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* =========================================================
   ANIMATION 3 — Curriculum cards: slide from left & right
   ========================================================= */
(function () {
    if (!('IntersectionObserver' in window)) return;

    const grid = document.querySelector('.curriculum-grid-new');
    if (!grid) return;

    /* Foundation card (left col) = slide-left
       curr-right-col wrapper = slide-right
       On mobile (single col grid) we target each curr-card-new and alternate */
    function assignClasses() {
        if (window.innerWidth <= 1024) {
            /* Mobile: target individual cards inside the right col too */
            const allCards = grid.querySelectorAll('.curr-card-new');
            allCards.forEach((card, i) => {
                card.classList.remove('slide-left', 'slide-right');
                card.classList.add(i % 2 === 0 ? 'slide-left' : 'slide-right');
            });
        } else {
            /* Desktop: left col card slides left, right col wrapper slides right */
            const leftCard = grid.querySelector('.foundation-card');
            const rightCol = grid.querySelector('.curr-right-col');
            if (leftCard) { leftCard.classList.remove('slide-right'); leftCard.classList.add('slide-left'); }
            if (rightCol) { rightCol.classList.remove('slide-left'); rightCol.classList.add('slide-right'); }
        }
    }

    assignClasses();

    const targets = window.innerWidth <= 1024
        ? grid.querySelectorAll('.curr-card-new')
        : [grid.querySelector('.foundation-card'), grid.querySelector('.curr-right-col')].filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    targets.forEach(el => el && observer.observe(el));
})();

/* =========================================================
   ANIMATION 4 — Safety icons: scale-in on scroll (staggered)
   ========================================================= */
(function () {
    if (!('IntersectionObserver' in window)) return;

    const icons = document.querySelectorAll('.safety-icon');
    if (!icons.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('icon-visible'), i * 110);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    icons.forEach(icon => observer.observe(icon));
})();

/* =========================================================
   ANIMATION 5 — Events video cards: staggered fade+slide-up
   ========================================================= */
(function () {
    if (!('IntersectionObserver' in window)) return;

    const eventCards = document.querySelectorAll('.event-card');
    if (!eventCards.length) return;

    /* Mark them so CSS can hide them initially */
    eventCards.forEach(card => card.classList.add('event-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                /* Find this card's index among all event cards for stagger */
                const idx = Array.from(eventCards).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.remove('event-hidden');
                    entry.target.classList.add('event-visible');
                }, idx * 120);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    eventCards.forEach(card => observer.observe(card));
})();

/* =========================================================
   ANIMATION 6 — Gallery items (Beyond the Classroom):
   fade + scale-up on scroll, staggered
   ========================================================= */
(function () {
    if (!('IntersectionObserver' in window)) return;

    const galItems = document.querySelectorAll('.gal-item');
    if (!galItems.length) return;

    galItems.forEach(item => item.classList.add('gal-hidden'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(galItems).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.remove('gal-hidden');
                    entry.target.classList.add('gal-visible');
                }, idx * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    galItems.forEach(item => observer.observe(item));
})();
/* =========================================================
   Event-card video previews — Instagram Reels style.
   1. Force the browser to decode & paint the video's own real
      first frame as soon as metadata is available (no black
      box, no separate poster image needed).
   2. Only actually play a card's video once it scrolls into
      view, and pause it once it scrolls out — avoids every
      video fighting for bandwidth/decode time at once and
      matches how Reels/TikTok-style feeds behave.
   ========================================================= */
document.querySelectorAll('.event-vid video').forEach(video => {
    video.muted = true;
});
