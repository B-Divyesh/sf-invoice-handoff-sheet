# Record delivery, invoice, and payment follow-up — verification 8

Verified 2026-09-06 UTC against
`https://invoice-handoff-sheet.sociobot.in`.

## Verdict

**PASS — zero findings of every severity and zero untested public claims.**

- Finding count: **0**.
- Untested claim count: **0**.
- Implementation reviewed: `464557ef15817cd2d5b00a6415368b14bec5d429`.
- Test-only candidate: `97e4a6a889135fab3372e5badf346d967e88b52f`.
- Documentation head: `5309479417aa1af75887ccc31d3d519aa78aa503`.
- Live deployment: `48c6f9dd-17d2-46df-8c7d-88c1f8bf3286`.

The product is a static, browser-local utility. Product files do not differ
between the implementation commit and documentation head. All 14 publicly
served build files byte-match a fresh build from the documentation head.
`staticwebapp.config.json` is the deployment control file and is not a public
runtime asset.

## First screen before scrolling

Fresh Chromium contexts were opened at 1440 × 900 and 390 × 844. Both began at
scroll position zero, had no horizontal overflow, and showed the primary action
fully inside the viewport.

| Question | Live answer |
| --- | --- |
| Job | **Record work before chasing payment.** |
| Audience | Freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record. |
| First action | **Try it with sample data.** The adjacent text says it opens a finished client handoff. |

The same screen states three facts: saved in this browser, works offline after
the first visit, and free to use. The title names the job: `Invoice Handoff
Sheet — Delivery and payment record`.

## One-click sample and data boundary

One click opened `/demo?demo=1` with the persistent notice **DEMO — Sample
data. Nothing is saved to your real sheets**, plus **Reset demo** and **Start
for real**.

The finished sample contained:

- project `Moonbeam Studio website launch` for `Moonbeam Studio`;
- invoice `MB-042`, amount `2400.00 USD`, bank-transfer instructions, and a
  past-due state;
- two delivery milestones, including Taylor Morgan's recorded acceptance;
- two working same-origin proof pages; and
- one realistic email follow-up with an awaiting-reply outcome.

The demo notice survived reload. In fresh desktop and phone contexts, a saved
sample edit was reset to the original Moonbeam record. A sentinel in
`invoice-handoff-sheet:sheets` remained byte-for-byte unchanged, while the
separate `demo:invoice-handoff-sheet:sheets` key was reseeded. Every request
observed during the flow stayed on the product origin. The contexts were then
closed, so no visitor or operator data was changed.

## Declared claims

A new clone of `origin/main` at documentation commit `5309479` was prepared
with `npm ci`. It installed 23 packages with zero audit vulnerabilities. Every
exact command from `.factory/claims.json` then ran separately and passed.

| Claim | Exact command | Result |
| --- | --- | --- |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS |
| `shareable-html` | `npm test -- --grep @claim:shareable-html` | PASS |
| `print-pdf` | `npm test -- --grep @claim:print-pdf` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `local-storage` | `npm test -- --grep @claim:local-storage` | PASS |
| `private-demo` | `npm test -- --grep @claim:private-demo` | PASS |
| `no-runtime-tracking` | `npm test -- --grep @claim:no-runtime-tracking` | PASS |
| `local-first-real` | `npm test -- --grep @claim:local-first-real` | PASS |
| `unlimited-handoffs` | `npm test -- --grep @claim:unlimited-handoffs` | PASS |
| `safe-proof-links` | `npm test -- --grep @claim:safe-proof-links` | PASS |
| `delete-handoff` | `npm test -- --grep @claim:delete-handoff` | PASS |
| `demo-populated-sheet` | `npm test -- --grep @claim:demo-populated-sheet` | PASS |
| `complete-handoff-record` | `npm test -- --grep @claim:complete-handoff-record` | PASS |
| `demo-reset` | `npm test -- --grep @claim:demo-reset` | PASS |
| `demo-exit` | `npm test -- --grep @claim:demo-exit` | PASS |
| `demo-navigation` | `npm test -- --grep @claim:demo-navigation` | PASS |

The manifest has 16 unique IDs. The test tree has 16 unique `@claim:` tags,
each appearing exactly once, with no missing or extra tag. Landing, demo,
privacy, terms, README, and demo-documentation copy were cross-checked against
the manifest. No missing, false, incomplete, or untested public claim was
found.

## Product paths and recovery

The clean local suite and the production suite each passed **51/51** tests.
They cover these observable paths:

- Normal: create a real handoff, save project and client details, add delivery
  and follow-up records, reload, and retain the record.
- Output: export formula-safe CSV, download complete standalone HTML, and call
  the browser print/PDF path.
- Invalid: reject negative amounts, malformed links, `javascript:` proof
  links, and missing required delivery or follow-up fields with announced
  guidance.
- Boundary: retain a zero amount, use local calendar days across Los Angeles
  and Kiritimati, and use singular one-day labels.
