export const site = {
  name: "SUPERAF.CA",
  short: "SUPERAF",
  product: "HARD PP",
  tagline: "CHIP. FRONT. TRIM. ALL.",
  lede: "Hydrophobic paint protection film. Calgary. Starting prices.",
  phone: "(587) 555-0140",
  phoneHref: "tel:+15875550140",
  smsHref: "sms:+15875550140",
  email: "book@superaf.ca",
  emailHref: "mailto:book@superaf.ca",
  ig: "besuperaf",
  igHref: "https://instagram.com/besuperaf",
  address: "426 Memorial Drive NE, Calgary, AB",
  addressNote: "Bay inside Dentologist. Text or call before you come — we’re sometimes offsite.",
  maps: "https://maps.google.com/?q=426+Memorial+Drive+NE+Calgary+AB",
  hours: "Mon–Fri 10:00–17:00",
  hoursNote: "Mobile May–October, indoor and temp-controlled only. Extra fee.",
  hoursFilmed: "37,440",
  carsFilmed: "5,000+",
} as const;

export const nav = [
  { href: "#quote", label: "Quote" },
  { href: "#packages", label: "Packages" },
  { href: "#film", label: "HARD PP" },
  { href: "#shop", label: "Film shop" },
] as const;

export const PROMO_ENDS = "2027-01-01T00:00:00-07:00";
export const PROMO_RATE = 0.2;
export const FIVE_OFF_CHIP = 120;

export function promoActive(now = Date.now()) {
  return now < Date.parse(PROMO_ENDS);
}

/** Nearest price ending in 49 or 99. */
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
  { id: "sedan", label: "Sedan / coupe", band: "sedan" },
  { id: "suv", label: "SUV / crossover", band: "suv" },
  { id: "truck", label: "Truck", band: "suv" },
] as const;

export const packages = [
  {
    id: "chip",
    name: "CHIP",
    blurb: "24\" hood, matching fenders, front bumper.",
    includes: [
      "24\" hood",
      "Matching fenders",
      "Front bumper",
      "Wrapped and tucked edges",
    ],
    listSedan: 799,
    listSuv: 949,
    days: "Same day",
    image: "/images/pkg-chip.jpg",
    featured: false,
  },
  {
    id: "front",
    name: "FRONT",
    blurb: "Full hood, full fenders, bumper, mirror caps.",
    includes: [
      "Full hood",
      "Full fenders",
      "Front bumper",
      "Mirror caps",
      "Wrapped and tucked edges",
    ],
    listSedan: 1399,
    listSuv: 1599,
    days: "1 day",
    image: "/images/pkg-front.jpg",
    featured: true,
  },
  {
    id: "trim",
    name: "TRIM",
    blurb: "Front plus A-pillars, roof edge, door cups.",
    includes: [
      "Everything in FRONT",
      "A-pillars",
      "Front of the roof",
      "Door cups",
      "Painted flares and trim",
      "Wrapped and tucked edges",
    ],
    listSedan: 1749,
    listSuv: 1999,
    days: "1–2 days",
    image: "/images/pkg-trim.jpg",
    featured: false,
  },
  {
    id: "all",
    name: "ALL",
    blurb: "The whole vehicle. Clear, matte, satin, or colour.",
    includes: [
      "Every painted panel",
      "Clear, matte, satin, or colour",
      "Wrapped and tucked edges",
    ],
    listSedan: 3899,
    listSuv: 5899,
    days: "5+ days",
    image: "/images/pkg-all.jpg",
    featured: false,
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
    note: "Self-healing hydrophobic top coat. 5-year film warranty.",
  },
  {
    id: "pp10",
    name: "HARD PP 10",
    years: 10,
    note: "Self-healing hydrophobic top coat. 10-year film warranty.",
  },
] as const;

export const tints = [
  {
    id: "carbon",
    name: "Carbon tint",
    blurb: "Privacy and glare. Limited lifetime warranty.",
    sedan: 349,
    suv: 399,
  },
  {
    id: "ceramic",
    name: "Ceramic tint",
    blurb: "Heat rejection. Limited lifetime warranty.",
    sedan: 499,
    suv: 579,
  },
] as const;

