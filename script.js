const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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
});

// Timeline carousel controls
const timelineTrack = document.getElementById('timelineTrack');
const timelinePrevBtn = document.getElementById('timelinePrev');
const timelineNextBtn = document.getElementById('timelineNext');

function timelineScrollByCard(direction) {
  if (!timelineTrack) return;
  const card = timelineTrack.querySelector('.timeline-card');
  const delta = card ? (card.getBoundingClientRect().width + 16) : 420; // includes gap
  timelineTrack.scrollBy({ left: direction * delta, behavior: 'smooth' });
}

if (timelinePrevBtn && timelineNextBtn && timelineTrack) {
  timelinePrevBtn.addEventListener('click', () => timelineScrollByCard(-1));
  timelineNextBtn.addEventListener('click', () => timelineScrollByCard(1));
}

// Case Studies carousel controls
const caseTrack = document.getElementById('caseTrack');
const casePrevBtn = document.getElementById('casePrev');
const caseNextBtn = document.getElementById('caseNext');

function caseScrollByCard(direction) {
  if (!caseTrack) return;
  const card = caseTrack.querySelector('.case-card');
  const delta = card ? (card.getBoundingClientRect().width + 16) : 420; // includes gap
  caseTrack.scrollBy({ left: direction * delta, behavior: 'smooth' });
}

if (casePrevBtn && caseNextBtn && caseTrack) {
  casePrevBtn.addEventListener('click', () => caseScrollByCard(-1));
  caseNextBtn.addEventListener('click', () => caseScrollByCard(1));
}