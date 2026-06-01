import { useEffect, useState } from 'react'
import { useCockpit } from '../../state/cockpit'
import { personaFor } from '../../selectors/persona'
import { classifyMix } from '../../data/personas'

const GOLD = '#E8B547'
const PXM_PURPLE = '#5924AB'

export function PersonaPanelLight() {
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const persona = personaFor(active, agents)
  const mode = classifyMix(active, agents)
  const [flicker, setFlicker] = useState(false)

  useEffect(() => {
    setFlicker(true)
    const t = setTimeout(() => setFlicker(false), 600)
    return () => clearTimeout(t)
  }, [mode])

  const accentColor =
    mode === 'agentic-pxm' ? GOLD : mode === 'full-platform' ? PXM_PURPLE : 'var(--pc-text)'

  return (
    <section
      className={`panel ${flicker ? 'animate-flicker' : ''}`}
      style={{ padding: '12px 14px' }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--pc-text-dim)',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        ▾ Buyer Persona — Detected
      </div>
      <div className="flex flex-col font-mono" style={{ gap: 6, fontSize: 11, letterSpacing: '0.14em' }}>
        <div className="flex">
          <span style={{ color: 'var(--pc-text-dim)', width: 120, flexShrink: 0 }}>PRIMARY BUYER</span>
          <span style={{ color: mode === 'standby' ? 'var(--pc-text-faint)' : accentColor, fontWeight: 600 }}>
            {persona.primaryBuyer}
          </span>
        </div>
        <div className="flex">
          <span style={{ color: 'var(--pc-text-dim)', width: 120, flexShrink: 0 }}>CO-BUYERS</span>
          <div className="flex flex-col">
            {persona.coBuyers.map((cb) => (
              <span key={cb} style={{ color: 'var(--pc-text)' }}>
                {cb}
              </span>
            ))}
          </div>
        </div>
        <div className="flex">
          <span style={{ color: 'var(--pc-text-dim)', width: 120, flexShrink: 0 }}>SALES CYCLE</span>
          <span style={{ color: 'var(--pc-text)' }}>{persona.salesCycle}</span>
        </div>
        <div className="flex">
          <span style={{ color: 'var(--pc-text-dim)', width: 120, flexShrink: 0 }}>DECISION FRAME</span>
          <span style={{ color: 'var(--pc-text)' }}>{persona.decisionFrame}</span>
        </div>
      </div>
    </section>
  )
}
