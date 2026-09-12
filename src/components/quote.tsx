import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  films,
  finishes,
  packages,
  quotePrice,
  site,
  sizes,
  tints,
  windshield,
  type FilmId,
  type FinishId,
  type PackageId,
  type SizeId,
  type TintId,
} from "@/lib/site";
import { cn, money } from "@/lib/utils";

const LEAD_KEY = "superaf-lead";

type Lead = { name: string; phone: string; email: string };

function readLead(): Lead {
  if (typeof window === "undefined") return { name: "", phone: "", email: "" };
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return { name: "", phone: "", email: "" };
    const p = JSON.parse(raw) as Lead;
    return {
      name: p.name ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
    };
  } catch {
    return { name: "", phone: "", email: "" };
  }
}

export function Quote() {
  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "" });
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [sizeId, setSizeId] = useState<SizeId>("sedan");
  const [packageId, setPackageId] = useState<PackageId>("front");
  const [filmId, setFilmId] = useState<FilmId>("pp10");
  const [finishId, setFinishId] = useState<FinishId>("clear");
  const [tintId, setTintId] = useState<TintId>("none");
  const [glass, setGlass] = useState(false);
  const [notes, setNotes] = useState("");
  const [shown, setShown] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLead(readLead());
  }, []);

  const result = useMemo(
    () =>
      quotePrice({
        sizeId,
        packageId,
        filmId,
        tintId,
        windshield: glass,
      }),
    [sizeId, packageId, filmId, tintId, glass],
  );

  const leadReady = lead.name.trim() && lead.phone.trim() && lead.email.trim();
  const carReady = year.trim() && make.trim() && model.trim();
  const finish = finishes.find((f) => f.id === finishId)?.name;

  function showQuote(e: FormEvent) {
    e.preventDefault();
    if (!leadReady) {
      setError("Name, number, and email first. Then you get the number.");
      setShown(false);
      return;
    }
    if (!carReady) {
      setError("Year, make, and model.");
      setShown(false);
      return;
    }
    localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
    setError("");
    setShown(true);
  }

  const mailBody = encodeURIComponent(
    [
      `${lead.name} · ${lead.phone} · ${lead.email}`,
      `${year} ${make} ${model} · ${result.size}`,
      `${result.pack.name} · ${result.film.name}${packageId === "all" ? ` · ${finish}` : ""}`,
      glass ? windshield.name : "",
      tintId !== "none" ? tints.find((t) => t.id === tintId)?.name : "",
      `Starting at ${money(result.amount)}`,
      notes ? `Notes: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <section id="quote" className="px-4 py-10 sm:px-6 sm:py-14">
      <form
        onSubmit={showQuote}
        className="mx-auto max-w-2xl rounded-xl bg-elevated p-4 shadow-border sm:p-6"
      >
        <p className="font-display text-4xl text-fg">Get the number</p>
        <p className="mt-1 text-sm text-muted">Lead first. Starting price second.</p>

        <fieldset className="mt-5 grid gap-3 sm:grid-cols-3">
          <legend className="sr-only">Your details</legend>
          <Field label="Name">
            <Input
              required
              autoComplete="name"
              value={lead.name}
              onChange={(e) => setLead({ ...lead, name: e.target.value })}
              className="bg-bg"
            />
          </Field>
          <Field label="Phone">
            <Input
              required
              type="tel"
              autoComplete="tel"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              className="bg-bg"
            />
          </Field>
          <Field label="Email">
            <Input
              required
              type="email"
              autoComplete="email"
              value={lead.email}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className="bg-bg"
            />
          </Field>
        </fieldset>

        <fieldset className="mt-4 grid gap-3 sm:grid-cols-4">
          <legend className="sr-only">Vehicle</legend>
          <Field label="Year">
            <Input
              required
              inputMode="numeric"
              placeholder="2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-bg"
            />
          </Field>
          <Field label="Make">
            <Input
              required
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="bg-bg"
            />
          </Field>
          <Field label="Model">
            <Input
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-bg"
            />
          </Field>
          <Field label="Size">
            <select
              className="h-11 w-full rounded-md bg-bg px-3 text-sm text-fg shadow-border outline-none focus-visible:ring-2 focus-visible:ring-sky/40"
              value={sizeId}
              onChange={(e) => setSizeId(e.target.value as SizeId)}
            >
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </fieldset>

        <p className="mt-5 text-xs font-medium uppercase tracking-kicker text-muted">
          Package
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {packages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPackageId(p.id)}
              className={cn(
                "overflow-hidden rounded-lg text-left shadow-border transition-[box-shadow,transform] duration-150",
                packageId === p.id ? "ring-2 ring-sky" : "hover:shadow-border-hover",
              )}
            >
              <img
                src={p.image}
                alt=""
                className="aspect-video w-full object-cover object-center"
              />
              <span className="flex items-center justify-between px-2 py-2">
                <span className="font-display text-xl leading-none">{p.name}</span>
                {p.featured ? (
                  <span className="text-xs uppercase tracking-kicker text-accent">
                    usual
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">
          {packages.find((p) => p.id === packageId)?.blurb}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {films.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilmId(f.id)}
              className={cn(
                "rounded-lg px-3 py-3 text-left shadow-border transition-[box-shadow] duration-150",
                filmId === f.id ? "bg-fg text-bg" : "bg-bg hover:shadow-border-hover",
              )}
            >
              <span className="block font-display text-2xl leading-none">{f.name}</span>
              <span
                className={cn(
                  "mt-1 block text-xs",
                  filmId === f.id ? "text-bg/70" : "text-muted",
                )}
              >
                {f.years}-year warranty
              </span>
            </button>
          ))}
        </div>

        {packageId === "all" ? (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {finishes.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFinishId(f.id)}
                className={cn(
                  "rounded-lg px-3 py-3 text-center shadow-border transition-[box-shadow] duration-150",
                  finishId === f.id
                    ? "bg-sky text-sky-fg"
                    : "bg-bg hover:shadow-border-hover",
                )}
              >
                <span className="font-display text-xl leading-none">{f.name}</span>
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-5 text-xs font-medium uppercase tracking-kicker text-muted">
          Add-ons
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setGlass((v) => !v)}
            className={cn(
              "rounded-lg px-3 py-3 text-left shadow-border transition-[box-shadow] duration-150",
              glass ? "bg-fg text-bg" : "bg-bg hover:shadow-border-hover",
            )}
          >
            <span className="block font-display text-lg leading-none">
              Windshield protection film
            </span>
            <span className={cn("mt-1 block text-xs", glass ? "text-bg/70" : "text-muted")}>
              {money(windshield.sedan)}
            </span>
          </button>
          {tints.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTintId(tintId === t.id ? "none" : t.id)}
              className={cn(
                "rounded-lg px-3 py-3 text-left shadow-border transition-[box-shadow] duration-150",
                tintId === t.id ? "bg-fg text-bg" : "bg-bg hover:shadow-border-hover",
              )}
            >
              <span className="block font-display text-xl leading-none">{t.name}</span>
              <span
                className={cn(
                  "mt-1 block text-xs",
                  tintId === t.id ? "text-bg/70" : "text-muted",
                )}
              >
                from {money(t.sedan)} · lifetime
              </span>
            </button>
          ))}
        </div>

        <Field label="Anything else" className="mt-3">
          <Textarea
            rows={2}
            className="min-h-20 bg-bg"
            placeholder="Rockers, headlights, notes."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

        <Button type="submit" size="lg" className="mt-4 w-full">
          See starting price
        </Button>

        {shown ? (
          <div className="mt-4 rounded-lg bg-bg p-4 shadow-border">
            <p className="text-xs uppercase tracking-kicker text-muted">
              Starting at · {year} {make} {model}
            </p>
            <p className="font-display text-6xl text-accent">{money(result.amount)}</p>
            {result.promo ? (
              <p className="text-sm text-sky">
                <span className="line-through text-muted">{money(result.list)}</span> · 20% until 2027
              </p>
            ) : null}
            <p className="mt-1 text-sm text-muted">
              {result.pack.name} · {result.film.name}
              {packageId === "all" ? ` · ${finish}` : ""} · {result.days}
              {glass ? ` · ${windshield.name}` : ""}
              {tintId !== "none"
                ? ` · ${tints.find((t) => t.id === tintId)?.name}`
                : ""}
              . Size and complexity can move this.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="sky" className="flex-1">
                <a href={site.phoneHref}>Call / text {site.phone}</a>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <a href={`${site.emailHref}?subject=PPF%20quote&body=${mailBody}`}>
                  Email
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
