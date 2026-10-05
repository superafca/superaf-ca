import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Car,
  Check,
  FileText,
  Info,
  Layers,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCheck,
  Wrench,
  X,
} from "lucide-react";
import { HardBadges } from "@/components/cyber";

const COUNTRIES = ["Canada", "United States", "United Kingdom", "Australia", "Germany", "United Arab Emirates", "Other"];
const PPF = [
  "A-Pillar",
  "Annual Inspection (HARD PP® 10)",
  "Bumper",
  "Door Cups",
  "Full Fender",
  "Partial Fender",
  "Full Front",
  "Full Vehicle",
  "Grille",
  "Hood-Full",
  "Hood-Partial",
  "Lower Doors",
  "Marine",
  "Mirrors",
  "Partial Roof",
  "Rockers",
  "Windshield",
];
const TINT = ["Driver & Passenger Windows", "Front Windshield", "Rear Door Windows", "Rear Windscreen"];

type Film = { name: string; years: number };

export function WarrantyForm({ dealershipName = "" }: { dealershipName?: string }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [film, setFilm] = useState<Film>({ name: "HARD PP® Ultra 10YR", years: 10 });
  const [coverages, setCoverages] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [vin, setVin] = useState("");
  const [toast, setToast] = useState("");
  const [open, setOpen] = useState(false);
  const [cert, setCert] = useState({
    id: "",
    install: "",
    exp: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    vehicle: "",
    vin: "",
    dealer: "",
    installedBy: "",
    notes: "",
    coverages: [] as string[],
    film: "",
    years: 10,
  });

  const vinClean = vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);

  function notify(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3200);
  }

  function toggle(item: string) {
    setCoverages((cur) => (cur.includes(item) ? cur.filter((x) => x !== item) : [...cur, item]));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (vinClean.length !== 17) {
      notify("Enter a valid 17-character VIN.");
      return;
    }
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const installRaw = get("installationDate");
    const installDate = installRaw ? new Date(`${installRaw}T00:00:00`) : new Date();
    const exp = new Date(installDate);
    exp.setFullYear(exp.getFullYear() + film.years);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const id = `HPP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setCert({
      id,
      install: fmt(installDate),
      exp: fmt(exp),
      name: `${get("firstName")} ${get("lastName")}`.trim(),
      email: get("email"),
      phone: get("phone") || "N/A",
      location: `${get("city")}, ${get("state")}, ${get("customerCountry")}`,
      vehicle: `${get("vehicleYear")} ${get("vehicleMake")} ${get("vehicleModel")}`.trim(),
      vin: vinClean,
      dealer: `${get("dealershipName") || "Authorized Studio"} (${get("dealershipCity")}, ${get("dealershipState")}, ${get("dealershipCountry")})`,
      installedBy: get("installedBy") || "Certified Protection Studio",
      notes: get("comments"),
      coverages: [...coverages],
      film: film.name,
      years: film.years,
    });
    setOpen(true);
  }

  async function download(kind: "pdf" | "png") {
    const node = certRef.current;
    if (!node) return;
    notify(kind === "pdf" ? "Generating PDF…" : "Generating PNG…");
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#020617", useCORS: true });
    if (kind === "png") {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `HARD_PP_Warranty_${cert.id}_${cert.vin}.png`;
      a.click();
      notify("PNG downloaded.");
      return;
    }
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const img = canvas.toDataURL("image/jpeg", 0.95);
    const ratio = canvas.height / canvas.width;
    let w = pageW;
    let h = w * ratio;
    if (h > pageH) {
      h = pageH;
      w = h / ratio;
    }
    pdf.addImage(img, "JPEG", (pageW - w) / 2, 0, w, h);
    pdf.save(`HARD_PP_Warranty_${cert.id}_${cert.vin}.pdf`);
    notify("PDF downloaded.");
  }

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const shown = (items: string[]) => items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <section className="cyber-panel cyber-hero-panel">
        <div className="cyber-watermark">HARD PP</div>
        <div className="cyber-panel-head">
          <h2>The science behind HARD PP®</h2>
          <p>Paint · Protection · Advanced film</p>
        </div>
        <HardBadges />
      </section>

      <form className="cyber-form" onSubmit={onSubmit}>
        <section className="cyber-panel">
          <div className="cyber-section-title">
            <UserCheck />
            <div>
              <h2>Customer</h2>
              <p>Primary owner on the warranty record</p>
            </div>
          </div>
          <div className="cyber-grid">
            <label>
              Country *
              <select name="customerCountry" defaultValue="Canada" required>
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              First name *
              <input name="firstName" required placeholder="John" />
            </label>
            <label>
              Last name *
              <input name="lastName" required placeholder="Doe" />
            </label>
            <label>
              Email *
              <input name="email" type="email" required placeholder="john.doe@example.com" />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" placeholder="Phone number" />
            </label>
            <label>
              City *
              <input name="city" required defaultValue="Calgary" />
            </label>
            <label>
              Province / State *
              <input name="state" required defaultValue="Alberta" />
            </label>
          </div>
        </section>

        <section className="cyber-panel">
          <div className="cyber-section-title">
            <Wrench />
            <div>
              <h2>Dealership</h2>
              <p>Authorized HARD PP® installation facility</p>
            </div>
          </div>
          <div className="cyber-grid">
            <label>
              Dealership name *
              <input name="dealershipName" required defaultValue={dealershipName} placeholder="Dealership studio name" />
            </label>
            <label>
              Dealership phone
              <input name="dealershipPhone" type="tel" placeholder="Phone number" />
            </label>
            <label>
              Dealership city
              <input name="dealershipCity" defaultValue="Calgary" />
            </label>
            <label>
              Dealership province
              <input name="dealershipState" defaultValue="Alberta" />
            </label>
            <label>
              Dealership country
              <select name="dealershipCountry" defaultValue="Canada">
                <option>Canada</option>
                <option>United States</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Installed by
              <input name="installedBy" placeholder="Authorized protection technician" />
            </label>
          </div>
        </section>

        <section className="cyber-panel">
          <div className="cyber-section-title">
            <Sparkles />
            <div>
              <h2>Film</h2>
              <p>Select the HARD PP® grade on the vehicle</p>
            </div>
          </div>
          <div className="cyber-films">
            <button
              type="button"
              className={film.years === 5 ? "is-on" : ""}
              onClick={() => setFilm({ name: "HARD PP® Essential 5YR", years: 5 })}
            >
              <strong>HARD PP® Essential 5YR</strong>
              <span>5-year warranty</span>
              <p>Self-healing, hydrophobic topcoat, and rock-chip defense at an honest price.</p>
            </button>
            <button
              type="button"
              className={film.years === 10 ? "is-on" : ""}
              onClick={() => setFilm({ name: "HARD PP® Ultra 10YR", years: 10 })}
            >
              <strong>HARD PP® Ultra 10YR</strong>
              <span>Top tier 10-year</span>
              <p>Deeper gloss, stronger beading, faster self-heal, and the longer warranty.</p>
            </button>
          </div>
        </section>

        <section className="cyber-panel">
          <div className="cyber-section-title">
            <Car />
            <div>
              <h2>Vehicle</h2>
              <p>Specs and the day the film went on</p>
            </div>
          </div>
          <div className="cyber-grid">
            <label>
              Year *
              <input name="vehicleYear" required defaultValue="2026" inputMode="numeric" />
            </label>
            <label>
              Make *
              <input name="vehicleMake" required defaultValue="Mazda" />
            </label>
            <label>
              Model *
              <input name="vehicleModel" required defaultValue="CX-5" />
            </label>
            <label className="cyber-span-2">
              VIN (17) *
              <input
                name="vehicleVin"
                required
                value={vinClean}
                maxLength={17}
                onChange={(e) => setVin(e.target.value)}
                placeholder="JM3KFBCM9R0123456"
                className="cyber-vin"
              />
              <small className={vinClean.length === 17 ? "is-ok" : ""}>{vinClean.length} / 17</small>
            </label>
            <label>
              Installation date *
              <input name="installationDate" type="date" required defaultValue={today} />
            </label>
          </div>
        </section>

        <section className="cyber-panel">
          <div className="cyber-section-title">
            <Layers />
            <div>
              <h2>Coverages</h2>
              <p>Every area filmed or tinted</p>
            </div>
            <label className="cyber-search">
              <Search />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search coverages" />
            </label>
          </div>
          <h3>
            <ShieldCheck /> PPF
          </h3>
          <div className="cyber-chips">
            {shown(PPF).map((item) => (
              <button type="button" key={item} className={coverages.includes(item) ? "is-on" : ""} onClick={() => toggle(item)}>
                <Check />
                {item}
              </button>
            ))}
          </div>
          <h3>
            <Sun /> Tint
          </h3>
          <div className="cyber-chips">
            {shown(TINT).map((item) => (
              <button type="button" key={item} className={coverages.includes(item) ? "is-on" : ""} onClick={() => toggle(item)}>
                <Check />
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="cyber-panel">
          <div className="cyber-section-title">
            <FileText />
            <div>
              <h2>Notes</h2>
            </div>
          </div>
          <textarea name="comments" rows={4} placeholder="Batch numbers, custom areas, anything the registry should keep." />
        </section>

        <div className="cyber-submit">
          <p>By registering, you certify authentic HARD PP® was installed to Super Automotive Film Company standards.</p>
          <button type="submit">
            Register and view summary <ArrowRight />
          </button>
        </div>
      </form>

      {open ? (
        <div className="cyber-modal" role="dialog" aria-label="Warranty certificate">
          <div className="cyber-modal-card">
            <div className="cyber-modal-bar">
              <span>Warranty review</span>
              <div>
                <button type="button" onClick={() => void download("pdf")}>
                  PDF
                </button>
                <button type="button" onClick={() => void download("png")}>
                  PNG
                </button>
                <button type="button" onClick={() => window.print()}>
                  <Printer />
                </button>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close">
                  <X />
                </button>
              </div>
            </div>
            <div id="printableCertificate" ref={certRef} className="cyber-cert">
              <p className="cyber-cert-kicker">Official document · Calgary, AB, Canada</p>
              <h2>Certificate of warranty</h2>
              <p className="cyber-cert-brand">Super Automotive Film Company</p>
              <div className="cyber-cert-meta">
                <div>
                  <span>Certificate ID</span>
                  <strong>{cert.id}</strong>
                </div>
                <div>
                  <span>Film</span>
                  <strong>{cert.film}</strong>
                </div>
                <div>
                  <span>Installed</span>
                  <strong>{cert.install}</strong>
                </div>
                <div>
                  <span>{cert.years}-year expiration</span>
                  <strong>{cert.exp}</strong>
                </div>
              </div>
              <HardBadges />
              <div className="cyber-cert-grid">
                <div>
                  <h3>Customer</h3>
                  <p>{cert.name}</p>
                  <p>{cert.email}</p>
                  <p>{cert.phone}</p>
                  <p>{cert.location}</p>
                </div>
                <div>
                  <h3>Vehicle</h3>
                  <p>{cert.vehicle}</p>
                  <p className="cyber-vin">{cert.vin}</p>
                  <p>Status: Active</p>
                </div>
                <div className="cyber-span-2">
                  <h3>Facility</h3>
                  <p>{cert.dealer}</p>
                  <p>Installed by {cert.installedBy}</p>
                </div>
              </div>
              <h3>Registered coverages</h3>
              <div className="cyber-chips">
                {(cert.coverages.length ? cert.coverages : ["Full standard application"]).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              {cert.notes ? <p className="cyber-notes">{cert.notes}</p> : null}
              <div className="cyber-cert-grid">
                <div>
                  <h3>
                    <ShieldAlert /> Parameters
                  </h3>
                  <p>Covered against yellowing, cracking, bubbling, blistering, and delamination for the registered term.</p>
                  <p>Remedy is replacement HARD PP® film and labor through an approved dealer.</p>
                  <p>Not covered: accidents, misuse, track abuse, harsh abrasives, or a pressure nozzle closer than 36 inches.</p>
                </div>
                <div>
                  <h3>
                    <Info /> Care
                  </h3>
                  <p>Do not wash or touch film edges for 48 hours.</p>
                  <p>Hand wash or touchless only. Keep pressure wands at least 36 inches away.</p>
                  <p>No abrasive compounds, kerosene, or petroleum solvents.</p>
                </div>
              </div>
              <p className="cyber-cert-foot">
                Genuine HARD PP® manufactured by Super Automotive Film Company. Calgary, AB, Canada.
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? <p className="cyber-toast">{toast}</p> : null}
    </>
  );
}
