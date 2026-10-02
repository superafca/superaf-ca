type TrackPayload = { value?: number; currency?: string; kit?: string };

export function trackDiy(event: "kit_configured" | "begin_checkout" | "purchase", payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  const detail = { event, currency: "CAD", ...payload };
  const w = window as Window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(detail);
  const ga =
    event === "purchase" ? "purchase" : event === "begin_checkout" ? "begin_checkout" : "kit_configured";
  w.gtag?.("event", ga, { value: payload.value, currency: "CAD" });
  if (event === "purchase") w.fbq?.("track", "Purchase", { value: payload.value, currency: "CAD" });
  else if (event === "begin_checkout") w.fbq?.("track", "InitiateCheckout", { value: payload.value, currency: "CAD" });
  else w.fbq?.("trackCustom", "KitConfigured", { value: payload.value, currency: "CAD" });
}

export function trackLeadConversion() {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      w.dataLayer?.push(arguments);
    };
  }
  w.gtag("event", "conversion", {
    send_to: "AW-18489064646/E3SCCKLm2Y0dEMb5ovBE",
    value: 1.0,
    currency: "CAD",
  });
}
  if (typeof window === "undefined") return "";
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const params = new URLSearchParams(window.location.search);
  const found = keys.map((k) => (params.get(k) ? `${k}=${params.get(k)}` : "")).filter(Boolean);
  if (found.length) sessionStorage.setItem("superaf-utm", found.join(" · "));
  return sessionStorage.getItem("superaf-utm") ?? "";
}
