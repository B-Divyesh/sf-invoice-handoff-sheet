# Polish 3 — cumulative findings resolved

Base review commit: `5c8b91c0d2d9332762568ad9575aabcea76736f7`

Functional repair commit: `c41b97b9bf9d07f16b4ee0c227c72e016335c440`

Documented evidence commit: `ce8a075bdc459c1c463ee7fd99030176cc17c3b3`

Live: https://invoice-handoff-sheet.sociobot.in

Every finding in Reviews 1–3 was rechecked. The table records the retained or
new repair, its observable test, a captured live screen, and the cold live URL
check. No severity is deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the first-screen audience sentence concrete: delivery proof, invoice details, and follow-ups in one record. | Test: `sample delivery proof pages are shipped and landing facts include privacy, offline, and price`; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-mobile.png`; live `/` returned 200 and showed the exact sentence. |
| F-1-2 | Kept the section label `HANDOFF SHEET CONTENTS`; the former slogan and portal jargon remain absent. | Test: `cumulative review copy stays concrete and removes unsupported wording`; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-desktop.png`; live `/` showed the named section. |
| F-1-3 | Kept README wording “share with a client” and “saves handoffs in this browser.” | Test: `cumulative review copy stays concrete and removes unsupported wording`; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-mobile.png`; live `/` uses the same browser-storage term. |
| F-1-4 | Kept unsupported payment, reminder, debt, and legal-capability disclaimers out of visitor copy. | Test: `cumulative review copy stays concrete and removes unsupported wording`; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-desktop.png`; cold live landing contains only supported record capabilities. |
| F-1-5 | Kept the declared no-analytics/runtime-CDN claim and same-origin resource check. | Test: `@claim:no-runtime-tracking`; screenshot: `.factory/evidence/polish-3/live-privacy/screenshot-mobile.png`; the live suite observed only `https://invoice-handoff-sheet.sociobot.in` on `/` and `/demo?demo=1`. |
| F-1-6 | Kept confirmation, Escape cancellation, focused actions, one-record deletion, and immediate Undo. | Tests: `@claim:delete-handoff` and `whole-handoff deletion asks for confirmation, supports Escape, and restores focus`; screenshot: `.factory/evidence/polish-3/live-app/screenshot-mobile.png`; live `/app` passed both flows. |
| F-2-1 | Kept route-specific title, description, canonical, Open Graph, and Twitter metadata for every application route. | Test: `public routes have one h1 and route-specific titles and social metadata`; screenshot: `.factory/evidence/polish-3/live-privacy/screenshot-desktop.png`; live `/`, `/demo`, `/app`, `/privacy`, and `/terms` all passed. |
| F-2-2 | Kept the 404 skip link, standard header/navigation, legal footer links, focus treatment, dark mode, and mobile layout. | Test: `static deployment routes known pages and returns the complete accessible shell for unknown 404s`; screenshot: `.factory/evidence/polish-3/live-404/screenshot-mobile.png`; live `/missing-polish-3-evidence` returned HTTP 404. |
| F-2-3 | Kept the preview H2 `Handoff sheet contents.` | Test: `sample delivery proof pages are shipped and landing facts include privacy, offline, and price`; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-mobile.png`; live `/` exposed the H2 in the heading outline. |
| F-2-4 | Kept result-naming export copy for follow-up CSV and full handoff HTML. | Tests: `@claim:csv-export`, `@claim:shareable-html`, and the cumulative copy test; screenshot: `.factory/evidence/polish-3/live-landing/screenshot-mobile.png`; both live downloads passed. |
| F-2-5 | Kept the one-click populated-demo claim for the Moonbeam project, two milestones, invoice `MB-042`, and one follow-up. | Test: `@claim:demo-populated-sheet`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; live landing action opened `/demo?demo=1` with all sample data. |
| F-2-6 | Kept complete-record retention for proof, acceptance, invoice, payment instructions, and follow-ups after reload. | Test: `@claim:complete-handoff-record`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-desktop.png`; live `/demo?demo=1` retained the saved instruction and all categories. |
| F-2-7 | Kept the README feature inventory covered by the complete-record claim. | Test: `@claim:complete-handoff-record`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; the cold live sample exposed each listed category. |
| F-2-8 | Kept explicit Reset demo behavior that restores Moonbeam without changing the real namespace. | Test: `@claim:demo-reset`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; the live reset flow restored the sample and preserved byte-identical real storage. |
| F-2-9 | Kept plain README wording: “Handoff details stay in this browser.” | Test: `cumulative review copy stays concrete and removes unsupported wording`; screenshot: `.factory/evidence/polish-3/live-privacy/screenshot-mobile.png`; live `/privacy` uses the same result-focused language. |
| F-3-1 | **Start for real** now calls `resetDemo()` before routing to `/app`. It removes only `demo:invoice-handoff-sheet:sheets`, leaves real storage byte-identical, and a later demo visit seeds a fresh sample. Added a declared lifecycle claim. | Test: `@claim:demo-exit`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-mobile.png`; the production test started cold at `/demo?demo=1`, verified the key was absent after exit, then verified a fresh Moonbeam sample. |
| F-3-2 | Ordinary header and in-page Demo links no longer remove or reseed storage. Only the explicit Reset demo action does so. Added a declared navigation claim. | Test: `@claim:demo-navigation`; screenshot: `.factory/evidence/polish-3/live-demo/screenshot-desktop.png`; the production test preserved a unique saved edit through both links and removed it only after Reset demo. |

## Complete verification

- Clean clone at the documented evidence commit: all 15 exact claim commands,
  the full 37-test Playwright suite, lint, typecheck, and build passed.
- Production: the same 37-test suite passed against the live origin after
  deployment. It includes eight Axe runs, 390 px layout and touch targets,
  keyboard focus/history, offline reload, and same-origin privacy assertions.
- Local and live route captures under `.factory/evidence/polish-3/` report no
  console errors and one H1/main landmark on every checked page.
- Live Lighthouse scored 100 in all four categories; LCP 1.2 s, CLS 0, and
  TBT 80 ms. Raw report: `.factory/evidence/polish-3/lighthouse-live.json`.
- The catalog line is a 97-character verb-first sentence. The copy audit has
  no sentence over 22 words and no banned term.

No cumulative finding or additional controller requirement remains open.
