/* ==========================================================
   Affichage des projets : liste, filtres, ajout depuis le navigateur
   ========================================================== */
(function () {
  const KEY = 'portfolio-custom-projects';
  const GH = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>';
  const EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';

  function loadCustom() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function saveCustom(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) {
    return /^https?:\/\//i.test(u || '') ? u : '';
  }
  function all() {
    const base = (window.PROJECTS || []).map(function (p) { return Object.assign({ custom: false }, p); });
    const mine = loadCustom().map(function (p, i) { return Object.assign({ custom: true, idx: i }, p); });
    return mine.concat(base);
  }

  function card(p) {
    const gh = safeUrl(p.github), demo = safeUrl(p.demo);
    const tags = (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    return '<article class="project reveal" data-cat="' + esc(p.category) + '">' +
      '<div class="project-cover"><img src="' + esc(p.cover || 'images/art/p-default.svg') + '" alt="Illustration du projet ' + esc(p.title) + '" loading="lazy"></div>' +
      '<div class="project-body">' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.desc) + '</p>' +
        '<div class="tags">' + tags + '</div>' +
        '<div class="project-links">' +
          (gh ? '<a class="link-pill" href="' + esc(gh) + '" target="_blank" rel="noopener">' + GH + 'Code</a>' : '') +
          (demo ? '<a class="link-pill" href="' + esc(demo) + '" target="_blank" rel="noopener">' + EXT + 'Démo</a>' : '') +
          (p.custom ? '<button class="del-btn" type="button" data-del="' + p.idx + '">Supprimer</button>' : '') +
        '</div>' +
      '</div></article>';
  }

  /* ----- accueil : 3 projets mis en avant ----- */
  const featured = document.getElementById('featured');
  if (featured) {
    featured.innerHTML = all().slice(0, 3).map(card).join('');
    window.observeReveal(featured);
  }

  /* ----- page projets ----- */
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  const filtersBox = document.getElementById('filters');
  let current = 'Tous';

  function render() {
    const list = all();
    const cats = ['Tous'].concat(Array.from(new Set(list.map(function (p) { return p.category; }))));
    if (cats.indexOf(current) === -1) current = 'Tous';
    filtersBox.innerHTML = cats.map(function (c) {
      return '<button type="button" class="filter' + (c === current ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
    const shown = list.filter(function (p) { return current === 'Tous' || p.category === current; });
    grid.innerHTML = shown.length
      ? shown.map(card).join('')
      : '<p class="empty">Aucun projet dans cette catégorie. Utilise « Ajouter un projet » pour en créer un.</p>';
    window.observeReveal(grid);
  }

  filtersBox.addEventListener('click', function (e) {
    const b = e.target.closest('.filter');
    if (!b) return;
    current = b.getAttribute('data-cat');
    render();
  });

  grid.addEventListener('click', function (e) {
    const d = e.target.closest('[data-del]');
    if (!d) return;
    if (!confirm('Supprimer ce projet ?')) return;
    const list = loadCustom();
    list.splice(Number(d.getAttribute('data-del')), 1);
    saveCustom(list);
    render();
  });

  /* ----- formulaire d'ajout ----- */
  const dlg = document.getElementById('add-dialog');
  const form = document.getElementById('add-form');
  document.querySelectorAll('[data-open-add]').forEach(function (b) {
    b.addEventListener('click', function () { dlg.showModal(); });
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.closest('[data-close-add]')) dlg.close();
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const d = new FormData(form);
    const gh = (d.get('github') || '').toString().trim();
    const demo = (d.get('demo') || '').toString().trim();
    if ((gh && !safeUrl(gh)) || (demo && !safeUrl(demo))) {
      alert('Les liens doivent commencer par https://');
      return;
    }
    const list = loadCustom();
    list.unshift({
      title: (d.get('title') || '').toString().trim(),
      category: (d.get('category') || 'Web').toString(),
      desc: (d.get('desc') || '').toString().trim(),
      tags: (d.get('tags') || '').toString().split(',').map(function (t) { return t.trim(); }).filter(Boolean),
      cover: (d.get('cover') || 'images/art/p-default.svg').toString(),
      github: gh,
      demo: demo
    });
    saveCustom(list);
    form.reset();
    dlg.close();
    current = 'Tous';
    render();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();
