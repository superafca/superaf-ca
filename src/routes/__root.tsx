import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "SUPERAF.CA";
const DESCRIPTION =
  "Paint protection. Glass protection. Tint. Best PPF in Calgary. 426 Memorial Drive NE.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} — Best PPF in Calgary` },
      { name: "description", content: DESCRIPTION },
      { name: "theme-color", content: "#ffffff" },
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
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg font-sans">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
