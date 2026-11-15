# Group WorkStreams & Agile Sprints: a ZedX referral partner site

A GitHub Pages site introducing two ZedX apps. Both come from Swiftpro
Corporation Ltd; this site is run by a ZedX referral partner, not by Swiftpro.
Demo requests go to Swiftpro's own contact form through one tracked link.

- **Group WorkStreams:** continuous operational work, organised as workflows on Kanban boards.
- **Agile Sprints:** planned Scrum delivery, organised through backlogs and sprints.

**Live:** https://hamzaanjum96.github.io/ZedX/

Every screenshot is a real screen from the public ZedX demo, cropped to one
contiguous area, and every product claim traces to an official ZedX page.

The site is a work in progress. Every page and the brochure say so in a notice
at the top; `DEVELOPER-NOTES.md` explains how to remove it.

## What is in `docs/` (the published site)

| file | what |
| --- | --- |
| `index.html` | both apps, how the work moves (tabs), comparison, editions, access and hosting, FAQ |
| `workstreams.html`, `agile-sprints.html` | one page per app, built around its screens, ending with an FAQ |
| `brochure.html`, `brochure.pdf` | print layout and the 4-page A4 PDF made from it |
| `legal.html`, `privacy.html` | legal notice (who runs the site, how far to rely on it, who owns the names) and privacy policy |
| `404.html` | shown by GitHub Pages for any missing address |
| `assets/` | `css/tokens.css` (generated), `css/site.css`, `css/brochure.css`, `js/site.js` (menu, reveals, tagline, tabs and screenshot viewer), Geist fonts, Phosphor icons, screenshots, favicon, social card |

## Read next

- **[BRAND.md](BRAND.md):** the light "Daylight" identity: tokens, type, motion, composition, components and voice.
- **[DEVELOPER-NOTES.md](DEVELOPER-NOTES.md):**
  - commands and official source URLs;
  - the screenshot-to-app mapping;
  - claims and assets that still need confirming.
- **[replica/claims.md](replica/claims.md):** every published claim with its source.
- **Test notes:**
  - [replica/test-plan.md](replica/test-plan.md) lists what is tested and how;
  - [replica/bugs.md](replica/bugs.md) is the bug log.

## Run and check

```bash
node tools/serve.mjs               # http://localhost:4173/ZedX/ (same paths and 404 as Pages)
python3 tools/check_site.py docs   # links, images, anchors, copy rules (no installs)
npm install && npm test            # Playwright + axe at 1440, 768 and 390 px
npm run pdf                        # rebuild brochure.pdf, social card, touch icon
python3 tools/check_sources.py     # do the official ZedX pages still back every claim?
```

GitHub Actions (`.github/workflows/pages.yml`) runs the checks and tests on
every push and publishes `docs/` from the default branch. A second workflow
(`.github/workflows/sources.yml`) runs `check_sources.py` every Monday, so a
change on zedxapps.com shows up as a failed run.

## How it was made

The site was built with the [Replica skill pack](https://github.com/Jakeschincariol/replica-skill)
(MIT), installed in `.claude/skills/`. Three of its skills were used for the
October 2026 redesign:

- **replica-recon:** sources and the claims register;
- **replica-design:** the token file and contrast gate;
- **replica-test:** the e2e and axe suite, and the bug log format.

The copy was then rewritten with the `copywriting` and `copy-editing` skills
from [marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT),
also in `.claude/skills/`. Their product context is `.claude/product-marketing.md`,
and the before-and-after audit is in `replica/copy-review.md`. All of the text
was rewritten again in November 2026, after Swiftpro's second update to
zedxapps.com (new Editions and Demo/Trial pages, modules tables and FAQs).

The November 2026 redesign used the `landing-page-design` skill from
[ai-design-skills](https://github.com/elayadesign/ai-design-skills) (MIT),
vendored in `.claude/skills/landing-page-design/`: Geist type on a named
scale, one easing curve, scroll reveals, a floating header and a light theme
close to the official ZedX site. Project Portfolios left the site's scope at
the same time.

Files under `replica/` from the first build that describe the earlier site are
kept for history and marked as superseded:

- `fixes.md`
- `feedback.md`
- `launch/landing.md`
- `parity.md`
- `design/components.md`

## Credits and licences

- Font: [Geist](https://vercel.com/font), SIL Open Font License (`docs/assets/fonts/OFL-Geist.txt`).
- Design skill: `landing-page-design` from [ai-design-skills](https://github.com/elayadesign/ai-design-skills), MIT, Elaya (`.claude/skills/AI-DESIGN-SKILLS-LICENSE`).
- Copywriting skills: `copywriting` and `copy-editing` from [marketingskills](https://github.com/coreyhaines31/marketingskills), MIT, Corey Haines (`.claude/skills/MARKETINGSKILLS-LICENSE`).
- Icons: [Phosphor](https://phosphoricons.com), MIT License (`docs/assets/img/LICENSE-phosphor.txt`).
- Replica skill pack: MIT, Jake Schincariol (`.claude/skills/REPLICA-LICENSE`).
- ZedX, ZedX Apps, Group WorkStreams and Agile Sprints are products of Swiftpro Corporation Ltd. Screenshots show the ZedX demo environment with its sample data.
