/* Prevent placeholder "#" links (e.g. Enquire Now, Get Directions) from jumping to top */
document.querySelectorAll('a[href="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) { e.preventDefault(); });
});

/* ===== SCROLL ANIMATIONS ===== */

/* 1. Fade-up on scroll — philosophy grid, section headers, CTA, beyond section */
const fadeUpEls = document.querySelectorAll(
    '.section-header, .cta-banner, .beyond-text, .beyond-image'
);
fadeUpEls.forEach(el => el.classList.add('fade-up'));

/* 2. Stagger entrance — philosophy grid cards */
const philGrid = document.querySelector('.philosophy-grid');
if (philGrid) philGrid.classList.add('stagger-children');

/* 3. Stage text blocks fade-up */
document.querySelectorAll('.stage-i-text, .stage-ii-text, .stage-iii-text').forEach(el => {
    el.classList.add('fade-up');
});


/* 4. Info cards stagger — beyond section */
const cardList = document.querySelector('.card-list');
if (cardList) cardList.classList.add('card-list-stagger');

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
    '.fade-up, .stagger-children, .img-reveal, .floating-badge, .card-list-stagger'
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