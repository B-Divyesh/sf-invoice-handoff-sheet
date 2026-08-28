# Independent verification — FAIL

**Candidate:** `497cbb240267e0d9495e662b5809ff70cd123938`  
**Live URL:** https://invoice-handoff-sheet.sociobot.in  
**Verified:** 2026-08-28

## Release decision

**FAIL. Do not release this candidate.** The production checkout is unavailable,
the dark theme has an axe **serious** contrast failure, and untrusted proof URLs
are emitted as executable `javascript:` links in the standalone HTML export.

## Cold first read

The first screen says this records work before chasing payment, names freelancers
and small agencies as the audience, and leads with **Try it with sample data**.
The adjacent text says it opens a finished client handoff. This requirement
passes; the one-click demo reaches `/demo?demo=1` and presents the Moonbeam
Studio sheet with a persistent demo banner, reset, and start-for-real controls.

## Clean-clone checks

`npm ci` completed with 0 vulnerabilities. Every required claim command was run
serially through the shipped demo entry point and passed. Persistent command
output is in `/tmp/invoice-verification-evidence/` in this verification
container.

| Claim | Command | Result | Evidence |
| --- | --- | --- | --- |
| Exports the follow-up log as CSV | `npm test -- --grep @claim:csv-export` | PASS, 1 test | `claim-csv-export.log` |
| Downloads a standalone handoff page | `npm test -- --grep @claim:shareable-html` | PASS, 1 test | `claim-shareable-html.log` |
| Works offline after first visit | `npm test -- --grep @claim:offline-reload` | PASS, 1 test | `claim-offline-reload.log` |
| Demo data is separate from real sheets | `npm test -- --grep @claim:local-storage` | PASS, 1 test | `claim-local-storage.log` |
| Demo sends no handoff details to third parties | `npm test -- --grep @claim:private-demo` | PASS, 1 test | `claim-private-demo.log` |

Additional repository checks:

- `npm test`: **7 passed** (workflow, five claims, and the existing default-theme axe test).
- `npm run build`: **passed** (`tsc --noEmit` then Vite); `dist/` produced.
- No separate lint/type command is defined. Type checking is included in build.
- Initial JS: 21.51 kB raw / 7,743 B gzip; CSS: 11.14 kB raw / 3,147 B gzip;
  hero: 59,652 B. These meet the stated static-web budgets.

## Live/deployment checks

- Fresh rendered-page check: title, `lang=en`, one `h1`, `<main>`, image alt
  text, and console/page errors all passed. `/opt/fleet/lib/verify-url.sh`
  completed successfully; its JSON and desktop/mobile screenshots are in
  `/tmp/invoice-verification-evidence/`.
- Candidate/live comparison passed for `index.html`, hashed JS/CSS, `sw.js`,
  hero/social imagery, favicon, apple icon, robots, sitemap, and 404 asset
  (SHA-256/byte comparison). This is the candidate currently served.
- Live demo was reloaded offline after service-worker control: HTTP 200,
  Moonbeam sample heading and demo banner remained available.
- Normal create/save, delivery addition, follow-up addition, CSV export, and
  standalone-HTML export were exercised. The demo uses only
  `demo:invoice-handoff-sheet:sheets`; the live demo flow made no non-same-origin
  requests and raised no console/page errors.
- Keyboard smoke test passed: Tab reaches the skip link first, Enter moves focus
  to `#main`, focus is a visible 3px red outline, and reduced-motion mode reports
  no animation or transition.
- Response policy: HTTPS, HSTS, CSP, `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin` are present. Hashed JS/CSS
  are cached `max-age=31536000, immutable`. No analytics/CDN traffic was seen.
- License verification endpoint rate limit was exercised with 50 rapid invalid
  verification requests: the first 30 returned 200, then requests 31–50 returned
  **429** with `Retry-After: 2`. Invalid token response is `200` with
  `{"valid":false,"reason":"invalid"}`.

## Defects

### P1 — production checkout is broken (release blocking)

The live, advertised **Buy Pro for $19** link targets
`https://api.sociobot.in/api/v1/products/invoice-handoff-sheet/checkout`.
Fresh GET on 2026-08-28 returned **HTTP 404**:

```json
{"error":"enabled factory product","status":404}
```

The page and README sell an unlimited-handoff Pro tier, but a user cannot start
the purchase. This confirms the deployment-only failure from independent live
evidence.

### P1 — dark theme fails accessibility (release blocking)

Axe was run against the live landing page and `/demo?demo=1` at 390px using
`prefers-color-scheme: dark`. Each has one **serious** `color-contrast`
violation. Most normal text renders `#10233a` on `#1d334c`, measured at **1.23:1**
(for example, the three landing facts, mini-sheet, form values, table cells, and
buttons). Destructive controls measure 2.47:1. The supplied default-theme axe
test does not cover dark mode. The 390px dark screenshot is
`/tmp/invoice-live-demo-390-dark.png`.

### P1 — standalone HTML export permits executable proof URLs (release blocking)

In the live demo, the `type=url` evidence input accepts
`javascript:alert(document.domain)` as valid. After **Add delivery record**, the
app renders `href="javascript:alert(document.domain)"`; after **Download
shareable HTML**, the file contains the same executable href. The export must
allowlist `https:`/`http:` (or reject unsafe protocols) before rendering or
exporting client-shareable content.

### P2 — invalid financial and evidence input is saved instead of rejected

On a fresh real-sheet flow, entering `-50` for Amount due and saving produces
`-$50.00`. Entering `not a valid URL` in Proof link has
`input.validity.valid === false`, but **Add delivery record** still saves it
because that button bypasses form validity. The record then contains a broken
delivery proof link. Reject invalid/negative values and give a clear recovery
message before saving.

### P2 — license restore error is invisible; successful action feedback is stale

Submitting an empty **Restore license** form leaves no `.notice` element and no
visible/announced “Paste your license token first” message. In the same live
exercise, successfully adding a delivery showed the old “Changes saved.” notice
instead of “Delivery record added.” These paths do not meet the required
action/error feedback standard.

### P2 — unknown live routes return 200 rather than a real HTTP 404

`GET /not-a-real-page` returns the SPA `index.html` with HTTP 200. The client
then renders its visual 404 after JavaScript, but crawlers and non-JS clients do
not receive the configured 404 response. This does not meet the required real
404 response behaviour.

## Required remediation and re-verification

1. Register/enable the production Sociobot product or remove the paid offer
   until its checkout returns a working checkout response.
2. Repair dark-theme token inheritance and add dark-mode axe coverage; rerun
   axe at desktop and 390px.
3. Sanitize proof URL schemes in both app rendering and `handoffHtml`, and add
   a regression claim/test covering `javascript:` and malformed URLs.
4. Add validity constraints for amount and delivery URL, fix user feedback, and
   correct the server-side 404 configuration. Re-run this verification from a
   new build and deployment.
