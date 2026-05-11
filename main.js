const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hero Video Sound Toggle
const heroVideo = document.getElementById('hero-video');
const soundBtn = document.getElementById('video-sound-btn');

if (heroVideo && soundBtn) {
  soundBtn.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    soundBtn.classList.toggle('is-unmuted', !heroVideo.muted);
    soundBtn.setAttribute('aria-label', heroVideo.muted ? 'Attiva audio' : 'Disattiva audio');
  });
}

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
  duration: prefersReducedMotion ? 0 : 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: !prefersReducedMotion,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Integrate GSAP with Lenis
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ ignoreMobileResize: true });

// Sync Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Dark mode tracking for navbar
const body = document.querySelector('body');
const darkSections = document.querySelectorAll('.dark-section, .hero, .footer');
const navbar = document.querySelector('.navbar');

// Navbar: transparent on hero, solid when scrolled
const heroSection = document.querySelector('#hero');
const navbarObserver = new IntersectionObserver(
  ([entry]) => {
    navbar.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { threshold: 0 }
);
navbarObserver.observe(heroSection);

darkSections.forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => body.classList.add('dark-mode-active'),
    onLeave: () => body.classList.remove('dark-mode-active'),
    onEnterBack: () => body.classList.add('dark-mode-active'),
    onLeaveBack: () => body.classList.remove('dark-mode-active')
  });
});


// Initial Load Animation
if (prefersReducedMotion) {
  // Skip all GSAP intro animations — elements already visible via CSS
  gsap.set('.hero-content h1 span, .hero-payoff, .hero-scroll-indicator', { opacity: 1, y: 0, skewY: 0 });
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  const tl = gsap.timeline();

  gsap.set('.hero-content h1 span', { opacity: 0, y: 150, skewY: 10 });
  gsap.set('.hero-payoff', { opacity: 0, y: 20 });
  gsap.set('.hero-scroll-indicator', { opacity: 0, y: 50 });

  tl.fromTo('.hero-content h1 span',
    { y: 150, skewY: 10, opacity: 0 },
    { y: 0, skewY: 0, opacity: 1, duration: 1.8, stagger: 0.2, ease: 'power4.out' },
    "-=1.2")
  .fromTo('.hero-payoff',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
    "-=1.5")
  .fromTo('.hero-scroll-indicator',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out' },
    "-=1.5");

  // Parallax Images
  gsap.utils.toArray('.parallax-img').forEach(img => {
    gsap.to(img, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.utils.toArray('.parallax-img-slow').forEach(img => {
    gsap.to(img, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // Scroll Reveal Items
  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    gsap.fromTo(el, {
      y: 100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// Mobile menu toggle
const mobileBtn = document.getElementById('mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    mobileBtn.classList.toggle('active', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

// ─── LAVORA CON NOI — Modal Logic ────────────────────────────────────────────
const modals = {
  dipendente: document.getElementById('modal-dipendente'),
  partner:    document.getElementById('modal-partner'),
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
const trapCleanup = {};
let lastFocusedEl = null;

function trapFocus(modal) {
  const focusable = [...modal.querySelectorAll(FOCUSABLE)];
  if (!focusable.length) return () => {};
  focusable[0].focus();

  function handler(e) {
    if (e.key !== 'Tab') return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { last.focus(); e.preventDefault(); }
    } else {
      if (document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  }
  modal.addEventListener('keydown', handler);
  return () => modal.removeEventListener('keydown', handler);
}

function openModal(key) {
  const modal = modals[key];
  if (!modal) return;
  lastFocusedEl = document.activeElement;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  lenis.stop();
  trapCleanup[key] = trapFocus(modal);
}

function closeModal(key) {
  const modal = modals[key];
  if (!modal) return;
  if (trapCleanup[key]) { trapCleanup[key](); delete trapCleanup[key]; }
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  lenis.start();
  if (lastFocusedEl) { lastFocusedEl.focus(); lastFocusedEl = null; }
  // Reset form to initial state after animation completes
  setTimeout(() => {
    const form   = modal.querySelector('.modal-form');
    const success = modal.querySelector('.modal-success');
    if (form)    { form.hidden = false; form.reset(); }
    if (success) { success.hidden = true; }
    const cvName = modal.querySelector('[id$="-cv-name"]');
    if (cvName)  { cvName.textContent = 'PDF, DOC — max 5MB'; cvName.classList.remove('has-file'); }
  }, 400);
}

document.getElementById('btn-open-dipendente')?.addEventListener('click', () => openModal('dipendente'));
document.getElementById('btn-open-partner')?.addEventListener('click',    () => openModal('partner'));
document.getElementById('btn-open-dipendente-2')?.addEventListener('click', () => openModal('dipendente'));
document.getElementById('btn-open-partner-2')?.addEventListener('click',    () => openModal('partner'));

document.getElementById('close-modal-dipendente')?.addEventListener('click', () => closeModal('dipendente'));
document.getElementById('close-modal-partner')?.addEventListener('click',    () => closeModal('partner'));

// Close on backdrop click
Object.entries(modals).forEach(([key, modal]) => {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(key); });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Object.keys(modals).forEach(closeModal);
});

// File input — display selected file name and validate size
document.getElementById('dip-cv')?.addEventListener('change', (e) => {
  const file    = e.target.files[0];
  const display = document.getElementById('dip-cv-name');
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    alert('Il file supera i 5MB. Seleziona un file più piccolo.');
    e.target.value = '';
    display.textContent = 'PDF, DOC — max 5MB';
    display.classList.remove('has-file');
    return;
  }
  display.textContent = file.name;
  display.classList.add('has-file');
});
