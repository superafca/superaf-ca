import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/windshield")({
  component: () => <PanelPage id="windshield" />,
  head: () => ({
    meta: [
      { title: "Glass Protection — Windshield Film Calgary | SUPERAF.CA" },
      {
        name: "description",
        content:
          "Glass protection in Calgary. Clear or tinted windshield film. 5 mil. Self-healing. Scratch resistant. $269.",
      },
    ],
  }),
});
