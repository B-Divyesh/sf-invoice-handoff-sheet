# Independent verification 6 — FAIL

**Candidate:** `72e0b3a0000bc8563f8783393f622152e0172626`

**Live URL:** https://invoice-handoff-sheet.sociobot.in

**Verified:** 2026-08-29 UTC

**Artifact:** Vite + TypeScript static web, local storage, service worker

## Release decision

**FAIL. Do not release this candidate.** The deployment matches the candidate
and most automated gates pass, but the mandatory first-read gate fails at a
common desktop viewport. The core due-date summary is also wrong during part
of the due day outside UTC, and a public print/PDF capability is missing from
the required claims manifest.

## Mandatory first-read gate

At 1440 × 900 and 390 × 844, the cold page states the job (“Record work before
chasing payment”), names freelancers and small agencies, and shows **Try it
with sample data**. One click opens `/demo?demo=1` with the Demo notice,
Moonbeam Studio, two delivery records, invoice `MB-042`, payment instructions,
and one follow-up.

At 1280 × 720, the primary sample action begins at y=734.94 and is entirely
below the viewport. At 1366 × 768 it is clipped, ending at y=780.94. The first
screen therefore does not show what to click first on a normal laptop. This is
an explicit acceptance-gate failure.

Evidence:

- `.factory/evidence/verification-6/live-first-read-fail-1280x720.png`
- `.factory/evidence/verification-6/cold-first-read-desktop.png`
- `.factory/evidence/verification-6/cold-first-read-mobile.png`

## Claims gate

`.factory/claims.json` exists. After `npm ci`, every exact manifest command ran
separately against the demo entry point. All 15 declared claim tests passed:

| Claim ID | Result |
| --- | --- |
| `csv-export` | PASS |
| `shareable-html` | PASS |
| `offline-reload` | PASS |
| `local-storage` | PASS |
| `private-demo` | PASS |
| `no-runtime-tracking` | PASS |
| `local-first-real` | PASS |
| `unlimited-handoffs` | PASS |
| `safe-proof-links` | PASS |
| `delete-handoff` | PASS |
| `demo-populated-sheet` | PASS |
| `complete-handoff-record` | PASS |
| `demo-reset` | PASS |
| `demo-exit` | PASS |
| `demo-navigation` | PASS |

The visitor-facing claims cross-check fails. The live editor offers **Print or
save PDF**, but `claims.json` has no print/PDF entry and the test tree has no
matching `@claim` test. The click calls `window.print()`, but the claims
contract requires exactly one listed sandbox test for this public capability.

## Clean checkout and production build

- Candidate identity before testing: `72e0b3a` on `main` / `origin/main`.
- `npm ci`: PASS; 23 packages installed, 0 audit vulnerabilities.
- `npm test`: PASS; 38/38 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS (the declared script runs `tsc --noEmit`).
- `npm run build`: PASS; Vite 6.4.3 produced `dist/`.
- `CI=1 npm run test:live`: PASS; 38/38 tests against production.
- Output: JS 25,282 B raw / 8.67 kB gzip; CSS 12,651 B raw /
  3.41 kB gzip; hero WebP 59,652 B; no web-font payload.

## Candidate/live identity and routing

Fresh SHA-256 and byte comparisons matched all 14 publicly served build files:
HTML, hashed JS/CSS, service worker, images, icons, sample proof pages, robots,
sitemap, and 404. The deployment-only Static Web Apps config correctly is not
public. An unknown URL returned HTTP 404 with a body byte-identical to
`dist/404.html`. Production therefore serves candidate `72e0b3a`.

Every discovered internal link returned 200, including both sample proof
pages. App routes have route-specific titles, one H1, one main landmark, and
working direct URLs.

## Independent end-to-end workflow

A fresh live real-data context created “Verification Six handoff” for Harbor &
Pine Studio with invoice `QA-72E0B3A`, a zero amount, payment instructions, a
delivery/acceptance record, and a follow-up. Reload preserved every field. CSV
and HTML downloads contained the record and excluded the rejected unsafe URL.
Confirmed deletion removed the record; Undo restored it. Escape closed the
dialog and restored focus to **Delete handoff**.

An invalid email, two-letter currency, `-0.01` amount, `javascript:` proof URL,
and empty follow-up were blocked with visible/announced guidance. Corrected
input succeeded. Evidence:
`.factory/evidence/verification-6/live-real-workflow-desktop.png`.

