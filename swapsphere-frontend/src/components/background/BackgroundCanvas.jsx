import { useEffect, useRef, memo } from 'react'

const BLOB_COLORS = [
  'rgba(99, 102, 241, 0.05)',  // Subtle Indigo
  'rgba(168, 85, 247, 0.04)',  // Subtle Purple
  'rgba(56, 189, 248, 0.05)',  // Subtle Cyan
  'rgba(255, 255, 255, 0.03)'   // Soft White
]

class Blob {
  constructor(index, color) {
    this.index = index
    this.color = color
    this.angle = (index / 4) * Math.PI * 2
    // Lively orbital speed so ambient movement is clearly visible
    this.speed = 0.004 + (Math.random() * 0.002) 
    this.x = 0
    this.y = 0
    this.radius = 0
    this.centerX = 0
    this.centerY = 0
    this.orbitX = 0
    this.orbitY = 0
  }

  resize(w, h) {
    this.centerX = w / 2
    this.centerY = h / 2
    this.radius = Math.max(w, h) * 0.85
    this.orbitX = w * 0.38
    this.orbitY = h * 0.38
  }

  update() {
    this.angle += this.speed
    this.x = this.centerX + Math.cos(this.angle) * this.orbitX
    this.y = this.centerY + Math.sin(this.angle * 0.7) * this.orbitY
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Particle {
  constructor(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.size = Math.random() * 2.2 + 1.2
    
    // Soft, non-glaring opacity
    this.opacity = Math.random() * 0.08 + 0.03

    // Continuous smooth upward floating motion
    this.speedY = 0.35 + Math.random() * 0.45
    this.waveAngle = Math.random() * Math.PI * 2
    this.waveSpeed = 0.02 + Math.random() * 0.02
    
    this.vx = 0
    this.vy = 0
  }

  resize(w, h, oldW, oldH) {
    if (oldW === 0 || oldH === 0) return
    this.x = (this.x / oldW) * w
    this.y = (this.y / oldH) * h
  }

  update(mouse, w, h) {
    // Upward drift and subtle horizontal wave motion
    this.y -= this.speedY
    this.waveAngle += this.waveSpeed
    this.x += Math.sin(this.waveAngle) * 0.25

    if (this.y < -10) {
      this.y = h + 10
      this.x = Math.random() * w
    }

    const dx = mouse.x - this.x
    const dy = mouse.y - this.y
    const distSq = dx * dx + dy * dy
    const interactionRadius = 200
    const interactionRadiusSq = interactionRadius * interactionRadius

    if (distSq < interactionRadiusSq && distSq > 0) {
      const dist = Math.sqrt(distSq)
      const force = (interactionRadius - dist) / interactionRadius
      this.vx -= (dx / dist) * force * 0.2
      this.vy -= (dy / dist) * force * 0.2
    }

    this.vx *= 0.92
    this.vy *= 0.92

    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export const BackgroundCanvas = memo(function BackgroundCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId
    let w = window.innerWidth
    let h = window.innerHeight
    let mouse = { x: -1000, y: -1000 }
    let isVisible = true

    const blobs = BLOB_COLORS.map((color, i) => new Blob(i, color))
    const particles = Array.from({ length: 110 }, () => new Particle(w, h))

    const handleResize = () => {
      const oldW = w
      const oldH = h
      w = window.innerWidth
      h = window.innerHeight

      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)

      blobs.forEach(b => b.resize(w, h))
      particles.forEach(p => p.resize(w, h, oldW, oldH))
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible'
      if (isVisible) {
        animate()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    handleResize()

    const animate = () => {
      if (!isVisible) return

      ctx.fillStyle = '#09090B'
      ctx.fillRect(0, 0, w, h)

      blobs.forEach(b => {
        b.update()
        b.draw(ctx)
      })

      particles.forEach(p => {
        p.update(mouse, w, h)
        p.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[-2] pointer-events-none"
        style={{ width: '100vw', height: '100vh', backgroundColor: '#09090B' }}
      />
      {/* Subtle Vignette for Depth */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 250px rgba(0,0,0,0.85)'
        }}
      />
      {/* Subtle animated noise overlay - reduced intensity */}
      <div
        className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  )
})

BackgroundCanvas.displayName = 'BackgroundCanvas'



