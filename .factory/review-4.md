# Review 4 — adversarial first read

**Verdict: PASS.** Zero blocking or minor findings remain, and every declared claim was tested. Reviewed 2026-08-29 UTC at `https://invoice-handoff-sheet.sociobot.in` in fresh Chromium contexts at 390 × 844 and 1440 × 1000, plus a clean clone at `f37f6d2a43ac77e0dcbe9f6a3cebe9ecab5547e0`. This review did not modify product code.

## Cold first read

Before scrolling at both widths:

- **What it does:** records delivered work before payment follow-up, keeping delivery proof, invoice details, and follow-ups in one record.
- **For whom:** freelancers and small agencies.
- **First click:** **Try it with sample data**; adjacent copy says, “Opens a finished client handoff.”

The primary mobile action is fully in the first viewport. The landing made four initial requests (document, JS, CSS, product illustration), all same-origin, with no console or page errors. This is not a first-screen blocking failure.

## Copy audit

Word counts use visible words. Navigation labels and the wordmark are labels; result-bearing actions, headings, and example-record labels are included. No item is over 22 words. No jargon, banned marketing adjective, inconsistent term, empty/mood heading, or non-result-naming action was found. No rewrite is needed.

### Landing page

| Sentence or action | Words | Flag |
| --- | ---: | --- |
| DELIVERY → INVOICE → FOLLOW-UP | 3 | — |
| Record work before chasing payment. | 5 | — |
| For freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record. | 16 | — |
| Try it with sample data | 5 | — |
| Opens a finished client handoff. | 5 | — |
| Saved in this browser | 4 | — |
| Works offline after first visit | 5 | — |
| Free to use | 3 | — |
| HANDOFF SHEET CONTENTS | 3 | — |
| Handoff sheet contents. | 3 | — |
| Delivery proof, invoice details, payment instructions, and every follow-up stay together. | 10 | — |
| Open the sample sheet | 4 | — |
| PAST DUE · Aug 24, 2026 | 5 | — |
| Final site delivered | 3 | — |
| Taylor accepted review | 3 | — |
| Follow-up sent Aug 25 | 4 | — |
| HOW IT WORKS | 3 | — |
| Make a record in three steps. | 7 | — |
| Add the delivery. | 3 | — |
| List each milestone and its proof link. | 7 | — |
| Add the invoice. | 3 | — |
| State the invoice, due date, amount, and payment instructions. | 9 | — |
| Log the follow-up. | 4 | — |
| Export follow-ups as CSV or download the full handoff as HTML. | 11 | — |
| Keep the handoff record together. | 5 | — |
| Record delivery proof, invoice details, payment instructions, and follow-ups in the same sheet. | 13 | — |
| NO ACCOUNT NEEDED | 3 | — |
| Save as many handoffs as you need. | 7 | — |
| The full sheet and both exports are free to use in this browser. | 12 | — |
| Start a handoff | 3 | — |
| Clear delivery and payment records for independent work. | 8 | — |
| Built by Param Factory · v1.0.1 | 6 | — |
| Illustration generated for this product. | 5 | — |

### README

| Sentence or heading | Words | Flag |
| --- | ---: | --- |
| Invoice Handoff Sheet | 3 | — |
| Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client. | 17 | — |
| It is for freelancers and small agencies who need a clear record before a late invoice becomes a dispute. | 19 | — |
| This free tool saves handoffs in this browser. | 9 | — |
| It records delivery milestones, proof links, acceptance details, invoice terms, payment instructions, and a follow-up log. | 16 | — |
| Download the whole record as a shareable HTML file or export follow-ups as CSV. | 14 | — |
| Print the current handoff or save it as a PDF from your browser. | 13 | — |
| No account or payment is needed. | 6 | — |
| Run | 1 | — |
| Open the one-click sandbox at `http://localhost:5173/demo?demo=1`. | 10 | — |
| The demo uses its own storage. | 6 | — |
| Reset demo restores the sample. | 4 | — |
| Start for real removes the demo copy before opening your handoffs. | 11 | — |
| Verify and build | 3 | — |
| Run `npm run test:live` to apply the same browser suite to the production URL. | 14 | — |
| Set `LIVE_BASE_URL` to check another deployed origin. | 7 | — |
| The static deployment output is `dist/`, with `index.html` at its root. | 11 | — |
| The app uses no analytics or runtime CDNs. | 8 | — |
| After the first visit, the demo reloads offline. | 8 | — |
| See `.factory/claims.json` for the browser tests behind each listed claim. | 10 | — |
| Privacy and limits | 3 | — |
| Handoff details stay in this browser. | 7 | — |
| The demo does not write to real sheet storage. | 9 | — |
| Proof links must use HTTP or HTTPS. | 7 | — |
| You can delete a saved handoff after confirmation and undo it immediately. | 12 | — |
| See `/privacy` and `/terms` in the app. | 6 | — |
| Deploy | 1 | — |
| Build with `npm run build`, then deploy `dist/` as a static app. | 12 | — |
| Azure Static Web Apps settings, security headers, caching, and SPA fallback are in `public/staticwebapp.config.json`. | 14 | — |
| Live: https://invoice-handoff-sheet.sociobot.in — built by the Param Factory (`static-web`). | 9 | — |
| See `.factory/brief.json` for the researched problem this solves and `.factory/design.md` for the visual system. | 14 | — |
| Develop | 1 | — |