## Privacy, headers, and caching

The complete real-data flow made only same-origin document/JS/CSS requests.
No tracker, API, payment, runtime-CDN, console, or page-error event occurred.
Real mode wrote only `invoice-handoff-sheet:sheets`; claim tests separately
verified the isolated `demo:invoice-handoff-sheet:sheets` namespace.

Playwright observed:

- HTML cache: `public, must-revalidate, max-age=30`.
- Hashed JS/CSS cache: `public, max-age=31536000, immutable`.
- CSP: self-only default/style/script/connect; `object-src 'none'`,
  `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
- HSTS: `max-age=10886400; includeSubDomains; preload`.
- `X-Content-Type-Options: nosniff` and strict-origin referrer policy.

## Accessibility, responsive behavior, and PWA

- 24 live Axe scans (six routes × light/dark × desktop/390 px) found zero
  serious or critical violations.
- Normal 200 routes had no console/page errors. The deliberate unknown URL
  emitted only the expected failed-document 404 console message.
- At 390 px every route fit the viewport and all visible interactive targets
  measured at least 44 × 44 CSS px. The regression suite confirms mobile task
  and navigation text is at least 17 px.
- Keyboard testing exposed the skip link first with a 3 px visible outline;
  Enter focused the H1. Dialog Escape/focus restoration and Undo passed.
- Reduced-motion mode had no active animation or transition.
- `/sw.js` updated. Offline `/demo?demo=1` then reloaded with HTTP 200 and kept
  the demo notice, invoice, both delivery records, and follow-up.
- URL verifier evidence for landing, demo, app, Privacy, Terms, and 404 records
  no errors under `.factory/evidence/verification-6/verify-*`.

## Performance

Fresh live Lighthouse mobile evidence from 2026-08-29 10:40 UTC:

| Category or metric | Result |
| --- | ---: |
| Performance | 98 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.2 s |
| CLS | 0 |
| Total blocking time | 160 ms |
| Total transfer | 72 KiB |

Report: `.factory/evidence/verification-6/lighthouse-live.json`. Field INP is
not available from a one-off lab run.

## Defects by severity

### P1 — first screen hides the demo action on common laptops

At 1280 × 720, **Try it with sample data** is completely below the viewport;
at 1366 × 768 it is clipped. The headline and audience are visible, but the
screen does not answer what to click first. This directly fails the mandatory
plain-words/demo first-screen contract.

### P1 — due-day state is wrong outside UTC

The app parses a date-only due value with `new Date("YYYY-MM-DD")`, meaning UTC
midnight, then compares it with `Date.now()`. At browser local time Sat Aug 29
2026 19:00 PDT, a handoff due `2026-08-29` displayed **“1 days overdue”**. In
Pacific/Kiritimati at local 02:00 on the due date, it displayed **“Due in 1
days”**. The handoff can therefore misstate urgency during the actual local due
day. Singular boundaries also use the wrong “days” grammar.

Evidence:
`.factory/evidence/verification-6/live-due-date-timezone-defect-mobile.png`.

### P1 — print/PDF capability is missing from the claims manifest

The live **Print or save PDF** action invokes `window.print()`, but no print/PDF
claim exists in `.factory/claims.json` and there is no matching `@claim` test.
The supplied claims contract says an unlisted visitor-reliance claim fails
verification.

### P2 — CSV export preserves spreadsheet formula prefixes

Entering `=HYPERLINK("https://example.invalid","Open")` as a follow-up and
`@SUM(1+1)` as its outcome produced a CSV row whose cells still begin with `=`
and `@`. Quoting does not neutralize formulas in common spreadsheet programs.

### P2 — required fields are not explained consistently

Project/client inputs have native `required`, and milestone title/date use
`aria-required="true"`, but no visible text identifies required fields.
Follow-up date/note are required by click-handler logic yet have neither a
native/ARIA required state nor a visible cue. The form contains no visible
“required” or “optional” explanation.

## Applicability and required remediation

This static product has no backend/API, paid unlock, authentication, package,
CLI, or runtime AI. API rate-limit/429, Entra, consumer-install, backend, and AI
identity checks are not applicable. No obvious AI step is needed for this
structured record workflow.

Before re-verification: fit the demo action within short desktop viewports;
compare due dates as local calendar dates with singular labels; add the missing
print/PDF claim test or remove the claim; neutralize formula-leading CSV cells;
and mark/explain every required field.
