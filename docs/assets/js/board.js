// An accessible Kanban board for the brochure's illustrations.
//
// Three ways to move a card, so nobody is left out:
//   - drag it with a mouse or pen (touch scrolls the page instead)
//   - its "move back" and "move on" buttons
//   - focus it and press ArrowLeft / ArrowRight (ArrowUp / ArrowDown move focus)
// Every move is announced through a polite live region.

import { el, icon, announce } from './dom.js';

let uid = 0;

export class Board {
  /**
   * @param {HTMLElement} mount  element the board renders into
   * @param {object} options
   *   columns     [{ id, name }]
   *   cards       [{ id, title, col, ... }]   array order = order within a column
   *   label       accessible name of the board
   *   helpId      id of the element describing the keyboard controls
   *   renderMeta  (card) => Node[]  tags under the title
   *   renderTools (card, board) => Node[]  extra controls in the card footer
   *   onChange    (event) => void  after every move or update
   */
  constructor(mount, options) {
    this.mount = mount;
    this.options = options;
    this.prefix = `b${uid += 1}`;
    this.setData(options.columns, options.cards);
    mount.addEventListener('pointerdown', (event) => this.onPointerDown(event));
    mount.addEventListener('keydown', (event) => this.onKeyDown(event));
  }

  setData(columns, cards, label = this.options.label) {
    this.columns = columns;
    this.cards = cards;
    this.options.label = label;
    this.render();
  }

  column(id) { return this.columns.find((col) => col.id === id); }
  columnIndex(id) { return this.columns.findIndex((col) => col.id === id); }
  cardsIn(colId) { return this.cards.filter((card) => card.col === colId); }

  update(id, changes, message, { focusSelector = null } = {}) {
    const card = this.cards.find((c) => c.id === id);
    Object.assign(card, changes);
    this.render({ focusSelector });
    if (message) announce(message);
    this.options.onChange?.({ type: 'update', card });
  }

  // focus: null (leave focus alone), 'card', or a data-role inside the card ('back', 'on')
  move(id, toCol, toIndex = Infinity, { focus = null, via = 'keyboard' } = {}) {
    const card = this.cards.find((c) => c.id === id);
    if (!card || !this.column(toCol)) return;
    const fromCol = card.col;

    const rest = this.cards.filter((c) => c !== card);
    const target = rest.filter((c) => c.col === toCol);
    let insertAt;
    if (toIndex < target.length) insertAt = rest.indexOf(target[Math.max(0, toIndex)]);
    else if (target.length) insertAt = rest.indexOf(target[target.length - 1]) + 1;
    else insertAt = rest.length;
    card.col = toCol;
    rest.splice(insertAt, 0, card);
    this.cards = rest;

    this.render({ focusId: focus ? id : null, focusRole: focus && focus !== 'card' ? focus : null, flashId: id });
    const count = this.cardsIn(toCol).length;
    if (fromCol !== toCol) {
      announce(`Moved “${card.title}” to ${this.column(toCol).name}. ${this.column(toCol).name} now has ${count} ${count === 1 ? 'card' : 'cards'}.`);
    } else if (via === 'pointer') {
      announce(`Reordered “${card.title}” in ${this.column(toCol).name}.`);
    }
    this.options.onChange?.({ type: 'move', card, from: fromCol, to: toCol });
  }

  step(id, direction, focus = 'card') {
    const card = this.cards.find((c) => c.id === id);
    const next = this.columnIndex(card.col) + direction;
    if (next < 0 || next >= this.columns.length) return;
    this.move(id, this.columns[next].id, Infinity, { focus });
  }

  render({ focusId = null, focusRole = null, flashId = null, focusSelector = null } = {}) {
    const active = document.activeElement;
    const activeId = this.mount.contains(active) ? active.closest('[data-id]')?.dataset.id : null;
    const activeRole = active?.dataset?.role;

    const board = el('div', { class: 'board', role: 'group', 'aria-label': this.options.label });
    this.columns.forEach((col, index) => {
      const cards = this.cardsIn(col.id);
      const titleId = `${this.prefix}-col-${col.id}`;
      const list = el('ul', { class: 'cards', role: 'list' },
        cards.map((card) => el('li', {}, this.renderCard(card, index))));
      board.append(el('section', { class: 'column', 'data-col': col.id, 'aria-labelledby': titleId },
        el('div', { class: 'column-head' },
          el('h4', { id: titleId, text: col.name }),
          el('span', { class: 'count', text: String(cards.length) }, el('span', { class: 'visually-hidden', text: cards.length === 1 ? ' card' : ' cards' }))),
        list));
    });
    this.mount.replaceChildren(board);

    const restoreId = focusId || activeId;
    if (restoreId) {
      const cardEl = this.mount.querySelector(`[data-id="${CSS.escape(restoreId)}"]`);
      const role = focusRole || (!focusId ? activeRole : null);
      let target = cardEl;
      if (role) target = cardEl?.querySelector(`[data-role="${role}"]:not(:disabled)`) || cardEl;
      if (focusSelector) target = cardEl?.querySelector(focusSelector) || cardEl;
      target?.focus({ preventScroll: true });
    }
    if (flashId) {
      this.mount.querySelector(`[data-id="${CSS.escape(flashId)}"]`)?.classList.add('just-moved');
    }
  }

