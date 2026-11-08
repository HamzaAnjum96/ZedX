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
| check the official pages still back every claim | `python3 tools/check_sources.py` (`--verbose` lists each phrase) |
| recapture or re-crop screenshots | `npm run screens` (all), `npm run screens -- --only pp-insights`, `npm run screens -- --encode-only` |
| preview images of the site (`previews/`, not published) | `npm run previews` |

If the Chromium on your machine doesn't match the pinned Playwright version,
point a local wrapper config at it with `use.launchOptions.executablePath`
(and for the `tools/*.mjs` scripts, pass `executablePath` to
`chromium.launch`) rather than editing `playwright.config.ts`. CI installs its
own browser.

The `check_site.py` checks are:

- links, anchors, icons, `srcset` files and full-size viewer images;
- alt text and width/height on images;
- one H1 per page;
- banned copy (unlock, seamless, all-in-one, "our software", competitor names and so on).

CI runs `check_site.py`, the token check and the contrast gate, then the e2e suite, then deploys from the default branch.

A second workflow, `.github/workflows/sources.yml`, runs `check_sources.py`
every Monday (and on demand from the Actions tab). It fetches the official
ZedX pages and fails when a phrase that a claim in `replica/claims.md` relies
on has gone, so a change on zedxapps.com shows up as a failed run. It is kept
out of the push checks so that an outage on zedxapps.com never blocks a deploy.

## Official sources

Product claims come only from these pages. They were first read on 4 October
2026, then re-read on 8 October and 8 November 2026 after each of Swiftpro's
updates to zedxapps.com. The November update added the Editions and Demo/Trial
pages, modules tables and FAQs on each app page, an FAQ on the Platform page and
a rewritten Applications page. All of the site's text was rewritten from them.
The earlier site's copy was treated as material to review, not as proof.

| source | URL | supports |
| --- | --- | --- |
| Applications overview (rewritten in November 2026) | https://www.zedxapps.com/Applications/index.html | Group WorkStreams' "flexible Kanban boards"; Agile Sprints' "automated stand-up reporting"; each app works on its own or with others, on shared organisational structures, user management and permissions; Apps on Demand |
| Group WorkStreams | https://www.zedxapps.com/GroupWorkStreams/Index.html | who it suits and "without the overhead of formal project management or Agile ceremonies"; lists, Kanban boards or timeline views; adaptable stages, fields and priorities; dashboards of workload, progress and bottlenecks; linking to Agile Sprints without duplicating data; audit and governance work; ZedX Study Planner. Modules table (November 2026): portfolios, workstream users, epics, work items with difficulty points, the Backlog, Current Stages, Epic and Archived views, Insights, Ask Cloe. FAQ: replacing spreadsheets, managers seeing workload without asking for updates, blocked work, Cloe AI |
| Agile Sprints | https://www.zedxapps.com/AgileSprints/Index.html | the Agile Sprints feature list; periodic updates to Project Portfolios "without exposing task-level detail"; Group WorkStreams alongside for mixed delivery. Modules table (November 2026): projects holding several Agile boards, epics with owners, priorities, delivery dates and Gantt charts, timeboxed sprints with velocity targets that are formally closed, six board views, view-only access, Insights, Ask Cloe. FAQ: software, technology projects and other Agile work; several teams; velocity; Cloe AI |
| Project Portfolios | https://www.zedxapps.com/ProjectPortfolios/Index.html | the leadership section: structured periodic updates (monthly or quarterly) and their contents, dashboards and trends, Gantt view, Excel export, reminders, benefits; project workstreams linked to Group WorkStreams or Agile Sprints. November 2026: PMOs, programme managers and senior leadership; financials at project, programme and portfolio level; reminders that cut the chasing |
| Platform | https://www.zedxapps.com/Platform/index.html | Entra ID single sign-on, role-based and granular permissions that follow the organisation's hierarchy, one login and interface, start with one app, Enterprise integration, Apps on Demand, demo and trial. FAQ (November 2026): React, C# and .NET, SQL Server, Azure and APIs; Cloe AI "using OpenAI technology"; other editions hosted by ZedX; integrations assessed and agreed |
| Editions (new in November 2026) | https://www.zedxapps.com/Editions/index.html | the six editions (Home, Professional, Group, Corporate, Enterprise, Enterprise Plus), which apps each includes, how each is licensed, 1 to 50 users for Professional and Group, which editions ZedX hosts and which can run in the customer's own Azure or other agreed infrastructure |
| Demo/Trial (new in November 2026) | https://www.zedxapps.com/Try/index.html | the demo account is created automatically; the free trial uses a registration wizard, lets you choose apps, needs no credit card and is "Available from Nov 2026". No sign-up link yet |
| Home | https://www.zedxapps.com/index.html | Swiftpro's name and address, pricing in several currencies, the self-guided demo and the free trial. Its editions box still lists five editions; the site follows the Editions page. The contact form (`#formContact`) is the demo destination: "To book a demo or request further information, please send us a message", confirmed with "we will get back to you soon" |
| Customer login | https://zedx.net/ | login destination. Its "Try Demo Account" card ("No registration required") opens the demo. Since November 2026 it also offers a Training Account, which no official page describes |
| ZedX demo | https://demo.zedx.net/ | the "Try the demo yourself" links, and every screenshot |

