document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Use IntersectionObserver to reveal elements as they scroll into view,
  // with a small stagger for nicer visual rhythm.
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('in-view');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el, i) => {
      // choose an entrance direction based on horizontal position
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const winW = window.innerWidth || document.documentElement.clientWidth;
      if (cx < winW * 0.33) el.classList.add('from-left');
      else if (cx > winW * 0.66) el.classList.add('from-right');
      else el.classList.add('from-bottom');

      // modest stagger within groups
      const delay = (i % 6) * 70; // ms
      el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });
  }

  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('backdrop');

  function toggleMenu(open) {
    if (!menuBtn || !mobileMenu || !backdrop) return;
    menuBtn.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('no-scroll', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
    backdrop.addEventListener('click', () => toggleMenu(false));
    document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', () => toggleMenu(false)));
  }

  const portraitImg = document.querySelector('.portrait-frame img');
  if (portraitImg) {
    portraitImg.onerror = () => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='480' viewBox='0 0 480 480'><rect fill='#0B0F1A' width='100%' height='100%'/><g fill='#9CA3AF' font-family='Arial, Helvetica, sans-serif' font-size='28' text-anchor='middle'><text x='50%' y='50%' dy='-10'>No image</text><text x='50%' y='50%' dy='30'>available</text></g></svg>`;
      portraitImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    };
    if (portraitImg.naturalWidth === 0) portraitImg.src = portraitImg.src;
  }

  // Portrait parallax: subtle translate on scroll for depth.
  const portraitFrame = document.querySelector('.portrait-frame');
  if (portraitFrame) {
    let ticking = false;
    function updateParallax() {
      const rect = portraitFrame.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      // position from bottom (0..1)
      const progress = (winH - rect.top) / (winH + rect.height);
      // map to small translate range
      const y = Math.max(Math.min((progress - 0.5) * 20, 12), -12);
      portraitFrame.style.transform = `translateY(${y}px)`;
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    // initial set
    updateParallax();
  }
  // -- Data-driven content for skills, projects, and why-cards
  const skills = [
    'Fullstack Development', 'Frontend (React / JavaScript)', 'Backend Development', 'APIs & Databases', 'SEO Optimization',
    'Technical SEO', 'Web Performance', 'Content Strategy', 'Copywriting', 'Analytics (Google Tools)'
  ];

  const projects = [
    {
      title: 'Auth & API Platform',
      tag: 'Backend',
      desc: 'JWT-based authentication system with role-based access, REST API endpoints, PostgreSQL persistence, rate limiting, and audit logging. Built with Node.js and Express.',
      tech: ['Node.js','Express','PostgreSQL','JWT','Zod'],
      // prefer user-supplied image if present; fallback to placeholder svg
      imgCandidates: ['./assets/George Abisola Backend.jpg','./assets/project-1.svg']
    },
    {
      title: 'SEO Growth Engine',
      tag: 'SEO',
      desc: 'SEO-optimized content site with keyword-mapped URL structure, structured data, optimized metadata, image lazy-loading, and Core Web Vitals tuned to 95+ Lighthouse.',
      tech: ['Next.js','Schema.org','Sitemap','GA4','Search Console'],
      imgCandidates: ['./assets/GeorgeAbisola SEO.jpg','./assets/project-2.svg']
    },
    {
      title: 'SaaS Dashboard UI',
      tag: 'Frontend',
      desc: 'Responsive analytics dashboard with accessible components, dark theme system, smooth transitions, and an opinionated design system built on React and Tailwind.',
      tech: ['React','TypeScript','Tailwind','Recharts'],
      imgCandidates: ['./assets/George Abisola Frontend.jpg','./assets/project-3.svg']
    }
  ];

  const whyCards = [
    { title: 'Fullstack execution', body: 'Confident across frontend, backend, APIs, and databases , end-to-end ownership.' },
    { title: 'SEO-first thinking', body: 'Technical SEO, metadata, schema, and content structure built in, not bolted on.' },
    { title: 'Performance engineering', body: 'Core Web Vitals, lazy-loading, caching, and rendering strategies that ship 90+ scores.' },
    { title: 'Business outcomes', body: 'Analytics, copy, and UX aligned to turn traffic into real-world results.' }
  ];

  function renderSkills() {
    const grid = document.getElementById('skillGrid');
    if (!grid) return;
    skills.forEach(s => {
      const li = document.createElement('li');
      li.className = 'skill';
      li.textContent = s;
      grid.appendChild(li);
    });
  }

  function renderProjects() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    projects.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project card-hover';

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const img = document.createElement('img');
      img.alt = p.title + ' thumbnail';
      // try candidates sequentially
      (function tryCandidates(el, candidates, idx = 0) {
        if (!candidates || idx >= candidates.length) return;
        // encode URI to handle spaces and special characters in filenames
        el.src = encodeURI(candidates[idx]);
        el.onerror = () => tryCandidates(el, candidates, idx + 1);
      })(img, p.imgCandidates || [p.img]);
      // Accessibility & performance hints
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 1200;
      img.height = 750;
      // add srcset for responsive loading if larger images are available
      // developer can provide @2x images in the assets folder if desired
      const base = p.imgCandidates && p.imgCandidates[0] ? p.imgCandidates[0] : null;
      if (base) {
        const ext = base.split('.').pop();
        const name = base.replace(/\.[^.]+$/, '');
        // assume 2x exists at name + "@2x." + ext
        img.srcset = `${name}.${ext} 1x, ${name}@2x.${ext} 2x`;
      }
      thumb.appendChild(img);

      const body = document.createElement('div');
      body.className = 'body';
      const head = document.createElement('div'); head.className = 'head';
      const h3 = document.createElement('h3'); h3.textContent = p.title;
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = p.tag;
      head.appendChild(h3); head.appendChild(tag);

      const desc = document.createElement('p'); desc.className = 'desc'; desc.textContent = p.desc;
      const stack = document.createElement('div'); stack.className = 'stack';
      p.tech.forEach(t => { const c = document.createElement('span'); c.className = 'chip'; c.textContent = t; stack.appendChild(c); });

      body.appendChild(head); body.appendChild(desc); body.appendChild(stack);

      card.appendChild(thumb); card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderWhyCards() {
    const container = document.getElementById('whyCards');
    if (!container) return;
    whyCards.forEach(w => {
      const card = document.createElement('div'); card.className = 'why-card';
      const h3 = document.createElement('h3'); h3.textContent = w.title;
      const p = document.createElement('p'); p.textContent = w.body;
      card.appendChild(h3); card.appendChild(p);
      container.appendChild(card);
    });
  }

  renderSkills();
  renderProjects();
  renderWhyCards();
});
