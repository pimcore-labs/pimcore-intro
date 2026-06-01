import { useCockpit } from '../../state/cockpit'
import { MODULE_LIST } from '../../data/moduleVisuals'
import type { DomainSlug } from '../../data/types'

/**
 * Connection lines from the PXM knob to each module card. Coordinates are
 * baked against the fixed 1920×1080 frame; Frame16x9 scales the whole canvas
 * uniformly so endpoints never drift relative to the cards.
 *
 * Layout reference (must stay in sync with App.tsx + ModuleRail):
 *  - Header: 96px tall
 *  - Left rail: 500px wide, two columns
 *      Column 1 (Data Management): card right edges at x ≈ 246
 *      Column 2 (Experience Management): card right edges at x ≈ 486
 *  - PXM knob: size 250, center at (834, 327)
 */

const FRAME_W = 1920
const FRAME_H = 1080

const PXM_CENTER_X = 744
const PXM_CENTER_Y = 383
const PXM_RIM_X = PXM_CENTER_X - 132 // just outside the bevel ring (knob radius 125)

interface Endpoint {
  x: number
  y: number
}

const ENDPOINTS: Record<DomainSlug, Endpoint> = {
  pim: { x: 246, y: 198 },
  mdm: { x: 246, y: 350 },
  dam: { x: 246, y: 502 },
  cdp: { x: 246, y: 653 },
  'dxp-cms': { x: 486, y: 199 },
  ecommerce: { x: 486, y: 353 },
}

function bezierPath(end: Endpoint): string {
  const startX = PXM_RIM_X
  const startY = PXM_CENTER_Y
  const cp1X = (startX + end.x) / 2
  const cp2X = cp1X
  return `M ${startX} ${startY} C ${cp1X} ${startY}, ${cp2X} ${end.y}, ${end.x} ${end.y}`
}

function pulseDuration(intensity: number): number {
  // Spec §5.3: slow at 50%, fast at 100%. Map 50→4s, 100→1s.
  const t = Math.max(0, Math.min(1, (intensity - 50) / 50))
  return 4 - t * 3
}

export function ConnectionLines() {
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const allSix = active.size === 6

  const showPulses = agents >= 50
  const dur = pulseDuration(agents)

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
      preserveAspectRatio="none"
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <defs>
        {MODULE_LIST.map((m) => (
          <path
            key={`def-${m.slug}`}
            id={`cl-path-${m.slug}`}
            d={bezierPath(ENDPOINTS[m.slug])}
          />
        ))}
      </defs>

      {MODULE_LIST.map((m) => {
        const slug = m.slug
        const isActive = active.has(slug)
        const stroke = isActive ? (allSix ? '#5924AB' : m.accent) : 'rgba(20,20,30,0.18)'
        const opacity = isActive ? 0.65 : 0.22
        const filter = isActive
          ? `drop-shadow(0 0 4px ${allSix ? '#5924AB55' : m.accent + '55'})`
          : 'none'

        return (
          <g key={slug}>
            <use
              href={`#cl-path-${slug}`}
              fill="none"
              stroke={stroke}
              strokeWidth={isActive ? 2 : 1.2}
              strokeLinecap="round"
              opacity={opacity}
              style={{
                transition:
                  'stroke 350ms ease, opacity 350ms ease, stroke-width 350ms ease',
                filter,
              }}
            />
            {showPulses && isActive && (
              <circle r={4} fill="#E8B547" opacity={0.9}>
                <animateMotion dur={`${dur}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#cl-path-${slug}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        )
      })}
    </svg>
  )
}
