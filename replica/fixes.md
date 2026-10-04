# Fixes and angle

> **Not used on the redesigned site.** This research into what users of other tools dislike shaped the first build's angle. The redesign makes no competitor comparisons; it is kept as background only.

From `feedback.md`. Read 2026-10-04.

## The sample, honestly

- **453 rows collected**, from three public sources through the official feeds
  replica-entrepreneur allows (`collect_feedback.py`):
  - Apple App Store (UK), newest reviews of the Jira Cloud iOS app (117) and
    the Trello iOS app (100). Unfiltered, star-rated, 2016 to 2026.
  - Hacker News comments since January 2024 (236), found by **keyword search**
    ("jira slow", "trello limited", ...).
- Many keyword hits were off-topic, so the ranking uses a **relevance filter**:
  an HN comment counts only if one sentence names Jira, Trello, Atlassian or
  story points *and* a complaint word. That leaves **314 rows** (97 HN).
  The unfiltered file is kept (`reviews.csv`), the filtered one is
  `reviews.relevant.csv`.
- **Bias to keep in mind.** HN counts partly mirror the search terms. The App
  Store sample is about the mobile apps, so bugs and log-in failures dominate
  it. Neither is a survey of all users. Counts below are what this sample
  shows, nothing more.
- These are research. **No quote goes on the brochure**, and the leaders'
  names stay off it.

## 1. What they hate

| # | problem | reviews | sources | linked quotes |
| --- | --- | --- | --- | --- |
| 1 | Too complex: configuration, admin and bloat | 58 | 3 | "Over-configured Jira is so much worse because it only gets slower the more configuration happens" https://news.ycombinator.com/item?id=41661581 · "Settings are scattered all over the place, no logical flow, complex inter-relations hidden in a maze of menus" (Jira iOS, 2*) https://itunes.apple.com/gb/review?id=1006972087&type=Purple%20Software |
| 2 | Bugs and crashes | 43 | 3 | mostly mobile-app reviews ("So buggy!", Trello iOS, 1*). Not a positioning point: nothing on the brochure can honestly claim fewer bugs. |
| 3 | Log-in, access and permissions | 30 | 3 | mostly "can't log in" mobile reviews. Not a positioning point. |
| 4 | Slow and heavy | 26 | 3 | "why is Jira so painfully slow? Even changing the type of a ticket or moving it takes like 20 clicks and a minute" https://news.ycombinator.com/item?id=48439688 |
| 5 | Metrics used to police teams | 29 | 2 | "put a stop to any destructive practices like evaluating teams against their velocity" https://news.ycombinator.com/item?id=40982983 · "as a measure of engineering productivity, story points/feature count/Jira are pretty much garbage" https://news.ycombinator.com/item?id=43290759 |
| 6 | Confusing or clunky | 22 | 3 | mobile layout complaints |
| 7 | Process overhead and micromanagement (**thin**: one source) | 22 | 1 | "top-down, upfront planned micromanagement via tools such as Jira" https://news.ycombinator.com/item?id=39407915 · "a nightmare of bureaucracy with jira tickets and meetings and reviews" https://news.ycombinator.com/item?id=48761828 |
| 8 | Price, per-seat costs and paywalls | 18 | 3 | "the number of power ups one has to pay for on an app where I believe they should be inclusive of the subscription" (Trello iOS) https://itunes.apple.com/gb/review?id=461504587&type=Purple%20Software |
| 9 | No clear overview or reporting | 17 | 3 | "Jira's job is to report metrics to management" https://news.ycombinator.com/item?id=47463297 |
| 10 | Simple boards run out of road | 11 | 3 | "Far too limited for scrum" (Jira iOS, 2018) https://itunes.apple.com/gb/review?id=1006972087&type=Purple%20Software · "many automations that work fine on a MacBook don't work on my iPad" (Trello iOS) https://itunes.apple.com/gb/review?id=461504587&type=Purple%20Software |

## 2. What is missing

Requests in the sample are almost all about the leaders' **mobile apps**
(timeline view on mobile, sub-tasks, filters, widgets, offline). The one
that generalises: people want to work from a phone without losing the board
(31 reviews, 3 sources).

## 3. What is unsolved

- **One tool for two kinds of work** (thin). Several on-topic comments
  describe operational or non-engineering work forced into developer
  trackers, or a plain Kanban board preferred over "dogmatic Agile":
  "having just a Kanban board as the single source of truth was both more useful and way less stressful than dogmatic Agile"
  https://news.ycombinator.com/item?id=41618643. Fewer than 10 rows: thin.
- **Oversight without surveillance** (from themes 5, 7, 9 together). Leaders
  want progress; teams resent being measured through the tool. 68 rows across
  the three themes, mostly HN.

## Brochure emphasis plan

This is a brochure, not a build, so "fixes" become **what the brochure
leads with**. Each line pairs a pain with a property the ZedX sources
already state (IDs from `claims.md`). Nothing here claims ZedX beats any
named product.

| pain | ZedX property (claim) | where the brochure says it |
| --- | --- | --- |
| Too complex | Agile Sprints is built to avoid unnecessary process and governance overhead (A14); apps come preconfigured per sector (P8); Group WorkStreams is simply a board per function (W1, W2) | index problem section, both heroes |
| Metrics used to police | Metrics are meant to help teams learn, not to enforce control (A10) | Agile Sprints "metrics that teach" section |
| Micromanagement / reporting | Project Portfolios gets periodic summaries, not task-level detail (A13, W4); progress and stand-up reporting built in (A6, A7) | index "Better together", Agile Sprints |
| One tool for two kinds of work | Kanban for operational work, Scrum for delivery, run side by side (W3, W5) on one platform with one login (P1) | index hero and chooser |
| Price and per-seat | Licence one app or all; per user, 10 or 100 user packs, or unlimited users on your own server or Azure (P5, P6) | index licensing section |
| Phone use | Fully usable in a mobile browser (P14) | index platform tiles |
| Bugs, log-in failures, speed | none claimed | not used |

## The angle

Three options, each grounded in a theme above:

```
A. For organisations whose operational teams and delivery teams work in
   different ways, ZedX gives each the board it needs (Kanban workflows in
   Group WorkStreams, Scrum in Agile Sprints) on one platform with one login,
   and keeps leaders informed through summaries instead of task-level policing.
   Evidence: complexity (58 reviews, 3 sources), simple boards running out of
   road (11, 3), metrics and micromanagement (51 rows, mostly one source).

B. For public-sector and education teams who find developer-grade trackers too
   heavy, ZedX offers boards preconfigured for their sector, with Entra ID
   sign-in and UK data hosting.
   Evidence: complexity theme only. No sector-specific reviews in the sample:
   the sector half of this angle is ZedX's own positioning, not user evidence.

C. For teams tired of being measured by their tools: sprint metrics that help
   teams learn, not police them.
   Evidence: metrics (29 reviews, 2 sources, mostly HN). Narrow.
```

**Recommended: A.** It is the only one that uses what makes this pair
different (two apps, two ways of working, one platform) and it rests on the
strongest theme. C becomes a section on the Agile Sprints page; B's sector
and hosting facts support A in the platform section.

Hero line that follows from A: **"Kanban for the everyday. Scrum for
delivery. One platform for both."**
