# Test plan: independent promotional site (redesign, October 2026)

- **Date:** 2026-10-08 (first written 2026-10-04).
- **Environment:** local `tools/serve.mjs`, which serves `docs/` under `/ZedX/` with GitHub Pages' 404 behaviour.
- **Browser:** Chromium 141, via Playwright 1.56.1 and @axe-core/playwright 4.11.

Run it with `npm install`, then `npm test`. There are three projects:

- **desktop:** 1440×900;
- **tablet:** 768×1024, touch;
- **mobile:** Pixel 7, 390×844.

Every test fails on any of these (`e2e/fixtures.ts`):

- console errors or warnings;
- uncaught exceptions;
- 5xx responses;
- failed requests to the local site.

Static checks run before the browser tests:

- `python3 tools/check_site.py docs`
- the token check
- the contrast gate

## Suites

| suite | what it proves |
| --- | --- |
| `e2e/pages.spec.ts` | Runs on the three main pages, the legal notice and the privacy policy. Each page has a title, a description, one H1 and `lang=en-GB`. There is no sideways scroll. axe (WCAG 2.0/2.1/2.2 A and AA) finds zero violations. Every local link, anchor, icon, image and `srcset` file resolves. Every visible screenshot is real (from `assets/img/screens/`), has alt text and keeps its proportions. The "Independent promotional site" note and the footer attribution are present. The work-in-progress notice is the first thing in the header, full width at the top. The footer links to the legal notice and the privacy policy. Without JavaScript, the navigation and the notice show, and "View full screen" opens the image file. |
| `e2e/navigation.spec.ts` | The main navigation reaches both app pages and back. Compare and Adoption work from app pages. Earlier anchors survive (`#platform`, `#licensing`, `#faq` and the rest). "Explore the apps" lands on the products. The tablet and phone menu opens, closes with Escape and returns focus. The skip link works. Every "Request a demo" opens the official contact form, every "Try the demo yourself" opens demo.zedx.net (at least twice per main page), the login goes to zedx.net, and no copy promises a calendar booking. The footer reaches the legal notice and the privacy policy, and each links to the other. `brochure.pdf` is a 4-page PDF. A deep missing URL returns 404 with working links, including the privacy policy. |
| `e2e/viewer.spec.ts` | "View full screen" opens a named modal: focus on Close, full screen loaded, caption cites the demo. Escape and Close both return focus to the trigger. Tabbing never reaches the page behind. Zoom switches between fitted and actual size (phones start at actual size). Clicking the screenshot opens the viewer. There is no sideways scroll behind the viewer. |
| `e2e/content.spec.ts` | The hero names both apps, gives one primary action and states our role. Phones get the explanation and action first, then a detail crop. The comparison has two app columns and five criteria, with app labels when stacked. The FAQ answers who runs the site, what a demo request does and how to try ZedX alone (with a link to the demo). Leadership reporting is periodic and never "real time". Licensing lists the five official editions, with no prices. No page or the brochure repeats a claim Swiftpro withdrew in October 2026 (guest logins, licence blocks, own-server hosting, Swiftpro Digital and the rest). Every figure is captioned with its app, and there is no drawn UI (no inline SVG beyond icons, no canvas). The legal notice says who runs the site, that it is unfinished and who owns the names. The privacy policy names what GitHub logs and where demo requests go. Every page keeps the privacy policy's promises: no requests to other sites, no cookies, no web storage and no forms. The 404 page opens with the work-in-progress notice, and printed pages keep it. |

Last run: **275 passed, 1 skipped**. The skip is the "no sideways scroll behind
the viewer" check, which runs on small screens only.

## Manual and visual checks

- **Full-page renders, reviewed slice by slice:**
  - index, both app pages and the 404 at 1440 and 390px;
  - the legal notice and privacy policy at 1440 and 390px;
  - index at 768px.
- **Fixes made after the first critique:**
  - Product sections were rebalanced: one screenshot beside each intro, facts in a row underneath.
  - The comparison table got fixed column widths.
  - Adoption moved into three columns.
  - The leadership heading was shortened.
  - Stacked comparison labels were given a smaller size and weight.
  - "More about" links were aligned to the bottom of the caption.
  - The extra gap above app-page hero buttons was removed.
- **PDF:** read page by page. All four pages fit, and the epics figure was dropped from page 3 to stop it overflowing. The cover was tightened to make room for the work-in-progress strip.
- **Live destinations:** the contact form (`#formContact`), zedx.net and demo.zedx.net were last checked on 8 October 2026.
- **Official sources:** `python3 tools/check_sources.py` found all 62 phrases behind `claims.md` on 8 October 2026. A negative run with a made-up phrase exits 1 and names it.
