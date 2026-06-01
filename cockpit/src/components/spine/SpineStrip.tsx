import { useMemo } from 'react'
import { line, curveCatmullRom } from 'd3-shape'
import { useCockpit } from '../../state/cockpit'
import {
  combineBias,
  SPINE_INPUTS,
  SPINE_INPUT_LABELS,
  SPINE_OUTPUTS,
  SPINE_OUTPUT_LABELS,
  type SpineInput,
  type SpineOutput,
} from '../../data/spineBias'
import { MODULE_LIST, MODULE_VISUALS } from '../../data/moduleVisuals'

const PXM_PURPLE = '#5924AB'
const PXM_PURPLE_2 = '#7A4ACE'
const PXM_LAVENDER = '#B89BE6'
const GOLD = '#E8B547'
const GOLD_BRIGHT = '#F5C842'

// Section / SVG geometry. preserveAspectRatio="none" means viewBox units map
// linearly to container pixels — so the port rows in the DOM share the same
// y-coordinate space as the flow-line endpoints in the SVG.
const SECTION_H = 200
const PAD_Y = 12
const H = SECTION_H - PAD_Y * 2 // 176 — SVG viewBox + DOM port-column inner height
const W = 1400
const PORT_TOP = 22
const PORT_BOT = H - 22
const SPINE_LEFT = 200
const SPINE_RIGHT = W - 200
const SPINE_Y = H / 2

// Vertebral column layout — six vertebrae with thin intervertebral discs.
// vertebra "footprint" = body + two lateral (transverse) processes.
const VERT_COUNT = 6
const DISC_W = 8
const WING_W = 9
const VERT_TOTAL_W = (SPINE_RIGHT - SPINE_LEFT - (VERT_COUNT - 1) * DISC_W) / VERT_COUNT // 162
const VERT_BODY_W = VERT_TOTAL_W - 2 * WING_W // 144
const VERT_BODY_H = 56
const VERT_HALF_H = VERT_BODY_H / 2
const SP_H = 18 // spinous-process height (points up, away from labels)
const FORAMEN_R = 8.5

const SPINE_ENTRY_TOP = SPINE_Y - VERT_HALF_H + 8
const SPINE_ENTRY_BOT = SPINE_Y + VERT_HALF_H - 8

// S-curve along the column — one full sine cycle across 6 vertebrae gives a
// thoracic-then-lumbar bend. Vertebrae rotate to the local tangent so the
// column reads as a real bent spine, not bones that have just been displaced.
const SPINE_CURVE_AMP = 22
const SPINE_CURVE_K = (2 * Math.PI) / (VERT_COUNT - 1)

const vertebraCx = (i: number) =>
  SPINE_LEFT + VERT_TOTAL_W / 2 + i * (VERT_TOTAL_W + DISC_W)
const vertebraCy = (i: number) =>
  SPINE_Y - SPINE_CURVE_AMP * Math.sin(i * SPINE_CURVE_K)
/** Tangent direction (degrees) of the curve at vertebra i — used to rotate
 *  each vertebra so its body sits perpendicular to the spinal cord. */
const vertebraAngle = (i: number): number => {
  const dx = VERT_TOTAL_W + DISC_W
  const dy = -SPINE_CURVE_AMP * SPINE_CURVE_K * Math.cos(i * SPINE_CURVE_K)
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Port row y in the shared coordinate space (viewBox y === DOM column y). */
const portY = (i: number, n: number) =>
  PORT_TOP + ((PORT_BOT - PORT_TOP) * i) / (n - 1)

/** Spine-edge entry y for a fan-in/fan-out, distributed across the body height. */
const spineEntryY = (i: number, n: number) =>
  lerp(SPINE_ENTRY_TOP, SPINE_ENTRY_BOT, i / (n - 1))

/** FNV-ish stable [0,1) hash for per-line phase jitter. */
function stableRand(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 10000) / 10000
}

/** Cubic Bézier path with horizontal tangents at both ends — clean S-curve. */
function curveX(sx: number, sy: number, tx: number, ty: number, k = 0.55): string {
  const c1x = sx + (tx - sx) * k
  const c2x = tx - (tx - sx) * k
  return `M${sx},${sy} C${c1x},${sy} ${c2x},${ty} ${tx},${ty}`
}

