/* ================================================================
   TRANSLATIONS
   ================================================================ */
const i18n = {
  en: {
    'nav.home': 'Home', 'nav.about': 'About', 'nav.projects': 'Projects',
    'nav.skills': 'Skills', 'nav.contact': 'Contact', 'nav.resume': 'Resume',
    'hero.viewProjects': 'View Projects', 'hero.downloadCV': 'Download CV',
    'about.title': 'About Me',
    'projects.title': 'Projects',
    'skills.title': 'Skills', 'skills.professional': 'Professional',
    'skills.mechanical': 'Mechanical Design', 'skills.electrical': 'Electrical Design',
    'skills.programming': 'Programming',
    'contact.title': 'Contact', 'contact.email': 'Email', 'contact.phone': 'Phone',
  },
  fr: {
    'nav.home': 'Accueil', 'nav.about': 'À propos', 'nav.projects': 'Projets',
    'nav.skills': 'Compétences', 'nav.contact': 'Contact', 'nav.resume': 'CV',
    'hero.viewProjects': 'Voir mes projets', 'hero.downloadCV': 'Télécharger mon CV',
    'about.title': 'À propos',
    'projects.title': 'Projets',
    'skills.title': 'Compétences', 'skills.professional': 'Professionnel',
    'skills.mechanical': 'Conception mécanique', 'skills.electrical': 'Conception électrique',
    'skills.programming': 'Programmation',
    'contact.title': 'Contact', 'contact.email': 'Courriel', 'contact.phone': 'Téléphone',
  }
};

/* ================================================================
   PROJECTS DATA (for card rendering)
   ================================================================ */
const projectsData = [
  {
    id: 0,
    thumbnail: 'img/3axis-cnc-iso-1.png',
    titleEn: '3 Axis CNC Router',
    titleFr: 'Routeur CNC 3 axes',
    tags: ['Solidworks', 'GRBL', 'Electronics', 'CNC'],
  },
  {
    id: 1,
    thumbnail: 'img/drone-cad.png',
    titleEn: 'Hexacopter with Autopilot',
    titleFr: 'Hexacoptère avec autopilote',
    tags: ['Pixhawk', 'Drone', '3D Printing', 'Python'],
  },
  {
    id: 2,
    thumbnail: 'img/cnc-foam-cad.png',
    titleEn: 'Hot Wire CNC Foam Cutter',
    titleFr: 'Machine CNC à fil chaud',
    tags: ['Arduino', 'Marlin', 'MATLAB', 'CNC'],
  },
  {
    id: 3,
    thumbnail: 'img/epaper-wall.png',
    titleEn: 'E-paper Weather Display',
    titleFr: 'Affichage météo e-paper',
    tags: ['Raspberry Pi', 'Python', 'MQTT', 'IoT'],
  },
  {
    id: 4,
    thumbnail: null,
    titleEn: 'CNC Pen Plotter',
    titleFr: 'Traceur à stylo CNC',
    tags: ['Arduino', 'GRBL', 'Core-XY', 'Inkscape'],
  },
];

/* ================================================================
   THEME
   ================================================================ */
function getTheme() { return localStorage.getItem('theme') || 'dark'; }

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/* ================================================================
   LANGUAGE
   ================================================================ */
function getLang() { return localStorage.getItem('lang') || 'en'; }

function applyLang(lang) {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });
  // Re-render project cards with new language
  renderProjectCards();
}

function toggleLang() {
  applyLang(getLang() === 'en' ? 'fr' : 'en');
}

/* ================================================================
   NAVBAR BEHAVIOR
   ================================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 20);
        // Hide on scroll down (past 200px), show on scroll up
        if (y > 200) {
          navbar.classList.toggle('hidden', y > lastY + 5);
        } else {
          navbar.classList.remove('hidden');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ================================================================
   HAMBURGER MENU
   ================================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = `${(window.scrollY / max) * 100}%`;
  }, { passive: true });
}

/* ================================================================
   CAROUSEL
   ================================================================ */
function initCarousel(el) {
  const track = el.querySelector('.carousel-track');
  const slides = el.querySelectorAll('.carousel-slide');
  const dotsContainer = el.querySelector('.carousel-dots');
  const prevBtn = el.querySelector('.carousel-prev');
  const nextBtn = el.querySelector('.carousel-next');
  const interval = parseInt(el.dataset.interval) || 5000;

  let current = 0;
  let timer = null;

  if (!slides.length) return;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(idx) {
    // Pause any video in the current slide
    const curVid = slides[current].querySelector('video');
    if (curVid) curVid.pause();

    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Play video in new slide
    const newVid = slides[current].querySelector('video');
    if (newVid) newVid.play().catch(() => {});

    dotsContainer.querySelectorAll('.cdot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    stopTimer();
    timer = setInterval(next, interval);
  }

  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

  el.addEventListener('mouseenter', stopTimer);
  el.addEventListener('mouseleave', startTimer);

  // Touch/swipe support
  let touchStartX = 0;
  el.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); startTimer(); }
  });

  startTimer();
}

