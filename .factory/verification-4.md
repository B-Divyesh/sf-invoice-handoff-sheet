# Independent verification 4 — PASS

**Candidate commit:** `9304b50db593186c406f6b8abbf43de1678da538`  
**Live URL:** https://invoice-handoff-sheet.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Artifact:** static-web (Vite + TypeScript; browser-local storage and service worker)

## Release decision

**PASS.** Fresh local and live evidence does not reproduce a deployment-only
failure. The deployed public artifact byte-matches a production build at the
candidate commit. The product fulfils the researched job: a freelancer or
small agency can keep delivery proof, acceptance, invoice details, payment
instructions, and follow-ups in one client handoff record, then export it.

## First read and one-click demo

**PASS.** A cold live visit stated, in plain words:

- **What it does:** “Record work before chasing payment.”
- **Who it is for:** “For freelancers and small agencies who need delivery
  proof, invoice details, and follow-ups in one record.”
- **What to do first:** “Try it with sample data”; adjacent copy says “Opens a
  finished client handoff.”

The primary action was visible on the initial 1440 × 900 screen. One click
opened `/demo?demo=1` with the persistent **DEMO** banner, a Reset demo button,
a Start for real button, Moonbeam Studio website launch, two delivery records,
invoice `MB-042`, and one follow-up. The first screen also gives the three
plain facts: saved in this browser, works offline after first visit, and free
to use.

## Required claims gate

`.factory/claims.json` exists. From this clean candidate checkout, `npm ci`
installed 23 locked packages (0 audit vulnerabilities), then every exact
declared command ran against the shipped demo entry point. All 13 passed; each
tag has one observable Playwright test.

| Claim ID | Exact command result |
| --- | --- |
| `csv-export` | `npm test -- --grep @claim:csv-export` — PASS |
| `shareable-html` | `npm test -- --grep @claim:shareable-html` — PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` — PASS |
| `local-storage` | `npm test -- --grep @claim:local-storage` — PASS |
| `private-demo` | `npm test -- --grep @claim:private-demo` — PASS |
| `no-runtime-tracking` | `npm test -- --grep @claim:no-runtime-tracking` — PASS |
| `local-first-real` | `npm test -- --grep @claim:local-first-real` — PASS |
| `unlimited-handoffs` | `npm test -- --grep @claim:unlimited-handoffs` — PASS |
| `safe-proof-links` | `npm test -- --grep @claim:safe-proof-links` — PASS |
| `delete-handoff` | `npm test -- --grep @claim:delete-handoff` — PASS |
| `demo-populated-sheet` | `npm test -- --grep @claim:demo-populated-sheet` — PASS |
| `complete-handoff-record` | `npm test -- --grep @claim:complete-handoff-record` — PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` — PASS |

The landing, demo, privacy page, and README were cross-checked against the
claims file. Visitor-reliance statements about exports, local storage, demo
isolation, offline use, no analytics/runtime CDNs, and unlimited free records
are all covered by a listed claim.

## Local quality gates

- `npm test`: **PASS**, 35 Playwright tests; final
  `test-results/.last-run.json` reports `status: "passed"` and no failed tests.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run typecheck`: **PASS**.
- `npm run build`: **PASS**; Vite 6.4.3 produced `dist/`.
- Production output: JS 25.36 kB raw / 8.68 kB gzip; CSS 12.11 kB raw / 3.34
  kB gzip; hero WebP 59,652 bytes. These are within the applicable static-web
  budgets.

## Live end-to-end, privacy, and security checks

In a fresh live context, I created a real handoff for Harbor Works with a zero
amount, due date, payment instruction, delivery proof, and follow-up. It
saved, reloaded, and restored the record with one delivery and one follow-up.
The CSV export downloaded as `QA-9304-follow-ups.csv`.

Boundary and recovery paths passed: a negative amount was rejected with “Amount
due cannot be negative. Enter zero or a positive amount.”; a `javascript:`
proof link was rejected; a valid HTTPS proof link saved; an empty follow-up
gave clear corrective guidance; a corrected follow-up saved. The normal UI
offers a standalone handoff HTML download, and its dedicated claim test passed.

For both the demo flow and the complete real-record flow, the live Playwright
request log contained only `https://invoice-handoff-sheet.sociobot.in`. There
were no analytics, tracker, API, sign-in, billing, or runtime-CDN requests.
The real context stored only `invoice-handoff-sheet:sheets`; the demo showed
its separate demo banner and namespace. This confirms the stated local-first
privacy behaviour from browser-observable evidence.

Live response headers include HSTS, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP with
`frame-ancestors 'none'`. HTML and `sw.js` use `public, must-revalidate,
max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`.

This static product has no server-side product endpoint, authentication, or
product-unlock call. A rate-limit allowance/429 test and Microsoft Entra tenant
check are therefore not applicable.

## Accessibility, responsive, offline, and performance checks

- `/opt/fleet/lib/verify-url.sh` against the live root: **PASS** in 586 ms;
  title, `lang=en`, one H1, main landmark, image alt text, and labelled buttons
  were present, with no console/page errors.
- Four independent live Axe scans (light/dark × desktop/390 px landing or demo)
  reported **0 total violations**, including **0 serious/critical** findings.
- Desktop and 390 px mobile widths exactly matched the viewport with no
  horizontal overflow. Keyboard Tab reached “Skip to sheet” with a 3 px solid
  focus outline; Enter moved focus to the H1.
- Under `prefers-reduced-motion: reduce`, no active animations or transitions
  remained. After service-worker control on `/demo?demo=1`, an offline reload
  retained the Moonbeam sheet and demo banner without errors.
- `/`, `/demo?demo=1`, `/app`, `/privacy`, `/terms`, and both sample proof pages
  returned 200 with one H1. An unknown route returned the styled 404 with one
  H1.
- Fresh live Lighthouse: Performance **96**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 230 ms, and
  72 KiB total transfer.

## Deployment identity

The live root referenced the exact candidate hashes
`assets/index-CryDVHcA.js` and `assets/index-BFwO4_za.css`. SHA-256 comparisons
matched all 14 publicly served candidate build artifacts: index/404 documents,
CSS, JS, service worker, images, icons, robots, sitemap, and both sample proof
pages. `staticwebapp.config.json` is a deployment input and correctly returns
404 when requested publicly. The live deployment therefore matches the
candidate build.

## Defects by severity

No P0, P1, P2, or P3 defects found. No release blockers remain.

## Re-run

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Use `https://invoice-handoff-sheet.sociobot.in/demo?demo=1` for the isolated
sample flow.