- Recovery: preserve unsaved valid sheet fields when adding a delivery, retain
  keyboard focus after dynamic actions, confirm whole-record deletion, cancel
  with Escape, restore focus, and Undo record or row removal.
- Demo: browser Back keeps demo mode and its namespace; ordinary Demo links
  keep edits; Reset demo restores only the sample; Start for real discards the
  demo key and leaves real data unchanged.
- Offline/update: service-worker activation replaces stale cache `v3` with
  `v4`; the demo and both proof routes then reload offline.

## Accessibility, mobile, and motion

- The full production suite ran 16 Axe checks: light and dark treatment across
  desktop and 390 px landing, demo, and both proof routes. No serious or
  critical violation was found.
- The worker URL verifier passed `/`, `/demo?demo=1`, `/app`, `/privacy`,
  `/terms`, both proof pages, and `/404.html`: each had a title, `lang=en`, one
  H1, a main landmark, alt coverage, labelled buttons, and no console or page
  error.
- Keyboard checks exposed the skip link on first Tab, moved focus to the H1,
  operated route links, kept focus after record changes, moved focus into the
  named native modal, handled Escape, and restored focus after closing it.
- Every visible control on all public routes measured at least 44 × 44 CSS px
  at 390 px. Task and navigation text measured at least 17 px. The phone layout
  had no page-level horizontal overflow; the data table has its own scroll
  container.
- A 640 CSS-pixel layout, equivalent to a 1280 px browser at 200% zoom, kept all
  eight checked routes readable with visible H1s and no page overflow.
- Focus outlines are 3 px. Their lowest measured contrast is 4.58:1 in light
  mode and 9.31:1 in dark mode.
- With reduced motion requested, all computed animation and transition
  durations were zero.

## Routes, links, privacy, and security

`/`, `/demo?demo=1`, `/app`, `/privacy`, `/terms`, and both proof routes return
200 with their own title, H1, main landmark, description, canonical metadata,
and product shell. Every discovered internal link returned 200. Both proof
pages provide **Return to sample handoff**.

A fresh unknown URL returned the expected HTTP 404. It showed `Page not found —
Invoice Handoff Sheet`, one H1, header, navigation, main, footer, and **Go to
handoffs**. This deliberate 404 is expected and is not a defect.

The live response sets HSTS, `nosniff`, strict-origin referrer policy, and a
self-only CSP including `frame-ancestors 'none'`. Hashed assets use a one-year
immutable cache. No console error or blocked resource was observed.

The privacy page says that handoff details stay in the browser, that no
analytics runs, and that local records can be removed through browser settings.
Because the product has no accounts or server-side user store, there is no
remote privacy-request or tenant-data path to exercise. Fresh request logs and
the privacy claims confirmed same-origin traffic only.

## Visual system, copy, and documentation

The live paper-ledger interface matches `.factory/design.md`: warm paper,
navy ink, yellow markers, red payment state, squared controls, local system
type, and a short stamp motion only when reduced motion is not requested. The
generated clipboard illustration is product-specific, credited in the footer,
and its provenance is recorded. The result is not a default framework or
generic gradient layout.

The first screen, section headings, actions, errors, legal pages, and README use
plain task words. `.factory/copy-audit.md` reports no sentence over 22 words and
no banned word. The required landing order, live product preview, three-step
explanation, limits, free access section, and footer are present. `README.md`
documents the audience, run, test, build, privacy, and deploy steps; `LICENSE`
is MIT; `/privacy` and `/terms` are complete public routes.

## Performance and build

- `npm test`: PASS, 51/51.
- `CI=1 npm run test:live`: PASS, 51/51.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS with `dist/index.html` at the root.
- JavaScript: 26.36 kB raw / 9.00 kB gzip.
- CSS: 13.00 kB raw / 3.51 kB gzip.
- Hero image: 59,652 bytes. No web font is shipped.
- Fresh live Lighthouse 13.0.1: Performance **100**, Accessibility **100**,
  Best Practices **100**, SEO **100**. FCP 0.9 s, LCP 1.1 s, TBT 30 ms, CLS 0,
  total transfer 72 KiB.

## Earlier finding disposition

Every earlier verification and review report was inspected. The current live
evidence proves these dispositions.

