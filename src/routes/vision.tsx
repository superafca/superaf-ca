import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/vision")({
  component: () => <PanelPage id="vision" />,
  head: () => pageHead("/vision",
    "Process and Values — SUPERAF.CA",
    "Process and values at SUPERAF.CA. Quality, speed, cost. High-quality volume paint protection in Calgary. Not showroom exotics. 426 Memorial Drive NE.",
  ),
});
