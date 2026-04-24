/* ── Load shared partials (header, footer, etc.) ─────────────────────────── */
async function loadIncludes() {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(async node => {
    const res = await fetch(node.getAttribute('data-include'));
    const html = await res.text();
    const tmp = document.createElement('template');
    tmp.innerHTML = html.trim();
    node.replaceWith(tmp.content);
  }));
}

/* ── Active nav link (derived from current URL) ──────────────────────────── */
function markActiveNav() {
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if ((a.getAttribute('href') || '').toLowerCase() === page) {
      a.classList.add('active');
    }
  });
}

/* ── Mobile navigation ───────────────────────────────────────────────────── */
function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Scroll-triggered fade-in ────────────────────────────────────────────── */
function initFadeIn() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ── Contact form ────────────────────────────────────────────────────────── */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.style.display = 'none';
        document.getElementById('form-success').classList.add('visible');
      } else {
        btn.textContent = 'Something went wrong — please try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Something went wrong — please try again';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
      }, 4000);
    }
  });
}

/* ── Copyright year ──────────────────────────────────────────────────────── */
function setCopyrightYear() {
  const year = new Date().getFullYear().toString();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = year;
  });
}

/* ── Bootstrap ───────────────────────────────────────────────────────────── */
loadIncludes().then(() => {
  markActiveNav();
  setCopyrightYear();
  initNav();
  initFadeIn();
  initContactForm();
});
