import "./style.css";
import { blankSheet, type FollowUp, type Milestone, type Sheet } from "./types";
import {
  followUpCsv,
  handoffHtml,
  loadSheets,
  resetDemo,
  safeHttpUrl,
  saveSheets,
} from "./storage";

const app = document.querySelector<HTMLDivElement>("#app")!;
let isDemo = location.pathname === "/demo";
let sheets = loadSheets(isDemo);
let activeId = sheets[0]?.id ?? "";
let notice = "";
let noticeIsError = false;
type UndoAction =
  | { kind: "milestone"; sheetId: string; record: Milestone; index: number }
  | { kind: "followup"; sheetId: string; record: FollowUp; index: number }
  | { kind: "sheet"; record: Sheet; index: number };
let undoAction: UndoAction | null = null;
let deleteConfirmId = "";

function escapeHtml(value = "") {
  return value.replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
}
function active() {
  return sheets.find((s) => s.id === activeId);
}
function setMetadata(title: string, description: string) {
  document.title = title;
  const content = (selector: string, value: string) => {
    document.querySelector<HTMLMetaElement>(selector)?.setAttribute("content", value);
  };
  content('meta[name="description"]', description);
  content('meta[property="og:title"]', title);
  content('meta[property="og:description"]', description);
  content('meta[name="twitter:title"]', title);
  content('meta[name="twitter:description"]', description);
  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (canonical)
    canonical.href = `https://invoice-handoff-sheet.sociobot.in${location.pathname}`;
}
function money(sheet: Sheet) {
  if (!sheet.amount) return "Amount not set";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: sheet.currency || "USD",
    }).format(Number(sheet.amount));
  } catch {
    return `${sheet.amount} ${sheet.currency || "USD"}`;
  }
}
function dueLabel(sheet: Sheet) {
  if (!sheet.dueOn) return "Due date not set";
  const diff = Math.ceil(
    (new Date(sheet.dueOn).getTime() - Date.now()) / 86400000,
  );
  return sheet.status === "paid"
    ? "Paid"
    : diff < 0
      ? `${Math.abs(diff)} days overdue`
      : diff === 0
        ? "Due today"
        : `Due in ${diff} days`;
}
function save() {
  saveSheets(isDemo, sheets);
}
function update(id: string, patch: Partial<Sheet>) {
  sheets = sheets.map((s) =>
    s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
  );
  save();
}
function download(name: string, text: string, type = "text/csv") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
function setNotice(message: string, error = false) {
  notice = message;
  noticeIsError = error;
  const region = document.querySelector<HTMLElement>("#form-notice");
  if (region) {
    region.textContent = message;
    region.classList.toggle("error", error);
  }
}
function modeFromLocation() {
  return location.pathname === "/demo";
}
function syncStorageFromLocation() {
  const nextIsDemo = modeFromLocation();
  if (nextIsDemo === isDemo) return;
  isDemo = nextIsDemo;
  sheets = loadSheets(isDemo);
  activeId = sheets[0]?.id ?? "";
  undoAction = null;
}
function sheetFormPatch(form: HTMLFormElement, validOnly = false): Partial<Sheet> {
  const get = (name: string) => form.elements.namedItem(name) as HTMLInputElement | null;
  const value = (name: string) => String(new FormData(form).get(name) || "");
  const include = (name: string) => !validOnly || get(name)?.checkValidity();
  const patch: Partial<Sheet> = {};
  if (include("project")) patch.project = value("project");
  if (include("client")) patch.client = value("client");
  if (include("clientEmail")) patch.clientEmail = value("clientEmail");
  if (include("invoiceId")) patch.invoiceId = value("invoiceId");
  if (include("amount")) patch.amount = value("amount");
  if (include("currency")) patch.currency = (value("currency") || "USD").toUpperCase();
  if (include("issuedOn")) patch.issuedOn = value("issuedOn");
  if (include("dueOn")) patch.dueOn = value("dueOn");
  if (include("instructions")) patch.instructions = value("instructions");
  if (include("status")) patch.status = (value("status") || "open") as Sheet["status"];
  return patch;
}
function currentFormEdits(validOnly = true) {
  const form = document.querySelector<HTMLFormElement>('[data-form="sheet"]');
  return form ? sheetFormPatch(form, validOnly) : {};
}

