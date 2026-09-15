import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bubble } from "@/components/bubble";
import { Block, PageShell } from "@/components/page-shell";
import { HardMark } from "@/components/site-header";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const panelIds = ["vision", "ppf", "windshield", "tint"] as const;
export type PanelId = (typeof panelIds)[number];

export const panels: {
  id: PanelId;
  label: string;
  bg: string;
  title: ReactNode;
  lede?: ReactNode;
  wide?: boolean;
}[] = [
  {
    id: "vision",
    label: "The Vision",
    bg: "bg-[#06101f]/70",
    title: "Vision.",
  },
  {
    id: "ppf",
    label: "HARD PP (PPF)",
    bg: "bg-[#06101f]/70",
    title: <HardMark />,
    lede: (
      <>
        The only Officially Licensed <HardMark /> pusher in Calgary.
      </>
    ),
    wide: true,
  },
  {
    id: "windshield",
    label: "Windshield Protection Film",
    bg: "bg-[#06101f]/70",
    title: "Windshield protection film.",
  },
  {
    id: "tint",
    label: "Window Tint",
    bg: "bg-[#06101f]/70",
    title: "Window tint.",
    wide: true,
  },
];

export function isPanelId(v: unknown): v is PanelId {
  return panelIds.includes(v as PanelId);
}

function VisionBody() {
  return (
    <div className="rounded-xl bg-elevated p-5 text-left text-sm text-muted shadow-border">
      <p>
        You’re not buying a sticker. You’re putting hours into a local shop that
        wants Calgary cars to last, look honest, and hold value.
      </p>
      <p className="mt-3">
        {site.carsFilmed} vehicles. Bay at {site.address}. HARD PP© is ours.
      </p>
      <p className="mt-3">
        Ten years of putting film on cars people actually drive. Not a museum.
        Not exotic babysitting. New cars. Daily cars. The ones that eat
        Deerfoot.
      </p>
      <p className="mt-3">
        Durability. Appearance. Value. That’s the whole job: the car stays
        cleaner, the paint stays under a layer, and it still looks like money
        when you sell it.
      </p>
      <p className="mt-3">
        A world-class local shop. A fun place to work. All the services under
        one roof so you’re not bouncing across town.
      </p>
      <p className="mt-3">
        Local labour. Local film. Local cars. Vibes, hard work, no robots. It’s
        time for you to be SUPER A.F.
      </p>
    </div>
  );
}

