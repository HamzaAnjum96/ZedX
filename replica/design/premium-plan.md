# Premium pass: design plan

A brief for the model that implements it. Written 15 November 2026, after the
light "Daylight" redesign went live. Nothing in this plan is built yet, except
the navigation fix in section 0.

## What the owner asked for

In their words: make the site "look more premium", "elevate the site to the
next level", and:

- "I really like the Group WorkStreams / Agile Sprints radio and think it could
  be used more. Don't overuse it. Table make sense too."
- "Ask Swiftpro for a demo card could be better. Please improve."
- "Don't change the theme or colours."

So this pass adds no colour, no new typeface and no dark surfaces. It raises
the level through three things the site already owns, used with more intent,
plus a layer of finish:

1. **The app switch** (the pill with Group WorkStreams and Agile Sprints), in
   three places, each where a visitor really chooses between the apps.
2. **Tables** for anything that is a comparison or a reference.
3. **One motif**, the board column lines, as the site's quiet signature.
4. **Finish**: how things respond to the pointer, the keyboard and the scroll.

Done means: the six work packages below are live on `main`, every check in
section 6 passes, and the pages have been looked at (not only tested) at 1440,
980, 768 and 390px.

## 0. Already done: navigation in "desktop site" mode

Chrome on Android lays a page out about 980px wide when "Desktop site" is on.
The menu button used to stay until 1100px, so the owner saw the phone menu in
desktop mode. The full navigation now shows from **960px** (commit `8018a54`):
`site.css` header rules, `matchMedia('(min-width: 960px)')` in `site.js`,
`isNarrow` in `e2e/fixtures.ts`, and tests at 980 and 1024px. Between 960 and
1099px the bar is tightened and the login link reads "Log in".

The page *layout* still changes at 1100px (the two column hero and so on).
That is deliberate: at 980px a single column hero reads well. Keep any new
layout working at 980px, because the owner checks the site that way.

## 1. Ground rules

Read `BRAND.md` first, then `.claude/skills/landing-page-design/SKILL.md`
(Part B is the visual system). Where they disagree, `BRAND.md` wins.

Hard rules, most of them enforced by tests or `tools/check_site.py`:

- **Tokens only.** Colours, type styles, spacing, radii, shadows and motion
  come from `replica/design/tokens.json` through `tokens.css`. If a new token is
  truly needed, add it to the JSON, run `python3 tools/build_tokens.py`, and add
  any new text pair to `pairs` so the contrast gate covers it. No new colours.
- **Spacing** from the scale (0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96).
  **Text** only through the named styles. **Motion** only on `transform` and
  `opacity`, on the base curve, with a `prefers-reduced-motion` fallback.
- **No background gradients, no italics, no eyebrow labels or kickers, no
  monospace, no hyphens in copy, no orphaned last words.**
- **No card with a border on one side only.** Nested radius = outer radius
  minus the gap, when the gap is under 32px.
- **Static site.** No build step, no framework, no new dependency, no request
  to another host, no cookies, no web storage, and no `<form>` element (the
  privacy policy promises all of this and `e2e/content.spec.ts` holds every
  page to it).
- **Works without JavaScript.** Everything enhanced starts as readable HTML.
  Hidden-until-ready controls use the `hidden` attribute, as the tabs do now.
- **Only real screens.** No drawn or mocked product UI, no inline SVG in
  `main` except `.icon` sprites, no canvas. Every screenshot sits in a `figure`
  with a caption that names its app, real `alt` text and width and height.
- **Claims come from `replica/claims.md`**, with their conditions ("currently",
  per edition). Nothing invented: no prices, customers, numbers or quotes.
- **Referral rules.** The only link to zedxapps.com is the demo request,
  `https://www.zedxapps.com/index.html#formContact`. No source lists or
  "checked on" dates outside the legal notice. Project Portfolios stays off.
- **Voice.** A ZedX referral partner runs the site and says so lightly. Never
  "our software". Write copy with the `copywriting` skill and check it with
  `copy-editing`; their context is `.claude/product-marketing.md`.
- **Accessibility.** axe (WCAG 2.2 A and AA) must stay at zero violations at
  all three test sizes. Every interactive element has hover, active and
  visible focus states, and a 44px target.

