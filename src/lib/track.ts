type TrackPayload = { value?: number; currency?: string; kit?: string };

type BrowserWin = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const TX_PREFIX = "superaf-lead-tx:";
const FIRED_KEY = "superaf-lead-fired";

function browser() {
  const w = (globalThis as { window?: BrowserWin }).window;
  return w ?? null;
}

export function leadTransactionId(email: string, phone: string) {
  const w = browser();
  if (!w) return "";
  const key = `${TX_PREFIX}${email.trim().toLowerCase()}|${phone.replace(/\D/g, "")}`;
  try {
    const existing = w.sessionStorage.getItem(key);
    if (existing) return existing;
  } catch {
    /* storage blocked */
  }
  const id = crypto.randomUUID();
  try {
    w.sessionStorage.setItem(key, id);
  } catch {
    /* still return the id for this call */
  }
  return id;
}

function firedIds(w: BrowserWin) {
  try {
    const raw = w.sessionStorage.getItem(FIRED_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    return new Set(list.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set<string>();
  }
}

function rememberFired(w: BrowserWin, id: string) {
  const ids = firedIds(w);
  ids.add(id);
  try {
    w.sessionStorage.setItem(FIRED_KEY, JSON.stringify([...ids]));
  } catch {
    /* the in-memory set still skips a second call in this tick */
  }
}

export function trackDiy(event: "kit_configured" | "begin_checkout" | "purchase", payload: TrackPayload = {}) {
  const w = browser();
  if (!w) return;
  const detail = { event, currency: "CAD", ...payload };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(detail);
  const ga =
    event === "purchase" ? "purchase" : event === "begin_checkout" ? "begin_checkout" : "kit_configured";
  w.gtag?.("event", ga, { value: payload.value, currency: "CAD" });
  if (event === "purchase") w.fbq?.("track", "Purchase", { value: payload.value, currency: "CAD" });
  else if (event === "begin_checkout") w.fbq?.("track", "InitiateCheckout", { value: payload.value, currency: "CAD" });
  else w.fbq?.("trackCustom", "KitConfigured", { value: payload.value, currency: "CAD" });
}

export function trackLeadConversion(input: { transactionId: string; value?: number }) {
  const w = browser();
  if (!w || !input.transactionId) return;
  if (firedIds(w).has(input.transactionId)) return;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      w.dataLayer?.push(arguments);
    };
  }
  w.gtag("event", "conversion", {
    send_to: "AW-18489064646/E3SCCKLm2Y0dEMb5ovBE",
    value: input.value ?? 1.0,
    currency: "CAD",
    transaction_id: input.transactionId,
  });
  rememberFired(w, input.transactionId);
}

export function readUtm() {
  const w = browser();
  if (!w) return "";
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const params = new URLSearchParams(w.location.search);
  const found = keys.map((k) => (params.get(k) ? `${k}=${params.get(k)}` : "")).filter(Boolean);
  if (found.length) w.sessionStorage.setItem("superaf-utm", found.join(" · "));
  return w.sessionStorage.getItem("superaf-utm") ?? "";
}
