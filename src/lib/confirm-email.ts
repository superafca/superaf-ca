export type ConfirmFields = {
  name?: string;
  contact?: string;
  vehicle?: string;
  firstName?: string;
  packageName?: string;
  filmName?: string;
  totalDisplay?: string;
  hoursLabel?: string;
};

const TEL = "tel:+15879009494";
const WHATSAPP = "https://wa.me/15879009494";
const MAPS = "https://www.google.com/maps/search/?api=1&query=SUPERAF.CA+3W2W%2BHV+Calgary%2C+Alberta";
const IG = "https://instagram.com/besuperaf";
const REVIEW = "https://g.page/r/CQNKQDNeuW2REAI/review";
const ADDRESS = "426 Memorial Drive NE, Calgary, AB";
const HOURS = "Mon–Fri 09:00–18:00";

const STEP_2 =
  "We set your drop-off date and time, and confirm your final price if anything on the estimate needs a check.";
const STEP_3 = "You drop off at 426 Memorial Drive NE.";

export function customerFilmName(filmId: string | null | undefined, finish = "") {
  if (filmId !== "pp5" && filmId !== "pp10") return "";
  const name = filmId === "pp5" ? "COST" : "QUALITY";
  const fin = finish.trim();
  return fin ? `${name} · ${fin}` : name;
}

export function customerPackLine(packageName: string, filmName: string) {
  return [packageName.trim(), filmName.trim()].filter(Boolean).join(" · ");
}

export function confirmFirstName(name: string | undefined, explicit?: string) {
  const given = (explicit ?? "").trim();
  if (given) return given;
  const token = (name ?? "").trim().split(/\s+/)[0] ?? "";
  return token || "there";
}

export function bookingSms(firstName: string, vehicle: string, packageName: string) {
  const what = [vehicle.trim(), packageName.trim()].filter(Boolean).join(" ");
  const body = `Hi, it's ${firstName}, booking my ${what}`.replace(/ +/g, " ").trim();
  return `sms:+15879009494?&body=${encodeURIComponent(body)}`;
}

export function contactNext(contact: string | undefined) {
  if (contact === "text") {
    return {
      step: "We text you. If we don't hear back, we give you a call.",
      preheader: "We'll text you to set your drop-off.",
    };
  }
  if (contact === "whatsapp") {
    return {
      step: "We message you on WhatsApp. If we don't hear back, we give you a call.",
      preheader: "We'll message you on WhatsApp to set your drop-off.",
    };
  }
  return {
    step: "We call you. If we miss you, we follow up by text.",
    preheader: "We'll call you to set your drop-off.",
  };
}

export function confirmSubject(vehicle: string, totalDisplay: string) {
  const car = vehicle.trim();
  const total = totalDisplay.trim();
  if (car && total) return `Your ${car} estimate: ${total}`;
  if (car) return `Your ${car} estimate`;
  return "We received your SUPERAF estimate";
}

