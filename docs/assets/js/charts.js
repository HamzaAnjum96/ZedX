// Charts for the Agile Sprints illustrations. Plain SVG, no library.
// Emphasis form: one accent series, one grey reference series. Every chart
// has a legend, a hover and keyboard tooltip, and a table view twin.
import { el, svg } from './dom.js';

const niceMax = (value, step = 10) => Math.max(step, Math.ceil(value / step) * step);

function tooltip(host) {
  let tip = host.querySelector('.tooltip');
  if (!tip) {
    tip = el('div', { class: 'tooltip', hidden: true, role: 'presentation' });
    host.append(tip);
  }
  return {
    show(x, y, title, rows) {
      tip.replaceChildren(
        el('div', { class: 'tt-title', text: title }),
        ...rows.map((row) => el('div', { class: 'tt-row' },
          el('span', { class: `tt-key${row.ref ? ' ref' : ''}` }),
          el('strong', { text: row.value }),
          el('span', { text: row.label }))),
      );
      tip.hidden = false;
      const hostBox = host.getBoundingClientRect();
      const left = Math.min(Math.max(x, 80), hostBox.width - 80);
      tip.style.left = `${left}px`;
      tip.style.top = `${y}px`;
    },
    hide() { tip.hidden = true; },
  };
}

function tableView(summary, head, rows) {
  return el('details', { class: 'table-toggle' },
    el('summary', { text: summary }),
    el('table', { class: 'data-table' },
      el('thead', {}, el('tr', {}, head.map((h) => el('th', { scope: 'col', text: h })))),
      el('tbody', {}, rows.map((r) => el('tr', {}, r.map((cell, i) => (i === 0
        ? el('th', { scope: 'row', text: String(cell) })
        : el('td', { text: String(cell) }))))))));
}

/**
 * Sprint burndown.
 * history: remaining points at the end of each finished day, starting with day 0
 * live:    remaining points right now (the day in progress), or null when the sprint is over
 */
export function renderBurndown(host, { days, committed, history, live, title }) {
  const W = 320; const H = 206;
  const m = { top: 14, right: 16, bottom: 40, left: 30 };
  const iw = W - m.left - m.right; const ih = H - m.top - m.bottom;
  const yMax = niceMax(committed);
  const x = (d) => m.left + (d / days) * iw;
  const y = (v) => m.top + ih - (v / yMax) * ih;
  const ideal = (d) => Math.round((committed - (committed * d) / days) * 10) / 10;

  const points = history.map((v, d) => ({ d, v }));
  if (live !== null && live !== undefined) points.push({ d: history.length, v: live });
  const last = points[points.length - 1];

  const grid = [];
  for (let v = 0; v <= yMax; v += 10) {
    grid.push(svg('line', { class: 'grid-line', x1: m.left, x2: W - m.right, y1: y(v), y2: y(v) }));
    grid.push(svg('text', { class: 'axis-text', x: m.left - 6, y: y(v) + 4, 'text-anchor': 'end', text: String(v) }));
  }
  const xTicks = [];
  for (let d = 0; d <= days; d += 2) {
    xTicks.push(svg('text', { class: 'axis-text', x: x(d), y: m.top + ih + 16, 'text-anchor': 'middle', text: String(d) }));
  }

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.d).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(last.d).toFixed(1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const labelBelow = y(last.v) < m.top + 24;

  const crosshair = svg('line', { class: 'crosshair', x1: 0, x2: 0, y1: m.top, y2: m.top + ih, visibility: 'hidden' });
  const chart = svg('svg', {
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': `${title}. ${last.v} of ${committed} points remain on day ${last.d} of ${days}; the ideal line would be at ${ideal(last.d)}.`,
  },
  grid,
  xTicks,
  svg('text', { class: 'axis-text', x: m.left + iw / 2, y: H - 4, 'text-anchor': 'middle', text: 'Sprint day' }),
  svg('path', { class: 'actual-area', d: area }),
  svg('path', { class: 'ideal', d: `M${x(0)} ${y(committed)} L${x(days)} ${y(0)}` }),
  svg('path', { class: 'actual', d: line }),
  svg('circle', { class: 'end-dot', cx: x(last.d), cy: y(last.v), r: 5 }),
  svg('text', {
    class: 'value-label',
    x: x(last.d) + (last.d > days - 2 ? -8 : 8),
    y: y(last.v) + (labelBelow ? 18 : -10),
    'text-anchor': last.d > days - 2 ? 'end' : 'start',
    text: `${last.v} left`,
  }),
  crosshair);

  const plot = el('div', {
    class: 'chart-plot',
    tabindex: '0',
    role: 'group',
    'aria-label': `${title}. Use the left and right arrow keys to read each day.`,
  }, chart);
  host.replaceChildren(
    plot,
    el('ul', { class: 'chart-legend' },
      el('li', {}, el('span', { class: 'key-line' }), 'Remaining points'),
      el('li', {}, el('span', { class: 'key-line ref' }), 'Ideal')),
    tableView('Show the numbers', ['Day', 'Remaining', 'Ideal'],
      Array.from({ length: days + 1 }, (_, d) => [d, points[d] ? points[d].v : '–', ideal(d)])),
  );

  const tip = tooltip(plot);
  let focusDay = last.d;
  const showDay = (d) => {
    const px = (x(d) / W) * plot.clientWidth;
    crosshair.setAttribute('x1', x(d));
    crosshair.setAttribute('x2', x(d));
    crosshair.setAttribute('visibility', 'visible');
    const rows = [];
    if (points[d]) rows.push({ value: `${points[d].v}`, label: 'remaining' });
    rows.push({ value: `${ideal(d)}`, label: 'ideal', ref: true });
    tip.show(px, (m.top / H) * plot.clientHeight, `Day ${d}${points[d] && d === points.length - 1 && live !== null && live !== undefined ? ' (today, live)' : ''}`, rows);
  };
  const hide = () => { crosshair.setAttribute('visibility', 'hidden'); tip.hide(); };
  plot.addEventListener('pointermove', (event) => {
    const box = plot.getBoundingClientRect();
    const vx = ((event.clientX - box.left) / box.width) * W;
    const d = Math.round(((vx - m.left) / iw) * days);
    showDay(Math.min(days, Math.max(0, d)));
  });
  plot.addEventListener('pointerleave', hide);
  plot.addEventListener('focus', () => showDay(focusDay));
  plot.addEventListener('blur', hide);
  plot.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusDay = Math.min(days, Math.max(0, focusDay + (event.key === 'ArrowLeft' ? -1 : 1)));
      showDay(focusDay);
    } else if (event.key === 'Escape') hide();
  });
}

