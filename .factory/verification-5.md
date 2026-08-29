# Independent verification 5 — FAIL

**Candidate commit:** `b4c477de6ee7ae31dacc5dad37dac45a1b329d46`

**Live URL:** https://invoice-handoff-sheet.sociobot.in

**Verified:** 2026-08-29 UTC

**Artifact:** static web (Vite + TypeScript, browser-local storage, service worker)

## Release decision

**FAIL.** The core workflow, claims, build, deployment identity, privacy checks,
offline behavior, and automated accessibility scans pass. The candidate still
misses the non-negotiable mobile accessibility/design baseline: multiple live
interactive targets are smaller than 44 × 44 CSS pixels, and task/navigation
text is rendered below the attached 17 pt mobile minimum.

## First read and demo gate

**PASS.** A cold 1440 × 900 live visit answered all three required questions
on the first screen:

- What it does: “Record work before chasing payment,” followed by delivery
  proof, invoice details, and follow-ups in one record.
- Who it is for: freelancers and small agencies.
- What to click first: **Try it with sample data**, with the adjacent result
  “Opens a finished client handoff.”

One click opened `/demo?demo=1`. It showed the persistent demo banner,
Moonbeam Studio project, two delivery milestones, invoice `MB-042`, payment
instructions, and one follow-up. Reset demo and Start for real were available.

## Claims gate

`.factory/claims.json` exists and contains 15 entries. A pre-install invocation
could not load the declared Playwright package, as expected for a dependency-
free clone. After the required `npm ci` installed the locked dependencies, each
exact manifest command was run independently from this checkout. All passed.
Every `@claim:<id>` tag occurs exactly once in the test source.

| Claim | Exact command result after locked install |
| --- | --- |
| `csv-export` | PASS — 1 test |
| `shareable-html` | PASS — 1 test |
| `offline-reload` | PASS — 1 test |
| `local-storage` | PASS — 1 test |
| `private-demo` | PASS — 1 test |
| `no-runtime-tracking` | PASS — 1 test |
| `local-first-real` | PASS — 1 test |
| `unlimited-handoffs` | PASS — 1 test |
| `safe-proof-links` | PASS — 1 test |
| `delete-handoff` | PASS — 1 test |
| `demo-populated-sheet` | PASS — 1 test |
| `complete-handoff-record` | PASS — 1 test |
| `demo-reset` | PASS — 1 test |
| `demo-exit` | PASS — 1 test |
| `demo-navigation` | PASS — 1 test |

Landing, demo, Privacy, README, and demo documentation claims were
cross-checked. Export, offline, local-storage, privacy, free-use, proof-link,
deletion, complete-record, and demo-lifecycle statements have claim entries.
No unlisted visitor-reliance claim was found.

## Clean local gates

- `npm ci`: PASS; 23 packages installed, 0 audit vulnerabilities.
- `npm test`: PASS; 37/37 Playwright tests.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS (the declared script runs `tsc --noEmit`).
- `npm run build`: PASS; `dist/` produced by Vite 6.4.3.
- Output: JavaScript 25.28 kB raw / 8.67 kB gzip; CSS 12.11 kB raw /
  3.34 kB gzip; no font payload; hero WebP 59,652 bytes.
- `CI=1 npm run test:live`: PASS; 37/37 tests against the public origin.

## End-to-end and recovery evidence

In a fresh live real-data context, a handoff for Harbor & Pine Studio was
created with invoice `QA-B4C477`, a zero amount, payment instructions, one
delivery/acceptance record, and one follow-up. Save and reload preserved all
records. CSV and standalone HTML downloaded as `QA-B4C477-follow-ups.csv` and
`QA-B4C477-handoff.html`; their contents included the entered invoice,
follow-up, project, and acceptance details.

Recovery paths behaved correctly:

- `-0.01` amount was rejected with “Amount due cannot be negative. Enter zero
  or a positive amount.”
- `javascript:alert(1)` proof was rejected with the HTTP/HTTPS guidance and
  was absent from storage/export.
- An empty follow-up was rejected with “Add a date and what you sent, then try
  again.” Correcting it allowed the record to be added.
- The repository suite also passed handoff deletion confirmation, Escape/focus
  restoration, per-record deletion, Undo, demo reset, and demo exit isolation.

