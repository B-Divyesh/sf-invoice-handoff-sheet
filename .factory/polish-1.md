# Polish 1 — review findings resolved

Candidate repaired from review commit `deda8faf35fac8dfd6fa575af48b6716db08fe9b`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced the vague hero phrase with concrete delivery proof, invoice details, and follow-ups. | `tests/repair.spec.ts` — `sample delivery proof pages are shipped and landing facts include privacy, offline, and price`; local mobile screenshot: `.factory/evidence/polish-1/local-landing/screenshot-mobile.png`. |
| F-1-2 | Replaced the slogan eyebrow with `HANDOFF SHEET CONTENTS`. | Same landing-copy regression test; local desktop screenshot: `.factory/evidence/polish-1/local-landing/screenshot-desktop.png`. |
| F-1-3 | Rewrote README opening and browser-storage wording in plain language; updated page metadata to use the same concrete description. | README review and `.factory/copy-audit.md`; `npm run build` passes. |
| F-1-4 | Removed the untestable negative capability wording from landing, README, and terms. The landing now describes the supported record work positively. | `tests/repair.spec.ts` landing-copy regression; `.factory/claims.json` cross-check has no scope-only claim. |
| F-1-5 | Added the `no-runtime-tracking` claim and an observable fresh landing/demo request-and-resource test. | `npm test -- --grep @claim:no-runtime-tracking`; `.factory/claims.json`; local verify reports show no console errors. |
| F-1-6 | Added an accessible whole-handoff delete control, native modal confirmation, Escape cancellation, immediate Undo, and real-storage isolation coverage. | `npm test -- --grep @claim:delete-handoff`; `whole-handoff deletion asks for confirmation, supports Escape, and restores focus`; local demo screenshot: `.factory/evidence/polish-1/local-demo/screenshot-mobile.png`. |

## Local verification

- `CI=1 npm test` — 30 Playwright tests passed, including Axe scans in light/dark desktop and mobile contexts.
- All ten exact commands declared by `.factory/claims.json` passed, including the two new claim tests.
- `npm run lint` and `npm run build` passed; the build output is `dist/` with 8.48 kB gzip JavaScript and 3.34 kB gzip CSS.
- `/opt/fleet/lib/verify-url.sh` passed against local production preview for `/` and `/demo?demo=1`; reports are at `.factory/evidence/polish-1/local-landing/verify.json` and `.factory/evidence/polish-1/local-demo/verify.json`.

## Live verification

Deployment and cold live recheck will be recorded here and in `.factory/handoff.md` after the configured Azure Static Web Apps upload completes.
