import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LaunchBanner } from "@/components/launch-banner";
import { ThemeToggle } from "@/components/theme-toggle";

const HARD = [
  ["H", "Hydrophobic"],
  ["A", "Anti-Yellowing"],
  ["R", "Repairing"],
  ["D", "Durable"],
] as const;

export function HardBadges() {
  return (
    <div className="hard-row">
      {HARD.map(([letter, name]) => (
        <div key={letter} className="hard-badge">
          <span>{letter}</span>
          <em>{name}</em>
        </div>
      ))}
    </div>
  );
}

export function CyberFrame({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="cyber-world">
      <LaunchBanner />
      <header className="cyber-bar">
        <Link to="/" className="cyber-mark">
          SUPERAF.CA
        </Link>
        <nav>
          <Link to="/estimate">Estimate</Link>
          <Link to="/diy">DIY</Link>
          <Link to="/dealers">Dealers</Link>
          <ThemeToggle />
        </nav>
      </header>
      <div className="cyber-wrap">
        <p className="cyber-kicker">{kicker}</p>
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}
