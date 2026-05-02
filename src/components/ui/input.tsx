import * as React from "react"

import { cn } from "@/lib/utils"

/* Phase 1.2 (A-1-2) v4 Input — h56 / radius 16 / border 1px rgba(17,20,24,0.08) / px 20 / 17/400 / focus border green #00C853 + ring 4px green/12. */
function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full rounded-2xl border border-[var(--border-1)] bg-white px-5 text-[17px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors",
        "focus-visible:border-[var(--brand-green)] focus-visible:ring-4 focus-visible:ring-[var(--brand-green)]/12",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-600 aria-invalid:focus-visible:ring-red-600/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
