import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "neon"
    | "outline"
    // 🎨 5-Palette Specific Variants
    | "cyan"            // Palette 1: Cyclone Cyan (#00F2FE)
    | "coral"           // Palette 1: Solar Coral (#FF5E36)
    | "thermal-magenta" // Palette 2: Eyewall (#D946EF)
    | "thermal-core"    // Palette 2: Thermal Peak (#EF4444)
    | "imd-watch"       // Palette 4: Stage 1 Watch (#10B981)
    | "imd-alert"       // Palette 4: Stage 2 Alert (#F59E0B)
    | "imd-warning"     // Palette 4: Stage 3 Warning (#F97316)
    | "imd-landfall"    // Palette 4: Stage 4 Red Alert (#DC2626)
    | "neural-indigo"   // Palette 5: ViT Attention (#6366F1)
    | "neural-mint";    // Palette 5: Detection (#00FFA3)
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors",
          // Default utility styles
          variant === "default" && "bg-slate-800/80 text-slate-200 border border-slate-700",
          variant === "success" && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
          variant === "warning" && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
          variant === "danger" && "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse",
          variant === "neon" && "bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,242,254,0.25)]",
          variant === "outline" && "bg-transparent text-slate-300 border border-slate-700",
          
          // Palette 1 (Oceanic Cyber Abyss)
          variant === "cyan" && "bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/40 shadow-[0_0_10px_rgba(0,242,254,0.25)]",
          variant === "coral" && "bg-[#FF5E36]/10 text-[#FF5E36] border border-[#FF5E36]/40 shadow-[0_0_10px_rgba(255,94,54,0.2)]",

          // Palette 2 (Thermal IR)
          variant === "thermal-magenta" && "bg-[#D946EF]/10 text-[#D946EF] border border-[#D946EF]/40",
          variant === "thermal-core" && "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 font-mono",

          // Palette 4 (IMD 4-Stage Alerts)
          variant === "imd-watch" && "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30",
          variant === "imd-alert" && "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30",
          variant === "imd-warning" && "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/40 font-bold",
          variant === "imd-landfall" && "bg-[#DC2626]/20 text-[#DC2626] border border-[#DC2626]/50 font-bold animate-pulse shadow-[0_0_12px_rgba(220,38,38,0.35)]",

          // Palette 5 (Neural AI Fusion)
          variant === "neural-indigo" && "bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30",
          variant === "neural-mint" && "bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/40 shadow-[0_0_10px_rgba(0,255,163,0.2)]",

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
