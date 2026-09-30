import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Bubble({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-xl bg-cloud px-4 py-2 text-fg shadow-border",
        className,
      )}
    >
      {children}
    </span>
  );
}