/** Rounded data-end, square at the baseline. */
function barPath(x0, y0, w, h, r = 4) {
  const rr = Math.min(r, w / 2, h);
  return `M${x0} ${y0 + h} V${y0 + rr} Q${x0} ${y0} ${x0 + rr} ${y0} H${x0 + w - rr} Q${x0 + w} ${y0} ${x0 + w} ${y0 + rr} V${y0 + h} Z`;
}

/** Committed (grey) vs completed (accent) per sprint. */
export function renderVelocity(host, { sprints, title }) {
  const W = 460; const H = 232;
  const m = { top: 22, right: 8, bottom: 34, left: 30 };
  const iw = W - m.left - m.right; const ih = H - m.top - m.bottom;
  const yMax = niceMax(Math.max(...sprints.map((s) => s.committed)));
  const band = iw / sprints.length;
  const barW = Math.min(24, band * 0.3);
  const gap = 2;
  const y = (v) => m.top + ih - (v / yMax) * ih;

  const grid = [];
  for (let v = 0; v <= yMax; v += 10) {
    grid.push(svg('line', { class: 'grid-line', x1: m.left, x2: W - m.right, y1: y(v), y2: y(v) }));
    grid.push(svg('text', { class: 'axis-text', x: m.left - 6, y: y(v) + 4, 'text-anchor': 'end', text: String(v) }));
  }

  const plot = el('div', { class: 'chart-plot' });
  const tip = tooltip(plot);

  const groups = sprints.map((s, i) => {
    const cx = m.left + band * i + band / 2;
    const x1 = cx - barW - gap / 2;
    const x2 = cx + gap / 2;
    const carried = s.committed - s.done;
    const label = `${s.name}: ${s.done} of ${s.committed} points completed, ${carried} carried over`;
    const g = svg('g', { class: 'bar-group', tabindex: '0', role: 'img', 'aria-label': label },
      svg('rect', { class: 'bar-hit', x: m.left + band * i + 2, y: m.top, width: band - 4, height: ih, rx: 6 }),
      svg('path', { class: 'bar-committed', d: barPath(x1, y(s.committed), barW, y(0) - y(s.committed)) }),
      svg('path', { class: 'bar-done', d: barPath(x2, y(s.done), barW, y(0) - y(s.done)) }),
      svg('text', { class: 'value-label', x: x2 + barW / 2, y: y(s.done) - 6, 'text-anchor': 'middle', text: String(s.done) }),
      svg('text', { class: 'axis-text', x: cx, y: H - 12, 'text-anchor': 'middle', text: s.short }));
    const show = () => {
      const px = (cx / W) * plot.clientWidth;
      const py = (y(s.committed) / H) * plot.clientHeight;
      tip.show(px, py, s.name, [
        { value: `${s.done}`, label: 'completed' },
        { value: `${s.committed}`, label: 'committed', ref: true },
        { value: `${carried}`, label: 'carried over', ref: true },
      ]);
    };
    g.addEventListener('pointerenter', show);
    g.addEventListener('focus', show);
    g.addEventListener('pointerleave', () => tip.hide());
    g.addEventListener('blur', () => tip.hide());
    return g;
  });

  const avg = Math.round((sprints.reduce((sum, s) => sum + s.done, 0) / sprints.length) * 10) / 10;
  plot.prepend(svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'group', 'aria-label': `${title}. Average completed: ${avg} points per sprint.` },
    grid,
    svg('line', { class: 'grid-line', x1: m.left, x2: W - m.right, y1: y(0), y2: y(0) }),
    groups));

  host.replaceChildren(
    plot,
    el('ul', { class: 'chart-legend' },
      el('li', {}, el('span', { class: 'key-box' }), 'Completed'),
      el('li', {}, el('span', { class: 'key-box ref' }), 'Committed'),
      el('li', { class: 'legend-stat' }, `Average completed: ${avg} points`)),
    tableView('Show the numbers', ['Sprint', 'Committed', 'Completed', 'Carried over'],
      sprints.map((s) => [s.name, s.committed, s.done, s.committed - s.done])),
  );
}
