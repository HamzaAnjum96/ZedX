# Components

Specs for every component on the brochure. Tokens only (`--c-*`, `--space-*`,
`--radius-*` ...), from `tokens.json` via `tools/build_tokens.py`. Primitives
are shown together in `replica/design/primitives.html`.

Colour coding is the system: **coral = Group WorkStreams**, **cyan = Agile
Sprints**, **ZedX blue = the platform**. Coral and cyan are fills and accents;
their `-ink` variants are the only versions used as text on light backgrounds.

## Primitives

```
Button
  variants  primary (accent), secondary (outline), ghost, on-dark (white outline on navy)
  sizes     md 44px, lg 52px; min target 44x44 everywhere
  states    default, hover (accent-strong), active (1px down), focus-visible (3px ring, focus), disabled
  tokens    bg accent, text on-accent, radius pill, font sans 600
  a11y      real <a> for navigation, <button> for actions; external links say so ("opens zedxapps.com")
  used on   header, heroes, CTA bands, demos

Link
  inline text links: accent, underline offset 3px, thicker underline on hover
  "arrow links" (See Group WorkStreams ->): 600 weight, arrow icon nudges 2px on hover

Eyebrow
  xs uppercase, letter-spacing .08em, a 10px square swatch in the section's colour
  on light: text-muted; on navy: on-navy-muted

Tag
  variants  low, normal, medium, high (priority), ws, as (app), blocked
  tokens    tag-*-bg + tag-*; radius sm; xs 600
  a11y      colour is never the only signal: the word is always printed

Avatar
  24px circle, initials, two-letter max; "guest" variant has a dashed ring and the word Guest in its label
```

## Layout

```
Header
  sticky, 72px, white at 92% with backdrop blur, border-bottom on scroll
  wordmark (text, not the official logo) + nav + Log in (ghost, external) + Book a demo (primary)
  < 900px: nav collapses behind a menu button (aria-expanded, aria-controls, Esc closes, focus returns)
  current page: aria-current="page" + underline

Section
  padding 96px top/bottom (64px < 900px); max width 1200; gutter 24 (16 < 600)
  variants: plain (bg), tinted (surface), dark (navy), ws-tint, as-tint

Hero
  navy background, faint vertical "lane" lines (board columns) as a CSS gradient
  h1 display size clamp(36px, 6vw, 60px), lead on-navy-muted, two buttons, illustration right (stacks below < 900px)

Footer
  navy-2, three columns: about line, links, credits; collapses to one column < 600px
```

## Cards and tiles

```
App card
  white, radius xl, shadow card, 6px top bar in ws or as
  icon in a tinted circle, h3, one line of who it is for, 4 bullet benefits, arrow link

Feature tile
  icon (24px, accent), h3 (lg), 1 to 2 sentences; grid 3 / 2 / 1 columns

Licence card
  outline card, small label (who it suits), h3, one sentence, list of what is included
  no prices (see launch/pricing.md)

CTA band
  navy, centred h2, one line, primary + secondary buttons
```

## Illustrations (interactive)

All sample data is invented and every illustration carries a visible
"Illustration with sample data" note.

```
Screen frame
  white panel, radius lg, shadow screen, top bar with a breadcrumb-style title
  never imitates ZedX's actual chrome or layout

Board (Group WorkStreams demo, Agile Sprints demo)
  workstream tabs: role=tablist, arrow keys move between tabs, one board per tab
  columns: <section> with an h4 header and a count; list of cards (role=list)
  card: <article> title, tags, avatar; focusable (tabindex 0)
    keyboard: ArrowLeft / ArrowRight move the card a column; also explicit
      "Move back" / "Move on" buttons inside the card for touch and mouse users
    pointer: drag with pointer events; drop targets highlight
    every move is announced in an aria-live="polite" region:
      "Moved 'Laptop for new starter' to Done. Done has 4 cards."
  states: default, focus-visible ring, dragging (lifted, shadow pop), drop-target (dashed outline), blocked (danger-tint + Blocked tag)
  reset button restores the sample data

Capacity meter (Agile Sprints)
  committed points vs capacity, as a bar plus the numbers in text

Burndown chart (Agile Sprints)
  SVG, ideal line (dashed, muted) and remaining-points line (as-ink); x = sprint day, y = points
  updates when a card reaches Done or the day advances; values also given in a text summary

Stand-up summary (Agile Sprints)
  panel listing done since last stand-up, in progress, blocked, generated from the board state
  "End the day" button advances the day and starts a fresh summary

Velocity chart (Agile Sprints)
  SVG bars, committed vs completed for six sample sprints, labelled values

Release timeline (Agile Sprints)
  rows per release version, bars spanning sprints
```

## Other

```
Chooser ("Which app fits?")
  4 questions, each a radiogroup of two or three segmented options (real radio inputs)
  live result panel (aria-live polite): WorkStreams, Agile Sprints, or both, with a reason
  works without JS as a plain form showing the comparison table below it

Comparison table
  real <table>, <th scope>, sticky first column on small screens with horizontal scroll inside its own box

Diagram ("Better together")
  inline SVG with <title>/<desc>, text as real text, colour-coded boxes, also described in prose

FAQ
  <details>/<summary>, chevron rotates, one paragraph each

Skip link
  first focusable element, visible on focus, jumps to <main id="main">
```

## Motion

Only `transform` and `opacity`. Hero cards drift between columns on a slow
loop. Everything stops under `prefers-reduced-motion: reduce`.

## Print

`print.css` hides navigation, demos' controls and decorative backgrounds,
and `brochure.html` is a separate A4 layout for the PDF.
