import { useState, useEffect } from 'react'

export default function useWindowSize() {
  const [size, setSize] = useState({ width: typeof window !== 'undefined' ? window.innerWidth : 1024, height: typeof window !== 'undefined' ? window.innerHeight : 768 })

  useEffect(() => {
    const handle = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  return size
}
