const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Accordion single-open with aria + scrollable content for long panels (fix #4)
const headers = document.querySelectorAll('.accordion-header');
const contents = document.querySelectorAll('.accordion-content');

function closeAll() {
  headers.forEach(h => h.setAttribute('aria-expanded', 'false'));
  contents.forEach(c => {
    c.classList.remove('open');
    c.style.maxHeight = null;
  });
}

function openPanel(button, content) {
  button.setAttribute('aria-expanded', 'true');
  content.classList.add('open');
  // set to 70vh (handled by CSS), but keep a numeric maxHeight to animate open
  content.style.maxHeight = Math.min(content.scrollHeight, window.innerHeight * 0.7) + "px";
  // If images load after opening, recalc
  content.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
      if (button.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = Math.min(content.scrollHeight, window.innerHeight * 0.7) + "px";
      }
    }, { once: true });
  });
}

headers.forEach(button => {
  button.addEventListener('click', () => {
    const content = button.parentElement.querySelector('.accordion-content');
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    closeAll();
    if (!isExpanded) openPanel(button, content);
  });
});

// Mobile hamburger menu should only appear on mobile (fix #1)
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
}

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  mobileMenu.hidden = expanded;
});

mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileMenu(); });
document.addEventListener('click', (e) => {
  const withinNav = e.target.closest('.nav');
  if (!withinNav && !mobileMenu.hidden) closeMobileMenu();
});

// If resized to desktop, force-close the mobile menu (fix #1)
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 981px)').matches) closeMobileMenu();
  // also adjust any open accordion height on resize
  const openContent = document.querySelector('.accordion-content.open');
  const openHeader = document.querySelector('.accordion-header[aria-expanded="true"]');
  if (openContent && openHeader) {
    openContent.style.maxHeight = Math.min(openContent.scrollHeight, window.innerHeight * 0.7) + "px";
  }
});

// Timeline carousel controls
const timelineTrack = document.getElementById('timelineTrack');
const prevBtn = document.getElementById('timelinePrev');
const nextBtn = document.getElementById('timelineNext');

function scrollByCard(direction) {
  if (!timelineTrack) return;
  const card = timelineTrack.querySelector('.timeline-card');
  const delta = card ? (card.getBoundingClientRect().width + 16) : 420; // includes gap
  timelineTrack.scrollBy({ left: direction * delta, behavior: 'smooth' });
}

if (prevBtn && nextBtn && timelineTrack) {
  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  // Keyboard: left/right when focused
  timelineTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') scrollByCard(-1);
    if (e.key === 'ArrowRight') scrollByCard(1);
  });
}