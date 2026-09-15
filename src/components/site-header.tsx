import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROMO_ENDS, promoActive, site } from "@/lib/site";
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    if (sessionStorage.getItem("superaf-promo") !== "off") setOpen(true);
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!promoActive(now ?? Date.now()) || !open) return null;

  const left = splitMs(Date.parse(PROMO_ENDS) - (now ?? Date.parse(PROMO_ENDS)));

  function close() {
    sessionStorage.setItem("superaf-promo", "off");
    setOpen(false);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="promo-rainbow pointer-events-auto relative w-full max-w-lg overflow-hidden rounded-2xl px-5 py-4 text-center shadow-border">
        <button
          type="button"
          onClick={close}
          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/15 text-lg font-bold leading-none text-fg"
          aria-label="Close promo"
        >
          ×
        </button>
        <p className="pr-8 text-sm font-bold uppercase tracking-kicker">
          Winter promo sale
        </p>
        <p className="mt-1 text-xs font-bold uppercase tracking-kicker">
          Limited booking available FCFS · Ends Jan 1 2027
        </p>
        <p className={cn("mt-2 font-display text-3xl tabular-nums", now == null && "opacity-0")}>
          {now == null
            ? "000d 00:00:00"
            : `${left.d}d ${pad(left.h)}:${pad(left.m)}:${pad(left.s)}`}
        </p>
      </div>
    </div>
  );
}

const linkClass =
  "whitespace-nowrap font-bold uppercase tracking-kicker text-lvl3 hover:text-cloud";

const navPanels: {
  view: "vision" | "ppf" | "windshield" | "tint";
  href: "/vision" | "/ppf" | "/windshield" | "/tint";
  label: string;
}[] = [
  { view: "vision", href: "/vision", label: "The Vision" },
  { view: "ppf", href: "/ppf", label: "HARD PP (PPF)" },
  { view: "windshield", href: "/windshield", label: "Windshield Protection Film" },
  { view: "tint", href: "/tint", label: "Window Tint" },
];

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-black">
        <div className="border-b border-white/10">
          <nav className="mx-auto flex h-12 max-w-7xl items-center gap-x-4 overflow-x-auto px-4 text-sm sm:px-6">
            {navPanels.map((item) => (
              <span key={item.view} className="contents">
                <Link to={item.href} className={cn(linkClass, "md:hidden")}>
                  {item.label}
                </Link>
                <Link
                  to="/"
                  search={{ view: item.view }}
                  className={cn(linkClass, "hidden md:inline")}
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <a href={site.phoneHref} className={cn(linkClass, "ml-auto")}>
              Call / text
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-bold uppercase tracking-kicker text-[#25D366] hover:text-cloud"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </header>
      <PromoClock />
    </>
  );
}

export function HardMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      HARD PP
      <sup className="ml-0.5 text-[0.45em] font-sans font-bold leading-none">©</sup>
    </span>
  );
}

export function FilmName({ years }: { years: 5 | 10 }) {
  return (
    <span>
      <HardMark />
      {` ${years}`}
    </span>
  );
}
