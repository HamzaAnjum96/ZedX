# Developer notes

Static site in `docs/`, published to GitHub Pages under `/ZedX/` by
`.github/workflows/pages.yml`. There is no build step and no framework:
HTML, one stylesheet plus generated tokens, and one small script. Identity and
writing rules are in `BRAND.md`.

## Commands

| task | command |
| --- | --- |
| preview as GitHub Pages serves it | `node tools/serve.mjs` (http://localhost:4173/ZedX/) |
| static checks | `python3 tools/check_site.py docs` |
| regenerate token CSS / check it is current | `python3 tools/build_tokens.py` / `--check` |
| contrast gate | `python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json` |
| e2e + axe at 1440, 768 and 390px | `npm install` then `npm test` |
| PDF brochure, social card, touch icon | `npm run pdf` |
| recapture or re-crop screenshots | `npm run screens` (all), `npm run screens -- --only pp-insights`, `npm run screens -- --encode-only` |
| preview images of the site (`previews/`, not published) | `npm run previews` |

The `check_site.py` checks are:

- links, anchors, icons, `srcset` files and full-size viewer images;
- alt text and width/height on images;
- one H1 per page;
- banned copy (unlock, seamless, all-in-one, "our software", competitor names and so on).

CI runs `check_site.py`, the token check and the contrast gate, then the e2e suite, then deploys from the default branch.

## Official sources

Product claims come only from these pages (read on 4 October 2026). The earlier site's copy was treated as material to review, not as proof.

| source | URL | supports |
| --- | --- | --- |
| Applications overview | https://www.zedxapps.com/Applications/index.html | Group WorkStreams one-liner ("a series of workflows… each serves a dedicated and specific function… Kanban boards"); Agile Sprints "online automated stand-ups reporting" |
| Agile Sprints | https://www.zedxapps.com/AgileSprints/Index.html | the full Agile Sprints feature list. Also: periodic updates to Project Portfolios "without exposing task-level detail", and Group WorkStreams alongside for mixed delivery |
| Project Portfolios | https://www.zedxapps.com/ProjectPortfolios/Index.html | the leadership section: structured periodic updates (monthly or quarterly) and their contents, dashboards and trends, Gantt view, Excel export, reminders, benefits. Also: project workstreams can link to Group WorkStreams or Agile Sprints |
| Platform | https://www.zedxapps.com/Platform/index.html | the adoption section: sign-in, external users, permissions, in-site store, React/API/SQL Server, Swiftpro Digital integration as a service (with its hosting condition), the four licence options |
| Home (contact form) | https://www.zedxapps.com/index.html#formContact | demo destination. The form says "To book a demo or request further information, please send us a message", and confirms with "we will get back to you soon" |
| Customer login | https://zedx.net/ | login destination |

The detailed claim-by-claim register is `replica/claims.md`.

## Screenshots

All screens are real. They were captured read-only from the public ZedX demo
(https://demo.zedx.net/: its own "Continue" and pre-filled "Login" buttons,
then the app at `ztd01.zedx.net`), with sample "Regents Wood College Group"
data, at 1600×1000 CSS px and device scale 2.

The crops are defined in `tools/capture_screens.mjs`. Each one cuts a single
contiguous area. Every crop is written at 1x and 2x as
`docs/assets/img/screens/<screen>-<crop>-<width>.webp`, and the manifest is
`tools/screens.json`, which is kept out of the published folder.

Each screen was identified from the visible interface (app logo, breadcrumb,
title, columns), not from file names.

| screen | app (verified on screen) | view | visible functions we describe | crops | used in |
| --- | --- | --- | --- | --- | --- |
| `gw-board` | Group WorkStreams | Complaints & Compliments Log, Current Stages | stages Outstanding, In Progress, Escalated, Response Issued, Closed - Ready for Archive; New Stage / Edit Stage; references, priorities (Low to Critical), assignees | `full`, `wide`, `sm` | workstreams.html hero |
| `gw-board-catering` | Group WorkStreams | Catering & Vending Machine Issues, Current Stages | three stages: New Issue, In Progress, Completed | `full`, `strip`, `board`, `sm` | index hero; workstreams.html "Stages"; social card; PDF cover |
| `gw-workstreams` | Group WorkStreams | Workstreams list | name, portfolio (function), active epics, active tasks, type, owners | `full`, `list`, `sm` | index Group WorkStreams; workstreams.html "A workstream for each function"; PDF p2 |
| `gw-insights` | Group WorkStreams | Insights: Group Workstreams Dashboard | work items per workstream, critical and non-critical | `full`, `chart` | workstreams.html "See where the work is piling up" |
| `as-sprint` | Agile Sprints | Current Sprint (3 - Attendance Capture) | stages On Hold, Not Started, In Progress, Completed Unverified, Completed Verified; epic IDs, priority, story points | `full`, `strip`, `wide`, `sm` | index hero; agile-sprints.html hero; social card; PDF cover |
| `as-backlog` | Agile Sprints | Backlogs | stages Ideas & Intake, Refinement Needed, Ready for Sprint; epics E001–E006; story points | `full`, `board`, `refine`, `sm` | index Agile Sprints; agile-sprints.html "Plan from a prioritised backlog"; PDF p3 |
| `as-epics` | Agile Sprints | Epics, Gantt view | six epics on a week-by-week timeline, January to March 2026 | `full`, `timeline`, `start` | index Agile Sprints (hidden on phones); agile-sprints.html "See epics over time" |
| `pp-insights` | Project Portfolios | Insights: Project Portfolios Dashboard A | RAG ratings by indicator across the college group's projects | `full`, `chart` | index leadership section only (supporting role) |

Group WorkStreams' own "Portfolios" view (which groups workstreams by
function) was captured earlier, then dropped. It could be mistaken for the
Project Portfolios app.

