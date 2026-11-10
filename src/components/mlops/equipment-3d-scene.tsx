import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Html,
  Line,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import type { EquipmentStatus } from 'src/types/mlops'
import type { Group } from 'three'
import * as THREE from 'three'

const statusColors: Record<
  EquipmentStatus,
  { metal: string; accent: string; emissive: string }
> = {
  normal: { metal: '#9aa3b2', accent: '#34d399', emissive: '#065f46' },
  warning: { metal: '#b5a574', accent: '#fbbf24', emissive: '#92400e' },
  fault: { metal: '#b08080', accent: '#f87171', emissive: '#7f1d1d' },
  offline: { metal: '#7b8494', accent: '#94a3b8', emissive: '#334155' },
}

function partOpacity(selected: string | null, id: string, hidden: Set<string>) {
  if (hidden.has(id)) return 0
  if (!selected) return 1
  return selected === id ? 1 : 0.22
}

function Gear({
  radius = 0.55,
  teeth = 16,
  thickness = 0.18,
  color,
  ...props
}: {
  radius?: number
  teeth?: number
  thickness?: number
  color: string
} & React.ComponentProps<'group'>) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i / (teeth * 2)) * Math.PI * 2
      const r = i % 2 === 0 ? radius : radius * 0.78
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) s.moveTo(x, y)
      else s.lineTo(x, y)
    }
    s.closePath()
    return s
  }, [radius, teeth])

  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: thickness,
              bevelEnabled: true,
              bevelThickness: 0.02,
              bevelSize: 0.015,
              bevelSegments: 2,
            },
          ]}
        />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, thickness / 2]}>
        <cylinderGeometry args={[radius * 0.22, radius * 0.22, thickness + 0.04, 24]} />
        <meshStandardMaterial color="#1f2430" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function DimensionLine({
  start,
  end,
  label,
  visible,
}: {
  start: [number, number, number]
  end: [number, number, number]
  label: string
  visible: boolean
}) {
  if (!visible) return null
  const mid: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 0.1,
    (start[2] + end[2]) / 2,
  ]
  return (
    <group>
      <Line points={[start, end]} color="#94a3b8" lineWidth={1} />
      <Html position={mid} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="rounded border border-slate-600 bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-slate-200 whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  )
}