function cometCount(agents: number, bias: number): number {
  if (agents <= 0 || bias <= 0.05) return 0
  const base = Math.round((agents / 100) * 5 * bias)
  return Math.max(1, Math.min(5, base))
}

function cometDuration(agents: number, seed: string): number {
  const t = Math.max(0, Math.min(1, agents / 100))
  const base = 4 - t * 2.8 // 4s at 0%, 1.2s at 100%
  const jitter = 0.7 + stableRand(seed) * 0.6
  return base * jitter
}

export function SpineStrip() {
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const subKnobs = useCockpit((s) => s.subKnobs)

  const bias = useMemo(() => combineBias(active, subKnobs), [active, subKnobs])
  const allSix = active.size === 6
  const agenticHigh = agents >= 80
  const agenticPeak = allSix && agents >= 80
  const agentsOn = agents > 0

  return (
    <section
      className="relative"
      style={{
        height: SECTION_H,
        padding: `${PAD_Y}px 0`,
        background:
          'linear-gradient(180deg, rgba(20,20,30,0) 0%, rgba(20,20,30,0.04) 45%, rgba(20,20,30,0.06) 100%)',
        borderTop: '1px solid rgba(20,20,30,0.06)',
        borderBottom: '1px solid rgba(20,20,30,0.04)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
    >
      <div
        className="absolute"
        style={{
          inset: `${PAD_Y}px 18px`,
          display: 'grid',
          gridTemplateColumns: '150px 1fr 150px',
          gap: 10,
        }}
      >
        <PortColumn<SpineInput>
          side="left"
          title="INPUTS"
          slugs={SPINE_INPUTS}
          labels={SPINE_INPUT_LABELS}
          intensities={bias.inputs}
        />
        <div className="relative" style={{ minWidth: 0 }}>
          <SpineSvg
            active={active}
            inputBias={bias.inputs}
            outputBias={bias.outputs}
            allSix={allSix}
            agentsOn={agentsOn}
            agentsHigh={agenticHigh}
            agentsValue={agents}
          />
        </div>
        <PortColumn<SpineOutput>
          side="right"
          title="OUTPUTS"
          slugs={SPINE_OUTPUTS}
          labels={SPINE_OUTPUT_LABELS}
          intensities={bias.outputs}
        />
      </div>

      <SpineNameplate agenticPeak={agenticPeak} />
      <BottomGovernance allSix={allSix} agenticHigh={agenticHigh} />
    </section>
  )
}

interface PortColumnProps<T extends string> {
  side: 'left' | 'right'
  title: string
  slugs: readonly T[]
  labels: Record<T, string>
  intensities: Record<T, number>
}

function PortColumn<T extends string>({
  side,
  title,
  slugs,
  labels,
  intensities,
}: PortColumnProps<T>) {
  const isLeft = side === 'left'
  return (
    <div className="relative" style={{ minWidth: 0 }}>
      <div
        className="font-mono"
        style={{
          position: 'absolute',
          top: 2,
          [isLeft ? 'right' : 'left']: 4,
          fontSize: 8,
          letterSpacing: '0.28em',
          color: 'var(--pc-text-faint)',
          fontWeight: 600,
        }}
      >
        {title}
      </div>
      {slugs.map((slug, i) => (
        <PortRow
          key={slug}
          label={labels[slug]}
          intensity={intensities[slug]}
          isLeft={isLeft}
          y={portY(i, slugs.length)}
        />
      ))}
    </div>
  )
}

interface PortRowProps {
  label: string
  intensity: number
  isLeft: boolean
  y: number
}

function PortRow({ label, intensity, isLeft, y }: PortRowProps) {
  const lit = intensity > 0.05
  const opacity = 0.35 + 0.65 * intensity
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        [isLeft ? 'right' : 'left']: 0,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: isLeft ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 8,
        opacity,
        transition: 'opacity 400ms ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: 999,
          background: lit
            ? `radial-gradient(circle at 32% 28%, #ffffff 0%, ${PXM_PURPLE_2} 55%, ${PXM_PURPLE} 100%)`
            : 'radial-gradient(circle at 32% 28%, #f4f6f8 0%, #c9cfd5 100%)',
          boxShadow: lit
            ? `0 0 8px ${PXM_PURPLE_2}aa, 0 0 0 1px rgba(255,255,255,0.7) inset, 0 1px 1px rgba(0,0,0,0.15)`
            : '0 0 0 1px rgba(0,0,0,0.08) inset',
          flexShrink: 0,
          transition: 'background 400ms ease, box-shadow 400ms ease',
        }}
      />
      <span
        className="font-mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.18em',
          color: lit ? 'var(--pc-text)' : 'var(--pc-text-faint)',
          fontWeight: lit ? 700 : 500,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  )
}

