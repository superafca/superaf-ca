import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CyberFrame, HardBadges } from "@/components/cyber";
import { VehicleScan } from "@/components/vehicle-scan";
import {
  DIY_BULK,
  DIY_CUT,
  DIY_FREE_SHIP,
  DIY_PANELS,
  DIY_ROLL,
  DIY_SHIP,
  diyPrice,
  type DiyFilmId,
  type DiyKitId,
  type DiyPanelId,
} from "@/lib/diy";
import { sendDiyOrder, startDiyCheckout, verifyDiyPayment } from "@/lib/diy-order";
import { site } from "@/lib/site";
import { readUtm, trackDiy } from "@/lib/track";
import { lookupInstall, modelsFor, OTHER } from "@/lib/vehicles";
import { money } from "@/lib/utils";
import { sfxClick, sfxSelect } from "@/lib/sfx";

export const Route = createFileRoute("/diy")({
  component: DiyPage,
  head: () => ({
    meta: [
      { title: "DIY HARD PP kits — pre-cut, you install | SUPERAF.CA" },
      {
        name: "description",
        content:
          "Pre-cut HARD PP kits you install yourself. FRONT from $399. Plotter-cut, packed in a HARD PP tube. Free shipping over $600.",
      },
    ],
  }),
});

const STEPS = [
  ["Build your kit", "Pick your vehicle, kit, and film. FRONT+ adds panels one by one. Price rolls live."],
  ["We confirm", "We email you the full panel list and confirm every piece and edge before anything gets cut. Adjustments are free here — extended coverage, wrapped edges, deleted pieces. We'll also flag any coverage limits for your specific vehicle."],
  ["You pay in full", "The blade doesn't drop until payment clears."],
  ["We cut", "Plotter-cut from genuine HARD PP, labeled per panel, rolled into a custom HARD PP tube."],
  ["We ship", "Free shipping over $600, $39 flat under."],
  ["You install", "Install guides and technique videos included. The install is on you."],
] as const;

const FAQ = [
  ["Does the warranty cover DIY kits?", "The HARD PP warranty covers the film itself — manufacturing defects, yellowing, the works. It doesn't cover the install. That's on you."],
  ["What if there's no kit for my vehicle?", "Email us. If we can pattern it, we can cut it."],
  ["Can you help me install it?", "We'll point you at guides and technique videos. But the install is on you — if you want it done right, that's what the bay is for."],
] as const;

