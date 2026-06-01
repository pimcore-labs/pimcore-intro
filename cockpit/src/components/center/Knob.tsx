import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import knobTextureUrl from '../../assets/textures/knob-brushed.png'

export type Halo =
  | { mode: 'off' }
  | { mode: 'continuous'; color: string; glow?: number }
  | { mode: 'segmented'; segments: ReadonlyArray<{ active: boolean; color: string }> }
  | { mode: 'unified'; color: string; pulse?: boolean }

export interface KnobProps {
  size: number
  /** 0–100. Drives the pointer notch angle. */
  value: number
  halo?: Halo
  tickCount?: number
  /** Optional override for the pointer's value (defaults to `value`). */
  pointerValue?: number
  /** Optional very faint face tint, e.g. for the all-six purple morph. */
  faceTint?: string
  ariaLabel?: string
  disabled?: boolean
  onPointerDown?: (e: ReactPointerEvent<SVGElement>) => void
  onDoubleClick?: (e: ReactMouseEvent<SVGElement>) => void
  /** Optional content overlaid on top of the SVG (e.g., centered status). */
  children?: ReactNode
  className?: string
}

/** Pointer arc span — typical audio knob convention: 7 o'clock to 5 o'clock. */
const ARC_MIN = -150
const ARC_MAX = 150
const ARC_SPAN = ARC_MAX - ARC_MIN

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function polar(radius: number, deg: number): [number, number] {
  // 0° = up; positive clockwise.
  const rad = ((deg - 90) * Math.PI) / 180
  return [radius * Math.cos(rad), radius * Math.sin(rad)]
}

function arcPath(radius: number, fromDeg: number, toDeg: number): string {
  if (Math.abs(toDeg - fromDeg) < 0.01) return ''
  const [x0, y0] = polar(radius, fromDeg)
  const [x1, y1] = polar(radius, toDeg)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  const sweep = toDeg > fromDeg ? 1 : 0
  return `M ${x0.toFixed(3)} ${y0.toFixed(3)} A ${radius} ${radius} 0 ${large} ${sweep} ${x1.toFixed(3)} ${y1.toFixed(3)}`
}

