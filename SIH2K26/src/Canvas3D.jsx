import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { oceanicTheme } from './theme'

const Canvas3D = () => {
  useEffect(() => {
    const canvas = document.getElementById('globe-canvas')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId

    const drawGlobe = (time) => {
      ctx.fillStyle = oceanicTheme.colors.canvas.background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 3

      ctx.strokeStyle = oceanicTheme.colors.primary.cyan
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.2

      for (let i = 0; i < 360; i += 30) {
        const angle = (i * Math.PI) / 180
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius * (i / 360), angle, angle + Math.PI * 2, false)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.strokeStyle = oceanicTheme.colors.primary.cyan
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.stroke()

      const particleCount = 50
      ctx.fillStyle = oceanicTheme.colors.primary.cyan
      for (let i = 0; i < particleCount; i++) {
        const angle = (time * 0.0001 + (i / particleCount) * Math.PI * 2) % (Math.PI * 2)
        const distance = radius + Math.sin(time * 0.001 + i) * 20
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        const size = 1 + Math.sin(time * 0.002 + i) * 0.5

        ctx.globalAlpha = 0.6 + Math.sin(time * 0.001 + i) * 0.4
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      const vortexSize = 60 + Math.sin(time * 0.002) * 20
      ctx.strokeStyle = oceanicTheme.colors.secondary.alert
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.7
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        const rotation = (time * 0.003 + i * (Math.PI / 1.5)) % (Math.PI * 2)
        ctx.arc(centerX, centerY, vortexSize + i * 15, rotation, rotation + Math.PI * 1.2)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      ctx.fillStyle = oceanicTheme.colors.secondary.alert
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      animationId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe(0)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas id="globe-canvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: 0 }} />
}

export default Canvas3D
