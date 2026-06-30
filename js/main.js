/* =========================================================
   main.js
   Global site-wide behavior: Navbar (mobile toggle + scroll
   hide/show). Used across every page (homepage, academics,
   contact, etc.)
   ========================================================= */

   const header = document.querySelector('.header');
   const navLinks = document.getElementById('navLinks');
   const navToggle = document.getElementById('navToggle');
   
   /* Flag JS as active so CSS entrance-animation rules (gated on .js) can apply */
   document.documentElement.classList.add('js');
   
   /* =========================================================
      Mobile menu toggle
      ========================================================= */
   navToggle.addEventListener('click', () => {
       navLinks.classList.toggle('nav-open');
       const icon = navToggle.querySelector('i');
       icon.className = navLinks.classList.contains('nav-open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
   });
   
   navLinks.querySelectorAll('a').forEach(link => {
       link.addEventListener('click', () => {
           navLinks.classList.remove('nav-open');
           navToggle.querySelector('i').className = 'fa-solid fa-bars';
       });
   });
   
   /* =========================================================
      Shadow + hide-on-scroll-down / show-on-scroll-up
      ========================================================= */
   let lastScrollY = window.scrollY;
   let ticking = false;
   
   function updateHeader() {
       const currentScrollY = window.scrollY;
       if (currentScrollY > 10) {
           header.classList.add('scrolled');
       } else {
           header.classList.remove('scrolled');
       }
       if (navLinks.classList.contains('nav-open')) {
           header.classList.remove('header-hidden');
       } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
           header.classList.add('header-hidden');
       } else if (currentScrollY < lastScrollY) {
           header.classList.remove('header-hidden');
       }
       lastScrollY = currentScrollY;
       ticking = false;
   }
   
   window.addEventListener('scroll', () => {
       if (!ticking) {
           requestAnimationFrame(updateHeader);
           ticking = true;
       }
   });