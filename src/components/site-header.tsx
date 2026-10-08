import { Link } from "@tanstack/react-router";
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
  return (
    <>
      <LaunchBanner />
      <header className="store-nav">
        <nav>
          <Link to="/" className="store-mark">
            <Leaf />
            SUPERAF.CA
          </Link>
          <div className="store-nav-links">
            {items.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.label}
              </Link>
            ))}
            <a href={site.phoneHref}>Call</a>
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

