import { createServerFn } from "@tanstack/react-start";

export type DiyMail = {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  summary: string;
  total: number;
  utm: string;
  address: string;
};

async function postShop(subject: string, data: DiyMail) {
  const res = await fetch("https://formsubmit.co/ajax/book@superaf.ca", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: "https://superaf.ca",
      Referer: "https://superaf.ca/diy",
    },
    body: JSON.stringify({
      _subject: subject,
      _template: "box",
      _captcha: "false",
      _replyto: data.email,
      _cc: data.email,
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicle: data.vehicle,
      address: data.address || "—",
      order: data.summary,
      total: `$${data.total} CAD`,
      utm: data.utm || "—",
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
  if (!res.ok || json.success === "false" || json.success === false) throw new Error("order email failed");
}

export const sendDiyOrder = createServerFn({ method: "POST" })
  .inputValidator((d: DiyMail) => d)
  .handler(async ({ data }) => {
    await postShop(`SUPERAF DIY kit — ${data.name} — ${data.vehicle}`, data);
    return { ok: true as const };
  });

function safeOrigin(origin: string) {
  try {
    const url = new URL(origin);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol === "https:" || (url.protocol === "http:" && local)) return url.origin;
  } catch {
    /* ignore */
  }
  return null;
}

export const startDiyCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: DiyMail & { origin: string }) => d)
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    const origin = safeOrigin(data.origin);
    if (!key || !origin) return { url: null as string | null };
    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("success_url", `${origin}/diy?paid=1&session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${origin}/diy?paid=0`);
    body.set("customer_email", data.email);
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "cad");
    body.set("line_items[0][price_data][unit_amount]", String(Math.round(data.total * 100)));
    body.set("line_items[0][price_data][product_data][name]", `HARD PP DIY — ${data.vehicle}`.slice(0, 120));
    body.set("line_items[0][price_data][product_data][description]", data.summary.slice(0, 400));
    body.set("metadata[utm]", data.utm.slice(0, 450));
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: { message?: string } };
    if (!res.ok || !json.url) throw new Error(json.error?.message || "stripe");
    return { url: json.url };
  });

export const verifyDiyPayment = createServerFn({ method: "POST" })
  .inputValidator((d: { sessionId: string }) => d)
  .handler(async ({ data }) => {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || !data.sessionId.startsWith("cs_")) return { paid: false as const, amount: 0 };
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(data.sessionId)}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    const json = (await res.json().catch(() => ({}))) as { payment_status?: string; amount_total?: number };
    if (!res.ok || json.payment_status !== "paid") return { paid: false as const, amount: 0 };
    return { paid: true as const, amount: (json.amount_total ?? 0) / 100 };
  });
