# Recon map: Group WorkStreams + Agile Sprints (web)

Scope: the two board-based ("Jira / Trello type") apps on the ZedX Apps
Platform, mapped so a brochure can present them accurately.
For: a GitHub Pages brochure site in this repo (`docs/`).
Date: 2026-10-04

## How the Replica pack is used here

Replica is built to clone apps. This project is **not a clone**: it is a
brochure for the real products, under their real names. So:

- **Recon** maps what the two apps do, from public sources, so every claim on
  the brochure can be traced to a source (see `claims.md`).
- **Clean-room rules still apply to the brochure itself.** No text, images,
  logos, icons, CSS or code is copied from zedxapps.com. Copy is written fresh,
  product mock-ups are original HTML illustrations with invented sample data,
  and fonts and icons are open-licence.
- **Rebranding does not apply.** The brochure promotes the products themselves,
  so it keeps their names and points every call to action at the official
  ZedX channels. Renaming them would describe a product that does not exist.
  replica-brand is used only for its voice guide.
- The `features.csv` columns are reused as: `original` = the product has it
  (per the sources), `clone` = the brochure presents it.

Reference images of the original were looked at during recon and kept out of
the repo (`replica/screens/` is git-ignored).

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | marketing site: applications overview | https://www.zedxapps.com/applications/index.html | one-paragraph summary of each app. Group WorkStreams has no detail page. |
| 2 | marketing site: Agile Sprints page | https://www.zedxapps.com/AgileSprints/Index.html | full feature list, two product screenshots (workstreams list + epics timeline, sprint board), metrics, related apps |
| 3 | marketing site: Project Portfolios page | https://www.zedxapps.com/ProjectPortfolios/Index.html | how Agile Sprints and Group WorkStreams feed portfolio reporting |
| 4 | marketing site: platform | https://www.zedxapps.com/Platform/index.html | architecture, integration, in-site store, sign-in and permissions, hosting and licensing |
| 5 | marketing site: sectors | https://www.zedxapps.com/Sectors/index.html | government, education, business editions |
| 6 | marketing site: home | https://www.zedxapps.com/index.html | positioning pillars, sector editions, demo request form (`#formContact`) |
| 7 | marketing site: about | https://www.zedxapps.com/About/index.html | Swiftpro Corporation, London |
| 8 | G-Cloud 14 service listing (UK Digital Marketplace) | https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud/services/914772711044188 | features, benefits, hosting, identity, support, data export, mobile. Published 2024. |
| 9 | G-Cloud 14 pricing document, last updated 7 May 2024 | https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/718083/914772711044188-pricing-document-2024-05-07-1243.pdf | per-app monthly prices. Lists "Corporate Workflows", not "Group WorkStreams". |
| 10 | G-Cloud 14 service definition document | https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/718083/914772711044188-service-definition-document-2024-05-07-0120.pdf | title page only, no content |
| 11 | customer login | https://zedx.net/ | public URL only. No account was used. |

Not available: help centre, changelog, app store listing (web app only),
public API (G-Cloud: "API: No"), public walkthrough videos (searched, none
found), any public screenshot of Group WorkStreams.

## Core loop

- **Agile Sprints:** a Scrum team plans a sprint from a prioritised backlog of
  estimated stories, works it on a sprint board, and reads progress, stand-up
  and velocity reporting without building it by hand.
- **Group WorkStreams:** an organisation sets up a workflow for each function
  (each one a Kanban board) and moves tasks across it, with progress visible to
  the people who need it.

## Screens

Agile Sprints (A), from source 2 screenshots and its feature list. Group
WorkStreams (W) has no public screenshots, so its screens are inferred. Platform
(P) screens come from sources 4 and 8.

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| A01 | Home / Welcome | sidebar | landing inside the app | sidebar nav, user + organisation name | filled |
| A02 | Insights | sidebar | reporting | (not shown) | none seen |
| A03 | Portfolios | sidebar, count badge | portfolios the workstreams sit in | nav badge | none seen |
| A04 | Projects | sidebar, count badge | projects | nav badge | none seen |
| A05 | Workstreams list | sidebar > Workstreams | every delivery workstream with its portfolio, active epics, active tasks, type, owners | breadcrumb, command bar (New, Edit, View, Delete, Access, Epics, Sprints, Work Items), filter box, selectable table | filled |
| A06 | Epics timeline | Workstreams > Epics | epics laid out week by week | epic list, week/month grid, bars, zoom in/out, "Show List" toggle | filled |
| A07 | Backlog | work items > Backlog | prioritised stories not yet in a sprint | (not shown) | none seen |
| A08 | Current sprint board | work items > Current Sprint | the active sprint as columns of stories | stage columns (Not Started, In Progress, Completed Unverified, Completed Verified, Not Required), story cards (ID, epic, priority, story points), New Stage / Edit Stage, Add Task per column, Display menu | filled |
| A09 | Planned sprints | work items > Planned Sprints | upcoming sprints | (not shown) | none seen |
| A10 | Historic sprints | work items > Historic Sprints | finished sprints | (not shown) | none seen |
| A11 | Archived | work items > Archived | archived items | (not shown) | none seen |
| A12 | Sprint metrics dashboard | source 2 text | completion, velocity, carried-over work, trends across sprints | charts | described only |
| A13 | Stand-up report | source 1 text | automated online stand-up reporting | (not shown) | described only |
| A14 | Releases / versions | source 2 text | releases across sprints, stories assigned to versions | (not shown) | described only |
| W01 | Workstreams (workflows) list | inferred from source 1 | one workflow per organisational function | list | guess |
| W02 | Workstream Kanban board | source 1 | the tasks of one workflow as a Kanban board | columns, task cards | described only |
| P01 | Sign in | https://zedx.net/ | Microsoft Entra ID single sign-on or ZedX ID; guest logins for external users | sign-in form | public URL only |
| P02 | In-site store | source 4 | the apps available to the account, filtered by sector | app tiles | described only |
| P03 | Users, permissions and licences | sources 4, 8 | central user, permission and licence management; super users per account and per app | admin tables | described only |
| P04 | Outputs | source 8 | export views of the data to Excel | export list | described only |

