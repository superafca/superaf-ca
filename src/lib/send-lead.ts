import { createServerFn } from "@tanstack/react-start";

export type LeadMail = {
  name: string;
  phone: string;
  email: string;
  contact: string;
  vehicle: string;
  quote: string;
  notes: string;
  photoName?: string;
  photoData?: string;
  install?: string;
};

export const sendLead = createServerFn({ method: "POST" })
  .inputValidator((d: LeadMail) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://formsubmit.co/ajax/book@superaf.ca", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: "https://superaf.ca",
        Referer: "https://superaf.ca/",
      },
      body: JSON.stringify({
        _subject: `SUPERAF quote — ${data.name} — ${data.vehicle}`,
        _template: "box",
        _captcha: "false",
        _replyto: data.email,
        name: data.name,
        email: data.email,
        phone: data.phone,
        contact: data.contact,
        vehicle: data.vehicle,
        quote: data.quote,
        notes: data.notes || "—",
        install: data.install || "MEDIUM · unknown — default medium",
        photo: data.photoName || "none",
        ...(data.photoData ? { photo_data: data.photoData } : {}),
      }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
    };
    if (!res.ok || json.success === "false" || json.success === false) {
      throw new Error("lead email failed");
    }
    return { ok: true as const };
  });

export const confirmLead = createServerFn({ method: "POST" })
  .inputValidator((d: LeadMail) => d)
  .handler(async ({ data }) => {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) return { ok: false as const, skipped: true as const };
    const lines = [
      `Hey ${data.name},`,
      "",
      "We received your estimate. Here’s what we locked in:",
      "",
      `Vehicle: ${data.vehicle || "—"}`,
      `Phone: ${data.phone || "—"}`,
      `Estimate: ${data.quote || "—"}`,
      data.notes ? `Notes: ${data.notes}` : "",
      "",
      "If those details are right, this is the quote we’ll schedule from. Reply to this email if something needs to change.",
      "",
      "SUPERAF.CA",
      "426 Memorial Drive NE, Calgary",
      "(587) 900-9494",
    ].filter((line) => line !== "");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "SUPERAF.CA <book@superaf.ca>",
        to: [data.email],
        reply_to: "book@superaf.ca",
        subject: "We received your SUPERAF estimate",
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) return { ok: false as const, skipped: false as const };
    return { ok: true as const };
  });