function PpfBody() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvl1">
            For the wallet
          </p>
          <h2 className="mt-1 text-center font-display text-5xl">
            <HardMark /> 5
          </h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-kicker">
            Economy · 7.5 mil · 5-year film
          </p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              I want savings. All the desirable features at an economy price.
              Self-healing. Hydrophobic. 7.5 mil. It still takes the hit so the
              paint doesn’t.
            </p>
            <p>
              We curated this one for the price-and-protection crowd. You want
              the high-impact panels covered. You want to stop thinking about
              chips. You do not want to pay for a show finish.
            </p>
            <p>
              If appearance and that last bit of quality sit lower on your list,
              pick this. It is the honest throwaway layer. Replace it when it
              has done its job.
            </p>
          </div>
        </article>
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvlmax">
            For the beauty
          </p>
          <h2 className="mt-1 text-center font-display text-5xl">
            <HardMark /> 10
          </h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-kicker">
            Suggested · 8+ mil · 10-year film
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p>I want it all.</p>
            <p>Faster self-heal.</p>
            <p>Deeper, richer, wetter gloss.</p>
            <p>Smoother texture.</p>
            <p>Softer touch.</p>
            <p>Stronger hydrophobics.</p>
            <p>Crystal clarity.</p>
            <p>Thicker, smoother finish.</p>
            <p>Double the warranty.</p>
            <p>
              If you like to stare. If you like when other people stare. If that
              new-car luxury feeling is the whole point — this is the one.
            </p>
            <p>This is what we want on the car.</p>
          </div>
          <details className="mt-5 border-t border-border pt-3 text-[11px] leading-relaxed text-subtle">
            <summary className="cursor-pointer list-none font-bold uppercase tracking-kicker text-muted hover:text-fg">
              Psst. <HardMark /> 10 Thick →
            </summary>
            <p className="mt-2">
              Slick. Thick. <HardMark /> 10 Thick does it all — same film, more
              mil, more attitude. 10 mil for the flat, high-wear stuff: lower
              doors, dog legs, rockers, the panels that eat gravel for breakfast.
            </p>
            <p className="mt-2">
              We can even stack it over 8 mil in those zones. Complex curves?
              Thick film gets dramatic. Extra labour, extra waste, and we will
              not fake a finish we would not put our name on. Ask. We will tell
              you if the car is too shapely for the thick stuff.
            </p>
            <p className="mt-2">Not on the quote. On purpose. Whisper it to us.</p>
          </details>
        </article>
      </div>
      <Block title="Our process">
        <p>
          Before we start, inspect your vehicle. Tell us any concerns. Funky
          paint. An old coating. Rock chips in the clear. Know your car before
          you bring it in.
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Inspect. Note concerns. Talk them through with you.</li>
          <li>
            Wash like we mean it — pressure rinse, snow foam, scrub, clay,
            degrease — as the car needs.
          </li>
          <li>Inspect again. Note again. Talk again.</li>
          <li>Apply film.</li>
          <li>
            If the car is with us for a stretch, we shoot progress — photo or
            video — so you are not guessing.
          </li>
          <li>
            Issues and curveballs get discussed as we go. Expectations stay lined
            up with the actual car, not the brochure.
          </li>
          <li>Final inspection. We photograph and video.</li>
          <li>We contact you. You drive it home.</li>
        </ol>
      </Block>
      <Block title="No BS warranty">
        <p>
          <HardMark /> manufacturer warranty covers yellowing, staining,
          cracking, blistering, and delamination / peeling from manufacturing
          failures — not wear from the weather.
        </p>
        <p className="font-bold text-fg">Most common non-warranty issues</p>
        <p>
          We’ve been in the game a long time. Here’s what to avoid — none of this
          is covered.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Pressure washers — especially in winter. Number one. The fastest way
            to lift an edge.
          </li>
          <li>
            Stones, trees, garage doors, concrete pillars, road debris. Number
            two. That is the job of the film — and what uses it up. Not
            permanent. Replace it when it has taken the hit.
          </li>
          <li>Brush car washes. They chew the top coat.</li>
          <li>
            Alcohol, acid, the “just this once” bottle. Can yellow or haze a
            film. Rare. Has happened.
          </li>
        </ul>
        <p>
          Honourable mention: the sun. Not typically an issue in Calgary. Still —
          directed sunlight in blistering heat for long stretches is rough on
          the whole car, not just the film. Years of solar damage fade paint,
          cook plastics, and quietly age everything it can see. Park smart when
          you can.
        </p>
        <p>
          Skip that list and this stuff can last decades. Aftercare below is the
          real warranty.
        </p>
      </Block>
      <Block title="Aftercare">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Wait 48 hours before the first wash.</li>
          <li>Hand wash or touchless. pH-neutral soap.</li>
          <li>Keep the pressure washer off the edges. Winter especially.</li>
          <li>Bugs and bird droppings off the same day.</li>
          <li>Light swirls relax with warmth — sun or warm water.</li>
          <li>A PPF seal twice a year keeps the gloss honest.</li>
        </ol>
      </Block>
    </>
  );
}

function GlassBody() {
  return (
    <div className="rounded-xl bg-elevated p-5 text-left text-sm text-muted shadow-border">
      <p>
        Cheap sacrificial layer for winter rocks. Not a perfection product.
        Fast, affordable, replace it when it’s ugly.
      </p>
      <p className="mt-4 font-bold text-fg">What to expect</p>
      <ul className="mt-2 list-disc space-y-2 pl-5">
        <li>Stops a lot of chips. A new windshield is expensive.</li>
        <li>Can add a bit of distortion to your line of sight.</li>
        <li>Bubbly and warped right after install. Water dries. It settles.</li>
        <li>Shows wear like wiper scratches. Lasts about 1–3 years.</li>
        <li>Quick application. Peel it in spring. Re-apply next winter if needed.</li>
      </ul>
    </div>
  );
}

