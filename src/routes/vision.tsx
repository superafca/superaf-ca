import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/vision")({
  component: () => <PanelPage id="vision" />,
  head: () => ({
    meta: [
      { title: "Vision — SUPERAF.CA" },
      {
        name: "description",
        content:
          "SUPERAF.CA. Durability, appearance, and value for Calgary cars. A fun local shop. Hard work.",
      },
    ],
  }),
});