| Earlier finding | Current disposition and evidence |
| --- | --- |
| Initial — broken $19 checkout | Resolved by removing the unready paid offer. Current landing, README, app, and terms advertise a free tool only; `unlimited-handoffs` confirms multiple records and no buy, checkout, account, or license controls. |
| Initial — dark theme contrast | Resolved. The light/dark Axe matrix passes and Lighthouse accessibility is 100. |
| Initial — executable proof URLs | Resolved by `safe-proof-links`, including unsafe stored legacy data and exported HTML. |
| Initial — invalid negative amount and malformed evidence | Resolved by negative-amount and unsafe-link recovery tests with announced messages and unchanged storage. |
| Initial — invisible license error and stale action feedback | The removed paid surface has no license form. Current delivery and follow-up actions announce their own result; feedback regression passes. |
| Initial — undersized mobile targets | Resolved by the all-route, two-dimension 44 px regression. |
| Initial — untested storage, price, and tier claims | Resolved. Sixteen current claims each have one passing test; no paid-tier statement remains. |
| Initial — false 200 for unknown routes | Resolved. A fresh unknown URL returns the designed HTTP 404. |
| Verification 2 — Back crossed the demo/real boundary | Resolved by `local-storage`; Back restores demo mode, banner, and namespace. |
| Verification 2 — adding delivery discarded unsaved fields | Resolved by the unsaved-field regression. |
| Verification 2 — dead sample proof links | Resolved. Both same-origin proof URLs return 200 and work offline. |
| Verification 2 — dynamic actions lost keyboard focus | Resolved by focus retention and route-heading keyboard tests. |
| Verification 2 — destructive removal lacked confirmation or Undo | Resolved by `delete-handoff` plus dialog, Escape, focus-return, and row Undo tests. |
| Verification 2 — first screen missed offline and price facts | Resolved. Both facts are visible before scrolling on phone and desktop. |
| Verification 2 — incomplete 404 metadata | Resolved. The designed 404 has route metadata and the full shell. |
| Review 1 F-1-1 — vague “calm record” | Replaced with the concrete audience sentence verified above. |
| Review 1 F-1-2 — slogan/jargon preview label | Replaced with **Handoff sheet contents**. |
| Review 1 F-1-3 — README jargon | Replaced with “share with a client” and “saves handoffs in this browser.” |
| Review 1 F-1-4 — unlisted negative capability disclaimer | The unsupported negative sentence was removed. |
| Review 1 F-1-5 — unlisted analytics/CDN statement | Resolved by `no-runtime-tracking`. |
| Review 1 F-1-6 — no whole-handoff deletion | Resolved by confirmed delete and Undo. |
| Review 2 F-2-1 — landing metadata leaked to other routes | Resolved by route-specific title, description, canonical, Open Graph, and Twitter metadata checks. |
| Review 2 F-2-2 — 404 lacked the standard shell | Resolved; the live 404 has skip link, header, nav, main, footer, legal links, and return path. |
| Review 2 F-2-3 — preview heading did not name its section | Resolved with **Handoff sheet contents**. |
| Review 2 F-2-4 — vague export wording | Resolved with explicit CSV and full-handoff HTML wording. |
| Review 2 F-2-5 — unlisted populated-demo promise | Resolved by `demo-populated-sheet`. |
| Review 2 F-2-6/F-2-7 — unlisted complete-record claims | Resolved by `complete-handoff-record`, including proof, acceptance, invoice, instructions, follow-up, save, and reload. |
| Review 2 F-2-8 — untested reset promise | Resolved by `demo-reset`. |
| Review 2 F-2-9 — privacy storage jargon | README now says details stay in this browser. |
| Review 3 F-3-1 — Start for real retained demo data | Resolved by `demo-exit`. |
| Review 3 F-3-2 — Demo navigation silently deleted edits | Resolved by `demo-navigation`; only Reset demo reseeds. |
| Verification 5 — narrow targets and small mobile text | Resolved by all-route 44 px and 17 px regressions. |
| Verification 6 — sample action below short laptop fold | Resolved at 1280 × 720 and reconfirmed at 1440 × 900 and 390 × 844. |
| Verification 6 — wrong local due day and plural | Resolved across Los Angeles and Kiritimati with one-day singular boundaries. |
| Verification 6 — print/PDF missing from claim manifest | Resolved by `print-pdf`. |
| Verification 6 — CSV formula prefixes | Resolved by `csv-export`, which neutralizes `=`, `+`, `-`, and `@` prefixes. |
| Verification 6 — required fields not explained | Resolved with visible required guidance, native `required`, descriptions, and announced errors. |
| Review 5 R5-1 — proof pages lacked product shell | Resolved. Both live proof pages now have the shell, metadata, styling, favicon, skip link, and return path; live URL, Axe, mobile, and offline checks pass. |

Verification 3, Verification 4, Verification 7, and Review 4 were PASS reports
with no findings to carry forward. Reviews 1–3 and Review 5 findings are all
listed above, including every minor finding.

## Applicability and evidence

The product has no backend, API, tenant system, authentication, server-side
state, payment flow, runtime AI, CLI, library, desktop package, or shared
database. Backend tenant isolation, restart persistence, health, 429 and
`Retry-After`, consumer installation, and paid-license checks are therefore not
applicable. The structured local record does not need an AI step to complete
the researched job.

Fresh screenshots, URL-verifier output, and Lighthouse JSON are under
`/work/.evidence/verification-8/`. The required report copy and machine result
are `/work/.evidence/qa-report.md` and `/work/.evidence/qa-result.json`.

No known product gap remains within the assigned scope.
