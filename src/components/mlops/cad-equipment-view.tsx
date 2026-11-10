import type { EquipmentStatus } from 'src/types/mlops'
import { cn } from '@/lib/utils'

const statusMetal: Record<EquipmentStatus, { body: string; accent: string; highlight: string }> = {
  normal: { body: '#8a93a3', accent: '#34d399', highlight: '#c5ccd8' },
  warning: { body: '#9a8f6e', accent: '#fbbf24', highlight: '#e8d9a8' },
  fault: { body: '#9a7070', accent: '#f87171', highlight: '#e8b4b4' },
  offline: { body: '#6b7280', accent: '#9ca3af', highlight: '#d1d5db' },
}

interface Props {
  name: string
  type: string
  status: EquipmentStatus
  className?: string
  showDimensions?: boolean
  selectedPart?: string | null
}

/** CAD 스타일 2.5D 장비 메인 뷰 (기어박스/설비 조립도) */
export function CadEquipmentView({
  name,
  type,
  status,
  className,
  showDimensions = true,
  selectedPart,
}: Props) {
  const m = statusMetal[status]

  return (
    <svg viewBox="0 0 640 420" className={cn('w-full h-full', className)} aria-label={name}>
      <defs>
        <linearGradient id="metalL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={m.highlight} />
          <stop offset="45%" stopColor={m.body} />
          <stop offset="100%" stopColor="#3f4654" />
        </linearGradient>
        <linearGradient id="metalD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b6475" />
          <stop offset="100%" stopColor="#2a303c" />
        </linearGradient>
        <radialGradient id="gearFace" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={m.highlight} />
          <stop offset="70%" stopColor={m.body} />
          <stop offset="100%" stopColor="#2f3542" />
        </radialGradient>
        <filter id="softShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* floor plane */}
      <ellipse cx="320" cy="355" rx="210" ry="28" fill="#000" opacity="0.35" />

      {/* housing - isometric-ish solid */}
      <g filter="url(#softShadow)" opacity={partOpacity(selectedPart, 'housing')}>
        <path
          d="M170 250 L250 210 L430 210 L510 250 L510 310 L430 350 L250 350 L170 310 Z"
          fill="url(#metalL)"
          stroke="#1a1d24"
          strokeWidth="1.2"
        />
        <path d="M170 250 L250 210 L430 210 L510 250 L430 235 L250 235 Z" fill="url(#metalD)" opacity="0.9" />
        <path d="M430 210 L510 250 L510 310 L430 350 Z" fill="#3a4150" />
        {/* cutaway opening */}
        <path
          d="M250 245 L400 245 L400 320 L250 320 Z"
          fill="#12151c"
          stroke="#1f2430"
          strokeWidth="1"
        />
      </g>

      {/* cover */}
      <g opacity={partOpacity(selectedPart, 'cover')}>
        <path
          d="M255 205 L415 205 L440 220 L230 220 Z"
          fill="url(#metalL)"
          stroke="#1a1d24"
          strokeWidth="1"
        />
        {[270, 300, 330, 360, 390].map((x) => (
          <circle key={x} cx={x} cy="214" r="3.2" fill="#2a303c" stroke={m.highlight} strokeWidth="0.6" />
        ))}
      </g>

      {/* input shaft */}
      <g opacity={partOpacity(selectedPart, 'input-shaft')}>
        <rect x="120" y="268" width="140" height="16" rx="3" fill="url(#metalL)" stroke="#1a1d24" />
        <rect x="100" y="272" width="28" height="8" rx="2" fill={m.accent} opacity="0.85" />
        <circle cx="108" cy="276" r="10" fill="none" stroke={m.accent} strokeWidth="2" opacity="0.5" />
      </g>

      {/* gear set */}
      <g opacity={partOpacity(selectedPart, 'gear-set')}>
        <Gear cx={300} cy={285} r={48} teeth={14} fill="url(#gearFace)" />
        <Gear cx={355} cy={292} r={28} teeth={10} fill="url(#metalL)" />
        <circle cx="300" cy="285" r="10" fill="#1c212b" stroke={m.highlight} strokeWidth="1" />
        <circle cx="355" cy="292" r="7" fill="#1c212b" stroke={m.highlight} strokeWidth="1" />
      </g>

      {/* bearings */}
      <g opacity={partOpacity(selectedPart, 'bearing-front')}>
        <ellipse cx="230" cy="276" rx="14" ry="14" fill="#4b5568" stroke={m.highlight} strokeWidth="1.2" />
        <ellipse cx="230" cy="276" rx="7" ry="7" fill="#1c212b" />
      </g>
      <g opacity={partOpacity(selectedPart, 'bearing-rear')}>
        <ellipse cx="410" cy="276" rx="12" ry="12" fill="#4b5568" stroke={m.highlight} strokeWidth="1.2" />
        <ellipse cx="410" cy="276" rx="6" ry="6" fill="#1c212b" />
      </g>

      {/* output flange */}
      <g opacity={partOpacity(selectedPart, 'output-flange')}>
        <rect x="410" y="268" width="90" height="16" rx="3" fill="url(#metalL)" stroke="#1a1d24" />
        <circle cx="510" cy="276" r="18" fill="url(#metalD)" stroke="#1a1d24" strokeWidth="1" />
        <circle cx="510" cy="276" r="8" fill="#1c212b" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180
          return (
            <circle
              key={deg}
              cx={510 + Math.cos(rad) * 12}
              cy={276 + Math.sin(rad) * 12}
              r="2.2"
              fill={m.highlight}
            />
          )
        })}
      </g>

      {/* type badge on housing */}
      <text x="280" y="338" fill="#94a3b8" fontSize="10" fontFamily="ui-sans-serif, system-ui">
        {type} · {name}
      </text>

      {/* status beacon */}
      <circle cx="500" cy="230" r="6" fill={m.accent} />
      <circle cx="500" cy="230" r="10" fill={m.accent} opacity="0.25" />

      {showDimensions && (
        <g fill="#e2e8f0" stroke="#94a3b8" fontSize="11" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
          {/* overall length */}
          <path d="M120 190 L510 190" fill="none" strokeDasharray="0" strokeWidth="0.8" />
          <path d="M120 185 L120 195 M510 185 L510 195" fill="none" strokeWidth="0.8" />
          <text x="300" y="182" textAnchor="middle" stroke="none">
            246.00
          </text>

          {/* height */}
          <path d="M545 210 L545 350" fill="none" strokeWidth="0.8" />
          <path d="M540 210 L550 210 M540 350 L550 350" fill="none" strokeWidth="0.8" />
          <text x="568" y="285" stroke="none">
            127.00
          </text>

          {/* shaft */}
          <path d="M100 300 L260 300" fill="none" strokeWidth="0.8" />
          <text x="175" y="314" textAnchor="middle" stroke="none">
            98.50
          </text>

          {/* tolerances / PMI */}
          <g stroke="none">
            <text x="220" y="250" fill={m.accent} fontSize="10">
              ⌀42.00
            </text>
            <text x="355" y="250" fill="#cbd5e1" fontSize="10">
              0.02 A
            </text>
            <text x="480" y="255" fill="#cbd5e1" fontSize="10">
              0.015 A
            </text>
            <text x="300" y="370" fill="#64748b" fontSize="10" textAnchor="middle">
              IND-4800 · Digital Twin PMI
            </text>
          </g>
        </g>
      )}
    </svg>
  )
}

