# Record delivery, invoice, and payment follow-up — review 5

**Verdict: FAIL.** One medium-severity site-structure finding remains. There are no untested public claims. This report reviews implementation commit 9ba24abfc4ba7f112f4a70ee9028838edf74c1df; the documentation-only tip is f00c694bef423bd06a580c81d51716be61f772e7.

Reviewed 2026-09-06 UTC at https://invoice-handoff-sheet.sociobot.in. No product code was changed.

## First read

Fresh 1440 x 900 and 390 x 844 Chromium contexts were checked before scrolling.

| Check | Desktop | Phone |
| --- | --- | --- |
| Job | “Record work before chasing payment.” | Same |
| Audience | Freelancers and small agencies needing delivery proof, invoice details, and follow-ups in one record. | Same |
| First action | “Try it with sample data.” It opens a finished client handoff. | Same |
| Action position | y=706.94, height=46 | y=567.5, height=47.5 |

The action is fully visible at both sizes. The landing had no console/page errors, made same-origin requests only, and had no 390 px horizontal overflow.

## Finding

### R5-1 — Medium — Sample delivery-proof pages do not use the product shell

The demo's two delivery-proof links lead to these live same-origin pages:

- /sample-proofs/moonbeam-final-preview.html
- /sample-proofs/moonbeam-handover-files.html

Both return HTTP 200 and contain the sample evidence, a title, one H1, and a main landmark. Direct live inspection shows that both omit the required product header/navigation, footer, skip link, product styling, a way back to the handoff, description, canonical link, social metadata, and favicon. They render as raw standalone documents. These are linked product routes used to demonstrate delivery evidence, so the site-structure contract requires the standard shell and route metadata on them. A user who follows a proof link cannot navigate back through the product.

Fix: give both proof pages the Invoice Handoff Sheet shell and a return link, then add required route metadata and a regression test that follows each demo proof link and asserts the standard structure.

## Demo and product workflow

The one-click action opened /demo?demo=1 into a populated Moonbeam Studio website-launch handoff. The persistent banner said “DEMO — Sample data. Nothing is saved to your real sheets.” and provided Reset demo and Start for real. The record contained two delivery milestones, invoice MB-042, payment instructions, and a follow-up log.

On a fresh 390 px context, editing the sample project to “Moonbeam reset probe” and choosing Reset demo restored “Moonbeam Studio website launch.” Real storage was byte-for-byte unchanged. Start for real switched to /app, removed demo:invoice-handoff-sheet:sheets, and left real storage unchanged. The live suite also passed normal creation, invalid negative amount and unsafe proof URL rejection, empty-follow-up recovery, zero-value/date boundaries, CSV/HTML/PDF output, delete confirmation/Undo, and reload persistence.

## Claims and clean-checkout checks

In a fresh clone followed by npm ci (23 packages, zero audit vulnerabilities), all 16 exact commands in .factory/claims.json passed individually. The manifest has 16 claim IDs and the test tree has 16 unique @claim: tags. Untested public claims: **0**.

| Claim | Result |
| --- | --- |
| csv-export | PASS |
| shareable-html | PASS |
| print-pdf | PASS |
| offline-reload | PASS |
| local-storage | PASS |
| private-demo | PASS |
| no-runtime-tracking | PASS |
| local-first-real | PASS |
| unlimited-handoffs | PASS |
| safe-proof-links | PASS |
| delete-handoff | PASS |
| demo-populated-sheet | PASS |
| complete-handoff-record | PASS |
| demo-reset | PASS |
| demo-exit | PASS |
| demo-navigation | PASS |

npm test passed 42/42 in 45.3 seconds. npm run typecheck, npm run lint, and npm run build passed; dist/ was produced. The built JavaScript is 26.38 kB raw / 8.97 kB gzip and CSS is 13.00 kB raw / 3.52 kB gzip. CI=1 npm run test:live passed 42/42 in 44.3 seconds against production.

## Accessibility, privacy, routes, and runtime

