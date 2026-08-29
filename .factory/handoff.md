# Invoice Handoff Sheet — polish 2 handoff

## Work completed

Resolved every finding in `.factory/review-1.md` and `.factory/review-2.md`
without changing the static-web artifact or the paper-ledger visual identity.

- Added route-specific descriptions and Open Graph/Twitter metadata for every
  application route.
- Rebuilt the static 404 with the standard accessible header, skip link,
  navigation, footer, focus treatment, dark mode, and mobile layout.
- Rewrote the two vague landing phrases and the README storage sentence.
- Added `demo-populated-sheet`, `complete-handoff-record`, and `demo-reset` to
  `.factory/claims.json`, each with exactly one observable Playwright test.
- Preserved and reverified all six Review 1 repairs, including the isolated demo,
  no-tracking proof, safe links, and undoable whole-handoff deletion.
- Updated `.factory/catalog-description.txt` to a 98-character verb-first line.

The repair artifact is commit `fb4e8084ca971974958903721e01a49989741dd3`.
It was pushed to `origin/main` and deployed through
`/opt/fleet/lib/deploy-static.sh invoice-handoff-sheet dist` on 2026-08-29 UTC.
Live: https://invoice-handoff-sheet.sociobot.in.

## Verification

- Fresh clone `/tmp/invoice-handoff-polish-2.ruY0Sb`: `npm ci`, all 13 exact
  claim commands, `npm run lint`, 34 tests, and `npm run build` passed at the
  deployed repair commit. The final repository suite has 35 tests after adding
  a static cumulative-copy regression; it also passes locally.
- Build output: `dist/index.html`; JavaScript 25.36 kB raw / 8.68 kB gzip; CSS
  12.11 kB raw / 3.34 kB gzip.
- Accessibility: four Playwright Axe scans passed in light/dark desktop/mobile;
  keyboard route focus, dialog focus/Escape, 44 px targets, reduced motion,
  one-H1/landmark structure, and 390 px overflow checks passed.
- Privacy/offline: same-origin-only request tests, demo/real namespace isolation,
  Reset demo preservation, safe proof links, and offline reload passed.
- `/opt/fleet/lib/verify-url.sh` passed locally and live with correct titles,
  `lang`, one H1, main landmark, labelled controls, alt text, and no product
  console errors. Evidence is in `.factory/evidence/polish-2/`.
- Live cold recheck passed on `/`, `/demo?demo=1`, `/app`, `/privacy`, `/terms`,
  and `/missing-polish-2-evidence` (HTTP 404). Metadata, focus/back restoration,
  complete sample data, reset isolation, mobile width, legal links, CSP,
  `X-Content-Type-Options`, and `Referrer-Policy` were verified.
- Live mobile Lighthouse: performance 100, accessibility 100, best practices
  100, SEO 100; FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 30 ms. Raw report:
  `.factory/evidence/polish-2/lighthouse-live.json`.

## Run and verify

```bash
npm ci
npm test
npm run lint
npm run build
```

Demo: `https://invoice-handoff-sheet.sociobot.in/demo?demo=1`.

## Known gaps and next steps

None found within the researched scope or cumulative reviews. No finding, test,
or deployment task is deferred.
