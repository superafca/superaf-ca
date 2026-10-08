type LiveReviews = {
  rating: number | null;
  count: number | null;
  mapsUrl: string | null;
  reviews: Array<{
    name: string;
    photo: string | null;
    profile: string | null;
    stars: number;
    text: string;
    when: string;
    mapsUrl: string | null;
  }>;
};

let cache: { at: number; data: LiveReviews } | null = null;
let logged = false;

function logOnce(error: unknown) {
  if (logged) return;
  logged = true;
  console.error("google places reviews fallback", error);
}

export async function fetchLiveReviews() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (!key || !place) return { ok: false as const };
  if (cache && Date.now() - cache.at < 60 * 60 * 1000) return { ok: true as const, data: cache.data };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3000);
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(place)}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(String(res.status));
    const body = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
        authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
        googleMapsUri?: string;
      }>;
    };
    const data: LiveReviews = {
      rating: typeof body.rating === "number" ? body.rating : null,
      count: typeof body.userRatingCount === "number" ? body.userRatingCount : null,
      mapsUrl: body.googleMapsUri ?? null,
      reviews: (body.reviews ?? [])
        .filter((review) => review.text?.text && review.authorAttribution?.displayName)
        .map((review) => ({
          name: review.authorAttribution?.displayName ?? "",
          photo: review.authorAttribution?.photoUri ?? null,
          profile: review.authorAttribution?.uri ?? null,
          stars: review.rating ?? 0,
          text: review.text?.text ?? "",
          when: review.relativePublishTimeDescription ?? "",
          mapsUrl: review.googleMapsUri ?? body.googleMapsUri ?? null,
        })),
    };
    cache = { at: Date.now(), data };
    return { ok: true as const, data };
  } catch (error) {
    logOnce(error);
    return { ok: false as const };
  } finally {
    clearTimeout(timer);
  }
}
