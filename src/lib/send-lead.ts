import { createServerFn } from "@tanstack/react-start";
import { buildConfirmMessage } from "@/lib/confirm-email";

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
  firstName?: string;
  packageName?: string;
  filmName?: string;
  totalDisplay?: string;
  hoursLabel?: string;
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
    const text = await res.text().catch(() => "");
    let json: { success?: string | boolean } = {};
    try {
      json = text ? (JSON.parse(text) as { success?: string | boolean }) : {};
    } catch {
      json = {};
    }
    if (!res.ok || json.success === "false" || json.success === false) {
      console.error("[sendLead] lead failed", res.status, text.slice(0, 300));
      throw new Error("lead email failed");
    }
    return { ok: true as const };
  });

export const confirmLead = createServerFn({ method: "POST" })
  .inputValidator((d: LeadMail) => d)
  .handler(async ({ data }) => {
    const key = process.env.RESEND_API_KEY?.trim();
    if (!key) {
      console.error("[confirmLead] RESEND_API_KEY missing");
      return { ok: false as const, skipped: true as const };
    }
    const message = buildConfirmMessage(data);
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
        subject: message.subject,
        html: message.html,
        text: message.text,
        headers: {
          "List-Unsubscribe": "<mailto:book@superaf.ca?subject=unsubscribe>",
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[confirmLead] resend failed", res.status, body.slice(0, 300));
      return { ok: false as const, skipped: false as const };
    }
    return { ok: true as const };
  });
