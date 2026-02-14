document.addEventListener('DOMContentLoaded', () => {
  /* Scroll reveal */
  const revealEls = Array.from(document.querySelectorAll('.reveal'));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const markVisibleIfInView = () => {
    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) el.classList.add('visible');
    });
  };

  if (!prefersReduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => observer.observe(el));
    markVisibleIfInView();
    window.addEventListener('resize', markVisibleIfInView);
    window.addEventListener('hashchange', () => setTimeout(markVisibleIfInView, 50));
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => setTimeout(markVisibleIfInView, 120)));
  } else {
    // No animation / reduced motion
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Hero "cool reveal" */
  document.body.classList.add('hero-animate');

  /* Mobile menu */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  }

  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
  });

  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
  document.addEventListener('click', (e) => {
    const withinNav = e.target.closest('.nav');
    if (!withinNav && mobileMenu && !mobileMenu.hidden) closeMobileMenu();
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 981px)').matches) closeMobileMenu();
  });

  /* Flip cards: click (no hover) */
  document.querySelectorAll('.js-flip').forEach(card => {
    const toggle = () => card.classList.toggle('is-flipped');
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* Carousel helpers */
  function wireCarousel(trackId, prevId, nextId) {
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!track || !prev || !next) return;

    const step = () => {
      const first = track.querySelector(':scope > *');
      return first ? (first.getBoundingClientRect().width + 16) : 420;
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: 'smooth' });
      if (e.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: 'smooth' });
    });
  }

  wireCarousel('timelineTrack', 'timelinePrev', 'timelineNext');
  wireCarousel('writingTrack', 'writingPrev', 'writingNext');
});