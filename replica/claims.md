# Claims register (redesign, October 2026)

Every product statement on the site traces to a row here. Official pages were
re-read on 2026-10-04. Sources:

| # | source |
| --- | --- |
| APP | https://www.zedxapps.com/Applications/index.html |
| AS | https://www.zedxapps.com/AgileSprints/Index.html |
| PP | https://www.zedxapps.com/ProjectPortfolios/Index.html |
| PLAT | https://www.zedxapps.com/Platform/index.html |
| HOME | https://www.zedxapps.com/index.html (contact form `#formContact`) |
| DEMO | what is visible in the public ZedX demo (demo.zedx.net), sample data. Used only to describe what a screenshot shows. |

Pages: I = index, W = workstreams.html, A = agile-sprints.html, B = brochure PDF, L = legal.html, P = privacy.html.

Confidence is **high** for every published row: each is stated on the official page, or visible on the screen it describes. Nothing below high is published.

## Group WorkStreams

| ID | claim as published | source | used on |
| --- | --- | --- | --- |
| W1 | A workstream (workflow) for each function of the organisation | APP | I W B |
| W2 | Its tasks sit on a Kanban board | APP | I W B |
| W3 | Suits continuous-flow, operational, ad-hoc and non-Scrum work | PP, AS | I W B |
| W4 | Each workstream has its own stages: the complaints log has five, catering issues three (set with New Stage / Edit Stage) | DEMO (stage names read from the boards) | I W B |
| W5 | Work items show a reference, a priority from Low to Critical, and the assignee where one is set | DEMO | W |
| W6 | The workstreams list shows portfolio, active epics, active tasks, type and owners | DEMO | I W B |
| W7 | The Insights dashboard charts work items per workstream a user can access, critical and non-critical | DEMO | I W B |
| W8 | Can run alongside Agile Sprints for mixed delivery models, keeping operational and ad-hoc work out of the sprint | AS | I W B |
| W9 | Project workstreams in Project Portfolios can be linked to it, with progress summarised through structured project updates | PP | W B |

## Agile Sprints

| ID | claim as published | source | used on |
| --- | --- | --- | --- |
| A1 | For delivery teams working in Scrum or sprint-based Agile; sprint and release management | AS | I A B |
| A2 | Epics and user stories in a prioritised product backlog | AS | I A B |
| A3 | Stories estimated in story points and selected into sprints against team capacity; scope, capacity and sprint goals visible before work begins | AS | I A B |
| A4 | Configurable sprint boards; work in progress, completed and blocked work visible | AS | I A B |
| A5 | Supports daily stand-ups and sprint reviews; online automated stand-up reporting | AS, APP | I A B |
| A6 | Sprint progress tracked in real time | AS | A |
| A7 | Releases across one or more sprints; stories assigned to planned release versions | AS | I A B |
| A8 | Metrics: sprint completion, velocity and carried-over work, with trends across sprints | AS | I A B |
| A9 | Metrics are meant to inform teams and encourage learning, not enforce control | AS | A |
| A10 | Role-based permissions | AS | A |
| A11 | Used on its own, or linked to Project Portfolios; sprint progress summarised through periodic updates without task-level detail | AS, PP | I A B |
| A12 | Backlog stages Ideas & Intake, Refinement Needed, Ready for Sprint; epics on a week-by-week timeline | DEMO | I A B |

## Project Portfolios (supporting role, index only)

| ID | claim as published | source |
| --- | --- | --- |
| P1 | A separate ZedX app where leaders follow delivery across portfolios, programmes and projects | PP |
| P2 | Structured updates from project managers at agreed intervals, such as monthly or quarterly, in a consistent format | PP |
| P3 | Updates include delivery confidence as a RAG status, narrative progress, key achievements, blockers, risks, dependencies and support required | PP |
| P4 | Dashboards of delivery health across portfolios, programmes and projects; trends show whether confidence is improving, stable or deteriorating | PP |
| P5 | Also: vision and objectives, portfolio-level Gantt view, export to Excel, automatic reminders for updates, benefits tracking | PP |
| P6 | Progress from linked workstreams arrives through periodic updates, not task-level detail | PP, AS |

