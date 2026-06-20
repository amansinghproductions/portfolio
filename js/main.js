/* ======================================================
   PORTFOLIO — main.js
   ====================================================== */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function followCursor() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();

  document.querySelectorAll('a, button, .project, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.width  = '60px';
      follower.style.height = '60px';
      follower.style.borderColor = 'rgba(200,169,110,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.width  = '36px';
      follower.style.height = '36px';
      follower.style.borderColor = 'rgba(200,169,110,0.5)';
    });
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── INTERSECTION OBSERVER: REVEAL ── */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children if multiple in one batch
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * i);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── HERO TITLE STAGGER ── */
  document.querySelectorAll('.hero-title .line').forEach((line, i) => {
    line.style.transitionDelay = (0.1 + i * 0.12) + 's';
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Replace this with your real form submission (Formspree, EmailJS, etc.)
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        status.textContent = '✓ Message sent — I\'ll be in touch within 24 hours.';
        form.reset();
        setTimeout(() => (status.textContent = ''), 5000);
      }, 1500);
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = '#c8a96e';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── SUBTLE PARALLAX ON HERO ── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const heroGrad = document.querySelector('.hero-gradient');
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.22}px)`;
    if (heroGrad) heroGrad.style.transform = `translateY(${y * 0.15}px)`;
  });

})();
