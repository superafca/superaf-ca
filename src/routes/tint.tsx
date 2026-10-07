import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/tint")({
  component: () => <PanelPage id="tint" />,
  head: () => ({
    meta: [
      { title: "Tint Calgary — Carbon & Ceramic | SUPERAF.CA" },
      {
        name: "description",
        content:
          "Tint in Calgary. Carbon and ceramic. Heat rejection, UV, glare. Limited lifetime. 2–4 hour install.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.superaf.ca/tint" }],
  }),
});