verify-url.sh passed on /, /demo?demo=1, /app, /privacy, and /terms: each had a route-specific title, lang=en, one H1, main landmark, image alt coverage, labelled buttons, and no console/page errors. The repository's Playwright Axe integration passed in both local and production suites, including its light/dark and desktop/phone matrix. The standalone Axe CLI could not start because this worker image pairs Chrome 145 with a ChromeDriver that only supports Chrome 152; this is a tool-environment mismatch, not an untested accessibility claim, because the required Playwright Axe integration ran successfully.

Keyboard skip-link, route-heading focus, dialog Escape/focus return, visible focus, reduced motion, 44 px touch targets, mobile text size, and offline demo reload/update are covered by the passing live suite. The service-worker demo reload claim passed separately. The product is static and browser-local: there is no backend, tenant, health endpoint, restart state, authentication, payment, or rate-limit/429 path to test.

The landing, demo, app, Privacy, Terms, both proof pages, robots, sitemap, and assets were reachable. /review-5-deliberate-404 correctly returned the designed HTTP 404; it is not a defect. The normal app routes and 404 use the required shell. Live headers include self-only CSP with frame-ancestors 'none', HSTS, nosniff, strict-origin referrer policy, and appropriate HTML caching. During cold load and complete demo use, requests stayed on invoice-handoff-sheet.sociobot.in; no analytics, runtime CDN, API, payment, or third-party handoff-data request was observed.

Fresh build hashes matched the 14 publicly served product artifacts: HTML, JS/CSS, service worker, images, icons, robots, sitemap, 404, and both proof pages. staticwebapp.config.json is deployment configuration and is correctly not publicly served.

## Earlier findings

Every earlier review and verification finding was rechecked. The earlier issues are resolved: concrete first-screen/README copy; listed and tested claims; safe proof links and CSV cells; valid-input recovery; real 404; dark-theme/accessibility baseline; 44 px mobile targets and 17 px mobile text; demo storage isolation, exit, reset, and navigation; unsaved-field retention; working sample links; keyboard focus; delete confirmation/Undo; short-desktop primary-action visibility; local-calendar due dates and singular grammar; print/PDF claim coverage; and visible required-field guidance. The passing claim commands and 42-test local/live suites provide the current disposition.

| Earlier report | Findings rechecked | Current disposition and evidence |
| --- | --- | --- |
| Initial verification | P1 checkout, dark-theme accessibility, unsafe HTML proof links; P2 input recovery, stale feedback, touch targets, untested claims, and false 404 | Resolved by clean npm ci, claims, local/live suites, safe-link claim, focus/mobile tests, and deliberate 404 check. |
| Verification 2 | P1 Back/demo boundary and unsaved delivery fields; P2 proof links, focus, deletion, first-screen facts; P3 404 metadata | Resolved by demo-exit/navigation, complete-record, delete-handoff, populated-demo claims; live keyboard/route checks; and 404 inspection. |
| Review 1 | F-1-1 through F-1-6: concrete copy, claim coverage, and delete/Undo | Resolved by current landing/README text, no-runtime-tracking claim, and delete-handoff claim. |
| Review 2 | F-2-1 through F-2-9: metadata, 404, concrete labels, demo/record/reset claims, and plain privacy copy | Resolved on the five application routes and by the listed claims. R5-1 identifies the separate proof-page shell gap now found. |
| Review 3 | F-3-1 through F-3-2: demo disposal and preserving demo edits | Resolved by demo-exit and demo-navigation, each independently passed. |
| Verification 5 | P2 mobile target size and mobile text size | Resolved by the passing 44 px/mobile text live regressions. |
| Verification 6 | P1 short-desktop action, local due date, missing print claim; P2 CSV injection and required cues | Resolved by live 1280 x 720 first-read check, live/local suite regressions, print-pdf claim, CSV export claim, and required-field test. |

R5-1 is new and remains open. It is the only finding.

## Evidence paths

Evidence retained outside the repository:

- /tmp/invoice-handoff-review-5-claims.log
- /tmp/invoice-review-5-local-suite.log
- /tmp/invoice-review-5-live-suite.log
- /tmp/invoice-review-5-desktop.json
- /tmp/invoice-review-5-phone.json
- /tmp/invoice-review-5-routes.json
- /tmp/invoice-review-5-identity.tsv
- the temporary directory named by /tmp/invoice-review-5-verify-path
