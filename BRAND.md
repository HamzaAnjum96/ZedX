# Brand: Structured clarity

The identity of this independent promotional site for **Group WorkStreams** and
**Agile Sprints**, two ZedX apps. It borrows the products' own navy
navigation, white working surfaces and blue/cyan accents. It does not copy
their administrative layout, and it never redraws their interface.

We are a third-party promotional partner. Nothing here may suggest that the
site is ZedX's or Swiftpro's own.

## Tokens

Source: `replica/design/tokens.json`. Generated CSS: `docs/assets/css/tokens.css`
(`python3 tools/build_tokens.py`). Never hand-edit the CSS or hard-code a value.

| token | hex | use |
| --- | --- | --- |
| `navy` | #0E3562 | hero, footer and closing band; headings; primary button on light |
| `ink` | #172A3A | body text |
| `paper` | #F8F7F4 | page background (the site is mostly light) |
| `white` | #FFFFFF | screenshot frames, comparison table, alternate bands |
| `cyan` | #18CEE6 | primary button on navy (navy text); focus ring and link underline on navy; the ampersand in the wordmark |
| `link` | #165A96 | links and focus ring on light |
| `border` | #D7E0E7 | fine rules and frames (decorative only) |
| `ink-muted` | #4A5866 | captions and secondary text |
| `on-navy-muted` | #C3D0DE | secondary text on navy |
| `on-navy-rule` | #3A5A80 | rules and frames on navy |
| `tint` | #EAF0F5 | viewer background, button hover |
| `control` | #7E8E9C | borders of controls on light (3:1) |

Every text and control pair is measured in the `pairs` list. The gate
(`python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json`)
runs in CI and currently reports 27 pairs, 0 AA failures. Key results:

- ink on paper: 13.7:1
- link on paper: 6.7:1
- cyan on navy: 6.5:1
- navy on cyan: 6.5:1

Rules:

- **Cyan never appears on a light background.** It fails as text there (1.6:1) and adds nothing as decoration.
- **No red, amber or green in the site's own design.** RAG colours appear only inside product screenshots, where they are genuine statuses.

## Typography

- **IBM Plex Sans** 400/500/600 for everything. There is no second typeface.
  - Fonts are self-hosted, Latin subset (`docs/assets/fonts`, SIL OFL).
  - System fallbacks are in the token.
- **Body:** 18/30px on desktop, 17/28px on phones. Lead text 20/32px.
- **Headings:**
  - Weight 600, tracking −0.01em.
  - Sizes: H1 35–50px, H2 27–34px, H3 22px.
  - Line lengths are capped (H1 15ch, H2 18–30ch) and wrapping is balanced.
- **Not used:**
  - eyebrow labels or kickers above headings, and monospace "technical" labels (a test fails if either comes back);
  - uppercase labels, slogans above H1 size, and text under 13px.

## Spacing and shape

- **Spacing:** an 8px rhythm (`--space-*`: 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128).
- **Width and gutters:** content is 1240px wide, with 32px gutters (20px on phones).
- **Shape:** mostly square, with 4px radius on buttons, 6px on screenshot frames and 8px on the dialog.
- **Shadows:** one restrained shadow on screenshot frames; none elsewhere.
- **Not used:** gradients, glass, glows, tilted or floating screenshots, background text and icon grids.

## Signature

Three elements, used consistently. The site gets its character from the real screens and plain writing, not from ornaments.

1. **Aligned edges.**
   - Copy and screenshots share grid lines.
   - Headings start level with the top edge of the screenshot beside them.
   - On wide screens, a product's "See how…" link lines up with the bottom of its screenshot caption.
2. **Fine horizontal rules.**
   - 1px rules separate sections, specification rows and FAQ items.
   - A 2px navy rule opens each sign-in, hosting and licensing group.
3. **Plain captions.**
   - Every caption is one or two ordinary sentences that name the app and say what is visible, followed by "View full screen".
   - Captions carry no separate label.

## Composition

