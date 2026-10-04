// Progressive enhancement only: every link and section works without this file.
//  - the mobile menu button shows and hides the navigation
//  - "View full screen" links open the screenshot in a modal viewer instead of
//    navigating to the image file

const SCREENS = 'assets/img/screens/';

// ---------- Mobile menu ----------
const toggle = document.querySelector('[data-menu-toggle]');
const nav = toggle && document.getElementById(toggle.getAttribute('aria-controls'));

function setMenu(open, { focusToggle = false } = {}) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
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
}

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
