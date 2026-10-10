const MAPS_URL =
  "https://www.google.com/maps/place/SUPERAF.CA/data=!4m7!3m6!1s0x537165bff29bd7ff:0x916db95e33404a03!8m2!3d51.051479!4d-114.0528115!16s%2Fg%2F11nw2bf_xz!19sChIJ_9eb8r9lcVMRA0pAM165bZE";

export const site = {
  name: "SUPERAF.CA",
  short: "SUPERAF",
  product: "HARD PP(F)©",
  viewName: "Glass Protection",
  tagline: "PPF longer.",
  lede: "Paint protection. Glass protection. Tint. Best PPF in Calgary.",
  phone: "(587) 900-9494",
  phoneHref: "tel:+15879009494",
  smsHref: "sms:+15879009494",
  whatsappHref: "https://wa.me/15879009494",
  email: "book@superaf.ca",
  emailHref: "mailto:book@superaf.ca",
  ig: "besuperaf",
  igHref: "https://instagram.com/besuperaf",
  address: "426 Memorial Drive NE, Calgary, AB",
  addressNote: "Text or call for an appointment.",
  maps: MAPS_URL,
  mapsEmbed: "https://maps.google.com/maps?q=3W2W%2BHV%2C+Calgary%2C+Alberta&z=17&output=embed",
  hours: "Mon–Fri 09:00–18:00",
  hoursNote: "This location shares a space with Dentologist.",
  carsFilmed: "403",
  upgrades2026: "403",
  allTime: "5,439",
  established: "EST. 2016",
  installerYears: "14 years of installer experience",
  googleSearch: "https://www.google.com/search?q=SUPERAF.CA+Calgary+paint+protection+film",
  googleMapsSearch: MAPS_URL,
  googleReview: "https://g.page/r/CQNKQDNeuW2REAI/review",
  sitePremiere: "20 September 2026",
  googlePremiere: "20 September 2026",
} as const;

export const proofStats = [
  {
    value: site.allTime,
    label: "Vehicles protected since 2016",
    short: "Vehicles protected since 2016",
    text: `${site.allTime} vehicles protected since 2016`,
  },
  {
    value: site.carsFilmed,
    label: "Vehicles protected in last 12 months",
    short: "Vehicles protected in last 12 months",
    text: `${site.carsFilmed} vehicles protected in last 12 months`,
  },
  {
    value: site.installerYears.slice(0, site.installerYears.indexOf(" ")),
    label: "Years protecting Calgary vehicles",
    short: "Years protecting Calgary vehicles",
    text: `${site.installerYears.slice(0, site.installerYears.indexOf(" "))} years protecting Calgary vehicles`,
  },
  {
    value: "Over $300M",
    label: "in vehicles protected since 2016",
    short: "in vehicles protected since 2016",
    text: "Over $300M in vehicles protected since 2016",
  },
] as const;

export function packageArt(
  _packageId: string,
  art: "hatch" | "sedan" | "suv" | "truck" = "suv",
  tinted = false,
) {
  const set = ["hatch", "sedan", "suv", "truck"].includes(art) ? art : "suv";
  return `/images/rig-${set}-${tinted ? "black" : "white"}.png?v=7`;
}

export const packages = [
  {
    id: "front",
    name: "FRONT",
    kicker: "",
    blurb: "Full front PPF. Hood, fenders, bumper, mirrors. The kit people love.",
    includes: ["Full hood", "Full fenders", "Front bumper", "Mirror caps", "Wrapped and tucked edges"],
    daysBase: 1,
    daysPlus: false,
    daysLabel: "6 hours",
    featured: true,
    badge: "",
    why: "THE KIT PEOPLE LOVE",
    offer: "Hood, fenders, bumper, mirrors. The kit people love.",
    fill: "hover:bg-lvl2 data-[on]:bg-lvl2",
    tone: "lvl2",
    price: "text-lvl2",
  },
  {
    id: "custom",
    name: "FRONT+",
    kicker: "PICK YOUR ADDONS",
    blurb: "FRONT plus the pieces you pick.",
    includes: ["Everything in FRONT", "You pick the extras", "Trim and wear priced a la carte"],
    daysBase: 6,
    daysPlus: false,
    daysLabel: "6+ hours",
    featured: false,
    badge: "",
    why: "PICK YOUR ADDONS",
    offer: "FRONT plus the pieces you pick.",
    fill: "hover:bg-lvl3 data-[on]:bg-lvl3",
    tone: "lvl3",
    price: "text-lvl3",
  },
  {
    id: "max",
    name: "MAX",
    kicker: "",
    blurb: "Full body. Every painted exterior panel.",
    includes: ["Every painted exterior panel", "Clear on 5YR and 10YR", "Matte and satin on 10YR", "Colour on 10YR (+$500)"],
    daysBase: 10,
    daysPlus: true,
    daysLabel: "1–2 weeks",
    why: "EVERY PAINTED PANEL",
    offer: "Full body. Every painted exterior panel.",
    featured: false,
    badge: "",
    fill: "hover:bg-lvlmax data-[on]:bg-lvlmax",
    tone: "lvlmax",
    price: "text-lvlmax",
  },
] as const;

