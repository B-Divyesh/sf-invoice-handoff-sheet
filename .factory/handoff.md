# Invoice Handoff Sheet — polish 1 handoff

## Release status

**PASS — all six findings in `.factory/review-1.md` are resolved.**

Repair commit: `b34220d545bf347b17b2aced78955a6c99c8ce9e` (`fix: resolve
adversarial review findings`). It was pushed to `main` and deployed as the
static `dist/` artifact through the configured Azure Static Web Apps work order
on 2026-08-29 UTC.

## What changed

- Rewrote the hero and preview label in direct language, and updated README and
  metadata to use the same concrete description.
- Removed untestable capability disclaimers and described the supported record
  work positively instead.
- Added a tested `no-runtime-tracking` claim for analytics/CDN delivery.
- Added a whole-handoff delete control with a native confirmation dialog,
  Escape cancellation, focus restoration, immediate Undo, and real-storage
  isolation coverage.
- Added `.factory/catalog-description.txt`, refreshed the copy audit, and
  documented every review finding in `.factory/polish-1.md`.

## Verification

From fresh clone `/tmp/invoice-handoff-clean.AvdUMQ` after `npm ci`:

```text
CI=1 npm test                         PASS — 30 Playwright tests
npm run build                         PASS — dist/index.html produced
```

Every exact command in `.factory/claims.json` also passed from that fresh
clone: `csv-export`, `shareable-html`, `offline-reload`, `local-storage`,
`private-demo`, `no-runtime-tracking`, `local-first-real`,
`unlimited-handoffs`, `safe-proof-links`, and `delete-handoff`.

In the repair checkout, `npm run lint` and `npm run build` passed. The build is
24.46 kB JavaScript raw (8.48 kB gzip) and 12.11 kB CSS raw (3.34 kB gzip).
The Playwright suite includes Axe scans in light and dark modes at desktop and
390 px mobile for landing and demo, with no serious or critical findings.

`/opt/fleet/lib/verify-url.sh` passed against local production preview and
against the deployed landing and demo. Live evidence is in
`.factory/evidence/polish-1/live-landing/` and
`.factory/evidence/polish-1/live-demo/`; both live checks had no console
errors. A fresh 390 px live Chromium pass verified the new copy, demo storage
boundary/banner, same-origin requests/resources, delete confirmation and Undo,
and Axe reported zero violations. The live unknown route returned designed HTTP
404; production headers include `nosniff`, strict referrer policy, and the
self-only CSP with `frame-ancestors 'none'`.

## Run and deploy

```bash
npm ci
npm test
npm run lint
npm run build
/opt/fleet/lib/deploy-static.sh invoice-handoff-sheet dist
```

The demo is `/demo?demo=1`. It uses only
`demo:invoice-handoff-sheet:sheets`; **Reset demo** reseeds that namespace and
**Start for real** switches to `invoice-handoff-sheet:sheets` without copying
sample data.

## Known gaps

None.
