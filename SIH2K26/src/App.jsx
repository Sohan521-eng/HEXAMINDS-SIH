import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Canvas3D from './Canvas3D'
import { DraggableCard, AnimatedMetric, GlowtextButton, TelemetryHUD, ScanLine } from './components'
import { oceanicTheme, globalStyles } from './theme'
import './App.css'

function App() {
  const [cards, setCards] = useState([
    { id: 'cyclone-1', title: 'Cyclone Track', x: 100, y: 100 },
    { id: 'telemetry-1', title: 'Real-Time Telemetry', x: 450, y: 120 },
    { id: 'confidence-1', title: 'Model Confidence', x: 800, y: 150 },
    { id: 'alerts-1', title: 'Active Alerts', x: 150, y: 450 }
  ])

  const handleCardDragEnd = useCallback((id, info) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id
          ? { ...card, x: card.x + info.offset.x, y: card.y + info.offset.y }
          : card
      )
    )
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: oceanicTheme.colors.canvas.background, overflow: 'hidden' }}>
      <style>{globalStyles}</style>

      <Canvas3D />
      <ScanLine />
      <TelemetryHUD active={true} />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {cards.map(card => (
          <DraggableCard
            key={card.id}
            id={card.id}
            title={card.title}
            initialPosition={{ x: card.x, y: card.y }}
            onDragEnd={handleCardDragEnd}
          >
            {card.id === 'cyclone-1' && (
              <div>
                <AnimatedMetric label="Pressure" value="902" unit="hPa" color="alert" />
                <AnimatedMetric label="Wind Speed" value="185" unit="km/h" color="alert" />
                <AnimatedMetric label="Location" value="14.2°N, 91.8°W" unit="" color="cyan" />
              </div>
            )}
            {card.id === 'telemetry-1' && (
              <div>
                <AnimatedMetric label="Latitude" value="14.28" unit="°" color="cyan" />
                <AnimatedMetric label="Longitude" value="-91.95" unit="°" color="cyan" />
                <AnimatedMetric label="Intensification Rate" value="2.3" unit="hPa/h" color="alert" />
              </div>
            )}
            {card.id === 'confidence-1' && (
              <div>
                <AnimatedMetric label="Track Accuracy" value="96.2" unit="%" color="mint" />
                <AnimatedMetric label="Intensity Forecast" value="94.8" unit="%" color="mint" />
                <AnimatedMetric label="Model Consensus" value="97.1" unit="%" color="mint" />
              </div>
            )}
            {card.id === 'alerts-1' && (
              <div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    padding: '8px',
                    marginBottom: '8px',
                    borderLeft: `3px solid ${oceanicTheme.colors.secondary.alert}`,
                    background: `rgba(255, 94, 54, 0.1)`,
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontSize: '12px', color: oceanicTheme.colors.secondary.alert }}>
                    ⚠ Rapid Intensification Alert
                  </div>
                  <div style={{ fontSize: '11px', color: oceanicTheme.colors.text.muted, marginTop: '4px' }}>
                    Expected to reach Cat 5 in 6 hours
                  </div>
                </motion.div>

                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    padding: '8px',
                    borderLeft: `3px solid ${oceanicTheme.colors.success.mint}`,
                    background: `rgba(16, 231, 162, 0.1)`,
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontSize: '12px', color: oceanicTheme.colors.success.mint }}>
                    ✓ Safe Corridor Active
                  </div>
                  <div style={{ fontSize: '11px', color: oceanicTheme.colors.text.muted, marginTop: '4px' }}>
                    Clear path available for 8 hours
                  </div>
                </motion.div>
              </div>
            )}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <GlowtextButton variant="primary">Track</GlowtextButton>
              <GlowtextButton variant="alert">Alert</GlowtextButton>
            </div>
          </DraggableCard>
        ))}
      </div>

      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          fontSize: '12px',
          color: oceanicTheme.colors.text.muted,
          fontFamily: 'monospace'
        }}
      >
        COMMAND CENTER • SIH2K26 • READY
      </motion.div>
    </div>
  )
}

export default App
