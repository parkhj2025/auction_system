import * as React from "react"

import { cn } from "@/lib/utils"

/* Phase 0 표준 Input — height 52 / border 1px gray-200 / radius 12 / padding 14-16 / 16px / focus 1.5px ink-900. */
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
        "h-13 w-full rounded-xl border border-[var(--color-ink-200)] bg-white px-4 py-3.5 text-base text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-500)] outline-none transition-colors",
        "focus-visible:border-[var(--color-ink-900)] focus-visible:ring-[1.5px] focus-visible:ring-[var(--color-ink-900)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--color-danger)] aria-invalid:focus-visible:ring-[var(--color-danger)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
