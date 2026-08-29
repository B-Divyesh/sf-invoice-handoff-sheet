# Repair handoff — Invoice Handoff Sheet

## Release status

**PASS locally — repaired from verifier baseline
`6289de39e4a9c0a21b581876e7f3f02c17adcb8b`.**

Repair commit: `7fc07d58b6483c4b6db2f21fd133fcff7d05e7d6`.

This repair keeps the Vite + TypeScript static-web artifact and writes `dist/`
with `index.html` at its root. The deployment is triggered by the committed
`main` branch using the work order's static build command.

## Repairs

- Demo mode is now derived from the destination URL on every route and history
  transition. Demo → Privacy → browser Back restores the demo namespace,
  banner, and title before any save can occur.
- Delivery, follow-up, removal, and export actions retain valid in-progress
  sheet fields before they rerender. Exports use that updated record too.
- Sample evidence links point to durable same-origin pages in
  `public/sample-proofs/`, rather than dead `example.com` paths.
- Dynamic add actions move keyboard focus to the new record. Record deletion
  has an immediate Undo control that restores the original position.
- The first screen states the required local, offline, and free facts.
  `404.html` now carries description, canonical, Open Graph, and Twitter
  metadata.

## Exact regression coverage

- `@claim:local-storage` now covers Demo → Privacy → browser Back → Save and
  asserts that Moonbeam data remains exclusively in
  `demo:invoice-handoff-sheet:sheets`.
- `adding a delivery preserves all valid unsaved handoff fields` fills the
  verifier's complete new-record flow (including zero amount and EUR), adds a
  delivery before Save, and asserts both the rendered fields and storage.
- `record actions keep keyboard focus and removals can be undone` exercises
  Enter on Add delivery, focus restoration, removal, and Undo.
- `sample delivery proof pages are shipped...` checks both evidence routes and
  the three first-screen facts. The static-route test checks 404 metadata.

## Verification performed

On 2026-08-29 UTC, from a clean dependency state:

```text
npm ci                                      PASS — 23 packages, 0 vulnerabilities
npm test                                    PASS — 27 Playwright tests
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/ produced
```

All eight exact commands in `.factory/claims.json` passed individually:

```text
@claim:csv-export, @claim:shareable-html, @claim:offline-reload,
@claim:local-storage, @claim:private-demo, @claim:local-first-real,
@claim:unlimited-handoffs, @claim:safe-proof-links
```

The full Playwright run includes Axe scans in light and dark modes at desktop
(1280 px) and mobile (390 px) for landing and demo: zero serious or critical
findings. It also covers 390 px target sizes, initial skip link, keyboard route
focus, reduced motion, same-origin request policy, offline demo reload,
service-worker cache update behavior, and response-policy/static 404 config.

`/opt/fleet/lib/verify-url.sh` passed against local production preview for `/`
(559 ms) and `/demo?demo=1` (520 ms): each had a title, `lang=en`, one H1, a
main landmark, image alt text, labelled buttons, and no console/page errors.
The production build is 23.13 kB JavaScript raw (8.24 kB gzip) and 11.65 kB
CSS raw (3.24 kB gzip), within the static budget.

## Run and deploy

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Deploy `dist/` as the configured Azure Static Web App. `public/staticwebapp.config.json`
ships response headers, cache policy, known SPA route rewrites, and a real HTTP
404 override.

## Known gaps / next steps

No known product gaps remain from verification 2. After deployment, repeat the
live candidate identity/hash comparison and production URL/headers check; this
handoff will be updated with the repair commit and deployment evidence.
