export const site = {
  name: "SUPERAF.CA",
  short: "SUPERAF",
  product: "HARD PP©",
  tagline: "LEVEL 1. LEVEL 2. LEVEL 3. LEVEL 4. MAX.",
  lede: "Hydrophobic paint protection film. Calgary. Starting prices.",
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
  maps: "https://maps.google.com/?q=426+Memorial+Drive+NE+Calgary+AB",
  mapsEmbed:
    "https://maps.google.com/maps?q=426%20Memorial%20Drive%20NE%2C%20Calgary%2C%20AB&z=16&output=embed",
  hours: "Mon–Fri 09:00–18:00",
  hoursNote: "Mobile May–October, indoor and temp-controlled only. Extra fee.",
  carsFilmed: "5,000+",
  googleSearch:
    "https://www.google.com/search?q=SUPERAF.CA+paint+protection+film+Calgary",
  googleMapsSearch:
    "https://www.google.com/maps/search/?api=1&query=SUPERAF.CA+426+Memorial+Drive+NE+Calgary+AB",
  googleReview: "",
} as const;

export const nav = [
  { href: "/", label: "Quote" },
  { href: "/vision", label: "Vision" },
] as const;

export const hardPpMenu = [
  { href: "/ppf", label: "HARD PP (PPF)" },
  { href: "/windshield", label: "Windshield Protection Film" },
  { href: "/tint", label: "Window Tint" },
] as const;

export const PROMO_ENDS = "2027-01-01T00:00:00-07:00";
export const PROMO_RATE = 0.1;

export function promoActive(now = Date.now()) {
  return now < Date.parse(PROMO_ENDS);
}

export function packHasWinter(packageId: string) {
  return packageId === "lvl1" || packageId === "lvl2";
}

export function roundTo49or99(n: number) {
  const c49 = Math.round((n - 49) / 100) * 100 + 49;
  const c99 = Math.round((n - 99) / 100) * 100 + 99;
  return Math.abs(n - c49) <= Math.abs(n - c99) ? c49 : c99;
}

export function roundUp49or99(n: number) {
  const up49 = Math.ceil((n - 49) / 100) * 100 + 49;
  const up99 = Math.ceil((n - 99) / 100) * 100 + 99;
  return Math.min(up49, up99);
}

export const sizes = [
  { id: "compact", label: "Compact / hatch", band: "sedan" },
  { id: "sedan", label: "Sedan, crossover", band: "sedan" },
  { id: "mid", label: "Midsize SUV / truck", band: "mid" },
  { id: "truck", label: "Truck / full-size SUV", band: "truck" },
] as const;

export function packageArt(packageId: string, sizeId: string) {
  const set = sizeId === "compact" || sizeId === "sedan" ? "crv" : "g63";
  const id =
    packageId === "lvl1" || packageId === "lvl2" || packageId === "lvl3" || packageId === "lvl4"
      ? packageId
      : "max";
  return `/images/pkg-${set}-${id}.png?v=1`;
}

