# Copy review (October 2026)

The site copy was rewritten with the `copywriting` skill, then edited with
`copy-editing` (seven sweeps plus the AI-tell check). Both skills are in
`.claude/skills/`; product context is in `.claude/product-marketing.md`. Every
claim still traces to `claims.md`.

The site owner reported that labels such as "ZedX app for continuous work" read as AI-made, in both their design and their wording.

## Design changes

- **Removed:** the mono eyebrow labels and their cyan dash, above the home hero, the app page heroes, the closing band and the 404 page.
- **Removed:** the mono "kicker" labels above the two product sections.
- **Removed:** the mono app labels at the start of every screenshot caption. Captions are now plain sentences that name the app.
- **Removed:** the labelled fact rows ("Suits / How work is organised / What teams can see"). Short paragraphs replace them.
- **Removed:** the cyan bar beside the leadership lead and in the brochure's demo box.
- **One typeface:** IBM Plex Mono is gone, and IBM Plex Sans is the only typeface.
- **Guards:** `e2e/content.spec.ts` fails if eyebrows, kickers or monospace type come back. `tools/check_site.py` fails on common AI-tell words and on em dashes.

## AI tells found and fixed

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

## Expert panel (copy-editing skill)

Scores for the home page after edits, out of 10:

| reviewer | score | note |
| --- | --- | --- |
| Conversion copywriter | 8 | One clear action, repeated three times, with the vendor named next to it. |
| UX writer | 8 | Short paragraphs. Headings say what each section is about without a label above them. |
| Target reader (operations manager at a college) | 8 | Recognises complaints, catering and HR requests from their own work, and knows where a demo request goes. |
| Brand strategist | 8 | One voice throughout. The partner role is clear without dominating. |

## Still open

- No customer quotes or numbers exist, so the copy has no social proof. That is on purpose: none have been invented.
- If Swiftpro confirms more facts (for example UK hosting or mobile use), add them to `claims.md` first, then to the copy.