function header() {
  return `<header class="site-header"><a class="wordmark" href="/" data-route>HANDOFF<br>SHEET<span>™</span></a><nav aria-label="Main navigation"><a href="/demo" data-route>Demo</a><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a></nav></header>`;
}
function footer() {
  return `<footer><p>Clear delivery and payment records for independent work.</p><nav aria-label="Footer"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><span>Built by Param Factory · v1.0.1</span></nav><small>Illustration generated for this product.</small></footer>`;
}

function demoBanner() {
  return isDemo
    ? `<aside class="demo-banner" aria-label="Demo controls"><strong>DEMO</strong><span>Sample data. Nothing is saved to your real sheets.</span><button data-action="reset-demo">Reset demo</button><button class="link-button" data-action="start-real">Start for real</button></aside>`
    : "";
}
function noticeView() {
  return `<div class="notice-wrap"><p id="form-notice" class="notice${noticeIsError ? " error" : ""}" role="status" aria-live="polite">${escapeHtml(notice)}</p>${undoAction ? '<button type="button" class="small-button" data-action="undo-remove">Undo removal</button>' : ""}</div>`;
}
function deleteDialog() {
  const sheet = sheets.find((item) => item.id === deleteConfirmId);
  if (!sheet) return "";
  return `<dialog class="delete-dialog" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Delete this handoff?</h2><p id="delete-description">Delete “${escapeHtml(sheet.project || "Untitled handoff")}” from this browser. You can undo this right after deletion.</p><div class="dialog-actions"><button type="button" class="button secondary" data-action="cancel-delete-handoff">Keep handoff</button><button type="button" class="button danger-button" data-action="confirm-delete-handoff">Delete handoff</button></div></dialog>`;
}
function statusMark(sheet: Sheet) {
  return `<span class="stamp ${sheet.status}" aria-label="Payment status: ${sheet.status}">${sheet.status === "paid" ? "PAID" : sheet.status === "overdue" ? "PAST DUE" : "OPEN"}</span>`;
}

function landing() {
  setMetadata(
    "Invoice Handoff Sheet — Delivery and payment record",
    "Record delivered work, invoice details, and follow-ups in one handoff sheet you can share with a client.",
  );
  return `${header()}${demoBanner()}<main id="main" tabindex="-1">
    <section class="hero"><div class="hero-copy"><p class="eyebrow">DELIVERY → INVOICE → FOLLOW-UP</p><h1 tabindex="-1">Record work before chasing payment.</h1><p class="lead">For freelancers and small agencies who need delivery proof, invoice details, and follow-ups in one record.</p><div class="actions"><a class="button primary" href="/demo" data-route>Try it with sample data</a><span>Opens a finished client handoff.</span></div><div class="facts"><span>Saved in this browser</span><span>Works offline after first visit</span><span>Free to use</span></div></div><figure class="hero-art"><img src="/assets/handoff-hero.webp" width="1000" height="667" fetchpriority="high" decoding="async" alt="A clipboard, payment marker, and delivery receipt show one project handoff record."></figure></section>
    <section class="live-preview" aria-labelledby="preview-title"><div><p class="eyebrow">HANDOFF SHEET CONTENTS</p><h2 id="preview-title">Handoff sheet contents.</h2><p>Delivery proof, invoice details, payment instructions, and every follow-up stay together.</p><a class="text-link" href="/demo" data-route>Open the sample sheet →</a></div><div class="mini-sheet" aria-label="Example handoff summary"><div class="mini-top"><span>MOONBEAM STUDIO</span><b>MB-042</b></div><p class="mini-amount">$2,400.00</p><p><mark>PAST DUE</mark> · Aug 24, 2026</p><hr><p>✓ Final site delivered</p><p>✓ Taylor accepted review</p><p>→ Follow-up sent Aug 25</p></div></section>
    <section id="how" class="steps" aria-labelledby="how-title"><p class="eyebrow">HOW IT WORKS</p><h2 id="how-title">Make a record in three steps.</h2><ol><li><b>1. Add the delivery.</b><span>List each milestone and its proof link.</span></li><li><b>2. Add the invoice.</b><span>State the invoice, due date, amount, and payment instructions.</span></li><li><b>3. Log the follow-up.</b><span>Export follow-ups as CSV or download the full handoff as HTML.</span></li></ol></section>
    <section class="limits" aria-labelledby="limits-title"><h2 id="limits-title">Keep the handoff record together.</h2><p>Record delivery proof, invoice details, payment instructions, and follow-ups in the same sheet.</p></section>
    <section class="price" aria-labelledby="access-title"><p class="eyebrow">NO ACCOUNT NEEDED</p><h2 id="access-title">Save as many handoffs as you need.</h2><p>The full sheet and both exports are free to use in this browser.</p><a class="button dark" href="/app" data-route>Start a handoff</a></section>
  </main>${footer()}`;
}