## Privacy, security, and deployment

The independent complete real workflow made six requests, all to
`https://invoice-handoff-sheet.sociobot.in`; there were no console/page errors.
Only `invoice-handoff-sheet:sheets` appeared in real-mode local storage. The
claim suite separately confirmed the demo namespace and same-origin-only demo
flow.

Playwright observed the live document response with:

- `Content-Security-Policy: default-src 'self'; ... connect-src 'self'; ...`
- `Strict-Transport-Security: max-age=10886400; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- HTML cache: `public, must-revalidate, max-age=30`
- Hashed asset cache: `public, max-age=31536000, immutable`

All 14 publicly served build files SHA-256 matched `dist/`, including HTML,
hashed JS/CSS, service worker, images, icons, sample proof pages, robots, and
sitemap. An unknown route returned HTTP 404 with a body matching `dist/404.html`.
The live deployment therefore matches candidate `b4c477d`.

This product has no server endpoint, unlock call, authentication, or AI
feature. API rate-limit/429 and Entra authority checks are not applicable. No
obvious AI step is needed for this structured local record workflow.

## Accessibility, responsive behavior, and PWA evidence

- `/opt/fleet/lib/verify-url.sh` passed on `/`, `/demo?demo=1`, `/app`,
  `/privacy`, and `/terms`: each had a title, `lang=en`, one H1, a main
  landmark, alt text, labelled buttons, and no console/page errors.
- Eight fresh live Axe runs (light/dark × desktop/390 px landing/demo) found
  zero violations of any impact, hence zero serious/critical findings.
- Keyboard Tab exposed the skip link with a 3 px focus outline; Enter moved
  focus to the H1. Repository coverage also passed keyboard activation,
  dialog Escape, focus restoration, and Undo.
- At 390 px the page width equalled the viewport (390 px); no page-level
  horizontal overflow occurred. The follow-up table intentionally scrolls.
- With reduced motion requested, there were zero active animations and the
  maximum transition duration was 0 seconds.
- The active service worker used `/sw.js`; `registration.update()` completed.
  A subsequent offline demo reload retained the sample sheet and demo banner.
- Every discovered internal link returned HTTP 200. The five app routes
  returned 200 and the designed unknown route returned 404.

## Performance

Fresh live Lighthouse mobile results:

| Category or metric | Result |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| FCP | 0.9 s |
| LCP | 1.1 s |
| CLS | 0 |
| Total blocking time | 140 ms |
| Total transfer | 72 KiB |

Static asset budgets pass: initial JS is below 200 kB, CSS below 50 kB, hero
below 300 kB, and there are no web fonts. Lab interaction blocking is within
budget; field INP is not available from a one-off lab run.

## Defects by severity

### P2 — Mobile interactive targets miss the required 44 × 44 CSS px baseline

At a 390 × 844 live viewport, an enumeration of visible links, buttons, and
form controls found these undersized targets:

| Target | Measured box |
| --- | ---: |
| Header wordmark | 110 × 34 px |
| Header Demo | 29 × 44 px |
| Header Terms | 36 × 44 px |
| All handoffs | 134 × 18 px |
| Delivery proof links (two) | 278 × 42 px |

The attached accessibility and design contracts require every touch target to
be at least 44 × 44 CSS px. The existing test named “required mobile controls
have 44px touch targets” checks height only and covers only header-nav,
demo-banner, and footer links, so it misses widths and task links. This is a
release blocker under the supplied acceptance contract.

### P2 — Mobile task and navigation text is below the required minimum

Computed live sizes at 390 px include 12 px header links and destructive
controls, 13 px demo text/actions and table headings, and 14 px delivery,
acceptance, and footer text. The attached design contract sets body text at
least 17 pt on mobile. The very small ledger text is visible in the full-page
390 px capture and makes the core record harder to scan.

## Required next steps

Increase the hit areas for every interactive link/control to at least 44 × 44
CSS px in both dimensions, including content links, and raise mobile task text
to the supplied minimum. Expand the mobile regression test to assert both
dimensions across all visible interactive elements, then rerun claims, the
full local/live suites, Axe, and the 390 px visual check.