export const customParts = [
  { id: "cups", name: "Door cups", group: "trim", price: 99, hours: 0.5 },
  { id: "pillars", name: "A-pillars", group: "trim", price: 149, hours: 0.5 },
  { id: "roof", name: "Front of roof", group: "trim", price: 149, hours: 0.5 },
  { id: "flares", name: "Fender flares", group: "trim", price: 249, hours: 1 },
  { id: "grille", name: "Grille", group: "trim", price: 149, hours: 1 },
  { id: "lights", name: "Headlights / fog", group: "trim", price: 199, hours: 1 },
  { id: "rockers", name: "Rockers", group: "wear", price: 349, hours: 1 },
  { id: "doors", name: "Lower doors", group: "wear", price: 349, hours: 2 },
] as const;

export type CustomPartId = (typeof customParts)[number]["id"];

export const finishes = [
  { id: "clear", name: "Clear" },
  { id: "matte", name: "Matte" },
  { id: "satin", name: "Satin" },
  { id: "colour", name: "Colour" },
] as const;

export const films = [
  {
    id: "pp10",
    name: "QUALITY",
    years: 10,
    mil: "8+ mil",
    kicker: "10YR",
    headline: "10YR",
    why: "QUALITY",
    offer: "10 year PPF. 8+ mil. Deeper gloss. Faster self-heal. Stronger hydrophobics.",
    variations: ["Clear", "Matte", "Satin", "Colour"],
    note: "10 year PPF. 8+ mil. Deeper gloss. Faster self-heal. Stronger hydrophobics.",
  },
  {
    id: "pp5",
    name: "COST",
    years: 5,
    mil: "7.5 mil",
    kicker: "5YR",
    headline: "5YR",
    why: "COST",
    offer: "5 year PPF. 7.5 mil. Self-healing. Hydrophobic. Rock chip protection.",
    variations: ["Clear"],
    note: "5 year PPF. 7.5 mil. Self-healing. Hydrophobic. Rock chip protection.",
  },
] as const;

/** Lined up so the cheaper film can be marked where it falls short. */
export const filmCompare = [
  { feature: "Self-healing", cost: "Yes", quality: "Yes", costOn: true, qualityOn: true },
  { feature: "Faster self-heal", cost: "×", quality: "Yes", costOn: false, qualityOn: true },
  { feature: "Hydrophobic", cost: "Yes", quality: "Yes", costOn: true, qualityOn: true },
  { feature: "Stronger beading", cost: "×", quality: "Yes", costOn: false, qualityOn: true },
  { feature: "Chip protection", cost: "Yes", quality: "Yes", costOn: true, qualityOn: true },
  { feature: "Thickness", cost: "7.5 mil", quality: "8+ mil", costOn: true, qualityOn: true },
  { feature: "Clarity", cost: "Soft", quality: "Deep gloss", costOn: true, qualityOn: true },
  { feature: "Warranty", cost: "5 years", quality: "10 years", costOn: true, qualityOn: true },
  { feature: "Clear", cost: "Yes", quality: "Yes", costOn: true, qualityOn: true },
  { feature: "Matte", cost: "×", quality: "Yes", costOn: false, qualityOn: true },
  { feature: "Satin", cost: "×", quality: "Yes", costOn: false, qualityOn: true },
] as const;

export const tintCompare = [
  { feature: "UV block", carbon: "99%", ceramic: "99%+", carbonOn: true, ceramicOn: true },
  { feature: "Shade holds colour", carbon: "Yes", ceramic: "Yes", carbonOn: true, ceramicOn: true },
  { feature: "Phone signal", carbon: "Clear", ceramic: "Clear", carbonOn: true, ceramicOn: true },
  { feature: "Film warranty", carbon: "Limited lifetime", ceramic: "Limited lifetime", carbonOn: true, ceramicOn: true },
  { feature: "Infrared rejection", carbon: "×", ceramic: "Up to 94%", carbonOn: false, ceramicOn: true },
  { feature: "Glare cut", carbon: "×", ceramic: "Stronger", carbonOn: false, ceramicOn: true },
  { feature: "Shades", carbon: "5 · 18 · 25 · 36", ceramic: "5 · 14 · 21 · 32 · 45 · 65", carbonOn: true, ceramicOn: true },
] as const;

