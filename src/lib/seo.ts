/** One head definition for SSR and client navigation; never use a preview host. */
export function pageHead(path: `/${string}`, title: string, description: string) {
  const url = `https://www.superaf.ca${path}`;
  const image = "https://www.superaf.ca/og.jpg";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      // The PWA injector preserves this route-owned head instead of replacing it.
      { name: "superaf:metadata", content: "route" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
