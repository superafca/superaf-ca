import { Link } from "@tanstack/react-router";
import { site } from "@/lib/site";

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
    <header className="store-nav">
      <nav>
        <Link to="/" className="store-mark">
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
        <Link to="/estimate" className="store-buy">
          Estimate
        </Link>
      </nav>
    </header>
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

