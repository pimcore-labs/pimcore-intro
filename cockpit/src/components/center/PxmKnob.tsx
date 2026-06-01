import { useMemo } from 'react'
import { Knob, type Halo } from './Knob'
import { useKnobDrag } from '../../hooks/useKnobDrag'
import { useCockpit } from '../../state/cockpit'
import { MODULE_VISUALS } from '../../data/moduleVisuals'
import { pxmModeLabel } from '../../selectors/wedge'

const SIZE = 250
const PXM_PURPLE = '#5924AB'

export function PxmKnob() {
  const order = useCockpit((s) => s.capabilityOrder)
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const setActiveByCount = useCockpit((s) => s.setActiveByCount)
  const reset = useCockpit((s) => s.reset)

  const count = active.size
  const allSix = count === 6
  const value = (count / 6) * 100

  const halo: Halo = useMemo(() => {
    if (allSix) return { mode: 'unified', color: PXM_PURPLE }
    return {
      mode: 'segmented',
      segments: order.map((slug) => ({
        active: active.has(slug),
        color: MODULE_VISUALS[slug].accent,
      })),
    }
  }, [allSix, order, active])

  const { onPointerDown, onDoubleClick } = useKnobDrag({
    value,
    onChange: (v) => setActiveByCount(Math.round((v / 100) * 6)),
    onReset: reset,
    pixelsPerFullRange: 240,
  })

  const callsign = pxmModeLabel(active, agents)
  const faceTint = allSix ? 'rgba(89, 36, 171, 0.06)' : undefined

  return (
    <div className="flex flex-col items-center" style={{ position: 'relative' }}>
      <Knob
        size={SIZE}
        value={value}
        halo={halo}
        tickCount={24}
        faceTint={faceTint}
        ariaLabel="PXM master control"
        onPointerDown={onPointerDown}
        onDoubleClick={onDoubleClick}
      />
      <div className="flex flex-col items-center" style={{ marginTop: -4, gap: 2 }}>
        <span
          className="font-display"
          style={{
            color: 'var(--pc-text)',
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: '0.14em',
          }}
        >
          PXM
        </span>
        <span
          className="font-mono"
          style={{
            color: 'var(--pc-text-faint)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Product Experience Management
        </span>
        <span
          className="font-mono"
          style={{
            marginTop: 6,
            color: allSix ? PXM_PURPLE : 'var(--pc-text-dim)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            transition: 'color 600ms ease',
          }}
        >
          {callsign}
        </span>
      </div>
    </div>
  )
}
