# Independent verification 2 — FAIL

**Candidate:** `6289de39e4a9c0a21b581876e7f3f02c17adcb8b`  
**Live URL:** https://invoice-handoff-sheet.sociobot.in  
**Verified:** 2026-08-29 UTC  
**Artifact:** static web app with an offline service worker

## Release decision

**FAIL. Do not release this candidate.** The live deployment is the candidate,
the declared claim tests pass, and the accessibility/performance baseline is
strong. However, ordinary use can cross the demo/real storage boundary, and a
common create flow silently discards entered project and invoice data. Both are
release-blocking data-integrity defects.

## Mandatory first-read gate

**PASS.** A cold 1440 px load says:

- What it does: **“Record work before chasing payment.”**
- Who it is for: **“For freelancers and small agencies…”**
- What to do first: **“Try it with sample data.”** The adjacent note says it
  opens a finished client handoff.

The action takes one click to `/demo?demo=1`, where the populated Moonbeam
Studio handoff and demo banner are immediately visible. The same essentials
appear within the first 844 px at a 390 px viewport.

## Clean-checkout claim gate

Per the required order, every command in `.factory/claims.json` was invoked
before any other repository test. On the untouched checkout, the invocations
could not load the not-yet-installed local `@playwright/test` package. After the
required clean `npm ci` (23 packages added, 0 vulnerabilities), every exact
claim command was run again and passed. The initial loader error was an
uninstalled-dependency precondition, not a product assertion failure.

| Claim | Exact command | Installed clean-clone result |
| --- | --- | --- |
| CSV follow-up export | `npm test -- --grep @claim:csv-export` | PASS — 1 test |
| Standalone handoff HTML | `npm test -- --grep @claim:shareable-html` | PASS — 1 test |
| Offline reload | `npm test -- --grep @claim:offline-reload` | PASS — 1 test |
| Demo/real storage separation | `npm test -- --grep @claim:local-storage` | PASS — 1 test |
| No third-party demo requests | `npm test -- --grep @claim:private-demo` | PASS — 1 test |
| Real handoffs stay local | `npm test -- --grep @claim:local-first-real` | PASS — 1 test |
| Multiple free handoffs | `npm test -- --grep @claim:unlimited-handoffs` | PASS — 1 test |
| HTTP(S)-only proof links | `npm test -- --grep @claim:safe-proof-links` | PASS — 1 test |

Each claim ID occurs exactly once in the test suite. The passing storage test is
too narrow: the live history-navigation flow below disproves the broader
visitor-facing separation promise.

## Repository gates

- `npm test`: **PASS, 24/24** Playwright tests in 33.9 seconds.
- `npm run typecheck`: **PASS**.
- `npm run lint`: **PASS** (`tsc --noEmit`, as defined by the package).
- `npm run build`: **PASS**; `dist/` produced by Vite 6.4.3.
- JavaScript: 21.47 kB raw / 7.79 kB gzip. CSS: 11.65 kB raw /
  3.24 kB gzip. Hero WebP: 59,652 bytes. All are within contract budgets.
- `npm ci` audit: 0 vulnerabilities.

## Independent live evidence

### Functional and privacy checks

- Normal recovery flow passed after re-entering discarded values: save and
  reload; zero and positive amounts; negative amount rejection; malformed
  email rejection; unsafe proof-URL rejection; valid HTTP proof recovery;
  empty follow-up rejection; valid follow-up; CSV export; standalone HTML
  export; and escaped `<`, `>`, and `&` text.
- The complete fresh-context live flow requested only
  `https://invoice-handoff-sheet.sociobot.in`. It emitted no console errors or
  page errors and persisted real records only in
  `invoice-handoff-sheet:sheets`.
- No backend, sign-in, billing call, or product endpoint exists in this
  candidate. Rate-limit and Entra checks are therefore not applicable.
- The previously reported deployment-only checkout failure does not recur:
  this candidate and the matching live page contain no paid offer, buy link,
  license control, or billing request.

### Accessibility, mobile, and motion

- `/opt/fleet/lib/verify-url.sh` passed for `/` and `/demo?demo=1`: HTTPS 200,
  `lang=en`, one H1, one main landmark, alt text present, labelled buttons, and
  no console/page errors. Observed loads were 730 ms and 622 ms.
- Live axe scans at 1280 px and 390 px, on landing and demo, in light and dark
  modes: **8/8 scans had zero serious or critical findings** (and zero axe
  violations of any impact).
- At 390 px dark mode there was no horizontal page overflow. Header, demo, and
  footer targets measured 44 px high. Reduced-motion mode reported zero active
  animations/transitions.
- The first Tab focused the visible skip link. Its focus ring measured 3 px and
  has 11.47:1 contrast in dark mode; Enter moved focus to the H1.

### Offline/update, headers, routes, and links