The detailed claim-by-claim register is `replica/claims.md`. Its "Withdrawn or
replaced" section lists what the 2026 updates removed or changed: ZedX's own
sign-in, guest logins, app modules, the in-app store, licence blocks and
own-server hosting and the Swiftpro Digital integration service in October; the
blanket "five editions" and "SaaS editions are licensed per user" in November.

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
| `gw-board` | Group WorkStreams | Complaints & Compliments Log, Current Stages | stages Outstanding, In Progress, Escalated, Response Issued, Closed - Ready for Archive; New Stage / Edit Stage; references, priorities (Low to Critical), difficulty points, assignees; the Backlog, Current Stages, Epic and Archived views in the side menu | `full`, `wide`, `sm` | workstreams.html hero |
| `gw-board-catering` | Group WorkStreams | Catering & Vending Machine Issues, Current Stages | three stages: New Issue, In Progress, Completed | `full`, `strip`, `board`, `sm` | index hero; workstreams.html "Stages"; social card; PDF cover |
| `gw-workstreams` | Group WorkStreams | Workstreams list | name, portfolio (function), active epics, active tasks, type, owners; Ask Cloe in the side menu | `full`, `list`, `sm` | index Group WorkStreams; workstreams.html "A workstream for each function"; PDF p2 |
| `gw-insights` | Group WorkStreams | Insights: Group Workstreams Dashboard | work items per workstream, critical and non-critical | `full`, `chart` | workstreams.html "See where the work is piling up" |
| `as-sprint` | Agile Sprints | Current Sprint (3 - Attendance Capture) | stages On Hold, Not Started, In Progress, Completed Unverified, Completed Verified; epic IDs, priority, story points; the Backlog, Current Sprint, Planned Sprints, Historic Sprints, Epics and Archived views in the side menu | `full`, `strip`, `wide`, `sm` | index hero; agile-sprints.html hero; social card; PDF cover |
| `as-backlog` | Agile Sprints | Backlogs | stages Ideas & Intake, Refinement Needed, Ready for Sprint; epics E001–E006; story points | `full`, `board`, `refine`, `sm` | index Agile Sprints; agile-sprints.html "Plan from a prioritised backlog"; PDF p3 |
| `as-epics` | Agile Sprints | Epics, Gantt view | six epics on a week-by-week Gantt chart, January to March 2026 | `full`, `timeline`, `start` | index Agile Sprints (hidden on phones); agile-sprints.html "See epics over time" |
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
- **Commercial terms:** support hours and response times. (The free trial is on zedxapps.com, so the site mentions it.)
- **Prices:** zedxapps.com says pricing is available in several currencies but shows no figures. The only public figures are G-Cloud 14 prices from May 2024.
- **Where ZedX hosts its own editions:** the Editions page says ZedX hosts Home, Professional, Group and Corporate (resolved in November 2026, and on the site), but not in which country or region, so the site doesn't say.

### Reporting claims

