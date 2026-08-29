# Review 1 — adversarial first read

**Verdict: FAIL.** The live core workflow is clear and works, but six minor findings remain. A PASS requires zero findings.

Reviewed 2026-08-29 UTC at https://invoice-handoff-sheet.sociobot.in in fresh Chromium contexts at 390×844 and 1440×900. This review did not change product code.

## Cold first read

Before scrolling, both widths communicate the following:

- **What it does:** records delivered work, invoice details, and follow-ups in one handoff record before payment follow-up.
- **Who it is for:** freelancers and small agencies.
- **What to click first:** **Try it with sample data**; adjacent text says it opens a finished client handoff.

The mobile primary action was visible at y=561–607 and the desktop one at y=735–781. This is not a blocking first-screen failure. The live landing made four same-origin requests (document, JS, CSS, hero image) with no console messages.

## Findings

### F-1-1 — Minor — Vague hero wording

- **Location / quote:** landing lead, “For freelancers and small agencies who need one **calm record** before an invoice turns into a dispute.”
- **Why:** “calm record” describes a mood, not the useful contents of the record. The visitor must infer delivery proof, invoice terms, and follow-ups from later content.
- **Concrete fix:** replace it with: “For freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record.”

### F-1-2 — Minor — Slogan and jargon do not name the preview section

- **Location / quote:** landing preview eyebrow, “ONE PAGE. NO PORTAL.”
- **Why:** this slogan-like phrase uses undefined “portal” and does not name the section when heard out of context.
- **Concrete fix:** replace the eyebrow with “HANDOFF SHEET CONTENTS.” Keep the following sentence as the explanation. If the product promises sharing without a login, state that as a separately tested fact.

### F-1-3 — Minor — README uses unexplained product terms

- **Location / quote:** README opening, “one **client-shareable** handoff sheet”; paragraph two, “The free **local-first** tool saves handoffs in this browser.”
- **Why:** both terms make the reader translate product language. The first is unclear about whether it means a link, file, email, or portal.
- **Concrete fix:** replace the first phrase with “one handoff sheet you can share with a client” and the second sentence with “This free tool saves handoffs in this browser.”

### F-1-4 — Minor — Capability disclaimer is an unlisted claim

- **Location / quote:** landing “What this sheet does not do,” “It does not process payments, send reminders, or make legal claims.” The same scope claim appears in README with “collect debts” added.
- **Why:** these are product-scope statements a visitor can rely on, but claims.json has no claim entry or observable test for them. Existing request-log tests prove same-origin traffic, not that these functions are absent.
- **Concrete fix:** remove the negative sentence and state supported work positively, or add a narrowly worded no-payment-or-reminder-controls claim and Playwright test that checks real and demo views for the absence of those controls.

### F-1-5 — Minor — README tracking/CDN statement is an unlisted claim

- **Location / quote:** README, “The build uses no runtime CDNs or analytics.”
- **Why:** this is a privacy and delivery claim. The private-demo claim says demo handoff details do not reach *third parties*; its stated claim and test do not establish the absence of analytics, including same-origin analytics.
- **Concrete fix:** add a no-analytics-or-runtime-cdn claim whose test records all requests from fresh landing and demo sessions and checks shipped asset origins; otherwise remove this sentence.

### F-1-6 — Minor — A saved handoff cannot be removed

- **Location / quote:** /app has “Create handoff” and opens each saved sheet, but has no whole-handoff removal action. The sheet only offers “Remove milestone” and “Remove” for a follow-up.
- **Why:** a duplicate, test, or obsolete client record cannot be removed in the product that created it.
- **Concrete fix:** add “Delete handoff” in the record view with confirmation and Undo. Test that deleting one of two real sheets removes only its record from invoice-handoff-sheet:sheets and leaves the other intact.

## Copy audit

Word counts use visible words. Navigation labels and the wordmark are labels, not sentences. No sentence exceeds 22 words. Findings F-1-1 through F-1-3 cover all wording flags below.

### Landing page

