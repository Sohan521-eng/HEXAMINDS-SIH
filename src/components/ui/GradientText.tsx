"use client";

import React from "react";

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  style?: React.CSSProperties;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = "",
  colors = ["#ffffff", "#00f2fe", "#38bdf8", "#10e7a2", "#ffffff"],
  animationSpeed = 6,
  style = {},
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
    ...style,
  };

  return (
    <span className={`animated-gradient-text ${className}`.trim()}>
      <span className="animated-gradient-text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
};

export default GradientText;
