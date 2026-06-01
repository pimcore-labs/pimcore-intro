import { useCockpit } from '../../state/cockpit'
import { INDUSTRY_BENEFITS } from '../../data/benefits'
import { INDUSTRIES } from '../../data/industries'
import { GARTNER_MQ_STATUS, HEX_LABELS } from '../../data/capabilityTagMap'
import type { DomainSlug } from '../../data/types'

const ROW_ORDER: DomainSlug[] = ['mdm', 'dxp-cms', 'pim']

export function GartnerBenefitsPanel() {
  const industry = useCockpit((s) => s.selectedIndustry)
  const active = useCockpit((s) => s.activeCapabilities)
  const all = INDUSTRY_BENEFITS[industry]
  const count = active.size <= 2 ? Math.min(3, all.length) : Math.min(4, all.length)
  const benefits = all.slice(0, count)
  const label = INDUSTRIES.find((i) => i.slug === industry)?.label.toUpperCase() ?? ''

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
        ▾ Gartner Magic Quadrant
      </div>
      <div className="flex flex-col" style={{ gap: 4 }}>
        {ROW_ORDER.map((slug) => {
          const status = GARTNER_MQ_STATUS[slug]
          if (!status) return null
          const live = status === 'current'
          return (
            <div
              key={slug}
              className="flex items-center font-mono"
              style={{ gap: 12, fontSize: 11, letterSpacing: '0.14em' }}
            >
              <span style={{ color: live ? '#58B389' : '#E8B547', fontSize: 13 }}>
                {live ? '✓' : '◐'}
              </span>
              <span style={{ color: 'var(--pc-text)', width: 50 }}>{HEX_LABELS[slug]}</span>
              <span style={{ color: live ? '#58B389' : 'var(--pc-text-dim)' }}>
                {live ? 'CURRENT' : 'ENTRY 2026'}
              </span>
            </div>
          )
        })}
      </div>

      <div className="panel-divider" style={{ margin: '12px -14px 10px' }} />

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
        ▾ Industry Benefits — {label}
      </div>
      <ul className="flex flex-col" style={{ gap: 4 }}>
        {benefits.map((b) => (
          <li key={b} className="flex items-start" style={{ gap: 8 }}>
            <span style={{ color: '#E8B547', fontSize: 12, lineHeight: 1.2 }}>▸</span>
            <span
              className="font-display"
              style={{ fontSize: 11.5, color: 'var(--pc-text)', lineHeight: 1.3 }}
            >
              {b}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
