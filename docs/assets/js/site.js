// Behaviour shared by every page: header state, mobile menu, the chooser.
import { el, icon } from './dom.js';

// Header gets a border once the page scrolls.
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu: a disclosure button. Esc closes it and returns focus.
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
if (toggle && nav) {
  const setOpen = (open, { focusToggle = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    if (open) nav.querySelector('a')?.focus();
    else if (focusToggle) toggle.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false, { focusToggle: true });
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

// "Which app fits?" chooser. Static guidance shows without JavaScript;
// answering any question replaces it with a recommendation.
const chooser = document.querySelector('[data-chooser]');
const verdict = document.querySelector('[data-verdict]');

const VERDICTS = {
  ws: {
    title: 'Group WorkStreams',
    highlight: 'hl-ws',
    text: 'Your work arrives as a steady flow and runs continuously. A Kanban workflow for each team shows where everything stands, without forcing the work into sprints.',
    points: ['A workflow for each function', 'Tasks move across a Kanban board', 'Partners can join with a guest login'],
    link: { href: 'workstreams.html', label: 'See Group WorkStreams' },
  },
  as: {
    title: 'Agile Sprints',
    highlight: 'hl-as',
    text: 'You plan in time-boxes and estimate up front. Agile Sprints brings the backlog, sprint planning against capacity, stand-up reporting and velocity together in one place.',
    points: ['Epics and stories in a prioritised backlog', 'Sprints planned with story points', 'Automated stand-up reporting'],
    link: { href: 'agile-sprints.html', label: 'See Agile Sprints' },
  },
  both: {
    title: 'Both, side by side',
    highlight: null,
    text: 'You run planned delivery alongside a steady flow of operational work. Keep sprints focused in Agile Sprints, and manage the operational and ad-hoc work in Group WorkStreams.',
    points: ['Sprint work stays focused', 'Operational work has its own boards', 'One login for both'],
    link: { href: '#together', label: 'How they work together' },
  },
};

export function recommend(answers) {
  let ws = 0;
  let as = 0;
  let answered = 0;
  if (answers.arrives) {
    answered += 1;
    if (answers.arrives === 'flow') ws += 2;
    else if (answers.arrives === 'planned') as += 2;
    else { ws += 1; as += 1; }
  }
  if (answers.timebox) {
    answered += 1;
    if (answers.timebox === 'no') ws += 2; else as += 2;
  }
  if (answers.estimate) {
    answered += 1;
    if (answers.estimate === 'no') ws += 1; else as += 1;
  }
  if (!answered) return null;
  if (answers.arrives === 'mixed') return 'both';
  if (ws > 0 && as > 0 && Math.abs(ws - as) <= 1) return 'both';
  return ws > as ? 'ws' : 'as';
}

function renderVerdict(key, answers, complete) {
  const v = VERDICTS[key];
  const title = el('h3', {});
  if (v.highlight) title.append(el('span', { class: v.highlight, text: v.title }));
  else title.textContent = v.title;

  const list = el('ul', {}, v.points.map((point) => el('li', {}, icon('circle-check'), el('span', { text: point }))));
  const parts = [
    el('p', { class: 'eyebrow theme-zx', text: complete ? 'Our suggestion' : 'Based on your answers so far' }),
    title,
    el('p', { text: v.text }),
    list,
  ];
  if (answers.audience === 'leaders') {
    parts.push(el('p', { class: 'verdict-note', text: 'Leaders across several teams? Link either app to Project Portfolios so they get periodic summaries without task-level detail.' }));
  }
  parts.push(el('div', { class: 'btn-row' },
    el('a', { class: 'btn btn-light', href: v.link.href, text: v.link.label }),
    el('a', { class: 'btn btn-on-dark', href: 'https://www.zedxapps.com/index.html#formContact' }, 'Book a demo', el('span', { class: 'visually-hidden', text: ' (opens the ZedX website)' })),
  ));
  verdict.replaceChildren(...parts);
}

if (chooser && verdict) {
  const fallback = Array.from(verdict.childNodes).map((node) => node.cloneNode(true));
  chooser.addEventListener('change', () => {
    const data = new FormData(chooser);
    const answers = Object.fromEntries(data.entries());
    const key = recommend(answers);
    if (!key) {
      verdict.replaceChildren(...fallback.map((node) => node.cloneNode(true)));
      if (answers.audience === 'leaders') {
        verdict.append(el('p', { class: 'verdict-note', text: 'Leaders across several teams? Either app can link to Project Portfolios for periodic summaries.' }));
      }
      return;
    }
    const complete = ['arrives', 'timebox', 'estimate'].every((name) => answers[name]);
    renderVerdict(key, answers, complete);
  });
}
