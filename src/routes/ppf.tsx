import { createFileRoute } from "@tanstack/react-router";
import { PanelPage } from "@/components/info-panels";

export const Route = createFileRoute("/ppf")({
  component: () => <PanelPage id="ppf" />,
  head: () => ({
    meta: [
      { title: "Paint Protection — PPF Calgary | SUPERAF.CA" },
      {
        name: "description",
        content:
          "Paint protection in Calgary. HARD PP 5 year and 10 year PPF. Self-healing, hydrophobic, rock chip protection. Full front, custom, full body. 426 Memorial Drive NE.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.superaf.ca/ppf" }],
  }),
});
