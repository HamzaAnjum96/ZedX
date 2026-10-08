# Claims register (redesign, October 2026)

Every product statement on the site traces to a row here. Official pages were
re-read on 2026-10-08, after Swiftpro updated zedxapps.com (a new Group
WorkStreams page, a rewritten Platform page, and editions, pricing, demo and
trial details on the home page). `python3 tools/check_sources.py` checks that
the key phrases behind these rows are still on the official pages. Sources:

| # | source |
| --- | --- |
| APP | https://www.zedxapps.com/Applications/index.html |
| GW | https://www.zedxapps.com/GroupWorkStreams/Index.html (new in October 2026) |
| AS | https://www.zedxapps.com/AgileSprints/Index.html |
| PP | https://www.zedxapps.com/ProjectPortfolios/Index.html |
| PLAT | https://www.zedxapps.com/Platform/index.html |
| HOME | https://www.zedxapps.com/index.html (contact form `#formContact`) |
| LOGIN | https://www.zedx.net/ (its "Try Demo Account" card opens demo.zedx.net) |
| DEMO | what is visible in the public ZedX demo (demo.zedx.net), sample data. Used only to describe what a screenshot shows. |

Pages: I = index, W = workstreams.html, A = agile-sprints.html, B = brochure PDF, L = legal.html, P = privacy.html.

Confidence is **high** for every published row: each is stated on the official page, or visible on the screen it describes. Nothing below high is published.

## Group WorkStreams

| ID | claim as published | source | used on |
| --- | --- | --- | --- |
| W1 | A workstream (workflow) for each function of the organisation | APP, GW | I W B |
| W2 | Its tasks sit on a Kanban board | APP, GW | I W B |
| W3 | Suits continuous-flow, operational, ad-hoc and non-Scrum work, and operational, administrative and service teams, without the overhead of a project plan or sprints | GW, PP, AS | I W B |
| W4 | Each workstream has its own stages: the complaints log has five, catering issues three (set with New Stage / Edit Stage) | DEMO (stage names read from the boards) | I W B |
| W5 | Work items show a reference, a priority from Low to Critical, and the assignee where one is set | DEMO | W |
| W6 | The workstreams list shows portfolio, active epics, active tasks, type and owners | DEMO | I W B |
| W7 | The Insights dashboard charts work items per workstream a user can access, critical and non-critical | DEMO | I W B |
| W8 | Can run alongside Agile Sprints for mixed delivery models, keeping operational and ad-hoc work out of the sprint | AS | I W A B |
| W9 | Project workstreams in Project Portfolios can be linked to it, with progress summarised through structured project updates; Project Portfolios can show high-level progress while the detail stays in Group WorkStreams | PP, GW | W B |
| W10 | A workstream can be shown as a simple list, a Kanban board or a timeline; stages, fields and priorities can be changed | GW | I W B |
| W11 | Dashboards show workload, progress and bottlenecks across workstreams; managers can follow them while teams organise their own work | GW | I W B |
| W12 | Role-based permissions | GW | W |
| W13 | A workstream can be linked to Agile Sprints when its work needs sprints, without duplicating data | GW | I W A B |
| W14 | Can manage the delivery behind audit recommendations, governance actions and control improvements without adding governance complexity to day-to-day work | GW | W |
| W15 | Education providers can use it with ZedX Study Planner, a student app that integrates with Group WorkStreams so tutors and students can plan assignments, coursework and learning activities | GW | W B |

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

| ID | claim as published | source | used on |
| --- | --- | --- | --- |
| L1 | Single sign-on with Microsoft Entra ID | PLAT | I W A B |
| L2 | Permissions follow the organisation's hierarchy: teams work in their own areas, and authorised users can see across departments, business units or the whole organisation | PLAT | I B |
| L3 | Every ZedX app is built on the same platform, with one login and one interface; organisations can start with one app and add others | PLAT, HOME | I |
| L4 | Technology: React, APIs, Microsoft SQL Server and Microsoft Azure | PLAT | I |
| L5 | Editions: Home (individual use), Professional (SMEs), Group (unrelated teams), Corporate (medium-sized businesses), Enterprise (government, education and larger organisations) | HOME | I B |
| L6 | SaaS editions are licensed per user; Enterprise has unlimited users and can be deployed in the customer's own Microsoft Azure account, which gives more control over infrastructure, integration and data | HOME, PLAT | I W A B |
| L7 | Enterprise deployments can integrate ZedX with existing applications and data sources | PLAT | I B |
| L8 | Apps on Demand: Swiftpro can build additional workflow apps from ZedX's reusable components | PLAT | I |
| L9 | Demo requests go through the contact form to Swiftpro, whose form says "we will get back to you soon"; nothing is booked automatically | HOME | I W A B |
| L10 | ZedX and the apps are products of Swiftpro Corporation Ltd, London | HOME footer, About | all |
| L11 | The self-guided ZedX demo is open to everyone, with no registration | HOME, PLAT, LOGIN | I W A B P |
| L12 | A free trial account is available: you register your details, and no credit card is needed | HOME, PLAT | I B |
| L13 | Pricing is available in several currencies; this site shows no prices | HOME | I |

## Withdrawn by Swiftpro (October 2026 update)

These were on this site until 8 October 2026. None of them is on any official
page now, so they were removed. `e2e/content.spec.ts` fails if any returns.

| old ID | claim | was used on |
| --- | --- | --- |
| L1 (part) | ZedX's own sign-in for organisations without Entra ID | I W A B |
| L2 | External users sign in with their own Entra ID or a guest login | I B |
| L3 (part) | Access to single apps or to modules within an app | I B |
| L4 (part) | A store inside ZedX that lists the apps for your sector | I |
| L6 | Per-user and per-block licences include hosting; unlimited licences run on your own server or Azure | I B |
| L7 | Swiftpro Digital integration service, naming Oracle, SAP ERP and Tribal | I B |
| L8 | Four licence options: per user, blocks of 10 or 100 users, per-app unlimited, all apps unlimited | I B |

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
| Two-factor authentication, Cyber Essentials, support hours | G-Cloud 14 listing only | not confirmed current |
| Prices (from £150 per 10 users per month, May 2024) | G-Cloud 14 pricing document | may be out of date; the site asks visitors to ask Swiftpro for pricing |
| Sector editions for government, education and business | Sectors page | true but not needed for these two apps; the five named editions are published instead |
| How to register for the free trial | no official page links a sign-up | the site tells visitors to ask Swiftpro |
| The other ZedX apps (Risk Registers, Audit Actions, Governance Statement, Management Controls, Contingent Labour) | APP and their own pages | out of scope, except where the Group WorkStreams page names audit and governance work (W14) |
| Any customer name, count, quote, rating or outcome | none | none are public; nothing invented |
| Competitor comparisons | earlier research (`fixes.md`) | not supported by official sources; removed in the redesign |
