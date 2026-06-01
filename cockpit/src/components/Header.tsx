import { useCockpit } from '../state/cockpit'
import { pxmModeLabel } from '../selectors/wedge'
import { IndustryPresetLED } from './header/IndustryPresetLED'
import pimcoreLogo from '../assets/pimcore-logo.svg'

const PXM_PURPLE = '#5924AB'

export function Header() {
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const allSix = active.size === 6
  const callsign = pxmModeLabel(active, agents)

  return (
    <header
      className="flex items-center"
      style={{
        height: 96,
        padding: '0 24px',
        gap: 28,
        position: 'relative',
        background:
          'linear-gradient(180deg, rgba(20,20,30,0.02) 0%, rgba(20,20,30,0) 100%)',
        borderBottom: '1px solid rgba(20,20,30,0.06)',
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center" style={{ minWidth: 200 }}>
        <img
          src={pimcoreLogo}
          alt="Pimcore"
          style={{ height: 44, width: 'auto', display: 'block' }}
        />
      </div>

      {/* Industry preset selector */}
      <div className="flex-1 flex items-center justify-center">
        <IndustryPresetLED />
      </div>

      {/* Right cluster */}
      <div className="flex items-center" style={{ gap: 14 }}>
        <ABToggle />
        <ModeBadge label={callsign} active={allSix} />
        <SettingsGear />
      </div>
    </header>
  )
}

function ABToggle() {
  return (
    <div
      className="font-mono"
      style={{
        fontSize: 11,
        letterSpacing: '0.18em',
        color: 'var(--pc-text-dim)',
        padding: '6px 12px',
        borderRadius: 8,
        background: 'var(--pc-chassis-2)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px rgba(20,20,30,0.06), 0 0 0 1px rgba(20,20,30,0.05)',
      }}
    >
      <span style={{ color: 'var(--pc-text)', fontWeight: 600 }}>A</span>
      <span style={{ margin: '0 6px' }}>/</span>
      <span>B</span>
    </div>
  )
}

function ModeBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className="font-mono"
      style={{
        fontSize: 11,
        letterSpacing: '0.22em',
        color: active ? PXM_PURPLE : 'var(--pc-text-dim)',
        fontWeight: 600,
        padding: '6px 14px',
        borderRadius: 8,
        background: active ? '#F1ECF8' : 'var(--pc-chassis-2)',
        boxShadow: active
          ? `0 0 0 1px ${PXM_PURPLE}33, 0 0 8px ${PXM_PURPLE}22, inset 0 1px 1px rgba(255,255,255,0.6)`
          : '0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px rgba(20,20,30,0.06), 0 0 0 1px rgba(20,20,30,0.05)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        transition: 'background 350ms ease, color 350ms ease, box-shadow 350ms ease',
      }}
    >
      {label}
    </div>
  )
}

function SettingsGear() {
  return (
    <button
      type="button"
      aria-label="Settings"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: 'none',
        background:
          'radial-gradient(circle at 35% 30%, #FAFAFB 0%, #D6D6DC 60%, #9A9AA4 100%)',
        boxShadow:
          '0 1px 0 rgba(255,255,255,0.85) inset, 0 1px 2px rgba(20,20,30,0.1), 0 4px 10px rgba(20,20,30,0.08), 0 0 0 1px rgba(20,20,30,0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#5A5A66" strokeWidth={1.6}>
        <circle cx={12} cy={12} r={3} />
        <path d="M19.4 15a8 8 0 0 0 0-6l2-1.6-2-3.4-2.4 1a8 8 0 0 0-5.2-3L11.4 1H8.6l-.4 1.9a8 8 0 0 0-5.2 3l-2.4-1-2 3.4 2 1.6a8 8 0 0 0 0 6l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 5.2 3l.4 1.9h2.8l.4-1.9a8 8 0 0 0 5.2-3l2.4 1 2-3.4Z" />
      </svg>
    </button>
  )
}
