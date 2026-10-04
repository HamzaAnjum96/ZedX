# Deploy checklist: Group WorkStreams + Agile Sprints brochure

Date: 2026-10-04  Commit: see `git log -1`  Go from user: yes ("Plan and build. Push as you go. Don't ask me.")

Host: **GitHub Pages**, published by GitHub Actions from `docs/` on the
default branch (`.github/workflows/pages.yml`). No build step: the files in
`docs/` are the site.

## Preflight (all must pass)

- [x] e2e suite green: **87 passed, 5 skipped by design** (`npm test`, see `test-plan.md`)
- [x] no open S1 or S2 bugs (`bugs.md`: BUG-003, the only S2, is fixed)
- [x] coverage: all must-haves presented (22 of 22), score 94.8 (`parity.md`)
- [x] name sweep clean: `sweep.py docs --avoid "Jira,Trello,Atlassian"` exits 0. The usual rebrand sweep does not apply: this brochure presents the products under their own names.
- [ ] store listing: not applicable (web platform, no app store listing)
- [x] production build: none needed; `python3 tools/check_site.py docs` passes (links, anchors, icons, titles, descriptions, one h1 per page)
- [x] contrast: `contrast.py replica/design/tokens.json`, 0 AA failures
- [x] privacy: the site sets no cookies, loads nothing from third parties (fonts and icons are self-hosted) and has no forms. Every call to action goes to the official ZedX site or login.
- [ ] account deletion: not applicable (no accounts)
- [x] favicon, titles, OG image are original artwork, not the ZedX logo

## Production

- [x] workflow: `check` (site checks) on every push and pull request; `e2e` (Playwright + axe) after it; `deploy` on the default branch only
- [x] deploy skips with a notice, instead of failing, until Pages is switched on
- [ ] **switch Pages on (one time, by the repository owner):** Settings > Pages > Build and deployment > Source: **GitHub Actions**. Then Actions > Brochure site > Run workflow.
- Expected address: **https://hamzaanjum96.github.io/ZedX/**

Alternative without Actions: Settings > Pages > Deploy from a branch >
`ccr-ab1de275-d2wjpb` (or `main` once merged) > folder `/docs`. `docs/.nojekyll`
is already there.

## Domain (optional)

To serve it from a subdomain such as `boards.example.com`:

| record | name | value |
| --- | --- | --- |
| CNAME | boards | hamzaanjum96.github.io |

Then Settings > Pages > Custom domain, tick Enforce HTTPS, and update:
the `canonical` and `og:` URLs in the four pages, and `<base href="/ZedX/">`
in `docs/404.html` to `<base href="/">`.

## Watch

- [x] every push runs the checks and the e2e suite; failures keep a Playwright report for 7 days
- [ ] analytics: none on purpose (no cookies, nothing to consent to). If wanted later, use a cookieless, privacy-friendly service and update the footer line "collects no data".
- [ ] before promoting the site, someone at Swiftpro reads `claims.md` once (every product statement with its source and confidence)
