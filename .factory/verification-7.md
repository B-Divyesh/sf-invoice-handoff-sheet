# Independent verification 7 — PASS

**Candidate:** `43f717a791cbb7789fb124ddabbbd620563b3b74`  
**Live URL:** https://invoice-handoff-sheet.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Artifact:** Vite + TypeScript static web app; browser-local storage and service worker

## Release decision

**PASS.** Fresh evidence shows that the live deployment matches the candidate's
generated static artifact and the product satisfies the researched job: it lets
freelancers and small agencies keep delivery proof, invoice details, payment
instructions, and follow-ups in one exportable handoff record. The prior
deployment-only concern is not reproducible.

There are **no new release-blocking defects**.

## Required first-read and demo check

Cold live page, 1440 x 900:

> Record work before chasing payment. For freelancers and small agencies who
> need delivery proof, invoice details, and follow-ups in one record. Try it
> with sample data — Opens a finished client handoff.

This plainly answers what it does, who it is for, and what to click first. The
primary action is visible and one click opens `/demo?demo=1` with the persistent
**DEMO** notice, Moonbeam Studio, two delivery records, invoice `MB-042`,
payment instructions, and one follow-up. It also remained visible on 1280 x 720
and 390 x 844; the 390 px page had no horizontal overflow.

## Claims gate

`.factory/claims.json` exists and contains 16 declarations, each with one
matching `@claim:<id>` test. In the raw clean checkout, the commands first
reported `ERR_MODULE_NOT_FOUND` for `@playwright/test`, because dependencies had
not yet been installed. This is the expected uninstalled-checkout prerequisite,
not an application claim result. After the required `npm ci` (23 packages, zero
audit vulnerabilities), I ran every manifest command separately against its
configured demo entry point; all passed. The full local suite independently
re-ran them and passed 42/42.

| Claim ID | Exact declared command | Result |
| --- | --- | --- |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `shareable-html` | `npm test -- --grep @claim:shareable-html` | PASS |
| `print-pdf` | `npm test -- --grep @claim:print-pdf` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `local-storage` | `npm test -- --grep @claim:local-storage` | PASS |
| `private-demo` | `npm test -- --grep @claim:private-demo` | PASS |
| `no-runtime-tracking` | `npm test -- --grep @claim:no-runtime-tracking` | PASS |
| `local-first-real` | `npm test -- --grep @claim:local-first-real` | PASS |
| `unlimited-handoffs` | `npm test -- --grep @claim:unlimited-handoffs` | PASS |
| `safe-proof-links` | `npm test -- --grep @claim:safe-proof-links` | PASS |
| `delete-handoff` | `npm test -- --grep @claim:delete-handoff` | PASS |
| `demo-populated-sheet` | `npm test -- --grep @claim:demo-populated-sheet` | PASS |
| `complete-handoff-record` | `npm test -- --grep @claim:complete-handoff-record` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `demo-exit` | `npm test -- --grep @claim:demo-exit` | PASS |
| `demo-navigation` | `npm test -- --grep @claim:demo-navigation` | PASS |

## Local quality gates

- `npm ci`: PASS — 23 packages installed; `npm audit` reported 0 vulnerabilities.
- `npm test`: PASS — 42/42 Playwright tests in 1.1 minutes.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS (declared TypeScript check).
- `npm run build`: PASS — produced `dist/`.
- Production output: JS 26.38 kB raw / 9.00 kB gzip; CSS 13.00 kB raw /
  3.51 kB gzip; hero WebP 59,652 B. All are within the static-product budgets.

## Independent live checks

- `npm run test:live`: PASS — 42/42 against the live origin in 1.1 minutes.
  This includes desktop/mobile workflows, native validation and recovery,
  exports, delete/Undo, keyboard flow, offline reload, route metadata, and the
  Axe serious/critical matrix in light and dark color schemes.
- The worker `verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1, main
  landmark, no missing image alt attributes, no unlabeled buttons, and no
  console/page errors. Its cold load took 860 ms in this environment.
- Manual 390 x 844 live demo: an invalid `-0.01` amount was rejected with the
  announced message “Amount due cannot be negative. Enter zero or a positive
  amount.” Correcting it and saving a payment instruction persisted across a
  reload. The initial Tab key focused the Skip to sheet link.
- A fresh live service-worker registration had active `/sw.js` and no stale
  waiting worker. After it controlled the page, offline reload retained both
  the Moonbeam sample and Demo controls.
- All discovered same-origin links (app routes, legal pages, sample evidence,
  404, robots, and sitemap) returned HTTP 200, except an intentional unknown
  route which returned the designed HTTP 404.

## Privacy, security, caching, and deployment identity

During cold landing and the complete demo flow, Playwright recorded requests
only to `https://invoice-handoff-sheet.sociobot.in`; there were no analytics,
runtime CDN, API, payment, console-error, or page-error requests. The browser
stored demo data separately from real handoffs, as covered by the claims.

Live headers included a self-only CSP with `frame-ancestors 'none'`, HSTS,
`X-Content-Type-Options: nosniff`, and a strict-origin referrer policy. HTML
was `public, must-revalidate, max-age=30`; hashed JS/CSS were
`public, max-age=31536000, immutable`.

Fresh `dist/` byte comparisons matched all 14 publicly served candidate files:
HTML, JS/CSS, service worker, images, icons, 404, robots, sitemap, and the two
sample proof pages. The product has no server-side endpoint, account,
authentication, payment/unlock, or AI path, so rate-limit, Entra tenant,
consumer-package, and paid-unlock checks are not applicable.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

## Evidence retained during verification

- `/tmp/invoice-local-suite.log` — local suite, exit 0, 42/42.
- `/tmp/invoice-live-suite.log` — live suite, exit 0, 42/42.
- `/tmp/invoice-live-home.png` and `/tmp/invoice-live-demo-mobile.png` — cold
  live desktop and exercised 390 px demo captures.
- `/tmp/invoice-verify-url/verify.json` — basic live accessibility and
  console report.
