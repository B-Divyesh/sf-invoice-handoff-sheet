# Invoice Handoff Sheet — polish 3 handoff

## Outcome

**PASS — no review finding remains.** Functional repair commit
`c41b97b9bf9d07f16b4ee0c227c72e016335c440` was pushed to `origin/main` and
deployed as Azure Static Web Apps deployment
`a43a7fbc-95ec-4d39-8d75-e01c5bb023e7` on 2026-08-29 UTC.

Live: https://invoice-handoff-sheet.sociobot.in

The repair preserves the static-web artifact and the paper-ledger,
neo-brutalist visual system. **Start for real** now discards only the demo
namespace before opening real handoffs. Ordinary **Demo** links preserve saved
sample edits; only **Reset demo** reseeds the sample.

## Verification evidence

- Clean clone `/tmp/invoice-handoff-polish-3-clean.OGnRYn/repo` at the repair
  commit: `npm ci` installed 23 locked packages with zero vulnerabilities.
- Every one of the 15 exact commands in `.factory/claims.json` passed
  independently from that clone. Each `@claim:<id>` occurs exactly once.
- Clean-clone `CI=1 npm test`: 37/37 passed. `npm run lint`,
  `npm run typecheck`, and `npm run build` also passed.
- The production build contains 25.28 kB raw / 8.67 kB gzip JavaScript and
  12.11 kB raw / 3.34 kB gzip CSS. The hero WebP is 59,652 bytes.
- Local and live `/opt/fleet/lib/verify-url.sh` checks passed for landing,
  demo, app, Privacy, Terms, and the designed 404 document. Every check found
  one H1, `lang=en`, a main landmark, labelled controls, alt text, and zero
  console errors. Screenshots and reports are in `.factory/evidence/polish-3/`.
- `CI=1 npm run test:live`: 37/37 passed against the public HTTPS origin. This
  covers the real demo exit/reset/navigation lifecycle, browser storage,
  exports, offline reload, request privacy, route metadata, focus/history,
  responsive layout, reduced motion, and eight light/dark desktop/mobile Axe
  scans with no serious or critical findings.
- The cold unknown URL
  `https://invoice-handoff-sheet.sociobot.in/missing-polish-3-evidence`
  returned HTTP 404 with the complete accessible shell. All five application
  routes returned HTTP 200.
- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.6 s, CLS 0, TBT 0 ms.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.8 s, LCP 1.2 s, CLS 0, TBT 80 ms.
- Live responses include the self-only CSP, `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. Hashed assets have the
  one-year immutable cache policy.

## Run and verify

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run test:live
```

Demo: `https://invoice-handoff-sheet.sociobot.in/demo?demo=1`.

## Known gaps and next steps

None. No blocking or minor finding, test, documentation task, or deployment
check is deferred.
