import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteFooter } from "@/components/sections";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export function PageShell({
  kicker,
  title,
  lede,
  wide,
  children,
}: {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="store-page">
        <header className="store-article-head">
          {kicker ? <p className="store-kicker">{kicker}</p> : null}
          <h1>{title}</h1>
          {lede ? <p className="store-lede">{lede}</p> : null}
        </header>
        <div className={cn("store-article", wide && "store-article-wide")}>
          {children}
          <div className="store-article-cta">
            <h2>Build your estimate.</h2>
            <p className="store-lede">Pick the car. Tick extras. The number rolls.</p>
            <p className="store-links">
              <Link to="/estimate" className="store-link">
                Estimate
              </Link>
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function Block({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="store-block">
      <h2>{title}</h2>
      <div className="store-block-body">{children}</div>
    </section>
  );
}
