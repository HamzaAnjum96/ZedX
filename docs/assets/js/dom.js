// Tiny DOM helpers shared by every script. Text always goes in through
// textContent, never innerHTML.

const ICONS = new URL('../img/icons.svg', import.meta.url).href;
const SVG_NS = 'http://www.w3.org/2000/svg';

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  setAttrs(node, attrs);
  for (const child of children.flat()) {
    if (child !== null && child !== undefined && child !== false) node.append(child);
  }
  return node;
}

export function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  setAttrs(node, attrs);
  for (const child of children.flat()) {
    if (child !== null && child !== undefined && child !== false) node.append(child);
  }
  return node;
}

function setAttrs(node, attrs) {
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue;
    if (key === 'class') node.setAttribute('class', value);
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
}

export function icon(name, cls = 'icon') {
  return svg('svg', { class: cls, 'aria-hidden': 'true' }, svg('use', { href: `${ICONS}#i-${name}` }));
}

// One polite live region per page, created on first use.
let liveRegion;
export function announce(message) {
  if (!liveRegion) {
    liveRegion = el('div', { class: 'visually-hidden', 'aria-live': 'polite', role: 'status' });
    document.body.append(liveRegion);
  }
  liveRegion.textContent = '';
  // A fresh text node after a tick makes repeated messages announce again.
  window.setTimeout(() => { liveRegion.textContent = message; }, 30);
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