export const packages = [
  {
    id: "max",
    name: "MAX LEVEL",
    kicker: "ALL",
    blurb: "Every painted exterior panel. Clear, matte, satin, or colour.",
    includes: [
      "Every painted exterior panel",
      "Clear, matte, satin, or colour",
      "Wrapped and tucked edges",
    ],
    listSedan: 4999,
    listSuv: 6499,
    daysBase: 5,
    daysPlus: true,
    daysLabel: "5+ days",
    featured: false,
    badge: "",
    fill: "hover:bg-lvlmax data-[on]:bg-lvlmax",
    tone: "lvlmax",
    price: "text-lvlmax",
  },
  {
    id: "lvl4",
    name: "LEVEL 4",
    kicker: "WEAR",
    blurb:
      "High-wear without the whole car. A-pillars, door cups, front of the roof, lower doors, rockers, luggage strip.",
    includes: [
      "Everything in LEVEL 3",
      "A-pillars",
      "Door cups",
      "Front of the roof",
      "Rocker panels",
      "Lower doors",
      "Luggage strip",
    ],
    listSedan: 2599,
    listSuv: 3099,
    daysBase: 2,
    daysPlus: false,
    daysLabel: "2 days",
    featured: false,
    badge: "",
    fill: "hover:bg-lvl4 data-[on]:bg-lvl4",
    tone: "lvl4",
    price: "text-lvl4",
  },
  {
    id: "lvl3",
    name: "LEVEL 3",
    kicker: "TRIM",
    blurb:
      "Complete front-end protection. Grille, headlights, fog lights, fender flares. If your car does not have those panels — we substitute with A-pillars and roof.",
    includes: [
      "Everything in LEVEL 2",
      "Grille",
      "Headlights and fog lights",
      "Painted fender flares",
      "Substitutions below",
    ],
    listSedan: 1999,
    listSuv: 2399,
    daysBase: 1,
    daysPlus: false,
    daysLabel: "1–2 days",
    featured: false,
    badge: "",
    fill: "hover:bg-lvl3 data-[on]:bg-lvl3",
    tone: "lvl3",
    price: "text-lvl3",
  },
  {
    id: "lvl2",
    name: "LEVEL 2",
    kicker: "FRONT",
    blurb:
      "Covers the front end of most vehicles, as pictured. There are exceptions. Painted trim panels, fender flares, grille, or other areas to protect not listed in LEVEL 2? → LEVEL 3.",
    includes: [
      "Full hood",
      "Full fenders",
      "Front bumper",
      "Mirror caps",
      "Wrapped and tucked edges",
    ],
    listSedan: 1399,
    listSuv: 1599,
    daysBase: 1,
    daysPlus: false,
    daysLabel: "1 day",
    featured: true,
    badge: "MOST POPULAR",
    fill: "hover:bg-lvl2 data-[on]:bg-lvl2",
    tone: "lvl2",
    price: "text-lvl2",
  },
  {
    id: "lvl1",
    name: "LEVEL 1",
    kicker: "CHIP",
    blurb: "Bumper, 24\" hood, matching fenders. The hit zone.",
    includes: [
      "Front bumper",
      "24\" hood",
      "Matching fenders",
      "Wrapped and tucked edges",
    ],
    listSedan: 799,
    listSuv: 949,
    daysBase: 0,
    daysPlus: false,
    daysLabel: "Same day",
    featured: false,
    badge: "",
    fill: "hover:bg-lvl1 data-[on]:bg-lvl1",
    tone: "lvl1",
    price: "text-lvl1",
  },
] as const;

export const finishes = [
  { id: "clear", name: "Clear" },
  { id: "matte", name: "Matte" },
  { id: "satin", name: "Satin" },
  { id: "colour", name: "Colour" },
] as const;

export const films = [
  {
    id: "pp5",
    name: "HARD PP 5",
    years: 5,
    mil: "7.5 mil",
    headline: "I WANT SAVINGS 🤑",
    note: "7.5 mil. Self-healing, hydrophobic.",
  },
  {
    id: "pp10",
    name: "HARD PP 10",
    years: 10,
    mil: "8+ mil",
    headline: "I WANT IT ALL 😍",
    note: "8+ mil — thicker. Deeper gloss. Smooth finish. Enhanced hydrophobics and self healing.",
  },
] as const;

export const glasses = [
  {
    id: "clear",
    name: "Clear windshield film",
    blurb: "Sacrificial clear layer. 1-year warranty for yellowing and delamination — not wiper wear, chips, or pressure-washer damage.",
    list: 299,
    days: 1,
    image: "/images/addon-glass-clear.png",
  },
  {
    id: "photo",
    name: "Light-sensitive windshield film",
    blurb: "Darkens in the sun, clears in the shade. Same sacrificial layer, plus glare control.",
    list: 349,
    days: 1,
    image: "/images/addon-glass-photo.png",
  },
] as const;

export const tints = [
  {
    id: "w2",
    name: "2 windows",
    blurb: "Two door windows. Adjacent quarters included.",
    carbon: 179,
    ceramic: 239,
  },
  {
    id: "w3",
    name: "3 windows",
    blurb: "Two doors + rear screen. Adjacent quarters.",
    carbon: 299,
    ceramic: 429,
  },
  {
    id: "w5",
    name: "5 windows",
    blurb: "Four doors + rear screen. Adjacent quarters.",
    carbon: 349,
    ceramic: 509,
  },
  {
    id: "w7",
    name: "7 windows",
    blurb: "Doors, rear, quarters. SUV / wagon.",
    carbon: 429,
    ceramic: 609,
  },
  {
    id: "w9",
    name: "9 windows",
    blurb: "Full glass. Vans, thirds, vents.",
    carbon: 499,
    ceramic: 699,
  },
] as const;

