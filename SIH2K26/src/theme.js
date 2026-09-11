export const oceanicTheme = {
  colors: {
    canvas: {
      background: '#050B14',
      rgb: 'rgb(5, 11, 20)'
    },
    card: {
      surface: '#0F1B2F',
      rgb: 'rgb(15, 27, 47)'
    },
    border: {
      subtle: '#1E3252',
      rgb: 'rgb(30, 50, 82)'
    },
    primary: {
      cyan: '#00F2FE',
      rgb: 'rgb(0, 242, 254)',
      name: 'Electric Cyclone Cyan'
    },
    secondary: {
      alert: '#FF5E36',
      rgb: 'rgb(255, 94, 54)',
      name: 'Storm Eye Alert'
    },
    success: {
      mint: '#10E7A2',
      rgb: 'rgb(16, 231, 162)',
      name: 'Real-Time Confidence Mint'
    },
    text: {
      primary: '#FFFFFF',
      muted: '#8E9EB5'
    }
  },
  shadows: {
    glow: {
      cyan: '0 0 20px rgba(0, 242, 254, 0.3), 0 0 40px rgba(0, 242, 254, 0.15)',
      alert: '0 0 20px rgba(255, 94, 54, 0.3), 0 0 40px rgba(255, 94, 54, 0.15)',
      mint: '0 0 20px rgba(16, 231, 162, 0.3), 0 0 40px rgba(16, 231, 162, 0.15)'
    },
    card: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  glassmorphism: {
    backdrop: 'blur(16px)',
    background: 'rgba(15, 27, 47, 0.7)',
    border: '1px solid rgba(30, 50, 82, 0.5)'
  },
  animations: {
    duration: {
      fast: '0.3s',
      normal: '0.6s',
      slow: '1s',
      verySlow: '2s'
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
  }
}

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: ${oceanicTheme.colors.canvas.background};
    color: ${oceanicTheme.colors.text.primary};
    overflow: hidden;
  }

  #root {
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, ${oceanicTheme.colors.canvas.background} 0%, #0a1422 50%, #050B14 100%);
  }

  @keyframes glow-pulse {
    0%, 100% { filter: drop-shadow(${oceanicTheme.shadows.glow.cyan}); }
    50% { filter: drop-shadow(0 0 30px rgba(0, 242, 254, 0.5), 0 0 60px rgba(0, 242, 254, 0.2)); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes drift {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(10px); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`
