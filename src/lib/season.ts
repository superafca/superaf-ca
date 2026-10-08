export type Season = "fall" | "christmas" | "winter" | "spring" | "summer";

/** Owner switch. null = follow VITE_SEASON, then the Edmonton date. */
export const SEASON_OVERRIDE: Season | null = null;

const SEASONS: readonly Season[] = ["fall", "christmas", "winter", "spring", "summer"];

export function isSeason(value: string): value is Season {
  return (SEASONS as readonly string[]).includes(value);
}

/** Calendar day in America/Edmonton. */
export function edmontonParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const pick = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

/** Inclusive ranges, resolved in America/Edmonton. Christmas wraps the new year. */
export function seasonFor(date: Date): Season {
  const { month, day } = edmontonParts(date);
  const md = month * 100 + day;
  if (md >= 922 && md <= 1130) return "fall";
  if (md >= 1201 || md <= 106) return "christmas";
  if (md >= 107 && md <= 319) return "winter";
  if (md >= 320 && md <= 620) return "spring";
  return "summer";
}

function readEnvSeason(): string | undefined {
  try {
    const env = (import.meta as { env?: { VITE_SEASON?: string } }).env;
    return env?.VITE_SEASON;
  } catch {
    return undefined;
  }
}

export function resolveSeason(input: { override?: Season | null; env?: string | null; now?: Date }): Season {
  if (input.override) return input.override;
  if (input.env && isSeason(input.env)) return input.env;
  return seasonFor(input.now ?? new Date());
}

export function activeSeason(now = new Date()): Season {
  return resolveSeason({ override: SEASON_OVERRIDE, env: readEnvSeason(), now });
}

export const seasonCopy: Record<Season, { ribbon: string }> = {
  fall: { ribbon: "Gravel season is here. Protect the front before winter roads." },
  christmas: { ribbon: "Season's greetings from 426 Memorial Drive NE." },
  winter: { ribbon: "Paint protection. HARD PP 10 is here." },
  spring: { ribbon: "Paint protection. HARD PP 10 is here." },
  summer: { ribbon: "Paint protection. HARD PP 10 is here." },
};

export function seasonFromSearch(search: string): Season | null {
  const value = new URLSearchParams(search).get("season");
  return value && isSeason(value) ? value : null;
}
