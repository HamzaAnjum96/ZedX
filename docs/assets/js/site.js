// Progressive enhancement only: every link and section works without this file.
//  - the header's bar stays in view while the notice above it scrolls away
//  - the menu button opens a full height panel on small screens
//  - blocks marked data-reveal rise and fade in once as they enter the viewport
//  - the tagline's words come to full colour one by one as they cross a line
//  - "How it works" becomes tabs with a sliding indicator
//  - "View full screen" links open the screenshot in a modal viewer instead of
//    navigating to the image file

const SCREENS = 'assets/img/screens/';
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// The inline script in <head> reveals everything after a few seconds if this
// file never runs; it has run, so cancel that.
clearTimeout(window.__revealFailsafe);

// ---------- Header: the notice scrolls away, the bar floats ----------
const notice = document.querySelector('.site-header > .wip-notice');
if (notice) {
  const setOffset = () => root.style.setProperty('--wip-h', `${notice.offsetHeight}px`);
  setOffset();
  if ('ResizeObserver' in window) new ResizeObserver(setOffset).observe(notice);
}

// ---------- Menu: a full height panel below 1100px ----------
const toggle = document.querySelector('[data-menu-toggle]');
const nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
const wide = window.matchMedia('(min-width: 1100px)');

function setMenu(open, { focusToggle = false } = {}) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  root.classList.toggle('has-menu-open', open);
  // While the panel covers the page, the page behind it is out of reach.
  document.querySelectorAll('main, .site-footer').forEach((el) => { el.inert = open; });
  if (!open && focusToggle) toggle.focus();
}

if (toggle && nav) {
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false, { focusToggle: true });
    }
  });
  wide.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// ---------- Scroll reveals: once, on IntersectionObserver ----------