## Unresolved claims and assets (for Swiftpro or the site owner)

### Omitted from the site

The items below are not on the current official pages, or only appear in the
2024 G-Cloud 14 listing, so they stay off the site until confirmed:

- **Data residency:** UK data storage and processing.
- **Devices:** full use in a mobile browser.
- **Integrations and formats:**
  - Power BI integration.
  - CSV import and Excel/PDF export as platform-wide features. Excel export is stated only for Project Portfolios, and is described there as such.
- **Security:** two-factor authentication and Cyber Essentials.
- **Commercial terms:** free trial, support hours and response times.
- **Prices:** the only public figures are G-Cloud 14 prices from May 2024.

### Reporting claims

- **"Automated reporting":** only Agile Sprints' "online automated stand-ups reporting" and Project Portfolios' "automatic reminders" are stated. Nothing on the site says leadership reporting is automatic or real-time.
- **"Real time":** used only for Agile Sprints sprint progress, as its page states.

### Demo and assets

- **Self-service demo:** demo.zedx.net is public, but it is not linked from the site, because we don't know whether Swiftpro wants that. Confirm it before adding a "Try the demo" link.
- **Logos:**
  - No official logo files are in the repository, and none are used outside the screenshots.
  - The product logos inside screenshots are untouched.
  - If Swiftpro supplies logos and permission, use them unchanged.
- **Partner identity:** the site's owner has no verified name or logo yet. The header uses a text wordmark plus "Independent promotional site". Add the partner's real name to the footer attribution when it is confirmed.
- **Screenshot gaps:**
  - The demo's Agile Sprints Insights page has no data, so velocity, completion and carried-over metrics have no screenshot and are described in text only.
  - Releases have no screenshot either.
- **Unexplained interface details** (shown, never described):
  - the "Days" and "Difficulty Points" fields on Group WorkStreams cards;
  - the red counts in the workstreams list's Active Tasks column;
  - the "Ask Cloe" menu item.

## Where to change things

| to change | edit | then |
| --- | --- | --- |
| copy on a page | the page in `docs/` (header, footer and viewer markup are repeated in each page); write with the `copywriting` skill and edit with `copy-editing` (`.claude/skills/`) | `python3 tools/check_site.py docs`, `npm test` |
| colours, type, spacing | `replica/design/tokens.json` | `python3 tools/build_tokens.py`, contrast gate |
| layout or components | `docs/assets/css/site.css` (colours, fonts, spacing, radii and shadows come from tokens; the only raw colour is the viewer backdrop) | `npm test` |
| a screenshot crop | `SHOTS` in `tools/capture_screens.mjs` | `npm run screens -- --encode-only`, update `width`/`height` in the HTML |
| the PDF or social card | `docs/brochure.html`, `docs/assets/css/brochure.css`, `tools/og-template.html` | `npm run pdf` |
| demo destination | every `https://www.zedxapps.com/index.html#formContact` link | `npm test` (navigation suite checks every demo link) |
