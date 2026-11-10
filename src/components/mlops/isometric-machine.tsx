import type { EquipmentStatus } from 'src/types/mlops'
import { cn } from '@/lib/utils'

const palette: Record<
  EquipmentStatus,
  { top: string; left: string; right: string; accent: string; glow: string }
> = {
  normal: {
    top: '#34d399',
    left: '#059669',
    right: '#10b981',
    accent: '#a7f3d0',
    glow: 'rgba(52,211,153,0.45)',
  },
  warning: {
    top: '#fbbf24',
    left: '#d97706',
    right: '#f59e0b',
    accent: '#fde68a',
    glow: 'rgba(251,191,36,0.45)',
  },
  fault: {
    top: '#f87171',
    left: '#b91c1c',
    right: '#ef4444',
    accent: '#fecaca',
    glow: 'rgba(248,113,113,0.55)',
  },
  offline: {
    top: '#a1a1aa',
    left: '#52525b',
    right: '#71717a',
    accent: '#d4d4d8',
    glow: 'rgba(113,113,122,0.35)',
  },
}

type ColorSet = (typeof palette)[EquipmentStatus]

interface Props {
  type: string
  status: EquipmentStatus
  selected?: boolean
  className?: string
}

/** 설비 유형별 아이소메트릭(2.5D) SVG */
export function IsometricMachine({ type, status, selected, className }: Props) {
  const c = palette[status]

  return (
    <svg
      viewBox="0 0 120 110"
      className={cn('w-[96px] h-[88px] drop-shadow-md transition-transform', className)}
      style={{ filter: selected ? `drop-shadow(0 0 10px ${c.glow})` : undefined }}
      aria-hidden
    >
      <ellipse cx="60" cy="98" rx="36" ry="8" fill="rgba(0,0,0,0.28)" />
      <MachineBody type={type} c={c} />
      <circle cx="98" cy="18" r="5" fill={c.top} stroke="#0a0a0a" strokeWidth="1" />
      <circle cx="98" cy="18" r="2.5" fill={c.accent} />
    </svg>
  )
}

function MachineBody({ type, c }: { type: string; c: ColorSet }) {
  switch (type) {
    case '프레스':
      return <PressShape c={c} />
    case '용접':
      return <WeldShape c={c} />
    case '절삭':
    case '가공':
      return <CncShape c={c} />
    case '검사':
      return <VisionShape c={c} />
    case '포장':
      return <PackShape c={c} />
    case '성형':
      return <InjectionShape c={c} />
    case '도장':
      return <PaintShape c={c} />
    case '이송':
      return <ConveyorShape c={c} />
    case '조립':
    default:
      return <StationShape c={c} />
  }
}

function IsoBox({
  x,
  y,
  w,
  h,
  d,
  c,
}: {
  x: number
  y: number
  w: number
  h: number
  d: number
  c: ColorSet
}) {
  const top = `${x},${y} ${x + w},${y - w * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5} ${x + d},${y + d * 0.5}`
  const left = `${x},${y} ${x + d},${y + d * 0.5} ${x + d},${y + d * 0.5 + h} ${x},${y + h}`
  const right = `${x + d},${y + d * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5} ${x + w + d},${y - w * 0.5 + d * 0.5 + h} ${x + d},${y + d * 0.5 + h}`

  return (
    <g>
      <polygon points={top} fill={c.top} stroke="#0a0a0a" strokeWidth="0.6" />
      <polygon points={left} fill={c.left} stroke="#0a0a0a" strokeWidth="0.6" />
      <polygon points={right} fill={c.right} stroke="#0a0a0a" strokeWidth="0.6" />
    </g>
  )
}

function PressShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={28} y={70} w={34} h={14} d={22} c={c} />
      <IsoBox x={36} y={48} w={22} h={22} d={14} c={c} />
      <IsoBox x={42} y={30} w={12} h={10} d={8} c={{ ...c, top: c.accent, right: c.top }} />
      <IsoBox
        x={32}
        y={52}
        w={4}
        h={18}
        d={4}
        c={{ ...c, top: '#cbd5e1', left: '#64748b', right: '#94a3b8' }}
      />
      <IsoBox
        x={58}
        y={46}
        w={4}
        h={18}
        d={4}
        c={{ ...c, top: '#cbd5e1', left: '#64748b', right: '#94a3b8' }}
      />
    </g>
  )
}

function WeldShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={34} y={72} w={24} h={10} d={18} c={c} />
      <IsoBox x={44} y={52} w={10} h={20} d={10} c={c} />
      <polygon points="54,42 78,30 82,34 58,46" fill={c.right} stroke="#0a0a0a" strokeWidth="0.6" />
      <polygon points="78,30 86,28 90,32 82,34" fill={c.top} stroke="#0a0a0a" strokeWidth="0.6" />
      <circle cx="88" cy="30" r="3" fill={c.accent} stroke="#0a0a0a" strokeWidth="0.5" />
      <path d="M88 26 Q92 18 86 14" stroke={c.accent} strokeWidth="1.4" fill="none" opacity="0.85" />
    </g>
  )
}

function StationShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={26} y={74} w={40} h={8} d={26} c={c} />
      <IsoBox x={34} y={50} w={24} h={18} d={16} c={c} />
      <IsoBox x={40} y={36} w={12} h={8} d={8} c={{ ...c, top: c.accent }} />
    </g>
  )
}

function CncShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={24} y={74} w={42} h={12} d={28} c={c} />
      <IsoBox x={30} y={48} w={30} h={20} d={20} c={c} />
      <IsoBox
        x={40}
        y={32}
        w={14}
        h={12}
        d={10}
        c={{ ...c, top: '#cbd5e1', left: '#64748b', right: '#94a3b8' }}
      />
      <line x1="50" y1="44" x2="50" y2="58" stroke={c.accent} strokeWidth="2" />
    </g>
  )
}

function VisionShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={30} y={76} w={32} h={8} d={22} c={c} />
      <IsoBox
        x={42}
        y={50}
        w={8}
        h={22}
        d={8}
        c={{ ...c, top: '#cbd5e1', left: '#64748b', right: '#94a3b8' }}
      />
      <IsoBox x={36} y={36} w={18} h={10} d={14} c={c} />
      <ellipse cx="52" cy="34" rx="6" ry="4" fill={c.accent} stroke="#0a0a0a" strokeWidth="0.5" />
    </g>
  )
}

function PackShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={22} y={78} w={48} h={8} d={20} c={c} />
      <IsoBox x={34} y={52} w={22} h={20} d={16} c={c} />
      <IsoBox x={40} y={40} w={12} h={8} d={10} c={{ ...c, top: c.accent }} />
    </g>
  )
}

function InjectionShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={20} y={74} w={50} h={12} d={24} c={c} />
      <IsoBox x={28} y={48} w={18} h={18} d={14} c={c} />
      <IsoBox x={48} y={44} w={18} h={22} d={14} c={c} />
      <IsoBox
        x={36}
        y={34}
        w={20}
        h={6}
        d={10}
        c={{ ...c, top: '#cbd5e1', left: '#64748b', right: '#94a3b8' }}
      />
    </g>
  )
}

function PaintShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={28} y={76} w={36} h={10} d={24} c={c} />
      <IsoBox x={34} y={46} w={24} h={24} d={16} c={c} />
      <polygon points="70,40 86,34 88,38 72,44" fill={c.right} stroke="#0a0a0a" strokeWidth="0.5" />
      <circle cx="88" cy="35" r="3" fill={c.accent} opacity="0.85" />
    </g>
  )
}

function ConveyorShape({ c }: { c: ColorSet }) {
  return (
    <g>
      <IsoBox x={16} y={78} w={56} h={6} d={18} c={c} />
      {[22, 40, 58, 76].map((x) => (
        <ellipse
          key={x}
          cx={x}
          cy={82}
          rx="4"
          ry="2.5"
          fill={c.left}
          stroke="#0a0a0a"
          strokeWidth="0.4"
        />
      ))}
      <IsoBox x={30} y={60} w={16} h={10} d={10} c={{ ...c, top: c.accent }} />
    </g>
  )
}