export const tintExtras = [
  {
    id: "brow",
    name: "Eyebrow",
    blurb: "Visor strip above the AS1 line.",
    carbon: 79,
    ceramic: 99,
  },
  {
    id: "shade",
    name: "Windshield tint",
    blurb: "Near-clear heat film on the full windshield.",
    carbon: 239,
    ceramic: 319,
  },
  {
    id: "roof",
    name: "Sunroof",
    blurb: "Standard or panoramic glass.",
    carbon: 119,
    ceramic: 199,
  },
] as const;

export const tintFilms = [
  {
    id: "carbon",
    name: "Carbon",
    blurb: "Cost effective. Shade that doesn’t fade.",
    icon: "/images/icon-shades.png",
  },
  {
    id: "ceramic",
    name: "Ceramic",
    blurb: "Enhanced solar rejection for skin protection.",
    icon: "/images/icon-ice.png",
  },
] as const;

export const warrantyCovered = [
  "Yellowing",
  "Staining",
  "Cracking, crazing, blistering",
  "Peeling, bubbling, delamination",
  "Adhesive failure from the film",
];

export const warrantyNotCovered = [
  "Rock chips, scratches, and road rash — the film is there to take that",
  "Accidents, vandalism, or third-party work",
  "Brush car washes and high-pressure at the edges",
  "Harsh chemicals, solvents, or abrasive pads",
  "Paint that was already failing before we filmed it",
];

export const aftercare = [
  "Wait 48 hours before the first wash.",
  "Hand wash or touchless. pH-neutral soap.",
  "Keep the pressure washer off the edges.",
  "Bugs and bird droppings off the same day.",
  "Light swirls relax with warmth — sun or warm water.",
  "A PPF seal twice a year keeps the gloss honest.",
];