## Flows

```
F01 Plan a sprint (Agile Sprints)
    A05 -> A07 backlog -> estimate stories in points -> select into sprint against capacity -> A08
    edge: capacity exceeded, story not estimated, priorities change mid-plan
F02 Run the sprint day to day (Agile Sprints)
    A08 -> move story across stages -> A13 stand-up report
    edge: blocked story, story not required, work carried over
F03 Review and improve (Agile Sprints)
    A08 sprint ends -> A12 completion, velocity, carried-over work -> trend across sprints
F04 Plan a release (Agile Sprints)
    A14 -> create version -> assign stories -> release spans one or more sprints
F05 Set up a workstream for a function (Group WorkStreams)
    W01 -> new workflow for e.g. HR onboarding -> (stages) -> give people access (P03)
    edge: external people need access (guest login, P01)
F06 Work the board (Group WorkStreams)
    W02 -> add task -> move it across the board -> done
F07 Report upwards (both)
    a project workstream in Project Portfolios links to Agile Sprints or Group WorkStreams
    -> progress summarised in periodic project updates, without task-level detail
F08 Get in (platform)
    P01 sign in once (Entra ID SSO or ZedX ID) -> P02 every licensed app, same interface
```

Happy path clicks are not countable without an account. The brochure does not
claim click counts.

## Components

Recorded as patterns only. The brochure's illustrations are original designs.

| component | variants | states | used on |
| --- | --- | --- | --- |
| Sidebar nav | item, sub-item, count badge | default, active | all app screens |
| Breadcrumb | app > area > page | default | all app screens |
| Command bar | icon + label buttons | default, disabled (no selection) | A05, A06, A08 |
| Data table | selectable rows | default, selected | A05 |
| Kanban column | header, card list, "Add" link | empty, filled | A08, W02 |
| Work item card | ID chip, epic chip, priority badge (Low, Normal, Medium, High), story points, edit and view icons | default, highlighted | A08 |
| Timeline | month and week header, bars | default, zoomed | A06 |
| Charts | stacked bar, donut | filled | A12 (and Project Portfolios) |

## Inferred data model

```
Organisation   name, sector edition, licences (per app per user, 10 or 100 user packs, unlimited)
               evidence: sources 4, 5, 9      confidence: high
User           identity (Entra ID or ZedX ID), guest flag, roles per app and module
               evidence: sources 4, 8         confidence: high
Workstream     name, portfolio, type, owners, access          (Agile Sprints)
               evidence: A05                  confidence: high
Epic           id (E###), name, start and end week
               evidence: A06, A08             confidence: high
WorkItem       id (W###), title, epic, priority, story points, stage, sprint, release version
               evidence: A08, source 2        confidence: high (release version: medium)
Sprint         number, name, goal, capacity, status (planned, current, historic)
               evidence: A08 title, sidebar, source 2      confidence: medium
Stage          name, order (configurable: New Stage, Edit Stage)
               evidence: A08                  confidence: high
Release        version, sprints it spans, stories
               evidence: source 2             confidence: medium
Workflow       name, function it serves, board                (Group WorkStreams)
               evidence: source 1             confidence: medium
Task           title, workflow, column, owner (guess)
               evidence: source 1             confidence: guess beyond title and column
```

Relationships: Organisation 1-n User, Portfolio 1-n Workstream, Workstream 1-n
Epic, Epic 1-n WorkItem, Sprint 1-n WorkItem, Release 1-n WorkItem;
Organisation 1-n Workflow, Workflow 1-n Task. A Project Portfolios workstream
can link to an Agile Sprints workstream or a Group WorkStreams workflow
(source 3).

Note: source 9 lists "Corporate Workflows" and no "Group WorkStreams", and the
home page lists "corporate workflows" among the platform's areas. Group
WorkStreams is probably the current name of that app. **Guess**, so the
brochure does not say it.

## Feature matrix

See `features.csv` (44 rows). Must: 22, should: 13, could: 5, skip: 4.

## Out of scope (cannot or should not be put on the brochure)

- Prices. The only public prices are G-Cloud 14 figures from May 2024 (see
  `launch/pricing.md`). They may be out of date, so the brochure describes the
  licensing options and asks visitors to request a quote.
- Free trial, certifications (Cyber Essentials), support hours, response
  times and security clearances. All from the 2024 G-Cloud listing and may
  have changed. Kept out of the brochure.
- Customer names, logos, numbers, quotes, ratings. None are public. No fake
  proof.
- Real product screenshots, logos and app icons. They belong to Swiftpro. The
  brochure uses original illustrations; the owner can drop official assets in
  later (see README).
- Features seen only in reference imagery with no text behind them (for
  example an "Ask Cloe" menu item on the Agile Sprints header image).

## Size

Screens 20 (14 Agile Sprints, 2 Group WorkStreams, 4 platform), flows 8,
entities 10. The brochure is a static site: 3 pages, 3 interactive
illustrations, a printable PDF. Size: S.
