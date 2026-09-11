"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export interface GlowingRidgesProps {
  layers?: number;
  detail?: number;
  turbulence?: number;
  zoom?: number;
  shiftX?: number;
  shiftY?: number;
  ridgeFrequency?: number;
  ridgePhase?: number;
  density?: number;
  flowSpeed?: number;
  churnSpeed?: number;
  swirl?: number;
  exposure?: number;
  gain?: number;
  colorCycle?: number;
  rotation?: number;
  grain?: number;
  opacity?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  backgroundColor?: string;
  paused?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_layers;
  uniform float u_detail;
  uniform float u_turbulence;
  uniform float u_zoom;
  uniform float u_shiftX;
  uniform float u_shiftY;
  uniform float u_ridgeFrequency;
  uniform float u_ridgePhase;
  uniform float u_density;
  uniform float u_flowSpeed;
  uniform float u_churnSpeed;
  uniform float u_swirl;
  uniform float u_exposure;
  uniform float u_gain;
  uniform float u_colorCycle;
  uniform float u_rotation;
  uniform float u_grain;
  uniform float u_opacity;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_colorC;
  uniform vec3 u_backgroundColor;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p, float octaves) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 8; i++) {
      if (float(i) >= octaves) break;
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  vec3 palette(float t, vec3 c1, vec3 c2, vec3 c3) {
    t = fract(t);
    if (t < 0.5) {
      return mix(c1, c2, t * 2.0);
    } else {
      return mix(c2, c3, (t - 0.5) * 2.0);
    }
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    
    // Rotation
    float rad = radians(u_rotation);
    mat2 rot = mat2(cos(rad), -sin(rad), sin(rad), cos(rad));
    uv = rot * uv;
    
    // Zoom & Viewpoint shift
    uv *= u_zoom;
    uv += vec2(u_shiftX - 0.5, u_shiftY - 0.5);

    float timeFlow = u_time * u_flowSpeed;
    float timeChurn = u_time * u_churnSpeed;

    vec3 accumColor = vec3(0.0);

    for (int i = 1; i <= 15; i++) {
      if (float(i) > u_layers) break;

      float fi = float(i);
      float layerProgress = fi / u_layers;

      vec2 p = uv * (1.0 + layerProgress * 0.28);
      float swirlAngle = u_swirl * 0.08 * fbm(p + vec2(timeChurn * 0.1, fi * 1.3), u_detail);
      mat2 swirlRot = mat2(cos(swirlAngle), -sin(swirlAngle), sin(swirlAngle), cos(swirlAngle));
      p = swirlRot * p;

      float wave = sin(p.x * u_ridgeFrequency * 3.14159 + fi * u_ridgePhase + timeFlow);
      float turb = (fbm(p * 2.2 + vec2(timeFlow, fi), u_detail) - 0.5) * u_turbulence;
      
      float ridgeDist = abs(p.y - wave * 0.35 - turb);
      float ridgeGlow = exp(-ridgeDist * u_density);

      float colorPhase = layerProgress + u_time * u_colorCycle * 0.08;
      vec3 layerCol = palette(colorPhase, u_colorA, u_colorB, u_colorC);

      accumColor += layerCol * ridgeGlow * (0.5 + 0.5 * sin(fi * 0.8 + timeFlow));
    }

    // Tone compression (exposure) & gain
    vec3 glowColor = 1.0 - exp(-accumColor * u_exposure);
    glowColor = pow(max(glowColor, vec3(0.0001)), vec3(1.0 / max(u_gain, 0.01)));

    // Film grain
    if (u_grain > 0.0) {
      float noiseVal = (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * u_grain;
      glowColor += noiseVal;
    }

    // Iridescent light raking across dark surface
    vec3 composite = u_backgroundColor + glowColor * u_opacity;

    gl_FragColor = vec4(clamp(composite, 0.0, 1.0), 1.0);
  }
`;

export const GlowingRidges: React.FC<GlowingRidgesProps> = ({
  layers = 12,
  detail = 5,
  turbulence = 0.6,
  zoom = 1.1,
  shiftX = 0.45,
  shiftY = 0.5,
  ridgeFrequency = 1.2,
  ridgePhase = 2,
  density = 8,
  flowSpeed = 0.12,
  churnSpeed = 1,
  swirl = 16,
  exposure = 0.65,
  gain = 1.6,
  colorCycle = 0.4,
  rotation = 0,
  grain = 0.16,
  opacity = 0.85,
  colorA = "#00F2FE",
  colorB = "#38BDF8",
  colorC = "#C026D3",
  backgroundColor = "#050B14",
  paused = false,
  className = "",
  children,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const getDims = () => {
      const w = (container && container.clientWidth > 0) ? container.clientWidth : (typeof window !== "undefined" ? window.innerWidth : 1920);
      const h = (container && container.clientHeight > 0) ? container.clientHeight : (typeof window !== "undefined" ? window.innerHeight : 1080);
      return { w, h };
    };

    const { w, h } = getDims();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    camera.position.z = 1;

    const parseColor = (hex: string) => {
      try {
        return new THREE.Color(hex);
      } catch {
        return new THREE.Color("#00F2FE");
      }
    };

    const uniforms = {
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(w, h) },
      u_layers: { value: layers },
      u_detail: { value: detail },
      u_turbulence: { value: turbulence },
      u_zoom: { value: zoom },
      u_shiftX: { value: shiftX },
      u_shiftY: { value: shiftY },
      u_ridgeFrequency: { value: ridgeFrequency },
      u_ridgePhase: { value: ridgePhase },
      u_density: { value: density },
      u_flowSpeed: { value: flowSpeed },
      u_churnSpeed: { value: churnSpeed },
      u_swirl: { value: swirl },
      u_exposure: { value: exposure },
      u_gain: { value: gain },
      u_colorCycle: { value: colorCycle },
      u_rotation: { value: rotation },
      u_grain: { value: grain },
      u_opacity: { value: opacity },
      u_colorA: { value: parseColor(colorA) },
      u_colorB: { value: parseColor(colorB) },
      u_colorC: { value: parseColor(colorC) },
      u_backgroundColor: { value: parseColor(backgroundColor) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!pausedRef.current) {
        uniforms.u_time.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const { w: newW, h: newH } = getDims();
      renderer.setSize(newW, newH);
      uniforms.u_resolution.value.set(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    layers,
    detail,
    turbulence,
    zoom,
    shiftX,
    shiftY,
    ridgeFrequency,
    ridgePhase,
    density,
    flowSpeed,
    churnSpeed,
    swirl,
    exposure,
    gain,
    colorCycle,
    rotation,
    grain,
    opacity,
    colorA,
    colorB,
    colorC,
    backgroundColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none block"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export default GlowingRidges;