## Platform, hosting and licensing

| ID | claim as published | source |
| --- | --- | --- |
| L1 | Single sign-on with Microsoft Entra ID, or the ZedX internal ID system | PLAT |
| L2 | External users sign in with their own Entra ID or a guest login | PLAT |
| L3 | Access to individual apps or modules within apps; full hierarchical permission management | PLAT |
| L4 | One login and one consistent interface; apps integrated with each other; in-site store showing apps relevant to the sector | PLAT, HOME |
| L5 | React front end and API, SQL Server back end | PLAT |
| L6 | Per-user and per-block licences include hosting; unlimited-user licences run on your own server or Azure subscription | PLAT (licence wording) |
| L7 | Swiftpro Digital can integrate ZedX with other systems as a service, including Oracle, SAP ERP and Tribal, where ZedX is hosted on the customer's servers or Azure | PLAT |
| L8 | Four licence options: per app per user; per app in blocks of 10 or 100 users; per app unlimited users (own server or Azure); all current and future apps unlimited (own server or Azure) | PLAT |
| L9 | Demo requests go through the contact form to Swiftpro, who "will get back to you"; nothing is booked automatically | HOME |
| L10 | ZedX and the apps are products of Swiftpro Corporation Ltd, London | HOME footer |

## Legal notice and privacy policy

Checked on 2026-10-04.

| ID | claim as published | source | used on |
| --- | --- | --- | --- |
| R1 | GitHub logs and stores the IP address of everyone who visits a GitHub Pages site, for security purposes | GitHub Docs, What is GitHub Pages, "Data collection": https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection | P |
| R2 | The site sets no cookies, uses no web storage, has no forms and loads nothing from other websites | this site's own code; `e2e/content.spec.ts` checks it on every page | P, footer |
| R3 | The demo form on zedxapps.com is covered by Swiftpro's Privacy Policy; Swiftpro's Terms of Use apply on its site | HOME footer links: https://www.zedxapps.com/PrivacyPolicy.html, https://www.zedxapps.com/WebsiteTerms.html | L P |
| R4 | UK visitors can complain to the Information Commissioner's Office | https://ico.org.uk/make-a-complaint/ | P |
| R5 | IBM Plex Sans is used under the SIL Open Font License; the icons are Lucide, under the ISC licence | `docs/assets/fonts/OFL-IBM-Plex-Sans.txt`, `docs/assets/img/LICENSE-lucide.txt` | L |
| R6 | The site is published from the GitHub account HamzaAnjum96; issues on its repository are public | the repository settings | L P |

## Kept off the site

| claim | where it appears | why |
| --- | --- | --- |
| UK data storage and processing | G-Cloud 14 listing (2024) only | not on current official pages; confirm with Swiftpro |
| Fully usable in a mobile browser | G-Cloud 14 listing only | as above |
| Power BI integration | G-Cloud 14 listing only | as above |
| CSV import, Excel/PDF export platform-wide | G-Cloud 14 listing only | narrowed: Excel export is stated for Project Portfolios only |
| Two-factor authentication, Cyber Essentials, free trial, support hours | G-Cloud 14 listing only | not confirmed current |
| Prices (from £150 per 10 users per month, May 2024) | G-Cloud 14 pricing document | may be out of date; the site asks visitors to ask Swiftpro for pricing |
| Editions for government, education and business | HOME, Sectors page | true but not needed for these two apps; may return in a later edit |
| Any customer name, count, quote, rating or outcome | none | none are public; nothing invented |
| Competitor comparisons | earlier research (`fixes.md`) | not supported by official sources; removed in the redesign |
