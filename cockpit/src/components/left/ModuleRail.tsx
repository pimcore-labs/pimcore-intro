import { ModuleCard } from './ModuleCard'
import { MODULE_VISUALS } from '../../data/moduleVisuals'
import { AgenticCard } from './AgenticCard'

const DATA_COL = [
  MODULE_VISUALS.pim,
  MODULE_VISUALS.mdm,
  MODULE_VISUALS.dam,
  MODULE_VISUALS.cdp,
]

const EXPERIENCE_COL = [
  MODULE_VISUALS['dxp-cms'],
  MODULE_VISUALS.ecommerce,
]

function ColumnHeader({ children }: { children: string }) {
  return (
    <div
      className="font-mono"
      style={{
        fontSize: 9,
        letterSpacing: '0.22em',
        color: 'var(--pc-text-dim)',
        textTransform: 'uppercase',
        fontWeight: 600,
        padding: '0 4px 4px',
        flexShrink: 0,
      }}
    >
      ▸ {children}
    </div>
  )
}

export function ModuleRail() {
  return (
    <div
      className="flex"
      style={{
        gap: 10,
        padding: '12px 14px 14px 16px',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Column 1: Data Management — 4 cards distributed equally */}
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <ColumnHeader>Data Management</ColumnHeader>
        <div className="flex flex-col" style={{ flex: 1, gap: 8, minHeight: 0 }}>
          {DATA_COL.map((m) => (
            <div key={m.slug} style={{ flex: '1 1 0', minHeight: 0 }}>
              <ModuleCard visuals={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Experience Management (2 cards) + Agentic Management (knob) */}
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
        <ColumnHeader>Experience Management</ColumnHeader>
        <div className="flex flex-col" style={{ flex: 1, gap: 8, minHeight: 0 }}>
          {EXPERIENCE_COL.map((m) => (
            <div key={m.slug} style={{ flex: '1 1 0', minHeight: 0 }}>
              <ModuleCard visuals={m} />
            </div>
          ))}
          {/* Agentic Management — gold-tinted card matching module-card styling */}
          <div className="flex flex-col" style={{ flex: '2 0 0', minHeight: 0, gap: 4 }}>
            <ColumnHeader>Agentic Management</ColumnHeader>
            <div style={{ flex: 1, minHeight: 0 }}>
              <AgenticCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
