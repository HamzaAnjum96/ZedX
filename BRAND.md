# Brand: Daylight

The identity of this referral partner site for **Group WorkStreams** and
**Agile Sprints**, two ZedX apps. It is light, close to the official ZedX site
so nobody arrives expecting something different, but it is not a copy: its own
type, its own blue and its own composition. It never redraws the products'
interface; every product image is a real screen.

A ZedX referral partner runs the site. Nothing here may suggest that the site
is ZedX's or Swiftpro's own.

Designed in November 2026 with the `landing-page-design` skill from
[elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills)
(MIT), vendored in `.claude/skills/landing-page-design/`. Its rules on type,
spacing, motion, navigation and copy apply unless this file says otherwise.

## Tokens

Source: `replica/design/tokens.json`. Generated CSS: `docs/assets/css/tokens.css`
(`python3 tools/build_tokens.py`). Never hand-edit the CSS or hard-code a value.

| token | hex | use |
| --- | --- | --- |
| `bg` | #FFFFFF | page background, screenshot frames, the header bar |
| `raised` | #F2F7FC | hero, page heroes, panels and the closing panel (the official site's own tint) |
| `line` | #D5DEE8 | rules, frames and table lines |
| `line-soft` | #E6ECF2 | quieter dividers |
| `control` | #7B8C9E | borders of controls (3:1) |
| `text` | #243549 | body text |
| `text-strong` | #0B1B2E | headings, labels, the wordmark |
| `muted` | #566575 | captions, notes and secondary text |
| `accent` | #176AAE | the one accent: buttons, links, focus ring, the ampersand |
| `accent-hover` | #12588F | hover and pressed state of the accent |
| `on-accent` | #FFFFFF | text on accent buttons |

The accent is ZedX's blue (#0280CE on zedxapps.com) darkened until it passes AA
as text and as a button background. All greys come from one cool family.

The contrast gate (`python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json`)
runs in CI and reports 15 pairs, 0 AA failures. Key results: text on bg 12.5:1,
muted on bg 6.0:1, accent on bg 5.7:1, white on accent 5.7:1.

Rules:

- **One accent.** No second brand colour, no background gradients, no glows.
- **No red, amber or green in the site's own design.** Those colours appear only inside product screenshots, where they are genuine statuses.
- **Light only.** There is no dark theme; the official ZedX site is light and visitors should find the same.

## Typography

- **Geist** 400/500/600, self-hosted Latin subset (`docs/assets/fonts`, SIL OFL). No second typeface, no monospace.
- **Named text styles only** (`heading-1` to `heading-6`, `title-1` to `title-5`, `body-1` to `body-8`, `button-*`, `caption-*`), on the Tailwind scale. Headings are weight 600 with tight tracking; body copy is `body-7` (18/28) on desktop.
- **The hero heading** uses a gentle ink-to-accent gradient as text fill. It is the only gradient on the site.
- **No orphans and no hyphens in copy.** Keep the last two words of a heading together with a non-breaking space (`everyday&nbsp;work.`), and wrap with `text-wrap: balance` or `pretty`.
- **Not used:** eyebrow labels or kickers above headings, uppercase labels and monospace "technical" labels. A test fails if any comes back.

## Spacing, shape and depth

- **Spacing:** the skill's scale, as `--space-*` tokens: 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px.
- **Layout:** content 1240px wide with 32px gutters (24px on phones); text held to a 680px measure. Breakpoints at 640, 900 and 1100px.
- **Radius:** Tailwind's scale. Buttons and chips are full pills, screenshot frames 12px, panels 16 to 24px.
- **Depth:** three shadows only: `frame` (screenshots), `bar` (the floating header) and `dialog` (the viewer).

## Motion

One curve for everything: `cubic-bezier(0.22, 1, 0.36, 1)`. Moves take 500ms,
fades 300ms and reveals 700ms, staggered by 80ms inside a group.

- **Scroll reveals** (`[data-reveal]`, grouped with `[data-reveal-group]`): a short rise and fade, once, through an IntersectionObserver.
- **The tagline** (`[data-words]`) lights up word by word as it scrolls into the middle of the screen. Screen readers get the whole sentence at once.
- **Tabs** fade their panel in when switched.
- **Safety:** `prefers-reduced-motion` turns all of this off. A failsafe class shows everything after three seconds if the script never runs, and without JavaScript nothing is hidden.

## Composition

