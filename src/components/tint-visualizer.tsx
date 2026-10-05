import { shadeChoices, tintShades, type TintFilmId } from "@/lib/site";

const SIDE = {
  front: "580,354 568,330 596,306 655,280 726,270 730,318 720,348",
  rear: "766,342 766,258 855,254 906,268 908,336 886,342",
  quarter: "958,332 976,304 1008,298 1026,320 998,338 960,336",
} as const;

const WIND = {
  glass: "472,176 928,176 974,286 426,286",
  visor: "472,176 928,176 935,193 465,193",
  lower: "465,193 935,193 974,286 426,286",
};

export function SideTintPreview({
  film,
  vlt,
  onPick,
}: {
  film: TintFilmId | null;
  vlt: number | null;
  onPick: (vlt: number) => void;
}) {
  const name = film === "ceramic" ? "Ceramic" : film === "carbon" ? "Carbon" : null;
  const label = name && vlt != null ? `${name} · ${vlt}%` : "Clear";
  const shades = film ? tintShades[film] : [];
  return (
    <figure className="tint-viz" data-viz={label}>
      <div className="tint-viz-frame">
        <img src="/images/viz/tucson-side.jpg" alt="" />
        <Glass film={film} vlt={vlt} points={[SIDE.front, SIDE.rear, SIDE.quarter]} />
      </div>
      {shades.length ? (
        <div className="viz-swatches" role="listbox" aria-label={`${name} shades`}>
          {shadeChoices(film!).map((shade) => (
            <button
              key={shade.vlt}
              type="button"
              role="option"
              aria-selected={vlt === shade.vlt}
              data-viz-shade={shade.vlt}
              className={vlt === shade.vlt ? "is-on" : undefined}
              onClick={() => onPick(shade.vlt)}
            >
              <span style={{ background: swatch(shade.vlt) }} />
              {shade.vlt}%
            </button>
          ))}
        </div>
      ) : null}
      <figcaption>{label}</figcaption>
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
  const name = film === "ceramic" ? "Ceramic" : film === "carbon" ? "Carbon" : null;
  const bits: string[] = [];
  if (name && windshield != null) bits.push(`windshield ${windshield}%`);
  if (name && visor != null) bits.push(`visor ${visor}%`);
  const label = bits.length ? `${name} · ${bits.join(" · ")}` : "Clear";
  return (
    <figure className="tint-viz" data-viz={label}>
      <div className="tint-viz-frame">
        <img src="/images/viz/rav4-front.jpg" alt="" />
        <svg viewBox="0 0 1400 788" preserveAspectRatio="none" className="tint-viz-glass" aria-hidden="true">
          {windshield != null && visor != null ? (
            <Pane film={film} vlt={windshield} points={WIND.lower} />
          ) : (
            <Pane film={film} vlt={windshield} points={WIND.glass} />
          )}
          <Pane film={film} vlt={visor} points={WIND.visor} />
          {film === "ceramic" ? (
            <>
              {windshield != null ? (
                <polygon points={visor != null ? WIND.lower : WIND.glass} className="viz-reflect" />
              ) : null}
              {visor != null ? <polygon points={WIND.visor} className="viz-reflect" /> : null}
            </>
          ) : null}
        </svg>
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function Glass({ film, vlt, points }: { film: TintFilmId | null; vlt: number | null; points: string[] }) {
  return (
    <svg viewBox="0 0 1400 788" preserveAspectRatio="none" className="tint-viz-glass" aria-hidden="true">
      {points.map((shape) => (
        <Pane key={shape} film={film} vlt={vlt} points={shape} />
      ))}
      {film === "ceramic"
        ? points.map((shape) => <polygon key={`r-${shape}`} points={shape} className="viz-reflect" />)
        : null}
    </svg>
  );
}

function Pane({ film, vlt, points }: { film: TintFilmId | null; vlt: number | null; points: string }) {
  const opacity = vlt == null ? 0 : 1 - vlt / 100;
  return <polygon points={points} className={film === "ceramic" ? "viz-ceramic" : "viz-carbon"} style={{ opacity }} />;
}

function swatch(vlt: number) {
  const ink = Math.round(255 * (vlt / 100));
  return `rgb(${ink} ${ink} ${ink})`;
}
