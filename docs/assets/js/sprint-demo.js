// Agile Sprints illustration: run a sample sprint. Moving stories updates
// the progress meter, the burndown and an automatically written stand-up
// summary; "End the day" moves the sprint on. All data is invented.
import { Board } from './board.js';
import { el, icon, announce } from './dom.js';
import { renderBurndown, renderVelocity } from './charts.js';

const DAYS = 10;
const CAPACITY = 34;
const START_DAY = 6;
const START_HISTORY = [31, 31, 28, 26, 26, 21]; // remaining at the end of days 0 to 5

const COLUMNS = [
  { id: 'todo', name: 'To do' },
  { id: 'doing', name: 'In progress' },
  { id: 'review', name: 'In review' },
  { id: 'done', name: 'Done' },
];
const COL_ORDER = Object.fromEntries(COLUMNS.map((c, i) => [c.id, i]));

const person = (initials, name) => ({ initials, name });
const STORIES = [
  { id: 's1', title: 'Visitor pre-registration form', col: 'done', points: 5, epic: 'Pre-registration', priority: 'high', who: person('AK', 'Amir Khan') },
  { id: 's2', title: 'Email confirmation with QR code', col: 'done', points: 3, epic: 'Pre-registration', priority: 'medium', who: person('LF', 'Lucy Fox') },
  { id: 's3', title: 'Accessibility review of the forms', col: 'done', points: 2, epic: 'Quality', priority: 'medium', who: person('OB', 'Omar Bashir') },
  { id: 's4', title: 'Reception check-in screen', col: 'review', points: 8, epic: 'Reception', priority: 'high', who: person('LF', 'Lucy Fox') },
  { id: 's5', title: 'Badge printing', col: 'doing', points: 5, epic: 'Reception', priority: 'normal', who: person('AK', 'Amir Khan') },
  { id: 's6', title: 'Host notified when a visitor arrives', col: 'doing', points: 3, epic: 'Reception', priority: 'medium', who: person('OB', 'Omar Bashir'), blocked: true },
  { id: 's7', title: 'Fire roll-call export', col: 'todo', points: 3, epic: 'Safety', priority: 'high', who: person('SR', 'Sara Reid') },
  { id: 's8', title: 'Visitor data retention rules', col: 'todo', points: 2, epic: 'Safety', priority: 'low', who: person('SR', 'Sara Reid') },
];
const PRIORITY = { low: 'Low', normal: 'Normal', medium: 'Medium', high: 'High' };

const VELOCITY = [
  { name: 'Sprint 1', short: 'S1', committed: 24, done: 18 },
  { name: 'Sprint 2', short: 'S2', committed: 26, done: 23 },
  { name: 'Sprint 3', short: 'S3', committed: 28, done: 27 },
  { name: 'Sprint 4', short: 'S4', committed: 30, done: 26 },
  { name: 'Sprint 5', short: 'S5', committed: 30, done: 29 },
  { name: 'Sprint 6', short: 'S6', committed: 32, done: 30 },
];