Icons: Phosphor, regular weight. To add one, map it in `tools/build_sprite.py`
and rebuild the sprite (the command is in that file's header).

## 2. The app switch: three uses, no more

Today the switch is the tab list in "How the work moves" (`[data-tabs]` in
`site.js`, `.tab-list`, `.tab`, `.tab-indicator` in `site.css`). It earns its
place where the visitor picks an app and the content answers. Use it here:

| where | what it switches | pattern |
| --- | --- | --- |
| Home hero | which app's board is on the stage | tabs |
| Home, "How the work moves" | the three steps (exists) | tabs |
| The demo card, every page | which app the demo note asks about | radio group |

Do **not** add it to the comparison table, the editions table, the FAQ, the
header, the app page step sections or the footer. Those show both apps at once
on purpose, or concern one app only.

### WP1. One shared control

Make the pill a reusable component before using it again.

- **CSS.** Rename nothing that tests rely on, but let the indicator handle any
  number of options: set `--seg-count` on the list and `--seg-index` from
  script, then `width: calc((100% - 2 * var(--space-50)) / var(--seg-count))`
  and `transform: translateX(calc(var(--seg-index) * 100%))`. Replace the
  `[data-active='1']` rule. Add a size for the hero (same height, wider) only
  if the screenshots prove it is needed.
- **Two semantics, one look.**
  - *Tabs* when the choice shows a panel (hero, steps): the current
    `tablist` / `tab` / `tabpanel` script, unchanged in behaviour.
  - *Radio group* when the choice sets a value (demo card): a `fieldset` with a
    visually hidden `legend` and native `<input type="radio">` plus `label`
    pairs, styled as the same pill. Native radios give arrow keys and
    announcements for free. They need no `<form>`.
- **States.** Hover (text to `text-strong`), active (`scale(0.98)`), focus ring
  on the pill option, selected (white on accent). The indicator slides on the
  base curve in 500ms; with reduced motion it jumps.
- **Phones.** Two options always fit. Three options (demo card) stack into one
  column under 480px, and there the selected option carries the accent
  background itself (no sliding indicator).

## 3. Work packages

Build in this order. One package per commit; run section 6 before each push.

### WP2. Hero: one stage, two apps (home)

**Now:** two board strips, layered on wide screens and stacked on phones
(`.hero-shots` in `docs/index.html`). It shows both apps but neither at a size
that impresses, and on phones the hero is two screens long.

**Change:** one large stage with the app switch above it.

- Markup, inside `.hero`, replacing the two figures in `.hero-shots`:

  ```html
  <div class="stage" data-tabs data-reveal>
    <div class="stage-bar">
      <div class="tab-list" data-tab-list data-label="Choose an app to see its board" hidden>
        <button class="tab" type="button" data-tab="stage-ws">…icon… Group WorkStreams</button>
        <button class="tab" type="button" data-tab="stage-as">…icon… Agile Sprints</button>
        <span class="tab-indicator" aria-hidden="true"></span>
      </div>
    </div>
    <div class="stage-panels">
      <div class="tab-panel" id="stage-ws"><figure class="shot">…</figure></div>
      <div class="tab-panel" id="stage-as"><figure class="shot">…</figure></div>
    </div>
  </div>
  ```

  Keep the `figure` inside the panel `div`, so the figure keeps its own role.
- **Screens.** Use the full width crops, both 1362 by 508: `gw-board-wide-*`
  (the Complaints & Compliments Log, five stages) and `as-sprint-wide-*`. Copy
  the `picture`, `srcset`, `sizes`, `alt` and caption from the hero figures of
  `workstreams.html` and `agile-sprints.html`, including their `-sm` phone
  crops, then adjust `sizes` for this layout. Load both eagerly.
- **No layout shift.** Put both panels in the same grid cell
  (`.stage-panels { display: grid }`, panels at `grid-area: 1 / 1`). When the
  tabs are ready, override the hidden panel to
  `display: block; visibility: hidden; opacity: 0` so the stage keeps the
  taller panel's height. The active panel fades in over 300ms and rises 8px.
- **Frame.** `radius-2xl`, `shadow-frame`, 1px `line`. The switch sits left of
  the stage's top edge at 1100px and up, centred below that.
- **No autoplay.** The stage changes only when the visitor asks.
- **Without JavaScript:** both figures show, one after the other, as now.
- Keep the proof row, the referral note and the "Screens from the ZedX demo…
  Try the demo yourself" line. The first screen at 390px must still show the
  headline, the lead and "Request a demo".

**Tests to change:** "phones get a readable detail crop" expects `-strip-` on
wide screens; make it `-wide-`. **Add:** the stage is a tab list with two tabs,
switching shows the other figure and hides the first, the stage height does not
change on switch, and without JavaScript both figures are visible.

### WP3. The demo card (every page that has `.closing`)

**Now:** a tinted panel with a heading, a paragraph and four stacked links. It
asks the visitor to "tell Swiftpro which app you're interested in" but gives no
help doing it, and nothing tells Swiftpro the visitor came from this site,
because the demo link is a plain link to their form.

**Change:** make the card do that work. The visitor picks what they want to
see, the card writes a short note, they copy it and paste it into Swiftpro's
form. The note ends with one line naming this site, which is what lets the
owner's introductions be recognised.

Layout at 900px and up, two columns inside the panel (`radius-3xl`, `raised`,
1px `line`, the column motif from WP7 behind the left column):

- **Left:** the `h2`, one sentence, then "what happens next" as three short
  numbered steps (reuse `.step-num` at a small size).
- **Right:** a white inner card (`bg`, 1px `line`, `radius-2xl`, `shadow-bar`,
  24px padding) holding the switch, the note, and the two buttons.
- **Below both, full width:** the three quiet links in one row (demo, brochure,
  customer login), separated from the columns by space, not by a rule.

On phones everything stacks in that order: heading, steps, inner card, links.

Markup sketch for the inner card:

```html
<div class="note-card" data-demo-note data-default="both" hidden>
  <fieldset class="seg" style="--seg-count: 3">
    <legend class="visually-hidden">What would you like to see?</legend>
    <input type="radio" name="demo-app" id="demo-ws" value="ws"><label for="demo-ws">Group WorkStreams</label>
    <input type="radio" name="demo-app" id="demo-as" value="as"><label for="demo-as">Agile Sprints</label>
    <input type="radio" name="demo-app" id="demo-both" value="both" checked><label for="demo-both">Both</label>
    <span class="tab-indicator" aria-hidden="true"></span>
  </fieldset>
  <p class="note-label" id="demo-note-label">Your note to Swiftpro</p>
  <p class="note-text" data-note-text aria-labelledby="demo-note-label"></p>
  <div class="note-actions">
    <button class="btn btn-quiet" type="button" data-note-copy>…copy icon… Copy the note</button>
    <a class="btn btn-accent" href="https://www.zedxapps.com/index.html#formContact">Request a demo …</a>
  </div>
  <p class="note-status" role="status" data-note-status></p>
</div>
```

- `data-default` is `both` on the home page, `ws` on `workstreams.html` and
  `as` on `agile-sprints.html`.
- The card is `hidden` until the script is ready. Without JavaScript the right
  column shows only the "Request a demo" button, as today.
- **Copy button:** `navigator.clipboard.writeText` inside the click handler. On
  success the label becomes "Copied" with a check icon for two seconds and the
  status says "Note copied. Paste it into Swiftpro's form." If the clipboard is
  refused, select the note text and say "Select the note and copy it." No
  `alert`, no storage, nothing sent anywhere.
- `.btn-quiet` is new: white background, 1px `control` border, `text-strong`
  text, the same size and states as `.btn-accent`.
- Add a `copy` and a `check` icon to the sprite.

Copy (final unless the `copy-editing` pass improves it; keep every fact):

- Heading: **Ask Swiftpro for a demo** (unchanged).
- Sentence: "Swiftpro, the company that makes ZedX, runs every demo. We make
  the introduction."
- Steps: "1. Choose what you want to see." "2. Copy the note and send it
  through Swiftpro's contact form." "3. Swiftpro gets back to you. Their form
  does not book a time."
- Notes (the bracketed parts stay in the text for the visitor to fill in):
  - Group WorkStreams: "Hello. I would like a demo of Group WorkStreams. About
    [number] people would use it, for [the work you want to run]. I came to you
    through the ZedX referral partner site at hamzaanjum96.github.io/ZedX."
  - Agile Sprints: the same, with "Agile Sprints".
  - Both: the same, with "Group WorkStreams and Agile Sprints".
- Under the buttons, caption style: "The form opens on zedxapps.com. Paste the
  note into its message box."
- Links row: "Try the demo yourself", "Download the brochure (PDF, 4 pages)",
  "Already a customer? Log in to ZedX" (all unchanged, same targets).
- Keep the existing line about the open demo and the free trial as the last,
  muted sentence of the left column.

Also update `docs/privacy.html`, under "What this site collects": "The demo
note on each page is put together in your browser. What you choose is not sent
anywhere and is not stored." Change that page's "Last updated" date.

**Tests to keep green:** every "Request a demo" goes to the form; "Try the demo
yourself" appears at least twice in `main`; `.closing a[href="brochure.pdf"]`
has `download`; no `form`, cookies, storage or outside requests. **Add:** the
radio group has three options with the page's default checked; choosing an
option changes the note; the note always ends with the referral line; the copy
button reports success (grant `clipboard-write` in the test context) and
without JavaScript the card is hidden while the demo button still works.

### WP4. Editions as a table (home, `#licensing`)

**Now:** six paragraphs in the first of three text columns. A buyer cannot see
at a glance which edition includes which app, which is the first thing they
ask. This is the weakest section on the page.

**Change:** a real table, full width, in the same family as the comparison
table. Editions are the **rows**, so the table reads as a ladder and stacks
into one card per edition on phones (the `data-label` pattern the comparison
table already uses).

| Edition | Group WorkStreams | Agile Sprints | Users | Licensing | Hosting |
| --- | --- | --- | --- | --- | --- |
| **Home**. For individuals, who can invite friends and family. | Included | Not included | | Per user | Hosted by ZedX |
| **Professional**. For professionals and small or medium businesses. | Included | Included | Ideally 1 to 50 | Per user | Hosted by ZedX |
| **Group**. For independent teams and groups. | Included | Included | Ideally 1 to 50 | Per user | Hosted by ZedX |
| **Corporate**. For businesses that want the full range of apps. | Your choice | Your choice | | Users plus app usage | Hosted by ZedX |
| **Enterprise**. For government, education and larger organisations. | Your choice | Your choice | Unlimited | The apps you choose, with a usage allowance for each | Your own Azure subscription or other agreed infrastructure |
| **Enterprise Plus**. Every current and future ZedX app. | Included | Included | Unlimited | No usage limits | Your own Azure subscription or other agreed infrastructure |

- Sources: claims L5, L6, L14 and L16. Leave a cell empty where Swiftpro states
  nothing (Home and Corporate users). Do not add a Cloe AI column: the Editions
  page states it for Home, Professional and Group only.
- "Included" is a check icon in the accent colour plus the word; "Not included"
  a minus icon in `muted` plus the words; "Your choice" is text only. The word
  is always there for screen readers and for print (visible at 900px and up,
  visually hidden beside the icon below that if space is short).
- Notes under the table, caption style: "Which apps an edition includes is as
  Swiftpro currently lists it. Home, Professional and Group also include Cloe
  AI." and the existing sentence about prices.
- Keep `id="licensing"` on the table's wrapper (the FAQ and both app pages link
  to it). `#platform` stays on the Access panel.