export const windowShots = {
  2: { src: "/images/win-front-2.jpg?v=5", caption: "Front windows" },
  4: { src: "/images/win-front-4.jpg?v=5", caption: "Front windows" },
  3: { src: "/images/win-rear-3.jpg?v=5", caption: "Rear windows" },
  5: { src: "/images/win-rear-5.jpg?v=5", caption: "Rear windows" },
  7: { src: "/images/win-rear-7.jpg?v=5", caption: "Rear windows" },
} as const;

export const glasses = [
  {
    id: "clear",
    name: "Clear",
    kicker: "Glass Protection",
    blurb: "See it all. 5 mil. Self-healing. Scratch resistant.",
    list: 269,
    days: 1,
    why: "SEE IT ALL",
    offer: "Maximum visibility. Sacrificial layer for Deerfoot gravel.",
    pros: ["Maximum visibility", "Self-healing", "Scratch resistant", "5 mil thick"],
    cons: ["Hides less", "Shows wiper wear"],
    life: "1–3 years",
    shades: [] as const,
  },
  {
    id: "tinted",
    name: "Tinted",
    kicker: "Glass Protection",
    blurb: "Cut the glare. 70% or 35% VLT. Same 5 mil film.",
    list: 269,
    days: 1,
    why: "CUT THE GLARE",
    offer: "Same sacrificial film. 70% or 35% visible light.",
    pros: ["Glare down", "Self-healing", "Scratch resistant", "5 mil thick"],
    cons: ["Darker at night", "Shows wiper wear"],
    life: "1–3 years",
    shades: ["70%", "35%"] as const,
  },
] as const;

export const FRONT_WINDOWS = [2, 4] as const;
export const REAR_WINDOWS = [3, 5, 7] as const;
export type FrontWindows = (typeof FRONT_WINDOWS)[number];
export type RearWindows = (typeof REAR_WINDOWS)[number];

export function snapFrontWindows(n: number): FrontWindows {
  return n >= 4 ? 4 : 2;
}

export function snapRearWindows(n: number): RearWindows {
  if (n >= 6) return 7;
  if (n >= 4) return 5;
  return 3;
}

/** Front and rear are priced apart. They add up to the old full-tint totals. */
const TINT_FRONT_PRICE = {
  2: { carbon: 179, ceramic: 239 },
  4: { carbon: 259, ceramic: 339 },
} as const;

const TINT_REAR_PRICE = {
  3: { carbon: 200, ceramic: 270 },
  5: { carbon: 250, ceramic: 370 },
  7: { carbon: 320, ceramic: 460 },
} as const;

export const TINT_FRONT_HOURS = 2;
export const TINT_REAR_HOURS = 4;
export const TINT_ZONE_HOURS = "2–3 hours";

export const TINT_WINDSHIELD_PRICE = { carbon: 279, ceramic: 379 } as const;
export const TINT_VISOR_PRICE = { carbon: 89, ceramic: 109 } as const;

export function tintWindshieldPrice(kind: TintFilmId) {
  return TINT_WINDSHIELD_PRICE[kind];
}

export function tintVisorPrice(kind: TintFilmId) {
  return TINT_VISOR_PRICE[kind];
}

export function tintFrontPrice(front: FrontWindows, kind: TintFilmId) {
  return TINT_FRONT_PRICE[front][kind];
}

export function tintRearPrice(rear: RearWindows, kind: TintFilmId) {
  return TINT_REAR_PRICE[rear][kind];
}

export function tintQuotePrice(front: FrontWindows, rear: RearWindows, kind: TintFilmId) {
  return tintFrontPrice(front, kind) + tintRearPrice(rear, kind);
}

export const tintFilms = [
  {
    id: "carbon",
    name: "Carbon",
    blurb: "Cost effective. Shade that doesn’t fade.",
    icon: "/images/icon-shades.png",
    bg: "/images/tint-carbon.jpg?v=1",
  },
  {
    id: "ceramic",
    name: "Ceramic",
    blurb: "Enhanced solar rejection for skin protection.",
    icon: "/images/icon-ice.png",
    bg: "/images/tint-ceramic.jpg?v=1",
  },
] as const;