/* ================================================================
   PROJECT CARDS RENDERING
   ================================================================ */
function renderProjectCards() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  const lang = getLang();
  grid.innerHTML = '';

  projectsData.forEach(proj => {
    const title = lang === 'fr' ? proj.titleFr : proj.titleEn;
    const viewLabel = lang === 'fr' ? 'Voir le projet ↗' : 'View Project ↗';

    const card = document.createElement('div');
    card.className = 'proj-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', title);

    const thumbHTML = proj.thumbnail
      ? `<img src="${proj.thumbnail}" alt="${title}" loading="lazy">`
      : `<div class="proj-thumb-placeholder">🖨</div>`;

    card.innerHTML = `
      <div class="proj-thumb">
        ${thumbHTML}
        <div class="proj-overlay">${viewLabel}</div>
      </div>
      <div class="proj-info">
        <h3>${title}</h3>
        <div class="proj-tags">
          ${proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
        </div>
      </div>`;

    card.addEventListener('click', () => openModal(proj.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(proj.id); });

    grid.appendChild(card);
  });
}

/* ================================================================
   PROJECT MODAL
   ================================================================ */
function openModal(projId) {
  const modal = document.getElementById('modal');
  const titleEl = document.getElementById('modal-title');
  const tagsEl = document.getElementById('modal-tags');
  const bodyEl = document.getElementById('modal-body');
  const mediaEl = document.getElementById('modal-media');

  const proj = projectsData[projId];
  const lang = getLang();
  const title = lang === 'fr' ? proj.titleFr : proj.titleEn;
  const sourceDiv = document.getElementById(`proj-${projId}`);

  if (!sourceDiv) return;

  // Title
  titleEl.textContent = title;

  // Tags
  tagsEl.innerHTML = proj.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');

  // Media
  const mediaItems = sourceDiv.querySelector('.proj-media-items');
  mediaEl.innerHTML = '';
  if (mediaItems) {
    mediaItems.querySelectorAll('img, video').forEach(el => {
      const clone = el.cloneNode(true);
      if (clone.tagName === 'VIDEO') {
        clone.muted = true;
        clone.autoplay = true;
        clone.loop = true;
        clone.setAttribute('playsinline', '');
        clone.setAttribute('controls', '');
      }
      mediaEl.appendChild(clone);
    });
    // Autoplay videos
    setTimeout(() => {
      mediaEl.querySelectorAll('video').forEach(v => v.play().catch(() => {}));
    }, 100);
  }

  // Body content (language-aware)
  const projBody = sourceDiv.querySelector('.proj-body');
  if (projBody) {
    const langDiv = projBody.querySelector(`.lang-${lang}`);
    bodyEl.innerHTML = langDiv ? langDiv.innerHTML : projBody.innerHTML;
  }

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  modal.focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  // Pause any videos
  modal.querySelectorAll('video').forEach(v => v.pause());
}

function initModal() {
  const modal = document.getElementById('modal');
  document.getElementById('modal-close').addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) closeModal();
  });
}

/* ================================================================
   SKILL DOTS ANIMATION
   ================================================================ */
function animateSkills(section) {
  if (section.dataset.animated) return;
  section.dataset.animated = 'true';

  section.querySelectorAll('.skill-item').forEach((item, rowIdx) => {
    const level = parseInt(item.dataset.level) || 0;
    item.querySelectorAll('.dot').forEach((dot, i) => {
      if (i < level) {
        setTimeout(() => dot.classList.add('filled'), rowIdx * 80 + i * 60);
      }
    });
  });
}

/* ================================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ================================================================ */
function initScrollAnimations() {
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

  // Skills animation observer
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateSkills(skillsSection);
        skillObserver.disconnect();
      }
    }, { threshold: 0.2 });
    skillObserver.observe(skillsSection);
  }
}

/* ================================================================
   PARTICLE SYSTEM (Hero Canvas)
   ================================================================ */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -999, y: -999 };
  const COUNT = 55;
  const MAX_DIST = 130;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  }

  function getAccentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#38BDF8';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccentColor();

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Repel from mouse
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        p.vx += (dx / dist) * 0.08;
        p.vy += (dy / dist) * 0.08;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }
      }

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.6;
      ctx.fill();
    });

    // Draw connections
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = accent;
          ctx.globalAlpha = (1 - d / MAX_DIST) * 0.18;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  const heroSection = document.getElementById('home');
  heroSection.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroSection.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
  });

  init();
  draw();
}

/* ================================================================
   FOOTER YEAR
   ================================================================ */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved preferences
  applyTheme(getTheme());
  applyLang(getLang());

  // Wire up toggles
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('lang-toggle').addEventListener('click', toggleLang);

  // Init modules
  initNavbar();
  initHamburger();
  initScrollProgress();
  initScrollAnimations();
  initModal();
  setFooterYear();

  // Render projects
  renderProjectCards();

  // Init all carousels
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  // Particles (only on devices that can handle it)
  if (window.matchMedia('(min-width: 768px)').matches) {
    initParticles();
  }
});
