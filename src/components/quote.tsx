import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Odometer } from "@/components/odometer";
import {
  batchInstallTime,
  contactMethods,
  customParts,
  extrasTotal,
  films,
  finishes,
  filmFromPrice,
  formatHours,
  FRONT_WINDOWS,
  glassPrice,
  kitTimeLabel,
  maxFilmSavingsPercent,
  packages,
  quotePrice,
  REAR_WINDOWS,
  shadeChoices,
  site,
  TINT_FRONT_HOURS,
  TINT_REAR_HOURS,
  tintFilms,
  tintFrontPrice,
  tintRearPrice,
  tintVisorPrice,
  tintWindshieldPrice,
  TINT_ZONE_HOURS,
  windowShots,
  filmCompare,
  COLOUR_UPCHARGE,
  type ContactId,
  type CustomPartId,
  type FilmId,
  type FinishId,
  type FrontWindows,
  type GlassId,
  type PackageId,
  type RearWindows,
  type TintFilmId,
} from "@/lib/site";
import { confirmLead, sendLead } from "@/lib/send-lead";
import { deliverLead, claimSend, releaseSend } from "@/lib/deliver-lead";
import { customerFilmName, customerPackLine } from "@/lib/confirm-email";
import { leadTransactionId, trackLeadConversion } from "@/lib/track";
import { HardBadges } from "@/components/cyber";
import { SideTintPreview, WindshieldTintPreview } from "@/components/tint-visualizer";
import { VehicleScan } from "@/components/vehicle-scan";
import { BigCheck } from "@/components/faces";
import {
  sfxCash,
  sfxClick,
  sfxCoin,
  sfxExcellent,
  sfxLevel,
  sfxLove,
  sfxMax,
  sfxSelect,
  sfxUnlock,
  sfxWow,
} from "@/lib/sfx";
import { lookupInstall, modelsFor, OTHER } from "@/lib/vehicles";
import { cn, money } from "@/lib/utils";

const LEAD_KEY = "superaf-lead";
const TICKER = "FRONT FRONT+ MAX — YOU PICK THE ADDONS  ·  ";
const CUP_PRICE = customParts.find((part) => part.id === "cups")?.price ?? 99;

function firstName(name: string) {
  const token = name.trim().split(/\s+/)[0] ?? "";
  if (!token) return "";
  return token.charAt(0).toUpperCase() + token.slice(1);
}

function PhoneLink({ contact }: { contact: string }) {
  return (
    <a
      href={contact === "whatsapp" ? site.whatsappHref : site.phoneHref}
      className="mt-5 inline-flex h-12 min-w-48 items-center justify-center rounded-full bg-cloud px-6 text-sm font-bold uppercase tracking-kicker text-fg"
    >
      {contact === "whatsapp" ? "WhatsApp" : "Call / text"} {site.phone}
    </a>
  );
}

function SendingLine() {
  const text = "SENDING…";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), 26);
    return () => window.clearTimeout(t);
  }, [n]);
  return (
    <p className="lead-sending" aria-live="polite">
      {text.slice(0, n)}
      <span className="scan-caret" aria-hidden>
        ▌
      </span>
    </p>
  );
}

async function postLeadBrowser(payload: {
  name: string;
  phone: string;
  email: string;
  contact: string;
  vehicle: string;
  quote: string;
  notes: string;
  photoName?: string;
  photo?: File | null;
  install?: string;
}) {
  const fd = new FormData();
  fd.append("_subject", `SUPERAF quote — ${payload.name} — ${payload.vehicle}`);
  fd.append("_template", "box");
  fd.append("_captcha", "false");
  fd.append("_replyto", payload.email);
  fd.append("name", payload.name);
  fd.append("email", payload.email);
  fd.append("phone", payload.phone);
  fd.append("contact", payload.contact);
  fd.append("vehicle", payload.vehicle);
  fd.append("quote", payload.quote);
  fd.append("notes", payload.notes || "—");
  fd.append("photo", payload.photoName || "none");
  if (payload.install) fd.append("install", payload.install);
  if (payload.photo) {
    fd.append("attachment", payload.photo, payload.photo.name);
  }
  const res = await fetch("https://formsubmit.co/ajax/book@superaf.ca", {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  });
  const text = await res.text().catch(() => "");
  let json: { success?: string | boolean } = {};
  try {
    json = text ? (JSON.parse(text) as { success?: string | boolean }) : {};
  } catch {
    json = {};
  }
  if (!res.ok || json.success === "false" || json.success === false) {
    throw new Error("lead email failed");
  }
}

type Lead = { name: string; phone: string; email: string; contact: ContactId | "" };

function readLead(): Lead {
  if (typeof window === "undefined") {
    return { name: "", phone: "", email: "", contact: "" };
  }
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return { name: "", phone: "", email: "", contact: "" };
    const p = JSON.parse(raw) as Lead;
    return {
      name: p.name ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      contact: p.contact ?? "",
    };
  } catch {
    return { name: "", phone: "", email: "", contact: "" };
  }
}

