import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "@/components/quote";
import {
  Faq,
  Film,
  Packages,
  Shop,
  SiteFooter,
  Tint,
  Warranty,
} from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: site.name,
    url: "https://superaf.ca",
    email: site.email,
    telephone: site.phone,
    image: "/images/pkg-front.jpg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "426 Memorial Drive NE",
      addressLocality: "Calgary",
      addressRegion: "AB",
      addressCountry: "CA",
    },
    openingHours: "Mo-Fr 10:00-17:00",
    areaServed: "Calgary",
    description:
      "Paint protection film in Calgary. HARD PP hydrophobic PPF, window tint, windshield film. CHIP FRONT TRIM ALL. Starting prices.",
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
        <Packages />
        <Film />
        <Warranty />
        <Tint />
        <Shop />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
