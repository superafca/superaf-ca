import { cn } from "@/lib/utils";

export function SelectedHeart({ on, className }: { on: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width="36"
      height="36"
      aria-hidden
      className={cn(
        "inline-block shrink-0 transition-transform duration-200",
        on ? "scale-100 opacity-100" : "scale-75 opacity-0",
        className,
      )}
    >
      <path
        d="M32 54C32 54 8 38.5 8 24.5 8 16.5 14 12 21 12c4.2 0 7.4 2.2 11 6.4C35.6 14.2 38.8 12 43 12c7 0 13 4.5 13 12.5C56 38.5 32 54 32 54z"
        fill={on ? "#e10600" : "transparent"}
      />
    </svg>
  );
}

export function HeartEyes({ live, burst }: { live: boolean; burst: number }) {
  return <SelectedHeart on={live} />;
}

export function MoneyFace({ live }: { live: boolean; burst?: number }) {
  return <SelectedHeart on={live} />;
}

export function BigCheck({ on, className }: { on: boolean; className?: string }) {
  return <SelectedHeart on={on} className={className} />;
}