interface SpineSvgProps {
  active: ReadonlySet<string>
  inputBias: Record<string, number>
  outputBias: Record<string, number>
  allSix: boolean
  agentsOn: boolean
  agentsHigh: boolean
  agentsValue: number
}

function SpineSvg({
  active,
  inputBias,
  outputBias,
  allSix,
  agentsOn,
  agentsHigh,
  agentsValue,
}: SpineSvgProps) {
  const inputLines = SPINE_INPUTS.map((slug, i) => ({
    slug,
    pathId: `flow-in-${slug}`,
    intensity: inputBias[slug],
    d: curveX(0, portY(i, SPINE_INPUTS.length), SPINE_LEFT, spineEntryY(i, SPINE_INPUTS.length)),
    dur: cometDuration(agentsValue, `in-${slug}`),
    phase: stableRand(`phase-in-${slug}`),
  }))
  const outputLines = SPINE_OUTPUTS.map((slug, i) => ({
    slug,
    pathId: `flow-out-${slug}`,
    intensity: outputBias[slug],
    d: curveX(SPINE_RIGHT, spineEntryY(i, SPINE_OUTPUTS.length), W, portY(i, SPINE_OUTPUTS.length)),
    dur: cometDuration(agentsValue, `out-${slug}`),
    phase: stableRand(`phase-out-${slug}`),
  }))

  // Spinal cord — the continuous channel that threads every vertebral foramen.
  // Inner-spine comets travel this path so packets visibly pass *through* the
  // column, not just over it. The Catmull-Rom curve runs through each foramen
  // center plus two padded endpoints so the cord enters/exits the column.
  const cordId = 'spinal-cord'
  const cordPoints: [number, number][] = [
    [SPINE_LEFT + 4, vertebraCy(0)],
    ...MODULE_LIST.map((_, i): [number, number] => [vertebraCx(i), vertebraCy(i)]),
    [SPINE_RIGHT - 4, vertebraCy(MODULE_LIST.length - 1)],
  ]
  const cordD =
    line<[number, number]>()
      .x((p) => p[0])
      .y((p) => p[1])
      .curve(curveCatmullRom.alpha(0.5))(cordPoints) ?? ''
  // Inner-cord packet stream — denser than the input/output lines so the cord
  // visibly carries the platform's "always-on" data current.
  const innerComets = agentsOn ? 3 + Math.round((agentsValue / 100) * 9) : 0
  const innerDur = cometDuration(agentsValue, 'spine-inner')
  // Cord dash animation speed — slow ambient flow at idle, sprint at full agents.
  const cordFlowDur = `${(1.8 - (agentsValue / 100) * 1.4).toFixed(2)}s`

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      aria-hidden
    >
      <defs>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>
        <filter id="halo-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Bone gradient — warm cream with a subtle top-down lighting cue. */}
        <linearGradient id="bone-off" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F1E3" />
          <stop offset="55%" stopColor="#EFE5CD" />
          <stop offset="100%" stopColor="#DCCDA8" />
        </linearGradient>
        <linearGradient id="bone-on" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF6E8" />
          <stop offset="55%" stopColor="#F4ECD6" />
          <stop offset="100%" stopColor="#E2D4B0" />
        </linearGradient>
        {/* Disc (intervertebral cartilage) — slightly darker than bone. */}
        <linearGradient id="disc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2D4B6" />
          <stop offset="50%" stopColor="#CDBE97" />
          <stop offset="100%" stopColor="#B8A77E" />
        </linearGradient>
        {/* Sheen on top half of vertebral body. */}
        <linearGradient id="bone-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.55} />
          <stop offset="60%" stopColor="#ffffff" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>

        {/* Flow line gradient — fades from the port (faint) into the spine (bright). */}
        <linearGradient id="flow-in-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={PXM_LAVENDER} stopOpacity={0.4} />
          <stop offset="100%" stopColor={PXM_PURPLE_2} stopOpacity={1} />
        </linearGradient>
        <linearGradient id="flow-out-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={PXM_PURPLE_2} stopOpacity={1} />
          <stop offset="100%" stopColor={PXM_LAVENDER} stopOpacity={0.4} />
        </linearGradient>

        {/* Comet — bright nucleus with a vanishing tail along the path tangent. */}
        <linearGradient id="comet-fwd" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor={GOLD_BRIGHT} stopOpacity={0} />
          <stop offset="55%" stopColor={GOLD_BRIGHT} stopOpacity={0.35} />
          <stop offset="92%" stopColor={GOLD_BRIGHT} stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="comet-rev" x1="0" y1="0.5" x2="1" y2="0.5">
          <stop offset="0%" stopColor={GOLD} stopOpacity={0} />
          <stop offset="55%" stopColor={GOLD} stopOpacity={0.25} />
          <stop offset="92%" stopColor={GOLD} stopOpacity={0.7} />
          <stop offset="100%" stopColor={GOLD_BRIGHT} stopOpacity={0.85} />
        </linearGradient>
      </defs>

      {/* Hidden path defs targeted by <animateMotion><mpath/></animateMotion>. */}
      <g style={{ display: 'none' }}>
        {inputLines.map((l) => (
          <path key={l.pathId} id={l.pathId} d={l.d} />
        ))}
        {outputLines.map((l) => (
          <path key={l.pathId} id={l.pathId} d={l.d} />
        ))}
        <path id={cordId} d={cordD} />
      </g>

      {/* Flow lines — drawn under the vertebral column so they feel like nerves
          rooting into the bone. */}
      {inputLines.map((l) => (
        <FlowLine
          key={l.slug}
          d={l.d}
          pathId={l.pathId}
          intensity={l.intensity}
          gradId="flow-in-grad"
          comets={cometCount(agentsValue, l.intensity)}
          dur={l.dur}
          phase={l.phase}
          agentsOn={agentsOn}
        />
      ))}
      {outputLines.map((l) => (
        <FlowLine
          key={l.slug}
          d={l.d}
          pathId={l.pathId}
          intensity={l.intensity}
          gradId="flow-out-grad"
          comets={cometCount(agentsValue, l.intensity)}
          dur={l.dur}
          phase={l.phase}
          agentsOn={agentsOn}
        />
      ))}

      {/* Vertebral column — discs first so vertebrae sit on top of them. */}
      <SpineColumn
        active={active}
        allSix={allSix}
        agentsHigh={agentsHigh}
        cordD={cordD}
        cordFlowDur={cordFlowDur}
      />

      {/* Spinal-cord packets — only when agents are engaged.
          Rendered last so they appear to traverse the column on top. */}
      {innerComets > 0 &&
        Array.from({ length: innerComets }).map((_, i) => {
          const phase = stableRand('spine-inner-phase')
          const offset = ((i + phase) / innerComets) % 1
          return (
            <g key={`spine-inner-${i}`}>
              <ellipse rx={22} ry={3.6} fill={GOLD_BRIGHT} opacity={0.22} filter="url(#strong-glow)">
                <animateMotion
                  dur={`${innerDur}s`}
                  begin={`${-offset * innerDur}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${cordId}`} />
                </animateMotion>
              </ellipse>
              <ellipse rx={12} ry={2.6} fill="url(#comet-fwd)">
                <animateMotion
                  dur={`${innerDur}s`}
                  begin={`${-offset * innerDur}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${cordId}`} />
                </animateMotion>
              </ellipse>
            </g>
          )
        })}
    </svg>
  )
}

