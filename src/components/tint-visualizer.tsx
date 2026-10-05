type Zone = number | null;

const WINDOWS = {
  windshield: "158,176 214,112 262,108 236,176",
  visor: "186,136 222,112 258,109 230,136",
  front: "276,110 408,112 408,176 276,176",
  rear: "420,112 508,128 524,176 420,176",
} as const;

export function TintVisualizer({
  film,
  front,
  rear,
  windshield,
  visor,
}: {
  film: "Carbon" | "Ceramic" | null;
  front: Zone;
  rear: Zone;
  windshield: Zone;
  visor: Zone;
}) {
  const ceramic = film === "Ceramic";
  const bits: string[] = [];
  if (front != null) bits.push(`front ${front}%`);
  if (rear != null) bits.push(`rear ${rear}%`);
  if (windshield != null) bits.push(`windshield ${windshield}%`);
  if (visor != null) bits.push(`visor ${visor}%`);
  const label = !film || bits.length === 0 ? "Clear" : `${film} · ${bits.join(" · ")}`;
  const panes = [
    ["windshield", windshield],
    ["visor", visor],
    ["front", front],
    ["rear", rear],
  ] as const;

  return (
    <figure className="tint-viz" data-viz={label}>
      <svg viewBox="0 0 640 280" role="img" aria-label={`Toyota RAV4 window tint preview, ${label}`}>
        <rect width="640" height="280" fill="#0a0a0f" />
        <ellipse cx="320" cy="236" rx="230" ry="26" fill="#12343a" opacity="0.5" />
        <path d="M48 188 H130 L190 150 L236 112 H500 L552 154 L598 180 V208 H48 Z" fill="#1a1d24" stroke="#c5ced9" strokeWidth="2" />
        {panes.map(([name, vlt]) => (
          <Glass key={name} id={name} points={WINDOWS[name]} vlt={vlt} ceramic={ceramic} />
        ))}
        <circle cx="178" cy="208" r="30" fill="#0a0a0f" stroke="#c5ced9" strokeWidth="3" />
        <circle cx="478" cy="208" r="30" fill="#0a0a0f" stroke="#c5ced9" strokeWidth="3" />
        <circle cx="178" cy="208" r="12" fill="#2a2e36" />
        <circle cx="478" cy="208" r="12" fill="#2a2e36" />
      </svg>
      <figcaption>{label}</figcaption>
    </figure>
  );
}

function Glass({ id, points, vlt, ceramic }: { id: string; points: string; vlt: Zone; ceramic: boolean }) {
  const opacity = vlt == null ? 0 : 1 - vlt / 100;
  return (
    <g>
      <clipPath id={`viz-${id}`}>
        <polygon points={points} />
      </clipPath>
      <g clipPath={`url(#viz-${id})`}>
        <rect x="0" y="0" width="640" height="280" fill="#ffffff" />
        <text x="320" y="158" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700" fill="#111111">
          WWW.SUPERAF.CA
        </text>
        <polygon points={points} className={ceramic ? "viz-ceramic" : "viz-carbon"} style={{ opacity }} />
        {ceramic ? <polygon points={points} className="viz-sheen" style={{ opacity: opacity * 0.55 }} /> : null}
      </g>
      <polygon points={points} fill="none" stroke="#9aa6b2" strokeWidth="2" />
    </g>
  );
}
