# Test plan: Group WorkStreams + Agile Sprints brochure

Build: see `git log`  Date: 2026-10-04  Env: local, `tools/serve.mjs` (docs/ under /ZedX/ like GitHub Pages), Chromium 141 via Playwright 1.56.1

Run it: `npm install` then `npm test`. Two projects: **desktop** (1440x900)
and **mobile** (390x844, touch). Every test fails on console errors or
warnings, uncaught exceptions, 5xx responses and failed local requests
(`e2e/fixtures.ts`). Accessibility: axe-core with WCAG 2.0/2.1/2.2 A and AA
tags on every page.

The brochure has no backend, so the replica-test flows become the visitor's
flows:

| flow | goal |
| --- | --- |
| F-B1 | read the site and move around it |
| F-B2 | find out which app fits |
| F-B3 | try the Group WorkStreams board |
| F-B4 | run the sample sprint |
| F-B5 | read the charts |
| F-B6 | use it on a phone |
| F-B7 | reach ZedX (demo, login) |
| F-B8 | take the PDF brochure away |
| F-B9 | recover from a bad link |

## Cases

| case | type | expected | auto | result |
| --- | --- | --- | --- | --- |
| F-B1-H1 | happy | each page has a title, a description, one h1, lang en-GB | e2e, 3 pages x 2 | pass |
| F-B1-H2 | happy | main nav reaches both app pages, marks the current one, brand link returns home | e2e x 2 | pass |
| F-B1-E2 | edge: accessibility | zero axe violations | e2e, 3 pages x 2 | pass (after BUG-001) |
| F-B1-E3 | edge: broken links | every local link, in-page anchor, stylesheet, script and icon resolves | e2e, 3 pages x 2 | pass |
| F-B1-E4 | edge: no JavaScript | content renders; demos explain they need JavaScript; chooser shows its rule of thumb | e2e x 2 | pass (after BUG-004) |
| F-B2-H1 | happy | flow + continuous + no estimates -> Group WorkStreams | e2e x 2 | pass |
| F-B2-H2 | happy | planned + sprints + points -> Agile Sprints | e2e x 2 | pass |
| F-B2-H3 | happy | "a bit of both" -> both, flagged as partial | e2e x 2 | pass |
| F-B2-E1 | edge: conflicting answers | suggests both instead of guessing | e2e x 2 | pass |
| F-B2-E2 | edge | leaders across teams -> Project Portfolios note | e2e x 2 | pass |
| F-B2-E3 | edge: keyboard only | arrow keys change the answer and the verdict | e2e x 2 | pass |
| F-B3-H1 | happy | tabs switch by click and by arrow keys, focus stays on the tab | e2e x 2 | pass (after BUG-002) |
| F-B3-H2 | happy | card moves with its button, counts update, move announced | e2e x 2 | pass |
| F-B3-H3 | happy: keyboard | ArrowRight / ArrowLeft move the focused card, focus follows it | e2e x 2 | pass |
| F-B3-H4 | happy: mouse | card dragged into another column lands there | e2e desktop | pass (skipped on touch by design) |
| F-B3-E1 | edge: screen reader | guest owner is named as a guest | e2e x 2 | pass |
| F-B3-E2 | edge: switching tabs | moves persist per workstream | e2e x 2 | pass |
| F-B3-E3 | edge: reset | sample data restored and announced | e2e x 2 | pass (after BUG-003) |
| F-B3-E4 | edge: ends of board | first and last columns disable the impossible move | e2e x 2 | pass |
| F-B3-E5 | edge: cancel | Escape during a drag leaves the card where it was, no ghost left behind | e2e desktop | pass |
| F-B4-H1 | happy | opens on day 6, 31 of 34 planned, 10 of 31 done, 21 left | e2e x 2 | pass |
| F-B4-H2 | happy | finishing a story updates progress, burndown and stand-up | e2e x 2 | pass |
| F-B4-H3 | happy | blocking a story marks the card, keeps focus, appears in the stand-up | e2e x 2 | pass |
| F-B4-H4 | happy | ending days 6 to 10 gives a sprint summary with carried-over work; restart works | e2e x 2 | pass |
| F-B4-E1 | edge | a blocked story reaching Done is unblocked | e2e x 2 | pass |
| F-B4-E2 | edge | moving a story back is reported | e2e x 2 | pass |
| F-B4-E3 | edge: reset | reset returns to day 6 | e2e x 2 | pass |
| F-B4-E4 | edge: finished sprint | the board is locked until the sprint is run again | e2e x 2 | pass |
| F-B5-H1 | happy: keyboard | burndown readable day by day with arrow keys | e2e x 2 | pass |
| F-B5-H2 | happy | burndown and velocity have table views with every value | e2e x 2 | pass |
| F-B5-H3 | happy | velocity bars explain themselves on focus | e2e x 2 | pass |
| F-B6-H1 | happy | phone menu opens, Esc closes it and returns focus | e2e mobile | pass |
| F-B6-E1 | edge: phone width | no page scrolls sideways at 390px or 1440px | e2e, 3 pages x 2 | pass (after BUG-005) |
| F-B6-E2 | edge: keyboard | skip link is the first stop and jumps to the content | e2e desktop | pass |
| F-B7-H1 | happy | Book a demo -> zedxapps.com contact form; Log in -> zedx.net | e2e x 2 | pass |
| F-B8-H1 | happy | brochure.pdf is served as a PDF | e2e x 2 | pass |
| F-B8-E1 | edge | print layout has no axe violations, four sheets, its assets resolve | e2e desktop | pass |
| F-B9-H1 | happy | unknown address -> 404 status and page, links work | e2e x 2 | pass |

## Latest run

`npm test`: **87 passed, 5 skipped** (skips are by design: mouse drag, drag
cancel and the A4 layout are desktop-only; the phone menu is mobile-only;
the skip link is checked on desktop).

## Manual checks

| check | how | result |
| --- | --- | --- |
| Layout at 1440px and 390px, every section | screenshots reviewed by eye | done; layout bugs BUG-005 to BUG-010 fixed |
| Charts against the dataviz rules | emphasis form, 2px lines, 24px max bars with 4px data ends, 2px gaps, hairline grid, legend, selective labels, tooltip, table view | done |
| PDF | rendered pages reviewed at 80 dpi, `pdfinfo`: 4 pages, A4, tagged | done |
| Screen reader pass (NVDA, VoiceOver) | not run here | to do by a person, see `bugs.md` "To check" |

Bugs and fixes: `bugs.md`.
