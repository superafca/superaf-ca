import { useEffect, useRef, useState } from "react";
import { OptImg } from "@/components/opt-img";

type Shot = { file: string; alt: string };

type Manifest = {
  hero: Shot | null;
  gallery: Shot[];
  before: Shot | null;
  after: Shot | null;
};

const EMPTY: Manifest = { hero: null, gallery: [], before: null, after: null };

export const founderShots = [
  { src: "/images/boxes-glove.jpg", alt: "HARD PP boxes, WWW.SUPERAF.CA" },
  { src: "/images/boxes-shop.jpg", alt: "SUPER A.F. Corporation bay, plotter and boxed film" },
  { src: "/images/boxes-pallet.jpg", alt: "HARD PP pallet unloaded in downtown Calgary" },
] as const;

function clean(file: string) {
  return file.replace(/[^a-zA-Z0-9._-]/g, "");
}

function url(page: string, file: string) {
  return `/images/work/${page}/${clean(file)}`;
}

function shotOk(shot: Shot | null | undefined): shot is Shot {
  return Boolean(shot && shot.file && shot.alt && shot.alt.trim());
}

export function PhotoCarousel({
  shots,
  label = "Photos",
}: {
  shots: readonly { src: string; alt: string }[];
  label?: string;
}) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const count = shots.length;
  if (!count) return null;
  const safe = ((index % count) + count) % count;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className="photo-carousel"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(safe - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          go(safe + 1);
        }
      }}
      onTouchStart={(e) => {
        startX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
        if (dx > 40) go(safe - 1);
        else if (dx < -40) go(safe + 1);
        startX.current = null;
      }}
    >
      {shots.map((shot, i) => (
        <OptImg
          key={shot.src}
          src={shot.src}
          alt={i === safe ? shot.alt : ""}
          width={1200}
          height={800}
          className={i === safe ? "is-on" : undefined}
        />
      ))}
      {count > 1 ? (
        <>
          <button type="button" className="photo-arrow is-prev" aria-label="Previous photo" onClick={() => go(safe - 1)}>
            ‹
          </button>
          <button type="button" className="photo-arrow is-next" aria-label="Next photo" onClick={() => go(safe + 1)}>
            ›
          </button>
          <div className="photo-dots">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                className={i === safe ? "is-on" : undefined}
                aria-label={`Photo ${i + 1} of ${count}`}
                aria-current={i === safe ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function WorkCarousel({ page }: { page: "ppf" | "tint" }) {
  const data = useManifest(page);
  const shots = data.gallery.filter(shotOk).map((shot) => ({ src: url(page, shot.file), alt: shot.alt }));
  if (!shots.length) return null;
  return <PhotoCarousel shots={shots} label={page === "ppf" ? "Paint protection installs" : "Tint installs"} />;
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
