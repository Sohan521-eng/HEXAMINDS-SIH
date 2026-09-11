import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { oceanicTheme } from './theme'

export const DraggableCard = ({ id, title, children, onDragEnd, initialPosition = { x: 0, y: 0 } }) => {
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef(null)

  return (
    <motion.div
      ref={constraintsRef}
      drag
      dragElastic={0.2}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        onDragEnd?.(id, info)
      }}
      initial={initialPosition}
      animate={{
        boxShadow: isDragging
          ? `0 20px 60px rgba(0, 242, 254, 0.4)`
          : oceanicTheme.shadows.glow.cyan
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        background: oceanicTheme.glassmorphism.background,
        backdropFilter: oceanicTheme.glassmorphism.backdrop,
        border: oceanicTheme.glassmorphism.border,
        borderRadius: '12px',
        padding: '20px',
        minWidth: '320px',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'absolute',
        zIndex: isDragging ? 50 : 10
      }}
    >
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: `1px solid ${oceanicTheme.colors.border.subtle}`
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: oceanicTheme.colors.primary.cyan }}>
          {title}
        </h3>
        <motion.div
          animate={{
            rotate: isDragging ? 180 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '12px', color: oceanicTheme.colors.text.muted }}
        >
          ⋮
        </motion.div>
      </motion.div>
      <div>{children}</div>
    </motion.div>
  )
}

export const AnimatedMetric = ({ label, value, unit, color = 'cyan', animated = true }) => {
  const colorMap = {
    cyan: oceanicTheme.colors.primary,
    alert: oceanicTheme.colors.secondary,
    mint: oceanicTheme.colors.success
  }

  const selectedColor = colorMap[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: '12px' }}
    >
      <div style={{ fontSize: '12px', color: oceanicTheme.colors.text.muted, marginBottom: '4px' }}>
        {label}
      </div>
      <motion.div
        animate={animated ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: selectedColor.cyan,
          textShadow: `0 0 10px ${selectedColor.cyan}`,
          fontFamily: 'monospace'
        }}
      >
        {value}
        <span style={{ fontSize: '14px', marginLeft: '4px', color: oceanicTheme.colors.text.muted }}>
          {unit}
        </span>
      </motion.div>
    </motion.div>
  )
}

export const GlowtextButton = ({ children, onClick, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    primary: {
      color: oceanicTheme.colors.primary.cyan,
      border: `2px solid ${oceanicTheme.colors.primary.cyan}`,
      glow: oceanicTheme.shadows.glow.cyan
    },
    alert: {
      color: oceanicTheme.colors.secondary.alert,
      border: `2px solid ${oceanicTheme.colors.secondary.alert}`,
      glow: oceanicTheme.shadows.glow.alert
    },
    success: {
      color: oceanicTheme.colors.success.mint,
      border: `2px solid ${oceanicTheme.colors.success.mint}`,
      glow: oceanicTheme.shadows.glow.mint
    }
  }

  const selectedVariant = variants[variant]

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        boxShadow: isHovered ? selectedVariant.glow : 'none',
        scale: isHovered ? 1.05 : 1
      }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'transparent',
        color: selectedVariant.color,
        border: selectedVariant.border,
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.3s ease'
      }}
    >
      {children}
    </motion.button>
  )
}

export const TelemetryHUD = ({ active = true }) => {
  return (
    <motion.div
      animate={{ opacity: active ? 1 : 0.5 }}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        display: 'flex',
        gap: '12px',
        zIndex: 100
      }}
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: oceanicTheme.colors.primary.cyan,
            boxShadow: oceanicTheme.shadows.glow.cyan
          }}
        />
      ))}
    </motion.div>
  )
}

export const ScanLine = () => {
  return (
    <motion.div
      animate={{ y: ['0%', '100%'] }}
      transition={{ duration: 3, repeat: Infinity }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${oceanicTheme.colors.primary.cyan}, transparent)`,
        boxShadow: oceanicTheme.shadows.glow.cyan,
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  )
}