function TintBody() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvl1">
            Carbon
          </p>
          <h2 className="mt-1 text-center font-display text-5xl">The look</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Carbon film. Cost effective. Shade that doesn’t fade.</li>
            <li>99% UV.</li>
            <li>Solid heat rejection. No signal issues.</li>
          </ul>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-kicker text-fg">
            Shades
          </p>
          <p className="mt-1 text-center text-sm font-bold text-muted">
            5 · 18 · 25 · 35 · 45 · 70
          </p>
        </article>
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvlmax">
            Ceramic
          </p>
          <h2 className="mt-1 text-center font-display text-5xl">The cool</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Nano-ceramic. Enhanced solar rejection for skin protection.</li>
            <li>99%+ UV.</li>
            <li>Up to 94% infrared rejection. Stronger glare cut.</li>
            <li>No signal issues.</li>
          </ul>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-kicker text-fg">
            Shades
          </p>
          <p className="mt-1 text-center text-sm font-bold text-muted">
            5 · 15 · 20 · 35 · 50 · 70
          </p>
        </article>
      </div>
      <Block title="What to expect">
        <p>
          Manufacturer limited lifetime on both. Colour shift, peeling, bubbling,
          cracking, adhesive failure, delamination from the film. Not scratches.
          Not a smashed window.
        </p>
        <p>
          Install is 2–4 hours. Tiny water bubbles are normal. They leave as it
          cures — a few days in the heat, longer in a Calgary winter. Don’t roll
          the windows down for 3–5 days. Don’t pressure-wash the edges. Don’t
          slam the doors like you’re mad at them.
        </p>
        <p>
          Alberta: no aftermarket film on the windshield or the front side
          windows. Rear sides and the back glass — any shade, if you’ve got
          outside mirrors. An eyebrow can sit above the AS-1 line. Medical
          exemption is a government thing, not a shop thing. Check your local
          guidelines.
        </p>
      </Block>
    </>
  );
}

const bodies: Record<PanelId, () => ReactNode> = {
  vision: VisionBody,
  ppf: PpfBody,
  windshield: GlassBody,
  tint: TintBody,
};

export function PanelPage({ id }: { id: PanelId }) {
  const panel = panels.find((p) => p.id === id) ?? panels[0];
  const Body = bodies[panel.id];
  return (
    <PageShell wide={panel.wide} title={panel.title} lede={panel.lede}>
      {Body()}
    </PageShell>
  );
}

export function InfoOverlay({ view }: { view: PanelId }) {
  const navigate = useNavigate();
  const panel = panels.find((p) => p.id === view) ?? panels[0];
  const Body = bodies[panel.id];

  function close() {
    void navigate({ to: "/", search: { view: undefined } });
  }

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [view]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 overflow-y-auto pt-28 pb-16",
        panel.bg,
      )}
      role="dialog"
      aria-label={typeof panel.title === "string" ? panel.title : panel.label}
    >
      <div
        className={cn(
          "mx-auto space-y-8 px-4 text-center sm:px-6",
          panel.wide ? "max-w-5xl" : "max-w-3xl",
        )}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-cloud px-4 py-2 text-xs font-bold uppercase tracking-kicker text-fg shadow-border"
          >
            Close
          </button>
        </div>
        <h2>
          <Bubble className="rounded-2xl px-6 py-3 font-display text-6xl sm:text-8xl">
            {panel.title}
          </Bubble>
        </h2>
        {panel.lede ? (
          <p>
            <Bubble className="text-pretty">{panel.lede}</Bubble>
          </p>
        ) : null}
        <div className="space-y-8">{Body()}</div>
      </div>
    </div>
  );
}
