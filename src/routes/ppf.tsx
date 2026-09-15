import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/ppf")({
  component: () => <PanelPage id="ppf" />,
  head: () => ({
    meta: [
      { title: "HARD PP© paint protection film — SUPERAF.CA" },
      {
        name: "description",
        content:
          "HARD PP© hydrophobic paint protection film in Calgary. HARD PP© 5 for the wallet. HARD PP© 10 for the beauty. Trademarked film, wrapped edges, honest warranty.",
      },
    ],
  }),
});
