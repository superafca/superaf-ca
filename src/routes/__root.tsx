import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { launchBanner } from "@/lib/launch";
import { SEASON_OVERRIDE, isSeason } from "@/lib/season";
import appCss from "../styles.css?url";

const APP_NAME = "SUPERAF.CA";
const DESCRIPTION =
  "Paint protection. Glass protection. Tint. Best PPF in Calgary. 426 Memorial Drive NE.";

const bakedSeason =
  SEASON_OVERRIDE ??
  (typeof import.meta.env.VITE_SEASON === "string" && isSeason(import.meta.env.VITE_SEASON)
    ? import.meta.env.VITE_SEASON
    : "");

const themeBoot = `(function(){try{var root=document.documentElement;var stored=localStorage.getItem("superaf-theme");var theme=stored==="day"||stored==="night"?stored:(matchMedia("(prefers-color-scheme: dark)").matches?"night":"day");root.setAttribute("data-theme",theme);root.style.colorScheme=theme==="night"?"dark":"light";var meta=document.createElement("meta");meta.setAttribute("name","theme-color-active");meta.setAttribute("content",theme==="night"?"#0A0A0C":"#FFFFFF");document.head.appendChild(meta);var q=new URLSearchParams(location.search).get("season");var names=["fall","christmas","winter","spring","summer"];var baked=${JSON.stringify(bakedSeason)};var season=names.indexOf(q)>=0?q:(names.indexOf(baked)>=0?baked:"");if(!season){var parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Edmonton",month:"2-digit",day:"2-digit"}).formatToParts(new Date());var m=+parts.find(function(p){return p.type==="month";}).value;var d=+parts.find(function(p){return p.type==="day";}).value;var md=m*100+d;season=md>=922&&md<=1130?"fall":(md>=1201||md<=106)?"christmas":md>=107&&md<=319?"winter":md>=320&&md<=620?"spring":"summer";}root.setAttribute("data-season",season);var until=${JSON.stringify(launchBanner.showUntil)};var enabled=${launchBanner.enabled ? "true" : "false"};var day=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Edmonton",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());if(!enabled||localStorage.getItem("superaf-launch-dismissed")==="1"||day>until)root.setAttribute("data-launch","off");}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} — Best PPF in Calgary` },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#FFFFFF" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#0A0A0C" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.superaf.ca/" },
      { property: "og:title", content: `${APP_NAME} — Best PPF in Calgary` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:image", content: "https://www.superaf.ca/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${APP_NAME} — Best PPF in Calgary` },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "https://www.superaf.ca/og.jpg" },
      {
        name: "keywords",
        content:
          "paint protection Calgary, glass protection Calgary, tint Calgary, best PPF Calgary, PPF Calgary, paint protection film Calgary, HARD PP, HARD PP 10, HARD PPF, windshield protection film Calgary, 5 year PPF, 10 year PPF, full front PPF, full body PPF, clear bra Calgary, rock chip protection, self healing PPF, hydrophobic PPF, window tint Calgary, ceramic tint Calgary, carbon tint, PPF shop Calgary, Memorial Drive NE",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Orbitron:wght@500;700;800&family=Outfit:wght@400;500;600&family=Press+Start+2P&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
    scripts: [
      { async: true, src: "https://www.googletagmanager.com/gtag/js?id=AW-18489064646" },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-18489064646');`,
      },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <HeadContent />
      </head>
      <body className="font-sans">
        <SeasonLayer />
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});

function SeasonLayer() {
  return (
    <div className="season-layer" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <svg key={i} className={`season-leaf leaf-${i}`} viewBox="0 0 16 16">
          <path d="M8 1.2 9.1 5.2 13.2 4.4 10.2 7.2 14 9.1 9.4 9.2 10.3 14 8 10.4 5.7 14 6.6 9.2 2 9.1 5.8 7.2 2.8 4.4 6.9 5.2Z" />
        </svg>
      ))}
      <div className="season-snow" />
      <div className="season-snow is-back" />
    </div>
  );
}