export const launchBanner = {
  enabled: true,
  showUntil: "2026-12-31",
  offer: null as null | { text: string; href: string },
};

/** Inclusive through showUntil, compared as a calendar day in America/Edmonton. */
export function launchVisible(now = new Date(), dismissed = false) {
  if (!launchBanner.enabled || dismissed) return false;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parts <= launchBanner.showUntil;
}
