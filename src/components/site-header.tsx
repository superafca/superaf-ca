import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { LaunchBanner } from "@/components/launch-banner";
import { ThemeToggle } from "@/components/theme-toggle";

const items: { href: "/" | "/ppf" | "/windshield" | "/tint" | "/vision" | "/estimate" | "/diy" | "/dealers"; label: string }[] = [
  { href: "/ppf", label: "Paint Protection" },
  { href: "/windshield", label: "Glass Protection" },
  { href: "/tint", label: "Tint" },
  { href: "/vision", label: "Process" },
  { href: "/diy", label: "DIY" },
  { href: "/dealers", label: "Dealers" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuBtn.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <LaunchBanner />
      <header className="store-nav">
        <nav>
          <Link to="/" className="store-mark" onClick={() => setOpen(false)}>
            <Leaf />
            SUPERAF.CA
          </Link>
          <a className="phone-pill is-compact" href={site.phoneHref}>
            <Phone size={16} aria-hidden />
            <span>{site.phone}</span>
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="nav-menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <div id="site-menu" className={open ? "store-nav-links is-open" : "store-nav-links"}>
            {items.map((item) => (
              <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/estimate" className="nav-estimate" onClick={() => setOpen(false)}>
              Estimate
            </Link>
          </div>
          <ThemeToggle />
          <Link to="/estimate" className="store-buy">
            Estimate
          </Link>
        </nav>
        <span className="xmas-bulbs" aria-hidden />
      </header>
    </>
  );
}

function Leaf() {
  return (
    <svg className="mark-leaf" viewBox="0 0 16 16" aria-hidden>
      <path d="M8 1.2 9.1 5.2 13.2 4.4 10.2 7.2 14 9.1 9.4 9.2 10.3 14 8 10.4 5.7 14 6.6 9.2 2 9.1 5.8 7.2 2.8 4.4 6.9 5.2Z" />
    </svg>
  );
}

export function HardMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      HARD PP
      <sup className="ml-0.5 text-[0.45em] font-sans font-semibold leading-none">®</sup>
    </span>
  );
}

export function FilmName({ years }: { years: 5 | 10 }) {
  return (
    <span>
      <HardMark />
      {` ${years}YR`}
    </span>
  );
}

