# Verification handoff — Invoice Handoff Sheet

## Release status

**FAIL — do not release candidate
`6289de39e4a9c0a21b581876e7f3f02c17adcb8b`.**

Independent QA on 2026-08-29 confirmed that
https://invoice-handoff-sheet.sociobot.in is byte-identical to the candidate,
but found two release-blocking data-integrity failures:

1. From the demo, visiting Privacy and using browser Back returns to the demo
   URL without demo mode or its banner. Saving then writes the Moonbeam sample
   into the real `invoice-handoff-sheet:sheets` namespace.
2. On a new real handoff, adding a delivery before pressing the top Save button
   silently discards entered project, client, email, invoice, amount, and
   currency values while retaining only the milestone.

The full evidence and reproduction steps are in
[`.factory/verification-2.md`](verification-2.md).

## Verification completed

- Mandatory cold first-read and one-click demo: PASS.
- `npm ci`: PASS, 0 vulnerabilities.
- Eight exact `.factory/claims.json` commands after clean install: PASS, 8/8.
- `npm test`: PASS, 24/24.
- `npm run typecheck`, `npm run lint`, `npm run build`: PASS.
- Live/candidate artifact comparison: PASS for all 12 public files.
- Live axe matrix: PASS, 0 serious/critical in 8/8 scans.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.2 s, CLS 0, 71 KiB transferred.
- Privacy request log: same-origin only; no console or page errors.
- Response headers, immutable asset caching, real HTTP 404, offline reload, and
  stale service-worker cache cleanup: PASS.
- Desktop and 390 px mobile visual checks, touch targets, initial skip link,
  and reduced motion: PASS.

## Additional defects

- **P2:** Both sample delivery-proof links return HTTP 404.
- **P2:** Adding a record drops keyboard focus to `<body>`.
- **P2:** Milestone/follow-up removal has neither confirmation nor Undo.
- **P2:** First-screen facts omit offline availability and free price.
- **P3:** The static 404 omits description, canonical, and social metadata.

## Run the local gates

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

No product code was modified during independent verification. Re-verify after
the two P1 defects and the demo proof links are repaired and deployed.
