import { AgentsKnob } from '../center/AgentsKnob'
import { useCockpit } from '../../state/cockpit'

const GOLD = '#E8B547'
const GOLD_BG = '#FAEAC0'
const GOLD_BORDER = '#EFD180'

/** Card-style container for the Agents knob — matches the module-card styling. */
export function AgenticCard() {
  const intensity = useCockpit((s) => s.agentsIntensity)
  const isOn = intensity > 0

  return (
    <div
      className="card-lift flex flex-col items-center justify-center"
      style={{
        background: GOLD_BG,
        borderRadius: 14,
        boxShadow: isOn
          ? `0 1px 0 rgba(255,255,255,0.85) inset, 0 0 0 1.5px ${GOLD}55, 0 0 18px ${GOLD}1F, 0 12px 28px var(--pc-shadow-soft), 0 2px 6px var(--pc-shadow-glow)`
          : `0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 1px ${GOLD_BORDER}, 0 10px 24px var(--pc-shadow-soft), 0 2px 4px var(--pc-shadow-glow)`,
        transition: 'box-shadow 220ms ease, transform 220ms ease',
        padding: '8px 12px',
        position: 'relative',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <AgentsKnob />
    </div>
  )
}
