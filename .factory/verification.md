# Independent verification — FAIL

**Candidate:** `497cbb240267e0d9495e662b5809ff70cd123938` (`497cbb2`)

**Live URL:** <https://invoice-handoff-sheet.sociobot.in>

**Verified:** 2026-08-28 UTC, from a clean checkout. This report is an
independent release decision, not the builder's self-report.

## Release decision

**FAIL — do not release this candidate.** The live paid checkout is a dead
link and three further product/accessibility defects need repair. The live
`index.html` and compiled JavaScript have the same SHA-256 as the candidate
production build, so the live failure belongs to this release state rather
than a stale deployment.

## First-read result

Pass. On a cold desktop visit, the first screen says: “Record work before
chasing payment.” It identifies “freelancers and small agencies” and the
prominent first action is **Try it with sample data**, with the plain
explanation “Opens a finished client handoff.” It immediately opens the
Moonbeam Studio sample sheet. The one-click demo requirement is met.

## Required claims

`npm ci` completed with 0 vulnerabilities. Each declared claim command was
then run separately from the shipped demo entry point and passed:

| Claim | Command | Result |
| --- | --- | --- |
| CSV follow-up export | `npm test -- --grep @claim:csv-export` | 1 passed |
| Standalone handoff HTML | `npm test -- --grep @claim:shareable-html` | 1 passed |
| Offline reload | `npm test -- --grep @claim:offline-reload` | 1 passed |
| Demo/real storage separation | `npm test -- --grep @claim:local-storage` | 1 passed |
| Private demo | `npm test -- --grep @claim:private-demo` | 1 passed |

The first attempted invocations, before dependency installation, correctly
could not load `@playwright/test`; this is normal for the supplied clean clone
and is not counted as a product claim failure. A missing or failing claim test
would have blocked the release; none failed after the required install.

## Checks that passed

- `npm test`: **7 passed**.
- `npm run build`: passed; generated `dist/`. Initial JS is 21.51 kB raw / 7.75
  kB gzip and CSS is 11.14 kB raw / 3.13 kB gzip, well within the static
  budgets.
- Candidate/live identity: SHA-256 matched for both `dist/index.html` and the
  deployed `index.html` (`350a723a…`), and for the built/deployed application
  JS (`9b1c3d6c…`).
- Fresh live demo: no console or page errors; only same-origin requests during
  demo load and add-follow-up. The demo key was only
  `demo:invoice-handoff-sheet:sheets`.
- Service worker controlled the live demo. After its first load, an offline
  reload still showed “Moonbeam Studio website launch.”
- Independent axe scans on `/`, `/demo?demo=1`, `/privacy`, `/terms`, and an
  unknown route found **0 serious/critical** issues. Each had one `h1`; browser
  console/page errors were zero. Tab order began with the skip link and every
  sampled control had the visible 3px focus outline.
- At 390 px the landing, demo, and privacy pages had no page-level horizontal
  overflow (390 px `scrollWidth`/`clientWidth`). Reduced motion disabled the
  stamp animation. Desktop and mobile visual review passed for clipping and
  legibility.
- Production-preview Lighthouse mobile: Performance **100**, Accessibility
  **100**, FCP **1.0 s**, LCP **1.1 s**, CLS **0**, interactive **1.2 s**.
- Live security/cache policy: HTTPS, HSTS, `nosniff`, strict-origin referrer
  policy, and an appropriate self-only CSP with the explicit Sociobot
  `connect-src` exception were present. Hashed JS was immutable for one year;
  the service worker was short cached. The verification API supplied valid
  same-origin CORS and `Cache-Control: no-store`.
- Product-unlock endpoint rate limit: a 60-request rapid burst to the live
  invalid-license verification endpoint produced **30 HTTP 200 and 30 HTTP
  429** responses; every 429 included `Retry-After: 4`. Thus limiting began at
  approximately 30 requests in this burst.

## Defects

### High — V-01: paid checkout is a live dead link

The landing and product sheet advertise **Buy Pro for $19**. A fresh live
`GET https://api.sociobot.in/api/v1/products/invoice-handoff-sheet/checkout`
returned **404** with `{"error":"enabled factory product","status":404}` on
2026-08-28. A visitor therefore cannot buy the promised one-time unlock. This
also violates the no-dead-links contract. Register/enable the correct product
at the Sociobot billing endpoint (or remove the paid offer until it is live),
then retest the full checkout/return-token journey.

### Medium — V-02: negative invoice amounts are accepted and saved

In a fresh real sheet, entering `-5` in **Amount due** leaves the form valid,
persists `"amount":"-5"` in local storage, and renders `-$5.00`. A payment
amount due must reject a negative number or clearly model a credit/refund.
Add a non-negative constraint and an announced recovery message.

### Medium — V-03: successful actions retain a stale validation error

On a new handoff, click **Add delivery record** empty; the page says “Add a
delivered item and date, then try again.” Fill both fields and add the record.
The record appears, but that old error stays in the `aria-live` notice rather
than a success result. The same happens for follow-ups; a normal save has no
success notice. This is misleading feedback and does not meet the required
action/result feedback. Render the new success notice after mutating state and
clear superseded errors.

### Medium — V-04: multiple mobile touch targets are below 44 px

At the required 390 px viewport, measured target heights include header Demo
26 px, Privacy 26 px, Terms 26 px, the demo **Reset demo** button 28 px, and
**Start for real** 28 px. Footer links are 21 px. These miss the stated 44 px
touch-target baseline. Increase hit areas while preserving the visual design.

### Medium — V-05: visitor-facing claims are not all represented in
`.factory/claims.json`

The landing makes unlisted, relied-on claims including “Local-first storage,”
“$19 once for Pro,” and “Free includes one saved handoff … Pro … saves
unlimited handoffs.” The five existing claims prove demo privacy, demo storage,
exports, and offline reload, but none proves the free/pro limits, price, or
the local-first assertion outside the demo. The claims contract requires an
observable demo test for every claim-like statement, or the statement must be
removed. The price claim is additionally false in the deployed state (V-01).

## Workflow coverage

I independently exercised demo reset/start-real separation; blank required
fields; a normal real handoff with project/client/email/invoice/amount/due date
and payment instructions; missing and then valid delivery records; missing and
then valid follow-ups; persistence after reload; free-tier second-handoff
limit; CSV/HTML exports through declared claims; print path presence; license
verification CORS/error handling; direct deep links; live offline reload; and
the normal, 390 px, keyboard-only, reduced-motion, and invalid-input paths.

## Required retest

1. Make the live checkout return a functioning hosted checkout and retest its
   redirect, purchase return token, storage, and verification.
2. Repair V-02 through V-05 and add/adjust claim tests.
3. Re-run all five individual claim commands, `npm test`, `npm run build`, and
   live deployment/hash, checkout, mobile-target, and accessibility checks.
