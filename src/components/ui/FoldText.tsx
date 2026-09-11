"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type HingeDirection = "top" | "bottom" | "left" | "right";
export type SplitByType = "char" | "word" | "line";
export type TriggerType = "mount" | "hover" | "scroll" | "loop";

const HINGE_CONFIG = {
  top: { origin: "50% 0%", rotateX: -85, rotateY: 0 },
  bottom: { origin: "50% 100%", rotateX: 85, rotateY: 0 },
  left: { origin: "0% 50%", rotateX: 0, rotateY: 85 },
  right: { origin: "100% 50%", rotateX: 0, rotateY: -85 },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const renderWhitespace = (value: string, key: string) =>
  value.split(/(\n)/).map((part, index) => {
    if (part === "\n") return <br key={`${key}-br-${index}`} />;
    if (!part) return null;

    return (
      <span className="fold-text-whitespace" key={`${key}-space-${index}`}>
        {part.replace(/ /g, "\u00A0")}
      </span>
    );
  });

export interface FoldTextProps {
  text?: string;
  splitBy?: SplitByType;
  hinge?: HingeDirection;
  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;
  trigger?: TriggerType;
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
  solidColor?: string;
  solidWords?: string[];
  className?: string;
  style?: React.CSSProperties;
  gradientColors?: string[];
  gradientSpeed?: number;
}

export const FoldText: React.FC<FoldTextProps> = ({
  text = "Design unfolds",
  splitBy = "char",
  hinge = "top",
  duration = 0.65,
  stagger = 0.045,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,
  trigger = "mount",
  fontSize = "inherit",
  fontWeight = "inherit",
  color = "#f7f2e8",
  solidColor = "#FFFFFF",
  solidWords,
  className = "",
  style = {},
  gradientColors,
  gradientSpeed = 5,
}) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hingeConfig = HINGE_CONFIG[hinge] || HINGE_CONFIG.top;
  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  const segments = useMemo(() => {
    let segmentIndex = 0;

    const renderSegment = (
      content: React.ReactNode,
      key: string,
      split: SplitByType = splitBy,
      isSolidWord: boolean = false
    ) => {
      segmentIndex += 1;
      const isGradient = !isSolidWord && Boolean(gradientColors && gradientColors.length > 0);
      return (
        <span
          className="fold-text-segment"
          data-fold-split={split}
          key={key}
          style={{ "--fold-perspective": `${safePerspective}px` } as React.CSSProperties}
        >
          <span
            className="fold-text-piece"
            data-fold-hinge={hinge}
            style={
              {
                transformOrigin: hingeConfig.origin,
              } as React.CSSProperties
            }
          >
            <span
              className={`fold-text-content ${isGradient ? "has-gradient" : "is-solid"}`}
              style={
                !isGradient
                  ? ({
                      color: solidColor || "var(--fold-solid-color, #FFFFFF)",
                      WebkitTextFillColor: solidColor || "var(--fold-solid-color, #FFFFFF)",
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {content || "\u00A0"}
            </span>
          </span>
        </span>
      );
    };

    if (splitBy === "line") {
      return text.split("\n").map((line, index) => (
        <span className="fold-text-line" key={`line-${index}`}>
          {renderSegment(line || "\u00A0", `segment-line-${index}`, "line")}
        </span>
      ));
    }

    if (splitBy === "word") {
      return text.split(/(\s+)/).flatMap((part, index) => {
        if (!part) return [];
        if (/^\s+$/.test(part)) {
          return (
            <span key={`ws-${index}`} className="fold-text-whitespace">
              {"\u00A0"}
            </span>
          );
        }
        const cleanWord = part.trim();
        const isSolid = Boolean(
          solidWords && solidWords.some((sw) => sw.toUpperCase() === cleanWord.toUpperCase())
        );
        return renderSegment(part, `segment-word-${segmentIndex}`, splitBy, isSolid);
      });
    }

    const lines = text.split("\n");
    return lines.flatMap((line, lineIndex) => {
      const words = line.split(/(\s+)/);
      const lineElements = words.flatMap((part, partIndex) => {
        if (!part) return [];
        if (/^\s+$/.test(part)) {
          return (
            <span key={`ws-${lineIndex}-${partIndex}`} className="fold-text-whitespace">
              {"\u00A0"}
            </span>
          );
        }
        const cleanWord = part.trim();
        const isSolid = Boolean(
          solidWords && solidWords.some((sw) => sw.toUpperCase() === cleanWord.toUpperCase())
        );
        return (
          <span
            key={`word-${lineIndex}-${partIndex}`}
            className="fold-text-word"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {Array.from(part).map((char, charIndex) =>
              renderSegment(
                char,
                `segment-char-${lineIndex}-${partIndex}-${charIndex}`,
                splitBy,
                isSolid
              )
            )}
          </span>
        );
      });

      if (lineIndex < lines.length - 1) {
        return [...lineElements, <br key={`br-${lineIndex}`} />];
      }
      return lineElements;
    });
  }, [
    text,
    splitBy,
    hinge,
    hingeConfig.origin,
    safePerspective,
    gradientColors,
    solidWords,
    solidColor,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    if (!root) return undefined;

    const pieces = Array.from(root.querySelectorAll<HTMLElement>(".fold-text-piece"));
    if (!pieces.length) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const activeDuration = reduceMotion ? Math.min(duration, 0.22) : duration;
    const activeStagger = reduceMotion ? Math.min(stagger, 0.02) : stagger;

    const updateGradientMapping = () => {
      const root = rootRef.current;
      if (!root) return;
      const rootRect = root.getBoundingClientRect();
      if (!rootRect.width) return;

      const lineWidth = Math.max(rootRect.width || root.offsetWidth || 1, 100);
      root.style.setProperty("--line-width", `${Math.round(lineWidth)}px`);
      root.style.setProperty("--line-bg-width", `${Math.round(lineWidth * 2.5)}px`);

      const segments = root.querySelectorAll<HTMLElement>(".fold-text-segment");
      segments.forEach((segment) => {
        const segRect = segment.getBoundingClientRect();
        const offsetLeft = segRect.left - rootRect.left;
        segment.style.setProperty("--char-offset", `${Math.round(offsetLeft)}px`);
      });
    };

    updateGradientMapping();
    const frameId = requestAnimationFrame(updateGradientMapping);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        updateGradientMapping();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      updateGradientMapping();
    });
    resizeObserver.observe(root);

    const killTimeline = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.killTweensOf(pieces);
    };

    const play = (repeat: boolean) => {
      killTimeline();

      const tl = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: repeat ? 0.75 : 0,
        onComplete: () => {
          updateGradientMapping();
        },
      });
      timelineRef.current = tl;

      tl.fromTo(
        pieces,
        {
          opacity: 0,
          rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
          rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
          filter: reduceMotion ? "brightness(1)" : `brightness(${Math.max(0.35, 1 - safeCrease * 0.45)})`,
          transformOrigin: hingeConfig.origin,
          force3D: true,
        },
        {
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          filter: "brightness(1)",
          duration: activeDuration,
          ease: ease || "back.out(1.5)",
          stagger: activeStagger,
          clearProps: "transform,filter,willChange",
        }
      );
      return tl;
    };

    let scrollTrigger: ScrollTrigger | undefined;
    let hoverHandler: (() => void) | undefined;

    if (trigger === "hover") {
      gsap.set(pieces, {
        opacity: 1,
        rotateX: 0,
        rotateY: 0,
        filter: "brightness(1)",
        transformOrigin: hingeConfig.origin,
      });
      hoverHandler = () => {
        if (!timelineRef.current || !timelineRef.current.isActive()) {
          play(false);
        }
      };
      root.addEventListener("mouseenter", hoverHandler);
    } else if (trigger === "scroll") {
      gsap.set(pieces, {
        opacity: 0,
        rotateX: reduceMotion ? 0 : hingeConfig.rotateX,
        rotateY: reduceMotion ? 0 : hingeConfig.rotateY,
        filter: reduceMotion ? "brightness(1)" : `brightness(${Math.max(0.35, 1 - safeCrease * 0.45)})`,
        transformOrigin: hingeConfig.origin,
        force3D: true,
      });
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: () => play(false),
      });
    } else if (trigger === "loop") {
      play(true);
    } else {
      // "mount" (default): Only animates once when the page is opened. Never on hover.
      play(false);
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (hoverHandler) root.removeEventListener("mouseenter", hoverHandler);
      scrollTrigger?.kill();
      killTimeline();
    };
  }, [
    text,
    splitBy,
    hinge,
    duration,
    stagger,
    ease,
    perspective,
    safeCrease,
    trigger,
    hingeConfig.origin,
    hingeConfig.rotateX,
    hingeConfig.rotateY,
  ]);

  const rootStyle: React.CSSProperties = {
    ["--fold-text-font-size" as any]:
      typeof fontSize === "number" ? `${fontSize}px` : fontSize,
    ["--fold-text-font-weight" as any]: fontWeight,
    ["--fold-text-color" as any]: color,
    ["--fold-solid-color" as any]: solidColor || "#FFFFFF",
    ...(gradientColors && gradientColors.length > 0
      ? {
          ["--fold-gradient-image" as any]: `linear-gradient(90deg, ${gradientColors.join(", ")})`,
          ["--fold-gradient-speed" as any]: `${gradientSpeed}s`,
        }
      : {}),
    ...style,
  };

  return (
    <span ref={rootRef} className={`fold-text ${className}`.trim()} style={rootStyle}>
      <span className="fold-text-sr-only">{text}</span>
      <span className="fold-text-visual" aria-hidden="true">
        {segments}
      </span>
    </span>
  );
};

export default FoldText;
