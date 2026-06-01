import type { ScoredCase } from '../../selectors/filteredCases'

const GOLD = '#E8B547'

const TAG_LABEL: Record<string, string> = {
  'pim-mdm': 'PIM·MDM',
  dam: 'DAM',
  cdp: 'CDP',
  'dxp-cms': 'DXP',
  'digital-commerce': 'COMMERCE',
}

export function CaseCard({ c }: { c: ScoredCase }) {
  const matches = c.matches

  return (
    <article
      className="relative shrink-0 flex flex-col"
      style={{
        width: 230,
        height: 120,
        padding: '10px 12px',
        gap: 6,
        borderRadius: 10,
        background: matches ? 'var(--pc-chassis-2)' : 'var(--pc-chassis)',
        boxShadow: matches
          ? `0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 1px ${GOLD}66, 0 0 12px ${GOLD}22, 0 4px 14px var(--pc-shadow-soft)`
          : '0 1px 0 rgba(255,255,255,0.6) inset, 0 1px 2px var(--pc-shadow-glow), 0 4px 12px var(--pc-shadow-soft)',
        opacity: matches ? 1 : 0.78,
      }}
    >
      <div className="flex items-start justify-between" style={{ gap: 8 }}>
        <div
          className="font-display"
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: matches ? '#9C6E1F' : 'var(--pc-text)',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={c.company}
        >
          {c.top && <span style={{ color: GOLD, marginRight: 4 }}>★</span>}
          {c.company}
        </div>
        <div className="flex flex-col items-end shrink-0" style={{ gap: 1 }}>
          {c.countries.length > 0 && (
            <div
              className="font-mono"
              style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--pc-text-faint)' }}
            >
              {c.countries.slice(0, 3).join(' · ')}
            </div>
          )}
          {c.revenue && (
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--pc-text-dim)' }}>
              {c.revenue}
            </div>
          )}
        </div>
      </div>

      <div
        className="font-display"
        style={{
          fontSize: 10.5,
          color: 'var(--pc-text-dim)',
          lineHeight: 1.3,
          flex: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {c.description}
      </div>

      <div className="flex flex-wrap" style={{ gap: 4 }}>
        {c.capabilities.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: '0.16em',
              padding: '2px 5px',
              borderRadius: 3,
              background: matches ? `${GOLD}22` : 'rgba(20,20,30,0.05)',
              color: matches ? '#9C6E1F' : 'var(--pc-text-dim)',
              fontWeight: 600,
            }}
          >
            {TAG_LABEL[tag] ?? tag.toUpperCase()}
          </span>
        ))}
      </div>
    </article>
  )
}
