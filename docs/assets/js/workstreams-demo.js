// Group WorkStreams illustration: four sample workstreams, each its own
// Kanban board. All names and tasks are invented sample data.
import { Board } from './board.js';
import { el, announce } from './dom.js';

const person = (initials, name, guest = false) => ({ initials, name, guest });

const SAMPLE = [
  {
    id: 'onboarding',
    name: 'Staff onboarding',
    team: 'HR',
    columns: [
      { id: 'requested', name: 'Requested' },
      { id: 'doing', name: 'In progress' },
      { id: 'waiting', name: 'Waiting on others' },
      { id: 'done', name: 'Done' },
    ],
    cards: [
      { id: 'o1', title: 'Laptop and accounts for new analyst', col: 'requested', tag: 'IT', who: person('SB', 'Sam Bello') },
      { id: 'o2', title: 'Building pass and desk', col: 'requested', tag: 'Estates', who: person('JO', 'Jo Okeke') },
      { id: 'o3', title: 'Induction timetable', col: 'doing', tag: 'HR', who: person('AM', 'Asha Mistry') },
      { id: 'o4', title: 'Payroll and pension set-up', col: 'doing', tag: 'Finance', who: person('RK', 'Rob Kerr') },
      { id: 'o5', title: 'Pre-employment checks', col: 'waiting', tag: 'Agency', who: person('TV', 'Tia Vance, recruitment agency', true) },
      { id: 'o6', title: 'Contract signed', col: 'done', tag: 'HR', who: person('AM', 'Asha Mistry') },
      { id: 'o7', title: 'Line manager briefed', col: 'done', tag: 'HR', who: person('LH', 'Lee Hart') },
    ],
  },
  {
    id: 'it',
    name: 'IT requests',
    team: 'IT',
    columns: [
      { id: 'new', name: 'New' },
      { id: 'triage', name: 'Triage' },
      { id: 'fixing', name: 'In progress' },
      { id: 'resolved', name: 'Resolved' },
    ],
    cards: [
      { id: 'i1', title: 'Projector fault, room 2.14', col: 'new', tag: 'Hardware', who: person('DN', 'Dev Nair') },
      { id: 'i2', title: 'Shared mailbox for Communications', col: 'new', tag: 'Accounts', who: person('MW', 'Mia Wood') },
      { id: 'i3', title: 'Remote access for contractor', col: 'triage', tag: 'Access', who: person('CP', 'Chris Pike, contractor', true) },
      { id: 'i4', title: 'Replace meeting room screen', col: 'fixing', tag: 'Hardware', who: person('DN', 'Dev Nair') },
      { id: 'i5', title: 'Printer offline, third floor', col: 'resolved', tag: 'Hardware', who: person('MW', 'Mia Wood') },
    ],
  },
  {
    id: 'estates',
    name: 'Estates and facilities',
    team: 'Estates',
    columns: [
      { id: 'reported', name: 'Reported' },
      { id: 'scheduled', name: 'Scheduled' },
      { id: 'onsite', name: 'On site' },
      { id: 'complete', name: 'Complete' },
    ],
    cards: [
      { id: 'e1', title: 'Leaking radiator, block C', col: 'reported', tag: 'Repairs', who: person('GF', 'Gwen Ford') },
      { id: 'e2', title: 'Car park lighting survey', col: 'reported', tag: 'Safety', who: person('BL', 'Ben Lowe') },
      { id: 'e3', title: 'Fire door inspection', col: 'scheduled', tag: 'Safety', who: person('NS', 'Nia Shah, fire safety contractor', true) },
      { id: 'e4', title: 'Office move for the finance team', col: 'onsite', tag: 'Moves', who: person('GF', 'Gwen Ford') },
      { id: 'e5', title: 'Window cleaning contract renewed', col: 'complete', tag: 'Contracts', who: person('BL', 'Ben Lowe') },
    ],
  },
  {
    id: 'policy',
    name: 'Policy approvals',
    team: 'Governance',
    columns: [
      { id: 'drafting', name: 'Drafting' },
      { id: 'review', name: 'Review' },
      { id: 'signoff', name: 'Sign-off' },
      { id: 'published', name: 'Published' },
    ],
    cards: [
      { id: 'p1', title: 'Data retention schedule', col: 'drafting', tag: 'Information', who: person('KA', 'Kemi Adams') },
      { id: 'p2', title: 'Hybrid working policy', col: 'review', tag: 'HR', who: person('AM', 'Asha Mistry') },
      { id: 'p3', title: 'Expenses policy update', col: 'review', tag: 'Finance', who: person('RK', 'Rob Kerr') },
      { id: 'p4', title: 'Procurement guidance', col: 'signoff', tag: 'Finance', who: person('OE', 'Ola Eze, external auditor', true) },
      { id: 'p5', title: 'Safeguarding policy refresh', col: 'published', tag: 'People', who: person('KA', 'Kemi Adams') },
    ],
  },
];