- Service-worker test passed: a seeded `invoice-handoff-v1` cache was deleted
  after a fresh registration; only `invoice-handoff-v2` remained. With the
  browser offline, `/demo?demo=1` reloaded as HTTP 200 with the sample heading
  and demo banner.
- Browser-observed document headers include HSTS, `nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a self-only CSP with
  `frame-ancestors 'none'`. HTML and `sw.js` use
  `public, must-revalidate, max-age=30`; hashed JS/CSS use
  `public, max-age=31536000, immutable`.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200 with route-specific
  titles, `lang=en`, one H1, one main landmark, and canonical links. A random
  unknown route returns the designed document with HTTP 404.
- All internal links returned 200. Both sample proof links returned 404 (P2
  below).

### Candidate/live identity and performance

- The checked-out HEAD is exactly
  `6289de39e4a9c0a21b581876e7f3f02c17adcb8b`.
- SHA-256 comparisons matched for all 12 public build artifacts: HTML, hashed
  JS/CSS, service worker, 404 HTML/CSS, both WebPs, icons, robots, and sitemap.
  `staticwebapp.config.json` is consumed by the host and correctly is not
  publicly served. The live deployment matches this candidate.
- Lighthouse 12.8.2 mobile: Performance **99**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.2 s, TBT 90 ms, CLS 0,
  71 KiB transferred.
- Social art is 1200×630, hero art is 1000×667, and the Apple touch icon is
  180×180.

## Defects

### P1 — browser Back breaks the demo sandbox and writes sample data as real data

Fresh live reproduction:

1. Open `/` and click **Try it with sample data**.
2. From the populated demo, open **Privacy**.
3. Use the browser Back action.
4. The address is `/demo?demo=1`, but the demo banner is gone and the title is
   `Moonbeam Studio website launch — Invoice Handoff Sheet`, not the demo title.
5. Click **Save changes**.

Observed: `invoice-handoff-sheet:sheets` is created with the Moonbeam Studio
sample, while the demo key also remains. This violates the demo contract’s
“banner at every point” statement and the claim that demo data is separate from
real sheets. `popstate` rerenders without restoring mode and storage from the
URL. This is a privacy and data-boundary failure.

### P1 — adding a delivery silently discards unsaved handoff fields

Fresh live reproduction:

1. Open `/app`, choose **Create handoff**, and enter a project, client, email,
   invoice ID, zero amount, and EUR currency.
2. Enter a valid delivery item, date, and HTTPS proof link.
3. Choose **Add delivery record** before the top **Save changes** button.

Observed: “Delivery record added” is announced and the milestone persists, but
the page returns to **New handoff**. Project, client, email, invoice, amount,
and currency revert to blank/default values. Local storage contains the new
milestone with all those sheet fields blank. The action rerenders from stored
state without first retaining other valid form edits. This is silent data loss
in the product’s primary creation flow.

### P2 — the sample’s delivery-proof links are dead

The one-click demo renders two **Open delivery proof** links. Fresh GET requests
to both returned HTTP 404:

- `https://example.com/moonbeam/final-preview`
- `https://example.com/moonbeam/handover-files`

The sample cannot demonstrate its defining delivery-evidence action and fails
the no-dead-links requirement.

### P2 — dynamic actions lose keyboard focus

Activating **Add delivery record** with Enter succeeds and updates the live
status, but `document.activeElement` becomes `<body>` after the rerender. A
keyboard user is returned to the start of the page instead of the changed
section or action result. The same render pattern is used by other record
actions.

### P2 — destructive record removal has no confirmation or undo

Choosing **Remove milestone** immediately reduced the live record count from
three to two and persisted the deletion. No dialog appeared and no Undo action
was offered. The required interaction policy says destructive actions must be
confirmed or reversible.

### P2 — the first screen omits two required plain facts

The three visible fact lines are “Saved in this browser,” “CSV follow-up
export,” and “Standalone HTML export.” They do not state offline availability
or the free price on the first screen, while the plain-words contract calls for
privacy, offline, and price facts there. The mandatory what/who/first-click gate
still passes.

### P3 — the static 404 lacks the standard metadata set

The 404 response has the correct status, title, language, H1, and main
landmark, but it has no description, canonical, Open Graph, or Twitter
metadata. Other public routes provide the required canonical and shared social
metadata.

## Required re-verification

1. Derive demo/real mode and storage from the destination URL on every history
   transition; add Back/Forward claim coverage proving the banner and namespace.
2. Preserve valid form edits before add/remove/export rerenders, or prevent
   those actions until the sheet is saved with explicit guidance. Add a test
   that fills a complete new handoff and adds a milestone before the top save.
3. Replace demo proof URLs with durable same-origin sample evidence or another
   endpoint that returns 200.
4. Restore focus after dynamic record actions and confirm or make removals
   undoable.
5. Repeat the eight exact claim commands, full suite/build, live hash check,
   axe matrix, mobile keyboard flow, request log, and offline update test.
