import type { Sheet } from "./types";
import { sampleSheet } from "./types";

const base = "invoice-handoff-sheet:";
export const storageKey = (demo: boolean) =>
  `${demo ? "demo:" : ""}${base}sheets`;

export function loadSheets(demo: boolean): Sheet[] {
  if (demo && !localStorage.getItem(storageKey(true))) {
    const seeded = [sampleSheet()];
    localStorage.setItem(storageKey(true), JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(
      localStorage.getItem(storageKey(demo)) || "[]",
    ) as Sheet[];
  } catch {
    return [];
  }
}

export function saveSheets(demo: boolean, sheets: Sheet[]) {
  localStorage.setItem(storageKey(demo), JSON.stringify(sheets));
}
export function resetDemo() {
  localStorage.removeItem(storageKey(true));
}
export function csvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
export function followUpCsv(sheet: Sheet) {
  const header = ["Date", "Method", "Note", "Outcome", "Invoice", "Client"];
  const rows = sheet.followUps.map((f) => [
    f.date,
    f.method,
    f.note,
    f.outcome,
    sheet.invoiceId,
    sheet.client,
  ]);
  return [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");
}

function htmlEscape(value = "") {
  return value.replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
}
export function safeHttpUrl(value = ""): string | null {
  const candidate = value.trim();
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function handoffHtml(sheet: Sheet) {
  const milestones =
    sheet.milestones
      .map((m) => {
        const proof = safeHttpUrl(m.evidence);
        return `<li><strong>${htmlEscape(m.title)}</strong><br>Delivered: ${htmlEscape(m.deliveredOn || "Not set")}${proof ? `<br>Proof: <a href="${htmlEscape(proof)}" rel="noreferrer">${htmlEscape(proof)}</a>` : ""}${m.acceptedBy ? `<br>Accepted by: ${htmlEscape(m.acceptedBy)}${m.acceptedOn ? ` on ${htmlEscape(m.acceptedOn)}` : ""}` : ""}</li>`;
      })
      .join("") || "<li>No delivery milestones recorded.</li>";
  const followUps =
    sheet.followUps
      .map(
        (f) =>
          `<li><strong>${htmlEscape(f.date)} · ${htmlEscape(f.method)}</strong><br>${htmlEscape(f.note)}<br>Outcome: ${htmlEscape(f.outcome)}</li>`,
      )
      .join("") || "<li>No follow-ups recorded.</li>";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${htmlEscape(sheet.project || "Project handoff")}</title><style>body{font:16px system-ui,sans-serif;line-height:1.5;color:#10233a;max-width:760px;margin:40px auto;padding:0 20px}h1,h2{line-height:1.1}header{border-bottom:3px solid #10233a;padding-bottom:18px}dl{display:grid;grid-template-columns:max-content 1fr;gap:8px 20px}dt{font-weight:700}dd{margin:0}li{margin:0 0 16px}a{color:#10233a}@media print{body{margin:0}}</style></head><body><header><p>PROJECT HANDOFF RECORD</p><h1>${htmlEscape(sheet.project || "Project handoff")}</h1><p>${htmlEscape(sheet.client || "Client not set")}</p></header><h2>Invoice and payment</h2><dl><dt>Invoice</dt><dd>${htmlEscape(sheet.invoiceId || "Not set")}</dd><dt>Amount</dt><dd>${htmlEscape(sheet.amount || "Not set")} ${htmlEscape(sheet.currency)}</dd><dt>Issued</dt><dd>${htmlEscape(sheet.issuedOn || "Not set")}</dd><dt>Due</dt><dd>${htmlEscape(sheet.dueOn || "Not set")}</dd><dt>Status</dt><dd>${htmlEscape(sheet.status)}</dd><dt>Instructions</dt><dd>${htmlEscape(sheet.instructions || "Not set")}</dd></dl><h2>Delivery record</h2><ol>${milestones}</ol><h2>Follow-up log</h2><ol>${followUps}</ol></body></html>`;
}
