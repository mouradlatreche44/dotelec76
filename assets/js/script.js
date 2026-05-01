/* Dot'elec76 — Script léger (vanilla JS)
   - Header scroll state
   - Mobile menu toggle
   - Scroll reveal (IntersectionObserver)
   - Reviews carousel (arrows + dots + swipe)
   - Before/After slider (range input)
   - Footer year
*/
(function () {
  'use strict';

  // ============== HEADER SCROLL ==============
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============== MOBILE MENU ==============
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    const closeMenu = () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    menuBtn.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('active');
      menuBtn.classList.toggle('active', open);
      mobileMenu.classList.toggle('active', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
    });
  }

  // ============== SCROLL REVEAL ==============
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // ============== REVIEWS CAROUSEL ==============
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.reviews-track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    if (!track) return;

    const cards = Array.from(track.children);
    if (!cards.length) return;

    // Build dots (1 per card, but on desktop we show 3 cards so reduce dots)
    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const visible = Math.max(1, Math.floor(track.clientWidth / cards[0].clientWidth));
      const pages = Math.max(1, cards.length - visible + 1);
      for (let i = 0; i < pages; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Aller à l'avis ${i + 1}`);
        b.addEventListener('click', () => scrollToIndex(i));
        dotsWrap.appendChild(b);
      }
      updateDots();
    };

    const updateDots = () => {
      if (!dotsWrap) return;
      const cardW = cards[0].getBoundingClientRect().width + 24; // gap 1.5rem
      const idx = Math.round(track.scrollLeft / cardW);
      dotsWrap.querySelectorAll('button').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });
    };

    const scrollToIndex = (i) => {
      const cardW = cards[0].getBoundingClientRect().width + 24;
      track.scrollTo({ left: cardW * i, behavior: 'smooth' });
    };

    const scrollByCard = (dir) => {
      const cardW = cards[0].getBoundingClientRect().width + 24;
      track.scrollBy({ left: cardW * dir, behavior: 'smooth' });
    };

    if (prev) prev.addEventListener('click', () => scrollByCard(-1));
    if (next) next.addEventListener('click', () => scrollByCard(1));
    track.addEventListener('scroll', updateDots, { passive: true });
    window.addEventListener('resize', buildDots);

    buildDots();
  });

  // ============== BEFORE / AFTER SLIDER ==============
  document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
    const range = slider.querySelector('.ba-slider__range');
    if (!range) return;
    const update = () => {
      slider.style.setProperty('--ba-cut', range.value + '%');
    };
    range.addEventListener('input', update);
    range.addEventListener('change', update);
    update();
  });

  // ============== FOOTER YEAR ==============
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
