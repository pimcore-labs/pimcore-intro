import { useMemo } from 'react'
import { useCockpit } from '../../state/cockpit'
import { filteredCases } from '../../selectors/filteredCases'
import { CaseCard } from './CaseCard'

const MAX_CARDS = 6

export function CaseStrip() {
  const cases = useCockpit((s) => s.cases)
  const industry = useCockpit((s) => s.selectedIndustry)
  const active = useCockpit((s) => s.activeCapabilities)

  const list = useMemo(
    () => (cases ? filteredCases(cases, industry, active).slice(0, MAX_CARDS) : []),
    [cases, industry, active],
  )

  return (
    <section
      className="relative flex flex-col"
      style={{
        height: 160,
        padding: '6px 18px 12px',
        background:
          'linear-gradient(180deg, rgba(20,20,30,0.03) 0%, rgba(20,20,30,0.01) 100%)',
        borderTop: '1px solid rgba(20,20,30,0.06)',
      }}
    >
      <div
        className="font-mono shrink-0"
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'var(--pc-text-dim)',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        ▾ Customer Stories — Matching Selection
      </div>
      <div className="flex-1 flex items-stretch overflow-x-auto" style={{ gap: 12 }}>
        {list.length === 0 && (
          <div
            className="font-mono self-center"
            style={{ fontSize: 11, color: 'var(--pc-text-dim)', letterSpacing: '0.18em' }}
          >
            ▶ Additional case studies available at pimcore.com/customers
          </div>
        )}
        {list.map((c) => (
          <CaseCard key={c.key} c={c} />
        ))}
      </div>
    </section>
  )
}
