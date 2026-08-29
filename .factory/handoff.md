# Invoice Handoff Sheet — review 2 handoff

## Work completed

Performed the requested adversarial first-read review without changing product
code. Wrote `.factory/review-2.md` with the complete cold-read result, copy
audit, sandbox/claims evidence, history check, route/structure review, and
verdict.

## Verification

- Fresh live Chromium checks at 390×844 and 1440×900: first screen clear;
  populated demo opens in one click; Reset reseeds demo storage only; requests
  are same-origin only.
- Fresh clone `/tmp/invoice-handoff-review-2.JP94eZ` at
  `9d7c0ed388279e24b65366d27ebd53407ed1cc7f`: `npm ci`, all ten exact
  `.factory/claims.json` commands, and `npm run build` passed.
- Repository checkout: `npm test` passed 30 Playwright tests; `npm run build`
  produced `dist/` (8.48 kB gzip JavaScript).
- Live crawl confirmed 200 for all application, sitemap, asset, and sample
  proof links; a missing route correctly returns the designed HTTP 404.

## Result and known gaps

Review verdict: **FAIL**. There are no blocking product defects, but nine
minor findings remain in `.factory/review-2.md`: route-specific metadata,
the incomplete static 404 shell, two plain-copy issues, four unlisted claims,
and README storage jargon. No product code was modified.

## Run

```bash
npm ci
npm test
npm run build
```

Demo: `/demo?demo=1`.