| Sentence or action | Words | Flag |
| --- | ---: | --- |
| DELIVERY → INVOICE → FOLLOW-UP | 3 | — |
| Record work before chasing payment. | 5 | — |
| For freelancers and small agencies who need one calm record before an invoice turns into a dispute. | 16 | F-1-1 |
| Try it with sample data | 5 | — |
| Opens a finished client handoff. | 5 | — |
| Saved in this browser | 4 | — |
| Works offline after first visit | 5 | — |
| Free to use | 3 | — |
| ONE PAGE. NO PORTAL. | 4 | F-1-2 |
| Show the whole handoff. | 4 | — |
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
| Export a clean record when you need it. | 9 | — |
| What this sheet does not do. | 7 | — |
| It does not process payments, send reminders, or make legal claims. | 11 | F-1-4 |
| You control your files and the details you enter. | 10 | — |
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
| Record delivered work, invoice details, and follow-ups in one client-shareable handoff sheet. | 12 | F-1-3 |
| It is for freelancers and small agencies who need a clear record before a late invoice becomes a dispute. | 19 | — |
| The free local-first tool saves handoffs in this browser. | 9 | F-1-3 |
| It records delivery milestones, proof links, acceptance details, invoice terms, payment instructions, and a follow-up log. | 16 | — |
| Download the whole record as a shareable HTML file or export follow-ups as CSV. | 14 | — |
| No account or payment is needed. | 6 | — |
| Open the one-click sandbox at http://localhost:5173/demo?demo=1. | 10 | — |
| The demo uses its own storage and can be reset from its banner. | 13 | — |
| The static deployment output is dist/, with index.html at its root. | 11 | — |
| The build uses no runtime CDNs or analytics. | 8 | F-1-5 |
| After the first visit, the demo reloads offline. | 8 | — |
| See .factory/claims.json for the browser tests behind each listed claim. | 10 | — |
| Handoff details remain in browser local storage. | 7 | — |
| The demo does not write to real sheet storage. | 9 | — |
| Proof links must use HTTP or HTTPS. | 7 | — |
| This product does not process payments, send reminders, collect debts, or make legal claims. | 14 | F-1-4 |
| See /privacy and /terms in the app. | 7 | — |
| Build with npm run build, then deploy dist/ as a static app. | 12 | — |
| Azure Static Web Apps settings, security headers, caching, and SPA fallback are in public/staticwebapp.config.json. | 14 | — |
| Live: https://invoice-handoff-sheet.sociobot.in — built by the Param Factory (static-web). | 9 | — |
| See .factory/brief.json for the researched problem this solves and .factory/design.md for the visual system. | 14 | — |

## Demo and privacy sandbox

**Pass.** One click opened /demo?demo=1 with the populated Moonbeam Studio website launch record, two delivery milestones, payment instructions, a past-due invoice, and a follow-up. The persistent banner reads “DEMO — Sample data. Nothing is saved to your real sheets,” with Reset demo and Start for real.

Reset reseeded demo:invoice-handoff-sheet:sheets, retained the banner, and left invoice-handoff-sheet:sheets null. Live Demo → Privacy → browser Back restored the demo title, banner, data namespace, and focus on the heading. The live request log contained only the product origin.

## Claims audit

All eight declared commands passed from a newly cloned checkout at /tmp/invoice-handoff-claim-audit.qCBgOB after npm ci:

| Claim id | Result |
| --- | --- |
| csv-export | PASS |
| shareable-html | PASS |
| offline-reload | PASS |
| local-storage | PASS |
| private-demo | PASS |
| local-first-real | PASS |
| unlimited-handoffs | PASS |
| safe-proof-links | PASS |

No declared claim test failed. Findings F-1-4 and F-1-5 are the remaining claim-copy cross-check failures.

## Earlier review and handoff checks

There are no earlier review-*.md or polish-*.md files. The previous handoff recorded four repair areas; each is present in live/code evidence: demo history restored its namespace; form edits are preserved before record actions; both same-origin proof pages returned HTTP 200; and the 27-test suite plus live route check confirmed focus/Undo/404 metadata.

## Structure, routing, and visual checks

**Pass.** /, /demo, /app, /privacy, and /terms returned 200 and had one H1, route-appropriate titles, descriptions, canonical links, OG metadata, and favicon. /missing-page returned a designed HTTP 404 with a way home. All discovered internal links and both proof links resolved. Deep demo URLs loaded directly; browser Back restored state and focused the H1. Header/footer, Privacy, Terms, skip link, robots, sitemap, and response headers were present. The live paper-ledger, navy, red, and yellow neo-brutalist identity is distinct from a generic SaaS template.

npm test passed all 27 tests and npm run build produced dist/; built JS was 8.24 kB gzip. The suite includes authored accessibility scans at mobile and desktop widths. No live console errors occurred in this review.

## Missed leverage

F-1-6 is the only expected record-management capability found. Import, sync, and AI assistance are not implied by this local single-sheet brief; an AI feature would not improve the core handoff job.

## What would make this perfect

Use concrete copy for the hero and preview, test or remove the two unlisted capability/privacy claims, and provide an undoable whole-handoff delete action with storage-isolation coverage. Then rerun the complete review.

