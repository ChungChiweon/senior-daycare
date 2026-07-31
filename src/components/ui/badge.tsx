import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700", className)}>
      {children}
    </span>
  );
}
