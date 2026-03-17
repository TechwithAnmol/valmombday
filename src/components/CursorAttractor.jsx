import { useRef, useEffect, useMemo } from 'react'
import useMousePosition from '../hooks/use-mouse-position'
import './CursorAttractor.css'

const PARTICLE_COUNT = 120
const ATTRACT_STRENGTH = 0.028
const CURSOR_RADIUS = 180

function CursorAttractor({ className = '' }) {
  const containerRef = useRef(null)
  const mouse = useMousePosition()
  const particlesRef = useRef(null)
  const rafRef = useRef(null)

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        baseX: Math.random(),
        baseY: Math.random(),
        size: 8 + Math.random() * 20,
        hue: Math.random() > 0.5 ? 45 : Math.random() > 0.5 ? 15 : 350,
      })),
    []
  )

  useEffect(() => {
    const container = containerRef.current
    const nodes = particlesRef.current
    if (!container || !nodes) return

    const rect = () => container.getBoundingClientRect()

    const tick = () => {
      const r = rect()
      const mx = mouse.x - r.left
      const my = mouse.y - r.top

      particles.forEach((p, i) => {
        const el = nodes[i]
        if (!el) return
        const basePx = p.baseX * r.width
        const basePy = p.baseY * r.height
        const dx = mx - basePx
        const dy = my - basePy
        const dist = Math.hypot(dx, dy) || 1
        const inRange = dist < CURSOR_RADIUS
        const strength = inRange ? ATTRACT_STRENGTH * (1 - dist / CURSOR_RADIUS) : 0
        const vx = basePx + dx * strength
        const vy = basePy + dy * strength
        const half = p.size / 2
        el.style.transform = `translate(${vx - half}px, ${vy - half}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mouse.x, mouse.y, particles])

  return (
    <div ref={containerRef} className={`cursor-attractor ${className}`} aria-hidden>
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            if (!particlesRef.current) particlesRef.current = []
            particlesRef.current[i] = el
          }}
          className="cursor-attractor-particle"
          style={{
            left: 0,
            top: 0,
            width: p.size,
            height: p.size,
            '--particle-hue': p.hue,
          }}
        />
      ))}
    </div>
  )
}

export default CursorAttractor
