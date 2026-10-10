import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { CyberFrame, HardBadges } from "@/components/cyber";
import { site } from "@/lib/site";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/diy")({
  component: DiyPage,
  head: () => pageHead("/diy",
    "DIY HARD PP kits — pre-cut, you install | SUPERAF.CA",
    "Pre-cut HARD PP kits you install yourself. FRONT from $399. Plotter-cut, packed in a HARD PP tube. Free shipping over $600.",
  ),
});

const FAQ = [
  ["Does the warranty cover DIY kits?", "The HARD PP warranty covers the film itself — manufacturing defects, yellowing, the works. It doesn't cover the install. That's on you."],
  ["What if there's no kit for my vehicle?", "Email us. If we can pattern it, we can cut it."],
  ["Can you help me install it?", "We'll point you at guides and technique videos. But the install is on you — if you want it done right, that's what the bay is for."],
] as const;

const KITS = [
  ["FRONT", "Hood, fenders, bumper, mirrors.", "5YR $399 · 10YR $549"],
  ["FRONT+", "FRONT kit plus the panels you pick.", "5YR $399 · 10YR $549"],
  ["MAX", "Full vehicle.", "5YR $1,299 · 10YR $1,799"],
] as const;

function DiyPage() {
  return (
    <CyberFrame kicker="You install" title="DIY kits">
      <section className="diy-hero">
        <p>Pre-cut HARD PP. Plotter-cut. Packed in our tube. The install is on you.</p>
        <p className="diy-offer">FRONT from {money(399)} · 10YR {money(549)} · MAX from {money(1299)}</p>
        <HardBadges />
      </section>
      <div className="cyber-kits diy-kits">
        {KITS.map(([name, included, price]) => (
          <article key={name} className="cyber-kit">
            <h2>{name}</h2>
            <p>{included}</p>
            <p className="cyber-kit-from">{price}</p>
          </article>
        ))}
      </div>
      <p className="diy-soon">Coming soon</p>
      <a className="diy-contact" href={site.phoneHref}>
        Contact for more information
      </a>
      <section className="diy-faq">
        <h2>FAQ</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </CyberFrame>
  );
}
