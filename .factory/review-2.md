# Review 2 — adversarial first read

**Verdict: FAIL.** No blocking defect was found, but nine minor findings remain. A PASS requires zero findings.

Reviewed 2026-08-29 UTC at `https://invoice-handoff-sheet.sociobot.in` in fresh Chromium contexts at 390×844 and 1440×900. This review did not modify product code.

## Cold first read

Before scrolling, at both widths, the product communicates:

- **What it does:** “Record work before chasing payment.” It puts delivery proof, invoice details, and follow-ups in one handoff record.
- **Who it is for:** “For freelancers and small agencies…”
- **What to click first:** **Try it with sample data**. The adjacent text says, “Opens a finished client handoff.”

The mobile primary action is visible at y=561–607, within the first 844 px. This is not a blocking first-screen failure. The live landing made only four same-origin requests (document, JS, CSS, hero image) and had no product console or page errors.

## Findings

### F-2-1 — Minor — Route metadata remains landing-specific outside the landing page

- **Location / quote:** live `/demo`, `/app`, `/privacy`, and `/terms` all retain the landing description: “Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client.” Their `og:title`, `og:description`, Twitter title, and Twitter description also remain the landing values.
- **Why:** the route title changes, but a shared link to Privacy appears to describe the product landing rather than the privacy page. This does not meet the route-specific metadata check.
- **Concrete fix:** update description and social title/description when the SPA changes route. For example, `/privacy` should use “Privacy — Invoice Handoff Sheet” and “Handoff details stay in this browser. The app has no analytics.” Add a route-metadata Playwright test for `/`, `/demo`, `/app`, `/privacy`, and `/terms`.

### F-2-2 — Minor — The static 404 does not use the site’s standard accessible shell

- **Location / quote:** live unknown route `/missing-page`; header is only “HANDOFF SHEET” and footer is only “Clear delivery and payment records for independent work.” It has no skip link, Demo/Privacy/Terms navigation, or Privacy/Terms footer links.
- **Why:** a visitor who follows a stale link cannot reach Privacy or Terms from the 404, and keyboard users lose the standard skip link. This conflicts with the required consistent header/footer on every route.
- **Concrete fix:** give `public/404.html` the same skip link, header navigation, and footer links as the application shell. Add a 404-shell test that checks those links and the skip link.

### F-2-3 — Minor — Preview heading does not name its section

- **Location / quote:** landing H2, “Show the whole handoff.”
- **Why:** heard in a heading list, this is an imperative with no section name or useful information. The eyebrow is not a substitute for a heading.
- **Concrete fix:** replace it with “Handoff sheet contents.”

### F-2-4 — Minor — Export copy is vague and does not name the result

- **Location / quote:** landing How it works, “Export a clean record when you need it.”
- **Why:** “clean” is an untestable quality adjective, and the visitor cannot tell whether this creates the CSV follow-up log or the standalone handoff page.
- **Concrete fix:** replace it with “Export follow-ups as CSV or download the full handoff as HTML.” The two results already have declared claim tests.

### F-2-5 — Minor — The demo-result promise is an unlisted claim

- **Location / quote:** landing action help, “Opens a finished client handoff.”
- **Why:** this is a specific outcome a first-time visitor can rely on, but `.factory/claims.json` has no entry that checks the primary landing action opens a populated sample sheet.
- **Concrete fix:** add `demo-populated-sheet` to `claims.json` and a tagged test that starts at `/`, clicks **Try it with sample data**, and asserts the demo banner, Moonbeam Studio H1, two milestones, invoice `MB-042`, and one follow-up.

### F-2-6 — Minor — The landing’s complete-record capability claim is unlisted

- **Location / quote:** landing preview, “Delivery proof, invoice details, payment instructions, and every follow-up stay together.”
- **Why:** this promises a complete handoff record, but the declared export and storage tests do not assert that the sheet keeps these four categories together.
- **Concrete fix:** add `complete-handoff-record` to `claims.json` and a demo test that verifies those categories are visible together and retained after saving/reload; otherwise narrow the sentence to only the tested exports.

### F-2-7 — Minor — README repeats an unlisted complete-record capability claim