interface SpineColumnProps {
  active: ReadonlySet<string>
  allSix: boolean
  agentsHigh: boolean
  cordD: string
  cordFlowDur: string
}

function SpineColumn({ active, allSix, agentsHigh, cordD, cordFlowDur }: SpineColumnProps) {
  const totalW = SPINE_RIGHT - SPINE_LEFT
  // Cast shadow that anchors the column on the chassis.
  const shadowCx = SPINE_LEFT + totalW / 2
  const shadowCy = SPINE_Y + VERT_HALF_H + 14 + SPINE_CURVE_AMP
  return (
    <g>
      {/* Soft shadow under the column. */}
      <ellipse
        cx={shadowCx}
        cy={shadowCy}
        rx={totalW / 2 + 14}
        ry={4.5}
        fill="rgba(20,20,30,0.16)"
        filter="url(#halo-blur)"
      />

      {/* Breathing halo — gold when agentic-high, purple at PXM-engaged. */}
      {(agentsHigh || allSix) && (
        <rect
          x={SPINE_LEFT - 10}
          y={SPINE_Y - VERT_HALF_H - SP_H - 6 - SPINE_CURVE_AMP}
          width={totalW + 20}
          height={VERT_BODY_H + SP_H + 22 + SPINE_CURVE_AMP * 2}
          rx={(VERT_BODY_H + SP_H + 22) / 2}
          fill={agentsHigh ? GOLD : PXM_PURPLE_2}
          opacity={0.18}
          filter="url(#halo-blur)"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.3;0.1"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </rect>
      )}

      {/* Intervertebral discs (under vertebrae). Each disc sits at the midpoint
          between its two neighbors and tilts toward the cord tangent. */}
      {Array.from({ length: VERT_COUNT - 1 }).map((_, i) => {
        const a = { x: vertebraCx(i), y: vertebraCy(i) }
        const b = { x: vertebraCx(i + 1), y: vertebraCy(i + 1) }
        const cx = vertebraCx(i) + VERT_TOTAL_W / 2 + DISC_W / 2
        const cy = (a.y + b.y) / 2
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI
        return <Disc key={`disc-${i}`} index={i} cx={cx} cy={cy} angle={angle} />
      })}

      {/* Vertebrae bones (foramen wells drawn here; lit LEDs drawn AFTER the
          cord so they always sit on top of the animated dash flow). */}
      {MODULE_LIST.map((m, i) => (
        <Vertebra
          key={m.slug}
          index={i}
          cx={vertebraCx(i)}
          cy={vertebraCy(i)}
          angle={vertebraAngle(i)}
          accent={m.accent}
          short={MODULE_VISUALS[m.slug].shortName}
          on={active.has(m.slug)}
        />
      ))}

      {/* Spinal cord — three stacked strokes:
          1. dark outer channel (gives the cord depth)
          2. lavender inner channel (the cord proper)
          3. animated dashed overlay — the always-on current of data running
             through the column. Dash offset scrolls left→right; speed scales
             with agents intensity so the cord visibly accelerates. */}
      <path
        d={cordD}
        fill="none"
        stroke="#1A1A24"
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.4}
      />
      <path
        d={cordD}
        fill="none"
        stroke={allSix ? PXM_PURPLE_2 : '#A89AC4'}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.7}
        style={{ transition: 'stroke 500ms ease' }}
      />
      <path
        d={cordD}
        fill="none"
        stroke={allSix ? GOLD_BRIGHT : PXM_PURPLE_2}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeDasharray="4 14"
        opacity={0.85}
        style={{ transition: 'stroke 500ms ease' }}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-18"
          dur={cordFlowDur}
          repeatCount="indefinite"
        />
      </path>

      {/* Foramen LEDs — drawn on top of the cord. Each active foramen breathes
          and fires a phase-offset white ripple so a wave of light travels
          left→right through the column as data threads through. */}
      {MODULE_LIST.map((m, i) => (
        <VertebraForamen
          key={`f-${m.slug}`}
          index={i}
          cx={vertebraCx(i)}
          cy={vertebraCy(i)}
          angle={vertebraAngle(i)}
          accent={m.accent}
          on={active.has(m.slug)}
        />
      ))}
    </g>
  )
}