const F150_STILLS = {
  black: "/images/kits/f150-black.png",
  front: "/images/kits/f150-front.jpg",
  frontplus: "/images/kits/f150-frontplus.jpg",
  max: "/images/kits/f150-max.jpg",
};
const CX5_STILLS = {
  black: "/images/kits/cx5-black.png",
  front: "/images/kits/cx5-front.jpg",
  frontplus: "/images/kits/cx5-frontplus.jpg",
  max: "/images/kits/cx5-max.jpg",
};
const MODEL3_STILLS = {
  black: "/images/kits/model3-black.png",
  front: "/images/kits/model3-front.jpg",
  frontplus: "/images/kits/model3-frontplus.jpg",
  max: "/images/kits/model3-max.jpg",
};

const COVERAGE = [MODEL3_STILLS, F150_STILLS, CX5_STILLS] as const;
const COVERAGE_STAGES = ["black", "front", "frontplus", "max"] as const;

export function Quote() {
  const [lead, setLead] = useState<Lead>({
    name: "",
    phone: "",
    email: "",
    contact: "",
  });
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [packageId, setPackageId] = useState<PackageId | null>(null);
  const [filmId, setFilmId] = useState<FilmId | null>(null);
  const [finishId, setFinishId] = useState<FinishId | "">("");
  const [tintFilmId, setTintFilmId] = useState<TintFilmId | null>(null);
  const [frontWindows, setFrontWindows] = useState<FrontWindows | null>(null);
  const [rearWindows, setRearWindows] = useState<RearWindows | null>(null);
  const [frontShade, setFrontShade] = useState("");
  const [rearShade, setRearShade] = useState("");
  const [windshieldTint, setWindshieldTint] = useState(false);
  const [visorTint, setVisorTint] = useState(false);
  const [windshieldShade, setWindshieldShade] = useState("");
  const [visorShade, setVisorShade] = useState("");
  const [parts, setParts] = useState<CustomPartId[]>([]);
  const [glassId, setGlassId] = useState<GlassId>("none");
  const [glassShade, setGlassShade] = useState<"70%" | "35%">("70%");
  const [ppfOpen, setPpfOpen] = useState(true);
  const [glassOpen, setGlassOpen] = useState(true);
  const [tintOpen, setTintOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [leadPhase, setLeadPhase] = useState<null | "sending" | "success" | "failed">(null);
  const sendingRef = useRef(false);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState<string | null>(null);
  const firstPrice = useRef(true);
  const scanRef = useRef<HTMLDivElement>(null);
  const [scanHeight, setScanHeight] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [cycleLit, setCycleLit] = useState(true);

  useEffect(() => {
    const el = scanRef.current;
    if (!el) return;
    const measure = () => setScanHeight(el.offsetHeight);
    measure();
    const watcher = new ResizeObserver(measure);
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  useEffect(() => {
    setLead(readLead());
    const unlock = () => sfxUnlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    try {
      const raw = sessionStorage.getItem("superaf-vehicle");
      if (raw) {
        const g = JSON.parse(raw) as {
          year?: string;
          make?: string;
          model?: string;
          trim?: string;
          notes?: string;
        };
        if (g.year) setYear(g.year);
        if (g.make) setMake(g.make);
        if (g.model) setModel(g.model);
        if (g.trim) setTrim(g.trim);
        if (g.notes) setNotes(g.notes);
      }
    } catch {
      /* keep empty */
    }
    return () => window.removeEventListener("pointerdown", unlock);
  }, []);

  const modelOptions = useMemo(() => modelsFor(make, year), [make, year]);
  const install = lookupInstall(make, model);
  const band = install.band;
  const rank = install.rank;

  const priceFilm: FilmId = filmId ?? "pp5";
  const tintReady = Boolean(frontWindows || rearWindows || windshieldTint || visorTint);

  const result = useMemo(
    () =>
      quotePrice({
        band,
        rank,
        packageId: packageId ?? "front",
        filmId: filmId ?? "pp5",
        ppfOn: Boolean(packageId),
        tintOn: tintReady,
        tintFilmId: tintFilmId ?? "carbon",
        glassId,
        parts,
        frontWindows: frontWindows ?? undefined,
        rearWindows: rearWindows ?? undefined,
        windshieldTint,
        visorTint,
        finishId,
      }),
    [band, rank, packageId, filmId, tintReady, tintFilmId, glassId, parts, frontWindows, rearWindows, windshieldTint, visorTint, finishId],
  );

  const kitPrices = useMemo(
    () => ({
      max: filmFromPrice("max", band, priceFilm, rank, [], finishId).from,
      front: filmFromPrice("front", band, priceFilm, rank).from,
      custom: filmFromPrice("custom", band, priceFilm, rank, parts).from,
    }),
    [band, priceFilm, rank, parts, finishId],
  );

  const tintHours =
    (frontWindows ? TINT_FRONT_HOURS : 0) + (rearWindows ? TINT_REAR_HOURS : 0);

  const schedule = useMemo(() => {
    const bits: string[] = [];
    if (packageId) {
      const base = kitTimeLabel(packageId, packageId === "custom" ? parts : []);
      bits.push(rank === "hard" && packageId !== "max" ? `${base} + 1 day` : base);
    }
    if (tintHours > 0) bits.push(`${tintHours} ${tintHours === 1 ? "hour" : "hours"}`);
    if (glassId !== "none") bits.push("windshield 1 day");
    return batchInstallTime(bits);
  }, [packageId, parts, rank, tintHours, glassId]);

  const leadReady = Boolean(lead.name.trim() && lead.phone.trim() && lead.email.trim());
  const carReady = Boolean(year.trim() && make.trim() && model.trim());
  const shownKit = (id: "front" | "custom" | "max") => {
    if (carReady) return kitPrices[id];
    const front = filmFromPrice("front", "sedan", priceFilm, "easy").from;
    if (id === "front") return front;
    if (id === "custom") {
      const extra = extrasTotal(parts);
      return front + (extra > 0 ? extra : CUP_PRICE);
    }
    return filmFromPrice("max", "sedan", priceFilm, "easy", [], finishId).from;
  };
  const dockAmount =
    (packageId ? shownKit(packageId) : 0) + result.tintAmount + result.glassAmount;
  const finish = finishes.find((f) => f.id === finishId)?.name;
  const display = money(result.amount);
  const pack = packages.find((p) => p.id === packageId);
  const lockedIndex = !install.known ? 0 : install.art === "truck" ? 1 : install.art === "suv" ? 2 : 0;
  const roaming = !install.known;
  const showIndex = roaming ? cycle : lockedIndex;
  const kitStage = !packageId ? "black" : packageId === "front" ? "front" : packageId === "custom" ? "frontplus" : "max";
  const player = firstName(lead.name);
  const rateFilm: TintFilmId = tintFilmId ?? "carbon";

  useEffect(() => {
    if (!roaming) {
      setCycleLit(true);
      return;
    }
    let dead = false;
    let timer = 0;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    void (async () => {
      while (!dead) {
        await wait(5000);
        if (dead) return;
        setCycleLit(false);
        await wait(2000);
        if (dead) return;
        setCycle((n) => (n + 1) % COVERAGE.length);
        setCycleLit(true);
      }
    })();
    return () => {
      dead = true;
      window.clearTimeout(timer);
    };
  }, [roaming]);

  useEffect(() => {
    if (!filmId) return;
    const film = films.find((f) => f.id === filmId);
    const allowed = film?.variations.map((v) => v.toLowerCase()) ?? [];
    if (finishId && !allowed.includes(finishId)) setFinishId("");
  }, [filmId, finishId]);

  useEffect(() => {
    if (!tintFilmId) {
      if (frontShade) setFrontShade("");
      if (rearShade) setRearShade("");
      if (windshieldShade) setWindshieldShade("");
      if (visorShade) setVisorShade("");
      return;
    }
    const ok = new Set(shadeChoices(tintFilmId).map((s) => String(s.vlt)));
    if (frontShade && !ok.has(frontShade)) setFrontShade("");
    if (rearShade && !ok.has(rearShade)) setRearShade("");
    if (windshieldShade && !ok.has(windshieldShade)) setWindshieldShade("");
    if (visorShade && !ok.has(visorShade)) setVisorShade("");
  }, [tintFilmId, frontShade, rearShade, windshieldShade, visorShade]);

  useEffect(() => {
    if (firstPrice.current) {
      firstPrice.current = false;
      return;
    }
    sfxCoin();
  }, [result.amount]);

  function pickYear(next: string) {
    sfxClick();
    setYear(next);
    if (make && model && model !== OTHER) {
      const still = modelsFor(make, next).some((x) => x.name === model);
      if (!still) setModel("");
    }
  }

  function pickMake(next: string) {
    sfxClick();
    setMake(next);
    setModel(next === OTHER ? OTHER : "");
  }

  function pickKit(id: PackageId) {
    if (id === packageId) {
      sfxSelect();
    } else if (id === "max") {
      sfxMax();
    } else {
      sfxExcellent();
    }
    setPackageId(id);
    if (id === "max") setFilmId("pp10");
  }

  function togglePart(id: CustomPartId) {
    const adding = !parts.includes(id);
    if (adding) sfxCash();
    else sfxClick();
    setPackageId("custom");
    setParts((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function toggleFlip(id: string) {
    sfxClick();
    setFlipped((cur) => (cur === id ? null : id));
  }

  async function showQuote(e?: FormEvent) {
    e?.preventDefault();
    if (!claimSend(sendingRef)) return;
    try {
      const missing = [
        !lead.name.trim() ? "Name" : "",
        !lead.phone.trim() ? "Number" : "",
        !lead.email.trim() || !lead.email.includes("@") || !lead.email.includes(".") ? "Email" : "",
        !year.trim() ? "Year" : "",
        !make.trim() ? "Make" : "",
        !model.trim() ? "Model" : "",
      ].filter(Boolean);
      if (missing.length) {
        const list =
          missing.length === 1
            ? missing[0]
            : missing.length === 2
              ? `${missing[0]} and ${missing[1]}`
              : `${missing.slice(0, -1).join(", ")}, and ${missing[missing.length - 1]}`;
        setError(`${list} is required to progress`);
        return;
      }
      localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
      try {
        sessionStorage.setItem("superaf-vehicle", JSON.stringify({ year, make, model, trim, notes }));
      } catch {
        /* ignore */
      }
      setError("");
      setLeadPhase("sending");
      sfxLevel();
      const vehicle = [year, make, model, trim].map((s) => s.trim()).filter(Boolean).join(" ");
      const filmName = customerFilmName(filmId, packageId === "max" ? finish : "");
      const packageName = pack?.name ?? "";
      const packLine = customerPackLine(packageName, filmName);
      const extraLines = parts
        .map((id) => {
          const row = customParts.find((p) => p.id === id);
          return row ? `${row.name} ${money(row.price)}` : "";
        })
        .filter(Boolean);
      const installLine = `${install.label} · ${install.bumper} · ${result.size} · ${schedule}`;
      const windLabel =
        glassId === "clear" ? "Clear" : glassId === "tinted" ? glassShade.replace("%", "") : "";
      const shadeLabel = (vlt: string) =>
        tintFilmId ? shadeChoices(tintFilmId).find((s) => String(s.vlt) === vlt)?.label : "";
      const tintBits: string[] = [];
      if (tintFilmId || frontWindows || rearWindows || windshieldTint || visorTint) {
        tintBits.push(tintFilms.find((f) => f.id === tintFilmId)?.name ?? "Film not selected");
        if (frontWindows) {
          const price = ` ${money(tintFrontPrice(frontWindows, rateFilm))}`;
          const shade = frontShade ? shadeLabel(frontShade) : "shade not selected";
          tintBits.push(`${frontWindows} front${price}${shade ? ` · ${shade}` : ""}`);
        }
        if (rearWindows) {
          const price = ` ${money(tintRearPrice(rearWindows, rateFilm))}`;
          const shade = rearShade ? shadeLabel(rearShade) : "shade not selected";
          tintBits.push(`${rearWindows} rear${price}${shade ? ` · ${shade}` : ""}`);
        }
        if (windshieldTint) {
          const shade = windshieldShade ? shadeLabel(windshieldShade) : "shade not selected";
          tintBits.push(`windshield ${money(tintWindshieldPrice(rateFilm))}${shade ? ` · ${shade}` : ""}`);
        } else if (visorTint) {
          const shade = visorShade ? shadeLabel(visorShade) : "shade not selected";
          tintBits.push(`visor ${money(tintVisorPrice(rateFilm))}${shade ? ` · ${shade}` : ""}`);
        }
        if (tintHours > 0) tintBits.push(`${tintHours} ${tintHours === 1 ? "hour" : "hours"}`);
      }
      const quoteLine = [
        packageId ? `${packLine} · ${result.size}` : "",
        packageId === "custom" && extraLines.length ? `Custom: ${extraLines.join(", ")}` : "",
        packageId === "custom" && extrasTotal(parts) ? `Extras ${money(extrasTotal(parts))}` : "",
        tintBits.length ? `Tint: ${tintBits.join(" · ")}` : "",
        windLabel ? `Windshield protection film: ${windLabel}` : "",
        `Estimate ${display} · ${schedule}`,
        notes ? `Notes: ${notes}` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      const payload = {
        name: lead.name.trim(),
        phone: lead.phone.trim(),
        email: lead.email.trim(),
        contact: lead.contact,
        vehicle,
        quote: quoteLine,
        notes: notes.trim(),
        install: installLine,
        firstName: lead.name.trim().split(/\s+/)[0] || "there",
        packageName,
        filmName,
        totalDisplay: display,
        hoursLabel: schedule === "—" ? "" : schedule,
      };
      const outcome = await deliverLead({
        transactionId: leadTransactionId(payload.email, payload.phone),
        postBrowser: () => postLeadBrowser(payload),
        postServer: () =>
          sendLead({
            data: payload,
          }),
        confirm: () => confirmLead({ data: payload }),
        track: (event) =>
          trackLeadConversion({
            ...event,
            email: payload.email,
            phone: payload.phone,
          }),
      });
      setLeadPhase(outcome === "success" ? "success" : "failed");
    } finally {
      releaseSend(sendingRef);
    }
  }

  const savePct = maxFilmSavingsPercent();

  const filmPick = () => (
    <div className="kit-row kit-row-2 path-row">
      {films.slice().sort((a, b) => a.years - b.years).map((f) => {
        const on = filmId === f.id;
        const open = flipped === f.id;
        const cost = f.id === "pp5";
        return (
          <article key={f.id} className={cn("kit-card path-card", on && "is-on")}>
            <div className={cn("kit-flip", open && "is-flipped")}>
              <div className={cn("kit-face kit-front", cost ? "film-face-cost" : "film-face-quality")}>
                <button
                  type="button"
                  className="kit-select film-select"
                  onClick={() => {
                    sfxSelect();
                    if (on) {
                      setFilmId(null);
                      return;
                    }
                    if (f.id === "pp10") sfxLove();
                    setFilmId(f.id);
                  }}
                >
                  <BigCheck on={on} className="kit-heart" />
                  <span className={cn("film-copy", cost ? "film-copy-cost" : "film-copy-quality")}>
                    <span className="film-cost-word">{cost ? "COST" : "QUALITY"}</span>
                    <span className="film-years">{cost ? "HARD PP 5YR" : "HARD PP 10YR"}</span>
                    <span className="film-save">
                      {cost ? (
                        `save up to ${savePct}%`
                      ) : (
                        <span className="film-list">
                          <span>Deep gloss.</span>
                          <span>Strong beads.</span>
                          <span>Enhanced durability.</span>
                        </span>
                      )}
                    </span>
                  </span>
                </button>
                <button type="button" className="kit-plus" aria-label={`Compare ${f.name}`} onClick={() => toggleFlip(f.id)}>
                  +
                </button>
              </div>
              <div className="kit-face kit-back compare-back">
                <AlignCompare
                  leftName="5YR"
                  rightName="10YR"
                  rows={filmCompare.map((row) => ({
                    feature: row.feature,
                    left: row.cost,
                    right: row.quality,
                    leftOn: row.costOn,
                    rightOn: row.qualityOn,
                  }))}
                />
                <button type="button" className="kit-plus" onClick={() => toggleFlip(f.id)}>
                  ×
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  const windOn = (id: "clear" | "70" | "35") =>
    id === "clear" ? glassId === "clear" : glassId === "tinted" && glassShade === `${id}%`;

  const glassPick = () => (
    <div>
      <div className="kit-row kit-row-3 wind-row">
        {(
          [
            ["clear", "Clear", "/images/wind-clear.jpg"],
            ["70", "70", "/images/wind-70.jpg"],
            ["35", "35", "/images/wind-35.jpg"],
          ] as const
        ).map(([id, label, src]) => {
          const on = windOn(id);
          return (
            <article key={id} className={cn("kit-card win-card", on && "is-on")}>
              <div className="kit-face win-face" style={{ backgroundImage: `url(${src})` }}>
                <button
                  type="button"
                  className="kit-select win-select"
                  onClick={() => {
                    if (on) {
                      sfxClick();
                      setGlassId("none");
                      return;
                    }
                    sfxWow();
                    if (id === "clear") setGlassId("clear");
                    else {
                      setGlassId("tinted");
                      setGlassShade(id === "70" ? "70%" : "35%");
                    }
                  }}
                >
                  <BigCheck on={on} className="kit-heart" />
                  <span className="win-count">{label}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="kit-price mt-3 justify-center text-lvl2">{money(glassPrice("clear"))}</p>
    </div>
  );

  const shadeMenu = (side: "front" | "rear" | "windshield" | "visor") => {
    const value =
      side === "front" ? frontShade : side === "rear" ? rearShade : side === "windshield" ? windshieldShade : visorShade;
    const options = tintFilmId ? shadeChoices(tintFilmId) : [];
    const labels = {
      front: "Front shade",
      rear: "Rear shade",
      windshield: "Windshield shade",
      visor: "Visor shade",
    };
    const set = (next: string) => {
      if (side === "front") setFrontShade(next);
      else if (side === "rear") setRearShade(next);
      else if (side === "windshield") setWindshieldShade(next);
      else setVisorShade(next);
    };
    return (
      <>
      <label className="shade-field">
        <span>{labels[side]}</span>
        <select
          value={value}
          disabled={!tintFilmId}
          onChange={(e) => {
            sfxClick();
            set(e.target.value);
          }}
        >
          <option value="">{tintFilmId ? "Shade" : "Pick carbon or ceramic"}</option>
          {options.map((s) => (
            <option key={s.vlt} value={String(s.vlt)}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      </>
    );
  };

  const tintPick = () => (
    <div className="tint-pick">
      <div className="tint-shade-panel" role="group" aria-label="Tint film and shade">
        {tintFilms.map((f) => (
          <div key={f.id} className={cn("tint-shade-row", tintFilmId === f.id && "is-on")}>
            <span className="tint-shade-name">{f.name}</span>
            <div className="tint-shade-options" role="listbox" aria-label={`${f.name} shades`}>
              {shadeChoices(f.id).map((s) => {
                const vlt = String(s.vlt);
                const on = tintFilmId === f.id && frontShade === vlt && rearShade === vlt;
                return (
                  <button
                    key={s.vlt}
                    type="button"
                    role="option"
                    aria-selected={on}
                    aria-label={`${f.name} ${s.label}`}
                    data-tint-film={f.id}
                    data-tint-shade={s.vlt}
                    className={on ? "is-on" : undefined}
                    onClick={() => {
                      sfxClick();
                      if (on) {
                        setTintFilmId(null);
                        return;
                      }
                      setTintFilmId(f.id);
                      setFrontShade(vlt);
                      setRearShade(vlt);
                    }}
                  >
                    {s.vlt}%
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <SideTintPreview
        film={tintFilmId}
        frontVlt={frontShade ? Number(frontShade) : null}
        rearVlt={rearShade ? Number(rearShade) : null}
        onPick={(vlt) => {
          sfxClick();
          const next = String(vlt);
          setFrontShade(next);
          setRearShade(next);
        }}
      />
      <div className="count-label">
        <span>How many front windows?</span>
        <span className="hour-label">{TINT_FRONT_HOURS} hours</span>
      </div>
      <div className="kit-row kit-row-2">
        {FRONT_WINDOWS.map((n) => {
          const on = frontWindows === n;
          const shot = windowShots[n];
          return (
            <article key={n} className={cn("kit-card win-card", on && "is-on")}>
              <div className="kit-face win-face" style={{ backgroundImage: `url(${shot.src})` }}>
                <button
                  type="button"
                  className="kit-select win-select"
                  onClick={() => {
                    if (on) {
                      sfxClick();
                      setFrontWindows(null);
                      return;
                    }
                    sfxSelect();
                    setFrontWindows(n);
                  }}
                >
                  <BigCheck on={on} className="kit-heart" />
                  <span className="win-count">{n}</span>
                  <span className="win-price">{money(tintFrontPrice(n, rateFilm))}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {shadeMenu("front")}
      <p className="tint-law">Front window tint is sold for display purposes only. Drivers are responsible for making sure their vehicle complies with local road laws.</p>
      <div className="count-label">
        <span>How many rear windows?</span>
        <span className="hour-label">{TINT_REAR_HOURS} hours</span>
      </div>
      <div className="kit-row kit-row-3">
        {REAR_WINDOWS.map((n) => {
          const on = rearWindows === n;
          const shot = windowShots[n];
          return (
            <article key={n} className={cn("kit-card win-card", on && "is-on")} data-rear="true">
              <div className="kit-face win-face" style={{ backgroundImage: `url(${shot.src})` }}>
                <button
                  type="button"
                  className="kit-select win-select"
                  onClick={() => {
                    if (on) {
                      sfxClick();
                      setRearWindows(null);
                      return;
                    }
                    sfxSelect();
                    setRearWindows(n);
                  }}
                >
                  <BigCheck on={on} className="kit-heart" />
                  <span className="win-count">{n}</span>
                  <span className="win-price">{money(tintRearPrice(n, rateFilm))}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {shadeMenu("rear")}
      <div className="count-label">
        <span>Windshield and visor</span>
        <span className="hour-label">{TINT_ZONE_HOURS}</span>
      </div>
      <WindshieldTintPreview
        film={tintFilmId}
        windshield={windshieldTint && windshieldShade ? Number(windshieldShade) : null}
        visor={!windshieldTint && visorTint && visorShade ? Number(visorShade) : null}
      />
      <div className="zone-quotes">
        <button
          type="button"
          data-zone="windshield"
          className={windshieldTint ? "is-on" : undefined}
          onClick={() => {
            sfxClick();
            setWindshieldTint((on) => {
              if (on) {
                setWindshieldShade("");
                return false;
              }
              setVisorTint(false);
              setVisorShade("");
              return true;
            });
          }}
        >
          <span>Windshield</span>
          <span>{money(tintWindshieldPrice(rateFilm))}</span>
        </button>
        <button
          type="button"
          data-zone="visor"
          className={visorTint ? "is-on" : undefined}
          onClick={() => {
            sfxClick();
            setVisorTint((on) => {
              if (on) {
                setVisorShade("");
                return false;
              }
              setWindshieldTint(false);
              setWindshieldShade("");
              return true;
            });
          }}
        >
          <span>Visor</span>
          <span>{money(tintVisorPrice(rateFilm))}</span>
        </button>
      </div>
      <p className="zone-note">Oversized or complex glass quoted at inspection.</p>
      {windshieldTint ? shadeMenu("windshield") : null}
      {visorTint ? shadeMenu("visor") : null}
      <p className="tint-law">Front window and windshield tint is installed at the customer's request. The customer is responsible for compliance with local road laws.</p>
    </div>
  );

  const extrasBar = () =>
    packageId !== "custom" ? null : (
      <div className="opt-list">
        {customParts.map((part) => {
          const on = parts.includes(part.id);
          return (
            <button key={part.id} type="button" className={on ? "is-on" : ""} onClick={() => togglePart(part.id)}>
              <span>{part.name}</span>
              <span className="opt-note">
                {money(part.price)} · {formatHours(part.hours)}
              </span>
            </button>
          );
        })}
      </div>
    );

  const finishBar = () => {
    if (packageId !== "max") return null;
    const film = films.find((f) => f.id === (filmId ?? "pp5"));
    const allowed = new Set((film?.variations ?? []).map((v) => v.toLowerCase()));
    return (
      <div className="opt-list">
        {finishes.map((f) => {
          const on = finishId === f.id;
          const ok = allowed.has(f.id);
          return (
            <button
              key={f.id}
              type="button"
              className={on ? "is-on" : ""}
              disabled={!ok}
              onClick={() => {
                if (!ok) return;
                sfxClick();
                setFinishId(on ? "" : f.id);
              }}
            >
              <span>{f.id === "colour" ? "Colour — 10YR only" : f.name}</span>
              <span className="opt-note">{f.id === "colour" ? `+${money(COLOUR_UPCHARGE)}` : ok ? "" : "10YR"}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const kitBoard = () => (
    <>
      <div className="kit-row kit-packs mt-2">
        {packages.map((p) => {
          const selected = packageId === p.id;
          const price = shownKit(p.id);
          const time = kitTimeLabel(p.id, p.id === "custom" ? parts : []);
          const open = flipped === p.id;
          return (
            <article key={p.id} className={cn("kit-card", `kit-tone-${p.id}`, selected && "is-on")}>
              <div className={cn("kit-flip", open && "is-flipped")}>
                <div className="kit-face kit-front">
                  <button type="button" className="kit-select" onClick={() => pickKit(p.id)}>
                    <BigCheck on={selected} className="kit-heart" />
                    <span className={cn("kit-name kit-name-fill")}>{p.name}</span>
                    {p.kicker ? <span className="kit-kicker">{p.kicker}</span> : null}
                    <span className="kit-card-line">{p.blurb}</span>
                    <span className="kit-from">prices starting at</span>
                    <Odometer value={price} className="kit-price justify-center" />
                    <span className="kit-time">{time}</span>
                  </button>
                  <button
                    type="button"
                    className="kit-plus"
                    aria-label={`About ${p.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      sfxClick();
                      setFlipped(open ? null : p.id);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="kit-face kit-back">
                  <p className="kit-why">{p.why}</p>
                  <p className="kit-offer">{p.offer}</p>
                  <ul className="kit-includes">
                    {p.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="kit-plus"
                    aria-label="Close"
                    onClick={() => {
                      sfxClick();
                      setFlipped(null);
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {extrasBar()}
      {finishBar()}
    </>
  );

  return (
    <>
      <div id="quote">
        <section className="arcade-stage relative">
          <div className="hud-ticker relative z-20">
            <div className="hud-ticker-track">
              <span>{TICKER.repeat(4)}</span>
              <span>{TICKER.repeat(4)}</span>
            </div>
          </div>

          <div className="relative z-20 mx-auto max-w-6xl px-4 pb-32 pt-8 text-center md:px-6">
            <p className="est-title mb-3 text-center">
              FOR AN ACCURATE QUOTE
              <br />
              SELECT YOUR VEHICLE
            </p>
            <div className="est-progress" aria-hidden>
              <span
                style={{
                  width: `${([carReady, Boolean(packageId), Boolean(filmId), leadReady].filter(Boolean).length / 4) * 100}%`,
                }}
              />
            </div>
            <div className="est-pair">
            <div className="hud-panel vehicle-scan p-5 text-left" ref={scanRef}>
              <VehicleScan
                year={year}
                make={make}
                model={model}
                trim={trim}
                modelOptions={modelOptions}
                carReady={carReady}
                onYear={pickYear}
                onMake={pickMake}
                onModel={(next) => {
                  sfxSelect();
                  setModel(next);
                }}
                onTrim={setTrim}
              />
              <fieldset className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <Input
                    className="bg-cloud"
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Number">
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
              <p className="mt-3 text-xs font-semibold uppercase tracking-kicker text-muted">Preferred contact</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {contactMethods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-on={lead.contact === m.id ? "true" : undefined}
                    onClick={() => {
                      sfxClick();
                      setLead({ ...lead, contact: m.id });
                    }}
                    className="pick rounded-xl py-2 text-sm font-semibold tracking-tight shadow-border"
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <Field label="Notes" className="mt-3">
                <Textarea
                  rows={2}
                  className="min-h-20 bg-cloud"
                  placeholder="Share any additional thoughts."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </div>

            <div className="vehicle-frame" style={scanHeight ? { height: scanHeight } : undefined}>
              <div className="scan-brand">
                <span>HARD PP // COVERAGE</span>
                <span className={cn("scan-lock", packageId && "is-on")}>
                  {kitStage === "front" ? "FRONT" : kitStage === "frontplus" ? "FRONT+" : kitStage === "max" ? "MAX" : "BASE"}
                </span>
              </div>
              {!install.known && <p className="coverage-alert">Please enter vehicle information</p>}
              <div className="vehicle-frame-stage">
                {COVERAGE.map((stills, i) =>
                  COVERAGE_STAGES.map((id) => (
                    <img
                      key={`${i}-${id}`}
                      src={stills[id]}
                      alt=""
                      className={!roaming || cycleLit ? (i === showIndex && id === kitStage ? "is-on" : undefined) : undefined}
                    />
                  )),
                )}
              </div>
            </div>
            </div>

            <ServiceBlock
              title="Paint Protection"
              time={packageId ? kitTimeLabel(packageId, packageId === "custom" ? parts : []) : undefined}
              open={ppfOpen}
              selected={Boolean(packageId || filmId || parts.length)}
              onOpen={() => setPpfOpen(true)}
              onClose={() => {
                setPpfOpen(false);
                setPackageId(null);
                setFilmId(null);
                setParts([]);
              }}
            >
              {kitBoard()}
              <p className="mt-8 kit-path">CHOOSE YOUR PATH</p>
              <HardBadges />
              <div className="mt-3">{filmPick()}</div>
            </ServiceBlock>

            <ServiceBlock
              title="Windshield Protection Film"
              time={glassId !== "none" ? "1 day" : undefined}
              open={glassOpen}
              selected={glassId !== "none"}
              onOpen={() => setGlassOpen(true)}
              onClose={() => {
                setGlassOpen(false);
                setGlassId("none");
              }}
            >
              {glassPick()}
            </ServiceBlock>

            <ServiceBlock
              title="Window Tint"
              time={
                tintHours > 0 && (windshieldTint || visorTint)
                  ? `${tintHours} hours · ${TINT_ZONE_HOURS}`
                  : tintHours > 0
                    ? `${tintHours} hours`
                    : windshieldTint || visorTint
                      ? TINT_ZONE_HOURS
                      : undefined
              }
              open={tintOpen}
              selected={Boolean(tintFilmId || frontWindows || rearWindows || windshieldTint || visorTint)}
              onOpen={() => setTintOpen(true)}
              onClose={() => {
                setTintOpen(false);
                setTintFilmId(null);
                setFrontWindows(null);
                setRearWindows(null);
                setFrontShade("");
                setRearShade("");
                setWindshieldTint(false);
                setVisorTint(false);
                setWindshieldShade("");
                setVisorShade("");
              }}
            >
              {tintPick()}
            </ServiceBlock>
          </div>
        </section>
      </div>

      <form
          className="app-dock"
          onSubmit={(e) => {
            void showQuote(e);
          }}
        >
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[11px] font-semibold tracking-tight text-muted">
              {player ? `${player}, your estimate pending approval` : "Your estimate pending approval"}
            </p>
            <Odometer value={dockAmount} className="kit-price text-3xl leading-none text-lvl2 md:text-4xl" />
            <p className="dock-meta text-[11px] text-muted">
              {[
                packageId && pack ? pack.name : null,
                carReady ? `${year} ${model}` : "Select your vehicle for the most accurate quote",
                schedule !== "—" ? schedule : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <p className="dock-meta dock-installer text-[11px] text-muted">{site.installerYears}.</p>
          </div>
          <div className="shrink-0 text-right">
            <button type="submit" className="hud-gold level-up px-6 text-[11px] tracking-[0.18em] md:px-8 md:text-sm">
              LEVEL UP
            </button>
          </div>
        </form>

      {error ? (
        <div className="progress-pop" role="dialog" aria-label="Required to progress">
          <button type="button" className="progress-pop-bg" aria-label="Dismiss" onClick={() => setError("")} />
          <div className="progress-block">
            <p>{error}</p>
            <button type="button" className="progress-back" onClick={() => setError("")}>
              Back
            </button>
          </div>
        </div>
      ) : null}

      {leadPhase ? (
        <div
          className="jackpot fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-4"
          role="dialog"
          aria-label={leadPhase === "failed" ? "Estimate did not send" : leadPhase === "sending" ? "Sending your estimate" : "Details locked in"}
          data-lead-phase={leadPhase}
        >
          <div className={cn("jackpot-card relative z-10 w-full max-w-lg rounded-3xl bg-white p-8 text-center text-fg shadow-border", leadPhase === "failed" && "is-failed")}>
            {leadPhase === "sending" ? (
              <>
                <SendingLine />
                <PhoneLink contact={lead.contact} />
              </>
            ) : leadPhase === "failed" ? (
              <>
                <p className="lead-fail" role="alert">
                  That didn't send. Call or text us and we'll get you booked.
                </p>
                <PhoneLink contact={lead.contact} />
                <button type="button" className="lead-retry" onClick={() => void showQuote()}>
                  Try again
                </button>
              </>
            ) : (
              <>
                <BigCheck on className="mx-auto size-16" />
                <p className="mt-5 text-base font-semibold leading-relaxed tracking-tight text-fg">
                  Your estimate is {display}. If all details are appropriate your quote will be accurate. We're reviewing your submission and will contact you for scheduling and any further questions soon!
                </p>
                {lead.email.trim() ? (
                  <p className="mt-4 text-sm font-semibold leading-relaxed tracking-tight text-fg">
                    We just emailed your confirmation. If it's not in your inbox in a few minutes, please check your spam or junk folder.
                  </p>
                ) : null}
                <p className="mt-4 font-display text-4xl">Can’t wait?</p>
                <p className="font-display text-3xl">Here’s the number</p>
                <PhoneLink contact={lead.contact} />
                <button
                  type="button"
                  className="mt-4 block w-full text-xs font-semibold tracking-tight text-muted"
                  onClick={() => setLeadPhase(null)}
                >
                  Keep browsing
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({
  label,
  children,
  className,
  arcade,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  arcade?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className={cn("mb-1 block text-xs font-medium text-muted", arcade && "kit-ink text-[8px] tracking-widest")}>
        {label}
      </span>
      {children}
    </label>
  );
}

function ServiceBlock({
  title,
  time,
  open,
  selected,
  onOpen,
  onClose,
  children,
}: {
  title: string;
  time?: string;
  open: boolean;
  selected: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) {
    return (
      <button
        type="button"
        className="service-add"
        onClick={() => {
          sfxClick();
          onOpen();
        }}
      >
        <span>{title}</span>
        <span className="service-plus" aria-hidden>
          +
        </span>
      </button>
    );
  }
  return (
    <section className="service-block">
      <div className="service-head">
        <div>
          <h2 className="service-title">{title}</h2>
          {time ? <p className="service-time hour-label">{time}</p> : null}
        </div>
        <button
          type="button"
          className="service-x"
          aria-label={selected ? `Remove ${title}` : `Collapse ${title}`}
          onClick={() => {
            sfxClick();
            onClose();
          }}
        >
          {selected ? "×" : "–"}
        </button>
      </div>
      {children}
    </section>
  );
}

function AlignCompare({
  leftName,
  rightName,
  rows,
}: {
  leftName: string;
  rightName: string;
  rows: { feature: string; left: string; right: string; leftOn: boolean; rightOn: boolean }[];
}) {
  return (
    <div className="align-compare">
      <div className="align-head">
        <span />
        <span>{leftName}</span>
        <span>{rightName}</span>
      </div>
      {rows.map((row) => (
        <div key={row.feature} className="align-row">
          <span>{row.feature}</span>
          <span className={row.leftOn ? undefined : "is-miss"}>{row.leftOn ? row.left : "×"}</span>
          <span className={row.rightOn ? undefined : "is-miss"}>{row.rightOn ? row.right : "×"}</span>
        </div>
      ))}
    </div>
  );
}