- **"Automated reporting":** only Agile Sprints' "online automated stand-ups reporting" and Project Portfolios' "automatic reminders" are stated. Nothing on the site says leadership reporting is automatic or real-time.
- **"Real time":** used only for Agile Sprints sprint progress, as its page states.

### Demo and assets

- **Self-service demo:** resolved in October 2026. Swiftpro now promotes the demo on zedxapps.com ("self-guided demo, with no registration required") and on the login page ("Try Demo Account"), so the site links to https://demo.zedx.net/ as a secondary action.
- **Free trial:** the Demo/Trial page lists a free trial account as "Available from Nov 2026", set up through a registration wizard with no credit card. It still links no sign-up page, so the site mentions the trial and tells visitors to ask Swiftpro. Link the sign-up page when one appears.
- **Logos:**
  - No official logo files are in the repository, and none are used outside the screenshots.
  - The product logos inside screenshots are untouched.
  - If Swiftpro supplies logos and permission, use them unchanged.
- **Partner identity:** the site's owner has no verified name or logo yet. The header uses a text wordmark plus "Independent promotional site". Add the partner's real name to the footer attribution when it is confirmed.
- **Screenshot gaps:**
  - The demo's Agile Sprints Insights page has no data, so velocity, completion and carried-over metrics have no screenshot and are described in text only.
  - Releases have no screenshot either.
- **Interface details explained in November 2026** (now described on the site): Difficulty Points on Group WorkStreams cards (Work Items module), the board views in each app's side menu, and the "Ask Cloe" menu item (Cloe AI).
- **Still unexplained** (shown, never described):
  - the "Days" field on some Group WorkStreams cards;
  - the red counts in the workstreams list's Active Tasks column;
  - the Training Account option on the login page.

### Legal notice, privacy policy and the work-in-progress notice

- **Contact address:** both pages point visitors to public GitHub issues, because the site owner has no published name or email yet. Replace it with a real contact address when there is one.
- **Owner's name:** the legal notice says only that the site is published from the GitHub account HamzaAnjum96. Add the owner's name (and company details, if a company runs the site) when they are confirmed.
- **Governing law:** not stated, because it depends on where the owner is based. Add it once that is known.
- **Legal review:** both pages were written from what the site actually does (no cookies, storage, forms or third-party requests; GitHub Pages logs visitor IP addresses). They have not been reviewed by a lawyer.
- **Keeping the privacy policy true:** `e2e/content.spec.ts` fails if any page sets a cookie, uses web storage, has a form or requests another site. Adding analytics, embeds or a form means updating `privacy.html` first.
- **Removing the notice:** when the content has been checked, delete the `.wip-notice` block from the header of every page in `docs/` (including `404.html`), the `.b-wip` strip from `docs/brochure.html`, and the "work in progress" wording in the brochure's last footer and in the legal notice. Then remove the notice tests (`WIP_NOTICE` in `e2e/fixtures.ts`), run `npm run pdf` and `npm test`.

## Where to change things

| to change | edit | then |
| --- | --- | --- |
| copy on a page | the page in `docs/` (header, footer and viewer markup are repeated in each page); write with the `copywriting` skill and edit with `copy-editing` (`.claude/skills/`) | `python3 tools/check_site.py docs`, `npm test` |
| the legal notice or privacy policy | `docs/legal.html`, `docs/privacy.html`; change the "Last updated" date on the page you edit | `npm test` |
| colours, type, spacing | `replica/design/tokens.json` | `python3 tools/build_tokens.py`, contrast gate |
| layout or components | `docs/assets/css/site.css` (colours, fonts, spacing, radii and shadows come from tokens; the only raw colour is the viewer backdrop) | `npm test` |
| a screenshot crop | `SHOTS` in `tools/capture_screens.mjs` | `npm run screens -- --encode-only`, update `width`/`height` in the HTML |
| the PDF or social card | `docs/brochure.html`, `docs/assets/css/brochure.css`, `tools/og-template.html` | `npm run pdf` |
| demo destination | every `https://www.zedxapps.com/index.html#formContact` link | `npm test` (navigation suite checks every demo link) |
