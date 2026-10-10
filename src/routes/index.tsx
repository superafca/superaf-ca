import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";
import { SiteFooter } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => pageHead("/",
    "SUPERAF.CA — Best PPF in Calgary",
    "Paint protection. Glass protection. Tint. Best PPF in Calgary. 426 Memorial Drive NE.",
  ),
});

function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: site.name,
    url: "https://www.superaf.ca",
    email: site.email,
    telephone: "+1-587-900-9494",
    hasMap: site.maps,
    image: "https://www.superaf.ca/images/box-hero.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "426 Memorial Drive NE",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    openingHours: "Mo-Fr 09:00-18:00",
    areaServed: ["Calgary", "Airdrie", "Cochrane", "Okotoks", "Chestermere"],
    sameAs: [site.igHref, site.googleReview],
    description:
      "Paint protection. Glass protection. Tint. Best PPF in Calgary. 426 Memorial Drive NE.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <Landing />
      </main>
      <SiteFooter />
    </>
  );
}