| section | layout | why |
| --- | --- | --- |
| hero (navy) | left-aligned copy (5/12) beside two stacked board strips, one per app (7/12); on phones, copy and CTA first, then single-stage detail crops | both products and their difference visible at once, with real evidence |
| Group WorkStreams | heading, two short paragraphs and a link (4/12) beside the workstreams list (8/12) | the evidence is a list of workstreams by function |
| Agile Sprints | heading beside two short paragraphs and a link, then two screenshots as a pair (backlog, epics timeline) | the evidence is a planning sequence |
| comparison | white table: criterion, then the two apps; on phones each row stacks with small app labels | a compact answer to "which fits?" |
| leadership | editorial text (7/12) with the Project Portfolios dashboard as a supporting figure (5/12) | reporting is explained, not sold as a third product |
| adoption | three spec columns (sign-in, hosting, licensing) of label and detail rows | reference information, scannable |
| FAQ, closing, footer | question list beside its heading; navy closing band with one cyan action; navy footer with the attribution | the main action at the end, and who runs the site |

App pages open with a navy hero:

- the H1 and the actions sit side by side;
- a full-width board screenshot runs below them;
- step sections vary (text and figure, flipped, half and half, wide) according to the evidence.

## Components

- **Buttons**
  - **Cyan** (primary on navy).
  - **Navy** (primary on light).
  - **Outline** (header demo link). Minimum height 44–48px.
  - **Quiet links:** underlined text with an icon.
- **Screenshot figure** (`.shot`)
  - The frame is a white background, a 1px border, a 6px radius and one shadow. The `shot--navy` variant is used on navy.
  - Images are `<picture>`: a focused desktop crop, plus a `-sm` detail crop on screens up to 640px.
  - Every image has width and height, srcset and sizes. Images below the fold are lazy-loaded.
  - The caption is described above.
- **Viewer**
  - A `<dialog>` opened from "View full screen" or by clicking the screenshot.
  - Named by its title, with a visible Close button that takes focus on open.
  - Escape closes it, and focus returns to the trigger.
  - Fit and actual size: phones start at actual size, so the screen can be panned.
  - Without JavaScript, the link opens the image file.
- **Comparison table:** real table semantics, plus explicit roles so they survive the stacked layout on phones.
- **Spec rows** (`dl.spec-rows`, `dl.rows`): label and detail, separated by rules.
- **FAQ:** native `<details>`, with a chevron that turns on open.
- **Header:**
  - The text wordmark is the two product names, plus "Independent promotional site" in small type.
  - There is no logo, because we have no verified partner identity of our own.
  - The navigation becomes a menu button below 1100px.

## Voice

Copy is written and edited with the `copywriting` and `copy-editing` skills in `.claude/skills/`. Their product context is `.claude/product-marketing.md`.

- **Plain British English:** organisation, prioritised, licence (noun).
- **Name products and actions:** say "Group WorkStreams", "Agile Sprints", "request a demo", not "the solution".
- **Banned words:** unlock, revolutionise, seamless, all-in-one, competitor names, and the common AI-tell words (delve, leverage, empower, streamline, robust and similar). The site checker fails the build on them, and on em dashes.
- **No AI-tell sentence shapes:**
  - "not X, but Y" reveals;
  - negation lists;
  - sentences that trail off into extra comma clauses;
  - self-answered questions and colon reveals.
  - Write the fact instead; see `.claude/skills/copywriting/references/ai-tells.md`.
- **Headings name the product and make a claim** (for example "Group WorkStreams gives each kind of work its own board"). Questions are fine when they are the reader's own ("Which app fits your work?").
- **Never** say "our software", "our platform" or "we built". ZedX is Swiftpro's.
  - "We" means the promotional partner, and appears only where the site explains who runs it.
- **Keep claims to the source:**
  - App features stay attached to their app.
  - Hosting conditions stay attached to their licence.
  - Integration is "a separate service from Swiftpro Digital".
  - Leadership reporting arrives as periodic updates; the tasks stay on the team's board.
- **No invented numbers:** no prices, customers, testimonials, outcomes or adoption figures.
- **The demo button opens a vendor enquiry form,** so say that the request goes to Swiftpro and that the form doesn't book a time.