function DiyPage() {
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [kit, setKit] = useState<DiyKitId | null>(null);
  const [film, setFilm] = useState<DiyFilmId>("pp5");
  const [panels, setPanels] = useState<DiyPanelId[]>([]);
  const [feet5, setFeet5] = useState(0);
  const [feet10, setFeet10] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [payNote, setPayNote] = useState("");
  const [paid, setPaid] = useState<{ amount: number } | null>(null);
  const [utm, setUtm] = useState("");

  const modelOptions = useMemo(() => modelsFor(make, year), [make, year]);
  const carReady = Boolean(year && make && model);
  const price = diyPrice({ kit, film, panels, feet5, feet10, tools: false, pickup: false });
  const vehicle = [year === OTHER ? "Older" : year, make === OTHER ? "Other" : make, model === OTHER ? "Other" : model, trim]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    setUtm(readUtm());
    const ga = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
    const pixel = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
    const w = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    if (ga && !document.getElementById("diy-ga")) {
      const script = document.createElement("script");
      script.id = "diy-ga";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      document.head.appendChild(script);
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag() {
        w.dataLayer?.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", ga);
    }
    if (pixel && !document.getElementById("diy-pixel")) {
      type Fbq = ((...args: unknown[]) => void) & { queue: unknown[] };
      const stub: Fbq = Object.assign((...args: unknown[]) => {
        stub.queue.push(args);
      }, { queue: [] as unknown[] });
      (window as unknown as { fbq: Fbq }).fbq = stub;
      const script = document.createElement("script");
      script.id = "diy-pixel";
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.onload = () => {
        stub("init", pixel);
        stub("track", "PageView");
      };
      document.head.appendChild(script);
    }
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id") ?? "";
    if (params.get("paid") !== "1" || !sessionId) return;
    if (sessionStorage.getItem(`superaf-paid-${sessionId}`)) {
      setPaid({ amount: Number(sessionStorage.getItem(`superaf-paid-amount-${sessionId}`) || 0) });
      return;
    }
    void verifyDiyPayment({ data: { sessionId } }).then((res) => {
      if (!res.paid) return;
      sessionStorage.setItem(`superaf-paid-${sessionId}`, "1");
      sessionStorage.setItem(`superaf-paid-amount-${sessionId}`, String(res.amount));
      setPaid({ amount: res.amount });
      trackDiy("purchase", { value: res.amount, currency: "CAD" });
    });
  }, []);

  function summaryText() {
    const lines = [
      kit ? `${kit === "custom" ? "FRONT+" : kit === "max" ? "MAX" : "FRONT"} · ${film === "pp5" ? "5YR" : "10YR"} ${money(price.kitAmount)}` : "",
      kit === "custom" && panels.length
        ? `Panels: ${panels.map((id) => DIY_PANELS.find((p) => p.id === id)?.name).filter(Boolean).join(", ")} ${money(price.panelAmount)}`
        : "",
      price.cut ? `Cut & pack ${money(price.cut)}` : "",
      price.feet5 ? `Bulk 5YR ${price.feet5} ft ${money(price.feet5 * DIY_BULK.pp5)}` : "",
      price.feet10 ? `Bulk 10YR ${price.feet10} ft ${money(price.feet10 * DIY_BULK.pp10)}` : "",
      price.roll ? `Roll-pack ${money(DIY_ROLL)}` : "",
      `Shipping ${price.shipping ? money(price.shipping) : "FREE"}`,
      `Total ${money(price.total)} CAD`,
      "Coverage: we confirm the full panel list before the blade drops. Adjustments are free at that step.",
    ];
    return lines.filter(Boolean).join("\n");
  }

  function mail() {
    return {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      vehicle: vehicle || "Vehicle not listed",
      summary: summaryText(),
      total: price.total,
      utm,
      address: address.trim(),
    };
  }

  async function confirm() {
    if (!name.trim() || !email.includes("@") || !phone.trim()) return;
    if (!kit && price.feet5 + price.feet10 === 0) return;
    if (kit === "custom" && panels.length === 0) return;
    setBusy(true);
    try {
      await sendDiyOrder({ data: mail() });
      trackDiy("kit_configured", { value: price.total, kit: kit ?? "bulk" });
      setConfirmed(true);
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    setBusy(true);
    try {
      trackDiy("begin_checkout", { value: price.total, kit: kit ?? "bulk" });
      const res = await startDiyCheckout({ data: { ...mail(), origin: window.location.origin } });
      if (res.url) window.location.href = res.url;
      else setPayNote("Your kit is confirmed by email. The payment link is sent from the bay if checkout isn't open yet.");
    } finally {
      setBusy(false);
    }
  }

  const ready = Boolean(name.trim() && email.includes("@") && phone.trim() && (kit || price.feet5 + price.feet10 > 0) && (kit !== "custom" || panels.length > 0));

  if (paid) {
    return (
      <CyberFrame kicker="Order confirmed" title="Paid in full.">
        <p>The blade can drop. We'll cut your kit and email you when it ships.</p>
        <p className="cyber-kit-from">{paid.amount ? money(paid.amount) : "Payment received"} CAD</p>
      </CyberFrame>
    );
  }

  return (
    <CyberFrame kicker="You install" title="DIY kits">
      <section className="diy-hero">
        <p>Pre-cut HARD PP. Plotter-cut. Packed in our tube. The install is on you.</p>
        <p className="diy-offer">FRONT from {money(399)} · 10YR {money(549)} · MAX from {money(1299)}</p>
        <HardBadges />
      </section>

      <ol className="diy-steps">
        {STEPS.map(([title, body], i) => (
          <li key={title}>
            <strong>{i + 1}. {title}</strong>
            <span>{body}</span>
          </li>
        ))}
      </ol>

      <section className="hud-panel vehicle-scan diy-block">
        <VehicleScan
          year={year}
          make={make}
          model={model}
          trim={trim}
          modelOptions={modelOptions}
          carReady={carReady}
          onYear={(next) => {
            sfxClick();
            setYear(next);
            if (make && model && model !== OTHER && !modelsFor(make, next).some((x) => x.name === model)) setModel("");
          }}
          onMake={(next) => {
            sfxClick();
            setMake(next);
            setModel(next === OTHER ? OTHER : "");
          }}
          onModel={(next) => {
            sfxSelect();
            setModel(next);
          }}
          onTrim={setTrim}
        />
        <p className="diy-miss">
          Don't see your vehicle? <a href={site.emailHref}>Email us</a> — if we can pattern it, we can cut it.
        </p>
        {carReady ? <p className="scan-boot">Pattern rank {lookupInstall(make, model).label}. We flag coverage limits for this vehicle before we cut.</p> : null}
      </section>

      <div className="cyber-kits diy-kits">
        {(
          [
            ["front", "FRONT", "Hood, fenders, bumper, mirrors."],
            ["custom", "FRONT+", "FRONT kit plus the panels you pick."],
            ["max", "MAX", "Full vehicle."],
          ] as const
        ).map(([id, label, blurb]) => (
          <button key={id} type="button" className={kit === id ? "cyber-kit is-on" : "cyber-kit"} onClick={() => { sfxClick(); setKit(kit === id ? null : id); }}>
            <h2>{label}</h2>
            <p>{blurb}</p>
            <p className="cyber-kit-from">5YR {money(id === "max" ? 1299 : 399)} · 10YR {money(id === "max" ? 1799 : 549)}</p>
          </button>
        ))}
      </div>

      <div className="diy-films">
        {(["pp5", "pp10"] as const).map((id) => (
          <button key={id} type="button" className={film === id ? "is-on" : ""} onClick={() => { sfxClick(); setFilm(id); }}>
            {id === "pp5" ? "5YR" : "10YR"}
          </button>
        ))}
      </div>

      {kit === "custom" ? (
        <div className="diy-panels">
          {DIY_PANELS.map((panel) => (
            <button
              key={panel.id}
              type="button"
              className={panels.includes(panel.id) ? "is-on" : ""}
              onClick={() => {
                sfxClick();
                setPanels((cur) => (cur.includes(panel.id) ? cur.filter((x) => x !== panel.id) : [...cur, panel.id]));
              }}
            >
              {panel.name}
              <span>{money(panel.price)}</span>
            </button>
          ))}
        </div>
      ) : null}

      <section className="diy-block">
        <h2>Bulk HARD PP</h2>
        <p>60 inches wide, by the linear foot. {money(DIY_BULK.pp5)}/ft 5YR · {money(DIY_BULK.pp10)}/ft 10YR · {money(DIY_ROLL)} roll-pack.</p>
        <div className="diy-stepper">
          <label>5YR feet <input type="number" min={0} value={feet5} onChange={(e) => setFeet5(Number(e.target.value))} /></label>
          <label>10YR feet <input type="number" min={0} value={feet10} onChange={(e) => setFeet10(Number(e.target.value))} /></label>
        </div>
      </section>

      <section className="diy-summary">
        <h2>Order</h2>
        <p>{kit ? (kit === "custom" ? "FRONT+" : kit === "max" ? "MAX" : "FRONT") : "No kit"} · {film === "pp5" ? "5YR" : "10YR"} {money(price.kitAmount)}</p>
        {price.panelAmount ? <p>Panels {money(price.panelAmount)}</p> : null}
        {price.cut ? <p>Cut & pack {money(DIY_CUT)}</p> : null}
        {price.bulk ? <p>Bulk film {money(price.bulk)}</p> : null}
        {price.roll ? <p>Roll-pack {money(DIY_ROLL)}</p> : null}
        <p>Shipping {price.shipping ? money(DIY_SHIP) : "FREE"} {price.merchandise >= DIY_FREE_SHIP ? `over ${money(DIY_FREE_SHIP)}` : ""}</p>
        <p className="diy-total">{money(price.total)} CAD</p>
        <div className="diy-fields">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Ship to" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <aside className="diy-policy">
          <p>Every vehicle is different — certain coverages may not be available as a kit for your vehicle, or the kit may not give you the exact coverage you're picturing. We'll confirm exactly what your kit includes before we cut.</p>
          <p>Once the film is cut, it's yours — no refunds, no exchanges.</p>
          <p>Real talk: we cut kits. We can't guarantee you'll be able to install it. If you want it done right, that's what the bay is for. DIY is on you — but we'll make sure the kit is right.</p>
        </aside>
        <button type="button" className="diy-confirm" disabled={!ready || busy} onClick={() => void confirm()}>
          Confirm my kit
        </button>
        {confirmed ? (
          <button type="button" className="diy-pay" disabled={busy} onClick={() => void pay()}>
            Approve and pay in full
          </button>
        ) : null}
        {confirmed ? <p>We emailed the panel list to you and to the bay. Adjustments are free before anything is cut.</p> : null}
        {payNote ? <p>{payNote}</p> : null}
      </section>

      <section className="diy-faq">
        <h2>FAQ</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      <section className="diy-foot">
        <p>Free shipping over {money(DIY_FREE_SHIP)}. {money(DIY_SHIP)} flat under that.</p>
        <p><a href={site.googleReview}>Read our Google reviews</a></p>
      </section>
    </CyberFrame>
  );
}