- **Location / quote:** README paragraph two, “It records delivery milestones, proof links, acceptance details, invoice terms, payment instructions, and a follow-up log.”
- **Why:** it is a visitor-facing feature inventory with no matching declared observable claim. The existing claims test individual exports, storage, and URL safety, not this complete inventory.
- **Concrete fix:** cover this sentence with the `complete-handoff-record` claim/test in F-2-6, including acceptance details and proof links, or remove the unsupported items from the sentence.

### F-2-8 — Minor — README promises reset behaviour without a declared test

- **Location / quote:** README Run section, “The demo uses its own storage and can be reset from its banner.”
- **Why:** the storage-separation claim verifies distinct namespaces but does not click **Reset demo** and prove it reseeds only demo storage. This is a relied-on sandbox behaviour.
- **Concrete fix:** add `demo-reset` to `claims.json` and a tagged test that changes sample data, presses **Reset demo**, confirms the original Moonbeam sample returns, and confirms the real namespace is unchanged.

### F-2-9 — Minor — README uses storage implementation jargon in visitor-facing privacy copy

- **Location / quote:** README Privacy and limits, “Handoff details remain in browser local storage.”
- **Why:** “local storage” describes an implementation mechanism rather than the reader’s result. The same document otherwise uses the plainer “in this browser.”
- **Concrete fix:** replace it with “Handoff details stay in this browser.” The `local-first-real` claim already supports that wording.

## Copy audit

Word counts use visible words. Navigation labels, the wordmark, and example record values are labels rather than sentences. No sentence exceeds 22 words. F-2-3, F-2-4, and F-2-9 are the wording flags; F-2-5 through F-2-8 are claim-copy flags.

### Landing page

| Sentence or action | Words | Flag |
| --- | ---: | --- |
| DELIVERY → INVOICE → FOLLOW-UP | 3 | — |
| Record work before chasing payment. | 5 | — |
| For freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record. | 16 | — |
| Try it with sample data | 5 | — |
| Opens a finished client handoff. | 5 | F-2-5 |
| Saved in this browser | 4 | — |
| Works offline after first visit | 5 | — |
| Free to use | 3 | — |
| HANDOFF SHEET CONTENTS | 3 | — |
| Show the whole handoff. | 4 | F-2-3 |
| Delivery proof, invoice details, payment instructions, and every follow-up stay together. | 10 | F-2-6 |
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
| Export a clean record when you need it. | 8 | F-2-4 |
| Keep the handoff record together. | 5 | — |
| Record delivery proof, invoice details, payment instructions, and follow-ups in the same sheet. | 11 | — |
| NO ACCOUNT NEEDED | 3 | — |
| Save as many handoffs as you need. | 7 | — |
| The full sheet and both exports are free to use in this browser. | 12 | — |
| Start a handoff | 3 | — |
| Clear delivery and payment records for independent work. | 8 | — |
| Built by Param Factory · v1.0.1 | 6 | — |
| Illustration generated for this product. | 5 | — |

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client. | 17 | — |
| It is for freelancers and small agencies who need a clear record before a late invoice becomes a dispute. | 19 | — |
| This free tool saves handoffs in this browser. | 9 | — |
| It records delivery milestones, proof links, acceptance details, invoice terms, payment instructions, and a follow-up log. | 16 | F-2-7 |
| Download the whole record as a shareable HTML file or export follow-ups as CSV. | 14 | — |
| No account or payment is needed. | 6 | — |
| Open the one-click sandbox at http://localhost:5173/demo?demo=1. | 10 | — |
| The demo uses its own storage and can be reset from its banner. | 13 | F-2-8 |
| The static deployment output is dist/, with index.html at its root. | 11 | — |
| The app uses no analytics or runtime CDNs. | 8 | — |
| After the first visit, the demo reloads offline. | 8 | — |
| See .factory/claims.json for the browser tests behind each listed claim. | 10 | — |
| Handoff details remain in browser local storage. | 7 | F-2-9 |
| The demo does not write to real sheet storage. | 9 | — |
| Proof links must use HTTP or HTTPS. | 7 | — |
| You can delete a saved handoff after confirmation and undo it immediately. | 12 | — |
| See /privacy and /terms in the app. | 6 | — |
| Build with npm run build, then deploy dist/ as a static app. | 12 | — |
| Azure Static Web Apps settings, security headers, caching, and SPA fallback are in public/staticwebapp.config.json. | 14 | — |
| Live: https://invoice-handoff-sheet.sociobot.in — built by the Param Factory (static-web). | 9 | — |
| See .factory/brief.json for the researched problem this solves and .factory/design.md for the visual system. | 14 | — |

