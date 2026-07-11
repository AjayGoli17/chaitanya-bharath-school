/* Prevent placeholder "#" links (e.g. Enquire Now, Get Directions) from jumping to top */
document.querySelectorAll('a[href="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) { e.preventDefault(); });
});

/* ===== SCROLL ANIMATIONS ===== */

/* Fade-in + slide-up scroll reveal, triggered in independent groups of
   `groupSize` cards at a time — each group animates in only once that
   group scrolls into view, instead of the whole list revealing together. */
function initCardPairReveal(selector, groupSize = 2) {
    const items = Array.from(document.querySelectorAll(selector));
    if (!items.length) return;

    const groups = [];
    for (let i = 0; i < items.length; i += groupSize) {
        groups.push(items.slice(i, i + groupSize));
    }

    items.forEach(el => el.classList.add('reveal-pair'));
    groups.forEach(group => {
        group.forEach((el, idx) => {
            if (idx > 0) el.classList.add('reveal-pair-delay');
        });
    });

    const pairObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const group = groups.find(g => g.includes(entry.target));
            if (!group) return;
            group.forEach(el => {
                el.classList.add('visible');
                pairObserver.unobserve(el);
            });
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(el => pairObserver.observe(el));
}

/* 1. Fade-up on scroll — section headers, CTA, beyond section */
const fadeUpEls = document.querySelectorAll(
    '.section-header, .cta-banner, .beyond-text, .beyond-image'
);
fadeUpEls.forEach(el => el.classList.add('fade-up'));

/* 2. Philosophy grid cards — fade-in/slide-up scroll reveal, 2 cards per trigger */
initCardPairReveal('.philosophy-grid .card', 2);

/* 3. Stage text blocks fade-up */
document.querySelectorAll('.stage-i-text, .stage-ii-text, .stage-iii-text').forEach(el => {
    el.classList.add('fade-up');
});


/* 4. Info cards (beyond section) — same fade-in/slide-up reveal, 2 cards per trigger */
initCardPairReveal('.card-list .info-card', 2);

/* 5. Image pairs staggered reveal */
document.querySelectorAll('.comp-1-left, .comp-2-left, .comp-3 img').forEach(el => {
    el.classList.add('img-reveal');
});
document.querySelectorAll('.comp-1-right, .comp-2-right').forEach(el => {
    el.classList.add('img-reveal', 'delay-1');
});

/* IntersectionObserver — fires once when element enters viewport */
const observerOpts = { threshold: 0.15 };

const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
    });
}, observerOpts);

document.querySelectorAll(
    '.fade-up, .img-reveal, .floating-badge'
).forEach(el => io.observe(el));

/* 5. Stage label line draw — separate observer for the ::before line */
const lineObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('line-visible');
        lineObs.unobserve(entry.target);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stage-label').forEach(el => lineObs.observe(el));