function GearboxAssembly({
  status,
  selectedPart,
  hiddenParts,
  showDimensions,
  spinning,
}: {
  status: EquipmentStatus
  selectedPart: string | null
  hiddenParts: Set<string>
  showDimensions: boolean
  spinning: boolean
}) {
  const colors = statusColors[status]
  const bigGear = useRef<Group>(null)
  const smallGear = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!spinning) return
    if (bigGear.current) bigGear.current.rotation.z += delta * 0.55
    if (smallGear.current) smallGear.current.rotation.z -= delta * 0.95
  })

  const mat = (id: string) => ({
    color: selectedPart === id ? colors.accent : colors.metal,
    metalness: 0.7,
    roughness: 0.32,
    transparent: true,
    opacity: partOpacity(selectedPart, id, hiddenParts),
    emissive: selectedPart === id ? colors.emissive : '#000000',
    emissiveIntensity: selectedPart === id ? 0.35 : 0,
  })

  return (
    <group position={[0, 0.15, 0]}>
      <mesh
        position={[0, 0.15, 0]}
        castShadow
        receiveShadow
        visible={partOpacity(selectedPart, 'housing', hiddenParts) > 0}
      >
        <boxGeometry args={[2.6, 1.15, 1.5]} />
        <meshStandardMaterial {...mat('housing')} />
      </mesh>
      <mesh position={[0.05, 0.18, 0.76]}>
        <boxGeometry args={[1.5, 0.75, 0.05]} />
        <meshStandardMaterial color="#0b0e14" transparent opacity={0.85} />
      </mesh>

      <mesh
        position={[0, 0.78, 0]}
        castShadow
        visible={partOpacity(selectedPart, 'cover', hiddenParts) > 0}
      >
        <boxGeometry args={[2.35, 0.12, 1.35]} />
        <meshStandardMaterial {...mat('cover')} />
      </mesh>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x) => (
        <mesh key={x} position={[x, 0.86, 0.45]} visible={!hiddenParts.has('fasteners')}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
          <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      <mesh
        position={[-1.7, 0.15, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        visible={partOpacity(selectedPart, 'input-shaft', hiddenParts) > 0}
      >
        <cylinderGeometry args={[0.12, 0.12, 1.4, 24]} />
        <meshStandardMaterial {...mat('input-shaft')} />
      </mesh>
      <mesh position={[-2.35, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.15, 24]} />
        <meshStandardMaterial
          color={colors.accent}
          metalness={0.5}
          roughness={0.3}
          emissive={colors.emissive}
          emissiveIntensity={0.4}
        />
      </mesh>

      <mesh
        position={[-1.05, 0.15, 0]}
        rotation={[0, 0, Math.PI / 2]}
        visible={partOpacity(selectedPart, 'bearing-front', hiddenParts) > 0}
      >
        <torusGeometry args={[0.2, 0.06, 12, 24]} />
        <meshStandardMaterial {...mat('bearing-front')} />
      </mesh>
      <mesh
        position={[1.05, 0.15, 0]}
        rotation={[0, 0, Math.PI / 2]}
        visible={partOpacity(selectedPart, 'bearing-rear', hiddenParts) > 0}
      >
        <torusGeometry args={[0.18, 0.05, 12, 24]} />
        <meshStandardMaterial {...mat('bearing-rear')} />
      </mesh>

      <group
        ref={bigGear}
        position={[-0.15, 0.15, 0.15]}
        visible={partOpacity(selectedPart, 'gear-set', hiddenParts) > 0}
      >
        <Gear
          radius={0.58}
          teeth={16}
          thickness={0.2}
          color={selectedPart === 'gear-set' ? colors.accent : '#b0b8c6'}
        />
      </group>
      <group
        ref={smallGear}
        position={[0.55, 0.15, 0.15]}
        visible={partOpacity(selectedPart, 'gear-set', hiddenParts) > 0}
      >
        <Gear
          radius={0.34}
          teeth={12}
          thickness={0.16}
          color={selectedPart === 'gear-set' ? colors.accent : '#8e97a8'}
        />
      </group>

      <mesh
        position={[1.7, 0.15, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        visible={partOpacity(selectedPart, 'output-flange', hiddenParts) > 0}
      >
        <cylinderGeometry args={[0.12, 0.12, 1.1, 24]} />
        <meshStandardMaterial {...mat('output-flange')} />
      </mesh>
      <mesh
        position={[2.25, 0.15, 0]}
        rotation={[0, 0, Math.PI / 2]}
        visible={partOpacity(selectedPart, 'output-flange', hiddenParts) > 0}
      >
        <cylinderGeometry args={[0.32, 0.32, 0.12, 24]} />
        <meshStandardMaterial {...mat('output-flange')} />
      </mesh>

      <mesh position={[0.9, 0.85, -0.55]} visible={!hiddenParts.has('sensor-mount')} castShadow>
        <boxGeometry args={[0.35, 0.2, 0.25]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.emissive}
          emissiveIntensity={0.5}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      <mesh position={[1.15, 0.95, 0.55]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={1.2} />
      </mesh>

      <DimensionLine start={[-2.4, 1.15, 0]} end={[2.4, 1.15, 0]} label="246.00" visible={showDimensions} />
      <DimensionLine start={[2.7, -0.35, 0]} end={[2.7, 0.85, 0]} label="127.00" visible={showDimensions} />
      <DimensionLine start={[-2.35, -0.2, 0]} end={[-1.05, -0.2, 0]} label="98.50" visible={showDimensions} />
    </group>
  )
}

export interface Equipment3DViewportProps {
  status: EquipmentStatus
  selectedPart: string | null
  hiddenParts: Set<string>
  showDimensions: boolean
  autoRotateGears?: boolean
  className?: string
}

export function Equipment3DViewport({
  status,
  selectedPart,
  hiddenParts,
  showDimensions,
  autoRotateGears = true,
  className,
}: Equipment3DViewportProps) {
  return (
    <div className={className ?? 'h-full w-full'}>
      <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
        <color attach="background" args={['#0c0f14']} />
        <PerspectiveCamera makeDefault position={[3.8, 2.4, 4.2]} fov={42} />
        <hemisphereLight args={['#c7d2e0', '#1a1f2a', 0.55]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          castShadow
          position={[5, 8, 4]}
          intensity={1.45}
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} />
        <Suspense fallback={null}>
          <GearboxAssembly
            status={status}
            selectedPart={selectedPart}
            hiddenParts={hiddenParts}
            showDimensions={showDimensions}
            spinning={autoRotateGears}
          />
          <ContactShadows position={[0, -0.55, 0]} opacity={0.55} scale={12} blur={2.5} far={4} />
        </Suspense>
        <gridHelper args={[10, 20, '#243044', '#1a2030']} position={[0, -0.55, 0]} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={2.5}
          maxDistance={12}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  )
}
