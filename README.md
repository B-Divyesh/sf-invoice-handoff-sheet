# Invoice Handoff Sheet

Record delivered work, invoice details, and follow-ups in one handoff sheet you
can share with a client. It is for freelancers and small agencies who need a
clear record before a late invoice becomes a dispute.

This free tool saves handoffs in this browser. It records delivery milestones,
proof links, acceptance details, invoice terms, payment instructions, and a
follow-up log. Download the whole record as a shareable HTML file or export
follow-ups as CSV. No account or payment is needed.

## Run

```bash
npm install
npm run dev
```

Open the one-click sandbox at `http://localhost:5173/demo?demo=1`. The demo uses
its own storage and can be reset from its banner.

## Verify and build

```bash
npm test
npm run lint
npm run build
```

The static deployment output is `dist/`, with `index.html` at its root. The app
uses no analytics or runtime CDNs. After the first visit, the demo reloads
offline. See `.factory/claims.json` for the browser tests behind each listed claim.

## Privacy and limits

Handoff details stay in this browser. The demo does not write to real
sheet storage. Proof links must use HTTP or HTTPS. You can delete a saved
handoff after confirmation and undo it immediately. See `/privacy` and `/terms`
in the app.

## Deploy

Build with `npm run build`, then deploy `dist/` as a static app. Azure Static Web
Apps settings, security headers, caching, and SPA fallback are in
`public/staticwebapp.config.json`.

Live: https://invoice-handoff-sheet.sociobot.in — built by the Param Factory (`static-web`).

See `.factory/brief.json` for the researched problem this solves and `.factory/design.md` for the visual system.

## Develop

```
npm install
npm run dev
npm test
npm run lint
npm run build   # -> dist/
```