function input(
  label: string,
  field: keyof Sheet,
  sheet: Sheet,
  type = "text",
  hint = "",
) {
  const amountRules =
    field === "amount"
      ? ' min="0" step="0.01" aria-describedby="form-notice"'
      : "";
  const currencyRules =
    field === "currency"
      ? ' pattern="[A-Za-z]{3}" maxlength="3" aria-describedby="form-notice"'
      : "";
  return `<label>${label}<input type="${type}" name="${field}" value="${escapeHtml(String(sheet[field] ?? ""))}" ${field === "project" || field === "client" ? "required" : ""}${amountRules}${currencyRules}>${hint ? `<small>${hint}</small>` : ""}</label>`;
}
function sheetView(sheet: Sheet) {
  setMetadata(
    isDemo ? "Demo — Invoice Handoff Sheet" : "Handoff editor — Invoice Handoff Sheet",
    isDemo
      ? "Explore a sample handoff with delivery proof, invoice details, payment instructions, and follow-ups."
      : "Edit delivery proof, invoice details, payment instructions, and follow-ups in one handoff sheet.",
  );
  const milestones =
    sheet.milestones
      .map((m, i) => {
        const proof = safeHttpUrl(m.evidence);
        return `<li class="timeline-item" data-milestone-id="${m.id}" tabindex="-1"><div class="timeline-dot">${i + 1}</div><div><b>${escapeHtml(m.title)}</b><p>Delivered ${escapeHtml(m.deliveredOn || "date not set")}</p>${proof ? `<a href="${escapeHtml(proof)}" target="_blank" rel="noreferrer">Open delivery proof <span class="sr-only">(opens in new tab)</span></a>` : '<p class="muted">No valid delivery proof link.</p>'}${m.acceptedBy ? `<p class="accepted">Accepted by ${escapeHtml(m.acceptedBy)}${m.acceptedOn ? ` on ${escapeHtml(m.acceptedOn)}` : ""}</p>` : '<p class="muted">Acceptance not recorded.</p>'}<button type="button" class="small-button danger" data-action="remove-milestone" data-id="${m.id}">Remove milestone</button></div></li>`;
      })
      .join("") ||
    '<li class="empty">No delivery milestones yet. Add the first delivered item below.</li>';
  const log =
    sheet.followUps
      .map(
        (f) =>
          `<tr data-followup-id="${f.id}" tabindex="-1"><td>${escapeHtml(f.date)}</td><td>${escapeHtml(f.method)}</td><td>${escapeHtml(f.note)}</td><td>${escapeHtml(f.outcome)}</td><td><button type="button" class="small-button danger" data-action="remove-followup" data-id="${f.id}">Remove</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="5" class="empty">No follow-ups yet. Add the first calm check-in below.</td></tr>';
  return `${header()}${demoBanner()}<main id="main" class="app-main"><div class="app-top"><div><a class="back-link" href="${isDemo ? "/demo" : "/app"}" data-route>← All handoffs</a><p class="eyebrow">CLIENT HANDOFF RECORD</p><h1 tabindex="-1">${escapeHtml(sheet.project || "New handoff")}</h1><p class="record-subtitle">${escapeHtml(sheet.client || "Client not set")} · ${escapeHtml(sheet.invoiceId || "Invoice not set")}</p></div><div class="record-actions">${statusMark(sheet)}<button class="button secondary" data-action="download-html">Download shareable HTML</button><button class="button secondary" data-action="print">Print or save PDF</button><button class="button primary" data-action="save-sheet">Save changes</button><button class="small-button danger" data-action="delete-handoff">Delete handoff</button></div></div>
  ${noticeView()}
  <form class="sheet-form" data-form="sheet"><section class="sheet-section"><div class="section-title"><span>01</span><h2>Project and client</h2></div><div class="form-grid">${input("Project name", "project", sheet)}${input("Client or company", "client", sheet)}${input("Client email", "clientEmail", sheet, "email")}</div></section>
  <section class="sheet-section"><div class="section-title"><span>02</span><h2>Delivery record</h2></div><ol class="timeline">${milestones}</ol><fieldset class="add-box"><legend>Add a delivery milestone</legend><div class="form-grid four"><label>Delivered item<input name="milestone-title" aria-required="true" aria-describedby="form-notice"></label><label>Delivered on<input type="date" name="milestone-date" aria-required="true" aria-describedby="form-notice"></label><label>Proof link<input type="url" name="milestone-evidence" placeholder="https://" inputmode="url" aria-describedby="proof-hint form-notice"><small id="proof-hint">Use a full http:// or https:// link.</small></label><label>Accepted by<input name="milestone-accepted-by"></label><label>Accepted on<input type="date" name="milestone-accepted-on"></label></div><button type="button" class="button secondary" data-action="add-milestone">Add delivery record</button></fieldset></section>
  <section class="sheet-section"><div class="section-title"><span>03</span><h2>Invoice and payment</h2></div><div class="form-grid">${input("Invoice identifier", "invoiceId", sheet)}${input("Amount due", "amount", sheet, "number")}${input("Currency code", "currency", sheet)}${input("Invoice issued", "issuedOn", sheet, "date")}${input("Due date", "dueOn", sheet, "date")}<label>Payment status<select name="status"><option value="open" ${sheet.status === "open" ? "selected" : ""}>Open</option><option value="paid" ${sheet.status === "paid" ? "selected" : ""}>Paid</option><option value="overdue" ${sheet.status === "overdue" ? "selected" : ""}>Past due</option></select></label></div><label>Payment instructions<textarea name="instructions" rows="3">${escapeHtml(sheet.instructions)}</textarea><small>Include the payment method and reference the client should use.</small></label><div class="due-callout"><b>${money(sheet)}</b><span>${dueLabel(sheet)}${sheet.dueOn ? ` · ${escapeHtml(sheet.dueOn)}` : ""}</span></div></section>
  <section class="sheet-section"><div class="section-title"><span>04</span><h2>Follow-up log</h2></div><div class="table-wrap"><table><caption class="sr-only">Follow-up log</caption><thead><tr><th>Date</th><th>Method</th><th>Note</th><th>Outcome</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${log}</tbody></table></div><fieldset class="add-box"><legend>Log a follow-up</legend><div class="form-grid four"><label>Date<input type="date" name="followup-date"></label><label>Method<select name="followup-method"><option>Email</option><option>Phone</option><option>Meeting</option><option>Other</option></select></label><label>What you sent or asked<input name="followup-note"></label><label>Outcome<input name="followup-outcome" placeholder="Awaiting reply"></label></div><button type="button" class="button secondary" data-action="add-followup">Add follow-up</button></fieldset><button type="button" class="button dark" data-action="export-csv">Export follow-up CSV</button></section></form></main>${deleteDialog()}${footer()}`;
}

function appHome() {
  setMetadata(
    "Your handoffs — Invoice Handoff Sheet",
    "Create and save delivery, invoice, and follow-up records in this browser.",
  );
  const items =
    sheets
      .map(
        (s) =>
          `<li><button class="sheet-link" data-action="open-sheet" data-id="${s.id}"><span><b>${escapeHtml(s.project || "Untitled handoff")}</b><small>${escapeHtml(s.client || "Client not set")} · ${escapeHtml(s.invoiceId || "Invoice not set")}</small></span><span>${statusMark(s)}<em>${money(s)}</em></span></button></li>`,
      )
      .join("") ||
    '<li class="empty">Your saved handoffs will appear here. Create the first one.</li>';
  return `${header()}${demoBanner()}<main id="main" class="app-main"><div class="app-top"><div><p class="eyebrow">YOUR RECORDS</p><h1 tabindex="-1">Project handoffs</h1><p class="lead">Keep delivery, invoice, and follow-up details together.</p></div><button class="button primary" data-action="new-sheet">Create handoff</button></div>${noticeView()}<section class="saved-sheets"><h2>Saved handoffs</h2><ul>${items}</ul></section></main>${footer()}`;
}

function legal(kind: "privacy" | "terms") {
  const privacy = kind === "privacy";
  setMetadata(
    `${privacy ? "Privacy" : "Terms"} — Invoice Handoff Sheet`,
    privacy
      ? "Handoff details stay in this browser. The app has no analytics."
      : "Terms for using Invoice Handoff Sheet to record delivery, invoice, and follow-up details.",
  );
  return `${header()}<main id="main" class="legal"><p class="eyebrow">${privacy ? "PRIVACY" : "TERMS"}</p><h1 tabindex="-1">${privacy ? "Your handoff details stay in your browser." : "Use this sheet as a record."}</h1>${privacy ? "<p>Invoice Handoff Sheet stores your sheets in this browser using local storage. We do not run analytics or send your handoff details to us. Delivery links point to files you choose.</p><p>You can remove local data through your browser settings. Export a CSV before clearing data if you want a copy.</p>" : "<p>This tool records the delivery, invoice, and follow-up details you enter. Check your own contract and local requirements before sharing a handoff.</p><p>The tool is free to use. You keep responsibility for your records and client agreements.</p>"}</main>${footer()}`;
}
function notFound() {
  setMetadata(
    "Page not found — Invoice Handoff Sheet",
    "The requested Invoice Handoff Sheet page is not available. Return to your handoffs.",
  );
  return `${header()}<main id="main" class="legal"><p class="eyebrow">404</p><h1 tabindex="-1">This sheet page is not here.</h1><p>Return to your handoffs and choose a record.</p><a class="button primary" href="/" data-route>Go to handoffs</a></main>${footer()}`;
}

function route(focusHeading = false, focusSelector = "") {
  syncStorageFromLocation();
  const path = location.pathname;
  let html = "";
  if (path === "/privacy") html = legal("privacy");
  else if (path === "/terms") html = legal("terms");
  else if (path === "/demo")
    html = sheets.length && activeId ? sheetView(active()!) : appHome();
  else if (path === "/app")
    html = activeId && sheets.length ? sheetView(active()!) : appHome();
  else if (path === "/") html = landing();
  else html = notFound();
  app.innerHTML = html;
  const dialog = document.querySelector<HTMLDialogElement>(".delete-dialog");
  if (dialog) {
    dialog.showModal();
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      deleteConfirmId = "";
      render('[data-action="delete-handoff"]');
    });
  }
  if (focusSelector) {
    document.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
    return;
  }
  if (focusHeading) {
    const heading = document.querySelector<HTMLElement>("h1");
    heading?.focus({ preventScroll: true });
    const status = document.querySelector<HTMLElement>("#route-status");
    if (status && heading) status.textContent = heading.textContent || "";
  }
}
function render(focusSelector = "") {
  route(false, focusSelector);
}
function navigate(to: string) {
  history.pushState({}, "", to);
  route(true);
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.closest(".skip-link")) {
    event.preventDefault();
    document.querySelector<HTMLElement>("h1")?.focus();
    document.querySelector("main")?.scrollIntoView();
    return;
  }
  const link = target.closest<HTMLAnchorElement>("a[data-route]");
  if (link) {
    event.preventDefault();
    if (link.getAttribute("href") === "/demo") {
      localStorage.removeItem("demo:invoice-handoff-sheet:sheets");
      sheets = loadSheets(true);
      activeId = sheets[0].id;
      navigate("/demo?demo=1");
    } else {
      if (
        link.classList.contains("back-link") ||
        link.getAttribute("href") === "/app"
      )
        activeId = "";
      navigate(link.href.replace(location.origin, ""));
    }
    return;
  }
  const button = target.closest<HTMLElement>("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const sheet = active();
  if (action === "reset-demo") {
    resetDemo();
    sheets = loadSheets(true);
    activeId = sheets[0].id;
    notice = "Demo reset.";
    noticeIsError = false;
    render();
  }
  if (action === "start-real") {
    navigate("/app");
  }
  if (action === "new-sheet") {
    const item = blankSheet();
    sheets.push(item);
    activeId = item.id;
    save();
    notice = "New handoff created.";
    noticeIsError = false;
    render('[data-action="save-sheet"]');
  }
  if (action === "delete-handoff" && sheet) {
    deleteConfirmId = sheet.id;
    render('[data-action="confirm-delete-handoff"]');
  }
  if (action === "cancel-delete-handoff") {
    deleteConfirmId = "";
    render('[data-action="delete-handoff"]');
  }
  if (action === "confirm-delete-handoff") {
    const index = sheets.findIndex((item) => item.id === deleteConfirmId);
    const record = sheets[index];
    if (!record) return;
    sheets = sheets.filter((item) => item.id !== record.id);
    save();
    activeId = "";
    deleteConfirmId = "";
    undoAction = { kind: "sheet", record, index };
    notice = "Handoff deleted. You can undo this removal.";
    noticeIsError = false;
    render('[data-action="undo-remove"]');
  }
  if (action === "open-sheet") {
    activeId = button.dataset.id!;
    render();
  }
  if (action === "save-sheet" && sheet) {
    const form = document.querySelector<HTMLFormElement>(
      '[data-form="sheet"]',
    )!;
    const amount = form.elements.namedItem("amount") as HTMLInputElement;
    if (!form.checkValidity()) {
      setNotice(
        amount.validity.rangeUnderflow
          ? "Amount due cannot be negative. Enter zero or a positive amount."
          : "Check the highlighted fields, then save again.",
        true,
      );
      form.reportValidity();
      return;
    }
    update(sheet.id, sheetFormPatch(form));
    notice = "Changes saved.";
    noticeIsError = false;
    undoAction = null;
    render('[data-action="save-sheet"]');
  }
  if (action === "add-milestone" && sheet) {
    const form = document.querySelector<HTMLFormElement>(
      '[data-form="sheet"]',
    )!;
    const titleInput = form.elements.namedItem(
      "milestone-title",
    ) as HTMLInputElement;
    const dateInput = form.elements.namedItem(
      "milestone-date",
    ) as HTMLInputElement;
    const proofInput = form.elements.namedItem(
      "milestone-evidence",
    ) as HTMLInputElement;
    titleInput.setCustomValidity(
      titleInput.value.trim() ? "" : "Add the delivered item.",
    );
    dateInput.setCustomValidity(
      dateInput.value ? "" : "Add the delivery date.",
    );
    proofInput.setCustomValidity(
      proofInput.value && !safeHttpUrl(proofInput.value)
        ? "Use a full link starting with http:// or https://."
        : "",
    );
    if (
      !titleInput.checkValidity() ||
      !dateInput.checkValidity() ||
      !proofInput.checkValidity()
    ) {
      const invalid = [titleInput, dateInput, proofInput].find(
        (input) => !input.checkValidity(),
      )!;
      setNotice(invalid.validationMessage, true);
      invalid.reportValidity();
      return;
    }
    const data = new FormData(form);
    const m: Milestone = {
      id: crypto.randomUUID(),
      title: titleInput.value.trim(),
      deliveredOn: dateInput.value,
      evidence: proofInput.value ? safeHttpUrl(proofInput.value)! : "",
      acceptedBy: String(data.get("milestone-accepted-by") || ""),
      acceptedOn: String(data.get("milestone-accepted-on") || ""),
    };
    update(sheet.id, {
      ...sheetFormPatch(form, true),
      milestones: [...sheet.milestones, m],
    });
    notice = "Delivery record added.";
    noticeIsError = false;
    undoAction = null;
    render(`[data-milestone-id="${m.id}"]`);
  }
  if (action === "remove-milestone" && sheet) {
    const index = sheet.milestones.findIndex((m) => m.id === button.dataset.id);
    const record = sheet.milestones[index];
    if (!record) return;
    update(sheet.id, {
      ...currentFormEdits(),
      milestones: sheet.milestones.filter((m) => m.id !== button.dataset.id),
    });
    undoAction = { kind: "milestone", sheetId: sheet.id, record, index };
    notice = "Delivery record removed. You can undo this removal.";
    noticeIsError = false;
    render('[data-action="undo-remove"]');
  }
  if (action === "add-followup" && sheet) {
    const form = document.querySelector<HTMLFormElement>(
      '[data-form="sheet"]',
    )!;
    const data = new FormData(form);
    const date = String(data.get("followup-date") || "");
    const note = String(data.get("followup-note") || "");
    if (!date || !note) {
      setNotice("Add a date and what you sent, then try again.", true);
      return;
    }
    const f: FollowUp = {
      id: crypto.randomUUID(),
      date,
      method: String(data.get("followup-method") || "Email"),
      note,
      outcome: String(data.get("followup-outcome") || "Awaiting reply"),
    };
    update(sheet.id, {
      ...sheetFormPatch(form, true),
      followUps: [...sheet.followUps, f],
    });
    notice = "Follow-up added.";
    noticeIsError = false;
    undoAction = null;
    render(`[data-followup-id="${f.id}"]`);
  }
  if (action === "remove-followup" && sheet) {
    const index = sheet.followUps.findIndex((f) => f.id === button.dataset.id);
    const record = sheet.followUps[index];
    if (!record) return;
    update(sheet.id, {
      ...currentFormEdits(),
      followUps: sheet.followUps.filter((f) => f.id !== button.dataset.id),
    });
    undoAction = { kind: "followup", sheetId: sheet.id, record, index };
    notice = "Follow-up removed. You can undo this removal.";
    noticeIsError = false;
    render('[data-action="undo-remove"]');
  }
  if (action === "undo-remove" && undoAction) {
    const actionToUndo = undoAction;
    if (actionToUndo.kind === "sheet") {
      sheets.splice(actionToUndo.index, 0, actionToUndo.record);
      save();
      activeId = "";
    } else {
      const undoSheet = sheets.find((item) => item.id === actionToUndo.sheetId);
      if (!undoSheet) return;
      if (actionToUndo.kind === "milestone") {
      const milestones = [...undoSheet.milestones];
      milestones.splice(actionToUndo.index, 0, actionToUndo.record);
      update(undoSheet.id, { ...currentFormEdits(), milestones });
      } else {
      const followUps = [...undoSheet.followUps];
      followUps.splice(actionToUndo.index, 0, actionToUndo.record);
      update(undoSheet.id, { ...currentFormEdits(), followUps });
      }
    }
    undoAction = null;
    notice = "Removal undone.";
    noticeIsError = false;
    render(
      actionToUndo.kind === "sheet"
        ? '[data-action="open-sheet"]'
        : actionToUndo.kind === "milestone"
          ? `[data-milestone-id="${actionToUndo.record.id}"]`
          : `[data-followup-id="${actionToUndo.record.id}"]`,
    );
  }
  if (action === "export-csv" && sheet) {
    update(sheet.id, currentFormEdits());
    const updatedSheet = active()!;
    download(
      `${(updatedSheet.invoiceId || "handoff").replace(/[^a-z0-9-_]/gi, "-")}-follow-ups.csv`,
      followUpCsv(updatedSheet),
    );
    notice = "Follow-up CSV downloaded.";
    noticeIsError = false;
    undoAction = null;
    render('[data-action="export-csv"]');
  }
  if (action === "download-html" && sheet) {
    update(sheet.id, currentFormEdits());
    const updatedSheet = active()!;
    download(
      `${(updatedSheet.invoiceId || "handoff").replace(/[^a-z0-9-_]/gi, "-")}-handoff.html`,
      handoffHtml(updatedSheet),
      "text/html",
    );
    notice = "Shareable handoff HTML downloaded.";
    noticeIsError = false;
    undoAction = null;
    render('[data-action="download-html"]');
  }
  if (action === "print") window.print();
});
window.addEventListener("popstate", () => route(true));
route();
if ("serviceWorker" in navigator)
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("/sw.js").catch(() => {}),
  );
