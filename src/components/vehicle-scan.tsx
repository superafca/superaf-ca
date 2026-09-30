import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MAKES, OTHER, YEARS, type VehicleModel } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

function BootLine() {
  const text = "LINK SIZE BAND · LINK INSTALL RANK · AWAITING YEAR MAKE MODEL";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = window.setTimeout(() => setN((v) => v + 1), 26);
    return () => window.clearTimeout(t);
  }, [n]);
  return (
    <p className="scan-boot" aria-hidden>
      {text.slice(0, n)}
      <span className="scan-caret">▌</span>
    </p>
  );
}

export function VehicleScan({
  year,
  make,
  model,
  trim,
  modelOptions,
  carReady,
  onYear,
  onMake,
  onModel,
  onTrim,
}: {
  year: string;
  make: string;
  model: string;
  trim: string;
  modelOptions: VehicleModel[];
  carReady: boolean;
  onYear: (value: string) => void;
  onMake: (value: string) => void;
  onModel: (value: string) => void;
  onTrim: (value: string) => void;
}) {
  return (
    <div className="vehicle-scan-fields">
      <div className="scan-brand">
        <span>HARD PP // VEHICLE SCAN</span>
        <span className={cn("scan-lock", carReady && "is-on")}>{carReady ? "SYSTEM READY" : "LOCK-ON"}</span>
      </div>
      <BootLine />
      <fieldset className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Year</span>
          <select className="h-11 w-full rounded-md bg-cloud px-3.5 text-sm font-bold text-fg shadow-border" value={year} onChange={(e) => onYear(e.target.value)}>
            <option value="">Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
            <option value={OTHER}>Older</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Make</span>
          <select className="h-11 w-full rounded-md bg-cloud px-3.5 text-sm font-bold text-fg shadow-border" value={make} onChange={(e) => onMake(e.target.value)}>
            <option value="">Make</option>
            {MAKES.map((mk) => (
              <option key={mk.name} value={mk.name}>
                {mk.name}
              </option>
            ))}
            <option value={OTHER}>Other</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Model</span>
          <select
            className="h-11 w-full rounded-md bg-cloud px-3.5 text-sm font-bold text-fg shadow-border disabled:opacity-50"
            value={model}
            disabled={!make}
            onChange={(e) => onModel(e.target.value)}
          >
            <option value="">{make ? "Model" : "Pick make first"}</option>
            {make === OTHER ? (
              <option value={OTHER}>Other</option>
            ) : (
              modelOptions.map((mod) => (
                <option key={mod.name} value={mod.name}>
                  {mod.name}
                </option>
              ))
            )}
            {make && make !== OTHER ? <option value={OTHER}>Other</option> : null}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Trim</span>
          <Input className="bg-cloud" placeholder="XLT" value={trim} onChange={(e) => onTrim(e.target.value)} />
        </label>
      </fieldset>
    </div>
  );
}