- Below the table, the **Access** and **Hosting and integration** panels sit
  side by side as two columns instead of three. Drop the "Hosting" row from
  the second panel if the table now says the same thing; keep Integration,
  Apps on Demand and Technology.
- Add a `minus` icon to the sprite.

**Tests to rewrite:** "licensing lists the six official editions without
prices" reads `dt` and `dd`. Make it read the table: six row headers in order,
three "Per user" cells, "No usage limits" in the Enterprise Plus row, "Not
included" for Agile Sprints in the Home row, no currency symbols, no sideways
overflow, and stacked labels on phones.

### WP5. Comparison table, finished (home, `#compare`)

The owner likes this table. Keep its content and structure; raise its finish.

- Sit it on a white card: 1px `line` all round, `radius-2xl`, the header row on
  `raised`. Rows keep their rules; the last row has none.
- A small Phosphor icon before each row label (who it suits, how work arrives,
  how it is planned, board views, how progress is reviewed, editions).
- Row hover and `:focus-within`: the row takes the `raised` background (300ms).
- At 900px and up the header row is sticky under the floating bar
  (`top: calc(var(--layout-header) + var(--space-300))`) with an opaque
  background, so the app names stay in view while reading down.
- A `tfoot` row with one link under each app column: "See how Group
  WorkStreams works" and "See how Agile Sprints works".
