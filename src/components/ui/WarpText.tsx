"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Texture } from "ogl";
import "./WarpText.css";

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uRipple;
uniform float uMotion;

in vec2 vUv;
out vec4 fragColor;

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    return vec4(0.0);
  }
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;

  // When not hovered, text remains completely static and pristine!
  if (uPointerActive <= 0.0001) {
    vec4 staticText = sampleText(uv);
    if (staticText.a <= 0.001) {
      discard;
    }
    fragColor = staticText;
    return;
  }

  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;

  // 1. Interactive cursor liquid displacement & ripples
  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);

  vec2 pointerWarp = vec2(0.0);
  float lens = 0.0;
  float ripple = 0.0;

  if (dist < radius) {
    float normDist = dist / radius;
    lens = 0.5 * (1.0 + cos(3.14159265 * normDist)) * uPointerActive;
    ripple = sin(dist * 32.0 - time * 4.5) * (1.0 - normDist) * uRipple * 0.016 * uPointerActive;
    
    vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);
    pointerWarp = -dir * (lens * uPointerStrength * 0.024 + ripple);
  }

  // 2. Liquid wave undulation on hover
  vec2 p = uv * vec2(aspect * 1.2, 1.2) * uWarpScale;
  float t = time * 0.9;
  float w1 = sin(p.x * 2.0 + t + sin(p.y * 1.5 + t * 0.6));
  float w2 = cos(p.y * 2.2 - t * 0.8 + cos(p.x * 1.6 - t * 0.5));
  float w3 = sin((p.x + p.y) * 1.4 + t * 0.7);

  vec2 ambient = vec2(w1 * 0.7 + w3 * 0.3, (w2 * 0.75 + w3 * 0.25) / aspect) * (uWarpStrength * 0.018) * uPointerActive * uMotion;

  vec2 displaced = uv + ambient + pointerWarp;

  // Single clean sample: ZERO ghosting, ZERO red/blue duplicates!
  vec4 text = sampleText(displaced);

  if (text.a <= 0.001) {
    discard;
  }

  // 3. Dynamic glass specular highlights when hovered
  float waveGlint = max(0.0, w1 * 0.6 + w2 * 0.4) * 0.12 * uPointerActive;
  float cursorGlint = (lens * 0.28 + max(0.0, ripple) * 0.15);
  vec3 highlight = vec3(0.3, 0.65, 0.95) * (waveGlint + cursorGlint) * text.a;

  vec3 color = text.rgb + highlight;
  fragColor = vec4(color, text.a);
}
`;

export interface WarpTextProps {
  text?: string;
  color?: string;
  warpStrength?: number;
  warpScale?: number;
  speed?: number;
  pointerInfluence?: number;
  pointerStrength?: number;
  refraction?: number;
  ripple?: boolean;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  letterSpacing?: string | number;
  lineHeight?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
  style?: React.CSSProperties;
}

const getFontValue = (value: string | number) =>
  typeof value === "number" ? `${value}px` : value;

const measureLine = (
  ctx: CanvasRenderingContext2D,
  line: string,
  letterSpacing: number
) => {
  const chars = Array.from(line);
  const textWidth = chars.reduce(
    (width, char) => width + ctx.measureText(char).width,
    0
  );
  return textWidth + Math.max(0, chars.length - 1) * letterSpacing;
};

const drawLine = (
  ctx: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  letterSpacing: number,
  align: "left" | "center" | "right" = "center"
) => {
  const chars = Array.from(line);
  let cursor: number;
  if (align === "left") {
    cursor = x;
  } else if (align === "right") {
    cursor = x - measureLine(ctx, line, letterSpacing);
  } else {
    cursor = x - measureLine(ctx, line, letterSpacing) / 2;
  }

  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor +=
      ctx.measureText(char).width + (index === chars.length - 1 ? 0 : letterSpacing);
  });
};

const buildTextCanvas = ({
  container,
  width,
  height,
  dpr,
  props,
}: {
  container: HTMLElement;
  width: number;
  height: number;
  dpr: number;
  props: Required<Omit<WarpTextProps, "className" | "style">>;
}) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const probe = document.createElement("span");
  probe.textContent = props.text;
  Object.assign(probe.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    whiteSpace: "pre",
    inset: "0 auto auto 0",
    fontFamily: props.fontFamily,
    fontSize: getFontValue(props.fontSize),
    fontWeight: String(props.fontWeight),
    letterSpacing: getFontValue(props.letterSpacing),
    lineHeight:
      typeof props.lineHeight === "number"
        ? String(props.lineHeight)
        : props.lineHeight,
  });
  container.appendChild(probe);
  const computed = window.getComputedStyle(probe);
  let fontSizePx = parseFloat(computed.fontSize) || 14;
  const fontFamily = computed.fontFamily || "sans-serif";
  const fontWeight = computed.fontWeight || String(props.fontWeight);
  let letterSpacing =
    computed.letterSpacing === "normal"
      ? 0
      : parseFloat(computed.letterSpacing) || 0;
  let lineHeight = parseFloat(computed.lineHeight);
  if (!Number.isFinite(lineHeight)) {
    lineHeight =
      fontSizePx *
      (typeof props.lineHeight === "number" ? props.lineHeight : 1.4);
  }
  probe.remove();

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = props.color;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const applyFont = () => {
    ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  };
  applyFont();

  const maxWidth = width * 0.96;
  const maxHeight = height * 0.92;

  // Split into lines with automatic word-wrapping so paragraphs flow cleanly
  const rawLines = String(props.text || "").split("\n");
  const lines: string[] = [];
  rawLines.forEach((rawLine) => {
    const words = rawLine.split(" ");
    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (measureLine(ctx, testLine, letterSpacing) <= maxWidth || !currentLine) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
  });

  const widest = Math.max(
    ...lines.map((line) => measureLine(ctx, line, letterSpacing)),
    1
  );
  const blockHeight = Math.max(lineHeight * lines.length, 1);
  const fit = Math.min(1, maxWidth / widest, maxHeight / blockHeight);

  if (fit < 1) {
    fontSizePx *= fit;
    letterSpacing *= fit;
    lineHeight *= fit;
    applyFont();
  }

  const startY = height / 2 - (lineHeight * (lines.length - 1)) / 2;
  const align = props.align || "center";
  const startX = align === "left" ? 2 : align === "right" ? width - 2 : width / 2;

  lines.forEach((line, index) =>
    drawLine(ctx, line, startX, startY + index * lineHeight, letterSpacing, align)
  );

  return canvas;
};

const syncUniforms = (program: any, props: any) => {
  const uniforms = program.uniforms;
  if (!uniforms) return;
  uniforms.uWarpStrength.value = props.warpStrength;
  uniforms.uWarpScale.value = props.warpScale;
  uniforms.uSpeed.value = props.speed;
  uniforms.uPointerInfluence.value = props.pointerInfluence;
  uniforms.uPointerStrength.value = props.pointerStrength;
  uniforms.uRefraction.value = props.refraction;
  uniforms.uRipple.value = props.ripple ? 1 : 0;
};

export const WarpText: React.FC<WarpTextProps> = ({
  text = "Bend the moment",
  color = "#38BDF8",
  warpStrength = 1.0,
  warpScale = 1.0,
  speed = 0.7,
  pointerInfluence = 0.45,
  pointerStrength = 1.0,
  refraction = 0.8,
  ripple = true,
  fontSize = "clamp(3rem, 10vw, 9rem)",
  fontWeight = 700,
  fontFamily = "inherit",
  letterSpacing = "-0.06em",
  lineHeight = 0.9,
  align = "center",
  className = "",
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const propsRef = useRef({
    text,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    align,
    warpStrength,
    warpScale,
    speed,
    pointerInfluence,
    pointerStrength,
    refraction,
    ripple,
  });
  const contextRef = useRef<any>(null);

  useEffect(() => {
    propsRef.current = {
      text,
      color,
      fontSize,
      fontWeight,
      fontFamily,
      letterSpacing,
      lineHeight,
      align,
      warpStrength,
      warpScale,
      speed,
      pointerInfluence,
      pointerStrength,
      refraction,
      ripple,
    };

    if (contextRef.current) {
      syncUniforms(contextRef.current.program, propsRef.current);
      contextRef.current.rasterize();
    }
  }, [
    text,
    color,
    fontSize,
    fontWeight,
    fontFamily,
    letterSpacing,
    lineHeight,
    align,
    warpStrength,
    warpScale,
    speed,
    pointerInfluence,
    pointerStrength,
    refraction,
    ripple,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return undefined;

    let renderer: any;
    let gl: any;
    let program: any;
    let geometry: any;
    let mesh: any;
    let texture: any;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let raf = 0;
    let disposed = false;
    let contextLost = false;
    let visible = true;
    let pageVisible = !document.hidden;
    let reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let rasterVersion = 0;

    const pointer = {
      x: 0.5,
      y: 0.5,
      tx: 0.5,
      ty: 0.5,
      active: 0,
      activeTarget: 0,
    };
    const startTime = performance.now();

    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        dpr: Math.max(window.devicePixelRatio || 1, 2),
      });
      gl = renderer.gl;
    } catch (error) {
      console.warn("WarpText: WebGL could not be initialized.", error);
      return undefined;
    }

    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);

    texture = new Texture(gl, {
      generateMipmaps: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
    });

    geometry = new Triangle(gl);
    program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTextTexture: { value: texture },
        uResolution: { value: new Float32Array([1, 1]) },
        uPointer: { value: new Float32Array([0.5, 0.5]) },
        uPointerActive: { value: 0 },
        uTime: { value: 0 },
        uWarpStrength: { value: propsRef.current.warpStrength },
        uWarpScale: { value: propsRef.current.warpScale },
        uSpeed: { value: propsRef.current.speed },
        uPointerInfluence: { value: propsRef.current.pointerInfluence },
        uPointerStrength: { value: propsRef.current.pointerStrength },
        uRefraction: { value: propsRef.current.refraction },
        uRipple: { value: propsRef.current.ripple ? 1 : 0 },
        uMotion: { value: reduceMotion ? 0 : 1 },
      },
    });
    mesh = new Mesh(gl, { geometry, program });

    const renderOnce = () => {
      if (disposed || contextLost) return;
      renderer.render({ scene: mesh });
    };

    const rasterize = async () => {
      const version = ++rasterVersion;
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch (error) {
          void error;
        }
      }
      if (disposed || contextLost || version !== rasterVersion) return;

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dpr = Math.max(window.devicePixelRatio || 1, 3.0);
      const textCanvas = buildTextCanvas({
        container,
        width: rect.width,
        height: rect.height,
        dpr,
        props: propsRef.current as any,
      });
      texture.image = textCanvas;
      texture.needsUpdate = true;
      renderOnce();
    };

    const resize = () => {
      if (disposed || contextLost) return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      renderer.dpr = Math.max(window.devicePixelRatio || 1, 2);
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      rasterize();
    };

    const startLoop = () => {
      if (!raf && visible && pageVisible && !disposed && !contextLost) {
        raf = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
      startLoop();
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.activeTarget = 1;
      startLoop();
    };

    const onPointerLeave = () => {
      pointer.activeTarget = 0;
      startLoop();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stopLoop();
    };

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && visible && pointer.activeTarget > 0) startLoop();
      if (!pageVisible) stopLoop();
    };

    const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onReducedMotion = (event: MediaQueryListEvent) => {
      reduceMotion = event.matches;
      program.uniforms.uMotion.value = reduceMotion ? 0 : 1;
      renderOnce();
    };

    const loop = (now: number) => {
      if (disposed || contextLost) return;

      const elapsed = (now - startTime) * 0.001;
      const targetActive = pointer.activeTarget > 0 ? 1 : 0;
      const activeSpeed = pointer.activeTarget > 0 ? 0.14 : 0.08;

      pointer.active += (targetActive - pointer.active) * activeSpeed;
      if (pointer.active < 0.0005) pointer.active = 0;

      if (pointer.activeTarget > 0) {
        pointer.x += (pointer.tx - pointer.x) * 0.18;
        pointer.y += (pointer.ty - pointer.y) * 0.18;
      }

      program.uniforms.uPointer.value[0] = pointer.x;
      program.uniforms.uPointer.value[1] = pointer.y;
      program.uniforms.uPointerActive.value = reduceMotion
        ? pointer.active * 0.35
        : pointer.active;
      program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;

      renderOnce();

      if (pointer.active === 0 && pointer.activeTarget === 0) {
        stopLoop();
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && pageVisible && pointer.activeTarget > 0) {
          startLoop();
        } else if (!visible) {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);

    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    document.addEventListener("visibilitychange", onVisibility);
    mediaQuery?.addEventListener("change", onReducedMotion);

    syncUniforms(program, propsRef.current);
    contextRef.current = { program, rasterize };
    resize();
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      contextRef.current = null;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      mediaQuery?.removeEventListener("change", onReducedMotion);

      if (!contextLost) {
        try {
          if (texture?.texture) gl.deleteTexture(texture.texture);
          geometry?.remove?.();
          program?.remove?.();
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        } catch (error) {
          void error;
        }
      }

      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`warp-text ${className}`.trim()}
      style={style}
      role="img"
      aria-label={text}
    />
  );
};

export default WarpText;
