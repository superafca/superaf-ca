import { createServerFn } from "@tanstack/react-start";

export const loadLiveReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchLiveReviews } = await import("./google-places.server.ts");
  return fetchLiveReviews();
});
