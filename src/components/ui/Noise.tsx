"use client";

import React, { useRef, useEffect } from "react";
import "./Noise.css";

export interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = "",
  style = {},
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;
    const canvasSize = patternSize || 250;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      if (patternScaleX !== 1 || patternScaleY !== 1) {
        canvas.style.transform = `scale(${patternScaleX}, ${patternScaleY})`;
        canvas.style.transformOrigin = "0 0";
      } else {
        canvas.style.transform = "none";
      }
    };

    // Pre-cache 10 randomized noise frames to avoid CPU thrashing across multiple cards
    const cachedFrames: ImageData[] = [];
    for (let f = 0; f < 10; f++) {
      const imgData = ctx.createImageData(canvasSize, canvasSize);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      cachedFrames.push(imgData);
    }

    let frameIdx = 0;
    const loop = () => {
      if (frame % patternRefreshInterval === 0 && cachedFrames.length > 0) {
        ctx.putImageData(cachedFrames[frameIdx % cachedFrames.length], 0, 0);
        frameIdx++;
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      className={`noise-overlay ${className}`}
      ref={grainRef}
      style={{ imageRendering: "pixelated", ...style }}
      aria-hidden="true"
    />
  );
};

export default Noise;