- "Need both?" becomes a small card under the table: the two app labels joined
  by a link icon on the left, the existing sentence on the right.
- Numbers in both tables use `font-variant-numeric: tabular-nums`.

**Test to change:** the cell count in "the comparison covers six buyer
questions" goes from 12 to 14 with the `tfoot` links. Keep the stacked labels
working for the new row.

### WP6. App pages: the facts up front

Each app page opens with a hero and one large screen, then prose sections. Give
the visitor the reference answers before the prose.

- Under the hero screen, an **"at a glance" row**: a four column description
  list on a white card (`dl`, one card, 1px `line`, `radius-2xl`), stacking to
  rows on phones. Terms: "Suits", "Work arrives", "Planned", "Editions". The
  text comes word for word from that app's column of the home comparison
  table, so no new claim is made. The Editions item links to `./#licensing`.
- Replace `.closing` with the WP3 card, defaulting to that page's app.
- Everything in WP7 applies here too.

Do not add the app switch to these pages.

**Add tests:** each app page has the four terms and their text matches the home
table's cell for that app.

### WP7. The finish layer (all pages)

Small things, but together they are most of what "premium" means. None of them
may add markup noise or hurt the checks.

1. **The column motif.** Faint vertical lines, the edges of board columns. The
   brochure cover already uses it (`.cover::before` in `brochure.css`). Bring
   it to the site as one utility (`.has-columns::before`): a tiled inline SVG
   of a single 1px line in the `line-soft` colour, `aria-hidden` by nature,
   `pointer-events: none`, behind content. Size the tile to one twelfth of the
   container so the lines are the layout grid itself. Use it in exactly four
   places: the home hero (behind the stage), page heroes, the demo card and the
   404 page. A data URI cannot read a token, so this is one more documented raw
   colour; note it in `DEVELOPER-NOTES.md` beside the viewer backdrop.
