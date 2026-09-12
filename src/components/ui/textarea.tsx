import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-y rounded-md bg-elevated px-3.5 py-3 text-sm text-fg shadow-border outline-none transition-[box-shadow] duration-150 placeholder:text-subtle focus-visible:shadow-border-hover focus-visible:ring-2 focus-visible:ring-accent/50",
        className,
      )}
      {...props}
    />
  );
}
