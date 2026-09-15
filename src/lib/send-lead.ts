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
};

export const sendLead = createServerFn({ method: "POST" })
  .inputValidator((d: LeadMail) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://formsubmit.co/ajax/book@superaf.ca", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `SUPERAF quote — ${data.name} — ${data.vehicle}`,
        _template: "box",
        _captcha: "false",
        name: data.name,
        email: data.email,
        phone: data.phone,
        contact: data.contact,
        vehicle: data.vehicle,
        quote: data.quote,
        notes: data.notes || "—",
        photo: data.photoName || "none",
        ...(data.photoData ? { photo_data: data.photoData } : {}),
      }),
    });
    if (!res.ok) throw new Error("lead email failed");
    return { ok: true as const };
  });
