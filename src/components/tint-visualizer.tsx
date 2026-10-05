import { shadeChoices, tintShades, type TintFilmId } from "@/lib/site";

const SIDE = {
  front: "/images/viz/mask-front.png",
  rear: "/images/viz/mask-rear.png",
  quarter: "/images/viz/mask-quarter.png",
} as const;

const WIND = "/images/viz/mask-windshield.png";
const VISOR = "/images/viz/mask-visor.png";

/** Horizontal cut across the windshield mask, top ~15% of the glass. */
const VISOR_LINE = { top: "22.02%", left: "36.50%", width: "26.84%" };

export function SideTintPreview({
  film,
  frontVlt,
  rearVlt,
  onPick,
}: {
  film: TintFilmId | null;
  frontVlt: number | null;
  rearVlt: number | null;
  onPick: (vlt: number) => void;
}) {
  const front = film ? frontVlt : null;
  const rear = film ? rearVlt : null;
  const label = chip(film, sideBits(front, rear));
  const shades = film ? tintShades[film] : [];
  const name = filmName(film);
  return (
    <figure className="tint-viz" data-viz={label}>
      <PreviewHead label={label} />
      <div className="tint-viz-frame">
        <img src="/images/viz/landcruiser-side.jpg" alt="" />
        <Shade mask={SIDE.front} vlt={front} />
        <Shade mask={SIDE.rear} vlt={rear} />
        <Shade mask={SIDE.quarter} vlt={rear} />
      </div>
      {shades.length ? (
        <div className="viz-swatches" role="listbox" aria-label={`${name} shades`}>
          {shadeChoices(film!).map((shade) => (
            <button
              key={shade.vlt}
              type="button"
              role="option"
              aria-selected={front === shade.vlt}
              data-viz-shade={shade.vlt}
              className={front === shade.vlt ? "is-on" : undefined}
              onClick={() => onPick(shade.vlt)}
            >
              <span style={{ background: swatch(shade.vlt) }} />
              {shade.vlt}%
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}

export function WindshieldTintPreview({
  film,
  windshield,
  visor,
}: {
  film: TintFilmId | null;
  windshield: number | null;
  visor: number | null;
}) {
  const glass = film ? windshield : null;
  const strip = film && glass == null ? visor : null;
  const bits: string[] = [];
  if (glass != null) bits.push(`windshield ${glass}%`);
  else if (strip != null) bits.push(`visor ${strip}%`);
  const label = chip(film, bits);
  return (
    <figure className="tint-viz" data-viz={label}>
      <PreviewHead label={label} />
      <div className="tint-viz-frame">
        <img src="/images/viz/navigator-front.jpg" alt="" />
        <Shade mask={WIND} vlt={glass} />
        <Shade mask={VISOR} vlt={strip} />
        {strip != null ? <span className="viz-visor-edge" style={VISOR_LINE} /> : null}
      </div>
    </figure>
  );
}

function PreviewHead({ label }: { label: string }) {
  return (
    <div className="tint-viz-head">
      <span className="tint-viz-title">Preview</span>
      <span className="tint-viz-chip">{label}</span>
    </div>
  );
}

function Shade({ mask, vlt }: { mask: string; vlt: number | null }) {
  const opacity = vlt == null ? 0 : 1 - vlt / 100;
  return (
    <div
      className="viz-shade"
      style={{
        opacity,
        maskImage: `url(${mask})`,
        WebkitMaskImage: `url(${mask})`,
      }}
    />
  );
}

function filmName(film: TintFilmId | null) {
  if (film === "ceramic") return "Ceramic";
  if (film === "carbon") return "Carbon";
  return null;
}

function chip(film: TintFilmId | null, bits: string[]) {
  const name = filmName(film);
  if (!name || bits.length === 0) return "Clear";
  return `${name} · ${bits.join(" · ")}`;
}

function sideBits(front: number | null, rear: number | null) {
  if (front != null && rear != null && front !== rear) return [`front ${front}%`, `rear ${rear}%`];
  const vlt = front ?? rear;
  return vlt == null ? [] : [`${vlt}%`];
}

function swatch(vlt: number) {
  const ink = Math.round(255 * (vlt / 100));
  return `rgb(${ink} ${ink} ${ink})`;
}
