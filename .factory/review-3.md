# Review 3 — adversarial first read

**Verdict: FAIL.** One blocking sandbox defect and one related minor data-loss
defect remain. A PASS requires zero findings.

Reviewed 2026-08-29 UTC at `https://invoice-handoff-sheet.sociobot.in` in
fresh Chromium contexts at 390 × 844 and 1440 × 900. This review did not
modify product code.

## Cold first read

Before scrolling, both widths answered the three first-read questions:

- **What it does:** “Record work before chasing payment.” The supporting text
  names delivery proof, invoice details, and follow-ups in one record.
- **For whom:** freelancers and small agencies.
- **What to click first:** **Try it with sample data**; its adjacent result
  text says “Opens a finished client handoff.”

At 390 px the primary action is fully visible in the first 844 px (from about
562 px to 606 px). The page has no horizontal overflow. This is not a
first-screen blocking failure.

## Findings

### F-3-1 — BLOCKING — Leaving demo mode retains the complete sandbox dataset

- **Location / evidence:** on live `/demo?demo=1`, the banner button is
  **Start for real**. In a fresh context the sample key existed before the
  click. Immediately after clicking, the address was `/app`, the real key was
  `null`, and `demo:invoice-handoff-sheet:sheets` still contained the full
  Moonbeam Studio JSON record. The corresponding code at `src/main.ts:335-337`
  only calls `navigate("/app")`.
- **Why:** the demo-sandbox contract requires leaving demo mode to discard demo
  data, unless the visitor is explicitly offered a one-time “keep this as my
  data” choice. This flow does neither. The sample remains in browser storage
  after the visitor has left the demo, so the claimed isolated sandbox has an
  incomplete lifecycle. The demo requirement makes a weak demo blocking.
- **Concrete fix:** before navigation, remove only
  `demo:invoice-handoff-sheet:sheets` (or call `resetDemo()` and do not reseed)
  when **Start for real** is used. Alternatively show a clear, explicit
  one-time choice to keep a copy as real data. Add a tagged sandbox/claim test
  that starts at `/demo?demo=1`, clicks **Start for real**, and asserts the demo
  key is absent, the real key is unchanged, and a later `/demo?demo=1` receives
  a fresh sample.

### F-3-2 — Minor — The header “Demo” link silently deletes demo edits

- **Location / evidence:** after changing the project to `Review 3 changed
  demo` and using **Save changes** on live `/demo?demo=1`, clicking the header
  link labelled **Demo** returned the H1 to `Moonbeam Studio website launch`.
  `src/main.ts:305-312` treats every `href="/demo"` link as a reset and removes
  `demo:invoice-handoff-sheet:sheets`. The banner already provides a separate,
  explicitly named **Reset demo** control.
- **Why:** a navigation link named “Demo” does not communicate destructive
  reset behaviour. A visitor can reasonably use it to return to the demo and
  lose their trial edits without choosing **Reset demo**.
- **Concrete fix:** make header and in-page **Demo** links navigate to the
  existing demo state; reserve deletion/reseeding for **Reset demo** and an
  explicitly labelled fresh-sample action. Add a test that saves a demo edit,
  follows the header **Demo** link, and verifies the edit remains until
  **Reset demo** is selected.

## Copy audit

Word counts use visible words. The wordmark, navigation labels, and example
record values are labels rather than sentences; all sentence-like labels and
actions are included below. No item exceeds 22 words. No jargon, marketing
adjective, inconsistent term, empty heading, metaphor, or non-result-naming
landing button was found.

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
| Log the follow-up. | 3 | — |
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

| Sentence | Words | Flag |
| --- | ---: | --- |
| Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client. | 17 | — |
| It is for freelancers and small agencies who need a clear record before a late invoice becomes a dispute. | 19 | — |
| This free tool saves handoffs in this browser. | 9 | — |
| It records delivery milestones, proof links, acceptance details, invoice terms, payment instructions, and a follow-up log. | 16 | — |
| Download the whole record as a shareable HTML file or export follow-ups as CSV. | 14 | — |
| No account or payment is needed. | 6 | — |
| Open the one-click sandbox at http://localhost:5173/demo?demo=1. | 10 | — |
| The demo uses its own storage and can be reset from its banner. | 13 | — |
| The static deployment output is dist/, with index.html at its root. | 11 | — |
| The app uses no analytics or runtime CDNs. | 8 | — |
| After the first visit, the demo reloads offline. | 8 | — |
| See .factory/claims.json for the browser tests behind each listed claim. | 10 | — |
| Handoff details stay in this browser. | 7 | — |
| The demo does not write to real sheet storage. | 9 | — |
| Proof links must use HTTP or HTTPS. | 7 | — |
| You can delete a saved handoff after confirmation and undo it immediately. | 12 | — |
| See /privacy and /terms in the app. | 6 | — |
| Build with npm run build, then deploy dist/ as a static app. | 12 | — |
| Azure Static Web Apps settings, security headers, caching, and SPA fallback are in public/staticwebapp.config.json. | 14 | — |
| Live: https://invoice-handoff-sheet.sociobot.in — built by the Param Factory (static-web). | 9 | — |
| See .factory/brief.json for the researched problem this solves and .factory/design.md for the visual system. | 14 | — |

