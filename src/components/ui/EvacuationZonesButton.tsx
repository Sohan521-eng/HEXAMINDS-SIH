"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { gsap } from "gsap";

interface EvacuationZonesButtonProps {
  href?: string;
  className?: string;
  ease?: string;
}

export const EvacuationZonesButton: React.FC<EvacuationZonesButtonProps> = ({
  href = "/alerts",
  className = "",
  ease = "power2.easeOut",
}) => {
  const circleRef = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pillRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const layout = () => {
      const circle = circleRef.current;
      const pill = pillRef.current;
      if (!circle || !pill) return;

      const rect = pill.getBoundingClientRect();
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

      const label = pill.querySelector(".pill-label");
      const white = pill.querySelector(".pill-label-hover");

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      tlRef.current?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.35, xPercent: -50, duration: 1.6, ease, overwrite: "auto" }, 0);

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
  }, [ease]);

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

  return (
    <Link
      ref={pillRef}
      href={href}
      className={`evacuation-pill ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      title="View Coastal Evacuation Zones"
    >
      <span
        className="hover-circle"
        aria-hidden="true"
        ref={circleRef}
      />
      <span className="label-stack">
        <span className="pill-label">
          <ShieldAlert className="w-4 h-4 text-[#00F2FE] shrink-0" />
          <span>Evacuation Zones</span>
        </span>
        <span className="pill-label-hover" aria-hidden="true">
          <ShieldAlert className="w-4 h-4 text-[#050B14] shrink-0" />
          <span>Evacuation Zones</span>
        </span>
      </span>
    </Link>
  );
};

export default EvacuationZonesButton;