export const windshield = {
  id: "windshield",
  name: "Windshield protection film",
  sedan: 199,
  suv: 199,
  blurb:
    "Sacrificial layer. 1-year warranty for yellowing and delamination only — not wiper wear, chips, or pressure-washer damage. Keep wipers clean.",
} as const;

export const shopItems = [
  {
    id: "kit",
    name: "HARD PP sample kit",
    price: "Text for a kit",
    copy: "Clear, matte, and colour chips. Hold it in the sun first.",
  },
  {
    id: "pp5roll",
    name: "HARD PP 5 · 60\" roll",
    price: "Installer pricing",
    copy: "5-year hydrophobic TPU. Self-healing top coat. Plotter ready.",
  },
  {
    id: "pp10roll",
    name: "HARD PP 10 · 60\" roll",
    price: "Installer pricing",
    copy: "10-year self-healing hydrophobic TPU. Same wash rules as the big names.",
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

export const faqs = [
  {
    q: "Are these real prices?",
    a: "Starting-at, by size. Body kits, painted extras, and odd panels can move it after we see the car.",
  },
  {
    q: "Do I need to text first?",
    a: "Yes. We sublease the bay and we’re sometimes offsite. Call or text, then come in.",
  },
  {
    q: "Mobile?",
    a: "May through October, indoor and temperature-controlled only. Extra fee. Ask when you text.",
  },
  {
    q: "Headlights and rockers?",
    a: "Not in the four packages. We price those on the car.",
  },
  {
    q: "Tint and windshield?",
    a: "Add them on the quote. Check local law on shade and windshield film before you book.",
  },
];

export type SizeId = (typeof sizes)[number]["id"];
export type PackageId = (typeof packages)[number]["id"];
export type FilmId = (typeof films)[number]["id"];
export type TintId = (typeof tints)[number]["id"] | "none";
export type FinishId = (typeof finishes)[number]["id"];

export function sizeBand(sizeId: string): "sedan" | "suv" {
  const size = sizes.find((s) => s.id === sizeId);
  return size?.band ?? "sedan";
}

export function packageListPrice(packageId: string, sizeId: string) {
  const pack = packages.find((p) => p.id === packageId) ?? packages[1];
  return sizeBand(sizeId) === "suv" ? pack.listSuv : pack.listSedan;
}

export function tenYearPrice(packageId: string, sizeId: string, now = Date.now()) {
  const list = packageListPrice(packageId, sizeId);
  if (!promoActive(now)) return list;
  return roundTo49or99(list * (1 - PROMO_RATE));
}

export function fiveYearPrice(packageId: string, sizeId: string, now = Date.now()) {
  const chipTenSedan = tenYearPrice("chip", "sedan", now);
  const fiveChip = roundUp49or99(chipTenSedan - FIVE_OFF_CHIP);
  const ten = tenYearPrice(packageId, sizeId, now);
  return roundUp49or99((ten * fiveChip) / chipTenSedan);
}

export function quotePrice(opts: {
  sizeId: string;
  packageId: string;
  filmId: string;
  tintId?: TintId;
  windshield?: boolean;
  now?: number;
}) {
  const now = opts.now ?? Date.now();
  const pack = packages.find((p) => p.id === opts.packageId) ?? packages[1];
  const film = films.find((f) => f.id === opts.filmId) ?? films[1];
  const band = sizeBand(opts.sizeId);
  const list = packageListPrice(opts.packageId, opts.sizeId);
  const ten = tenYearPrice(opts.packageId, opts.sizeId, now);
  const filmAmount = opts.filmId === "pp5" ? fiveYearPrice(opts.packageId, opts.sizeId, now) : ten;

  const tint = tints.find((t) => t.id === opts.tintId);
  const tintAmount = tint ? tint[band] : 0;
  const glassAmount = opts.windshield ? windshield[band] : 0;

  return {
    amount: filmAmount + tintAmount + glassAmount,
    filmAmount,
    tintAmount,
    glassAmount,
    list,
    promo: promoActive(now),
    size: sizes.find((s) => s.id === opts.sizeId)?.label ?? "Sedan / coupe",
    pack,
    film,
    days: pack.days,
    band,
  };
}
