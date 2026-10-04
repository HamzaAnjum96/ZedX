# Claims register

Every product statement on the brochure traces to a row here. Source numbers
refer to the sources table in `recon.md`. Read 2026-10-04.

Confidence: **high** = stated plainly on the current ZedX site; **medium** =
stated in the 2024 G-Cloud listing, or a fair reading of the site; anything
lower is kept off the brochure.

Before promoting the site, someone at Swiftpro should read this list once.
The `used on` column says where each claim appears (I = index.html,
W = workstreams.html, A = agile-sprints.html, B = brochure PDF).

## Group WorkStreams

| ID | claim (as the brochure puts it) | source | confidence | used on |
| --- | --- | --- | --- | --- |
| W1 | You can set up a series of workflows, each one serving a specific function of the organisation | 1 | high | I W B |
| W2 | The tasks in each workflow sit on a Kanban board | 1 | high | I W B |
| W3 | It suits continuous-flow, operational, ad-hoc and non-Scrum work | 2, 3 | high | I W B |
| W4 | A project workstream in Project Portfolios can link to Group WorkStreams, with progress summarised through structured project updates | 3 | high | I W B |
| W5 | Teams with mixed delivery models can run it alongside Agile Sprints, keeping operational work out of the sprint | 2 | high | I W A B |
| W6 | Each function's work moves through stages that make sense for it (the demo gives each sample workstream its own columns) | inferred: 1 ("create a series of workflows"), 8 ("comprehensive configuration options"), configurable stages seen in Agile Sprints (A08) | **medium: please confirm** | W |

## Agile Sprints

| ID | claim | source | confidence | used on |
| --- | --- | --- | --- | --- |
| A1 | Built for teams working in Scrum and sprint-based Agile | 2 | high | I A B |
| A2 | Epics and user stories in a prioritised product backlog | 2 | high | I A B |
| A3 | Stories estimated in story points and selected into sprints against team capacity | 2 | high | A B |
| A4 | Sprint goals and scope visible before work begins | 2 | high | A |
| A5 | Configurable sprint boards with workflow stages; work in progress, done and blocked work visible | 2 | high | A B |
| A6 | Supports daily stand-ups and sprint reviews; automated online stand-up reporting | 1, 2 | high | I A B |
| A7 | Sprint progress tracked in real time | 2 | high | A B |
| A8 | Releases managed across one or more sprints; stories assigned to planned release versions | 2 | high | I A B |
| A9 | Metrics: sprint completion, velocity and carried-over work, with trends across sprints | 2 | high | A B |
| A10 | Metrics are meant to help teams learn, not to police them | 2 | high | A |
| A11 | Access controlled with role-based permissions | 2 | high | A B |
| A12 | Epics laid out on a timeline | 2 (screenshot A06) | high | A |
| A13 | Use it on its own, or link it to Project Portfolios, which gets periodic summaries rather than task-level detail | 2, 3 | high | I A B |
| A14 | Lightweight: no unnecessary process or governance overhead | 2 | high | I A |

## Platform

| ID | claim | source | confidence | used on |
| --- | --- | --- | --- | --- |
| P1 | One login and one consistent interface across every ZedX app | 4, 6 | high | I W A B |
| P2 | Single sign-on with Microsoft Entra ID, or a ZedX ID | 4 | high | I B |
| P3 | People outside the organisation can use their own Entra ID or a guest login | 4 | high | I W B |
| P4 | Granular access to individual apps and modules; hierarchical permissions | 4 | high | I B |
| P5 | Licence one app or the whole suite | 4, 6 | high | I B |
| P6 | Licensing options: per app per user; per app in packs of 10 or 100 users; per app for unlimited users on your own server or Azure subscription; every current and future app, unlimited, on your own server or Azure | 4 | high | I B |
| P7 | Editions for central and local government, arm's-length bodies and agencies, universities, colleges and schools, and businesses from SME to corporate | 5, 6 | high | I B |
| P8 | Preconfigured for each sector, with further configuration to fit the organisation | 6, 8 | high | I W B |
| P9 | The apps are integrated with each other | 4 | high | shown, not stated (Better together section) |
| P10 | Hosted on Microsoft Azure, by Swiftpro or in the customer's own Azure subscription | 4, 8 | medium | I B |
| P11 | Data stored and processed in the UK | 8 | medium | I B |
| P12 | Import from CSV; export to Excel and PDF | 8 | medium | I B |
| P13 | Built-in dashboards, plus Power BI integration | 8 | medium | I |
| P14 | Fully usable in a mobile browser | 8 | medium | I |
| P15 | Integration with Oracle, SAP ERP and Tribal available as a service when hosted on the customer's servers or Azure | 4 | high | I |
| P16 | Group WorkStreams and Agile Sprints are part of the ZedX Apps Platform from Swiftpro Corporation Ltd, London | 6, 7 | high | I W A B |

## Kept off the brochure

| claim | source | why |
| --- | --- | --- |
| Prices (from £150 per 10 users per month for either app, May 2024) | 9 | may be out of date; see `launch/pricing.md` |
| Free trial (4 weeks) | 8 | 2024 listing, not confirmed current |
| Cyber Essentials | 8 | annual certification, not confirmed current |
| Support hours, response times, account manager | 8 | 2024 listing, not confirmed current |
| "Corporate Workflows" is the old name of Group WorkStreams | 6, 9 | a guess |
| Any customer name, count, quote or rating | none | none are public; no fake proof |

## Framing and examples (not product claims)

These are the brochure's own words around the facts above. They describe
ways of working, or give examples, and claim nothing about features.

| where | what |
| --- | --- |
| index.html problem section | "too heavy / too light / watched, not helped": paraphrased from the research in `fixes.md`; names no product |
| index.html comparison, "Typical teams" | examples of teams, not customer claims |
| workstreams.html "Ideas for workstreams" | example workstreams with example stages |
| workstreams.html "Why a board suits operational work" | general Kanban practice |
| chooser | a rule of thumb (flow vs time-box), not a product feature |

## Illustrations

Every board, chart and stand-up summary on the site is an original
illustration with invented sample data, labelled as such on the page. They
show the ideas the claims above describe, not the product's actual screens.
