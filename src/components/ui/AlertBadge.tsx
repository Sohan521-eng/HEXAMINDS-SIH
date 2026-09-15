import React from "react";
import { cn } from "@/lib/utils";

export type AlertTier = 1 | 2 | 3 | 4 | "watch" | "alert" | "warning" | "landfall" | "ai" | "extreme";

export interface AlertBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tier?: AlertTier;
  pulse?: boolean;
  beacon?: boolean;
}

export const AlertBadge = React.forwardRef<HTMLSpanElement, AlertBadgeProps>(
  ({ className, tier = "watch", pulse, beacon, children, ...props }, ref) => {
    const isStage1 = tier === 1 || tier === "watch";
    const isStage2 = tier === 2 || tier === "alert";
    const isStage3 = tier === 3 || tier === "warning";
    const isStage4 = tier === 4 || tier === "landfall";
    const isAI = tier === "ai";
    const isExtreme = tier === "extreme";
    const hasBeaconEffect = beacon ?? (isStage3 || isStage4 || isExtreme || pulse);

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200",
          // IMD Stage 1: Pre-Cyclone Watch (#10B981)
          isStage1 && "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
          // IMD Stage 2: Cyclone Alert (#F59E0B)
          isStage2 && "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
          // IMD Stage 3: Cyclone Warning (#F97316) with Periodic Beacon Glow
          isStage3 && "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/45 font-bold stage3-warning-beacon drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]",
          // IMD Stage 4: Landfall Red Alert (#DC2626) with Periodic Beacon Glow
          isStage4 && "bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 font-bold stage4-warning-beacon shadow-[0_0_12px_rgba(220,38,38,0.35)]",
          // AI Telemetry Cyan (#00F2FE)
          isAI && "bg-[#00F2FE]/10 text-[#00F2FE] border-[#00F2FE]/40 shadow-[0_0_10px_rgba(0,242,254,0.25)]",
          // Extreme Convective Core (#EF4444)
          isExtreme && "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 font-mono stage4-warning-beacon",
          className
        )}
        {...props}
      >
        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
          {hasBeaconEffect && (
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isStage1 && "bg-[#10B981]",
                isStage2 && "bg-[#F59E0B]",
                isStage3 && "bg-[#F97316]",
                isStage4 && "bg-[#DC2626]",
                isAI && "bg-[#00F2FE]",
                isExtreme && "bg-[#EF4444]"
              )}
            />
          )}
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              isStage1 && "bg-[#10B981]",
              isStage2 && "bg-[#F59E0B]",
              isStage3 && "bg-[#F97316] shadow-[0_0_6px_#F97316,0_0_12px_rgba(249,115,22,0.9)]",
              isStage4 && "bg-[#DC2626] shadow-[0_0_8px_#DC2626,0_0_14px_rgba(220,38,38,0.9)]",
              isAI && "bg-[#00F2FE] shadow-[0_0_6px_#00F2FE]",
              isExtreme && "bg-[#EF4444] shadow-[0_0_8px_#EF4444]"
            )}
          />
        </span>
        {children}
      </span>
    );
  }
);

AlertBadge.displayName = "AlertBadge";
