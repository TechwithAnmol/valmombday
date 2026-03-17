import { useMemo } from 'react'
import { FaStar } from 'react-icons/fa'
import './Sparkles.css'

const COUNT = 18

function Sparkles() {
  const items = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
      size: 6 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
    })),
    []
  )

  return (
    <div className="sparkles" aria-hidden>
      {items.map(({ id, left, top, delay, duration, size, opacity }) => (
        <span
          key={id}
          className="sparkle"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            width: size,
            height: size,
            opacity,
          }}
        >
          <FaStar />
        </span>
      ))}
    </div>
  )
}

export default Sparkles
