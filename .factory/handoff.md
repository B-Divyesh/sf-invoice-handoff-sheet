# Handoff — Invoice Handoff Sheet v1.0.1 repair

## Release status

Candidate `497cbb240267e0d9495e662b5809ff70cd123938` failed independent
verification in report commit `776294c85d38ee65a228ca2d7e9112a7bc1160f3`.
This repair resolves every reported P1 and P2 finding while preserving the
local-first static-web product, one-click demo, exports, and offline support.

## Repairs

- Proof links now accept only full HTTP or HTTPS URLs. Unsafe and malformed
  values are rejected before saving, announced with recovery text, excluded
  from rendered links, and stripped from standalone HTML exports. Legacy local
  records receive the same output-time protection.
- Dark-theme tokens now resolve at `:root`. Navy surfaces use warm white text,
  danger text uses coral, success text uses mint, yellow controls keep navy
  text, and focus rings use yellow in dark mode.
- Amount due has a zero minimum and decimal step. Negative values are rejected,
  announced, and left out of storage. Currency codes are limited to three
  letters.
- Save, delivery, follow-up, and removal feedback is set before rendering, so
  the visible `role=status` region always describes the action just completed.
- Header, demo, and footer controls have 44px minimum touch targets at 390px.
- The unavailable Sociobot checkout returned HTTP 404 during reproduction.
  The paid offer, license traffic, and one-sheet limit were therefore removed.
  The complete tool now saves multiple handoffs for free without an account.
- Azure Static Web Apps now rewrites only known SPA routes. Unknown routes use
  the designed static 404 document with HTTP 404. The 404 stylesheet is external
  and compatible with the site CSP.
- Service-worker cache `invoice-handoff-v2` deletes obsolete product caches and
  uses network-first navigation, so deployed updates replace stale HTML while
  the cached shell remains available offline.
- Route changes focus and announce the new H1. The skip link works from the
  first keyboard tab. Public routes have route-specific titles and one H1.

## Regression coverage

`.factory/claims.json` declares eight claims, each with exactly one matching
Playwright test. New coverage proves real local-only storage, multiple free
handoffs, and safe proof-link handling. Additional tests cover negative amounts,
current action feedback, 44px mobile targets, route titles, keyboard focus,
reduced motion, SWA route policy, service-worker update cleanup, and axe scans
for both themes on the landing and demo pages at desktop and 390px.

## Local verification — 2026-08-28

- Clean install: `npm ci` — 24 packages audited, 0 vulnerabilities.
- Full integration/browser suite: `npm test` — 24 passed.
- Every command in `.factory/claims.json` was run independently — eight of
  eight passed.
- Type/lint: `npm run lint` and `npm run typecheck` — passed.
- Production build: `npm run build` — passed; `dist/index.html` present.
- Initial bundle: JS 21.46 kB raw / 7.80 kB gzip; CSS 11.65 kB raw / 3.24 kB
  gzip; hero image 59,652 bytes.
- Azure SWA emulator: `/`, `/demo`, `/app`, `/privacy`, and `/terms` returned
  200; `/not-a-real-page` returned 404 with the designed 404 title and H1.
- SWA emulator response policy included CSP, `X-Content-Type-Options: nosniff`,
  and `Referrer-Policy: strict-origin-when-cross-origin`.
- Browser review: 1440×1000 light landing and 390×844 dark demo had one H1,
  no horizontal overflow, and no console or page errors. Keyboard, reduced
  motion, offline reload, privacy request interception, downloads, and action
  errors are covered by the passing browser suite.
- Lighthouse 12.8.2 mobile at 390px: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.0 s, CLS 0, TBT 20 ms. Desktop:
  100/100/100/100; FCP 0.3 s, LCP 0.3 s, CLS 0, TBT 0 ms.

## Run and deploy

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
/opt/fleet/lib/deploy-static.sh invoice-handoff-sheet dist
```

Deployment output is still `dist/`, with `index.html` at its root.

## Known limits and next step

- Delivery evidence remains URL-based rather than a binary upload, matching the
  static local-first scope. Acceptance names and dates are records, not
  e-signatures.
- Paid access is intentionally absent because the production billing product is
  not registered. Reintroduce a paid tier only after its production checkout
  succeeds and add a live checkout claim test at the same time.
- No package/consumer test applies to this static-web artifact.
