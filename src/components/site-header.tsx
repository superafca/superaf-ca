import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMO_ENDS, nav, promoActive, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function splitMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function PromoClock() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!promoActive(now ?? Date.now())) return null;

  const left = splitMs(Date.parse(PROMO_ENDS) - (now ?? Date.parse(PROMO_ENDS)));

  return (
    <div className="border-b border-border bg-surface text-center">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-2 text-xs uppercase tracking-kicker">
        <span className="text-accent">20% off</span>
        <span className="text-muted">Limited · until 2027</span>
        <span
          className={cn(
            "font-display text-lg leading-none tracking-wide text-sky",
            now == null && "opacity-0",
          )}
        >
          {`${left.d}d ${pad(left.h)}:${pad(left.m)}:${pad(left.s)}`}
        </span>
      </p>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-sm">
      <PromoClock />
      <div className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <a href="#quote" className="font-display text-2xl tracking-wide text-fg">
            SUPERAF
            <span className="text-accent">.CA</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm text-muted transition-colors duration-150 hover:text-fg"
              >
                {n.label}
              </a>
            ))}
            <Button asChild size="sm">
              <a href={site.phoneHref}>Call / text</a>
            </Button>
          </nav>
          <div className="flex items-center gap-1 md:hidden">
            <Button asChild size="sm">
              <a href={site.phoneHref}>Call / text</a>
            </Button>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "border-b border-border bg-bg px-4 py-4 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm text-fg hover:bg-surface"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
