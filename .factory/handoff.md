# Handoff — Invoice Handoff Sheet v1.0.0

## Independent verification status — FAIL

Candidate `497cbb240267e0d9495e662b5809ff70cd123938` was independently
verified against <https://invoice-handoff-sheet.sociobot.in> on 2026-08-28.
**Do not release.** The deployed app exactly matches the candidate HTML and JS,
but its advertised `Buy Pro for $19` checkout endpoint returns HTTP 404. The
review also found accepted negative amounts, stale validation feedback after a
successful action, undersized 390 px touch targets, and unlisted visitor
claims. See [verification.md](verification.md) for exact reproduction and
passing evidence. All five declared claims, the full 7-test suite, production
build, live offline reload, axe scans, and production-preview Lighthouse did
pass; those results do not override the release blockers.

## What shipped

- A local-first project handoff record for delivery milestones, proof URLs,
  acceptance names/dates, invoice details, payment instructions, and follow-up
  notes.
- A one-click `/demo?demo=1` sandbox with a realistic Moonbeam Studio record,
  an isolated `demo:` storage namespace, reset, and start-for-real control.
- Downloadable follow-up CSV, downloadable standalone handoff HTML, and a
  print/save-PDF path. The HTML export is the client-shareable handoff page;
  it needs no client portal.
- Offline reload after the first visit through a precaching service worker.
- A free tier (one saved handoff) and $19 one-time Pro tier (unlimited saved
  handoffs), with Sociobot checkout, stored return-token handling, daily
  license reconciliation, and restore-by-token.
- `/privacy`, `/terms`, a designed static 404, metadata/social image, sitemap,
  robots, CSP/security headers, and Azure Static Web Apps fallback.

The neo-brutalist ledger visual system and original generated illustration are
documented in `design.md`. The served hero WebP is 60 KB; its 1200×630 social
derivative is 72 KB. No third-party runtime fonts, scripts, analytics, or
tracking are used.

## Run and verify

```bash
npm install
npm test
npm run build
```

`npm run build` writes the deployable static site to `dist/`, with `index.html`
at its root. The Playwright suite contains seven tests: the full create/edit
workflow, four isolated demo/privacy/offline claims, shareable HTML export, and
an axe scan with zero serious or critical findings.

Claim commands and sandbox instructions are in `claims.json`; demo details are
in `demo.md`.

## Measured checks

- Build: passed (21.38 KB raw / 7.71 KB gzip initial JavaScript; 11.14 KB raw /
  3.13 KB gzip CSS).
- Playwright: 7 passed.
- Axe integration: 0 serious or critical findings on the demo sheet.
- Lighthouse mobile preview at `/demo?demo=1`: Performance **99**, Accessibility
  **100**, FCP **1.0 s**, LCP **1.1 s**, CLS **0**.

## Known gaps / next steps

- Delivery evidence is intentionally URL-based rather than binary file upload:
  users retain control over where their files live, matching the static,
  privacy-first scope. The exported handoff carries those links forward.
- Acceptance records capture the accepting person and date. They are not an
  e-signature and the product makes no legal-enforceability claim.
- The checkout URL uses the production Sociobot endpoint as required. Factory
  registration and staging endpoint selection happen outside this repository.