export function Knob({
  size,
  value,
  halo = { mode: 'off' },
  tickCount = 24,
  pointerValue,
  faceTint,
  ariaLabel,
  disabled,
  onPointerDown,
  onDoubleClick,
  children,
  className,
}: KnobProps) {
  const padding = Math.round(size * 0.18)
  const vbExt = size + padding * 2
  const r = size / 2

  // Geometry
  const rHaloOuter = r - 1
  const haloThickness = Math.max(4, Math.round(size * 0.04))
  const rHalo = rHaloOuter - haloThickness / 2
  const rTickOuter = rHalo - haloThickness / 2 - 2
  const rTickInner = rTickOuter - Math.max(3, Math.round(size * 0.025))
  const rBevel = rTickInner - 2
  const rBody = rBevel - Math.max(2, Math.round(size * 0.02))
  const rNotchTrack = rBody - Math.max(4, Math.round(size * 0.06))
  const rNotch = Math.max(2, Math.round(size * 0.025))

  const ptr = clamp(pointerValue ?? value, 0, 100)
  // Rotation applied to the knob face (texture, highlight, pointer notch).
  // 0° at value=0, +300° (clockwise) at value=100.
  const faceRotation = (ptr / 100) * ARC_SPAN
  // Pointer notch sits at the rest position inside the rotating face group;
  // the rotation transform carries it to the visible angle.
  const [pxRest, pyRest] = polar(rNotchTrack, ARC_MIN)

  // Tick marks
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const t = i / (tickCount - 1)
    const angle = ARC_MIN + t * ARC_SPAN
    const [x0, y0] = polar(rTickOuter, angle)
    const [x1, y1] = polar(rTickInner, angle)
    return { x0, y0, x1, y1, key: i }
  })

  // Halo arcs
  const haloElements: ReactNode[] = []
  if (halo.mode === 'continuous' && ptr > 0) {
    const fillTo = ARC_MIN + (clamp(value, 0, 100) / 100) * ARC_SPAN
    haloElements.push(
      <path
        key="halo-bg"
        d={arcPath(rHalo, ARC_MIN, ARC_MAX)}
        fill="none"
        stroke="#C9CFD5"
        strokeWidth={haloThickness}
        strokeLinecap="round"
        opacity={0.7}
      />,
      <path
        key="halo-fill"
        d={arcPath(rHalo, ARC_MIN, fillTo)}
        fill="none"
        stroke={halo.color}
        strokeWidth={haloThickness}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 ${Math.max(3, haloThickness * 0.7)}px ${halo.color}66)`,
        }}
      />,
    )
  } else if (halo.mode === 'segmented') {
    const n = halo.segments.length
    const arcEach = ARC_SPAN / n
    const gap = 4 // degrees of gap between segments
    halo.segments.forEach((seg, i) => {
      const from = ARC_MIN + i * arcEach + gap / 2
      const to = ARC_MIN + (i + 1) * arcEach - gap / 2
      haloElements.push(
        <path
          key={`seg-bg-${i}`}
          d={arcPath(rHalo, from, to)}
          fill="none"
          stroke="#C9CFD5"
          strokeWidth={haloThickness}
          strokeLinecap="round"
          opacity={0.7}
        />,
      )
      if (seg.active) {
        haloElements.push(
          <path
            key={`seg-on-${i}`}
            d={arcPath(rHalo, from, to)}
            fill="none"
            stroke={seg.color}
            strokeWidth={haloThickness}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${Math.max(3, haloThickness * 0.7)}px ${seg.color}66)`,
              transition: 'opacity 350ms ease-out',
            }}
          />,
        )
      }
    })
  } else if (halo.mode === 'unified') {
    haloElements.push(
      <path
        key="halo-unified-bg"
        d={arcPath(rHalo, ARC_MIN, ARC_MAX)}
        fill="none"
        stroke="#C9CFD5"
        strokeWidth={haloThickness}
        strokeLinecap="round"
        opacity={0.5}
      />,
      <path
        key="halo-unified"
        d={arcPath(rHalo, ARC_MIN, ARC_MAX)}
        fill="none"
        stroke={halo.color}
        strokeWidth={haloThickness}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 ${Math.max(4, haloThickness * 0.9)}px ${halo.color}80)`,
          opacity: halo.pulse ? undefined : 1,
          animation: halo.pulse ? 'flicker 0s' : undefined,
          transition: 'stroke 600ms ease, opacity 400ms ease',
        }}
      />,
    )
  } else {
    haloElements.push(
      <path
        key="halo-off-bg"
        d={arcPath(rHalo, ARC_MIN, ARC_MAX)}
        fill="none"
        stroke="#C9CFD5"
        strokeWidth={haloThickness}
        strokeLinecap="round"
        opacity={0.6}
      />,
    )
  }

  const cursor = disabled ? 'default' : 'ns-resize'

  return (
    <div
      className={className}
      style={{ width: size + padding * 2, height: size + padding * 2, position: 'relative' }}
    >
      <svg
        width={vbExt}
        height={vbExt}
        viewBox={`${-vbExt / 2} ${-vbExt / 2} ${vbExt} ${vbExt}`}
        role="slider"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        style={{
          cursor,
          touchAction: 'none',
          userSelect: 'none',
          display: 'block',
          overflow: 'visible',
        }}
        onPointerDown={onPointerDown}
        onDoubleClick={onDoubleClick}
      >
        <defs>
          {/* Body: cool silver, lit from upper-left as a curved surface. */}
          <radialGradient id={`knob-body-${size}`} cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#F4F6F9" />
            <stop offset="40%" stopColor="#D9DCE2" />
            <stop offset="80%" stopColor="#A8ADB6" />
            <stop offset="100%" stopColor="#86898F" />
          </radialGradient>
          {/* Inner-edge fresnel: slight darkening at the perimeter. */}
          <radialGradient id={`knob-bevel-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="rgba(20,20,30,0)" />
            <stop offset="92%" stopColor="rgba(20,20,30,0.10)" />
            <stop offset="100%" stopColor="rgba(20,20,30,0.28)" />
          </radialGradient>
          {/* Outer bevel ring — top-lit, bottom-shadowed. */}
          <linearGradient id={`knob-rim-${size}`} x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(20,20,30,0.22)" />
          </linearGradient>
          {/* Soft sheen: large blurry highlight near the upper face. */}
          <radialGradient id={`knob-sheen-${size}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <clipPath id={`knob-clip-${size}`}>
            <circle cx={0} cy={0} r={rBody} />
          </clipPath>
          <filter id={`knob-soft-shadow-${size}`} x="-30%" y="-20%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={Math.max(3, size * 0.025)} />
            <feOffset dy={Math.max(2, size * 0.02)} />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`knob-glow-blur-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={Math.max(2, size * 0.04)} />
          </filter>
          <filter id={`knob-spec-blur-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={Math.max(0.6, size * 0.012)} />
          </filter>
        </defs>

        {/* Halo (behind knob body) */}
        <g>{haloElements}</g>

        {/* Tick marks */}
        <g stroke="#A8A8B4" strokeWidth={1} opacity={0.55}>
          {ticks.map((t) => (
            <line key={t.key} x1={t.x0} y1={t.y0} x2={t.x1} y2={t.y1} />
          ))}
        </g>

        {/* Outer bevel ring (static) */}
        <circle cx={0} cy={0} r={rBevel} fill={`url(#knob-rim-${size})`} />

        {/* Rotating face — body, texture, machining rings, pointer notch spin with value */}
        <g transform={`rotate(${faceRotation})`}>
          <g filter={`url(#knob-soft-shadow-${size})`}>
            <circle cx={0} cy={0} r={rBody} fill={`url(#knob-body-${size})`} />
            {/* Brushed-metal photographic texture — rotates with the face */}
            <image
              href={knobTextureUrl}
              x={-rBody}
              y={-rBody}
              width={rBody * 2}
              height={rBody * 2}
              clipPath={`url(#knob-clip-${size})`}
              preserveAspectRatio="xMidYMid slice"
              opacity={0.4}
              style={{ mixBlendMode: 'soft-light' as const }}
            />
            {faceTint && (
              <circle cx={0} cy={0} r={rBody} fill={faceTint} style={{ transition: 'fill 800ms ease' }} />
            )}
            <circle cx={0} cy={0} r={rBody} fill={`url(#knob-bevel-${size})`} />
          </g>

          {/* Concentric machining rings — very subtle, only visible on larger knobs */}
          {size >= 80 &&
            [0.92, 0.78, 0.62, 0.44, 0.26].map((f, i) => (
              <circle
                key={`ring-${i}`}
                cx={0}
                cy={0}
                r={rBody * f}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={0.6}
              />
            ))}

          {/* Pointer notch — drawn at rest (-150°) inside the rotating group */}
          <circle cx={pxRest} cy={pyRest} r={rNotch} fill="#5A5A66" />
        </g>

        {/* Static lighting overlay — soft sheen + specular catch-light + rim shadow */}
        {/* Diffuse top sheen — large soft blob slightly off-center upper-left */}
        <ellipse
          cx={-rBody * 0.15}
          cy={-rBody * 0.42}
          rx={rBody * 0.78}
          ry={rBody * 0.32}
          fill={`url(#knob-sheen-${size})`}
          opacity={0.7}
          style={{ pointerEvents: 'none' }}
        />
        {/* Specular catch-light — bright pinpoint where the room reflects */}
        <ellipse
          cx={-rBody * 0.32}
          cy={-rBody * 0.55}
          rx={rBody * 0.12}
          ry={rBody * 0.07}
          fill="rgba(255,255,255,0.95)"
          filter={`url(#knob-spec-blur-${size})`}
          style={{ pointerEvents: 'none' }}
        />
        {/* Soft inner rim shadow — adds curvature/depth (fresnel cue) */}
        <circle
          cx={0}
          cy={0}
          r={rBody - size * 0.02}
          fill="none"
          stroke="rgba(20,20,30,0.18)"
          strokeWidth={size * 0.045}
          opacity={0.6}
          filter={`url(#knob-glow-blur-${size})`}
          style={{ pointerEvents: 'none' }}
        />
      </svg>
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}
