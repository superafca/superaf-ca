import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function ContactStrip() {
  return (
    <section id="contact" className="text-center">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3">
        <article className="rounded-xl bg-elevated p-5 shadow-border">
          <p className="text-xs uppercase tracking-kicker text-muted">Call / text</p>
          <a href={site.phoneHref} className="mt-2 block font-display text-4xl text-accent">
            {site.phone}
          </a>
          <p className="mt-2 text-sm text-muted">Text or call. WhatsApp works too.</p>
        </article>
        <article className="rounded-xl bg-elevated p-5 shadow-border">
          <p className="text-xs uppercase tracking-kicker text-muted">Email</p>
          <a href={site.emailHref} className="mt-2 block font-display text-4xl">
            {site.email}
          </a>
          <p className="mt-2 text-sm text-muted">Quotes, bookings, and business inquiries.</p>
        </article>
        <article className="overflow-hidden rounded-xl bg-elevated shadow-border">
          <iframe
            title="426 Memorial Drive NE on Google Maps"
            src={site.mapsEmbed}
            className="aspect-video w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            href={site.maps}
            target="_blank"
            rel="noreferrer"
            className="block p-4 text-center"
          >
            <p className="text-xs uppercase tracking-kicker text-muted">Stage</p>
            <p className="font-display text-2xl">{site.address}</p>
            <p className="mt-1 text-sm text-muted">{site.addressNote}</p>
            <p className="mt-2 text-xs font-bold text-fg">Open in Google Maps</p>
          </a>
        </article>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="text-center">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pt-8 text-sm font-bold uppercase tracking-kicker sm:px-6">
        <Link to="/vision" className="text-fg hover:text-lvl3">
          The Vision
        </Link>
        <Link to="/ppf" className="text-fg hover:text-lvl3">
          HARD PP (PPF)
        </Link>
        <Link to="/windshield" className="text-fg hover:text-lvl3">
          Windshield Protection Film
        </Link>
        <Link to="/tint" className="text-fg hover:text-lvl3">
          Window Tint
        </Link>
      </nav>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div className="rounded-xl bg-elevated p-5 shadow-border">
          <p className="font-display text-3xl">
            SUPERAF<span className="text-accent">.CA</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Check out what we’re doing on Instagram.
          </p>
          <p className="mt-3 text-sm">
            <a className="underline decoration-accent/60" href={site.igHref}>
              Instagram @{site.ig}
            </a>
          </p>
        </div>
        <div className="rounded-xl bg-elevated p-5 text-sm shadow-border">
          <p>{site.address}</p>
          <p className="text-muted">{site.hours}</p>
          <p className="text-muted">{site.hoursNote}</p>
        </div>
        <div className="rounded-xl bg-elevated p-5 text-sm shadow-border">
          <p>
            <a className="underline decoration-accent/60" href={site.phoneHref}>
              Call / text {site.phone}
            </a>
          </p>
          <p>
            <a className="underline decoration-accent/60" href={site.emailHref}>
              {site.email}
            </a>
          </p>
          <p className="mt-3">
            <Button asChild size="sm">
              <a href="/#quote">Level up</a>
            </Button>
          </p>
        </div>
      </div>
      <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 pb-8 text-xs font-bold uppercase tracking-kicker text-muted">
        <Link to="/terms" className="hover:text-fg">
          Terms
        </Link>
        <Link to="/privacy" className="hover:text-fg">
          Privacy
        </Link>
      </p>
    </footer>
  );
}