export const contactMethods = [
  { id: "call", label: "Call" },
  { id: "text", label: "Text" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export type PackageId = (typeof packages)[number]["id"];
export type FilmId = (typeof films)[number]["id"];
export type TintFilmId = (typeof tintFilms)[number]["id"];

export const tintShades: Record<TintFilmId, readonly number[]> = {
  carbon: [5, 18, 25, 36],
  ceramic: [5, 14, 21, 32, 45, 65],
};

/** VLT on the menu. 18–25% is factory glass. Ends of the list are darkest and lightest. */
export function shadeChoices(kind: TintFilmId) {
  const list = tintShades[kind];
  const lo = Math.min(...list);
  const hi = Math.max(...list);
  return list.map((vlt) => {
    let tag = "";
    if (vlt >= 18 && vlt <= 25) tag = "match factory tint";
    else if (vlt === lo) tag = "darkest";
    else if (vlt === hi) tag = "lightest";
    return { vlt, label: tag ? `${vlt}% — ${tag}` : `${vlt}%` };
  });
}
export type GlassId = (typeof glasses)[number]["id"] | "none";
export type FinishId = (typeof finishes)[number]["id"];
export type ContactId = (typeof contactMethods)[number]["id"];

export type SizeBand = "sedan" | "mid" | "truck";

export const BAND_LABEL: Record<SizeBand, string> = {
  sedan: "Sedan / crossover",
  mid: "Midsize SUV / truck",
  truck: "Truck / full-size SUV",
};

export function asBand(id: string): SizeBand {
  if (id === "mid" || id === "truck" || id === "sedan") return id;
  return "sedan";
}

export type RankId = "easy" | "medium" | "hard";

const FILM_BASE = {
  pp5: {
    easy: { front: 849, max: 2799 },
    medium: { front: 1099, max: 3499 },
    hard: { front: 1549, max: 3999 },
  },
  pp10: {
    easy: { front: 999, max: 3299 },
    medium: { front: 1249, max: 4299 },
    hard: { front: 1699, max: 4699 },
  },
} as const;

function filmKey(filmId: string): "pp5" | "pp10" {
  return filmId === "pp5" ? "pp5" : "pp10";
}

function rankKey(rank: string): RankId {
  if (rank === "easy" || rank === "hard") return rank;
  return "medium";
}

function packKey(packageId: string): "front" | "custom" | "max" {
  if (packageId === "front" || packageId === "custom") return packageId;
  return "max";
}

function sizeBump(band: SizeBand, packageId: string) {
  const max = packKey(packageId) === "max";
  if (band === "truck") return max ? 1400 : 250;
  if (band === "mid") return max ? 800 : 200;
  return 0;
}

export function partPrice(id: string) {
  return customParts.find((p) => p.id === id)?.price ?? 0;
}

export function extrasTotal(ids: readonly string[] = []) {
  return ids.reduce((sum, id) => sum + partPrice(id), 0);
}

export function extrasHours(ids: readonly string[] = []) {
  return ids.reduce((sum, id) => {
    const row = customParts.find((p) => p.id === id);
    return sum + (row?.hours ?? 0);
  }, 0);
}

export function formatHours(h: number) {
  const mins = Math.round(h * 60);
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours <= 0) return rem === 30 ? "30 min" : `${rem} min`;
  if (rem === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  if (rem === 30) return `${hours}.5 hours`;
  return `${hours}h ${rem}m`;
}

export function kitTimeLabel(packageId: string, parts: readonly string[] = []) {
  if (packKey(packageId) === "max") return "1–2 weeks";
  if (packKey(packageId) === "front") return "6 hours";
  const extra = extrasHours(parts);
  if (extra <= 0) return "6+ hours";
  return formatHours(6 + extra);
}

export const COLOUR_UPCHARGE = 500;

export function filmFromPrice(
  packageId: string,
  band: string,
  filmId = "pp10",
  rank: string = "medium",
  parts: readonly string[] = [],
  finishId = "",
) {
  const row = FILM_BASE[filmKey(filmId)][rankKey(rank)];
  const pack = packKey(packageId);
  if (pack === "max") {
    let n = row.max + sizeBump(asBand(band), "max");
    if (finishId === "colour" && filmKey(filmId) === "pp10") n += COLOUR_UPCHARGE;
    return { from: n, to: n };
  }
  const front = row.front + sizeBump(asBand(band), "front");
  if (pack === "custom") {
    const n = front + extrasTotal(parts);
    return { from: n, to: n };
  }
  return { from: front, to: front };
}

/** Largest honest gap between 5YR and 10YR, floored so the claim never rounds up. */
export function maxFilmSavingsPercent() {
  const ranks = ["easy", "medium", "hard"] as const;
  const bands: SizeBand[] = ["sedan", "mid", "truck"];
  const packs = ["front", "max"] as const;
  let max = 0;
  for (const rank of ranks) {
    for (const band of bands) {
      for (const pack of packs) {
        const hi = filmFromPrice(pack, band, "pp10", rank).from;
        const lo = filmFromPrice(pack, band, "pp5", rank).from;
        if (hi > 0) max = Math.max(max, (hi - lo) / hi);
      }
    }
  }
  return Math.floor(max * 100);
}

export function batchInstallTime(parts: readonly string[]) {
  let hours = 0;
  let plus = false;
  let extraDay = false;
  const rest: string[] = [];
  for (const bit of parts) {
    const m = bit.match(/^(\d+(?:\.\d+)?)(\+)? hours?( \+ 1 day)?$/);
    if (m) {
      hours += Number(m[1]);
      if (m[2]) plus = true;
      if (m[3]) extraDay = true;
      continue;
    }
    if (bit) rest.push(bit);
  }
  const hourLabel =
    hours > 0
      ? `${Number.isInteger(hours) ? hours : hours}${plus ? "+" : ""} ${hours === 1 && !plus ? "hour" : "hours"}`
      : "";
  const head = hourLabel ? `${hourLabel}${extraDay ? " + 1 day" : ""}` : "";
  return [...rest, head].filter(Boolean).join(" · ") || "—";
}

export function glassPrice(id: GlassId, _now = Date.now()) {
  if (id === "none") return 0;
  return glasses.find((g) => g.id === id)?.list ?? 0;
}

export function quotePrice(opts: {
  band: SizeBand;
  rank?: RankId | string;
  packageId: string;
  filmId: string;
  finishId?: string;
  ppfOn?: boolean;
  tintOn?: boolean;
  tintFilmId?: TintFilmId;
  glassId?: GlassId;
  parts?: readonly CustomPartId[];
  frontWindows?: number;
  rearWindows?: number;
  windshieldTint?: boolean;
  visorTint?: boolean;
  now?: number;
}) {
  const now = opts.now ?? Date.now();
  const rank = opts.rank ?? "medium";
  const ppfOn = opts.ppfOn !== false;
  const pack = packages.find((p) => p.id === opts.packageId) ?? packages[0];
  const film = films.find((f) => f.id === opts.filmId) ?? films[0];
  const filmAmount = ppfOn
    ? filmFromPrice(opts.packageId, opts.band, opts.filmId, rank, opts.parts, opts.finishId).from
    : 0;
  const extrasAmount = ppfOn && packKey(opts.packageId) === "custom" ? extrasTotal(opts.parts) : 0;
  const kind: TintFilmId = opts.tintFilmId ?? "carbon";
  const frontSel = opts.frontWindows ? snapFrontWindows(opts.frontWindows) : null;
  const rearSel = opts.rearWindows ? snapRearWindows(opts.rearWindows) : null;
  const windowTint = opts.tintOn
    ? (frontSel ? tintFrontPrice(frontSel, kind) : 0) + (rearSel ? tintRearPrice(rearSel, kind) : 0)
    : 0;
  const zoneTint = opts.windshieldTint
    ? tintWindshieldPrice(kind)
    : opts.visorTint
      ? tintVisorPrice(kind)
      : 0;
  const tintAmount = windowTint + zoneTint;
  const tintHours = opts.tintOn ? (frontSel ? TINT_FRONT_HOURS : 0) + (rearSel ? TINT_REAR_HOURS : 0) : 0;
  const glass = glasses.find((g) => g.id === opts.glassId);
  const glassAmount = glass ? glassPrice(glass.id, now) : 0;
  const timeBits = [
    ppfOn ? kitTimeLabel(opts.packageId, opts.parts) : "",
    opts.tintOn && tintHours ? `${tintHours} ${tintHours === 1 ? "hour" : "hours"}` : "",
    opts.windshieldTint || opts.visorTint ? TINT_ZONE_HOURS : "",
    glass ? "windshield 1 day" : "",
  ].filter(Boolean);

  return {
    amount: filmAmount + tintAmount + glassAmount,
    amountTo: filmAmount + tintAmount + glassAmount,
    ranged: false,
    filmAmount,
    extrasAmount,
    tintAmount,
    glassAmount,
    list: filmAmount + tintAmount + (glass ? glass.list : 0),
    savings: 0,
    promo: false,
    size: BAND_LABEL[opts.band],
    pack,
    film,
    days: batchInstallTime(timeBits),
    band: opts.band,
    rank: rankKey(rank),
  };
}
