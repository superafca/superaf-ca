import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";
import { SiteFooter } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

const SITE_URL = "https://www.superaf.ca";
const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
});

function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: site.name,
        alternateName: site.short,
        publisher: { "@id": BUSINESS_ID },
      },
      {
        "@type": "AutomotiveBusiness",
        "@id": BUSINESS_ID,
        name: site.name,
        alternateName: site.short,
        url: SITE_URL,
        email: site.email,
        telephone: "+1-587-900-9494",
        hasMap: site.maps,
        image: `${SITE_URL}/images/box-hero.jpg`,
        logo: `${SITE_URL}/apple-touch-icon.png`,
        address: {
          "@type": "PostalAddress",
          streetAddress: "426 Memorial Drive NE",
          addressLocality: "Calgary",
          addressRegion: "AB",
          postalCode: "T2E 4Y7",
          addressCountry: "CA",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        areaServed: ["Calgary", "Airdrie", "Cochrane", "Okotoks", "Chestermere"],
        sameAs: [site.igHref, "https://g.page/r/CQNKQDNeuW2REAI"],
        description:
          "Paint protection. Glass protection. Tint. Best PPF in Calgary. 426 Memorial Drive NE.",
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Paint Protection Film (PPF)",
              serviceType: "Automotive paint protection film installation",
              url: `${SITE_URL}/ppf`,
              areaServed: "Calgary, Alberta",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Automotive Window Tint",
              serviceType: "Automotive window tint installation",
              url: `${SITE_URL}/tint`,
              areaServed: "Calgary, Alberta",
            },
          },
        ],
      },
    ],
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
