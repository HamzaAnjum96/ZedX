# ZedX boards brochure: Group WorkStreams & Agile Sprints

A GitHub Pages brochure for the two board-based apps on the
[ZedX Apps Platform](https://www.zedxapps.com/index.html):

- **Group WorkStreams**: a Kanban workflow for each function of an organisation.
- **Agile Sprints**: Scrum delivery with backlog, sprints, releases, velocity and automated stand-up reporting.

Three pages with working illustrations (move cards on a sample board, run
a sample sprint and watch the burndown and stand-up update), a "which app
fits" chooser, and a four-page PDF brochure.

**Address once Pages is on:** https://hamzaanjum96.github.io/ZedX/

## Switch on GitHub Pages (one time)

1. In this repository: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
2. **Actions > Brochure site > Run workflow** (or push any commit to the default branch).

Until step 1 is done, the deploy job skips with a notice rather than
failing. If you prefer not to use Actions: Source "Deploy from a branch",
branch `ccr-ab1de275-d2wjpb` (or `main` once merged), folder `/docs`.

## What is in `docs/` (the site)

| file | what |
| --- | --- |
| `index.html` | both apps, the problem they answer, the chooser, a comparison, how they feed Project Portfolios, platform, editions, licensing, FAQ |
| `workstreams.html` | Group WorkStreams: interactive board with four sample workstreams, how it works, ideas by sector |
| `agile-sprints.html` | Agile Sprints: a runnable sample sprint, backlog, velocity, releases, the approach to metrics |
| `brochure.html`, `brochure.pdf` | the print layout and the PDF made from it (A4, 4 pages, tagged) |
| `404.html` | shown by GitHub Pages for any missing address |
| `assets/` | `css/tokens.css` (generated), `css/site.css`, `css/brochure.css`, `js/` (no frameworks), self-hosted fonts and icons, favicon, social card |

No build step and no third-party requests: the files are the site.

## Preview locally

```bash
node tools/serve.mjs          # http://localhost:4173/ZedX/ (same paths and 404 behaviour as GitHub Pages)
```

## Change things

| to change | edit | then |
| --- | --- | --- |
| words on a page | the page in `docs/` (header and footer are repeated in each page: change all of them) | `python3 tools/check_site.py docs` |
| colours, type, spacing | `replica/design/tokens.json` | `python3 tools/build_tokens.py` and `python3 .claude/skills/replica-design/contrast.py replica/design/tokens.json` |
| sample boards and sprint | `docs/assets/js/workstreams-demo.js`, `docs/assets/js/sprint-demo.js` | `npm test` |
| the PDF, social card, touch icon | `docs/brochure.html`, `tools/og-template.html` | `npm run pdf` |
| "Book a demo" target | links to `https://www.zedxapps.com/index.html#formContact` in every page | search and replace |

Using official ZedX assets? The header mark is an original glyph, not the
ZedX logo, and every board and chart is an illustration with invented
sample data (the pages say so). If you own the official logo and product
screenshots you can swap them in.

## Checks and tests

```bash
python3 tools/check_site.py docs   # links, anchors, icons, titles, descriptions (no installs)
npm install && npm test            # Playwright + axe: 92 tests at 1440px and 390px
```

GitHub Actions runs both on every push (`.github/workflows/pages.yml`) and
publishes from the default branch.

## Before you promote it

- **Read `replica/claims.md` once.** Every product statement on the site
  traces to a public source with a confidence level. One is a reading rather
  than a quote (W6: each workstream has its own stages): please confirm it.
- **Prices are deliberately left off.** The only public figures are G-Cloud
  14 prices from May 2024 (`replica/launch/pricing.md`); the site asks for a
  quote instead.
- **Check it is yours to publish.** The site presents Swiftpro's products
  under their own names and sends every call to action to the official ZedX
  site and login. Make sure Swiftpro is happy for it to go out.

## How it was made

Planned and built with the [Replica skill pack](https://github.com/Jakeschincariol/replica-skill)
(MIT), installed in `.claude/skills/`. Replica is made for cloning apps;
here it was used for a brochure of the real products, so the clean-room
rules applied to the brochure itself (no copied text, images, logos or code)
and the rebrand step did not.

| step | skill | output |
| --- | --- | --- |
| map the two apps from public sources | replica-recon | `replica/recon.md`, `features.csv`, `claims.md` |
| design system and contrast gate | replica-design | `replica/design/tokens.json`, `components.md`, `docs/assets/css/` |
| what users of the category leaders dislike (453 public rows, official feeds only) | replica-entrepreneur | `replica/reviews.csv`, `feedback.md`, `fixes.md` (the angle) |
| copy deck, voice and pricing research | replica-launch, replica-brand (voice only) | `replica/launch/landing.md`, `pricing.md` |
| build | replica-build | `docs/` |
| tests and bug log | replica-test | `e2e/`, `replica/test-plan.md`, `bugs.md` |
| coverage of the product's features | replica-diff | `replica/parity.md` (94.8, all must-haves) |
| preflight and publishing | replica-deploy | `replica/deploy.md`, `.github/workflows/pages.yml` |

## Repository layout

```
docs/                 the site (published)
e2e/                  Playwright specs
tools/                serve.mjs, check_site.py, build_tokens.py, build_pdf.mjs, og-template.html
replica/              research, plans and reports behind the site
.claude/skills/       the Replica skill pack
.github/workflows/    checks, tests and Pages deployment
```

## Credits and licences

- Fonts: [Outfit](https://github.com/Outfitio/Outfit-Fonts) and [Inter](https://github.com/rsms/inter), SIL Open Font License (`docs/assets/fonts/OFL-*.txt`).
- Icons: [Lucide](https://lucide.dev), ISC License (`docs/assets/img/LICENSE-lucide.txt`).
- Replica skill pack: MIT, Jake Schincariol (`.claude/skills/REPLICA-LICENSE`).
- ZedX, ZedX Apps, Group WorkStreams, Agile Sprints and Project Portfolios are products of Swiftpro Corporation Ltd.
