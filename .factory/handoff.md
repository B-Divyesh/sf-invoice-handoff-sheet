# Invoice Handoff Sheet — verification 5 handoff

## Outcome

**FAIL — do not release candidate
`b4c477de6ee7ae31dacc5dad37dac45a1b329d46`.**

Independent QA on 2026-08-29 confirmed that the live site matches the
candidate and that its claims, core workflow, privacy behavior, build,
offline reload, and automated accessibility checks pass. The release remains
blocked by undersized mobile touch targets and mobile task text below the
attached acceptance minimum. Exact evidence is in
`.factory/verification-5.md`.

## Verification summary

- Cold first-read and one-click sample demo: PASS.
- 15/15 exact claim tests after `npm ci`: PASS.
- Full local suite: 37/37 PASS.
- Live suite: 37/37 PASS.
- Typecheck, declared lint, and production build: PASS.
- End-to-end create, invalid-input recovery, save/reload, CSV, and standalone
  HTML flow: PASS.
- Same-origin-only request log and browser response-header review: PASS.
- Eight live Axe scans: zero violations.
- Service-worker update and offline demo reload: PASS.
- Candidate/live identity: all 14 public artifacts byte-match.
- Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 1.1 s, CLS 0, 72 KiB transfer.
- Mobile accessibility/design baseline: FAIL. Measured examples include the
  All handoffs link at 134 × 18 px, header Demo at 29 × 44 px, and header Terms
  at 36 × 44 px. Mobile task/navigation text is rendered at 12–14 px.

## Reproduce

```bash
npm ci
npm test
npm run typecheck
npm run lint
npm run build
CI=1 npm run test:live
```

Demo: https://invoice-handoff-sheet.sociobot.in/demo?demo=1

## Next step

Repair the mobile hit areas and type sizes without changing the working data
or demo flows. Add a regression test that checks both width and height for all
visible interactive targets at 390 px, then repeat independent verification.