  renderCard(card, colIndex) {
    const titleId = `${this.prefix}-card-${card.id}`;
    const prev = this.columns[colIndex - 1];
    const next = this.columns[colIndex + 1];
    const meta = this.options.renderMeta?.(card) || [];
    const tools = this.options.renderTools?.(card, this) || [];

    const back = el('button', {
      type: 'button', class: 'move-btn', 'data-role': 'back', disabled: !prev, tabindex: '-1',
      'aria-label': prev ? `Move “${card.title}” back to ${prev.name}` : `“${card.title}” is in the first column`,
      onclick: () => this.step(card.id, -1, 'back'),
    }, icon('chevron-left'));
    const on = el('button', {
      type: 'button', class: 'move-btn', 'data-role': 'on', disabled: !next, tabindex: '-1',
      'aria-label': next ? `Move “${card.title}” on to ${next.name}` : `“${card.title}” is in the last column`,
      onclick: () => this.step(card.id, 1, 'on'),
    }, icon('chevron-right'));

    const owner = card.who
      ? el('span', { class: `avatar${card.who.guest ? ' guest' : ''}`, title: card.who.name },
        el('span', { 'aria-hidden': 'true', text: card.who.initials }),
        el('span', { class: 'visually-hidden', text: `Owner: ${card.who.name}${card.who.guest ? ' (guest)' : ''}` }))
      : null;

    return el('article', {
      class: `task${card.blocked ? ' is-blocked' : ''}`,
      tabindex: '0',
      'data-id': card.id,
      'aria-labelledby': titleId,
      'aria-describedby': this.options.helpId,
    },
    el('div', { class: 'task-title', id: titleId, text: card.title }),
    meta.length ? el('div', { class: 'task-meta' }, meta) : null,
    el('div', { class: 'task-foot' },
      el('div', { class: 'task-who' }, owner, tools),
      el('div', { class: 'task-moves' }, back, on)));
  }

  // ----- keyboard -----

  onKeyDown(event) {
    const cardEl = event.target.closest?.('.task');
    if (!cardEl || event.target !== cardEl) return;
    const id = cardEl.dataset.id;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.step(id, event.key === 'ArrowLeft' ? -1 : 1, 'card');
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const siblings = Array.from(cardEl.closest('.cards').querySelectorAll('.task'));
      const index = siblings.indexOf(cardEl) + (event.key === 'ArrowUp' ? -1 : 1);
      siblings[index]?.focus();
    }
  }

  // ----- pointer dragging (mouse and pen) -----

  onPointerDown(event) {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    if (event.target.closest('button, a, input')) return;
    const cardEl = event.target.closest('.task');
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    this.drag = {
      id: cardEl.dataset.id,
      el: cardEl,
      startX: event.clientX,
      startY: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      width: rect.width,
      active: false,
    };
    const move = (e) => this.onPointerMove(e);
    const up = (e) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      this.onPointerUp(e);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  onPointerMove(event) {
    const drag = this.drag;
    if (!drag) return;
    if (!drag.active) {
      if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 5) return;
      drag.active = true;
      drag.ghost = drag.el.cloneNode(true);
      drag.ghost.removeAttribute('id');
      drag.ghost.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));
      drag.ghost.setAttribute('aria-hidden', 'true');
      drag.ghost.classList.add('is-dragging');
      Object.assign(drag.ghost.style, {
        position: 'fixed', left: '0', top: '0', width: `${drag.width}px`,
        pointerEvents: 'none', margin: '0',
      });
      this.mount.append(drag.ghost);
      drag.el.classList.add('is-placeholder');
      document.body.classList.add('is-dragging-card');
    }
    event.preventDefault();
    drag.ghost.style.transform = `translate(${event.clientX - drag.dx}px, ${event.clientY - drag.dy}px) rotate(1.5deg)`;

    const column = this.columnAt(event.clientX, event.clientY);
    if (column !== drag.target) {
      drag.target?.classList.remove('is-target');
      column?.classList.add('is-target');
      drag.target = column;
    }
    // Keep the board scrolling sideways when dragging near its edges.
    const wrap = this.mount.closest('.board-wrap');
    if (wrap) {
      const box = wrap.getBoundingClientRect();
      if (event.clientX > box.right - 40) wrap.scrollLeft += 12;
      else if (event.clientX < box.left + 40) wrap.scrollLeft -= 12;
    }
  }

  onPointerUp(event) {
    const drag = this.drag;
    this.drag = null;
    if (!drag?.active) return;
    drag.ghost.remove();
    drag.el.classList.remove('is-placeholder');
    drag.target?.classList.remove('is-target');
    document.body.classList.remove('is-dragging-card');
    if (event.type === 'pointercancel' || !drag.target) return;
    const colId = drag.target.dataset.col;
    const others = Array.from(drag.target.querySelectorAll('.task')).filter((node) => node.dataset.id !== drag.id);
    let index = others.findIndex((node) => {
      const box = node.getBoundingClientRect();
      return event.clientY < box.top + box.height / 2;
    });
    if (index === -1) index = Infinity;
    this.move(drag.id, colId, index, { via: 'pointer' });
  }

  columnAt(x, y) {
    const hit = document.elementFromPoint(x, y);
    const column = hit?.closest('.column');
    return column && this.mount.contains(column) ? column : null;
  }
}
