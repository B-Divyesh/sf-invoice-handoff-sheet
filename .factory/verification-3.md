# Independent verification 3 — PASS

**Candidate:** `57e91c2ded806fa2b77fd2a10ae73b0f3d18d5b3`  
**Live URL:** https://invoice-handoff-sheet.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Artifact:** static-web (Vite + TypeScript, local-first, service worker)

## Release decision

**PASS.** The production deployment byte-matches this candidate's production build. The product fulfils the researched job: a freelancer or small agency can record delivered work, invoice terms, payment instructions, and follow-up history; keep the record in the browser; and export it as CSV or a standalone handoff page. No release-blocking defects were found.

## Mandatory first-read and demo gate

**PASS.** A cold, cacheless 1440 px live visit stated:

- **What it does:** “Record work before chasing payment.”
- **Who it is for:** “For freelancers and small agencies who need one calm record before an invoice turns into a dispute.”
- **What to click first:** “Try it with sample data”; the adjacent explanation says “Opens a finished client handoff.”

The one-click action opened `/demo?demo=1` with the populated Moonbeam Studio record, delivery evidence, invoice `MB-042`, and follow-up log. Its persistent banner identifies demo mode, says real sheets are untouched, and provides Reset demo and Start for real. The first screen also presents the three required facts: saved in this browser, works offline after first visit, and free to use.

## Clean-checkout claim gate

`.factory/claims.json` exists and has eight claims. After `npm ci` from the candidate checkout (23 packages installed; audit: 0 vulnerabilities), every declared command was run exactly as written against the shipped demo entry point. All passed (one Playwright test each).

| Claim | Command | Result |
| --- | --- | --- |
| CSV follow-up export | `npm test -- --grep @claim:csv-export` | PASS |
| Standalone handoff HTML | `npm test -- --grep @claim:shareable-html` | PASS |
| Offline reload | `npm test -- --grep @claim:offline-reload` | PASS |
| Demo storage separation | `npm test -- --grep @claim:local-storage` | PASS |
| No third-party demo requests | `npm test -- --grep @claim:private-demo` | PASS |
| Real handoffs remain local | `npm test -- --grep @claim:local-first-real` | PASS |
| Multiple free handoffs | `npm test -- --grep @claim:unlimited-handoffs` | PASS |
| HTTP(S)-only proof links | `npm test -- --grep @claim:safe-proof-links` | PASS |

Each claim ID occurs exactly once in the test suite. Landing, privacy, demo, and README claims were cross-checked against this list; no unlisted visitor-reliance claim was found.

## Repository and build evidence

- `npm test`: **PASS**, 27 Playwright tests. A subsequent focused rerun of the workflow, repair, and accessibility suites also finished with `test-results/.last-run.json` status `passed`.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS** (`tsc --noEmit`, as defined by the repository).
- `npm run build`: **PASS**; Vite 6.4.3 produced `dist/`.
- Build output: JavaScript 23.13 kB raw / 8.24 kB gzip; CSS 11.65 kB raw / 3.24 kB gzip; hero WebP 59,652 bytes. These are within the static budgets.

## Independent live product checks

In a fresh live browser context I created a real handoff, entered normal project/client/email/invoice data, confirmed a zero amount is retained, added a delivery, logged a follow-up, exported CSV, reloaded, and verified the record persisted in `invoice-handoff-sheet:sheets`. Boundary and recovery checks passed: a negative amount gave announced guidance and was not saved; a `javascript:` proof URL was rejected; a valid HTTPS URL was accepted; an empty follow-up was rejected with guidance; and a corrected follow-up saved.

The live request log for this complete real-data flow contained only `https://invoice-handoff-sheet.sociobot.in`; no analytics, tracking, API, payment, sign-in, or third-party request occurred. The demo → Privacy → browser Back → Save path kept the Demo banner and title and wrote only `demo:invoice-handoff-sheet:sheets`, never the real namespace. This confirms the local-first/privacy promises from observable browser behaviour.

No server-side product endpoint exists, so a 429 allowance and Microsoft Entra tenant check are not applicable.

## Accessibility, responsive, offline, and routes

- `/opt/fleet/lib/verify-url.sh` passed live for `/` (618 ms) and `/demo?demo=1` (616 ms): HTTP 200, title, `lang=en`, one H1, main landmark, alt text, labelled buttons, and no console/page errors.
- Eight live Axe scans (light/dark × desktop 1280 px/390 px × landing/demo) reported **zero serious/critical findings and zero total violations**.
- At 390 px the document width was exactly 390 px (no horizontal overflow). Header, demo, and footer controls were all at least 44 px tall.
- Keyboard-only smoke test passed: Tab reaches the visible Skip to sheet link; Enter moves focus to the H1; route navigation restores heading focus.
- With `prefers-reduced-motion: reduce`, there were zero active animation or transition durations. A service-worker-controlled demo reloaded while the browser was offline and retained its sample sheet and banner.
- `/`, `/demo`, `/app`, `/privacy`, `/terms`, and both same-origin sample proof pages returned 200. An unknown route returned the designed HTTP 404.

## Deployment, headers, cache, and performance

SHA-256 comparisons matched all 14 publicly served candidate build artifacts: HTML/404, hashed JS and CSS, service worker, images, icon, robots, sitemap, and both sample proof pages. The live deployment therefore matches candidate `57e91c2ded806fa2b77fd2a10ae73b0f3d18d5b3` (whose only source delta from the repaired product is documentation).

Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP with `frame-ancestors 'none'`. HTML and `sw.js` use `public, must-revalidate, max-age=30`; hashed JS/CSS use `public, max-age=31536000, immutable`.

Fresh mobile Lighthouse 12.8.2: Performance **94**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.2 s, TBT 290 ms, CLS 0, and 71 KiB transferred.

## Defects

No P0, P1, P2, or P3 defects found in this verification.

## Notes for handoff

The candidate is ready for release. Re-run the commands above and use the live URL for deployment verification; no product code was changed by this verification.
