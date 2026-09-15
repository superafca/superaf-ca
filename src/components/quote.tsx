import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Bubble } from "@/components/bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FilmName } from "@/components/site-header";
import {
  contactMethods,
  films,
  finishes,
  filmFromPrice,
  glassPrice,
  glasses,
  packHasWinter,
  packageArt,
  packages,
  packageListPrice,
  promoActive,
  quotePrice,
  site,
  sizes,
  tintExtras,
  tintFilms,
  tints,
  type ContactId,
  type FilmId,
  type FinishId,
  type GlassId,
  type PackageId,
  type SizeId,
  type TintExtraId,
  type TintFilmId,
  type TintId,
} from "@/lib/site";
import { sendLead } from "@/lib/send-lead";
import { cn, money } from "@/lib/utils";

const LEAD_KEY = "superaf-lead";

async function postLeadBrowser(payload: {
  name: string;
  phone: string;
  email: string;
  contact: string;
  vehicle: string;
  quote: string;
  notes: string;
  photoName?: string;
  photoData?: string;
}) {
  const res = await fetch("https://formsubmit.co/ajax/book@superaf.ca", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `SUPERAF quote — ${payload.name} — ${payload.vehicle}`,
      _template: "box",
      _captcha: "false",
      _replyto: payload.email,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      contact: payload.contact,
      vehicle: payload.vehicle,
      quote: payload.quote,
      notes: payload.notes || "—",
      photo: payload.photoName || "none",
      ...(payload.photoData ? { photo_data: payload.photoData } : {}),
    }),
  });
    const json = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
    };
    if (!res.ok || json.success === "false" || json.success === false) {
      throw new Error("lead email failed");
    }
  }

const HEART_RAIN = [
  { left: "4%", delay: "0s", size: 44, dur: "9s" },
  { left: "12%", delay: "1.2s", size: 58, dur: "11s" },
  { left: "21%", delay: "2.4s", size: 36, dur: "10s" },
  { left: "29%", delay: "0.6s", size: 72, dur: "12s" },
  { left: "38%", delay: "3.1s", size: 48, dur: "9.5s" },
  { left: "47%", delay: "1.8s", size: 64, dur: "11.5s" },
  { left: "55%", delay: "4s", size: 40, dur: "10.5s" },
  { left: "63%", delay: "0.9s", size: 76, dur: "12.5s" },
  { left: "72%", delay: "2.8s", size: 52, dur: "9.8s" },
  { left: "80%", delay: "1.5s", size: 38, dur: "11.2s" },
  { left: "88%", delay: "3.6s", size: 68, dur: "10.2s" },
  { left: "94%", delay: "2.1s", size: 46, dur: "12s" },
];

const SNOW = [
  { left: "6%", delay: "0s", size: 8, dur: "14s" },
  { left: "14%", delay: "2s", size: 12, dur: "16s" },
  { left: "22%", delay: "4s", size: 7, dur: "13s" },
  { left: "31%", delay: "1s", size: 14, dur: "18s" },
  { left: "40%", delay: "5s", size: 9, dur: "15s" },
  { left: "49%", delay: "2.5s", size: 11, dur: "17s" },
  { left: "58%", delay: "0.8s", size: 8, dur: "14.5s" },
  { left: "67%", delay: "3.4s", size: 13, dur: "16.5s" },
  { left: "76%", delay: "1.6s", size: 7, dur: "13.5s" },
  { left: "85%", delay: "4.2s", size: 10, dur: "15.5s" },
  { left: "93%", delay: "2.8s", size: 12, dur: "17.5s" },
  { left: "10%", delay: "6s", size: 9, dur: "14s" },
  { left: "54%", delay: "7s", size: 11, dur: "16s" },
  { left: "78%", delay: "5.5s", size: 8, dur: "18s" },
];

type Lead = { name: string; phone: string; email: string; contact: ContactId };

function readLead(): Lead {
  if (typeof window === "undefined") {
    return { name: "", phone: "", email: "", contact: "text" };
  }
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return { name: "", phone: "", email: "", contact: "text" };
    const p = JSON.parse(raw) as Lead;
    return {
      name: p.name ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      contact: p.contact ?? "text",
    };
  } catch {
    return { name: "", phone: "", email: "", contact: "text" };
  }
}

