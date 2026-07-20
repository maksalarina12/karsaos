import confetti from 'canvas-confetti'

const BRAND_COLORS = ['#FF6B35', '#7A9B76', '#E8A33D', '#C1502E', '#FFF8F0']

export function celebrate() {
  const end = Date.now() + 700

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: BRAND_COLORS,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: BRAND_COLORS,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }

  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: BRAND_COLORS,
  })
  frame()
}