function esc(value: string) {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const gt = "&" + "gt;";
  const quot = "&" + "quot;";
  return value.replace(/&/g, amp).replace(/</g, lt).replace(/>/g, gt).replace(/"/g, quot);
}

function row(label: string, value: string, tone: "text" | "green" = "text") {
  const color = tone === "green" ? "#22a84a" : "#e7fdff";
  return `<tr>
    <td style="padding:7px 12px 7px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;vertical-align:top;">${esc(label)}</td>
    <td style="padding:7px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:1.35;color:${color};">${esc(value)}</td>
  </tr>`;
}

function button(label: string, href: string) {
  return `<td class="cta-cell" align="center" bgcolor="#22a84a" style="border-radius:999px;background-color:#22a84a;">
    <a class="cta-btn" href="${esc(href)}" style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;background-color:#22a84a;">${esc(label)}</a>
  </td>`;
}

function gap() {
  return `<td class="cta-gap" width="10" style="width:10px;font-size:0;line-height:0;">&nbsp;</td>`;
}

export function buildConfirmMessage(input: ConfirmFields) {
  const firstName = confirmFirstName(input.name, input.firstName);
  const vehicle = (input.vehicle ?? "").trim();
  const packageName = (input.packageName ?? "").trim();
  const filmName = (input.filmName ?? "").trim();
  const totalDisplay = (input.totalDisplay ?? "").trim();
  const hoursLabel = (input.hoursLabel ?? "").trim() === "—" ? "" : (input.hoursLabel ?? "").trim();
  const next = contactNext(input.contact);
  const sms = bookingSms(firstName, vehicle, packageName);
  const subject = confirmSubject(vehicle, totalDisplay);
  const cardBits = [packageName, totalDisplay, hoursLabel].filter(Boolean);
  const preheader = `Got it, ${firstName}. ${cardBits.join(" · ")}${cardBits.length ? ". " : ""}${next.preheader}`;

  const rows = [
    vehicle ? row("Vehicle", vehicle) : "",
    packageName ? row("Package", packageName) : "",
    filmName ? row("Film", filmName) : "",
    totalDisplay ? row("Total", totalDisplay, "green") : "",
    hoursLabel ? row("Time", hoursLabel) : "",
  ]
    .filter(Boolean)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <meta name="supported-color-schemes" content="dark light" />
  <title>${esc(subject)}</title>
  <style type="text/css">
    :root { color-scheme: dark light; supported-color-schemes: dark light; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; display: block; }
    @media only screen and (max-width: 620px) {
      .email-shell { width: 100% !important; }
      .email-pad { padding-left: 16px !important; padding-right: 16px !important; }
      .cta-btn { padding-left: 18px !important; padding-right: 18px !important; }
      .cta-row, .cta-row tbody, .cta-row tr { display: block !important; width: 100% !important; }
      .cta-cell { display: block !important; width: 100% !important; }
      .cta-gap { display: block !important; width: 100% !important; height: 10px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#06080e;width:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#06080e;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#06080e;width:100%;">
    <tr><td align="center" style="padding:24px 12px;background-color:#06080e;">
      <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#0b0f17;border:1px solid #1a3a44;border-radius:16px;">
        <tr><td style="height:4px;line-height:4px;font-size:0;background-color:#12f7ff;border-radius:16px 16px 0 0;">&nbsp;</td></tr>
        <tr><td class="email-pad" align="center" style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;background-color:#0b0f17;">
          <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.18em;color:#12f7ff;text-transform:uppercase;">SUPERAF.CA // ESTIMATE LOCKED</p>
          <p style="margin:10px 0 0;font-size:28px;font-weight:700;color:#e7fdff;">Got it, ${esc(firstName)}.</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.45;color:#9ad7e4;">We received your estimate. Here's the card.</p>
        </td></tr>
        <tr><td class="email-pad" style="padding:20px 32px 8px;background-color:#0b0f17;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#10141c;border:1px solid #12f7ff;border-radius:14px;">
            <tr><td style="padding:20px 22px;font-family:Arial,Helvetica,sans-serif;background-color:#10141c;">
              <p style="margin:0 0 14px;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.16em;color:#12f7ff;text-transform:uppercase;">YOUR ESTIMATE</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
            </td></tr>
          </table>
        </td></tr>
        <tr><td class="email-pad" align="center" style="padding:22px 32px 8px;background-color:#0b0f17;">
          <table role="presentation" class="cta-row" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
            ${button("Call", TEL)}
            ${gap()}
            ${button("Text", sms)}
            ${gap()}
            ${button("WhatsApp", WHATSAPP)}
          </tr></table>
        </td></tr>
        <tr><td class="email-pad" style="padding:18px 32px 8px;font-family:Arial,Helvetica,sans-serif;background-color:#0b0f17;">
          <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.16em;color:#12f7ff;text-transform:uppercase;">WHAT HAPPENS NEXT</p>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.45;color:#e7fdff;">1. ${esc(next.step)}</p>
          <p style="margin:0 0 8px;font-size:15px;line-height:1.45;color:#e7fdff;">2. ${esc(STEP_2)}</p>
          <p style="margin:0;font-size:15px;line-height:1.45;color:#e7fdff;">3. ${esc(STEP_3)}</p>
        </td></tr>
        <tr><td class="email-pad" style="padding:18px 32px 8px;background-color:#0b0f17;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#10141c;border:1px solid #ff4dff;border-radius:14px;">
            <tr><td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;background-color:#10141c;">
              <p style="margin:0 0 10px;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:0.16em;color:#ff4dff;text-transform:uppercase;">THE FILM</p>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.4;color:#e7fdff;">Hydrophobic</p>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.4;color:#e7fdff;">Anti-Yellowing</p>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.4;color:#e7fdff;">Repairing — self-repairs minor scratches quickly with heat</p>
              <p style="margin:0;font-size:15px;line-height:1.4;color:#e7fdff;">Durable</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td class="email-pad" style="padding:18px 32px 8px;font-family:Arial,Helvetica,sans-serif;background-color:#0b0f17;">
          <p style="margin:0;font-size:15px;line-height:1.45;color:#e7fdff;">Liked the work? <a href="${esc(REVIEW)}" style="color:#12f7ff;text-decoration:underline;">Leave a Google review</a></p>
        </td></tr>
        <tr><td class="email-pad" style="padding:18px 32px 8px;font-family:Arial,Helvetica,sans-serif;background-color:#0b0f17;">
          <p style="margin:0 0 6px;font-size:15px;line-height:1.45;"><a href="${esc(MAPS)}" style="color:#12f7ff;text-decoration:underline;">${esc(ADDRESS)}</a></p>
          <p style="margin:0 0 6px;font-size:14px;line-height:1.45;color:#9ad7e4;">${esc(HOURS)}</p>
          <p style="margin:0;font-size:14px;line-height:1.45;"><a href="${esc(IG)}" style="color:#9ad7e4;text-decoration:underline;">@besuperaf</a></p>
        </td></tr>
        <tr><td class="email-pad" align="center" style="padding:22px 32px 28px;font-family:Arial,Helvetica,sans-serif;background-color:#0b0f17;">
          <p style="margin:0;font-size:16px;font-weight:700;color:#e7fdff;">⭐️ SUPERAF.CA ⭐️</p>
          <p style="margin:10px 0 0;font-size:13px;line-height:1.45;color:#9ad7e4;">Reply to this email if something needs to change.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const lines: Array<string | null> = [
    `Got it, ${firstName}.`,
    "",
    "We received your estimate. Here's the card.",
    "",
    vehicle ? `Vehicle: ${vehicle}` : null,
    packageName ? `Package: ${packageName}` : null,
    filmName ? `Film: ${filmName}` : null,
    totalDisplay ? `Total: ${totalDisplay}` : null,
    hoursLabel ? `Time: ${hoursLabel}` : null,
    "",
    `Call: ${TEL}`,
    `Text: ${sms}`,
    `WhatsApp: ${WHATSAPP}`,
    "",
    "What happens next",
    `1. ${next.step}`,
    `2. ${STEP_2}`,
    `3. ${STEP_3}`,
    "",
    "The film: Hydrophobic. Anti-Yellowing. Repairing (self-repairs minor scratches quickly with heat). Durable.",
    "",
    `Liked the work? Leave a Google review: ${REVIEW}`,
    "",
    ADDRESS,
    HOURS,
    "Instagram @besuperaf",
    "",
    "⭐️ SUPERAF.CA ⭐️",
    "",
    "Reply to this email if something needs to change.",
  ];

  return { subject, html, text: lines.filter((line) => line !== null).join("\n"), sms };
}
