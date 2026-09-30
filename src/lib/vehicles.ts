export const OTHER = "other";

const NOW = 2026;
export const YEARS = Array.from({ length: 10 }, (_, i) => String(NOW - i));

export type Rank = "easy" | "medium" | "hard";
export type ArtSet = "hatch" | "sedan" | "suv" | "truck";
export type SizeBand = "sedan" | "mid" | "truck";

export type VehicleModel = {
  name: string;
  from: number;
  to: number;
  rank: Rank;
  bumper: string;
  band: SizeBand;
  art: ArtSet;
  frontWindows: 2 | 4;
  rearWindows: number;
};

export type VehicleMake = {
  name: string;
  models: VehicleModel[];
};

const unknown = {
  rank: "medium" as Rank,
  label: "MEDIUM",
  bumper: "unknown — default medium",
  band: "mid" as SizeBand,
  art: "suv" as ArtSet,
  frontWindows: 2 as 2 | 4,
  rearWindows: 3,
  known: false,
};

/** Calgary-sold makes. band = quote size. rank = internal install only. */
export const MAKES: VehicleMake[] = [
  {
    name: "Acura",
    models: [
      m("ADX", 2025, 2026, "easy", "1–2 pc, flat", "sedan"),
      m("Integra", 2023, 2026, "easy", "2 pc", "sedan"),
      m("MDX", 2017, 2026, "medium", "curved bumper", "mid"),
      m("RDX", 2017, 2026, "easy", "2 pc", "sedan"),
      m("TLX", 2017, 2026, "medium", "curved bumper", "sedan"),
    ],
  },
  {
    name: "Audi",
    models: [
      m("A3", 2017, 2026, "easy", "2 pc", "sedan"),
      m("A4", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("A5", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("A6", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("e-tron / Q8 e-tron", 2019, 2026, "medium", "curved bumper", "mid"),
      m("Q3", 2019, 2026, "easy", "2 pc", "sedan"),
      m("Q5", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Q7", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Q8", 2019, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "BMW",
    models: [
      m("2 Series", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("3 Series", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("4 Series", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("5 Series", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("X1", 2017, 2026, "easy", "2 pc", "sedan"),
      m("X2", 2018, 2026, "easy", "2 pc", "sedan"),
      m("X3", 2017, 2026, "medium", "curved bumper", "mid"),
      m("X4", 2017, 2026, "medium", "curved bumper", "mid"),
      m("X5", 2017, 2026, "medium", "curved bumper", "mid"),
      m("X6", 2017, 2026, "medium", "curved hood", "mid"),
      m("X7", 2019, 2026, "medium", "curved bumper", "truck"),
      m("i4", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("iX", 2022, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "Buick",
    models: [
      m("Enclave", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Encore / Encore GX", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Envision", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Envista", 2024, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Cadillac",
    models: [
      m("CT4", 2020, 2026, "medium", "curved bumper", "sedan"),
      m("CT5", 2020, 2026, "medium", "curved bumper", "sedan"),
      m("Escalade", 2017, 2026, "medium", "curved bumper", "truck"),
      m("Lyriq", 2023, 2026, "medium", "curved bumper", "mid"),
      m("XT4", 2019, 2026, "easy", "2 pc", "sedan"),
      m("XT5", 2017, 2026, "medium", "curved bumper", "mid"),
      m("XT6", 2020, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "Chevrolet",
    models: [
      m("Blazer", 2019, 2026, "medium", "curved bumper", "mid"),
      m("Bolt EUV / EV", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Camaro", 2017, 2024, "hard", "deep bumper + hood", "sedan"),
      m("Colorado", 2017, 2026, "medium", "truck bumper", "mid"),
      m("Corvette", 2017, 2026, "hard", "compound bumper + hood", "sedan"),
      m("Equinox", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Malibu", 2017, 2025, "easy", "2 pc", "sedan"),
      m("Silverado 1500", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Suburban", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Tahoe", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Traverse", 2017, 2026, "easy", "2 pc", "mid"),
      m("Trax", 2017, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Chrysler",
    models: [m("Pacifica", 2017, 2026, "easy", "2 pc", "mid")],
  },
  {
    name: "Dodge",
    models: [
      m("Challenger", 2017, 2023, "medium", "curved bumper", "sedan"),
      m("Charger", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Durango", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Hornet", 2023, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Ford",
    models: [
      m("Bronco", 2021, 2026, "hard", "flares + hood", "mid"),
      m("Bronco Sport", 2021, 2026, "medium", "curved hood, simple bumper", "sedan"),
      m("Edge", 2017, 2024, "medium", "curved bumper", "mid"),
      m("Escape", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Expedition", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Explorer", 2017, 2026, "medium", "curved bumper", "mid"),
      m("F-150", 2017, 2026, "medium", "truck bumper", "truck"),
      m("F-250 / Super Duty", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Maverick", 2022, 2026, "easy", "2 pc", "sedan"),
      m("Mustang", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Mustang Mach-E", 2021, 2026, "medium", "curved bumper", "sedan"),
      m("Ranger", 2019, 2026, "medium", "truck bumper", "mid"),
    ],
  },
  {
    name: "Genesis",
    models: [
      m("G70", 2019, 2026, "medium", "curved bumper", "sedan"),
      m("G80", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("GV70", 2022, 2026, "medium", "curved bumper", "mid"),
      m("GV80", 2021, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "GMC",
    models: [
      m("Acadia", 2017, 2026, "easy", "2 pc", "mid"),
      m("Canyon", 2017, 2026, "medium", "truck bumper", "mid"),
      m("Sierra 1500", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Terrain", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Yukon", 2017, 2026, "medium", "truck bumper", "truck"),
    ],
  },
  {
    name: "Honda",
    models: [
      m("Accord", 2017, 2026, "easy", "2 pc, flat", "sedan"),
      m("Civic", 2017, 2026, "easy", "2 pc, flat", "sedan"),
      m("CR-V", 2017, 2026, "easy", "1–2 pc, flat", "sedan"),
      m("HR-V", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Odyssey", 2017, 2026, "easy", "2 pc", "mid"),
      m("Passport", 2019, 2026, "medium", "curved bumper", "mid"),
      m("Pilot", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Prologue", 2024, 2026, "medium", "curved bumper", "mid"),
      m("Ridgeline", 2017, 2026, "medium", "truck bumper", "mid"),
    ],
  },
  {
    name: "Hyundai",
    models: [
      m("Elantra", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Ioniq 5", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("Ioniq 6", 2023, 2026, "medium", "curved bumper", "sedan"),
      m("Kona", 2018, 2026, "easy", "2 pc", "sedan"),
      m("Palisade", 2020, 2026, "medium", "curved bumper", "mid"),
      m("Santa Cruz", 2022, 2026, "medium", "truck bumper", "mid"),
      m("Santa Fe", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Sonata", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Tucson", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Venue", 2020, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Infiniti",
    models: [
      m("Q50", 2017, 2024, "medium", "curved bumper", "sedan"),
      m("QX50", 2017, 2026, "easy", "2 pc", "sedan"),
      m("QX55", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("QX60", 2017, 2026, "medium", "curved bumper", "mid"),
      m("QX80", 2017, 2026, "medium", "curved bumper", "truck"),
    ],
  },
  {
    name: "Jaguar",
    models: [
      m("E-Pace", 2018, 2024, "easy", "2 pc", "sedan"),
      m("F-Pace", 2017, 2026, "medium", "curved bumper", "mid"),
      m("F-Type", 2017, 2024, "hard", "compound bumper", "sedan"),
      m("I-Pace", 2019, 2024, "medium", "curved bumper", "sedan"),
    ],
  },
  {
    name: "Jeep",
    models: [
      m("Cherokee", 2017, 2024, "easy", "2 pc", "sedan"),
      m("Compass", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Gladiator", 2020, 2026, "hard", "flares", "mid"),
      m("Grand Cherokee", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Grand Wagoneer", 2022, 2026, "medium", "curved bumper", "truck"),
      m("Renegade", 2017, 2024, "easy", "2 pc", "sedan"),
      m("Wagoneer", 2022, 2026, "medium", "curved bumper", "truck"),
      m("Wrangler", 2017, 2026, "hard", "flares + hood", "mid"),
    ],
  },
  {
    name: "Kia",
    models: [
      m("Carnival", 2022, 2026, "medium", "curved bumper", "mid"),
      m("EV6", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("EV9", 2024, 2026, "medium", "curved bumper", "mid"),
      m("Forte", 2017, 2026, "easy", "2 pc", "sedan"),
      m("K5", 2021, 2026, "easy", "2 pc", "sedan"),
      m("Niro", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Seltos", 2021, 2026, "easy", "2 pc", "sedan"),
      m("Sorento", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Soul", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Sportage", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Telluride", 2020, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "Land Rover",
    models: [
      m("Defender", 2020, 2026, "hard", "compound bumper + hood", "mid"),
      m("Discovery", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Discovery Sport", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Range Rover", 2017, 2026, "hard", "compound bumper", "truck"),
      m("Range Rover Evoque", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Range Rover Sport", 2017, 2026, "hard", "compound bumper", "mid"),
      m("Range Rover Velar", 2018, 2026, "medium", "curved bumper", "mid"),
    ],
  },
  {
    name: "Lexus",
    models: [
      m("ES", 2017, 2026, "easy", "2 pc", "sedan"),
      m("GX", 2017, 2026, "medium", "curved bumper", "mid"),
      m("IS", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("LX", 2017, 2026, "medium", "curved bumper", "truck"),
      m("NX", 2017, 2026, "easy", "2 pc", "sedan"),
      m("RX", 2017, 2026, "easy", "2 pc", "mid"),
      m("TX", 2024, 2026, "medium", "curved bumper", "mid"),
      m("UX", 2019, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Lincoln",
    models: [
      m("Aviator", 2020, 2026, "medium", "curved bumper", "mid"),
      m("Corsair", 2020, 2026, "easy", "2 pc", "sedan"),
      m("Nautilus", 2019, 2026, "medium", "curved bumper", "mid"),
      m("Navigator", 2017, 2026, "medium", "truck bumper", "truck"),
    ],
  },
  {
    name: "Mazda",
    models: [
      m("CX-30", 2020, 2026, "easy", "2 pc", "sedan"),
      m("CX-5", 2017, 2026, "easy", "2 pc", "sedan"),
      m("CX-50", 2023, 2026, "medium", "curved bumper", "sedan"),
      m("CX-70", 2025, 2026, "medium", "curved bumper", "mid"),
      m("CX-9", 2017, 2023, "medium", "curved bumper", "mid"),
      m("CX-90", 2024, 2026, "medium", "curved bumper", "mid"),
      m("Mazda3", 2017, 2026, "easy", "1–2 pc, flat", "sedan"),
      m("Mazda6", 2017, 2021, "easy", "2 pc", "sedan"),
      m("MX-5", 2017, 2026, "hard", "compound bumper", "sedan"),
    ],
  },
  {
    name: "Mercedes-Benz",
    models: [
      m("A-Class", 2019, 2026, "easy", "2 pc", "sedan"),
      m("C-Class", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("CLA", 2017, 2026, "easy", "2 pc", "sedan"),
      m("E-Class", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("EQE", 2023, 2026, "medium", "curved bumper", "sedan"),
      m("EQS", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("G-Class", 2017, 2026, "hard", "compound bumper + hood + fenders", "truck"),
      m("GLA", 2017, 2026, "easy", "2 pc", "sedan"),
      m("GLB", 2020, 2026, "easy", "2 pc", "sedan"),
      m("GLC", 2017, 2026, "medium", "curved bumper", "mid"),
      m("GLE", 2017, 2026, "medium", "curved bumper", "mid"),
      m("GLS", 2017, 2026, "medium", "curved bumper", "truck"),
      m("S-Class", 2017, 2026, "medium", "curved bumper", "sedan"),
    ],
  },
  {
    name: "MINI",
    models: [
      m("Clubman", 2017, 2024, "medium", "curved bumper", "sedan"),
      m("Cooper", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Countryman", 2017, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Mitsubishi",
    models: [
      m("Eclipse Cross", 2018, 2026, "easy", "2 pc", "sedan"),
      m("Outlander", 2017, 2026, "easy", "2 pc", "sedan"),
      m("RVR / Outlander Sport", 2017, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Nissan",
    models: [
      m("Altima", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Ariya", 2023, 2026, "easy", "2 pc", "sedan"),
      m("Armada", 2017, 2026, "medium", "curved bumper", "truck"),
      m("Frontier", 2017, 2026, "medium", "truck bumper", "mid"),
      m("Kicks", 2018, 2026, "easy", "2 pc", "sedan"),
      m("Leaf", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Murano", 2017, 2026, "easy", "2 pc", "mid"),
      m("Pathfinder", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Rogue", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Sentra", 2017, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Porsche",
    models: [
      m("718 Boxster / Cayman", 2017, 2026, "hard", "compound bumper", "sedan"),
      m("911", 2017, 2026, "hard", "compound nose", "sedan"),
      m("Cayenne", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Macan", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Panamera", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Taycan", 2020, 2026, "medium", "curved bumper", "sedan"),
    ],
  },
  {
    name: "RAM",
    models: [
      m("1500", 2017, 2026, "medium", "truck bumper", "truck"),
      m("2500 / 3500", 2017, 2026, "medium", "truck bumper", "truck"),
    ],
  },
  {
    name: "Subaru",
    models: [
      m("Ascent", 2019, 2026, "medium", "curved bumper", "mid"),
      m("BRZ", 2017, 2026, "medium", "curved bumper", "sedan"),
      m("Crosstrek", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Forester", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Impreza", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Legacy", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Outback", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Solterra", 2023, 2026, "easy", "2 pc", "sedan"),
      m("WRX", 2017, 2026, "medium", "curved bumper", "sedan"),
    ],
  },
  {
    name: "Tesla",
    models: [
      m("Cybertruck", 2024, 2026, "hard", "stainless / no film", "truck"),
      m("Model 3", 2018, 2026, "easy", "1–2 pc, flat", "sedan"),
      m("Model S", 2017, 2026, "easy", "1–2 pc", "sedan"),
      m("Model X", 2017, 2026, "easy", "1–2 pc", "mid"),
      m("Model Y", 2020, 2026, "easy", "1–2 pc, flat", "mid"),
    ],
  },
  {
    name: "Toyota",
    models: [
      m("4Runner", 2017, 2026, "medium", "curved bumper", "mid"),
      m("bZ4X", 2023, 2026, "easy", "2 pc", "sedan"),
      m("Camry", 2017, 2026, "easy", "2 pc, flat", "sedan"),
      m("Corolla", 2017, 2026, "easy", "2 pc, flat", "sedan"),
      m("Corolla Cross", 2022, 2026, "easy", "2 pc", "sedan"),
      m("Crown", 2023, 2026, "medium", "curved bumper", "sedan"),
      m("GR Corolla", 2023, 2026, "medium", "curved bumper", "sedan"),
      m("GR86", 2022, 2026, "medium", "curved bumper", "sedan"),
      m("Grand Highlander", 2024, 2026, "medium", "curved bumper", "mid"),
      m("Highlander", 2017, 2026, "medium", "curved bumper", "mid"),
      m("Land Cruiser", 2024, 2026, "medium", "curved bumper", "mid"),
      m("Prius", 2017, 2026, "easy", "2 pc", "sedan"),
      m("RAV4", 2017, 2026, "easy", "2 pc, flat", "sedan"),
      m("Sequoia", 2023, 2026, "medium", "truck bumper", "truck"),
      m("Sienna", 2017, 2026, "easy", "2 pc", "mid"),
      m("Supra", 2020, 2026, "hard", "compound bumper + hood", "sedan"),
      m("Tacoma", 2017, 2026, "medium", "truck bumper", "mid"),
      m("Tundra", 2017, 2026, "medium", "truck bumper", "truck"),
      m("Venza", 2021, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Volkswagen",
    models: [
      m("Atlas", 2018, 2026, "medium", "curved bumper", "mid"),
      m("Golf / GTI", 2017, 2026, "easy", "2 pc", "sedan"),
      m("ID.4", 2021, 2026, "easy", "2 pc", "sedan"),
      m("ID. Buzz", 2024, 2026, "medium", "van bumper", "mid"),
      m("Jetta", 2017, 2026, "easy", "2 pc", "sedan"),
      m("Multivan", 2022, 2026, "medium", "van bumper", "mid"),
      m("Taos", 2022, 2026, "easy", "2 pc", "sedan"),
      m("Tiguan", 2017, 2026, "easy", "2 pc", "sedan"),
    ],
  },
  {
    name: "Volvo",
    models: [
      m("C40", 2022, 2026, "easy", "2 pc", "sedan"),
      m("S60", 2017, 2026, "easy", "2 pc", "sedan"),
      m("V60", 2019, 2026, "easy", "2 pc", "sedan"),
      m("XC40", 2019, 2026, "easy", "2 pc", "sedan"),
      m("XC60", 2017, 2026, "medium", "curved bumper", "mid"),
      m("XC90", 2017, 2026, "medium", "curved bumper", "mid"),
    ],
  },
];

function artFrom(name: string, band: SizeBand): ArtSet {
  if (band === "truck") return "truck";
  const n = name.toLowerCase();
  if (
    /\bhatch|\bgolf\b|\bgti\b|\bmazda 3\b|\bimpreza\b|\bfit\b|\byaris\b|\bsoul\b|\brio\b|\bvenue\b|\bcivic hatch/.test(
      n,
    )
  ) {
    return "hatch";
  }
  if (band === "mid") return "suv";
  if (
    /cr-v|rav4|hr-v|rogue|escape|tucson|sportage|crosstrek|forester|outback|cx-|q3|q5|x1|x2|x3|rdx|mdx|kicks|trax|taos|corolla cross|bronco sport|compass|cherokee|equinox|terrain|blazer|atlas|tiguan|santa fe|pilot|passport|highlander|4runner|envision|xt4|xt5|nx|rx|xc40|macan|glc|gla|glb|edge|kona|seltos|venue/.test(
      n,
    )
  ) {
    return "suv";
  }
  return "sedan";
}

function glassFrom(name: string, art: ArtSet, band: SizeBand): { frontWindows: 2 | 4; rearWindows: number } {
  const n = name.toLowerCase();
  const fourFront =
    /g-class|g-wagen|wrangler|gladiator|defender|bronco(?! sport)|clubman|hummer|\bfj\b|cybertruck|model x|id\.?\s*buzz|multivan|transporter|land cruiser|\bgx\b|\blx\b|rivian|range rover(?! evoque| sport| velar)/.test(
      n,
    );
  if (/transit|sprinter|promaster|savana|express|id\.?\s*buzz|multivan|transporter/.test(n)) {
    return { frontWindows: 4, rearWindows: 6 };
  }
  if (/odyssey|sienna|carnival|pacifica/.test(n)) {
    return { frontWindows: 2, rearWindows: 5 };
  }
  if (/atlas/.test(n)) {
    return { frontWindows: 2, rearWindows: 6 };
  }
  if (art === "truck" || band === "truck") {
    if (/regular cab|single cab/.test(n)) return { frontWindows: fourFront ? 4 : 2, rearWindows: 1 };
    return { frontWindows: fourFront ? 4 : 2, rearWindows: fourFront ? 5 : 3 };
  }
  if (art === "suv" || band === "mid") {
    return { frontWindows: fourFront ? 4 : 2, rearWindows: 5 };
  }
  return { frontWindows: fourFront ? 4 : 2, rearWindows: 3 };
}

function m(
  name: string,
  from: number,
  to: number,
  rank: Rank,
  bumper: string,
  band: SizeBand,
): VehicleModel {
  const art = artFrom(name, band);
  const glass = glassFrom(name, art, band);
  return {
    name,
    from,
    to,
    rank,
    bumper,
    band,
    art,
    frontWindows: glass.frontWindows,
    rearWindows: glass.rearWindows,
  };
}

export function modelsFor(makeName: string, year: string): VehicleModel[] {
  const make = MAKES.find((x) => x.name === makeName);
  if (!make) return [];
  if (!year || year === OTHER) return make.models;
  const y = Number(year);
  if (!Number.isFinite(y)) return make.models;
  return make.models.filter((mod) => y >= mod.from && y <= mod.to);
}

export function lookupInstall(makeName: string, modelName: string) {
  if (!makeName || !modelName) {
    return { ...unknown, band: "mid" as SizeBand, art: "suv" as ArtSet };
  }
  if (makeName === OTHER || modelName === OTHER) {
    return unknown;
  }
  const mod = MAKES.find((x) => x.name === makeName)?.models.find((x) => x.name === modelName);
  if (!mod) return unknown;
  return {
    rank: mod.rank,
    label: mod.rank.toUpperCase(),
    bumper: mod.bumper,
    band: mod.band,
    art: mod.art,
    frontWindows: mod.frontWindows,
    rearWindows: mod.rearWindows,
    known: true,
  };
}
