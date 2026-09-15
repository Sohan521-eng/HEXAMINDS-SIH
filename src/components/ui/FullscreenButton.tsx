"use client";

import React, { useEffect, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { gsap } from "gsap";

interface FullscreenButtonProps {
  isFullscreen?: boolean;
  onClick?: () => void;
  className?: string;
  ease?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  isFullscreen = false,
  onClick,
  className = "",
  ease = "power2.easeOut",
}) => {
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const btn = btnRef.current;
      if (!circle || !btn) return;

      const rect = btn.getBoundingClientRect();
      const { width: w, height: h } = rect;
      if (w === 0 || h === 0) return;

      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });

      const label = btn.querySelector(".pill-label");
      const white = btn.querySelector(".pill-label-hover");

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.5, xPercent: -50, duration: 1.6, ease, overwrite: "auto" }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 1.6, ease, overwrite: "auto" }, 0);
      }

      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 1.6, ease, overwrite: "auto" }, 0);
      }

      tlRef.current = tl;
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener("resize", onResize);
  }, [ease, isFullscreen]);

  const handleEnter = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.tweenTo(0, {
      duration: 0.25,
      ease,
      overwrite: "auto",
    });
  };

  const Icon = isFullscreen ? Minimize2 : Maximize2;

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      className={`fullscreen-pill-btn ${isFullscreen ? "is-fullscreen" : ""} ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      title={isFullscreen ? "Minimize View (Esc)" : "Fullscreen View"}
      aria-label={isFullscreen ? "Minimize View (Esc)" : "Fullscreen View"}
    >
      <span
        className="hover-circle"
        aria-hidden="true"
        ref={circleRef}
      />
      <span className="label-stack">
        <span className="pill-label flex items-center gap-1.5 font-rajdhani font-bold text-xs uppercase tracking-wider">
          <Icon className={`w-4 h-4 shrink-0 ${isFullscreen ? "text-[#00F2FE]" : "text-white"}`} />
          {isFullscreen && (
            <>
              <span className="text-white">MINIMIZE</span>
              <span className="text-[10px] font-mono text-[#00F2FE] bg-[#050B14]/80 px-1 py-0.5 rounded border border-[#00F2FE]/40 leading-none">ESC</span>
            </>
          )}
        </span>
        <span className="pill-label-hover flex items-center gap-1.5 font-rajdhani font-bold text-xs uppercase tracking-wider" aria-hidden="true">
          <Icon className="w-4 h-4 text-[#050B14] shrink-0" />
          {isFullscreen && (
            <>
              <span className="text-[#050B14]">MINIMIZE</span>
              <span className="text-[10px] font-mono text-[#050B14]/80 bg-black/20 px-1 py-0.5 rounded border border-black/30 leading-none">ESC</span>
            </>
          )}
        </span>
      </span>
    </button>
  );
};

export default FullscreenButton;
