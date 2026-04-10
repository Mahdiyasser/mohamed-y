/* ============================================================
   PORTFOLIO — script.js
   All page content is driven by ./data/data.json
   ============================================================ */

/* ── AVAILABILITY STATUS ────────────────────────────────────
   Set exactly one key to 1 to activate it.
   Values: "available" | "not-available" | "soon" | "in-break"
   ──────────────────────────────────────────────────────────── */
const AVAILABILITY = {
  "available":     0,
  "not-available": 0,
  "soon":          0,
  "in-break":      1,
};

const AVAILABILITY_CONFIG = {
  "available": {
    label: "Available for Work",
    icon:  "fa-solid fa-circle-check",
    cls:   "status--available",
  },
  "not-available": {
    label: "Not Available",
    icon:  "fa-solid fa-circle-xmark",
    cls:   "status--not-available",
  },
  "soon": {
    label: "Available Soon",
    icon:  "fa-solid fa-clock",
    cls:   "status--soon",
  },
  "in-break": {
    label: "On a Break",
    icon:  "fa-solid fa-mug-hot",
    cls:   "status--break",
  },
};

/* ── FA ICON MAP ─────────────────────────────────────────── */
const ICON_MAP = {
  website:     "fa-solid fa-globe",
  instagram:   "fa-brands fa-instagram",
  facebook:    "fa-brands fa-facebook-f",
  linkedin:    "fa-brands fa-linkedin-in",
  twitter:     "fa-brands fa-x-twitter",
  github:      "fa-brands fa-github",
  youtube:     "fa-brands fa-youtube",
  whatsapp:    "fa-brands fa-whatsapp",
  telegram:    "fa-brands fa-telegram",
  researchgate:"fa-brands fa-researchgate",
};

const CONTACT_ICONS = {
  email:    "fa-solid fa-envelope",
  phone:    "fa-solid fa-phone",
  location: "fa-solid fa-location-dot",
};

const STAT_ICONS = {
  graduation: "fa-solid fa-graduation-cap",
  certs:      "fa-solid fa-certificate",
  badges:     "fa-solid fa-medal",
  military:   "fa-solid fa-shield-halved",
};

const CAT_ICONS = {
  "Technical":       "fa-solid fa-flask",
  "Software & Tools":"fa-solid fa-laptop-code",
  "Soft Skills":     "fa-solid fa-handshake",
};