interface VertebraForamenProps {
  index: number
  cx: number
  cy: number
  angle: number
  accent: string
  on: boolean
}

function VertebraForamen({ index, cx, cy, angle, accent, on }: VertebraForamenProps) {
  return (
    <g>
      {/* Same wave as the bone — keeps the LED aligned as the vertebra moves. */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={waveValues}
        dur={`${WAVE_DUR}s`}
        begin={waveBegin(index)}
        repeatCount="indefinite"
      />
      <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <circle
        cx={0}
        cy={0}
        r={FORAMEN_R}
        fill={on ? accent : '#3a3a44'}
        style={{
          transition: 'fill 400ms ease',
          filter: on ? `drop-shadow(0 0 5px ${accent}cc)` : 'none',
        }}
      >
        {on && (
          <animate
            attributeName="r"
            values={`${FORAMEN_R};${FORAMEN_R + 0.9};${FORAMEN_R}`}
            dur="1.8s"
            begin={`${index * 0.15}s`}
            repeatCount="indefinite"
          />
        )}
      </circle>
      {on && (
        <circle cx={0} cy={0} r={FORAMEN_R + 1} fill="#FFFFFF" opacity={0}>
          <animate
            attributeName="opacity"
            values="0;0.95;0;0"
            keyTimes="0;0.05;0.35;1"
            dur="2.4s"
            begin={`${index * 0.28}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values={`${FORAMEN_R + 0.5};${FORAMEN_R + 4};${FORAMEN_R + 0.5}`}
            keyTimes="0;0.18;1"
            dur="2.4s"
            begin={`${index * 0.28}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Specular highlight on the foramen for a wet/glassy look. */}
      <ellipse
        cx={-FORAMEN_R * 0.35}
        cy={-FORAMEN_R * 0.4}
        rx={FORAMEN_R * 0.4}
        ry={FORAMEN_R * 0.22}
        fill="rgba(255,255,255,0.6)"
      />
      </g>
    </g>
  )
}

function Disc({
  index,
  cx,
  cy,
  angle,
}: {
  index: number
  cx: number
  cy: number
  angle: number
}) {
  const h = VERT_BODY_H - 8
  // Rotate 90° off the cord tangent so the disc reads as a vertical wafer that
  // tilts with the curve.
  const rot = angle + 90
  // Disc rides the wave at the midpoint phase between its two neighbouring
  // vertebrae so the column undulates smoothly through the joints.
  const begin = `-${((index + 0.5) * WAVE_PHASE).toFixed(2)}s`
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={waveValues}
        dur={`${WAVE_DUR}s`}
        begin={begin}
        repeatCount="indefinite"
      />
      <g transform={`translate(${cx},${cy}) rotate(${rot})`}>
        <rect
          x={-h / 2}
          y={-DISC_W / 2}
          width={h}
          height={DISC_W}
          rx={2.5}
          fill="url(#disc-fill)"
          stroke="rgba(20,20,30,0.22)"
          strokeWidth={0.7}
        />
        {/* faint seam to suggest the cartilage joint surface */}
        <line
          x1={0}
          y1={-DISC_W / 2 + 0.5}
          x2={0}
          y2={DISC_W / 2 - 0.5}
          stroke="rgba(20,20,30,0.18)"
          strokeWidth={0.5}
        />
      </g>
    </g>
  )
}

interface VertebraProps {
  index: number
  cx: number
  cy: number
  angle: number
  accent: string
  short: string
  on: boolean
}

// Shared params for the per-vertebra "living spine" wave. All sub-components
// that follow a vertebra (bone, foramen LED) must use identical timing so they
// stay in lockstep as the column undulates.
const WAVE_AMP = 1.4
const WAVE_DUR = 3.4
const WAVE_PHASE = 0.55 // seconds of phase offset per vertebra position
const waveValues = `0 ${-WAVE_AMP}; 0 ${WAVE_AMP}; 0 ${-WAVE_AMP}`
const waveBegin = (i: number) => `-${(i * WAVE_PHASE).toFixed(2)}s`

function Vertebra({ index, cx, cy, angle, accent, short, on }: VertebraProps) {
  const halfW = VERT_BODY_W / 2
  const halfH = VERT_HALF_H

  const bodyFill = on ? 'url(#bone-on)' : 'url(#bone-off)'
  const stroke = 'rgba(20,20,30,0.32)'

  // Spinous process — single fin pointing up (away from the labels).
  const sp = [
    `M ${-halfW * 0.18},${-halfH + 2}`,
    `L ${halfW * 0.18},${-halfH + 2}`,
    `L ${halfW * 0.07},${-halfH - SP_H}`,
    `Q 0 ${-halfH - SP_H - 2} ${-halfW * 0.07},${-halfH - SP_H}`,
    `Z`,
  ].join(' ')

  // Transverse processes — small lateral wings sitting just under the upper rim.
  const leftWing = [
    `M ${-halfW + 1},${-halfH * 0.55}`,
    `Q ${-halfW - WING_W * 0.6},${-halfH * 0.85} ${-halfW - WING_W},${-halfH * 0.45}`,
    `L ${-halfW - WING_W},${halfH * 0.35}`,
    `Q ${-halfW - WING_W * 0.4},${halfH * 0.7} ${-halfW + 1},${halfH * 0.35}`,
    `Z`,
  ].join(' ')
  const rightWing = [
    `M ${halfW - 1},${-halfH * 0.55}`,
    `Q ${halfW + WING_W * 0.6},${-halfH * 0.85} ${halfW + WING_W},${-halfH * 0.45}`,
    `L ${halfW + WING_W},${halfH * 0.35}`,
    `Q ${halfW + WING_W * 0.4},${halfH * 0.7} ${halfW - 1},${halfH * 0.35}`,
    `Z`,
  ].join(' ')

  const bodyRx = Math.min(halfH * 0.55, VERT_BODY_W * 0.18)

  return (
    <g>
      {/* Per-vertebra "living spine" wave — a small additive translate that
          phase-offsets by index so a continuous wave travels along the
          column. All sibling layers (halo, body) sit inside this wrapper so
          they move together as one bone. */}
      <animateTransform
        attributeName="transform"
        type="translate"
        values={waveValues}
        dur={`${WAVE_DUR}s`}
        begin={waveBegin(index)}
        repeatCount="indefinite"
      />

      {/* Halo behind the vertebra when its module is active. */}
      {on && (
        <circle
          cx={cx}
          cy={cy}
          r={VERT_TOTAL_W * 0.5}
          fill={accent}
          opacity={0.3}
          filter="url(#strong-glow)"
        >
          <animate
            attributeName="opacity"
            values="0.18;0.42;0.18"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
        {/* Spinous process (drawn first, sits behind the body). */}
        <path
          d={sp}
          fill={bodyFill}
          stroke={stroke}
          strokeWidth={0.8}
          style={{ transition: 'fill 400ms ease' }}
        />

        {/* Transverse processes (lateral wings). */}
        <path
          d={leftWing}
          fill={bodyFill}
          stroke={stroke}
          strokeWidth={0.8}
          style={{ transition: 'fill 400ms ease' }}
        />
        <path
          d={rightWing}
          fill={bodyFill}
          stroke={stroke}
          strokeWidth={0.8}
          style={{ transition: 'fill 400ms ease' }}
        />

        {/* Vertebral body. */}
        <rect
          x={-halfW}
          y={-halfH}
          width={VERT_BODY_W}
          height={VERT_BODY_H}
          rx={bodyRx}
          fill={bodyFill}
          stroke={stroke}
          strokeWidth={1.1}
          style={{ transition: 'fill 400ms ease' }}
        />

        {/* Top sheen — bone catching light. */}
        <rect
          x={-halfW + 3}
          y={-halfH + 3}
          width={VERT_BODY_W - 6}
          height={VERT_BODY_H * 0.42}
          rx={bodyRx - 2}
          fill="url(#bone-shine)"
          pointerEvents="none"
        />

        {/* Dark vertebral foramen well — the canal opening in the bone.
            The lit LED is drawn LATER in SpineColumn, on top of the cord, so
            the animated dash flow never crosses over it. */}
        <circle cx={0} cy={0} r={FORAMEN_R + 2.5} fill="#0E0E18" opacity={0.85} />

        {/* Module label below the body. */}
        <text
          x={0}
          y={halfH + 16}
          textAnchor="middle"
          fontSize={8}
          fill={on ? accent : 'rgba(20,20,30,0.45)'}
          style={{
            letterSpacing: '0.2em',
            fontWeight: 700,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            transition: 'fill 400ms ease',
          }}
        >
          {short}
        </text>
      </g>
    </g>
  )
}

interface FlowLineProps {
  d: string
  pathId: string
  intensity: number
  gradId: string
  comets: number
  dur: number
  phase: number
  agentsOn: boolean
}

function FlowLine({
  d,
  pathId,
  intensity,
  gradId,
  comets,
  dur,
  phase,
  agentsOn,
}: FlowLineProps) {
  const lit = intensity > 0.05
  const coreOpacity = lit ? 0.5 + 0.4 * intensity : 0.18
  const coreWidth = lit ? 0.9 + intensity * 1.8 : 0.7
  const midWidth = coreWidth + 1.4
  const glowWidth = coreWidth + 5
  // Comet body scales with intensity so strong flows visibly carry chunkier packets.
  const headRx = 6 + intensity * 7
  const headRy = 1.4 + intensity * 1.1

  return (
    <g>
      {/* Glow halo — only visible on lit lines. */}
      {lit && (
        <path
          d={d}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={glowWidth}
          strokeLinecap="round"
          opacity={0.18 + 0.32 * intensity}
          filter="url(#soft-glow)"
        />
      )}
      {/* Mid translucent stroke */}
      <path
        d={d}
        fill="none"
        stroke={lit ? `url(#${gradId})` : 'rgba(20,20,30,0.18)'}
        strokeWidth={midWidth}
        strokeLinecap="round"
        opacity={lit ? 0.28 : 0.16}
        style={{
          transition: 'opacity 350ms ease, stroke-width 350ms ease',
        }}
      />
      {/* Bright core */}
      <path
        d={d}
        fill="none"
        stroke={lit ? `url(#${gradId})` : 'rgba(20,20,30,0.22)'}
        strokeWidth={coreWidth}
        strokeLinecap="round"
        opacity={coreOpacity}
        style={{
          transition: 'opacity 350ms ease, stroke-width 350ms ease',
        }}
      />

      {/* Comets — staggered along the path with a return-direction counterpart. */}
      {agentsOn &&
        Array.from({ length: comets }).map((_, i) => {
          const fwdOffset = ((i + phase) / Math.max(1, comets)) % 1
          const revOffset = ((i + phase + 0.5) / Math.max(1, comets)) % 1
          const beginFwd = -fwdOffset * dur
          const beginRev = -revOffset * dur
          const jitter = 0.85 + ((i * 37 + Math.floor(phase * 100)) % 30) / 100
          return (
            <g key={i}>
              {/* Soft amber halo behind the comet head for a real "lit packet" feel. */}
              <ellipse
                rx={headRx * jitter * 1.8}
                ry={headRy * jitter * 2.2}
                fill={GOLD_BRIGHT}
                opacity={0.22}
                filter="url(#strong-glow)"
              >
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${beginFwd}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </ellipse>
              {/* Bright head */}
              <ellipse rx={headRx * jitter} ry={headRy * jitter} fill="url(#comet-fwd)">
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${beginFwd}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </ellipse>
              {/* Faint reverse-direction packet — orchestration feedback. */}
              <ellipse
                rx={headRx * 0.78 * jitter}
                ry={headRy * 0.85 * jitter}
                fill="url(#comet-rev)"
              >
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${beginRev}s`}
                  repeatCount="indefinite"
                  rotate="auto"
                  keyPoints="1;0"
                  keyTimes="0;1"
                  calcMode="linear"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </ellipse>
            </g>
          )
        })}
    </g>
  )
}

interface BottomGovernanceProps {
  allSix: boolean
  agenticHigh: boolean
}

function BottomGovernance({ allSix, agenticHigh }: BottomGovernanceProps) {
  const markers = [
    { label: 'GOVERNED', on: true, color: '#1A1A24' },
    { label: 'AGENTIC', on: agenticHigh, color: GOLD },
    { label: 'SOVEREIGN', on: allSix, color: PXM_PURPLE },
  ]
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {markers.map((m, i) => (
        <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: m.on
                ? `radial-gradient(circle at 32% 28%, #ffffff 0%, ${m.color} 70%)`
                : '#D0D0D8',
              boxShadow: m.on ? `0 0 8px ${m.color}aa` : 'none',
              transition: 'background 400ms ease, box-shadow 400ms ease',
            }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: '0.26em',
              color: m.on ? m.color : 'var(--pc-text-faint)',
              fontWeight: 700,
              transition: 'color 400ms ease',
            }}
          >
            {m.label}
          </span>
          {i < markers.length - 1 && (
            <span style={{ color: 'var(--pc-text-faint)', opacity: 0.5, marginLeft: 6 }}>·</span>
          )}
        </span>
      ))}
    </div>
  )
}

function SpineNameplate({ agenticPeak }: { agenticPeak: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${PXM_PURPLE_2} 60%, ${PXM_PURPLE} 100%)`,
          boxShadow: `0 0 8px ${PXM_PURPLE_2}aa`,
          flexShrink: 0,
        }}
      />
      <span
        className="font-mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'var(--pc-text)',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        Pimcore Data Spine
      </span>
      {agenticPeak && (
        <>
          <span style={{ color: 'var(--pc-text-faint)', opacity: 0.55 }}>·</span>
          <span
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: '0.32em',
              color: GOLD,
              fontWeight: 700,
              textShadow: `0 0 8px ${GOLD}66`,
            }}
          >
            ◆ AGENTIC ORCHESTRATION ◆
          </span>
        </>
      )}
    </div>
  )
}
