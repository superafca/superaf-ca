import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bubble } from "@/components/bubble";
import { Button } from "@/components/ui/button";
import { ContactStrip, SiteFooter } from "@/components/sections";
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
      <main>
        <header className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16">
          {kicker ? (
            <p>
              <Bubble className="text-xs font-bold uppercase tracking-kicker">{kicker}</Bubble>
            </p>
          ) : null}
          <h1 className={kicker ? "mt-3" : undefined}>
            <Bubble className="rounded-2xl px-6 py-3 font-display text-6xl sm:text-8xl">
              {title}
            </Bubble>
          </h1>
          {lede ? (
            <p className="mt-4">
              <Bubble className="text-pretty">{lede}</Bubble>
            </p>
          ) : null}
        </header>
        <div
          className={cn(
            "mx-auto space-y-10 px-4 pb-16 text-center text-pretty sm:px-6",
            wide ? "max-w-5xl" : "max-w-3xl",
          )}
        >
          {children}
          <div className="rounded-xl bg-elevated p-5 shadow-border">
            <p className="font-display text-3xl">Ready.</p>
            <p className="mt-1 text-sm text-muted">Quote is on the first screen. No extra clicks.</p>
            <Button asChild className="mt-4 font-display text-xl tracking-wide">
              <Link to="/" search={{ view: undefined }}>
                Level up
              </Link>
            </Button>
          </div>
        </div>
        <ContactStrip />
      </main>
      <SiteFooter />
    </>
  );
}

export function Block({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-elevated p-5 text-left shadow-border">
      <h2 className="text-center font-display text-4xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-muted">{children}</div>
    </section>
  );
}
