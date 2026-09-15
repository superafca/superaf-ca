import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { InfoOverlay, isPanelId, type PanelId } from "@/components/info-panels";
import { Quote } from "@/components/quote";
import { ContactStrip, SiteFooter } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { view?: PanelId } => ({
    view: isPanelId(search.view) ? search.view : undefined,
  }),
  component: Home,
});

const panelPath = {
  vision: "/vision",
  ppf: "/ppf",
  windshield: "/windshield",
  tint: "/tint",
} as const;

function Home() {
  const { view } = Route.useSearch();
  const navigate = useNavigate();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!view) return;
    if (window.matchMedia("(max-width: 767px)").matches) {
      void navigate({ to: panelPath[view] });
    }
  }, [view, navigate]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    url: "https://superaf.ca",
    email: site.email,
    telephone: site.phone,
    image: "/images/lvl2.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "426 Memorial Drive NE",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: "Calgary",
    sameAs: [site.igHref, site.googleSearch],
    description:
      "Paint protection film in Calgary. HARD PP© hydrophobic PPF, window tint, windshield film. Starting prices.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <Quote />
        <ContactStrip />
      </main>
      <SiteFooter />
      {view && desktop ? <InfoOverlay view={view} /> : null}
    </>
  );
}
