import { type ReactNode } from "react";
import { Block, PageShell } from "@/components/page-shell";
import { FilmName, HardMark } from "@/components/site-header";
import { site, glasses as siteGlasses, filmCompare, tintCompare } from "@/lib/site";

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
    label: "Process and Values",
    bg: "bg-[#06101f]/70",
    title: "Process and Values.",
    lede: "Quality, speed, and honest pricing — we refused to pick two.",
  },
  {
    id: "ppf",
    label: "Paint Protection",
    bg: "bg-[#06101f]/70",
    title: "Paint Protection.",
    lede: (
      <>
        <HardMark /> 5YR and 10YR
      </>
    ),
    wide: true,
  },
  {
    id: "windshield",
    label: "Glass Protection",
    bg: "bg-[#06101f]/70",
    title: "Glass Protection.",
    lede: "Windshield film in Calgary. Clear or tinted. $269. 5 mil. Self-healing.",
  },
  {
    id: "tint",
    label: "Tint",
    bg: "bg-[#06101f]/70",
    title: "Tint.",
    lede: "Carbon tint and ceramic tint. Heat, UV, glare. Watch the glass go dark.",
    wide: true,
  },
];

export function isPanelId(v: unknown): v is PanelId {
  return panelIds.includes(v as PanelId);
}

function VisionBody() {
  return (
    <>
      <Block title="The process">
        <p>
          Know the car before it rolls in. Funky paint. An old coating. Rock chips
          already in the clear. Tell us. We price the car in front of us, not the
          brochure.
        </p>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <span className="font-semibold text-fg">Drop-off.</span> We walk it
            together. Complimentary exterior wash if it needs one — not a
            comprehensive detail unless most of the vehicle is getting film.
            Prices assume you bring it in a reasonable state so we can actually
            see the paint.
          </li>
          <li>
            <span className="font-semibold text-fg">Inspect.</span> Note concerns.
            Talk them through with you before a knife hits the liner.
          </li>
          <li>
            <span className="font-semibold text-fg">Wash like we mean it</span> —
            pressure rinse, snow foam, scrub, clay, degrease — as the car needs.
            We will not polish, denib, or touch up paint unless you ask.
          </li>
          <li>
            <span className="font-semibold text-fg">Inspect again.</span> Note
            again. Talk again. The second look is cheaper than a surprise on
            pickup.
          </li>
          <li>
            <span className="font-semibold text-fg">Apply film.</span> Edges
            wrapped and tucked. HARD PP 5YR or 10YR. Clear, matte, satin on MAX — or colour on 10YR for +$500.
          </li>
          <li>
            <span className="font-semibold text-fg">Progress.</span> If the car is
            with us for a stretch, we shoot photo or video so you are not
            guessing.
          </li>
          <li>
            <span className="font-semibold text-fg">Curveballs.</span> Issues get
            discussed as we go. Expectations stay lined up with the actual car.
          </li>
          <li>
            <span className="font-semibold text-fg">Final inspect.</span> We
            photograph and video. We contact you. You drive it home.
          </li>
        </ol>
        <p>
          Unclear what quality you will get? Ask. Or look at recent work on{" "}
          <a className="underline decoration-fg/30" href={site.igHref}>
            Instagram @{site.ig}
          </a>
          . Winter rush is protection volume. Slow season can be fussier. We
          change priorities with the goal.
        </p>
      </Block>
      <Block title="Values">
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <span className="font-semibold text-fg">The car is the spec.</span> We
            inspect it with you. No brochure promises.
          </li>
          <li>
            <span className="font-semibold text-fg">Film is supposed to get hit.</span>{" "}
            That’s the job. Replace it when it’s done.
          </li>
          <li>
            <span className="font-semibold text-fg">Daily drivers first.</span>{" "}
            Deerfoot gravel. Winter. Not concours exotics this season.
          </li>
          <li>
            <span className="font-semibold text-fg">Wrapped and tucked anyway.</span>{" "}
            Fast is not sloppy edges.
          </li>
          <li>
            <span className="font-semibold text-fg">Say what we will not do.</span>{" "}
            Polish, denib, paint touch-up — only if you ask. We would rather
            skip a step than fake a finish.
          </li>
          <li>
            <span className="font-semibold text-fg">All three.</span> Quality, speed, and honest pricing — we refused to pick two.
          </li>
          <li>
            <span className="font-semibold text-fg">The number before the bay.</span>{" "}
            Estimate pending approval. No ambush on pickup.
          </li>
          <li>
            <span className="font-semibold text-fg">Talk like a shop.</span> Text,
            call, WhatsApp. 426 Memorial Drive NE. {site.plusCode}.
          </li>
          <li>
            <span className="font-semibold text-fg">Haters welcome.</span> Write
            the review. Funny ones get read out loud in the bay.
          </li>
          <li>
            <span className="font-semibold text-fg">The box is the product.</span>{" "}
            HARD PP. Actual film. Not a jewelry crate.
          </li>
        </ol>
      </Block>
      <Block title="Leave a review. Haters welcome.">
        <p>
          This website premiered {site.sitePremiere}. Google Business went live{" "}
          {site.googlePremiere}.
        </p>
        <p>
          If you liked how we do business, leave a review. If you hated it, even
          better — write it like you mean it. Make it something people screenshot.
        </p>
        <p className="pt-2 text-center">
          <a
            className="inline-flex h-12 items-center justify-center rounded-full bg-fg px-6 text-sm font-bold uppercase tracking-kicker text-cloud"
            href={site.googleReview}
            target="_blank"
            rel="noopener noreferrer"
          >
            Review us on Google
          </a>
        </p>
        <p className="text-center text-xs text-subtle">{site.plusCode}</p>
      </Block>
    </>
  );
}

