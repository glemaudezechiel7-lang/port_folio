/* ==========================================================
   Comportements communs à toutes les pages
   ========================================================== */
(function () {
  const S = window.SITE || {};
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- thème clair / sombre ---------- */
  const saved = (function () { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  /* ---------- liens pilotés par config.js ---------- */
  const wa = 'https://wa.me/' + (S.whatsapp || '') + '?text=' + encodeURIComponent(S.whatsappMessage || '');
  document.querySelectorAll('[data-link]').forEach(function (el) {
    const type = el.getAttribute('data-link');
    const map = {
      whatsapp: wa,
      github: S.github,
      linkedin: S.linkedin,
      email: S.email ? 'mailto:' + S.email : ''
    };
    const href = map[type];
    if (!href) {
      const box = el.closest('[data-hide-if-empty]') || el;
      box.hidden = true;
      return;
    }
    el.setAttribute('href', href);
    if (type !== 'email') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener'); }
  });

  /* ---------- menu mobile ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const links = document.querySelector('.nav-links');
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () {
      const open = links.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }
    });
  }

  /* ---------- barre de progression ---------- */
  const bar = document.querySelector('.progress span');
  if (bar) {
    const update = function () {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- texte qui s'écrit (accueil) ---------- */
  const typed = document.querySelector('.typed');
  if (typed) {
    const roles = (typed.getAttribute('data-roles') || '').split('|');
    if (reduce) { typed.textContent = roles[0]; }
    else {
      let r = 0, i = 0, del = false;
      (function tick() {
        const word = roles[r];
        typed.textContent = word.slice(0, i);
        if (!del && i < word.length) { i++; setTimeout(tick, 80); }
        else if (!del) { del = true; setTimeout(tick, 1500); }
        else if (i > 0) { i--; setTimeout(tick, 40); }
        else { del = false; r = (r + 1) % roles.length; setTimeout(tick, 250); }
      })();
    }
  }

  /* ---------- inclinaison de la carte portrait ---------- */
  const card = document.querySelector('.hero-card');
  if (card && !reduce && window.matchMedia('(hover: hover)').matches) {
    const zone = card.parentElement;
    zone.addEventListener('mousemove', function (e) {
      const b = zone.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - .5;
      const y = (e.clientY - b.top) / b.height - .5;
      card.style.transform = 'rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
    zone.addEventListener('mouseleave', function () { card.style.transform = ''; });
  }

  /* ---------- bandeau défilant : on duplique le contenu ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (t) { t.innerHTML += t.innerHTML; });

  /* ---------- apparition au défilement ---------- */
  window.observeReveal = function (scope) {
    const items = (scope || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || reduce) { items.forEach(function (n) { n.classList.add('in'); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .12 });
    items.forEach(function (n) { io.observe(n); });
  };
  window.observeReveal();

  /* ---------- visionneuse de certificats ---------- */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        img.src = b.getAttribute('data-zoom');
        img.alt = b.getAttribute('data-alt') || '';
        lb.showModal();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.close')) lb.close(); });
  }

  /* ---------- formulaire de contact ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const read = function () {
      const d = new FormData(form);
      return {
        name: (d.get('name') || '').toString().trim(),
        subject: (d.get('subject') || '').toString().trim(),
        msg: (d.get('message') || '').toString().trim()
      };
    };
    const valid = function () {
      if (form.checkValidity()) return true;
      form.reportValidity();
      return false;
    };
    form.querySelector('[data-send="whatsapp"]').addEventListener('click', function () {
      if (!valid()) return;
      const v = read();
      const text = 'Bonjour Ezéchiel, je suis ' + v.name + '.\n' + (v.subject ? 'Sujet : ' + v.subject + '\n' : '') + v.msg;
      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
    form.querySelector('[data-send="email"]').addEventListener('click', function () {
      if (!valid()) return;
      const v = read();
      const body = v.msg + '\n\n— ' + v.name;
      window.location.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent(v.subject || 'Contact depuis le portfolio') + '&body=' + encodeURIComponent(body);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ---------- année du pied de page ---------- */
  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
