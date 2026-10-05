type TrackPayload = { value?: number; currency?: string; kit?: string };

type BrowserWin = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

const TX_PREFIX = "superaf-lead-tx:";
const FIRED_KEY = "superaf-lead-fired";
const firedMemory = new Set<string>();

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

function storedFiredIds(w: BrowserWin) {
  try {
    const raw = w.sessionStorage.getItem(FIRED_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    return list.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function alreadyFired(w: BrowserWin, id: string) {
  if (firedMemory.has(id)) return true;
  return storedFiredIds(w).includes(id);
}

function rememberFired(w: BrowserWin, id: string) {
  firedMemory.add(id);
  try {
    const ids = new Set([...storedFiredIds(w), id]);
    w.sessionStorage.setItem(FIRED_KEY, JSON.stringify([...ids]));
  } catch {
    /* memory already has the id */
  }
}

export function toE164(phone: string | undefined) {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return "";
}

export function normalizeLeadEmail(email: string | undefined) {
  const value = (email ?? "").trim().toLowerCase();
  const at = value.indexOf("@");
  if (at < 1 || !value.slice(at + 1).includes(".")) return "";
  return value;
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

export function trackLeadConversion(input: {
  transactionId: string;
  value?: number;
  email?: string;
  phone?: string;
}) {
  const w = browser();
  if (!w || !input.transactionId) return;
  if (alreadyFired(w, input.transactionId)) return;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      w.dataLayer?.push(arguments);
    };
  }
  const userData: { email?: string; phone_number?: string } = {};
  const email = normalizeLeadEmail(input.email);
  const phone = toE164(input.phone);
  if (email) userData.email = email;
  if (phone) userData.phone_number = phone;
  if (email || phone) w.gtag("set", "user_data", userData);
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
