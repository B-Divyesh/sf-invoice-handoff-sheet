# Invoice Handoff Sheet — visual thesis

## Direction

**Neo-brutalist utility.** This is a factual record for a tense moment, so the
interface is deliberately legible, squared-off, and visibly structured rather
than soft or sales-like. A warm paper ground and ledger lines make the handoff
feel like a document the freelancer owns. Hard navy type and an emergency-red
payment marker make dates and amounts easy to scan.

## Tokens

| Role | Token | Value |
| --- | --- | --- |
| Paper background | `--paper` | `#f7f0df` |
| Ink | `--ink` | `#10233a` |
| Muted ink | `--muted` | `#42536a` |
| Surface | `--surface` | `#fffdf6` |
| Marker yellow | `--yellow` | `#ffd84d` |
| Payment red | `--red` | `#c83728` |
| Delivered green | `--green` | `#1f6a50` |
| Line | `--line` | `#10233a` |

All body text uses ink on paper/surface (at least 4.5:1). The dark treatment
uses `#10233a` ground, `#fff8e9` text, and the same yellow/red markers.

## Type, layout, and interaction

The display face is an intentional system stack, `Arial Black`/Impact, used
only for stamped headings. The body is the local `ui-monospace` stack so dates,
amounts, and log rows line up like a ledger. This avoids remote fonts and keeps
the app fast. Space follows an 8px rhythm. Controls are square, 2px ink
outlines, 4px hard shadows, and 44px minimum touch targets. Cards are reserved
for separate records; forms are ledger sections.

Editing happens directly in the sheet. A stamped state pill and vertical
timeline make the current handoff state apparent. The signature movement is a
brief 2px “stamp settle” on save; reduced-motion users get an instant state
change with no transform or animation.

## Art plan and provenance

Hero art is an original, generated editorial still life: a navy clipboard,
receipt, delivery link chain, and payment marker on warm paper. It clarifies
that this is one handoff record, not an accounting dashboard. Prompt sheets
require no text, logos, people, or watermark. The final source and its prompt
sidecar live in `assets/src/`; the served WebP is optimized below 300 KB.
Generated asset provenance: Azure AI Foundry factory image model, 2026-08-28,
original for this product. A footer notes that the illustration is generated.