function partOpacity(selected: string | null | undefined, id: string) {
  if (!selected) return 1
  return selected === id ? 1 : 0.28
}

function Gear({
  cx,
  cy,
  r,
  teeth,
  fill,
}: {
  cx: number
  cy: number
  r: number
  teeth: number
  fill: string
}) {
  const pts: string[] = []
  for (let i = 0; i < teeth * 2; i++) {
    const ang = (i * Math.PI) / teeth
    const rad = i % 2 === 0 ? r : r * 0.78
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`)
  }
  return <polygon points={pts.join(' ')} fill={fill} stroke="#1a1d24" strokeWidth="1" />
}

/** 직교 투영 미니 뷰 */
export function OrthoView({
  label,
  variant,
  status,
}: {
  label: string
  variant: 'top' | 'right' | 'front'
  status: EquipmentStatus
}) {
  const m = statusMetal[status]
  return (
    <div className="border border-border bg-[#12151b] p-2">
      <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <svg viewBox="0 0 160 100" className="w-full h-[72px]">
        {variant === 'top' && (
          <g>
            <rect x="30" y="30" width="100" height="44" fill={m.body} stroke="#1a1d24" />
            <rect x="10" y="44" width="25" height="12" fill={m.accent} opacity="0.7" />
            <rect x="125" y="44" width="25" height="12" fill={m.body} />
            <circle cx="70" cy="52" r="12" fill="#1c212b" stroke={m.highlight} />
            <circle cx="95" cy="52" r="8" fill="#1c212b" stroke={m.highlight} />
            <path d="M30 22 H130" stroke="#64748b" strokeWidth="0.7" />
            <text x="80" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">
              246.00
            </text>
          </g>
        )}
        {variant === 'right' && (
          <g>
            <path d="M50 20 L110 35 L110 75 L50 85 Z" fill={m.body} stroke="#1a1d24" />
            <circle cx="80" cy="55" r="14" fill="#1c212b" stroke={m.highlight} />
            <circle cx="80" cy="55" r="6" fill={m.accent} opacity="0.6" />
            <path d="M118 35 V75" stroke="#64748b" strokeWidth="0.7" />
            <text x="132" y="58" fill="#94a3b8" fontSize="8">
              127
            </text>
          </g>
        )}
        {variant === 'front' && (
          <g>
            <rect x="35" y="28" width="90" height="50" rx="2" fill={m.body} stroke="#1a1d24" />
            <circle cx="80" cy="53" r="18" fill="#1c212b" stroke={m.highlight} />
            <circle cx="80" cy="53" r="8" fill={m.accent} opacity="0.5" />
            <rect x="20" y="48" width="18" height="10" fill={m.accent} opacity="0.7" />
            <path d="M35 86 H125" stroke="#64748b" strokeWidth="0.7" />
            <text x="80" y="96" textAnchor="middle" fill="#94a3b8" fontSize="8">
              180.00
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
