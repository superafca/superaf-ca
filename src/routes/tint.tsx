import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/tint")({
  component: () => <PanelPage id="tint" />,
  head: () => pageHead("/tint",
    "Tint Calgary — Carbon & Ceramic | SUPERAF.CA",
    "Tint in Calgary. Carbon and ceramic. Heat rejection, UV, glare. Limited lifetime. 2–4 hour install.",
  ),
});