(async function () {
  /* ── 1. LOAD DATA ───────────────────────────────────────── */
  let data;
  try {
    const res = await fetch('./data/data.json');
    if (!res.ok) throw new Error('Failed to load data.json');
    data = await res.json();
  } catch (err) {
    console.error('Could not load portfolio data:', err);
    return;
  }

  const { personal, education, graduationProject, training,
          certificates, badges, skills, languages, military, links } = data;

  /* ── 2. HELPERS ─────────────────────────────────────────── */
  const $ = id => document.getElementById(id);
  const create = (tag, cls, html) => {
    const el = document.createElement(tag);
    if (cls)  el.className = cls;
    if (html) el.innerHTML = html;
    return el;
  };
  const faIcon = (cls, extra = '') =>
    `<i class="${cls}${extra ? ' ' + extra : ''}" aria-hidden="true"></i>`;

  /* ── 3. AVAILABILITY BADGE ──────────────────────────────── */
  const activeStatus = Object.keys(AVAILABILITY).find(k => AVAILABILITY[k] === 1);
  if (activeStatus) {
    const cfg = AVAILABILITY_CONFIG[activeStatus];
    const badge = create('div', `availability-badge ${cfg.cls}`);
    badge.innerHTML =
      `${faIcon(cfg.icon, 'status-icon')}
       <span class="status-label">${cfg.label}</span>
       <span class="status-dot" aria-hidden="true"></span>`;
    // Insert after hero photo wrap
    const heroText = document.querySelector('.hero-text');
    heroText.insertBefore(badge, heroText.firstChild);
  }

  /* ── 4. HERO ────────────────────────────────────────────── */
  $('hero-location').innerHTML =
    `${faIcon('fa-solid fa-location-dot')} ${personal.location}`;
  $('hero-name').textContent = personal.name;
  $('hero-title-text').textContent = personal.title;
  $('hero-objective').textContent = personal.objective;

  /* ── 5. ABOUT ───────────────────────────────────────────── */
  $('about-bio').textContent = personal.objective;

  const stats = [
    { icon: STAT_ICONS.graduation, value: education[0].year, label: 'Graduation Year' },
    { icon: STAT_ICONS.certs,      value: `${certificates.length}+`, label: 'Certifications' },
    { icon: STAT_ICONS.badges,     value: `${badges.length}+`, label: 'Digital Badges' },
    { icon: STAT_ICONS.military,   value: military, label: 'Military Service' },
  ];
  stats.forEach(s => {
    $('about-stats').appendChild(create('div', 'stat-card reveal',
      `<div class="stat-icon">${faIcon(s.icon)}</div>
       <div class="stat-content">
         <div class="stat-value">${s.value}</div>
         <div class="stat-label">${s.label}</div>
       </div>`
    ));
  });

  languages.forEach(l => {
    $('languages-row').appendChild(create('div', 'lang-pill reveal',
      `<span class="lang-name">${l.language}</span>
       <span class="lang-level">${l.level}</span>`
    ));
  });

  /* ── 6. EDUCATION ───────────────────────────────────────── */
  education.forEach(ed => {
    $('edu-grid').appendChild(create('div', 'edu-card reveal',
      `<div class="edu-year">${ed.year}</div>
       <div class="edu-degree">${ed.degree}</div>
       <div class="edu-institution">${ed.institution}</div>
       ${ed.specialization ? `<span class="edu-spec">${ed.specialization}</span>` : ''}
       ${ed.grade ? `<p style="margin-top:.75rem;font-size:.85rem;color:var(--ink-soft)">Grade: ${ed.grade}</p>` : ''}`
    ));
  });

  if (graduationProject) {
    $('project-card').className = 'project-card reveal';
    $('project-card').innerHTML =
      `<div class="project-eyebrow">${faIcon('fa-solid fa-seedling')} Graduation Project</div>
       <div class="project-title">${graduationProject.title}</div>
       <div class="project-desc">${graduationProject.description}</div>`;
  }

  /* ── 7. SKILLS ──────────────────────────────────────────── */
  skills.forEach(cat => {
    const card = create('div', 'skill-category reveal');
    card.innerHTML =
      `<div class="skill-cat-header">
         <span class="skill-cat-icon">${faIcon(CAT_ICONS[cat.category] || 'fa-solid fa-circle-dot')}</span>
         <span class="skill-cat-name">${cat.category}</span>
       </div>
       <div class="skill-tags">
         ${cat.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
       </div>`;
    $('skills-grid').appendChild(card);
  });

  /* ── 8. TRAINING ────────────────────────────────────────── */
  training.forEach((t, i) => {
    $('training-list').appendChild(create('div', 'training-card reveal',
      `<div class="training-number">${String(i + 1).padStart(2, '0')}</div>
       <div>
         <div class="training-company">${t.company}</div>
         <div class="training-type">${t.type}</div>
         <div class="training-desc">${t.description}</div>
       </div>`
    ));
  });

  /* ── 9. CERTIFICATES ────────────────────────────────────── */
  certificates.forEach(c => {
    const card = create('div', 'cert-card reveal');
    card.innerHTML =
      `<div class="cert-img-wrap">
         <img src="${c.image}" alt="${c.title}" loading="lazy" />
         <div class="cert-overlay">${faIcon('fa-solid fa-magnifying-glass', 'cert-overlay-icon')}</div>
       </div>
       <div class="cert-info">
         <div class="cert-title">${c.title}</div>
         <div class="cert-issuer">${c.issuer}</div>
       </div>`;
    card.addEventListener('click', () => openLightbox(c.image, c.title));
    $('cert-grid').appendChild(card);
  });

  /* ── 10. BADGES ─────────────────────────────────────────── */
  badges.forEach(b => {
    const card = create('div', 'badge-card reveal');
    card.innerHTML =
      `<div class="badge-img-wrap">
         <img src="${b.image}" alt="${b.title}" loading="lazy" />
       </div>
       <div class="badge-title">${b.title}</div>
       <div class="badge-issuer">${b.issuer}</div>`;
    card.addEventListener('click', () => openLightbox(b.image, b.title));
    $('badges-grid').appendChild(card);
  });

  /* ── 11. CONTACT ────────────────────────────────────────── */
  const contactItems = [
    { icon: CONTACT_ICONS.email,    label: 'Email',    value: personal.email,    href: `mailto:${personal.email}` },
    { icon: CONTACT_ICONS.phone,    label: 'Phone',    value: personal.phone,    href: `tel:${personal.phone}` },
    { icon: CONTACT_ICONS.location, label: 'Location', value: personal.location, href: null },
  ];
  contactItems.forEach(item => {
    const el = create('div', 'contact-item reveal',
      `<div class="contact-item-icon">${faIcon(item.icon)}</div>
       <div>
         <div class="contact-item-label">${item.label}</div>
         <div class="contact-item-value">
           ${item.href
             ? `<a href="${item.href}">${item.value}</a>`
             : item.value}
         </div>
       </div>`
    );
    $('contact-info').appendChild(el);
  });

  /* Only show links that have a URL */
  links.filter(link => link.url && link.url.trim() !== '').forEach(link => {
    const el = create('a', 'social-link reveal',
      `<span class="social-icon">${faIcon(ICON_MAP[link.icon] || 'fa-solid fa-link')}</span>
       <span class="social-label">${link.label}</span>`
    );
    el.href = link.url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
    $('contact-links').appendChild(el);
  });

  /* ── 12. FOOTER ─────────────────────────────────────────── */
  $('footer-name').textContent = personal.name;
  $('footer-title').textContent = personal.title;
  $('footer-year').textContent = `© ${new Date().getFullYear()}`;

  /* ── 13. LIGHTBOX ───────────────────────────────────────── */
  function openLightbox(src, caption) {
    $('lightbox-img').src = src;
    $('lightbox-img').alt = caption;
    $('lightbox-caption').textContent = caption;
    $('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    $('lightbox').classList.remove('open');
    document.body.style.overflow = '';
  }
  $('lightbox-close').addEventListener('click', closeLightbox);
  $('lightbox').addEventListener('click', e => {
    if (e.target === $('lightbox')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── 14. NAV — burger & scroll ──────────────────────────── */
  const burger  = $('nav-burger');
  const navEl   = $('nav-links');
  const overlay = $('nav-overlay');

  function openNav() {
    navEl.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', true);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    navEl.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    navEl.classList.contains('open') ? closeNav() : openNav();
  });
  overlay.addEventListener('click', closeNav);

  navEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  window.addEventListener('scroll', () => {
    document.getElementById('site-header')
      .classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── 15. SCROLL REVEAL ──────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  });

  /* ── 16. ACTIVE NAV LINK (scroll spy) ───────────────────── */
  const sections   = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => spyObserver.observe(s));

})();
