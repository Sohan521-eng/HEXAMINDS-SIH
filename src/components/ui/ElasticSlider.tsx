"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import "./ElasticSlider.css";

const MAX_OVERFLOW = 50;

function decay(value: number, max: number): number {
  if (max === 0) return 0;
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

export interface ElasticSliderProps {
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  startingValue?: number;
  maxValue?: number;
  className?: string;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showValueIndicator?: boolean;
  showThumb?: boolean;
}

export function ElasticSlider({
  defaultValue = 50,
  value: controlledValue,
  onChange,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon,
  rightIcon,
  showValueIndicator = false,
  showThumb = true,
}: ElasticSliderProps) {
  return (
    <div className={`elastic-slider-container ${className}`}>
      <Slider
        defaultValue={defaultValue}
        value={controlledValue}
        onChange={onChange}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        showValueIndicator={showValueIndicator}
        showThumb={showThumb}
      />
    </div>
  );
}

interface SliderInternalProps {
  defaultValue: number;
  value?: number;
  onChange?: (value: number) => void;
  startingValue: number;
  maxValue: number;
  isStepped: boolean;
  stepSize: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showValueIndicator: boolean;
  showThumb: boolean;
}

function Slider({
  defaultValue,
  value: controlledValue,
  onChange,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  showValueIndicator,
  showThumb,
}: SliderInternalProps) {
  const [internalValue, setInternalValue] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  );
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [region, setRegion] = useState<"middle" | "left" | "right">("middle");
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  // Sync with controlled value prop if provided
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const activeVal = controlledValue !== undefined ? controlledValue : internalValue;

  useMotionValueEvent(clientX, "change", (latest) => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue = 0;

      if (latest < left) {
        setRegion("left");
        newValue = left - latest;
      } else if (latest > right) {
        setRegion("right");
        newValue = latest - right;
      } else {
        setRegion("middle");
        newValue = 0;
      }

      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sliderRef.current && (e.buttons > 0 || e.pointerType === "touch")) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      if (width === 0) return;
      let newValue =
        startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);

      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }

      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setInternalValue(newValue);
      onChange?.(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      if (width > 0) {
        let newValue =
          startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);

        if (isStepped) {
          newValue = Math.round(newValue / stepSize) * stepSize;
        }

        newValue = Math.min(Math.max(newValue, startingValue), maxValue);
        setInternalValue(newValue);
        onChange?.(newValue);
        clientX.jump(e.clientX);
      }
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
    setRegion("middle");
  };

  const getRangePercentage = () => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return Math.max(0, Math.min(100, ((activeVal - startingValue) / totalRange) * 100));
  };

  const pct = getRangePercentage();

  return (
    <>
      <motion.div
        onHoverStart={() => animate(scale, 1.15)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.15)}
        onTouchEnd={() => animate(scale, 1)}
        style={{
          opacity: useTransform(scale, [1, 1.15], [0.85, 1]),
        }}
        className="elastic-slider-wrapper"
      >
        {leftIcon && (
          <motion.div
            animate={{
              scale: region === "left" ? [1, 1.3, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: useTransform(
                () => (region === "left" ? -overflow.get() / scale.get() : 0)
              ),
            }}
            className="shrink-0 flex items-center justify-center cursor-pointer"
          >
            {leftIcon}
          </motion.div>
        )}

        <div
          ref={sliderRef}
          className="elastic-slider-root"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onLostPointerCapture={handlePointerUp}
        >
          <motion.div
            style={{
              scaleX: useTransform(() => {
                if (sliderRef.current) {
                  const { width } = sliderRef.current.getBoundingClientRect();
                  return width > 0 ? 1 + overflow.get() / width : 1;
                }
                return 1;
              }),
              scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              transformOrigin: useTransform(() => {
                if (sliderRef.current) {
                  const { left, width } = sliderRef.current.getBoundingClientRect();
                  return clientX.get() < left + width / 2 ? "right" : "left";
                }
                return "center";
              }),
              height: useTransform(scale, [1, 1.15], [6, 10]),
              marginTop: useTransform(scale, [1, 1.15], [0, -2]),
              marginBottom: useTransform(scale, [1, 1.15], [0, -2]),
            }}
            className="elastic-slider-track-wrapper"
          >
            <div className="elastic-slider-track">
              <div
                className="elastic-slider-range"
                style={{ width: `${pct}%` }}
              />
            </div>
            {showThumb && (
              <div
                className="elastic-slider-thumb"
                style={{ left: `${pct}%` }}
              />
            )}
          </motion.div>
        </div>

        {rightIcon && (
          <motion.div
            animate={{
              scale: region === "right" ? [1, 1.3, 1] : 1,
              transition: { duration: 0.25 },
            }}
            style={{
              x: useTransform(
                () => (region === "right" ? overflow.get() / scale.get() : 0)
              ),
            }}
            className="shrink-0 flex items-center justify-center cursor-pointer"
          >
            {rightIcon}
          </motion.div>
        )}
      </motion.div>
      {showValueIndicator && (
        <p className="elastic-slider-value-indicator">{Math.round(activeVal)}</p>
      )}
    </>
  );
}

export default ElasticSlider;
