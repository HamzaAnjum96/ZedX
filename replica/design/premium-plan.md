# Premium pass: design plan (second version)

A brief for the model that implements it. Written 15 November 2026, after the
light "Daylight" redesign went live. This version replaces the first plan: the
owner asked for more ("needs more design upgrades… improve the whole site
using premium UI design language and choices"). Nothing here is built yet,
except the navigation fix in section 0.

## What the owner asked for

- "Make this site look more premium." "Elevate the site to the next level."
- "Tables are good, radio switch is also good. Decide which is best where."
  (The "radio switch" is the Group WorkStreams / Agile Sprints pill in "How the
  work moves".) Earlier: "Don't overuse it."
- "Ask Swiftpro for a demo card could be better. Please improve."
- "Don't change the theme or colours."

So: same palette, same typeface, still light. The upgrade comes from a
stricter design language, a tighter page, two patterns used with intent (the
switch and the table) and a finish layer.

Done means: the ten work packages in section 5 are live on `main`, every check
in section 7 passes, and each page has been looked at (not only tested) at
1440, 980, 768 and 390px.

## 0. Already done: navigation in "desktop site" mode

Chrome on Android lays a page out about 980px wide when "Desktop site" is on.
The full navigation now shows from **960px** (commit `8018a54`), with a
tightened bar up to 1099px. The page *layout* still changes at 1100px, on
purpose. The owner checks the site at about 980px, so every new layout must
look intended there, not like a stretched phone page.

## 1. Ground rules

Read `BRAND.md` first, then `.claude/skills/landing-page-design/SKILL.md`
(Part B is the visual system). Where they disagree, `BRAND.md` wins.

- **Tokens only.** Colours, text styles, spacing, radii, shadows and motion
  come from `replica/design/tokens.json` through `tokens.css`
  (`python3 tools/build_tokens.py`). **No new colours.** New shadow tokens are
  allowed (section 2). Any new text and background pairing goes in `pairs` so
  the contrast gate covers it.
- **Spacing** from the scale (0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96).
  **Text** only through the named styles. **Motion** only on `transform` and
  `opacity`, on the base curve, with a `prefers-reduced-motion` fallback.
  Nothing animates height or width.
- **No background gradients, no italics, no eyebrow labels or kickers, no
  monospace, no hyphens in copy, no orphaned last words.**
- **No card with a border on one side only.** Dividers *inside* a card are
  fine. Nested radius = outer radius minus the gap, when the gap is under 32px.
- **Static site.** No build step, framework or new dependency. No request to
  another host, no cookies, no web storage and no `<form>` element: the
  privacy policy promises this and `e2e/content.spec.ts` holds every page to it.
- **Works without JavaScript.** Everything enhanced starts as readable HTML in
  a sensible order. Controls that need script carry `hidden` until ready.
- **Only real screens.** No drawn or mocked product UI, no inline SVG in `main`
  except `.icon` sprites, no canvas. Every screenshot is an `img` in a `figure`
  whose caption names its app, with real `alt` text (over 30 characters), width
  and height, and an undistorted box. The existing crops are all there is:
  the raw captures are not in the repository, so do not plan on new crops. To
  show part of a screen, clip it with a parent (`overflow: hidden`), never with
  `object-fit`.
- **Claims come from `replica/claims.md`**, conditions included ("currently",
  per edition). Nothing invented: no prices, customers, numbers or quotes.
- **Referral rules.** The only link to zedxapps.com is the demo request,
  `https://www.zedxapps.com/index.html#formContact`. No source lists or
  "checked on" dates outside the legal notice. Project Portfolios stays off.
- **Voice.** A ZedX referral partner runs the site and says so lightly. Never
  "our software". New copy goes through the `copywriting` skill and a
  `copy-editing` pass; their context is `.claude/product-marketing.md`.
- **Accessibility.** axe (WCAG 2.2 A and AA) stays at zero violations. Every
  control has hover, active and visible focus states and a 44px target.
- **Anchors survive.** `#apps`, `#workstreams`, `#sprints`, `#how`,
  `#compare`, `#adoption`, `#platform`, `#licensing` and `#faq` must still
  exist on the home page; other pages link to them.

Icons are Phosphor, regular weight. Add one by mapping it in
`tools/build_sprite.py` and rebuilding the sprite (the command is in that
file's header).

## 2. The design language: quiet precision

Premium here means edited, exact and calm. Six choices, applied everywhere.
Build them once (WP1) as shared classes, then compose pages from them.

1. **Three surfaces.** Page (`bg`), tint (`raised`) and card (`bg` on either).
   A card is never tint on tint.
2. **Hairline plus soft depth.** A card's edge is a 1px ring, drawn as a
   shadow, with a soft drop beneath it, so the edge stays crisp on white and on
   tint. Add two shadow tokens:
   - `card`: `0 0 0 1px` of the `line` colour, plus
     `0 1px 2px rgba(11, 27, 46, 0.04)` and
     `0 12px 24px -16px rgba(11, 27, 46, 0.14)`;
   - `lift` (hover): the same ring with
     `0 2px 4px rgba(11, 27, 46, 0.05)` and
     `0 24px 40px -20px rgba(11, 27, 46, 0.2)`.
   Cards use `radius-2xl`, large panels `radius-3xl`, controls are pills.
   Components: `.card`, `.card--tint` (tint, ring, no drop) and `.well` (a tint
   inset inside a card that holds a screen, radius by the nested formula).
3. **The accent is rare.** `accent` appears only on the primary button, the
   selected state of the switch, links, check marks and the ampersand. Icons
   that are not one of those are `muted` or `text-strong`. One accent button
   per screenful.
4. **Two tone headings.** Section headings set their claim in `text-strong`
   and their continuation in `muted` (a `span.soft`). For example, in "How
   the work moves, in three steps", "How the work moves," is strong and "in
   three steps" is muted. Large text only (36px and up), so `muted` passes
   contrast. Do not rewrite headings to fit; where a heading has no natural
   second clause, leave it one tone. The hero keeps its existing ink to accent text
   fill and is the only heading with it.
5. **Labelled frames.** A large screenshot sits in a frame with a slim top bar
   (40px, tint, hairline below): on the left the app label (icon and name, the
   existing `.app-label`) and the name of the view, for example "Complaints &
   Compliments Log". It is site chrome with true labels, not a drawing of the
   product. Small screens inside cards go in a `.well` without the bar.
6. **Icon tiles.** Where an icon leads a block (benefits, table rows, spec
   titles, steps), it sits in a 40px tile: `radius-lg`, tint background on
   white, white with a ring on tint, icon at 20px in `text-strong`.

Plus one motif, **the board column lines**: faint vertical lines, the edges of
Kanban columns, drawn as a tiled inline SVG of one 1px line in the `line-soft`
colour (as `.cover::before` in `brochure.css` already does), sized to one
twelfth of the container so the lines are the layout grid itself. Use it in
four places only: the home hero, page heroes, the demo card and the 404 page.
It is one documented raw colour in a data URI; note it in
`DEVELOPER-NOTES.md` beside the viewer backdrop.

## 3. Switch or table: which goes where

The rule. Content that exists once per app is one of two kinds:

- **Deep and parallel** (screens, a sequence of steps, a message): the visitor
  wants one app at a time, and showing both doubles the page. Use **the
  switch**.
- **Short and parallel** (facts that fit a cell): seeing both at once *is* the
  value. Use **a table**.

Content shared by both apps (access, hosting, who runs the site) gets neither.

| content | pattern | why |
| --- | --- | --- |
| Home: how each app works, with its screens | **switch** | deep; today it fills two long sections plus a steps section |
| Home: which app fits | **table** | six short answers per app, read across |
| Home: editions | **table** | six editions, five short facts each |
| Home hero: the two boards | neither | the headline names both apps, so both boards show, layered |
| Demo card: what the visitor wants to see | **switch** (three options) | sets a value, and the note changes with it |
| App pages: this app or the other | **switch**, as two links | the same two options the visitor already knows |
| App pages: at a glance | **table** (one app's column) | four short facts |
| App pages: works alongside | **table** (label and detail rows) | reference |
| FAQ | accordion | questions are scanned, answers read one at a time |
| Access, hosting and integration | label and detail rows | shared by both apps |

The switch always means the same thing, **Group WorkStreams or Agile
Sprints**, and appears at most twice on a page: home (showcase, demo card), app
pages (hero, demo card). Never in the header, the tables, the FAQ or the footer.

## 4. Page blueprints

### Home, top to bottom

1. **Hero** (tint, motif). The headline, offer and action as now. The three
   proof facts become one fact bar: a single card with three cells, divided by
   hairlines, each an icon tile and a sentence. The two boards stay layered
   but become labelled frames, larger, with the back frame coming forward on
   hover, focus or tap.
2. **Showcase**: "How the work moves". One section that replaces today's
   three (`#workstreams`, `#sprints` and `#how`). The switch chooses the app;
   each app's panel has its claim, its lead, its three benefits as a compact
   checklist, and three step cards, each with a real screen.
3. **Tagline** (unchanged, word by word).
4. **Compare** (table, finished).
5. **Editions** (table), then Access and Hosting as two panels.
6. **FAQ** (accordion beside a sticky heading).
7. **Demo card** (switch and note).
8. **Footer** (unchanged: one sentence, three links).

The home page gets shorter and denser. On a phone it is about 14,700px tall
today; aim for under 9,000.

### App pages

1. **Hero** (tint, motif): the app switch as two links, the H1, lead and
   action, then the large board in a labelled frame.
2. **At a glance**: four facts on one card.
3. **The story**: the existing step sections become one scroll story. On wide
   screens the text scrolls on the left and a sticky stage on the right swaps
   to each step's screen.
4. **Tagline** (unchanged).
5. **Works alongside** (rows, on a card).
6. **FAQ** (accordion).
7. **Demo card**, defaulting to this app.

### Legal notice and privacy policy

A short tint hero with the motif and the "Last updated" date as a chip. Below,
two columns at 1100px and up: a sticky "On this page" list on the left and the
prose at the 680px measure on the right.

### 404

The motif, a larger heading and the four links as rows on one card.

## 5. Work packages

Build in this order. One package per commit. Run section 7 before each push.

### WP1. Foundations

- Tokens: shadows `card` and `lift`. Rebuild `tokens.css`.
- Classes: `.card`, `.card--tint`, `.well`, `.icon-tile`, `.soft` (two tone
  headings), `.frame-bar` (labelled frames), `.has-columns` (the motif),
  `.btn-quiet` (white, 1px `control` border, `text-strong` text, the same
  size and states as `.btn-accent`).
- **The switch as a component.** Today it is `.tab-list`, `.tab` and
  `.tab-indicator`, and the indicator only handles two options
  (`[data-active='1']`). Generalise it: `--seg-count` on the list,
  `--seg-index` set from script, indicator width
  `calc((100% - 2 * var(--space-50)) / var(--seg-count))` and
  `transform: translateX(calc(var(--seg-index) * 100%))`. One look, three
  semantics:
  - *tabs* (showcase): the current `tablist` script;
  - *radio group* (demo card): a `fieldset`, a visually hidden `legend`, and
    native `input type="radio"` with `label` pairs (no `<form>` needed);
  - *links* (app page hero): a `nav` with two links, the current one carrying
    `aria-current="page"`.
  States: hover, active (`scale(0.98)`), focus ring, selected (white on
  accent). The indicator slides in 500ms on the base curve and jumps under
  reduced motion.
- Section spacing: 96px between sections at 900px and up, 64px below.
- Apply two tone headings and icon tiles where sections already exist, so the
  later packages only compose.

### WP2. Home hero

- Fact bar as described. Keep the three sentences and the referral note
  beneath it.
- The two figures become labelled frames ("Group WorkStreams · Catering &
  Vending Machine Issues" and "Agile Sprints · Current Sprint"). Keep their
  images, captions and viewer links exactly.
- At 1100px and up, widen the pair to the full container and deepen the
  overlap. `:hover` and `:focus-within` on a figure raise it above the other
  (`z-index` plus a 8px `translateY` on the base curve). No script.
- Below 1100px they stack as now. At 390px the first screen must still show
  the headline, the lead and "Request a demo".

### WP3. Home showcase (replaces `#workstreams`, `#sprints` and `#how`)

```html
<section class="section showcase" id="apps" aria-labelledby="how-title">
  <div class="container">
    <div class="section-head">… h2#how-title "How the work moves" + lead …</div>
    <div class="tabs" id="how" data-tabs>
      <div class="tab-list" data-tab-list data-label="Choose an app" hidden>… two tabs …</div>
      <div class="tab-panel" id="workstreams"> … </div>
      <div class="tab-panel" id="sprints"> … </div>
    </div>
  </div>
</section>
```

Each panel:

- **Head row:** an `h3` with the app's claim (keep the current wording:
  "Group WorkStreams takes everyday work out of spreadsheets", "Agile Sprints
  takes Scrum teams from backlog to release"), the current lead, the three
  current benefit titles as a one line checklist with check icons, and the
  link "See how Group WorkStreams works" (or Agile Sprints).
- **Three step cards** in a row at 900px and up, stacked below. Each `.card`
  has a `.well` at the top holding a `figure` (the screen, clipped by the well
  to a 4 to 3 window, anchored top left, its caption and "View full screen"
  link under the image inside the card), then the step number in a small
  tile, the step title (`h4`) and its sentence. Use the current steps copy.

  | app | step | screen (existing crop) |
  | --- | --- | --- |
  | Group WorkStreams | 1. Give each service a workstream | `gw-workstreams-list-*` |
  | | 2. Set the stages, then log the work | `gw-board-wide-*` (Complaints & Compliments Log) |
  | | 3. Watch the workload | `gw-insights-chart-*` |
  | Agile Sprints | 1. Fill and rank the backlog | `as-epics-timeline-*` |
  | | 2. Plan the sprint to capacity | `as-backlog-refine-*` |
  | | 3. Run it, review it, close it | `as-sprint-wide-*` |

  Take each crop's `alt`, caption, viewer attributes and phone source from
  where it is used today (`index.html` or the app page).
- **The switch** sits under the section head and is `position: sticky` below
  the header bar while the showcase is on screen, so a phone visitor can change
  app from anywhere in the panel.
- **Addresses.** Opening `/#sprints` (or following a link to it) selects that
  tab before scrolling; the same for `#workstreams`. Handle `hashchange` too.
- **Switching** fades the new panel in over 300ms with a 16px rise. The cards
  inside arrive 80ms apart.
- **Without JavaScript** both panels show, one after the other, each under its
  `h3`: the page as it is today.

### WP4. Comparison table (`#compare`)

Keep the content and the table semantics.

- On a `.card`. Header row on tint, with the two app labels. At 900px and up
  the header row is sticky under the header bar
  (`top: calc(var(--layout-header) + var(--space-300))`), opaque.
- An icon tile before each row label.
- Row hover and `:focus-within`: the row takes the tint (300ms).
- A `tfoot` row with a link under each app column, to that app's page.
- "Need both?" becomes a `.card--tint` under the table: the two app labels
  joined by a link icon on the left, the existing sentence on the right.
- Phones keep the stacked rows with app labels (both answers stay visible:
  that is the point of a comparison), restyled as one card per question.
- `font-variant-numeric: tabular-nums` in both tables.

### WP5. Editions table (`#licensing`) and the two panels

Today the editions are six paragraphs in one of three text columns, the
weakest part of the page. Make them a table in the same family as WP4, full
width. Editions are the **rows**, so it reads as a ladder and stacks into one
card per edition on phones (the `data-label` pattern WP4 uses).

| Edition | Group WorkStreams | Agile Sprints | Users | Licensing | Hosting |
| --- | --- | --- | --- | --- | --- |
| **Home**. For individuals, who can invite friends and family. | Included | Not included | | Per user | Hosted by ZedX |
| **Professional**. For professionals and small or medium businesses. | Included | Included | Ideally 1 to 50 | Per user | Hosted by ZedX |
| **Group**. For independent teams and groups. | Included | Included | Ideally 1 to 50 | Per user | Hosted by ZedX |
| **Corporate**. For businesses that want the full range of apps. | Your choice | Your choice | | Users plus app usage | Hosted by ZedX |
| **Enterprise**. For government, education and larger organisations. | Your choice | Your choice | Unlimited | The apps you choose, with a usage allowance for each | Your own Azure subscription or other agreed infrastructure |
| **Enterprise Plus**. Every current and future ZedX app. | Included | Included | Unlimited | No usage limits | Your own Azure subscription or other agreed infrastructure |

- Sources: claims L5, L6, L14 and L16. Leave a cell empty where Swiftpro
  states nothing (users for Home and Corporate). No Cloe AI column: the
  Editions page states it for Home, Professional and Group only.
- "Included" is a check icon in the accent plus the word; "Not included" a
  minus icon in `muted` plus the words; "Your choice" is text only. The words
  are always in the markup.
- Notes under the table, caption style: "Which apps an edition includes is as
  Swiftpro currently lists it. Home, Professional and Group also include Cloe
  AI." and the existing sentence about prices.
- Keep `id="licensing"` on the table's wrapper and `id="platform"` on Access.
- Below, **Access** and **Hosting and integration** as two `.card` panels side
  by side, each a title with an icon tile and label and detail rows. Drop the
  "Hosting" row now that the table says it; keep Integration, Apps on Demand
  and Technology.
- New icon: `minus`.

### WP6. FAQ (home and both app pages)

- At 1100px and up, two columns: on the left the heading, the lead and a quiet
  link ("Try the demo yourself"), `position: sticky`; on the right one `.card`
  holding the questions, divided by hairlines.
- Each question is a native `details` (keep the class `qa`), its `summary`
  holding the `h3` and a plus icon that turns 45 degrees when open. The first
  question starts open. Several can be open at once.
- Opening fades the answer in with an 8px rise (opacity and transform only).
  No height animation.
- Why this reverses the "open answers" choice of the last pass: eight open
  answers are a third of the phone page, and scanning questions is what
  visitors do first. The answers stay in the HTML, so search engines and "find
  in page" still reach them.

### WP7. The demo card (`.closing`, on the home page and both app pages)

Today: a tint panel with a heading, a paragraph and four stacked links. It
tells the visitor to say which app they want, and gives no help doing it. And
nothing tells Swiftpro the visitor came from this site, because the demo link
is a plain link to their form.

Make the card do that work. The visitor picks what they want to see, the card
writes a short note, they copy it and paste it into Swiftpro's form. The note
ends by naming this site, which is how the owner's introductions can be
recognised.

Layout at 900px and up, inside one panel (`radius-3xl`, tint, ring, the motif
behind the left column):

- **Left:** the `h2`, one sentence, then "what happens next" as three short
  numbered steps, then the muted line about the open demo and the free trial.
- **Right:** a white `.card` (24px padding) with the switch, the note and the
  two buttons.
- **Below both, full width:** three quiet links in a row (demo, brochure,
  customer login), set apart by space.

On phones: heading, steps, inner card, links.

```html
<div class="card note-card" data-demo-note data-default="both" hidden>
  <fieldset class="seg" style="--seg-count: 3">
    <legend class="visually-hidden">What would you like to see?</legend>
    <input type="radio" name="demo-app" id="demo-ws" value="ws"><label for="demo-ws">Group WorkStreams</label>
    <input type="radio" name="demo-app" id="demo-as" value="as"><label for="demo-as">Agile Sprints</label>
    <input type="radio" name="demo-app" id="demo-both" value="both" checked><label for="demo-both">Both</label>
    <span class="tab-indicator" aria-hidden="true"></span>
  </fieldset>
  <p class="note-label" id="demo-note-label">Your note to Swiftpro</p>
  <p class="note-text well" data-note-text aria-labelledby="demo-note-label"></p>
  <div class="note-actions">
    <button class="btn btn-quiet" type="button" data-note-copy>…copy icon… Copy the note</button>
    <a class="btn btn-accent" href="https://www.zedxapps.com/index.html#formContact">Request a demo …</a>
  </div>
  <p class="note-status" role="status" data-note-status></p>
</div>
```

- `data-default`: `both` on the home page, `ws` on `workstreams.html`, `as` on
  `agile-sprints.html`.
- `hidden` until the script is ready. Without JavaScript the right column
  shows only "Request a demo", as today.
- Under 480px the three options stack in one column and the selected one
  carries the accent itself (no sliding indicator).
- **Copy:** `navigator.clipboard.writeText` in the click handler. On success
  the label reads "Copied" with a check icon for two seconds and the status
  says "Note copied. Paste it into Swiftpro's form." If the clipboard is
  refused, select the note text and say "Select the note and copy it." No
  `alert`, no storage, nothing sent anywhere.
- New icons: `copy`, `check`.

Copy (final unless the editing pass improves it; keep every fact):

- Heading: "Ask Swiftpro for a demo" (the app pages keep their own headings).
- Sentence: "Swiftpro, the company that makes ZedX, runs every demo. We make
  the introduction."
- Steps: "1. Choose what you want to see." "2. Copy the note and send it
  through Swiftpro's contact form." "3. Swiftpro gets back to you. Their form
  does not book a time."
- Notes (the bracketed parts stay for the visitor to fill in):
  - Group WorkStreams: "Hello. I would like a demo of Group WorkStreams. About
    [number] people would use it, for [the work you want to run]. I came to you
    through the ZedX referral partner site at hamzaanjum96.github.io/ZedX."
  - Agile Sprints: the same, with "Agile Sprints".
  - Both: the same, with "Group WorkStreams and Agile Sprints".
- Under the buttons, caption style: "The form opens on zedxapps.com. Paste the
  note into its message box."
- Links: "Try the demo yourself", "Download the brochure (PDF, 4 pages)",
  "Already a customer? Log in to ZedX" (unchanged, same targets).

Also add to `docs/privacy.html`, under "What this site collects": "The demo
note on each page is put together in your browser. What you choose is not sent
anywhere and is not stored." Update that page's "Last updated" date.

### WP8. App pages

- **Hero switch.** Above the H1, the switch as a `nav` (label "Apps") with two
  links, "Group WorkStreams" and "Agile Sprints", the current page selected.
  Give it a `view-transition-name` so the indicator glides when the visitor
  moves between the two pages (see WP10). It replaces the "Compare with…" link
  in the hero actions; keep "Request a demo".
- **Hero frame.** The large board becomes a labelled frame.
- **At a glance.** Under the hero, one `.card` with a four item `dl` in four
  columns (rows on phones): "Suits", "Work arrives", "Planned", "Editions".
  The text is that app's cell from the home comparison table, word for word,
  so no new claim is made. "Editions" links to `./#licensing`.
- **The story.** Wrap the step sections in one `.story`. Markup order stays
  text, figure, text, figure, so phones and no JavaScript read as today. At
  1100px and up, with script: a two column grid, the texts in the left column
  with generous height between them, and every figure placed in the same
  right hand cell with `position: sticky`. An `IntersectionObserver` on the
  texts marks the current step; its figure is shown (opacity 1), the rest are
  `visibility: hidden` at opacity 0, crossfading in 300ms. A slim progress
  list (one dot per step) sits beside the stage. Sections without a figure
  (Agile Sprints "Run the sprint, then review it", which is a `dl.rows`) stay
  outside the story, full width, on a card.
- **Works alongside** rows go on a `.card`.
- FAQ per WP6, demo card per WP7.

### WP9. Text pages and the 404

- `legal.html` and `privacy.html`: give each `h2` an `id`; add the "On this
  page" list (a `nav`, links to those ids, the current section marked by an
  `IntersectionObserver`). Sticky at 1100px and up, a plain list above the
  prose below that. "Last updated" becomes a chip. Motif in the hero.
- `404.html`: motif, larger heading, the four links as rows on one card with
  arrows that move on hover.

### WP10. Finish layer and documents

1. **Header.** A scrolled state set by an `IntersectionObserver` on a sentinel
   (no scroll listener): the bar's shadow deepens and its background goes from
   78% to 90% white. On the home page, "Compare" and "Editions" in the bar
   light up while their section is on screen.
2. **Page changes.** `@view-transition { navigation: auto; }` inside
   `prefers-reduced-motion: no-preference`, with a `view-transition-name` on
   the header so the bar holds still while the page crossfades.
3. **Buttons and links.** Arrow icons move 4px in their direction on hover
   (the "opens elsewhere" arrow up and right). Buttons rise 1px, take the
   `lift` shadow and press to `scale(0.98)`. Quiet links thicken their
   underline. All 300ms on the base curve.
4. **Cards and screens.** Interactive cards go from `card` to `lift` and rise
   4px on hover or focus. Over a screenshot the cursor is `zoom-in`.
5. **Anchors and selection.** `scroll-margin-top` on every `[id]` target (the
   header height plus 24px), smooth scrolling under
   `prefers-reduced-motion: no-preference`, and a `::selection` colour from
   the accent at low opacity.
6. **Documents.** Update `BRAND.md` (the design language of section 2, the
   switch or table rule, Composition and Components), `replica/test-plan.md`
   and `DEVELOPER-NOTES.md`. Rebuild the brochure and social card
   (`npm run pdf`) only if a string they share with the site changed.

## 6. Tests

Keep green without weakening: the privacy promises, every "Request a demo" to
the form, "Try the demo yourself" at least twice in `main`,
`.closing a[href="brochure.pdf"]` with `download`, the viewer suite
(`e2e/viewer.spec.ts` opens `a[data-viewer="as-sprint"]` and
`a[data-viewer="gw-board"]`: keep those links present and visible by default
on the pages it uses), no sideways scroll, axe at zero.

Rewrite, because the markup they read changes:

- "the steps switch between the two apps as tabs": panels are now
  `#workstreams` and `#sprints` inside `#how`; each has three step cards with
  a figure. Without JavaScript both panels show.
- "licensing lists the six official editions without prices": read the table.
  Six row headers in order, three "Per user" cells, "No usage limits" in the
  Enterprise Plus row, "Not included" for Agile Sprints in the Home row, no
  currency symbols.
- "the comparison covers six buyer questions": 14 cells with the `tfoot` links.
- The FAQ tests: `.qa` is now a `details`; the count of `details` is 8 on the
  home page and 6 on each app page, the first is open, and a `summary` click
  opens another. The text checks stay.

Add:

- `/#sprints` opens the Agile Sprints panel; the switch stays reachable while
  the showcase is on screen.
- Demo card: three options with the page's default checked; choosing one
  changes the note; the note always ends with the referral line; copying
  reports success (grant `clipboard-write` in the test context); without
  JavaScript the card is hidden and the demo button still works.
- App pages: the hero switch is two links with the current one marked; the
  four "at a glance" items match the home table's cells for that app; at
  1440px scrolling to each step shows its figure and hides the others.
- Text pages: every "On this page" link lands on its heading.
- Home page height at 390px is under 9,000px.

## 7. Checks before every push

```bash
python3 tools/check_site.py docs
python3 tools/build_tokens.py --check
python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json
npm test                         # Playwright and axe at 1440, 768 and 390px
```

If the local Chromium does not match the pinned Playwright (1.56.1), do not
edit `playwright.config.ts`. Use a wrapper config outside the repository that
imports it and sets `launchOptions.executablePath` on `use` and on each
project, then run `npx playwright test -c <wrapper> --trace off`. CI runs the
same suite on Ubuntu 24.04.

Then look. Render the home page, both app pages, a text page and the 404 at
1440, 980, 768 and 390px after scrolling through (so reveals have fired).
Check each switch position, each hover and focus state, the copied state, an
open and a closed question, and the story at every step. No sideways scroll,
no clipped text, no orphaned last words in headings, one accent button per
screenful.

The owner has asked for work to be pushed to `main` as it goes; confirm that
still holds in your session before pushing there.

## 8. What stays, and what to avoid

**Stays:** the palette and existing tokens, Geist, the headline and hero copy,
the tagline section, the footer, the work in progress notice, the screenshot
viewer, the brochure and social card.

**Avoid:** carousels and anything that moves on its own. Counters, statistics,
logos, testimonials, ratings and badges (there are no public facts to put in
them). Drawn interface mock ups and device frames. Glass or glow beyond the
header's blur. A second accent. Sticky call to action bars and pop ups. A
third switch on any page.