## Demo and sandbox behaviour

**Pass.** One click from the cold landing opened `/demo?demo=1` with the populated Moonbeam Studio website launch record, two delivery milestones, payment instructions, a past-due `MB-042` invoice, and a follow-up. The persistent banner says “DEMO — Sample data. Nothing is saved to your real sheets,” with **Reset demo** and **Start for real**.

Manual reset restored the original demo value under `demo:invoice-handoff-sheet:sheets` and left `invoice-handoff-sheet:sheets` null. The live demo request log contained only the product origin. The missing declared test for that reset behaviour is F-2-8.

## Claims audit

After `npm ci` in fresh clone `/tmp/invoice-handoff-review-2.JP94eZ` at `9d7c0ed388279e24b65366d27ebd53407ed1cc7f`, every exact command in `.factory/claims.json` passed. The fresh checkout then built successfully.

| Claim id | Result |
| --- | --- |
| csv-export | PASS |
| shareable-html | PASS |
| offline-reload | PASS |
| local-storage | PASS |
| private-demo | PASS |
| no-runtime-tracking | PASS |
| local-first-real | PASS |
| unlimited-handoffs | PASS |
| safe-proof-links | PASS |
| delete-handoff | PASS |

`npm test` also passed all 30 Playwright tests, including light/dark desktop/mobile Axe checks; `npm run build` produced `dist/` with 8.48 kB gzip JavaScript. The four unlisted claim-copy failures are F-2-5 through F-2-8; no declared claim test failed.

## Earlier review and handoff checks

Each finding from `.factory/review-1.md` is fixed in both live behaviour and the code:

| Earlier id | Confirmation |
| --- | --- |
| F-1-1 | Live hero now names “delivery proof, invoice details, and follow-ups.” |
| F-1-2 | Live preview eyebrow is “HANDOFF SHEET CONTENTS.” |
| F-1-3 | README uses “handoff sheet you can share with a client” and “saves handoffs in this browser.” |
| F-1-4 | The former unsupported negative-capability copy is absent from landing, README, and terms. |
| F-1-5 | `no-runtime-tracking` is declared and its fresh-browser request/resource test passes. |
| F-1-6 | Live saved records have a confirmation dialog and immediate Undo; `delete-handoff` passes. |

The earlier handoff and polish report do not mask an unfixed F-1 finding. The live no-payment/no-reminder controls, storage separation, same-origin proof pages, focus on route change, and delete/Undo behaviour were also rechecked.

## Structure, routing, and visual checks

**Partial pass; F-2-1 and F-2-2 remain.** `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200 and have `lang`, one H1, main landmark, route-appropriate titles, canonical links, OG image, favicon, skip link, and consistent application header/footer. Browser navigation to Privacy and Back restored the demo banner/data and put focus on the destination H1 with a live-route announcement. No horizontal overflow occurred at 390 px.

The unknown-route response is a designed HTTP 404 with title, H1, description, canonical, OG/Twitter data, favicon, and a way home. Its shell is nevertheless incomplete (F-2-2). All application, sitemap, icon, social-art, and two sample-proof links crawled in this review returned 200 (the unknown route correctly returned 404). The paper-ledger navy/yellow/red neo-brutalist system is distinct from a generic SaaS template.

## Missed leverage

No finding. The brief implies a local record, delivery proof, invoice details, follow-ups, and shareable/exportable output; those are present. Import, sync, or AI assistance are not implied by this focused local-first job and would not improve the core first-use flow.

## What would make this perfect

Give each route accurate metadata, make the 404 use the complete site shell, replace the two vague landing phrases, and add observable claims/tests for entering a populated demo, complete handoff content, and Reset demo. Then rerun this full review from a fresh browser and clone.
