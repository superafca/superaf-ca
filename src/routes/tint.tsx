import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/tint")({
  component: () => <PanelPage id="tint" />,
  head: () => ({
    meta: [
      { title: "Window tint — SUPERAF.CA" },
      {
        name: "description",
        content:
          "Window tint in Calgary. Carbon or ceramic. Shades from 5 to 70. Limited lifetime. 2–4 hour install. Check Alberta guidelines.",
      },
    ],
  }),
});