## Demo and sandbox behaviour

**Pass.** One click opened `/demo?demo=1` directly into the completed Moonbeam Studio website-launch handoff. The first product screen had the persistent “DEMO / Sample data. Nothing is saved to your real sheets.” banner, Reset demo, Start for real, two delivery milestones, invoice `MB-042`, payment instructions, and one follow-up.

The active sample key was only `demo:invoice-handoff-sheet:sheets`. Reset demo reseeded it. Start for real removed it and left real storage unchanged. The offline test passed after the first visit. The request log over loading, editing, saving, resetting, and leaving demo contained only `https://invoice-handoff-sheet.sociobot.in`; no handoff detail was sent to a third party.

## Claims audit

Read `.factory/claims.json`, cloned freshly to `/tmp/invoice-handoff-review-4.afpkf8`, ran `npm ci`, then ran every listed command separately.

| Claim id | Result |
| --- | --- |
| csv-export | PASS |
| shareable-html | PASS |
| print-pdf | PASS |
| offline-reload | PASS |
| local-storage | PASS |
| private-demo | PASS |
| no-runtime-tracking | PASS |
| local-first-real | PASS |
| unlimited-handoffs | PASS |
| safe-proof-links | PASS |
| delete-handoff | PASS |
| demo-populated-sheet | PASS |
| complete-handoff-record | PASS |
| demo-reset | PASS |
| demo-exit | PASS |
| demo-navigation | PASS |

`npm test` passed 42/42 locally. `CI=1 npm run test:live` passed 42/42 against production; the Playwright last-run report is `passed` with no failed tests. `npm run lint` passed. `npm run build` produced `dist/` with 9.00 kB gzip JS and 3.51 kB gzip CSS.

The landing, README, demo banner, Privacy, and Terms were reread after the claim run. Each claim-like visitor statement maps to a declared claim: exports, printing, offline reload, local storage, no account/payment, safe links, delete/Undo, populated demo, complete record, reset/exit/navigation, and no analytics/runtime CDNs. No unlisted claim-like sentence was found.

## Earlier findings and history

Read every earlier `review-*.md`, `polish-*.md`, and the existing handoff. Each prior finding was checked on the live site and in current code/tests; no older finding is merely marked fixed.

| Earlier id | Live and code confirmation |
| --- | --- |
| F-1-1 | The first-screen lead names delivery proof, invoice details, and follow-ups. |
| F-1-2 | The preview label is `HANDOFF SHEET CONTENTS`; the portal slogan is absent. |
| F-1-3 | README uses “share with a client” and “in this browser.” |
| F-1-4 | Unsupported payment, reminder, debt, and legal-capability disclaimers remain absent. |
| F-1-5 | `no-runtime-tracking` passed; fresh live requests were same-origin only. |
| F-1-6 | Real records have confirmation, Escape cancellation, single-record delete, and Undo; `delete-handoff` passed. |
| F-2-1 | Landing, demo, app, Privacy, Terms, and 404 have route-specific metadata. |
| F-2-2 | The real 404 has skip link, standard navigation, legal footer links, and a home route. |
| F-2-3 | The preview H2 is `Handoff sheet contents.` |
| F-2-4 | Export copy names the CSV and standalone HTML results. |
| F-2-5 | `demo-populated-sheet` passed from the landing action. |
| F-2-6 | `complete-handoff-record` passed after save/reload for all promised categories. |
| F-2-7 | The README feature inventory is covered by that complete-record test. |
| F-2-8 | `demo-reset` passed while preserving real storage. |
| F-2-9 | README says details “stay in this browser.” |
| F-3-1 | Start for real removes demo storage, preserves real storage, and `demo-exit` passed. |
| F-3-2 | Normal Demo navigation preserves edits until Reset demo; `demo-navigation` passed. |

## Structure, routing, accessibility, and identity

**Pass.** `/`, `/demo?demo=1`, `/app`, `/privacy`, and `/terms` returned 200; an unknown route returned the designed HTTP 404. Each checked page had one H1, `<main>`, `lang="en"`, a route-appropriate title, description, canonical URL, Open Graph/Twitter data, favicon, and Apple touch icon.

The header/footer, skip link, Privacy, and Terms links are present on every route including 404. All discovered internal links, sitemap URLs, and sample-proof pages returned 200; the intentionally unknown route returned 404. The live suite covers deep links, Back, route-heading focus, and announcements. `robots.txt`, `sitemap.xml`, SPA fallback, and the response-level self-only CSP with `frame-ancestors 'none'` are present. No console errors, mobile overflow, serious/critical Axe issue, or touch-target issue occurred.

The warm paper ledger, navy ink, yellow marker controls, red payment state, monospace record layout, hard borders, and original clipboard illustration match the neo-brutalist document thesis. This is distinct from a generic SaaS template.

## Missed leverage

No finding. The brief implies a local handoff record with proof, invoice, follow-up, shareable HTML, CSV, and print/PDF output; these are present. Import, sync, and AI are not implied by this focused local-first job, and an AI feature would be decorative.

## What would make this perfect

The reviewed release already meets the stated standard: no remaining defect, unlisted claim, or untested declared claim was found. Preserve the same fresh-context and clean-clone checks for future changes, especially demo storage lifecycle and route metadata.