| section | layout | why |
| --- | --- | --- |
| hero (raised) | editorial head: the two-sentence H1 (7/12) beside the offer, actions and referral note (5/12); then both board screens, layered, full width | the claim first, then the proof |
| Group WorkStreams | heading, benefits list and link beside a sticky screenshot of the workstreams list | the evidence is a list of workstreams by function |
| Agile Sprints | heading and text, then backlog and epics timeline as a pair | the evidence is a planning sequence |
| tagline | one sentence, large, lit word by word | a pause between the products and the detail |
| how the work moves | tabs: three steps for each app | the same question answered twice, without a long page |
| comparison | table with app icons: criterion, then the two apps; stacked with app labels on phones | a compact answer to "which fits?" |
| editions, access and hosting | three spec panels of label and detail rows | reference, scannable |
| FAQ | open answers in a two-column grid, each question an H3 | nothing hidden behind clicks |
| closing | one raised panel with the demo request, the demo and the brochure | the main action at the end |
| footer | the wordmark, one sentence on who runs the site, three links | short on purpose |

App pages open with a raised hero (H1, lead, actions, then a full-width board),
continue with numbered step sections, a tagline, "works alongside" rows, a
six-question FAQ and the closing panel.

## Components

- **Header:** a floating, frosted white bar (`.header-inner`, `shadow-bar`) under the work-in-progress strip. The wordmark is the two product names with "From a ZedX referral partner" in small type. Below 960px the navigation becomes a full-height menu with staggered links; the page behind it is made inert. From 960px the full navigation shows, so a phone in "desktop site" mode (about 980px) gets it, and up to 1100px the bar is tightened (smaller gaps, "Log in" for "Log in to ZedX").
- **Buttons:** accent pill (primary), quiet link with an icon (secondary). Minimum height 44px.
- **Screenshot figure** (`.shot`): white frame, 1px line, 12px radius, `shadow-frame`. Images are `<picture>` with a `-sm` detail crop up to 640px, width and height, srcset and sizes, lazy below the fold. Captions are one or two plain sentences naming the app, then "View full screen".
- **Viewer:** a `<dialog>` with a visible Close button, Escape to close, focus returned, fit and actual size. Without JavaScript the link opens the image.
- **Tabs** (`[data-tabs]`): real tab semantics added by script, arrow keys, Home and End. Without JavaScript both panels show in sequence.
- **Chips, rows, spec panels and the comparison table** carry reference detail with rules between rows.
- **Icons:** [Phosphor](https://phosphoricons.com) regular weight, as one SVG sprite (`docs/assets/img/icons.svg`), always decorative (`aria-hidden`).
- **Work-in-progress notice** (`.wip-notice`): the first thing in `.site-header` on every page, a white strip with a bottom rule. It stays on printed pages. The brochure cover carries it too.
- **Text pages** (`legal.html`, `privacy.html`): a short raised hero with the H1, a lead and the "Last updated" date, then `.prose`.
- **Brochure** (`brochure.css`): the same tokens and type. A pale blue cover with a faint column texture, white inside pages.

## Voice

Copy is written and edited with the `copywriting` and `copy-editing` skills in `.claude/skills/`. Their product context is `.claude/product-marketing.md`.

- **Plain British English:** organisation, prioritised, licence (noun).
- **Who we are, with a light touch.** The site comes from a ZedX referral partner. Say it once near the top ("This site comes from a ZedX referral partner. We make the introduction, and Swiftpro… takes it from there."), in the header note, the footer and the FAQ. The FAQ and the legal notice say that the partner may be rewarded when an introduction becomes a customer. Never "our software", "our platform" or "we built".
- **Links to zedxapps.com go only through the demo request** (`https://www.zedxapps.com/index.html#formContact`), so introductions can be tracked. Mention the site by name elsewhere, without a link. A test enforces this.
- **Source notes live in the legal notice only.** No "checked on" dates or lists of official sources on the other pages.
- **Scope:** Group WorkStreams and Agile Sprints. Project Portfolios and the other ZedX apps stay off the site, except where an app's own page names them.
- **Banned:** unlock, revolutionise, seamless, all-in-one, competitor names, the common AI-tell words (delve, leverage, empower, streamline, robust), em dashes, and the AI-tell sentence shapes in `.claude/skills/copywriting/references/ai-tells.md`. The site checker fails the build on the words and dashes.
- **Headings name the product and make a claim.** Questions are fine when they are the reader's own ("Which app fits your work?").
- **Keep claims to the source** (`replica/claims.md`): features stay with their app, hosting and licensing with their edition, "currently" stays on edition contents, Cloe AI says only what Swiftpro says, and nothing Swiftpro has withdrawn comes back.
- **No invented numbers:** no prices, customers, testimonials, outcomes or adoption figures.
- **"Request a demo"** opens Swiftpro's enquiry form, so say the request goes to Swiftpro and they get back to you. Never promise a booking. **"Try the demo yourself"** opens demo.zedx.net, which needs no registration. The free trial has no public sign-up link, so tell people to ask Swiftpro.
