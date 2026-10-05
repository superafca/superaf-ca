import { useEffect, useState } from "react";

type Shot = { file: string; alt: string; poster?: string };

type Manifest = {
  hero: Shot | null;
  gallery: Shot[];
  before: Shot | null;
  after: Shot | null;
};

const EMPTY: Manifest = { hero: null, gallery: [], before: null, after: null };

function clean(file: string) {
  return file.replace(/[^a-zA-Z0-9._-]/g, "");
}

function url(page: string, file: string) {
  return `/images/work/${page}/${clean(file)}`;
}

function shotOk(shot: Shot | null | undefined): shot is Shot {
  return Boolean(shot && shot.file && shot.alt && shot.alt.trim());
}

function Empty({ label, hero = false }: { label: string; hero?: boolean }) {
  return (
    <div className={hero ? "work-empty work-hero" : "work-empty"}>
      <p>REAL INSTALLS LOADING</p>
      <span>{label}</span>
    </div>
  );
}

function Still({ page, shot }: { page: string; shot: Shot }) {
  const video = /\.(mp4|webm)$/i.test(shot.file);
  if (video) {
    return (
      <video
        src={url(page, shot.file)}
        poster={shot.poster ? url(page, shot.poster) : undefined}
        controls
        muted
        playsInline
        preload="none"
        aria-label={shot.alt}
      />
    );
  }
  return <img src={url(page, shot.file)} alt={shot.alt} loading="lazy" decoding="async" />;
}

export function WorkHero({ page }: { page: "ppf" | "tint" }) {
  const data = useManifest(page);
  const shot = shotOk(data.hero) ? data.hero : null;
  if (!shot) return <Empty hero label={page === "ppf" ? "PAINT PROTECTION" : "TINT"} />;
  return (
    <div className="work-hero">
      <Still page={page} shot={shot} />
    </div>
  );
}

export function WorkGallery({ page }: { page: "ppf" | "tint" }) {
  const data = useManifest(page);
  const shots = data.gallery.filter(shotOk).slice(0, 6);
  const cells = Array.from({ length: 6 }, (_, i) => shots[i] ?? null);
  return (
    <div className="work-grid">
      {cells.map((shot, i) =>
        shot ? (
          <figure key={shot.file} className="work-cell">
            <Still page={page} shot={shot} />
          </figure>
        ) : (
          <Empty key={`empty-${i}`} label={`FRAME ${i + 1}`} />
        ),
      )}
    </div>
  );
}

export function BeforeAfter({ page }: { page: "ppf" }) {
  const data = useManifest(page);
  const before = shotOk(data.before) ? data.before : null;
  const after = shotOk(data.after) ? data.after : null;
  const [pos, setPos] = useState(56);
  if (!before || !after) return <Empty label="BEFORE / AFTER" />;
  return (
    <div className="ba">
      <img src={url(page, after.file)} alt={after.alt} loading="lazy" decoding="async" />
      <img
        src={url(page, before.file)}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-label="Drag to compare before and after"
        onChange={(e) => setPos(Number(e.target.value))}
      />
    </div>
  );
}

function useManifest(page: string) {
  const [data, setData] = useState<Manifest>(EMPTY);
  useEffect(() => {
    let dead = false;
    void fetch(`/images/work/${page}/manifest.json`)
      .then((res) => (res.ok ? res.json() : EMPTY))
      .then((json: Manifest) => {
        if (!dead) setData({ ...EMPTY, ...json, gallery: json.gallery ?? [] });
      })
      .catch(() => {
        if (!dead) setData(EMPTY);
      });
    return () => {
      dead = true;
    };
  }, [page]);
  return data;
}

const TRAITS = [
  { name: "Hydrophobic", path: "M12 3c2 4 6 6 6 10a6 6 0 1 1-12 0c0-4 4-6 6-10z" },
  { name: "Anti-Yellowing", path: "M12 4v2M12 18v2M4.9 6.5l1.4 1.4M17.7 16.1l1.4 1.4M4 12H2M22 12h-2M4.9 17.5l1.4-1.4M17.7 7.9l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" },
  { name: "Repairing", path: "M5 15c2-4 4-6 7-6s5 2 7 6M8 15h8M12 9V5" },
  { name: "Durable", path: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" },
] as const;

export function TraitRow() {
  return (
    <ul className="trait-row">
      {TRAITS.map((trait) => (
        <li key={trait.name}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={trait.path} />
          </svg>
          <span>{trait.name}</span>
        </li>
      ))}
    </ul>
  );
}

function Car({ zones }: { zones: "front" | "plus" | "max" }) {
  const front = zones === "front" || zones === "plus" || zones === "max";
  const plus = zones === "plus" || zones === "max";
  const max = zones === "max";
  return (
    <svg viewBox="0 0 320 128" role="img" aria-label={`${zones} coverage`}>
      <path className="car-shell" d="M28 86h18l14-24 46-16h78l42 16 48 8 18 16h8v16H28z" />
      <circle className="car-wheel" cx="86" cy="102" r="14" />
      <circle className="car-wheel" cx="236" cy="102" r="14" />
      {front ? <path className="car-zone" d="M60 82l14-20 40-12h36v32H70z" /> : null}
      {front ? <path className="car-zone" d="M46 86h16l8-12-10-4-14 16z" /> : null}
      {plus ? <path className="car-zone" d="M150 82h70v8h-70z" /> : null}
      {plus ? <rect className="car-zone" x="168" y="70" width="10" height="10" /> : null}
      {max ? <path className="car-zone" d="M150 62h78l28 14v14h-106z" /> : null}
    </svg>
  );
}

export function CoverageRow() {
  const kits = [
    ["FRONT", "front"],
    ["FRONT+", "plus"],
    ["MAX", "max"],
  ] as const;
  return (
    <div className="coverage-row">
      {kits.map(([name, zone]) => (
        <figure key={name}>
          <Car zones={zone} />
          <figcaption>{name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function VltStrip() {
  const rows = [
    ["Carbon", [5, 18, 25, 36]],
    ["Ceramic", [5, 14, 21, 32, 45, 65]],
  ] as const;
  return (
    <div className="vlt-strip">
      {rows.map(([name, shades]) => (
        <div key={name}>
          <p>{name}</p>
          <div>
            {shades.map((vlt) => {
              const ink = Math.round(255 * (vlt / 100));
              return (
                <span key={vlt}>
                  <i style={{ background: `rgb(${ink} ${ink} ${ink})` }} />
                  {vlt}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
