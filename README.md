# Group WorkStreams & Agile Sprints: independent promotional site

A GitHub Pages site promoting two ZedX apps. Both come from Swiftpro
Corporation Ltd; this site is run by an independent promotional partner, not
by Swiftpro.

- **Group WorkStreams:** continuous operational work, organised as workflows on Kanban boards.
- **Agile Sprints:** planned Scrum delivery, organised through backlogs and sprints.
- **Project Portfolios** appears in a supporting role, as the place where leadership follows delivery through periodic updates.

**Live:** https://hamzaanjum96.github.io/ZedX/

Every screenshot is a real screen from the public ZedX demo, cropped to one
contiguous area, and every product claim traces to an official ZedX page.

The site is a work in progress. Every page and the brochure say so in a notice
at the top; `DEVELOPER-NOTES.md` explains how to remove it.

## What is in `docs/` (the published site)

| file | what |
| --- | --- |
| `index.html` | both apps, comparison, leadership reporting, adoption (sign-in, hosting, integration, licensing), FAQ |
| `workstreams.html`, `agile-sprints.html` | one page per app, built around its screens |
| `brochure.html`, `brochure.pdf` | print layout and the 4-page A4 PDF made from it |
| `legal.html`, `privacy.html` | legal notice (who runs the site, how far to rely on it, who owns the names) and privacy policy |
| `404.html` | shown by GitHub Pages for any missing address |
| `assets/` | `css/tokens.css` (generated), `css/site.css`, `css/brochure.css`, `js/site.js` (menu and screenshot viewer), IBM Plex fonts, icons, screenshots, favicon, social card |

## Read next

- **[BRAND.md](BRAND.md):** tokens, typography, composition, components and voice.
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
```

GitHub Actions (`.github/workflows/pages.yml`) runs the checks and tests on
every push and publishes `docs/` from the default branch.

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
and the before-and-after audit is in `replica/copy-review.md`.

Files under `replica/` from the first build that describe the earlier site are
kept for history and marked as superseded:

- `fixes.md`
- `feedback.md`
- `launch/landing.md`
- `parity.md`
- `design/components.md`

## Credits and licences

- Font: [IBM Plex Sans](https://github.com/IBM/plex), SIL Open Font License (`docs/assets/fonts/OFL-IBM-Plex-Sans.txt`).
- Copywriting skills: `copywriting` and `copy-editing` from [marketingskills](https://github.com/coreyhaines31/marketingskills), MIT, Corey Haines (`.claude/skills/MARKETINGSKILLS-LICENSE`).
- Icons: [Lucide](https://lucide.dev), ISC License (`docs/assets/img/LICENSE-lucide.txt`).
- Replica skill pack: MIT, Jake Schincariol (`.claude/skills/REPLICA-LICENSE`).
- ZedX, ZedX Apps, Group WorkStreams, Agile Sprints and Project Portfolios are products of Swiftpro Corporation Ltd. Screenshots show the ZedX demo environment with its sample data.
