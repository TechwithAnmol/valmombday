import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function SwitchScene({ onPulled }) {
  const anchor = [0, 0.78, 0]
  const minLen = 0.9
  const maxLen = 1.9
  const restLen = 1.1

  const ropeRef = useRef(null)
  const bobRef = useRef(null)
  const ringRef = useRef(null)
  const draggingRef = useRef(false)
  const firedRef = useRef(false)
  const pullQualifiedRef = useRef(false)

  const angleRef = useRef(0)
  const angVelRef = useRef(0)
  const lenRef = useRef(restLen)
  const lenVelRef = useRef(0)
  const dragAngleRef = useRef(0)
  const dragLenRef = useRef(restLen)

  const [dragging, setDragging] = useState(false)

  const endDrag = () => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (pullQualifiedRef.current && !firedRef.current) {
      firedRef.current = true
      onPulled?.()
    }
    pullQualifiedRef.current = false
  }

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.035)

    if (draggingRef.current) {
      angleRef.current += (dragAngleRef.current - angleRef.current) * 0.35
      lenRef.current += (dragLenRef.current - lenRef.current) * 0.35
      angVelRef.current = 0
      lenVelRef.current = 0
    } else {
      const gravity = 14
      const damping = 2.8
      const stretchK = 36
      const stretchDamp = 7

      const L = clamp(lenRef.current, minLen, maxLen)
      const angAcc = -(gravity / L) * Math.sin(angleRef.current) - damping * angVelRef.current
      angVelRef.current += angAcc * step
      angleRef.current += angVelRef.current * step

      const lenAcc = -stretchK * (lenRef.current - restLen) - stretchDamp * lenVelRef.current
      lenVelRef.current += lenAcc * step
      lenRef.current = clamp(lenRef.current + lenVelRef.current * step, minLen, maxLen)
    }

    const x = Math.sin(angleRef.current) * lenRef.current
    const y = -Math.cos(angleRef.current) * lenRef.current

    const midX = anchor[0] + x * 0.5
    const midY = anchor[1] + y * 0.5
    const ropeAngle = Math.atan2(x, -y)

    if (ropeRef.current) {
      ropeRef.current.position.set(midX, midY, 0)
      ropeRef.current.scale.y = lenRef.current
      ropeRef.current.rotation.set(0, 0, ropeAngle)
    }
    if (bobRef.current) {
      bobRef.current.position.set(anchor[0] + x, anchor[1] + y, 0)
    }
    if (ringRef.current) {
      ringRef.current.position.set(anchor[0], anchor[1], 0)
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[1.8, 2.8, 3]} intensity={1.15} />

      <mesh ref={ringRef}>
        <torusGeometry args={[0.065, 0.017, 16, 32]} />
        <meshStandardMaterial color="#b8a374" metalness={0.25} roughness={0.35} />
      </mesh>

      <mesh ref={ropeRef}>
        <cylinderGeometry args={[0.022, 0.022, 1, 14]} />
        <meshStandardMaterial color="#f7f3ea" />
      </mesh>

      <mesh
        ref={bobRef}
        onPointerDown={(e) => {
          e.stopPropagation()
          e.target.setPointerCapture(e.pointerId)
          draggingRef.current = true
          setDragging(true)
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          endDrag()
        }}
      >
        <sphereGeometry args={[0.19, 30, 30]} />
        <meshStandardMaterial color="#c9a962" metalness={0.18} roughness={0.42} />
      </mesh>

      <mesh
        position={[0, 0, 0.2]}
        onPointerMove={(e) => {
          if (!draggingRef.current) return
          const dx = e.point.x - anchor[0]
          const dy = e.point.y - anchor[1]
          const nextLen = clamp(Math.hypot(dx, dy), minLen, maxLen)
          const nextAngle = Math.atan2(dx, -dy)
          dragLenRef.current = nextLen
          dragAngleRef.current = nextAngle
          if (nextLen > 1.62) pullQualifiedRef.current = true
        }}
        onPointerUp={endDrag}
      >
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {dragging && (
        <mesh position={[0, -1.55, 0]}>
          <planeGeometry args={[1.55, 0.28]} />
          <meshBasicMaterial color="#2c2420" transparent opacity={0.08} />
        </mesh>
      )}
    </>
  )
}

function PullSwitch3D({ onPulled }) {
  return (
    <div className="pull-switch-wrap">
      <Canvas camera={{ position: [0, 0, 3.6], fov: 40 }}>
        <SwitchScene onPulled={onPulled} />
      </Canvas>
      <p className="pull-switch-text">Pull rope down</p>
    </div>
  )
}

export default PullSwitch3D