const clone = (data) => JSON.parse(JSON.stringify(data));

export function initWorkStreamsDemo(root) {
  const tabsEl = root.querySelector('[data-tabs]');
  const boardEl = root.querySelector('[data-board]');
  const resetBtn = root.querySelector('[data-reset]');
  const helpId = root.querySelector('[data-help]')?.id;

  let streams = clone(SAMPLE);
  let current = 0;

  const board = new Board(boardEl, {
    columns: streams[0].columns,
    cards: streams[0].cards,
    label: `${streams[0].name} board`,
    helpId,
    renderMeta: (card) => [
      el('span', { class: 'tag tag-plain', text: card.tag }),
      card.who?.guest ? el('span', { class: 'tag tag-guest', text: 'Guest' }) : null,
    ].filter(Boolean),
    onChange: () => {
      streams[current].cards = board.cards;
      renderTabs();
    },
  });

  // Tabs are built once and then updated in place, so focus is never lost.
  const tabs = SAMPLE.map((stream, index) => {
    const count = el('span', { class: 'count' });
    const tab = el('button', {
      type: 'button',
      class: 'tab',
      role: 'tab',
      id: `ws-tab-${stream.id}`,
      'aria-controls': boardEl.id,
      onclick: () => select(index),
    }, el('span', { text: stream.name }), count);
    tab.count = count;
    return tab;
  });
  tabsEl.replaceChildren(...tabs);

  function renderTabs(focusIndex = null) {
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', String(index === current));
      tab.tabIndex = index === current ? 0 : -1;
      tab.count.replaceChildren(String(streams[index].cards.length), el('span', { class: 'visually-hidden', text: ' tasks' }));
    });
    if (focusIndex !== null) tabs[focusIndex].focus();
  }

  function show(index, { focusTab = false } = {}) {
    current = index;
    const stream = streams[index];
    boardEl.setAttribute('aria-labelledby', `ws-tab-${stream.id}`);
    board.setData(stream.columns, stream.cards, `${stream.name} board`);
    renderTabs(focusTab ? index : null);
  }

  function select(index, options) {
    streams[current].cards = board.cards; // keep the moves made on the board we are leaving
    show(index, options);
  }

  tabsEl.addEventListener('keydown', (event) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      select((current + keys[event.key] + streams.length) % streams.length, { focusTab: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      select(event.key === 'Home' ? 0 : streams.length - 1, { focusTab: true });
    }
  });

  resetBtn?.addEventListener('click', () => {
    streams = clone(SAMPLE);
    show(0);
    announce('The sample workstreams have been reset.');
  });

  boardEl.setAttribute('aria-labelledby', `ws-tab-${streams[0].id}`);
  renderTabs();
  root.classList.add('is-ready');
}

const root = document.querySelector('[data-ws-demo]');
if (root) initWorkStreamsDemo(root);
