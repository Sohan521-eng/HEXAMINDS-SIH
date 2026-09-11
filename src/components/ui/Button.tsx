import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-mono font-bold tracking-wider rounded-lg transition-all duration-200 cursor-pointer select-none active:scale-98 disabled:opacity-50 disabled:pointer-events-none",
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-xs",
          size === "lg" && "px-6 py-3 text-sm",
          variant === "primary" &&
            "bg-[#00F2FE]/15 text-[#00F2FE] border border-[#00F2FE]/40 hover:bg-[#00F2FE]/25 hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]",
          variant === "secondary" &&
            "bg-[#0F1B2F] text-slate-200 border border-[#1E3252] hover:bg-[#16253D] hover:text-white",
          variant === "danger" &&
            "bg-[#FF5E36]/15 text-[#FF5E36] border border-[#FF5E36]/40 hover:bg-[#FF5E36]/25 hover:shadow-[0_0_20px_rgba(255,94,54,0.3)]",
          variant === "outline" &&
            "bg-transparent text-slate-300 border border-[#1E3252] hover:border-[#00F2FE]/40 hover:text-white",
          variant === "ghost" && "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
