# Bugs

Found by the e2e suite (`e2e/`, `npm test`) and by screenshot review at
1440px and 390px. Format from `.claude/skills/replica-test/bug-report.md`.
Only reproduced bugs are listed.

### BUG-001: "Shipped" release bar text fails contrast

- Severity: S3
- Flow / case: F-B1 / F-B1-E2 (axe scan)
- Screen: agile-sprints.html, Release section
- Build: 14a06ee  Browser / device: Chromium 141, 1440px and 390px

Steps
1. Open agile-sprints.html.
2. Run the axe scan (WCAG 2.2 AA).

Expected: no violations.
Actual: `color-contrast (serious): .shipped`. White 12px text on #0086b3 is 4.3:1, under the 4.5:1 AA floor.
Evidence: failing test `F-B1-E2 has no axe violations` (agile-sprints.html).
Suspected cause: the bar reused the chart accent, which is tuned for marks (3:1), not for text.
Status: fixed (bar uses `--c-as-ink`, 5.7:1).

### BUG-002: Clicking a workstream tab loses keyboard focus

- Severity: S3
- Flow / case: F-B3 / F-B3-H1
- Screen: workstreams.html, demo
- Build: 14a06ee  Browser / device: Chromium 141, desktop and mobile

Steps
1. Click the "IT requests" tab.
2. Press ArrowRight.

Expected: "Estates and facilities" is selected and focused.
Actual: nothing happens; focus fell back to the page.
Evidence: failing test `F-B3-H1 switches workstreams by mouse and by keyboard`.
Suspected cause: every selection re-created the tab buttons, destroying the focused one.
Status: fixed (tabs are built once and updated in place).

### BUG-003: "Reset the sample" does not reset the current workstream

- Severity: S2
- Flow / case: F-B3 / F-B3-E3
- Screen: workstreams.html, demo
- Build: 14a06ee  Browser / device: Chromium 141, desktop and mobile

Steps
1. Move "Building pass and desk" on to In progress.
2. Click "Reset the sample".

Expected: the card is back in Requested.
Actual: the card stays in In progress.
Evidence: failing test `F-B3-E3 reset restores the sample data`.
Suspected cause: reset called the same select() that first saves the visible board back into the (fresh) data.
Status: fixed (reset loads the fresh data without saving the old board).

### BUG-004: No-JavaScript fallback text did not render in script-disabled mode

- Severity: S4
- Flow / case: F-B1 / F-B1-E4
- Screen: workstreams.html, agile-sprints.html
- Build: 14a06ee  Browser / device: Chromium 141 with script execution disabled

Steps
1. Open workstreams.html with JavaScript disabled.

Expected: a sentence explaining that the illustration needs JavaScript.
Actual: nothing; `<noscript>` content is not rendered when scripting is disabled by the browser automation, only by the user's setting.
Evidence: failing test `F-B1-E4 content and fallbacks still render`.
Status: fixed (the fallback is a normal paragraph hidden by a `.js` class that a one-line head script sets, so it shows whenever scripts do not run).

## Layout bugs found in screenshot review (fixed before the suite existed)

| ID | severity | what | fix |
| --- | --- | --- | --- |
| BUG-005 | S3 | Pages 1008px wide on phones: `.visually-hidden` labels escaped the board's scroll box | scroll boxes are `position: relative` |
| BUG-006 | S3 | Illustrations squeezed: default `<figure>` margins | `figure { margin: 0 }` |
| BUG-007 | S3 | Sprint demo: Done column cut off and card footers wrapping at 1440px | progress panel moved under the board |
| BUG-008 | S4 | Hero screens overlapped into a jumble below 600px | screens stack on phones |
| BUG-009 | S4 | Second "periodic summaries" arrow pointed at the wrong app | flow diagram rebuilt on a three-column grid |
| BUG-010 | S4 | Burndown axis title collided with tick labels | bottom margin and label positions |

## To check (not reproduced)

- Drag and drop with a pen on a real tablet. Mouse drag is covered by
  `F-B3-H4`; touch deliberately scrolls instead (buttons move cards).
- Screen reader pass with NVDA and VoiceOver on the two demos. The suite
  checks roles, names, live-region text and focus, not the spoken output.
