# Deploy checklist: independent promotional site

- **Date:** 2026-10-08.
- **Commit:** see `git log -1`.
- **Go-ahead from the site owner:** yes. The redesign brief ended "Go", and later changes were asked to go straight to `main`.

**Host:** GitHub Pages. GitHub Actions publishes `docs/` from the default
branch (`main`) using `.github/workflows/pages.yml`. There is no build step:
the files in `docs/` are the site.

**Live:** https://hamzaanjum96.github.io/ZedX/ (returns 200). Work is done on
`ccr-ab1de275-d2wjpb` and pushed to `main` as a fast-forward; each push to
`main` deploys.

## Preflight (all must pass)

- [x] **Static checks:** `python3 tools/check_site.py docs` passes. It covers:
  - links, anchors, icons, `srcset` and viewer images;
  - alt text and dimensions;
  - one H1 per page;
  - banned copy.
- [x] **Tokens:** `python3 tools/build_tokens.py --check` reports `tokens.css` up to date.
- [x] **Contrast:** `contrast.py replica/design/tokens.json` reports 27 pairs, 0 AA failures.
- [x] **e2e suite:** 275 passed, 1 skipped by design, at 1440, 768 and 390px (see `test-plan.md`).
- [x] **Open bugs:** none at S1 or S2 (`bugs.md`; BUG-005 to BUG-007 are fixed).
- [x] **Claims:** every published claim is in `claims.md`, re-checked against zedxapps.com on 8 October 2026 after Swiftpro's site update. `tools/check_sources.py` finds every supporting phrase. Items needing Swiftpro's confirmation are listed in `DEVELOPER-NOTES.md`.
- [x] **Attribution:**
  - "Independent promotional site" appears in the header of every page.
  - Our role is stated in the hero, the FAQ and the footer.
  - No invented logo, partner name or badge is used.
- [x] **Destinations:**
  - "Request a demo" opens `https://www.zedxapps.com/index.html#formContact`; the form is present.
  - "Try the demo yourself" opens `https://demo.zedx.net/` (200), the demo Swiftpro promotes on its home and login pages.
  - Login goes to `https://zedx.net/` (200).
- [x] **Privacy:**
  - No cookies or web storage.
  - No third-party requests: fonts, icons and images are self-hosted.
  - No forms.
  - `privacy.html` says all of this, and that GitHub Pages logs visitor IP addresses. The e2e suite checks the promises on every page.
- [x] **Work in progress:** every page opens with the notice that the content is not complete and may not be correct, and the brochure cover carries it too. The legal notice says the same.
- [x] **Favicon, titles and social card:**
  - The favicon is a neutral navy and cyan mark, not a logo.
  - The social card uses real demo screens.

## Production

- [x] **Workflow:**
  - `check` runs on every push and pull request.
  - `e2e` (Playwright and axe) runs after it.
  - `deploy` runs on the default branch only.
- [x] **Pages:** switched on (Source: GitHub Actions).

## Domain (optional)

To serve the site from a subdomain such as `boards.example.com`:

| record | name | value |
| --- | --- | --- |
| CNAME | boards | hamzaanjum96.github.io |

1. Go to Settings > Pages > Custom domain and tick Enforce HTTPS.
2. Update the `canonical` and `og:` URLs in the pages.
3. In `docs/404.html`, change `<base href="/ZedX/">` to `<base href="/">`.

## Watch

- [ ] **Before promoting:** someone at Swiftpro reads `replica/claims.md` and the open questions in `DEVELOPER-NOTES.md`. Those cover UK data residency, mobile support, Power BI, export formats, SaaS hosting, the free-trial sign-up and logos.
- [ ] **Official sources:** the weekly "Official sources" workflow fails when a page on zedxapps.com changes. Re-read the page it names, then update `claims.md` and the copy.
- [ ] **Partner name:** when the promotional partner's verified name exists, add it to the footer attribution and the legal notice.
- [ ] **Legal pages:** add a contact address and governing law, and have both pages reviewed (see `DEVELOPER-NOTES.md`).
- [ ] **Work-in-progress notice:** remove it once the content has been checked (steps in `DEVELOPER-NOTES.md`).
- [ ] **Screenshots:** if the demo changes, recapture with `npm run screens`, check each crop, then run `npm test`.
