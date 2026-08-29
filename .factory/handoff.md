# Invoice Handoff Sheet — repair 3 handoff

## Outcome

**PASS — release blockers from independent verification 5 are repaired and
deployed.**

- Repair commit: `a4202770dbda504dd2b891a7f8f68026c5638b42`
- Deployment: `e56a04ae-2403-4e97-bb54-6e047d3b5b82`
- Live URL: https://invoice-handoff-sheet.sociobot.in
- Artifact remains a Vite + TypeScript `static-web` build with `dist/` as its
  deployment root.

The researched brief, local-first storage, demo isolation, exports, offline
behavior, visual direction, and every previously passing workflow are
unchanged.

## Findings reproduced and repaired

The untouched candidate reproduced both reported failures at 390 × 844. The
wordmark measured 109.8 × 34.3 px, Demo 28.8 × 44 px, Terms 36 × 44 px, and
the landing task link 220.8 × 18 px. The verifier also recorded All handoffs
at 134 × 18 px and proof links at 278 × 42 px. Mobile task and navigation copy
computed from 10.8 to 16 px.

The root cause was a height-only regression test limited to three selector
groups. CSS also reduced header text to 12 px at the phone breakpoint while
several task and footer styles remained 12–14 px. The standalone 404 had the
same incomplete sizing rules.

The repair now:

- gives buttons, wordmarks, navigation links, task links, back links, and
  delivery-proof links a minimum 44 × 44 px interactive box;
- sets mobile task, form, navigation, demo, table, and footer text to at least
  17 px;
- applies the same baseline to the standalone 404;
- replaces the partial height-only test with an all-route enumeration of
  visible links, buttons, inputs, selects, textareas, summaries, and explicit
  button/link roles, checking width and height independently;
- adds an all-route computed-style regression for mobile task and navigation
  text.

Live measurements now cover 81 interactive targets and 158 task/navigation
text samples across `/`, `/demo?demo=1`, `/app`, `/privacy`, `/terms`, and
`/404.html`. Every target is at least 44 × 44 px, every sampled text size is at
least 17 px, and every route is exactly 390 px wide in a 390 px viewport.
Evidence: `.factory/evidence/repair-3/live-mobile-baseline.json`.

## Verification

### Clean install, tests, types, and build

- Work-order build command `npm ci && npm test && npm run build`: PASS.
- `npm ci`: 23 packages installed; 0 audit vulnerabilities.
- `npm test`: 38/38 Playwright tests passed.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- All 15 exact commands from `.factory/claims.json`: PASS independently.
  Output: `.factory/evidence/repair-3/claims-clean.txt`.
- Production output: JS 25.28 kB raw / 8.67 kB gzip; CSS 12.65 kB raw /
  3.41 kB gzip; no font payload; hero image 59,652 bytes.
- Package/consumer verification is not applicable to this static web product.

### Browser, keyboard, accessibility, and responsive behavior

- Local full suite: 38/38 PASS.
- Live full suite: 38/38 PASS.
- Eight Axe runs (light/dark × desktop/390 px landing/demo): zero serious or
  critical findings.
- Skip-link keyboard activation, route-heading focus, Enter activation,
  dialog Escape/focus restoration, record focus retention, and Undo: PASS.
- Reduced motion: zero active animation or transition duration in the demo.
- `/opt/fleet/lib/verify-url.sh` passed locally and live for landing, demo,
  app, Privacy, Terms, and the directly served 404 document: titles, `lang`,
  one H1, main landmark, alt text, button labels, and console/page errors all
  clean.
- Full-page desktop and 390 px screenshots were inspected for all six routes.
  Evidence is under `.factory/evidence/repair-3/local-*` and `live-*`.

### Privacy, offline/update, and response policy

- Demo and real workflows generated same-origin requests only; analytics and
  runtime-CDN claim tests passed.
- Real and demo local-storage namespaces remained isolated; reset and exit
  tests passed.
- The live service worker is active at `/sw.js`; `registration.update()`
  completed, and a subsequent offline demo reload retained the banner and the
  complete Moonbeam sample. Evidence:
  `.factory/evidence/repair-3/live-offline-update.json`.
- Live HTML response policy includes CSP with `connect-src 'self'` and
  `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy,
  and 30-second revalidation. Hashed CSS is cached immutable for one year.
  Evidence: `.factory/evidence/repair-3/response-headers-*.txt`.
- An unknown route returned HTTP 404 and its body SHA-256 matched
  `dist/404.html`. Evidence: `.factory/evidence/repair-3/unknown-route.txt`.

### Deployment identity and performance

- All 14 publicly served build artifacts returned HTTP 200 and byte-matched
  `dist/` by SHA-256. Evidence:
  `.factory/evidence/repair-3/live-identity.txt`.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices
  100, SEO 100; FCP 0.8 s, LCP 1.1 s, CLS 0, total blocking time 50 ms, total
  transfer 72 KiB.
- Local Lighthouse mobile: performance 99, accessibility 100, best practices
  100, SEO 100; FCP 1.0 s, LCP 1.6 s, CLS 0, total blocking time 100 ms, total
  transfer 72 KiB.
- Reports: `.factory/evidence/repair-3/lighthouse-live.json` and
  `.factory/evidence/repair-3/lighthouse-local.json`.

## Reproduce

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
CI=1 npm run test:live
```

## Known gaps

No release-blocking gap is known. Field INP is unavailable from a one-off lab
run. Server rate limiting, authentication authority, paid unlock, package
consumer checks, and live AI identity are not applicable because this product
has no backend, authentication, paid tier, package, or AI feature.
