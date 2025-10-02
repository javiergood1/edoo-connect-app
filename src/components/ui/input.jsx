import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles - sin transiciones agresivas
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm outline-none",
        // Text and placeholder styles
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        // File input styles
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Focus styles - transición suave solo en focus
        "focus:border-ring focus:ring-1 focus:ring-ring/20 transition-colors duration-200",
        // Invalid state
        "aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Responsive text size
        "md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Input }
