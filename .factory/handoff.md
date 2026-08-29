# Invoice Handoff Sheet — independent verification 6 handoff

## Outcome

**FAIL — candidate `72e0b3a0000bc8563f8783393f622152e0172626` is not
release-ready at https://invoice-handoff-sheet.sociobot.in.**

Production byte-matches the candidate, all 15 declared claim commands pass,
both local and live suites pass 38/38, and the production build succeeds.
Release remains blocked by fresh product findings outside the existing suite.

Full report: `.factory/verification-6.md`.

## Release blockers

1. At 1280 × 720 the **Try it with sample data** action starts below the first
   viewport; at 1366 × 768 it is clipped. This fails the mandatory first-screen
   gate. Evidence: `.factory/evidence/verification-6/live-first-read-fail-1280x720.png`.
2. Due-state calculation parses date-only values as UTC. At 19:00 PDT on the
   selected due date, the live sheet says **1 days overdue**. In UTC+14 it says
   **Due in 1 days** during the local due day. Evidence:
   `.factory/evidence/verification-6/live-due-date-timezone-defect-mobile.png`.
3. The live **Print or save PDF** capability has no entry in
   `.factory/claims.json` and no matching `@claim` test, violating the supplied
   claims contract.

Additional P2 findings: CSV export leaves formula-leading `=`, `+`, `-`, and
`@` cell values active, and required fields are not consistently marked or
explained.

## Verification completed

- `npm ci`: PASS; 23 packages, 0 audit vulnerabilities.
- Every exact `.factory/claims.json` command: PASS, 15/15.
- `npm test`: PASS, 38/38.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; `dist/` produced.
- `CI=1 npm run test:live`: PASS, 38/38.
- Live/candidate identity: all 14 public build files byte-match.
- Unknown route: HTTP 404 and body matches `dist/404.html`.
- Independent create/edit/reload/export/delete/Undo flow: PASS.
- Invalid email/currency/negative amount/proof URL/follow-up recovery: PASS.
- Privacy: same-origin requests only; no analytics, CDN, console, or page
  errors on normal routes.
- Accessibility: 24 live Axe route/theme/viewport scans found zero
  serious/critical issues; keyboard, focus, 44 px targets, 390 px reflow, and
  reduced motion pass.
- PWA: service-worker update and complete offline demo reload pass.
- Lighthouse mobile: performance 98, accessibility 100, best practices 100,
  SEO 100; LCP 1.2 s, CLS 0, total blocking time 160 ms, transfer 72 KiB.

## Reproduce

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
CI=1 npm run test:live
```

The timezone failure reproduces with a handoff due `2026-08-29` in
America/Los_Angeles at `2026-08-30T02:00:00Z` (local Aug 29, 19:00): the UI
reports it one day overdue.

## Applicability and known measurement gap

This is a static local-first product with no backend endpoint, paid unlock,
sign-in, package/CLI, or runtime AI. Rate-limit, Entra, consumer-package, and
backend checks do not apply. Field INP is unavailable from the lab run.
