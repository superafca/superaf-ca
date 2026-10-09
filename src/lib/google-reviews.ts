export type GoogleReview = {
  name: string;
  stars: number;
  text: string;
  date: string;
};

export type GoogleReviewFile = {
  asOf: string | null;
  rating: number | null;
  count: number | null;
  profileUrl: string;
  reviews: GoogleReview[];
};

const FILE_KEYS = ["asOf", "rating", "count", "profileUrl", "reviews"] as const;
const REVIEW_KEYS = ["name", "stars", "text", "date"] as const;

export function validateReviewFile(data: unknown): { ok: true; file: GoogleReviewFile } | { ok: false; reason: string } {
  if (!data || typeof data !== "object" || Array.isArray(data)) return { ok: false, reason: "not an object" };
  const obj = data as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!(FILE_KEYS as readonly string[]).includes(key)) return { ok: false, reason: `invented field ${key}` };
  }
  if (!Array.isArray(obj.reviews)) return { ok: false, reason: "reviews" };
  const reviews: GoogleReview[] = [];
  for (const review of obj.reviews) {
    if (!review || typeof review !== "object" || Array.isArray(review)) return { ok: false, reason: "review" };
    const row = review as Record<string, unknown>;
    for (const key of Object.keys(row)) {
      if (!(REVIEW_KEYS as readonly string[]).includes(key)) return { ok: false, reason: `invented field ${key}` };
    }
    if (typeof row.text !== "string" || !row.text.trim()) return { ok: false, reason: "missing text" };
    if (typeof row.stars !== "number" || !Number.isInteger(row.stars) || row.stars < 1 || row.stars > 5) {
      return { ok: false, reason: "stars" };
    }
    if (typeof row.name !== "string" || !row.name.trim()) return { ok: false, reason: "name" };
    if (typeof row.date !== "string" || !row.date.trim()) return { ok: false, reason: "date" };
    reviews.push({ name: row.name, stars: row.stars, text: row.text, date: row.date });
  }
  return {
    ok: true,
    file: {
      asOf: typeof obj.asOf === "string" || obj.asOf === null ? (obj.asOf as string | null) : null,
      rating: typeof obj.rating === "number" ? obj.rating : null,
      count: typeof obj.count === "number" ? obj.count : null,
      profileUrl: typeof obj.profileUrl === "string" ? obj.profileUrl : "",
      reviews,
    },
  };
}

/** Fewer than 3 reviews stays a static card. Never invent the rest. */
export function reviewPresentation(count: number): "card" | "strip" {
  return count < 3 ? "card" : "strip";
}
