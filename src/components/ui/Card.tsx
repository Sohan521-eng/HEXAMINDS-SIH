import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "solid" | "elevated" | "bordered";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-200",
          variant === "glass" &&
            "bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-subtle)] shadow-xl shadow-black/50",
          variant === "elevated" &&
            "bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-lg shadow-black/40",
          variant === "solid" &&
            "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
          variant === "bordered" &&
            "bg-transparent border border-[var(--border-subtle)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