export type SizeId = (typeof sizes)[number]["id"];
export type PackageId = (typeof packages)[number]["id"];
export type FilmId = (typeof films)[number]["id"];
export type TintId = (typeof tints)[number]["id"] | "none";
export type TintFilmId = (typeof tintFilms)[number]["id"];
export type TintExtraId = (typeof tintExtras)[number]["id"];
export type GlassId = (typeof glasses)[number]["id"] | "none";
export type FinishId = (typeof finishes)[number]["id"];
export const contactMethods = [
  { id: "call", label: "Call" },
  { id: "text", label: "Text" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export type ContactId = (typeof contactMethods)[number]["id"];

export type SizeBand = "sedan" | "mid" | "truck";

const FILM_FROM = {
  pp5: {
    sedan: { lvl1: 699, lvl2: 999, lvl3: 1249, lvl4: 1599, max: 3499 },
    mid: { lvl1: 849, lvl2: 1199, lvl3: 1549, lvl4: 1899, max: 4299 },
    truck: { lvl1: 949, lvl2: 1349, lvl3: 1749, lvl4: 2199, max: 4899 },
  },
  pp10: {
    sedan: { lvl1: 799, lvl2: 1099, lvl3: 1449, lvl4: 1799, max: 4299 },
    mid: { lvl1: 949, lvl2: 1299, lvl3: 1749, lvl4: 2099, max: 5099 },
    truck: { lvl1: 1049, lvl2: 1449, lvl3: 1949, lvl4: 2399, max: 5699 },
  },
} as const;

const FILM_LIST = {
  pp5: {
    sedan: { lvl1: 799, lvl2: 1149, lvl3: 1249, lvl4: 1599, max: 3499 },
    mid: { lvl1: 949, lvl2: 1349, lvl3: 1549, lvl4: 1899, max: 4299 },
    truck: { lvl1: 1049, lvl2: 1549, lvl3: 1749, lvl4: 2199, max: 4899 },
  },
  pp10: {
    sedan: { lvl1: 899, lvl2: 1249, lvl3: 1449, lvl4: 1799, max: 4299 },
    mid: { lvl1: 1049, lvl2: 1449, lvl3: 1749, lvl4: 2099, max: 5099 },
    truck: { lvl1: 1149, lvl2: 1649, lvl3: 1949, lvl4: 2399, max: 5699 },
  },
} as const;

export function sizeBand(sizeId: string): SizeBand {
  const size = sizes.find((s) => s.id === sizeId);
  const band = size?.band;
  if (band === "mid" || band === "truck") return band;
  return "sedan";
}

function packKey(packageId: string): "lvl1" | "lvl2" | "lvl3" | "lvl4" | "max" {
  if (packageId === "lvl1" || packageId === "lvl2" || packageId === "lvl3" || packageId === "lvl4") {
    return packageId;
  }
  return "max";
}

function filmKey(filmId: string): "pp5" | "pp10" {
  return filmId === "pp5" ? "pp5" : "pp10";
}

export function packageListPrice(packageId: string, sizeId: string, filmId = "pp10") {
  return FILM_LIST[filmKey(filmId)][sizeBand(sizeId)][packKey(packageId)];
}

export function filmFromPrice(
  packageId: string,
  sizeId: string,
  filmId = "pp10",
  now = Date.now(),
) {
  const list = packageListPrice(packageId, sizeId, filmId);
  if (!promoActive(now) || !packHasWinter(packageId)) return list;
  return FILM_FROM[filmKey(filmId)][sizeBand(sizeId)][packKey(packageId)];
}

export function tenYearPrice(packageId: string, sizeId: string, now = Date.now()) {
  return filmFromPrice(packageId, sizeId, "pp10", now);
}

export function fiveYearPrice(packageId: string, sizeId: string, now = Date.now()) {
  return filmFromPrice(packageId, sizeId, "pp5", now);
}

export function glassPrice(id: GlassId, now = Date.now()) {
  if (id === "clear") return promoActive(now) ? 199 : 299;
  if (id === "photo") return 349;
  return 0;
}

export function stackedDays(opts: {
  packageId: string;
  sizeId?: string;
  tintId?: TintId;
  tintExtras?: readonly string[];
  glassId?: GlassId;
}) {
  const pack = packages.find((p) => p.id === opts.packageId) ?? packages[0];
  if (pack.daysPlus) return "5+ days";
  const tintOn =
    (opts.tintId && opts.tintId !== "none") ||
    (opts.tintExtras && opts.tintExtras.length > 0);
  const extra =
    (tintOn ? 1 : 0) + (opts.glassId && opts.glassId !== "none" ? 1 : 0);
  const n = pack.daysBase + extra;
  if (n <= 0) return "Same day";
  if (n === 1) return "1 day";
  return `${n} days`;
}

export function quotePrice(opts: {
  sizeId: string;
  packageId: string;
  filmId: string;
  tintId?: TintId;
  tintFilmId?: TintFilmId;
  tintExtras?: readonly TintExtraId[];
  glassId?: GlassId;
  now?: number;
}) {
  const now = opts.now ?? Date.now();
  const pack = packages.find((p) => p.id === opts.packageId) ?? packages[0];
  const film = films.find((f) => f.id === opts.filmId) ?? films[1];
  const list = packageListPrice(opts.packageId, opts.sizeId, opts.filmId);
  const filmAmount = filmFromPrice(opts.packageId, opts.sizeId, opts.filmId, now);

  const kind: TintFilmId = opts.tintFilmId ?? "ceramic";
  const tint = tints.find((t) => t.id === opts.tintId);
  const extraList = (opts.tintExtras ?? []).reduce((sum, id) => {
    const row = tintExtras.find((e) => e.id === id);
    return sum + (row ? row[kind] : 0);
  }, 0);
  const tintList = (tint ? tint[kind] : 0) + extraList;
  const tintAmount = tintList;
  const glass = glasses.find((g) => g.id === opts.glassId);
  const glassAmount = glass ? glassPrice(glass.id, now) : 0;
  const filmList = packageListPrice(opts.packageId, opts.sizeId, opts.filmId);
  const glassList = glass ? glass.list : 0;
  const listTotal = filmList + tintList + glassList;
  const days = stackedDays({
    packageId: opts.packageId,
    sizeId: opts.sizeId,
    tintId: opts.tintId,
    tintExtras: opts.tintExtras,
    glassId: opts.glassId,
  });

  return {
    amount: filmAmount + tintAmount + glassAmount,
    filmAmount,
    tintAmount,
    glassAmount,
    list: listTotal,
    savings: Math.max(0, listTotal - (filmAmount + tintAmount + glassAmount)),
    promo: promoActive(now),
    size: sizes.find((s) => s.id === opts.sizeId)?.label ?? "Sedan / coupe",
    pack,
    film,
    days,
    band: sizeBand(opts.sizeId),
  };
}
