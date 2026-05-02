import * as React from "react"

import { cn } from "@/lib/utils"

/* Phase 1.2 (A-1-2) v2 Input — h56 / radius 12 / border 1px rgba(0,0,0,0.08) / px 20 / 17/400 / focus border #18181B + ring 2px #18181B/10. */
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
        "h-14 w-full rounded-xl border border-[var(--border-1)] bg-white px-5 text-[17px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-colors",
        "focus-visible:border-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--text-primary)]/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-600 aria-invalid:focus-visible:ring-red-600/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