export function Quote() {
  const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    contact: "text",
  });
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [sizeId, setSizeId] = useState<SizeId>("sedan");
  const [packageId, setPackageId] = useState<PackageId>("max");
  const [filmId, setFilmId] = useState<FilmId>("pp5");
  const [finishId, setFinishId] = useState<FinishId>("clear");
  const [tintId, setTintId] = useState<TintId>("none");
  const [tintFilmId, setTintFilmId] = useState<TintFilmId>("ceramic");
  const [extraIds, setExtraIds] = useState<TintExtraId[]>([]);
  const [glassId, setGlassId] = useState<GlassId>("none");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [shown, setShown] = useState(false);
  const [leveled, setLeveled] = useState(false);
  const [error, setError] = useState("");
  const winter = promoActive();
  const winterSale = winter && (packHasWinter(packageId) || glassId === "clear");

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
        tintFilmId,
        tintExtras: extraIds,
        glassId,
      }),
    [sizeId, packageId, filmId, tintId, tintFilmId, extraIds, glassId],
  );

  const leadReady = lead.name.trim() && lead.phone.trim() && lead.email.trim();
  const carReady = year.trim() && make.trim() && model.trim();
  const finish = finishes.find((f) => f.id === finishId)?.name;

  async function showQuote(e: FormEvent) {
    e.preventDefault();
    if (!leadReady) {
      setError("Name, number, and email first. Then the number.");
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
    setLeveled(true);
    const vehicle = [year, make, model, trim].map((s) => s.trim()).filter(Boolean).join(" ");
    const pack = `${result.pack.name} · ${result.film.name}${packageId === "max" ? ` · ${finish}` : ""}`;
    const quoteLine = [
      `${pack} · ${result.size}`,
      tintId !== "none" || extraIds.length
        ? `Tint: ${tintFilms.find((f) => f.id === tintFilmId)?.name ?? ""} ${tints.find((t) => t.id === tintId)?.name ?? ""} ${extraIds.join(", ")}`
        : "",
      glassId !== "none" ? glasses.find((g) => g.id === glassId)?.name : "",
      `Ballpark ${money(result.amount)} · ${result.days}`,
      notes ? `Customize: ${notes}` : "",
      photo ? `Photo: ${photo.name}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    let photoData = "";
    if (photo && photo.size <= 1_200_000) {
      photoData = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result ?? ""));
        r.onerror = () => resolve("");
        r.readAsDataURL(photo);
      });
    }
    const payload = {
      name: lead.name.trim(),
      phone: lead.phone.trim(),
      email: lead.email.trim(),
      contact: lead.contact,
      vehicle,
      quote: quoteLine,
      notes: notes.trim(),
      photoName: photo?.name,
      photoData,
    };
    void postLeadBrowser(payload).catch(() => {
      void sendLead({ data: payload }).catch(() => {});
    });
  }

  const mailBody = encodeURIComponent(
    [
      `${lead.name} · ${lead.phone} · ${lead.email}`,
      `${year} ${make} ${model}${trim.trim() ? ` ${trim.trim()}` : ""} · ${result.size}`,
      `${result.pack.name} · ${result.film.name}${packageId === "max" ? ` · ${finish}` : ""}`,
      tintId !== "none"
        ? tintFilms.find((f) => f.id === tintFilmId)?.name
        : "",
      `Ballpark ${money(result.amount)} · ${result.days}`,
      notes ? `Customize: ${notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return (
    <section id="quote" className="px-4 py-8 text-center sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1>
          <Bubble className="rounded-2xl px-6 py-3 font-display text-5xl sm:text-7xl">
            Choose your package
          </Bubble>
        </h1>
        <p className="mx-auto mt-3 max-w-3xl">
          <Bubble className="text-sm">
            All prices are starting values. Select your vehicle size for the most
            accurate estimate. Cost varies based on vehicle size and complexity.
            Below you will find some visual examples. We will contact you with a
            finalized quote after you complete your package.
          </Bubble>
        </p>
        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4">
          {sizes.map((s) => {
            const on = sizeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() => setSizeId(s.id)}
                className={cn(
                  "glow-on rounded-xl px-2 py-2 text-xs font-bold uppercase tracking-kicker shadow-border transition-colors duration-150",
                  on ? "bg-fg text-cloud" : "bg-elevated hover:bg-surface",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex snap-x items-stretch gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {packages.map((p) => {
            const from = filmFromPrice(p.id, sizeId, filmId);
            const list = packageListPrice(p.id, sizeId, filmId);
            const selected = packageId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                data-on={selected ? "true" : undefined}
                onClick={() => setPackageId(p.id)}
                className={cn(
                  "glow-on group relative flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-elevated text-center font-bold shadow-border transition-colors duration-150 lg:w-auto",
                  p.fill,
                )}
              >
                {selected ? (
                  <img
                    key={p.id}
                    src="/images/gloves-heart.png"
                    alt=""
                    className="heart-pop pointer-events-none absolute right-2 bottom-2 z-10 size-14 rounded-md object-contain"
                  />
                ) : null}
                {packHasWinter(p.id) && winter ? (
                  <span className="winter-tag">Winter sale</span>
                ) : null}
                <span className="flex h-8 items-center justify-center text-[10px] font-bold uppercase tracking-kicker text-lvl2-fg">
                  {p.badge ? (
                    <span className="rounded-b-sm bg-lvl2 px-3 py-1">{p.badge}</span>
                  ) : (
                    <span className="invisible">MOST POPULAR</span>
                  )}
                </span>
                <span className="flex h-32 items-center justify-center px-2">
                  <img
                    src={packageArt(p.id, sizeId)}
                    alt=""
                    className="h-full w-full object-contain object-center"
                  />
                </span>
                <div className="flex flex-1 flex-col p-4 pt-1">
                  <p className="h-5 text-xs font-bold uppercase tracking-kicker text-fg">
                    {p.kicker}
                  </p>
                  <p className="flex h-11 items-center justify-center font-display text-3xl leading-none text-fg sm:text-4xl">
                    {p.name}
                  </p>
                  <p className="mt-1 flex h-10 items-baseline justify-center gap-2 font-display text-3xl leading-none">
                    {winter && packHasWinter(p.id) ? (
                      <span className="text-3xl text-fg line-through">{money(list)}</span>
                    ) : null}
                    <span
                      className={cn(
                        "text-3xl transition-colors duration-150",
                        p.price,
                        "group-hover:text-cloud group-data-[on]:text-cloud",
                      )}
                    >
                      {money(from)}
                    </span>
                  </p>
                  <p className="h-5 text-xs font-bold uppercase tracking-kicker text-fg">
                    from · Install: {p.daysLabel}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-left text-xs font-bold text-fg">
                    {p.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mx-auto mt-3 max-w-2xl">
          <Bubble className="text-sm">
            {packages.find((p) => p.id === packageId)?.blurb}
          </Bubble>
        </p>

        <p className="mt-6">
          <Bubble className="text-xs font-bold uppercase tracking-kicker">
            Choose your player
          </Bubble>
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {films.map((f) => {
            const on = filmId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() => setFilmId(f.id)}
                className={cn(
                  "glow-on rounded-xl px-3 py-3 text-center shadow-border transition-colors duration-150",
                  on && f.id === "pp5" && "bg-lvl1 text-cloud",
                  on && f.id === "pp10" && "bg-lvl3 text-cloud",
                  !on && "bg-elevated hover:bg-surface",
                )}
              >
                <span className="block font-display text-2xl leading-none">
                  <FilmName years={f.years as 5 | 10} />
                </span>
                <span className={cn("mt-2 block text-sm font-bold uppercase tracking-wide", on ? "text-cloud" : "text-fg")}>
                  {f.headline}
                </span>
                <span className={cn("mt-0.5 block text-[11px] font-bold", on ? "opacity-90" : "text-muted")}>
                  {f.note}
                </span>
              </button>
            );
          })}
        </div>
        {packageId === "max" ? (
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {finishes.map((f) => (
              <button
                key={f.id}
                type="button"
                data-on={finishId === f.id ? "true" : undefined}
                onClick={() => setFinishId(f.id)}
                className="pick rounded-xl px-3 py-3 text-center shadow-border"
              >
                <span className="font-display text-xl leading-none">{f.name}</span>
              </button>
            ))}
          </div>
        ) : null}

        <p className="mt-8">
          <Bubble className="text-xs font-bold uppercase tracking-kicker">
            Windshield protection
          </Bubble>
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {glasses.map((g) => {
            const on = glassId === g.id;
            const from = glassPrice(g.id);
            return (
              <button
                key={g.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() => setGlassId(on ? "none" : g.id)}
                className="pick relative overflow-hidden rounded-xl text-center shadow-border"
              >
                {g.id === "clear" && winter ? (
                  <span className="winter-tag">Winter sale</span>
                ) : null}
                <span className="flex h-32 items-center justify-center px-2">
                  <img src={g.image} alt="" className="h-full w-full object-contain" />
                </span>
                <span className="block px-3 py-3">
                  <span className="block font-display text-xl leading-none">{g.name}</span>
                  <span className="mt-1 block text-xs font-bold">
                    {g.id === "clear" && winter ? (
                      <span className="muted-line mr-1 line-through">{money(g.list)}</span>
                    ) : null}
                    {money(from)} · 1 day
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6">
          <Bubble className="text-xs font-bold uppercase tracking-kicker">
            Window tint · limited lifetime
          </Bubble>
        </p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {tints.map((t) => {
            const on = tintId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() => setTintId(on ? "none" : t.id)}
                className="pick rounded-xl px-2 py-3 text-center shadow-border"
              >
                <span className="block font-display text-lg leading-none">{t.name}</span>
                <span className="mt-1 block text-[11px] font-bold">
                  {money(t[tintFilmId])}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {tintExtras.map((ex) => {
            const on = extraIds.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() =>
                  setExtraIds((cur) =>
                    on ? cur.filter((id) => id !== ex.id) : [...cur, ex.id],
                  )
                }
                className="pick rounded-xl px-2 py-3 text-center shadow-border"
              >
                <span className="block font-display text-lg leading-none">{ex.name}</span>
                <span className="mt-1 block text-[11px] font-bold">
                  {money(ex[tintFilmId])}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {tintFilms.map((f) => {
            const on = tintFilmId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                data-on={on ? "true" : undefined}
                onClick={() => setTintFilmId(f.id)}
                className="pick rounded-xl px-3 py-3 text-center shadow-border"
              >
                <span className="mx-auto mb-2 block h-12">
                  <img src={f.icon} alt="" className="mx-auto h-full object-contain" />
                </span>
                <span className="block font-display text-2xl leading-none">{f.name}</span>
                <span className="mt-1 block text-xs font-bold">{f.blurb}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={showQuote} className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-xl bg-elevated p-5 shadow-border">
          <p>
            <Bubble className="text-xs font-bold uppercase tracking-kicker">
              Introduction
            </Bubble>
          </p>
          <fieldset className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <Input
                className="bg-cloud"
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                autoComplete="name"
              />
            </Field>
            <Field label="Phone">
              <Input
                className="bg-cloud"
                value={lead.phone}
                onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                autoComplete="tel"
              />
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <Input
                className="bg-cloud"
                type="email"
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                autoComplete="email"
              />
            </Field>
          </fieldset>
          <p className="mt-3 text-xs font-bold uppercase tracking-kicker">
            Preferred contact
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {contactMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                data-on={lead.contact === m.id ? "true" : undefined}
                onClick={() => setLead({ ...lead, contact: m.id })}
                className="pick rounded-xl py-2 text-sm font-bold uppercase tracking-kicker shadow-border"
              >
                {m.label}
              </button>
            ))}
          </div>

          <fieldset className="mt-4 grid gap-3 sm:grid-cols-4">
            <Field label="Year">
              <Input
                className="bg-cloud"
                placeholder="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Field>
            <Field label="Make">
              <Input
                className="bg-cloud"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </Field>
            <Field label="Model">
              <Input
                className="bg-cloud"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </Field>
            <Field label="Trim">
              <Input
                className="bg-cloud"
                placeholder="XLT"
                value={trim}
                onChange={(e) => setTrim(e.target.value)}
              />
            </Field>
          </fieldset>

          <Field label="Customize" className="mt-3 text-left">
            <Textarea
              rows={2}
              className="min-h-20 bg-cloud"
              placeholder="Notes. Odd panels. The weird stuff."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <label className="mt-2 flex cursor-pointer flex-col items-start gap-1 text-xs font-bold uppercase tracking-kicker">
              Photo
              <input
                type="file"
                accept="image/*"
                className="w-full text-xs font-medium normal-case tracking-normal"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
              {photo ? (
                <span className="font-medium normal-case tracking-normal text-muted">
                  {photo.name}
                </span>
              ) : null}
            </label>
          </Field>

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

          <Button type="submit" size="lg" className="mt-4 w-full font-display text-2xl tracking-wide">
            Level up
          </Button>
          <p className="mt-2 text-xs text-muted">
            By leveling up you agree to the{" "}
            <a href="/terms" className="underline decoration-accent/60">
              terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline decoration-accent/60">
              privacy
            </a>
            .
          </p>
          </div>

          {shown ? (
            <div className="mt-4 rounded-lg bg-cloud p-4 text-center shadow-border">
              <p className="text-xs uppercase tracking-kicker text-muted">
                {year} {make} {model}
              </p>
              {result.promo && result.savings > 0 ? (
                <p className="font-display text-5xl text-accent">
                  Saving {money(result.savings)} in value
                </p>
              ) : (
                <p className="font-display text-5xl text-accent">{money(result.amount)}</p>
              )}
              <p className="mt-2 text-sm font-bold">
                Ballpark estimate. Every vehicle varies with size and complexity.
                We’re working on your finalized quote now and will contact you
                soon.
              </p>
              <p className="mt-1 text-sm text-muted">
                {result.pack.name} · <FilmName years={result.film.years as 5 | 10} />
                {packageId === "max" ? ` · ${finish}` : ""} · {result.days}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button asChild className="flex-1">
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
      </div>

      {leveled ? (
        <div
          className="jackpot fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4"
          role="dialog"
          aria-label="Details locked in"
        >
          {winterSale
            ? SNOW.map((s, i) => (
                <span
                  key={`sn-${i}`}
                  className="snowflake"
                  style={{
                    left: s.left,
                    width: s.size,
                    height: s.size,
                    animationDuration: s.dur,
                    animationDelay: s.delay,
                  }}
                />
              ))
            : null}
          {winterSale
            ? HEART_RAIN.map((h, i) => (
                <img
                  key={`ht-${i}`}
                  src="/images/gloves-heart.png"
                  alt=""
                  className="heart-rain object-contain"
                  style={{
                    left: h.left,
                    bottom: "-8%",
                    width: h.size,
                    height: h.size,
                    animationDuration: h.dur,
                    animationDelay: h.delay,
                  }}
                />
              ))
            : null}
          <div className="jackpot-card relative z-10 w-full max-w-lg rounded-2xl bg-black/50 p-8 text-center text-accent backdrop-blur-sm">
            <img
              src="/images/gloves-heart.png"
              alt=""
              className="mx-auto size-24 object-contain"
            />
            <p className="mt-3 font-display text-5xl leading-none tracking-wide">
              You’re locked in
            </p>
            <p className="mt-4 text-sm font-bold uppercase tracking-kicker text-cloud">
              {winterSale ? (
                <>
                  You’re locked in to reserve {money(result.savings)} on our winter
                  sale. Ballpark {money(result.amount)}. Every vehicle varies with
                  size and complexity. We’re working on your finalized quote now
                  and will contact you soon.
                </>
              ) : (
                <>
                  Ballpark {money(result.amount)}. Every vehicle varies with size
                  and complexity. We’re working on your finalized quote now and
                  will contact you soon.
                </>
              )}
            </p>
            <p className="mt-4 font-display text-4xl text-cloud">Can’t wait?</p>
            <p className="font-display text-3xl text-cloud">Here’s the number</p>
            <a
              href={
                lead.contact === "whatsapp" ? site.whatsappHref : site.phoneHref
              }
              className="mt-5 inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-cloud px-6 text-sm font-bold uppercase tracking-kicker text-fg"
            >
              {lead.contact === "whatsapp" ? "WhatsApp" : "Call / text"} {site.phone}
            </a>
            <button
              type="button"
              className="mt-4 block w-full text-xs font-bold uppercase tracking-kicker text-cloud/70"
              onClick={() => setLeveled(false)}
            >
              Keep browsing
            </button>
          </div>
        </div>
      ) : null}
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
