import { Knob } from './Knob'
import { useKnobDrag } from '../../hooks/useKnobDrag'
import { useCockpit } from '../../state/cockpit'

const SIZE = 150
const GOLD = '#E8B547'
const GOLD_BRIGHT = '#F5C842'

/** Autonomy category from manual to fully autonomous. */
function categoryFor(value: number): string {
  if (value <= 0) return 'MANUAL'
  if (value <= 25) return 'ASSISTED'
  if (value <= 50) return 'CO-PILOT'
  if (value <= 90) return 'AUTONOMOUS'
  return 'FULLY AUTONOMOUS'
}

export function AgentsKnob() {
  const value = useCockpit((s) => s.agentsIntensity)
  const setIntensity = useCockpit((s) => s.setAgentsIntensity)

  const { onPointerDown, onDoubleClick } = useKnobDrag({
    value,
    onChange: (v) => setIntensity(v),
    onReset: () => setIntensity(15),
    pixelsPerFullRange: 220,
  })

  const category = categoryFor(value)
  const haloColor = value >= 67 ? GOLD_BRIGHT : GOLD

  return (
    <div className="flex flex-col items-center" style={{ position: 'relative' }}>
      <Knob
        size={SIZE}
        value={value}
        halo={value > 0 ? { mode: 'continuous', color: haloColor } : { mode: 'off' }}
        tickCount={16}
        ariaLabel="Agents intensity"
        onPointerDown={onPointerDown}
        onDoubleClick={onDoubleClick}
      />
      <div className="flex flex-col items-center" style={{ marginTop: -4, gap: 2 }}>
        <span
          className="font-display"
          style={{
            color: 'var(--pc-text)',
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: '0.14em',
          }}
        >
          AGENTS
        </span>
        <span
          className="font-mono"
          style={{
            marginTop: 2,
            color: value > 0 ? GOLD : 'var(--pc-text-faint)',
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            transition: 'color 300ms ease',
          }}
        >
          {category}
        </span>
        <span
          className="font-mono"
          style={{
            marginTop: 2,
            color: 'var(--pc-text-dim)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.18em',
          }}
        >
          {Math.round(value)}%
        </span>
      </div>
    </div>
  )
}
