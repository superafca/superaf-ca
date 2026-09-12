import { Button } from "@/components/ui/button";
import {
  aftercare,
  faqs,
  films,
  fiveYearPrice,
  packages,
  promoActive,
  shopItems,
  site,
  tenYearPrice,
  tints,
  warrantyCovered,
  warrantyNotCovered,
  windshield,
} from "@/lib/site";
import { money } from "@/lib/utils";

export function Packages() {
  const winter = promoActive();
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-kicker text-sky">
        Coverage
      </p>
      <h2 className="mt-2 font-display text-5xl sm:text-6xl">Four covers.</h2>
      <p className="mt-3 max-w-xl text-muted">
        Glow is the film. Edges wrapped and tucked on every panel we film.
        {winter ? " 20% until 2027. Limited." : ""}
      </p>
      <div className="mt-10 space-y-8">
        {packages.map((p) => {
          const from = tenYearPrice(p.id, "sedan");
          const list = p.listSedan;
          return (
            <article
              key={p.id}
              className="overflow-hidden rounded-xl bg-elevated shadow-border"
            >
              <img
                src={p.image}
                alt={`${p.name} coverage`}
                className="aspect-[16/9] w-full object-cover"
              />
              <div className="grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
                <div>
                  {p.featured ? (
                    <p className="text-xs uppercase tracking-kicker text-accent">
                      the usual
                    </p>
                  ) : null}
                  <h3 className="font-display text-5xl sm:text-6xl">{p.name}</h3>
                  <ul className="mt-3 grid gap-1 text-sm text-muted sm:grid-cols-2">
                    {p.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="sm:text-right">
                  {winter ? (
                    <p className="text-xs text-muted">
                      <span className="line-through">{money(list)}</span> · 20%
                    </p>
                  ) : null}
                  <p className="font-display text-4xl text-accent">from {money(from)}</p>
                  <p className="text-xs text-muted">{p.days} · HARD PP 10</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Film() {
  return (
    <section id="film" className="bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-kicker text-sky">
            The material
          </p>
          <h2 className="mt-2 font-display text-5xl sm:text-7xl">HARD PP</h2>
          <p className="mt-4 max-w-md text-muted">
            Hydrophobic paint protection. TPU body, self-healing top coat on both
            films. Water beads. Light swirls relax with heat.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {films.map((f) => (
              <li key={f.id} className="rounded-lg bg-elevated p-3 shadow-border">
                <p className="font-display text-2xl leading-none">{f.name}</p>
                <p className="mt-1 text-sm text-muted">{f.note}</p>
                <p className="mt-2 text-xs text-subtle">
                  CHIP from{" "}
                  {money(
                    f.id === "pp5"
                      ? fiveYearPrice("chip", "sedan")
                      : tenYearPrice("chip", "sedan"),
                  )}
                </p>
              </li>
            ))}
            <li className="rounded-lg bg-elevated p-3 shadow-border">
              <p className="font-display text-2xl leading-none">Finish</p>
              <p className="mt-1 text-sm text-muted">Clear, matte, satin, colour</p>
            </li>
            <li className="rounded-lg bg-elevated p-3 shadow-border">
              <p className="font-display text-2xl leading-none">Edges</p>
              <p className="mt-1 text-sm text-muted">
                Wrapped and tucked. No raw cuts sitting on a panel.
              </p>
            </li>
          </ul>
        </div>
        <img
          src="/images/hard-pp.jpg"
          alt="HARD PP film box in the bay"
          className="aspect-[3/4] w-full rounded-xl object-cover object-center"
        />
      </div>
    </section>
  );
}

export function Warranty() {
  return (
    <section id="warranty" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-kicker text-sky">
        Film warranty
      </p>
      <h2 className="mt-2 font-display text-5xl sm:text-6xl">What holds.</h2>
      <p className="mt-3 max-w-xl text-muted">
        Original owner. From the install date. HARD PP 5 is five years. HARD PP 10
        is ten. Windshield film is one year, yellowing and delamination only.
        Carbon and ceramic tint: limited lifetime.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-elevated p-5 shadow-border">
          <h3 className="font-display text-3xl">Covered</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {warrantyCovered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-elevated p-5 shadow-border">
          <h3 className="font-display text-3xl">Not covered</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {warrantyNotCovered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className="mt-10 font-display text-3xl">Aftercare</h3>
      <ol className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
        {aftercare.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </section>
  );
}

export function Tint() {
  return (
    <section id="tint" className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <p className="text-xs font-medium uppercase tracking-kicker text-sky">
          Add-ons
        </p>
        <h2 className="mt-2 font-display text-5xl">Tint and windshield.</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">Tick them on the quote.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {tints.map((t) => (
            <article key={t.id} className="rounded-xl bg-elevated p-5 shadow-border">
              <h3 className="font-display text-3xl">{t.name}</h3>
              <p className="mt-1 text-sm text-accent">
                from {money(t.sedan)} sedan · {money(t.suv)} SUV
              </p>
              <p className="mt-2 text-sm text-muted">{t.blurb}</p>
            </article>
          ))}
          <article className="rounded-xl bg-elevated p-5 shadow-border">
            <h3 className="font-display text-3xl">{windshield.name}</h3>
            <p className="mt-1 text-sm text-accent">
              {money(windshield.sedan)}
            </p>
            <p className="mt-2 text-sm text-muted">{windshield.blurb}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Shop() {
  return (
    <section id="shop" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-kicker text-sky">
        Film shop
      </p>
      <h2 className="mt-2 font-display text-5xl">Buy the film.</h2>
      <p className="mt-3 max-w-xl text-muted">
        We install it. We also sell it. Rolls and sample kits — text or email.
      </p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {shopItems.map((item) => (
          <article key={item.id} className="rounded-xl bg-elevated p-5 shadow-border">
            <h3 className="font-display text-3xl">{item.name}</h3>
            <p className="mt-1 text-sm text-accent">{item.price}</p>
            <p className="mt-2 text-sm text-muted">{item.copy}</p>
          </article>
        ))}
      </div>
      <Button asChild className="mt-6">
        <a href={site.phoneHref}>Call / text for film</a>
      </Button>
    </section>
  );
}

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h2 className="font-display text-5xl">Straight answers.</h2>
      <dl className="mt-8 divide-y divide-border">
        {faqs.map((f) => (
          <div key={f.q} className="py-4">
            <dt className="font-medium">{f.q}</dt>
            <dd className="mt-1 text-sm text-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-4xl">
            SUPERAF<span className="text-accent">.CA</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Paint protection film in Calgary. HARD PP. {site.hoursFilmed} hours.{" "}
            {site.carsFilmed} cars.
          </p>
          <p className="mt-3">
            <a
              className="text-sm underline decoration-accent/60"
              href={site.igHref}
              target="_blank"
              rel="noreferrer"
            >
              Instagram @{site.ig}
            </a>
          </p>
        </div>
        <div className="text-sm">
          <p>{site.address}</p>
          <p className="text-muted">{site.addressNote}</p>
          <p className="mt-2">{site.hours}</p>
          <p className="text-muted">{site.hoursNote}</p>
        </div>
        <div className="text-sm">
          <p>
            <a className="underline decoration-accent/60" href={site.phoneHref}>
              Call / text {site.phone}
            </a>
          </p>
          <p>
            <a className="underline decoration-accent/60" href={site.emailHref}>
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-subtle sm:px-6">
        Paint protection film Calgary · PPF Calgary · window tint Calgary ·
        windshield protection film · ceramic tint · new car PPF Memorial Drive NE
        · hydrophobic paint protection · HARD PP. Placeholder phone until the
        business line lands.
      </p>
    </footer>
  );
}
