"use client";

import React, { useEffect, useRef, useId } from "react";
import "./ReflectiveCard.css";
import { Fingerprint, Activity, Lock } from "lucide-react";

export interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  fallbackVideoSrc?: string;
  useWebcam?: boolean;
  variant?: "card" | "pill";
  as?: "div" | "button";
  onClick?: () => void;
  title?: string;
  ariaLabel?: string;
}

export const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  blurStrength = 12,
  color = "white",
  metalness = 1,
  roughness = 0.4,
  overlayColor = "rgba(255, 255, 255, 0.1)",
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = "",
  style = {},
  children,
  fallbackVideoSrc = "/hero_video.mp4",
  useWebcam = true,
  variant = "card",
  as = "div",
  onClick,
  title,
  ariaLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reactId = useId().replace(/:/g, "-");
  const filterId = `metallic-displacement-${reactId}`;

  useEffect(() => {
    let stream: MediaStream | null = null;

    // 1. Immediately kick off fallback ambient video so surface reflects living motion instantly
    if (videoRef.current) {
      videoRef.current.src = fallbackVideoSrc;
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }

    // 2. Request webcam stream if enabled for real-time metallic reflections
    if (useWebcam && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.src = "";
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() => {
          // Gracefully continue with fallback ambient video stream
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [fallbackVideoSrc, useWebcam]);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    "--blur-strength": `${blurStrength}px`,
    "--metalness": metalness,
    "--roughness": roughness,
    "--overlay-color": overlayColor,
    "--text-color": color,
    "--saturation": saturation,
  } as React.CSSProperties;

  const Tag = as === "button" ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || title}
      type={as === "button" ? "button" : undefined}
      className={`reflective-card-container variant-${variant} ${className}`}
      style={{ ...style, ...cssVariables }}
    >
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves={2} result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="reflective-video"
        style={{
          filter: `saturate(var(--saturation, 0)) contrast(120%) brightness(110%) blur(var(--blur-strength, 12px)) url(#${filterId})`,
        }}
      />

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        {children ? (
          children
        ) : (
          <>
            <div className="card-header">
              <div className="security-badge">
                <Lock size={14} className="security-icon" />
                <span>SECURE ACCESS</span>
              </div>
              <Activity className="status-icon" size={20} />
            </div>

            <div className="card-body">
              <div className="user-info">
                <h2 className="user-name">ALEXANDER DOE</h2>
                <p className="user-role">SENIOR DEVELOPER</p>
              </div>
            </div>

            <div className="card-footer">
              <div className="id-section">
                <span className="label">ID NUMBER</span>
                <span className="value">8901-2345-6789</span>
              </div>
              <div className="fingerprint-section">
                <Fingerprint size={32} className="fingerprint-icon" />
              </div>
            </div>
          </>
        )}
      </div>
    </Tag>
  );
};

export default ReflectiveCard;