const clone = (data) => JSON.parse(JSON.stringify(data));
const sum = (cards) => cards.reduce((total, c) => total + c.points, 0);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export function initSprintDemo(root) {
  const boardEl = root.querySelector('[data-board]');
  const helpId = root.querySelector('[data-help]')?.id;
  const dayPill = root.querySelector('[data-day]');
  const endBtn = root.querySelector('[data-end-day]');
  const resetBtn = root.querySelector('[data-reset]');
  const capacityEl = root.querySelector('[data-capacity]');
  const burndownEl = root.querySelector('[data-burndown]');
  const standupEl = root.querySelector('[data-standup]');

  let day;
  let history;
  let finished;
  let startOfDay;

  const snapshot = (cards) => Object.fromEntries(cards.map((c) => [c.id, { col: c.col, blocked: !!c.blocked }]));

  const board = new Board(boardEl, {
    columns: COLUMNS,
    cards: clone(STORIES),
    label: 'Sprint 7 board',
    helpId,
    renderMeta: (card) => [
      el('span', { class: 'tag tag-plain', text: card.epic }),
      el('span', { class: `tag tag-${card.priority}`, text: PRIORITY[card.priority] }),
      card.blocked ? el('span', { class: 'tag tag-blocked' }, icon('circle-alert', 'icon icon-sm'), 'Blocked') : null,
    ].filter(Boolean),
    renderTools: (card) => [
      el('span', { class: 'points' }, `${card.points}`, el('span', { class: 'visually-hidden', text: ' story points' }), el('span', { 'aria-hidden': 'true', text: ' pts' })),
      card.col === 'done' ? null : el('button', {
        type: 'button',
        class: 'block-btn',
        'data-role': 'block',
        'aria-pressed': String(!!card.blocked),
        'aria-label': `Blocked: ${card.title}`,
        disabled: finished,
        onclick: () => {
          const blocked = !card.blocked;
          board.update(card.id, { blocked }, blocked ? `“${card.title}” is now marked as blocked.` : `“${card.title}” is no longer blocked.`, { focusSelector: '[data-role="block"]' });
        },
      }, icon('circle-alert'), card.blocked ? 'Blocked' : 'Block'),
    ].filter(Boolean),
    onChange: (event) => {
      if (event.type === 'move' && event.to === 'done' && event.card.blocked) {
        event.card.blocked = false;
        board.render({ focusId: document.activeElement?.closest?.('[data-id]')?.dataset.id || null });
      }
      refresh();
    },
  });

  function remaining() {
    return sum(board.cards.filter((c) => c.col !== 'done'));
  }

  function refresh() {
    const committed = sum(board.cards);
    const done = committed - remaining();
    renderCapacity(committed, done);
    renderBurndown(burndownEl, {
      days: DAYS,
      committed,
      history,
      live: finished ? null : remaining(),
      title: 'Sprint 7 burndown',
    });
    renderStandup();
    dayPill.textContent = finished ? 'Sprint finished' : `Day ${day} of ${DAYS}`;
    endBtn.replaceChildren(icon(finished ? 'refresh-ccw' : 'arrow-right'),
      finished ? 'Run the sprint again' : (day < DAYS ? `End day ${day}` : 'End the sprint'));
  }

  function renderCapacity(committed, done) {
    const pctCap = Math.round((committed / CAPACITY) * 100);
    const pctDone = committed ? Math.round((done / committed) * 100) : 0;
    capacityEl.replaceChildren(
      el('h4', {}, 'Capacity', el('span', { text: `${committed} of ${CAPACITY} points planned` })),
      el('div', { class: 'meter', role: 'img', 'aria-label': `${committed} of ${CAPACITY} points of capacity planned` }, meterFill(pctCap)),
      el('h4', { class: 'meter-gap' }, 'Progress', el('span', { text: `${done} of ${committed} points done` })),
      el('div', { class: 'meter meter-done', role: 'img', 'aria-label': `${done} of ${committed} points done` }, meterFill(pctDone)),
    );
  }

  function meterFill(pct) {
    const fill = el('span', {});
    fill.style.width = `${Math.min(100, pct)}%`;
    return fill;
  }

  function renderStandup() {
    const cards = board.cards;
    const head = el('h4', {}, finished ? 'Sprint summary' : 'Stand-up summary', el('span', { text: finished ? 'Sprint 7' : `Day ${day}` }));
    if (finished) {
      const committed = sum(cards);
      const doneCards = cards.filter((c) => c.col === 'done');
      const carried = cards.filter((c) => c.col !== 'done');
      standupEl.replaceChildren(head, el('div', { class: 'standup' },
        el('ul', {},
          el('li', { class: 's-done' }, icon('circle-check'), el('span', { text: `Completed ${sum(doneCards)} of ${committed} points (${plural(doneCards.length, 'story', 'stories')}).` })),
          el('li', { class: carried.length ? 's-blocked' : 's-done' }, icon(carried.length ? 'circle-alert' : 'circle-check'),
            el('span', { text: carried.length ? `Carried over: ${carried.map((c) => c.title).join(', ')} (${sum(carried)} points).` : 'Nothing carried over.' })),
          el('li', { class: 's-doing' }, icon('chart-column'), el('span', { text: `Velocity for this sprint: ${sum(doneCards)} points.` }))),
        el('p', { class: 'standup-stamp', text: 'Written from the board automatically.' })));
      return;
    }

    const doneToday = cards.filter((c) => c.col === 'done' && startOfDay[c.id]?.col !== 'done');
    const startedToday = cards.filter((c) => ['doing', 'review'].includes(c.col) && startOfDay[c.id]?.col === 'todo');
    const movedBack = cards.filter((c) => startOfDay[c.id] && COL_ORDER[c.col] < COL_ORDER[startOfDay[c.id].col]);
    const active = cards.filter((c) => ['doing', 'review'].includes(c.col));
    const blocked = cards.filter((c) => c.blocked);
    const unblocked = cards.filter((c) => !c.blocked && startOfDay[c.id]?.blocked);

    const items = [];
    items.push(doneToday.length
      ? el('li', { class: 's-done' }, icon('circle-check'), el('span', { text: `Done since the last stand-up: ${doneToday.map((c) => `${c.title} (${c.points})`).join(', ')}.` }))
      : el('li', { class: 's-quiet' }, icon('circle-check'), el('span', { text: 'Nothing finished since the last stand-up yet.' })));
    items.push(el('li', { class: 's-doing' }, icon('refresh-ccw'), el('span', {
      text: `In progress: ${plural(active.length, 'story', 'stories')}, ${sum(active)} points.${startedToday.length ? ` Started today: ${startedToday.map((c) => c.title).join(', ')}.` : ''}`,
    })));
    if (movedBack.length) {
      items.push(el('li', { class: 's-quiet' }, icon('chevron-left'), el('span', { text: `Moved back: ${movedBack.map((c) => c.title).join(', ')}.` })));
    }
    items.push(blocked.length
      ? el('li', { class: 's-blocked' }, icon('circle-alert'), el('span', { text: `Blocked: ${blocked.map((c) => c.title).join(', ')}.` }))
      : el('li', { class: 's-done' }, icon('circle-check'), el('span', { text: 'Nothing is blocked.' })));
    if (unblocked.length) {
      items.push(el('li', { class: 's-done' }, icon('circle-check'), el('span', { text: `Unblocked today: ${unblocked.map((c) => c.title).join(', ')}.` })));
    }
    standupEl.replaceChildren(head, el('div', { class: 'standup' }, el('ul', {}, items),
      el('p', { class: 'standup-stamp', text: 'Written from the board automatically.' })));
  }

  function reset({ quiet = false } = {}) {
    day = START_DAY;
    history = [...START_HISTORY];
    finished = false;
    board.locked = false;
    board.setData(COLUMNS, clone(STORIES));
    startOfDay = snapshot(board.cards);
    refresh();
    if (!quiet) announce('The sample sprint has been reset to day 6.');
  }

  endBtn.addEventListener('click', () => {
    if (finished) { reset(); return; }
    const left = remaining();
    history.push(left);
    if (day >= DAYS) {
      finished = true;
      board.setLocked(true);
      refresh();
      announce(`Sprint finished with ${left} points remaining. The sprint summary is ready.`);
      return;
    }
    day += 1;
    startOfDay = snapshot(board.cards);
    refresh();
    announce(`Day ${day - 1} closed with ${left} points remaining. Day ${day} has started with a fresh stand-up summary.`);
  });
  resetBtn?.addEventListener('click', () => reset());

  reset({ quiet: true });
  root.classList.add('is-ready');
}

const root = document.querySelector('[data-sprint-demo]');
if (root) initSprintDemo(root);

const velocityEl = document.querySelector('[data-velocity]');
if (velocityEl) renderVelocity(velocityEl, { sprints: VELOCITY, title: 'Velocity across six sample sprints' });
