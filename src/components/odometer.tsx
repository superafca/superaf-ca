import { cn } from "@/lib/utils";

const DIGITS = "0123456789";

export function Odometer({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const formatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)} aria-label={formatted}>
      {formatted.split("").map((ch, i) => {
        if (ch >= "0" && ch <= "9") {
          const n = Number(ch);
          return (
            <span key={`d-${i}`} className="odo-window">
              <span className="odo-strip" style={{ transform: `translateY(-${n}em)` }}>
                {DIGITS.split("").map((d) => (
                  <span key={d} className="odo-digit">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        }
        return (
          <span key={`s-${i}`} className="odo-static">
            {ch}
          </span>
        );
      })}
    </span>
  );
}