function FeatureCompare({
  left,
  right,
  rows,
}: {
  left: string;
  right: string;
  rows: { feature: string; left: string; right: string; leftOn: boolean; rightOn: boolean }[];
}) {
  return (
    <div className="feature-compare">
      <table>
        <thead>
          <tr>
            <th />
            <th>{left}</th>
            <th>{right}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature}>
              <th scope="row">{row.feature}</th>
              <td className={row.leftOn ? undefined : "is-miss"}>{row.leftOn ? row.left : "×"}</td>
              <td className={row.rightOn ? undefined : "is-miss"}>{row.rightOn ? row.right : "×"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PpfBody() {
  return (
    <>
      <section className="ppf-confidence">
        <h2>We don't buy film. We make it.</h2>
        <p>
          HARD PP® is ours — we manufacture it, we install it, we warranty it. No middleman, no markup telephone game, no finger-pointing if something goes wrong. 500+ vehicles protected in 2026, through our dealer network and our Calgary bay.
        </p>
        <p>
          <a href={site.googleReview} target="_blank" rel="noopener noreferrer">
            Read our Google reviews
          </a>
        </p>
      </section>
      <FeatureCompare
        left="5YR"
        right="10YR"
        rows={filmCompare.map((row) => ({
          feature: row.feature,
          left: row.cost,
          right: row.quality,
          leftOn: row.costOn,
          rightOn: row.qualityOn,
        }))}
      />
      <p className="text-center text-sm text-muted">Same install. The film is the difference. × is not on that film.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvl1">For the wallet</p>
          <h2 className="mt-1 text-center font-display text-5xl">
            <FilmName years={5} />
          </h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-kicker">Economy · 7.5 mil · 5 year PPF</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>I want savings. 5 year paint protection film. Self-healing. Hydrophobic. 7.5 mil. Rock chip protection at an economy price. It still takes the hit so the paint doesn’t.</p>
            <p>We curated this one for the price-and-protection crowd. You want the high-impact panels covered. You want to stop thinking about chips. You do not want to pay for a show finish.</p>
            <p>If appearance and that last bit of quality sit lower on your list, pick this. It is the honest throwaway layer. Replace it when it has done its job.</p>
          </div>
        </article>
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvlmax">For the beauty</p>
          <h2 className="mt-1 text-center font-display text-5xl">
            <FilmName years={10} />
          </h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-kicker">Suggested · 8+ mil · 10 year PPF</p>
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
            <p>If you like to stare. If you like when other people stare. If that new-car luxury feeling is the whole point — this is the one.</p>
            <p>This is what we want on the car.</p>
          </div>
          <details className="mt-5 border-t border-border pt-3 text-[11px] leading-relaxed text-subtle">
            <summary className="cursor-pointer list-none font-bold tracking-kicker text-muted hover:text-fg">
              PSST. HARD PP® 10YR Thick →
            </summary>
            <p className="mt-2">
              Slick. Thick. <HardMark /> 10YR Thick does it all — same film, more mil, more attitude. 10 mil for the flat, high-wear stuff: lower doors, dog legs, rockers, the panels that eat gravel for breakfast.
            </p>
            <p className="mt-2">
              We can even stack it over 8 mil in those zones. Complex curves? Thick film gets dramatic. Extra labour, extra waste, and we will not fake a finish we would not put our name on. Ask. We will tell you if the car is too shapely for the thick stuff.
            </p>
            <p className="mt-2">Not on the quote. On purpose. Whisper it to us.</p>
          </details>
        </article>
      </div>
      <Block title="PPF process">
        <p>Before we start, inspect your vehicle. Tell us any concerns. Funky paint. An old coating. Rock chips in the clear. Know your car before you bring it in.</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Inspect. Note concerns. Talk them through with you.</li>
          <li>Wash like we mean it — pressure rinse, snow foam, scrub, clay, degrease — as the car needs.</li>
          <li>Inspect again. Note again. Talk again.</li>
          <li>Apply film.</li>
          <li>If the car is with us for a stretch, we shoot progress — photo or video — so you are not guessing.</li>
          <li>Issues and curveballs get discussed as we go. Expectations stay lined up with the actual car, not the brochure.</li>
          <li>Final inspection. We photograph and video.</li>
          <li>We contact you. You drive it home.</li>
        </ol>
      </Block>
      <Block title="PPF warranty">
        <p>The HARD PP® manufacturer warranty covers yellowing, staining, cracking, blistering, and delamination or peeling from manufacturing failures — not wear from the weather.</p>
        <p className="font-bold text-fg">Most common non-warranty issues</p>
        <p>We’ve been in the game a long time. Here’s what to avoid — none of this is covered.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Pressure washers — especially in winter. Number one. The fastest way to lift an edge.</li>
          <li>Stones, trees, garage doors, concrete pillars, road debris. Number two. That is the job of the film — and what uses it up. Not permanent. Replace it when it has taken the hit.</li>
          <li>Brush car washes. They chew the top coat.</li>
          <li>Alcohol, acid, the “just this once” bottle. Can yellow or haze a film. Rare. Has happened.</li>
        </ul>
        <p>Honourable mention: the sun. Not typically an issue in Calgary. Still — directed sunlight in blistering heat for long stretches is rough on the whole car, not just the film. Years of solar damage fade paint, cook plastics, and quietly age everything it can see. Park smart when you can.</p>
        <p>Skip that list and this stuff can last decades. Aftercare below is the real warranty.</p>
      </Block>
      <Block title="PPF aftercare">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Wait 48 hours before the first wash.</li>
          <li>Hand wash or touchless. pH-neutral soap.</li>
          <li>Keep the pressure washer off the edges. Winter especially.</li>
          <li>Bugs and bird droppings off the same day.</li>
          <li>Light swirls relax with warmth — sun or warm water.</li>
          <li>A PPF seal twice a year keeps the gloss honest.</li>
        </ol>
      </Block>
      <Block title="FAQ">
        <p>A lot of people ignore every care requirement and never have an issue — the film is durable. But if something ever goes wrong, it'll be the day everything goes wrong: a fender bender, a dog attacks your bumper, your boss is on your nerves. This care is for you, and your peace of purchase.</p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-fg">Can I just do a partial hood to save money?</h3>
            <p>You could — but we won't offer it. You wouldn't protect half your phone screen, so don't protect half your hood. The film stops, the wear doesn't: the exposed half fades and chips while the covered half doesn't, and you're left with a visible line across the panel and two different hoods. It looks awful and it's a waste of everyone's time. Everyone else will half-ass it for you — if you insist, it's request-only. We'd rather do it right.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">How much does it cost?</h3>
            <p>FRONT starts at $849. FRONT+ from $948. Your exact number takes about 60 seconds in the estimator — pick the car, tick the extras, the number rolls. Final price gets confirmed at drop-off.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">How long does it take?</h3>
            <p>FRONT is 6 hours — drop it off in the morning, drive it home. FRONT+ runs 6+ hours depending on the extras. MAX is the whole car, so that's 1–2 weeks.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">What causes yellowing?</h3>
            <p>All film degrades over time — sunlight, debris, chemicals. Yellowing is UV and contamination baking into the film. HARD PP is formulated anti-yellowing, and the warranty covers yellowing when it's the film's fault. But no film outruns neglect — that's maintenance, not warranty. Been neglecting it? See the care requirements above.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">How does self-healing work?</h3>
            <p>The top coat is heat-activated: light swirls and wash marks flow back out with sun or warm water. That's the R in HARD PP — Repairing. The honest trade-off: that layer is softer by design, so it's easier to melt and absorbs chemical damage more readily. Treat it right and it keeps healing for years.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">What causes paint damage on removal?</h3>
            <p>Not the film — the paint underneath it. Fully cured factory paint: the film comes off clean, that's the design. Damage happens when the paint work is the problem — fresh paint that hasn't finished curing, or a cheap respray. If your paint history is questionable, tell us before we start and we'll tell you straight.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">Front only, or the whole car?</h3>
            <p>Calgary gravel eats front ends for breakfast. FRONT covers the hood, fenders, bumper, and mirrors — the kill zone. But MAX isn't just for people who stare at their car. It's for anyone who doesn't want to bump or scrape something and end up repainting. It's easier to clean, and the self-healing keeps a polished finish — within a month without film you'll see scratches, watch the shine fade, and feel that new-car awe fade with it. We've priced MAX aggressively for the everyday vehicle, because we want every car in this city touched by it — to change the fingerprint on the road from chipped, rusted, scratched, and dull to shining, glossy, beautiful. We want you to get the MAX. We understand if you have to settle for the FRONT.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">How long does it last?</h3>
            <p>The warranty period is how long we've had this formula tested in normal conditions — real solar hours — before significant degradation shows. Out in the world it comes down to exposure: sun, debris, chemicals. Treat it properly and it'll run well past the warranty.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">When should I replace the film?</h3>
            <p>Before the warranty ends if it's showing road wear — and definitely once you're past it. You don't want old film degrading onto the vehicle. Come in before it breaks down and removal costs less. Come back to us for the replacement and removal is complimentary. The film costs what it costs — we're not dropping the price.</p>
          </div>
          <div>
            <h3 className="font-semibold text-fg">Can I run it through the car wash?</h3>
            <p>Contactless: yes, go ahead. Contact drive-throughs with brushes: not for the first 3 months — especially on film installed September through May. The adhesive needs time to settle into the clear, and cold weather slows it down. Here's how it usually goes wrong: the car sits all winter caked in road grime, you finally snap and want it blasted clean, and the pressure washer takes film with it. Pressure washer damage is not covered by warranty. Hand wash or stick to contactless through the first winter. (Stored in a warm heated space for those 3 months? Then none of this applies.)</p>
          </div>
        </div>
      </Block>
    </>
  );
}

function GlassBody() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {siteGlasses.map((g) => (
          <article key={g.id} className="overflow-hidden rounded-xl bg-elevated text-left shadow-border">
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-kicker text-muted">{g.kicker}</p>
              <h2 className="mt-1 font-display text-4xl">{g.name}</h2>
              <p className="mt-1 font-display text-5xl">${g.list}</p>
              <p className="mt-2 text-sm text-muted">{g.blurb}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="rounded-xl bg-elevated p-5 text-left text-sm text-muted shadow-border">
        <p>Glass protection. Sacrificial windshield film for winter rocks. Not a perfection product. Fast, affordable. Replace it when it’s ugly.</p>
        <p className="mt-4 font-bold text-fg">Clear · Tinted $269</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>5 mil thick. Self-healing. Scratch resistant.</li>
          <li>Clear: maximum visibility.</li>
          <li>Tinted: 70% or 35% VLT.</li>
          <li>Durability about 1–3 years.</li>
        </ul>
        <p className="mt-4 font-bold text-fg">What to expect</p>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Stops a lot of chips. A new windshield is expensive.</li>
          <li>Can add a bit of distortion to your line of sight.</li>
          <li>Bubbly and warped right after install. Water dries. It settles.</li>
          <li>Shows wear like wiper scratches. Lasts about 1–3 years.</li>
          <li>Quick application. Peel it in spring. Re-apply next winter if needed.</li>
        </ul>
      </div>
    </>
  );
}

function TintBody() {
  return (
    <>
      <FeatureCompare
        left="Carbon"
        right="Ceramic"
        rows={tintCompare.map((row) => ({
          feature: row.feature,
          left: row.carbon,
          right: row.ceramic,
          leftOn: row.carbonOn,
          rightOn: row.ceramicOn,
        }))}
      />
      <p className="text-center text-sm text-muted">Lined up on purpose. × is what carbon does not do. Front windows are about 2 hours. Rear windows are about 4.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvl1">Carbon</p>
          <h2 className="mt-1 text-center font-display text-5xl">The look</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Carbon window tint. Cost effective. Shade that doesn’t fade.</li>
            <li>99% UV.</li>
            <li>Solid heat rejection. No signal issues.</li>
          </ul>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-kicker text-fg">Shades</p>
          <p className="mt-1 text-center text-sm font-bold text-muted">5 · 18 · 25 · 36</p>
        </article>
        <article className="rounded-xl bg-elevated p-5 text-left shadow-border">
          <p className="text-center text-xs font-bold uppercase tracking-kicker text-lvlmax">Ceramic</p>
          <h2 className="mt-1 text-center font-display text-5xl">The cool</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Ceramic window tint. Nano-ceramic. Enhanced solar rejection for skin protection.</li>
            <li>99%+ UV.</li>
            <li>Up to 94% infrared rejection. Stronger glare cut.</li>
            <li>No signal issues.</li>
          </ul>
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-kicker text-fg">Shades</p>
          <p className="mt-1 text-center text-sm font-bold text-muted">5 · 14 · 21 · 32 · 45 · 65</p>
        </article>
      </div>
      <Block title="What to expect">
        <p>Tint: manufacturer limited lifetime on both. Colour shift, peeling, bubbling, cracking, adhesive failure, delamination from the film. Not scratches. Not a smashed window.</p>
        <p>Front windows take about 2 hours. Rear windows take about 4. Tiny water bubbles are normal. They leave as it cures — a few days in the heat, longer in a Calgary winter. Don’t roll the windows down for 3–5 days. Don’t pressure-wash the edges. Don’t slam the doors like you’re mad at them.</p>
        <p>Alberta: no aftermarket film on the windshield or the front side windows. Rear sides and the back glass — any shade, if you’ve got outside mirrors. An eyebrow can sit above the AS-1 line. Medical exemption is a government thing, not a shop thing. Check your local guidelines.</p>
      </Block>
    </>
  );
}

const bodies = {
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
      <Body />
    </PageShell>
  );
}