2. **Header.** A scrolled state set by an `IntersectionObserver` on a sentinel
   (not a scroll listener): the bar's shadow deepens and its background goes
   from 78% to 90% white. On the home page, "Compare" and "Editions" in the bar
   light up (the same pill as the current page link) while their section is on
   screen.
3. **Page changes.** Cross document view transitions: `@view-transition {
   navigation: auto; }` inside `prefers-reduced-motion: no-preference`, with
   `view-transition-name` on the header so the bar holds still while the page
   crossfades. Browsers without it are unaffected.
4. **Buttons and links.** Arrow icons move 4px in their direction on hover
   (the "opens elsewhere" arrow moves up and right); buttons rise 1px and take
   `shadow-bar` on hover and press to `scale(0.98)`. Quiet links thicken their
   underline. All 300ms on the base curve.
5. **Screenshots.** On hover or focus the frame rises 4px, the cursor is
   `zoom-in`, and a small "View full screen" pill fades in at the frame's top
   right corner (decorative, `aria-hidden`; the caption link stays the real
   control).
6. **Steps.** When "How the work moves" reveals, the line between the numbers
   draws from left to right (`scaleX`) and the numbers fill in turn, 80ms apart.
7. **Anchors and selection.** `scroll-margin-top` on every `[id]` target equal
   to the header height plus 24px, smooth scrolling under
   `prefers-reduced-motion: no-preference`, and a `::selection` colour from the
   accent at low opacity with `text-strong` text.
8. **The 404 page.** The motif, a larger heading, and its four links as a
   bordered list with arrows that move on hover.

## 4. What stays as it is

The palette and tokens. Geist. The headline and the hero copy. The tagline
section. The FAQ as open answers. The footer (one sentence, three links). The
work in progress notice. The screenshot viewer. The brochure and social card
(rebuild them with `npm run pdf` only if a string they share with the site
changes).

## 5. Things to avoid

Carousels and anything that moves on its own. Counters, statistics, logos,
testimonials, ratings or badges (there are no public facts to put in them).
Drawn interface mock-ups or device frames. Glass or glow effects beyond the
header's existing blur. A second accent. Sticky call to action bars. Pop-ups.
More uses of the app switch than the three listed.

## 6. Checks before every push

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

Then look at the result. Render the home page and both app pages at 1440, 980,
768 and 390px after scrolling through (so reveals have fired) and check: no
sideways scroll, no clipped text, no orphaned last words in headings, the first
screen at 390px shows the headline and "Request a demo", and the stage, the
demo card and both tables look right in each state (each switch position,
hover, focus, copied).

When a package is green, update what describes it: `BRAND.md` (Composition and
Components), `replica/test-plan.md` (suites and the run count) and
`DEVELOPER-NOTES.md` ("Where to change things"). The owner has asked for work
to be pushed to `main` as it goes; confirm that still holds in your session
before pushing there.