## Demo, sandbox, and privacy checks

The one-click entry itself passes: **Try it with sample data** opened
`/demo?demo=1` directly into the populated Moonbeam Studio handoff. The first
screen showed the persistent **DEMO** banner, **Reset demo**, **Start for
real**, project, invoice `MB-042`, overdue amount, two delivery items, and the
record controls. Reset demo restored the supplied sample and did not write to
the real storage key.

Demo and real storage are separate while demo is active. A live Playwright
request log over loading, editing, and saving the demo contained only the
document, same-origin JS, and same-origin CSS at
`invoice-handoff-sheet.sociobot.in`; no handoff detail left the origin. The
blocking exit-lifecycle failure is F-3-1.

## Claims audit

Read `.factory/claims.json` and ran all 13 exact commands from clean clone
`/tmp/invoice-handoff-review-3.wyw2oc` after `npm ci`. Every declared test
passed. `npm test` then passed all 35 tests, and `npm run lint`,
`npm run typecheck`, and `npm run build` passed; the build produced `dist/`.

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
| demo-populated-sheet | PASS |
| complete-handoff-record | PASS |
| demo-reset | PASS |

The live landing, README, demo, Privacy, and Terms statements map to those
declared claims. No unlisted claim-like sentence was found. F-3-1 is a required
demo-lifecycle behaviour without a corresponding test, not an unsupported
visitor-facing marketing claim.

## Earlier review, polish, and handoff confirmation

Read `.factory/review-1.md`, `.factory/review-2.md`, both polish reports, the
handoff, and verification reports. Each earlier finding is fixed in live
behaviour and current code; neither new finding is a regression of an earlier
ID.

| Earlier id | Live and code confirmation |
| --- | --- |
| F-1-1 | Hero names delivery proof, invoice details, and follow-ups. |
| F-1-2 | Preview eyebrow reads `HANDOFF SHEET CONTENTS`. |
| F-1-3 | README uses “share with a client” and “in this browser.” |
| F-1-4 | Unsupported payment, reminder, debt, and legal-capability copy is absent. |
| F-1-5 | `no-runtime-tracking` is declared and passes its request test. |
| F-1-6 | Live records provide confirmation, deletion, and immediate Undo. |
| F-2-1 | Every tested application route has route-specific description and social metadata. |
| F-2-2 | The live 404 has skip link, header navigation, Privacy/Terms footer links, and a way home. |
| F-2-3 | The preview H2 is `Handoff sheet contents.` |
| F-2-4 | Export copy names CSV and standalone HTML results. |
| F-2-5 | `demo-populated-sheet` covers the primary sample action. |
| F-2-6 | `complete-handoff-record` covers all promised record categories after reload. |
| F-2-7 | The README feature inventory is covered by that complete-record claim. |
| F-2-8 | `demo-reset` changes then resets sample data without altering real storage. |
| F-2-9 | README says handoff details “stay in this browser.” |

## Structure, routes, and visual identity

`/`, `/demo?demo=1`, `/app`, `/privacy`, and `/terms` returned 200 and had one
H1, `<main>`, a route-appropriate title, description, canonical, OG/Twitter
metadata, favicon, skip link, and consistent header/footer. A direct unknown
route returned the designed HTTP 404 with the same shell. The sitemap, robots,
social image, icons, app links, and both sample-proof links resolved; no dead
link was found.

Demo → Privacy → Back restored the demo route, banner, sample data, and focus
on the destination H1. The live CSP, referrer policy, and content-type headers
are present. The paper ledger, navy type, red payment stamp, yellow controls,
and original clipboard illustration are a distinct neo-brutalist document
identity rather than a generic SaaS template.

## Missed leverage

No additional import, sync, or AI feature is implied by the brief. The
product’s useful scope is the local handoff record, proof links, invoice
details, follow-up log, and exports; those functions are present. Adding AI
would be decorative here.

## What would make this perfect

Discard the demo namespace when the visitor leaves demo mode, preserve edits
when they use ordinary Demo navigation, and add observable tests for both
flows. Then rerun this full review from a fresh browser context and clone.