document.querySelectorAll('[data-reveal-group]').forEach((group) => {
  group.querySelectorAll(':scope > [data-reveal]').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${Math.min(i * 60, 360)}ms`);
  });
});

const revealables = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealables.forEach((el) => revealer.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-revealed'));
}

// ---------- Tagline: words light up one at a time ----------
document.querySelectorAll('[data-words]').forEach((block) => {
  // Collapse ordinary white space only, so non-breaking spaces keep their words together.
  const text = block.textContent.replace(/[ \t\r\n]+/g, ' ').trim();
  const spoken = document.createElement('span');
  spoken.className = 'visually-hidden';
  spoken.textContent = text;
  const shown = document.createElement('span');
  shown.setAttribute('aria-hidden', 'true');
  const parts = text.split(' ');
  parts.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'tw';
    span.textContent = word;
    shown.append(span);
    if (i < parts.length - 1) shown.append(' ');
  });
  block.replaceChildren(spoken, shown);

  const words = [...shown.querySelectorAll('.tw')];
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    words.forEach((word) => word.classList.add('is-on'));
    return;
  }
  // The trigger line sits 62% of the way down the viewport.
  const lighter = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .map((entry) => entry.target)
      .sort((a, b) => words.indexOf(a) - words.indexOf(b))
      .forEach((word, i) => {
        word.style.setProperty('--tw-delay', `${i * 45}ms`);
        word.classList.add('is-on');
        lighter.unobserve(word);
      });
  }, { rootMargin: '0px 0px -38% 0px', threshold: 1 });
  words.forEach((word) => lighter.observe(word));
});

// ---------- How it works: tabs ----------
document.querySelectorAll('[data-tabs]').forEach((tabs) => {
  const list = tabs.querySelector('[data-tab-list]');
  const buttons = [...list.querySelectorAll('[data-tab]')];
  const panels = buttons.map((button) => document.getElementById(button.dataset.tab));

  list.setAttribute('role', 'tablist');
  if (list.dataset.label) list.setAttribute('aria-label', list.dataset.label);
  buttons.forEach((button, i) => {
    button.setAttribute('role', 'tab');
    button.id = button.id || `${button.dataset.tab}-tab`;
    button.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', button.id);
    panels[i].tabIndex = 0;
  });

  const select = (index, { focus = false, animate = true } = {}) => {
    buttons.forEach((button, i) => {
      const on = i === index;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
      panels[i].classList.remove('is-entering');
      if (on && animate) {
        void panels[i].offsetWidth; // restart the entrance animation
        panels[i].classList.add('is-entering');
      }
    });
    list.dataset.active = String(index);
    if (focus) buttons[index].focus();
  };

  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  list.addEventListener('keydown', (event) => {
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    const last = buttons.length - 1;
    const next = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current === 0 ? last : current - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, { focus: true });
  });

  list.hidden = false;
  tabs.classList.add('is-ready');
  select(0, { animate: false });
});

// ---------- Screenshot viewer ----------
const dialog = document.querySelector('[data-viewer-dialog]');

if (dialog && typeof dialog.showModal === 'function') {
  const title = dialog.querySelector('#viewer-title');
  let img = dialog.querySelector('[data-viewer-img]');
  const caption = dialog.querySelector('[data-viewer-caption]');
  const zoom = dialog.querySelector('[data-viewer-zoom]');
  const zoomLabel = zoom.querySelector('span');
  const zoomIcon = zoom.querySelector('use');
  const close = dialog.querySelector('[data-viewer-close]');
  let opener = null;

  const setActual = (actual) => {
    dialog.classList.toggle('is-actual', actual);
    zoomLabel.textContent = actual ? 'Fit to screen' : 'Actual size';
    zoomIcon.setAttribute('href', zoomIcon.getAttribute('href').replace(/#.*/, actual ? '#i-zoom-out' : '#i-zoom-in'));
  };

  const open = (link) => {
    const name = link.dataset.viewer;
    opener = link;
    title.textContent = link.dataset.title || 'Screenshot';
    if (img.dataset.name !== name) {
      // A fresh element for each screenshot, so the previous one never shows under a new title.
      const fresh = img.cloneNode(false);
      fresh.removeAttribute('src');
      fresh.removeAttribute('srcset');
      fresh.dataset.name = name;
      fresh.sizes = '100vw';
      fresh.srcset = `${SCREENS}${name}-full-1600.webp 1600w, ${SCREENS}${name}-full-2400.webp 2400w`;
      fresh.src = `${SCREENS}${name}-full-1600.webp`;
      fresh.width = 1600;
      fresh.height = 1000;
      img.replaceWith(fresh);
      img = fresh;
    }
    img.alt = link.dataset.alt || '';
    const text = link.closest('figcaption')?.querySelector('.shot-text');
    caption.textContent = `${text ? `${text.textContent.trim()} ` : ''}Full screen from the ZedX demo environment, with its sample data.`;
    // On small screens a whole screen is unreadable when fitted, so start at actual size.
    setActual(window.matchMedia('(max-width: 900px)').matches);
    dialog.showModal();
    close.focus();
    dialog.querySelector('.viewer-stage').scrollTo(0, 0);
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-viewer]');
    if (link) {
      event.preventDefault();
      open(link);
      return;
    }
    const frame = event.target.closest('.shot-frame[data-zoomable]');
    if (frame) frame.closest('figure').querySelector('a[data-viewer]').click();
  });

  // Clicking the screenshot itself opens the viewer too (keyboard users have the link).
  document.querySelectorAll('figure .shot-frame').forEach((frame) => {
    if (frame.closest('figure').querySelector('a[data-viewer]')) frame.dataset.zoomable = '';
  });

  zoom.addEventListener('click', () => setActual(!dialog.classList.contains('is-actual')));
  close.addEventListener('click', () => dialog.close());

  // A click on the backdrop (outside the panel) closes the viewer.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    if (opener && document.contains(opener)) opener.focus();
    opener = null;
  });
}
