import { useCockpit } from '../../state/cockpit'
import { DEFAULT_ICP, winDriverFor } from '../../data/icp'
import { wedgeReadout } from '../../selectors/wedge'

const PXM_PURPLE = '#5924AB'
const GOLD = '#E8B547'

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex font-mono" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
      <span style={{ color: 'var(--pc-text-dim)', width: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: accent ?? 'var(--pc-text)', fontWeight: accent ? 600 : 500 }}>
        {value}
      </span>
    </div>
  )
}

export function IcpPanel() {
  const active = useCockpit((s) => s.activeCapabilities)
  const agents = useCockpit((s) => s.agentsIntensity)
  const wedge = wedgeReadout(active, agents)
  const winDriver = winDriverFor(active.size)

  const wedgeColor =
    wedge.mode === 'agentic-pxm'
      ? GOLD
      : wedge.mode === 'full-platform'
        ? PXM_PURPLE
        : wedge.mode === 'standby'
          ? 'var(--pc-text-faint)'
          : 'var(--pc-text)'

  return (
    <section className="panel" style={{ padding: '12px 14px' }}>
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
        ▾ ICP Profile
      </div>
      <div className="flex flex-col" style={{ gap: 6 }}>
        <Row label="REVENUE" value={DEFAULT_ICP.revenue} />
        <Row label="GEOGRAPHY" value={DEFAULT_ICP.geography} />
        <Row label="ARCHETYPE" value={DEFAULT_ICP.archetype} />
        <Row label="WEDGE" value={wedge.label} accent={wedgeColor} />
        <WinDriverRow architecture={winDriver.architecture} features={winDriver.features} />
      </div>
    </section>
  )
}

function WinDriverRow({ architecture, features }: { architecture: number; features: number }) {
  const empty = architecture === 0 && features === 0

  return (
    <div className="flex font-mono" style={{ fontSize: 11, letterSpacing: '0.14em' }}>
      <span style={{ color: 'var(--pc-text-dim)', width: 110, flexShrink: 0 }}>WIN DRIVER</span>
      {empty ? (
        <span style={{ color: 'var(--pc-text-faint)' }}>— STANDBY —</span>
      ) : (
        <div className="flex flex-col" style={{ flex: 1, gap: 4, minWidth: 0 }}>
          <Bar
            label="ARCHITECTURE"
            pct={architecture}
            fill={PXM_PURPLE}
            track="rgba(89,36,171,0.12)"
            emphasized={architecture >= features}
          />
          <Bar
            label="FEATURES"
            pct={features}
            fill="#7BC9A7"
            track="rgba(123,201,167,0.18)"
            emphasized={features > architecture}
          />
        </div>
      )}
    </div>
  )
}

function Bar({
  label,
  pct,
  fill,
  track,
  emphasized,
}: {
  label: string
  pct: number
  fill: string
  track: string
  emphasized: boolean
}) {
  return (
    <div className="flex items-center" style={{ gap: 8, fontSize: 10, minWidth: 0 }}>
      <span
        style={{
          color: emphasized ? 'var(--pc-text)' : 'var(--pc-text-dim)',
          fontWeight: emphasized ? 700 : 500,
          width: 92,
          flexShrink: 0,
          letterSpacing: '0.14em',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 6,
          background: track,
          borderRadius: 4,
          overflow: 'hidden',
          minWidth: 30,
          boxShadow: 'inset 0 1px 1px rgba(20,20,30,0.06)',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: fill,
            borderRadius: 4,
            transition: 'width 350ms ease',
          }}
        />
      </div>
      <span
        style={{
          color: emphasized ? fill : 'var(--pc-text-dim)',
          fontWeight: emphasized ? 700 : 500,
          width: 32,
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {pct}%
      </span>
    </div>
  )
}
