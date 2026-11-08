# Copy review

## November 2026: full text rewrite after Swiftpro's second update

On 8 November 2026 every official page was re-read (see "What changed on 8
November 2026" in `claims.md`). The site owner asked for a full run-through and
a redo of all the text, because the official site now has much more to work
with. Every page, the brochure, the social card, alt text, viewer titles and
meta descriptions were rewritten with the `copywriting` skill and edited with
`copy-editing` (seven sweeps plus the AI-tell self-check). Every new claim was
added to `claims.md` first, with its phrase in `tools/check_sources.py`.

### What the new material changed

| area | before (8 October) | after (8 November) | source |
| --- | --- | --- | --- |
| Home H1 | "Workflows for everyday work. Sprints for planned delivery." | "Kanban boards for everyday work. Sprints for delivery teams." Concrete nouns for both audiences; "delivery teams" is Swiftpro's own term for Agile Sprints users | AS |
| Group WorkStreams H2 (home) | "Group WorkStreams gives each kind of work its own board" (repeated the hero lead) | "Group WorkStreams takes everyday work out of spreadsheets", the pain the official FAQ answers "Yes" to | W18 |
| Editions | five editions, "SaaS editions are licensed per user" | six editions, what each includes, how each is licensed; "Group" and "Corporate" described by who they suit, not by what they lack | L5, L6, L16 |
| Hosting | Enterprise in your own Azure; SaaS hosting unknown | ZedX hosts Home, Professional, Group and Corporate; Enterprise and Enterprise Plus in your own Azure or other agreed infrastructure | L14 |
| Comparison table | five rows | six: "Board views" (from the modules tables and visible in the screenshots) and "Editions" replace "The board" | W16, A16, W21, A19 |
| AI | not mentioned ("Ask Cloe" was an unexplained menu item) | Cloe AI on the home page and an AI question on each app page, with "uses OpenAI technology" attributed to Swiftpro | L15, W20, A18 |
| App pages | no FAQ | five questions each, from the official FAQs, rewritten | GW, AS |
| Captions and alt text | side menus not described | difficulty points and the board views in each side menu named, now that the modules tables explain them | W5, W16, A16 |
| Demo and trial | "Anyone can open the demo without registering"; trial "ask Swiftpro" | the demo creates an account automatically; the trial is listed from November 2026 with a registration wizard; still no sign-up link, so still "ask Swiftpro" | L11, L12 |
| Legal and privacy | sources "as they were in October 2026" | product details as on 8 November 2026, screenshots from October; Study Planner, Cloe AI and OpenAI named; what the demo and trial ask for | L, P |

### AI tells found in the first draft and fixed

| draft | pattern | final |
| --- | --- | --- |
| "It suits … teams whose work arrives every day and doesn’t fit a project plan or a sprint. A dashboard … so they don’t have to ask …" | stacked negatives | "…whose work arrives every day, outside any project plan or sprint." One negative left, the benefit |
| "…governance actions and control improvements, and keep the governance detail off the team’s board." | trailing clause | two sentences: "…control improvements. The governance detail stays off the team’s board." |
| "If ZedX has no app for one of your processes, Swiftpro can build one … with no separate development charge." | two negatives, trailing | "Swiftpro can build extra workflow apps for your own processes … You pay for consultancy and a subscription, and a suitable app carries no separate development charge." |
| "For independent teams that don’t need a wider corporate set-up" / "…without running their own infrastructure" | editions defined by absence | "For independent teams and groups" / "…the full range of apps, hosted by ZedX" |
| Demo FAQ with three absences (register, credit card, sign-up link) | negation stack | the account is created automatically; one absence kept by the call to action ("No credit card is needed") |
| "…including how many items are critical, so managers don’t have to ask each person for an update." (brochure, 25 words, 3 commas) | trailing pile-on | split into two sentences |
| "Swiftpro presents it as support for people’s judgement, with important decisions left to people." | trailing clause, repetition | "Swiftpro adds that it supports people’s judgement and leaves important decisions to them." |
| "The demo college keeps catering and vending issues, CPD and training requests and complaints in separate workstreams." | unclear "and" chain | the real workstream names: "Complaints & Compliments Log, CPD & Training Requests and Catering & Vending Machine Issues" |
| "zedxapps.com doesn’t link a sign-up page yet, so ask…" | sentence opening in lower case | "Ask Swiftpro how to start one, because zedxapps.com doesn’t link a sign-up page yet." |

Kept on purpose: single absences next to a call to action ("so there’s nothing to
register", "No credit card is needed"), the reader's own questions ("Which app
fits your work?", "Need both?"), and lists of three that are Swiftpro's own
lists (portfolios, programmes and projects). The legal notice and privacy policy
state absences plainly ("does not collect", "not liable"), as legal text should.

### Typography

The new H1 first broke as "Kanban boards / for everyday / work. Sprints for /
delivery teams." at every width, splitting a sentence mid-line. Non-breaking
spaces in "everyday work." and "delivery teams." now give "Kanban boards for /
everyday work. / Sprints for / delivery teams." at 1440, 1100, 768, 390 and
360px, and on the brochure cover.

### Expert panel (copy-editing skill)

Scores for the home page after edits, out of 10:

| reviewer | score | note |
| --- | --- | --- |
| Conversion copywriter | 8 | One action, repeated, with the vendor named. The spreadsheet heading names a pain the reader has. |
| UX writer | 8 | Editions come first in the reference columns; each app page now ends with the questions a buyer asks. The leadership section is long but plain. |
| Target reader (operations manager at a college) | 9 | Recognises the complaints log and the spreadsheet, can see which edition includes Group WorkStreams, and knows the demo needs no sign-up. |
| Skeptical buyer (IT approver in the public sector) | 8 | Hosting by edition, Entra ID, how integrations are agreed, and that Cloe uses OpenAI technology are all stated. No prices or data residency, because Swiftpro publishes neither. |
| Brand strategist | 8 | One voice; the partner role is clear without dominating. |

## October 2026: first copy rewrite

The site copy was rewritten with the `copywriting` skill, then edited with
`copy-editing` (seven sweeps plus the AI-tell check). Both skills are in
`.claude/skills/`; product context is in `.claude/product-marketing.md`. Every
claim still traces to `claims.md`.

The site owner reported that labels such as "ZedX app for continuous work" read as AI-made, in both their design and their wording.

### Design changes

- **Removed:** the mono eyebrow labels and their cyan dash, above the home hero, the app page heroes, the closing band and the 404 page.
- **Removed:** the mono "kicker" labels above the two product sections.
- **Removed:** the mono app labels at the start of every screenshot caption. Captions are now plain sentences that name the app.
- **Removed:** the labelled fact rows ("Suits / How work is organised / What teams can see"). Short paragraphs replace them.
- **Removed:** the cyan bar beside the leadership lead and in the brochure's demo box.
- **One typeface:** IBM Plex Mono is gone, and IBM Plex Sans is the only typeface.
- **Guards:** `e2e/content.spec.ts` fails if eyebrows, kickers or monospace type come back. `tools/check_site.py` fails on common AI-tell words and on em dashes.

### AI tells found and fixed

| before | pattern | after |
| --- | --- | --- |
| "What leadership sees: periodic updates, not task lists" | contrast reveal + colon reveal | "Leaders follow progress in Project Portfolios" |
| "We promote the apps; we don't make them." | contrast reveal | "An independent promoter of ZedX runs this site. ZedX is made by Swiftpro Corporation Ltd, and demo requests go to them." |
| "…reaches Project Portfolios through those periodic updates, not as task-level detail." | contrast reveal | "Project Portfolios then sees their progress as a summary in each update. The individual tasks stay on the team's board." |
| "Two ZedX apps for running work" / "ZedX app for continuous work" / "Next step" | eyebrow labels | removed; the heading carries the message |
| "Continuous work, organised by function" | label heading, needed a kicker to name the product | "Group WorkStreams gives each kind of work its own board" |
| "Planned delivery, sprint by sprint" | rhythmic slogan | "Agile Sprints takes Scrum teams from backlog to release" |
| "Suits / How work is organised / What teams can see" | label headings, bold label on every item | two short paragraphs per product |
| "Group WorkStreams handles the steady flow of operational work, with a Kanban board for each function." | trailing clause, abstract | "Group WorkStreams puts each stream of incoming work, such as complaints or HR requests, on its own Kanban board." |
| "…from backlog to sprint to release." | list of three as a flourish | "…plan their work in a backlog and deliver it in sprints." |
| "Explore the apps" | weak CTA | "See both apps" |
| "Nothing is booked automatically." | passive, vague | "The form doesn't book a time for you." |
| "What adoption involves" (heading and nav "Adoption") | consultant word | "Sign-in, hosting and licensing" (nav "Licensing") |
| "…and where the critical items sit, without opening every board." | trailing pile-on | "It shows which services carry the most work, and where the critical items are, on one screen." |

### Expert panel (copy-editing skill)

Scores for the home page after edits, out of 10:

| reviewer | score | note |
| --- | --- | --- |
| Conversion copywriter | 8 | One clear action, repeated three times, with the vendor named next to it. |
| UX writer | 8 | Short paragraphs. Headings say what each section is about without a label above them. |
| Target reader (operations manager at a college) | 8 | Recognises complaints, catering and HR requests from their own work, and knows where a demo request goes. |
| Brand strategist | 8 | One voice throughout. The partner role is clear without dominating. |

### Still open

- No customer quotes or numbers exist, so the copy has no social proof. That is on purpose: none have been invented.
- If Swiftpro confirms more facts (for example UK hosting or mobile use), add them to `claims.md` first, then to the copy.
