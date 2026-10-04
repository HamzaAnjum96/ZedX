# Landing pages: copy deck

> **Superseded.** The copy deck of the first build. The redesigned site's copy follows [`BRAND.md`](../../BRAND.md) (voice) and [`claims.md`](../claims.md) (sources). It no longer uses the competitor-complaint angle below.

The angle (from `fixes.md`, option A): **each kind of work gets the board it
needs, on one platform, and leaders get summaries instead of task-level
policing.** Every product statement traces to `claims.md`. No proof section:
there are no public customer names, numbers or quotes, and an empty proof
section beats a fake one.

## Voice (replica-brand step 5, voice only)

Three words: **plain, assured, practical.**

- Plain, not dull: short sentences, everyday words, British spelling
  ("organisation", "licence" as a noun, "programme").
- Assured, not boastful: say what it does; no "revolutionary", "seamless",
  "best-in-class", no comparisons with named products.
- Practical, not salesy: talk about the work (onboarding a starter, a sprint
  review), not about "synergy".

| do | don't |
| --- | --- |
| "Give every team its own flow of work." | "Unlock next-generation workflow synergy." |
| "Leaders see progress without opening every task." | "Total visibility into everything your people do." |
| "Ask for a quote." | "Prices from just..." (no confirmed prices) |
| "Illustration with sample data." | Passing an illustration off as a product screenshot |
| "Group WorkStreams" / "Agile Sprints" every time | "GWS", "AS", "the Kanban app" |

## index.html

1. **Hero.** Eyebrow: ZedX Apps Platform · Work management. H1: "Kanban for
   the everyday. Scrum for delivery. One platform for both." Lead: Group
   WorkStreams gives each function its own Kanban workflow; Agile Sprints
   gives delivery teams disciplined Scrum; one login. Buttons: Explore Group
   WorkStreams, Explore Agile Sprints. Note row: one login with Entra ID,
   editions for government / education / business, UK data hosting.
   Illustration: a WorkStreams board and a sprint panel (burndown + stand-up).
2. **The problem** (dark band): three cards from the top themes, paraphrased:
   too heavy (configuration and admin), too light (boards that run out of
   road), watched rather than helped (metrics and status-chasing). Answer
   panel: the right board for each kind of work, one platform, summaries for
   leaders.
3. **Two apps**: app cards, coral and cyan, four benefits each, arrow links.
4. **Which app fits?** chooser: four questions (how work arrives, time-boxing,
   estimating, who needs to see it). Verdict panel: WorkStreams, Sprints, or
   both. Comparison table "At a glance" below it.
5. **Better together**: diagram, Project Portfolios on top receiving periodic
   summaries from both apps; Risk Registers and Audit Actions beside it.
6. **Platform** (id `platform`): eight tiles: one login, guests, permissions,
   configured for your sector, hosting and UK data, data in and out,
   dashboards and Power BI, any device. Plus integration line.
7. **Sectors**: government, education, business.
8. **Licensing** (id `licensing`): four options, no prices, "Ask for a quote".
9. **FAQ** (id `faq`): use one app only? work together? external people?
   where is data? mobile? configuration? bring existing data? which sectors?
10. **CTA band**: "See both boards on your own work." Book a demo (official
    form) + Download the brochure (PDF).

## workstreams.html

1. **Hero** (coral): "Give every team its own flow of work." Lead: a workstream
   for each function, each a Kanban board.
2. **Try the board**: interactive demo, four sample workstreams (staff
   onboarding, IT requests, estates jobs, policy approvals), each with its own
   stages; move cards by drag, buttons or arrow keys; guest card shows
   external collaboration; reset.
3. **How it works**: four steps: set up a workstream per function; lay out the
   stages its work moves through; work the board with colleagues and guests;
   keep leaders informed (Project Portfolios summaries, Excel export).
4. **Ideas for workstreams**: eight examples across government, education and
   business, each with a stage list. Clearly labelled as ideas.
5. **Why Kanban suits operational work**: see the whole flow, spot where work
   waits, finish before starting more. General Kanban practice, not product
   claims.
6. **Works alongside**: Agile Sprints (mixed delivery), Project Portfolios
   (oversight).
7. CTA band.

## agile-sprints.html

1. **Hero** (cyan): "Disciplined sprints, without the admin." Lead: epics,
   stories, sprints and releases in one structured place, with progress and
   stand-up reporting built in.
2. **Run a sprint**: interactive demo: sprint board (To do, In progress, In
   review, Done), capacity meter, burndown that updates live, automated
   stand-up summary, "End the day" button, block toggle, reset.
3. **Plan, run, review, release**: four feature sections with original
   illustrations: backlog with points and capacity cut line; the board and
   stand-ups (links up to the demo); velocity chart (committed vs completed,
   six sample sprints) with carried-over work; release timeline across
   sprints.
4. **Metrics that help teams learn** (dark band): the philosophy line from
   claim A10, plus role-based permissions and epics timeline.
5. **Works alongside**: Project Portfolios, Group WorkStreams.
6. CTA band.

## Calls to action (everywhere)

- **Book a demo** -> https://www.zedxapps.com/index.html#formContact (the
  official form)
- **Log in** -> https://zedx.net/
- **Download the brochure** -> brochure.pdf (generated from brochure.html)

## Store listing

Not applicable: ZedX is a web platform with no app store listing, so
`listing.json` and `listing.py` are skipped.
