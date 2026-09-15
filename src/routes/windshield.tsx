import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/windshield")({
  component: () => <PanelPage id="windshield" />,
  head: () => ({
    meta: [
      { title: "Windshield protection film — SUPERAF.CA" },
      {
        name: "description",
        content:
          "Windshield protection film in Calgary. Stops winter rocks from eating a windshield. Not a perfection product. Peel it in spring if the wear bothers you.",
      },
    ],
  }),
});
