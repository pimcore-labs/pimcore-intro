import { useCockpit } from '../../state/cockpit'
import { INDUSTRIES } from '../../data/industries'
import type { IndustrySlug } from '../../data/types'

const PXM_PURPLE = '#5924AB'

const SHORT_LABEL: Record<IndustrySlug, string> = {
  manufacturing: 'MANUFACTURING',
  technology: 'TECHNOLOGY',
  retail: 'RETAIL',
  'wholesale-distribution': 'WHOLESALE',
  'food-beverage': 'FOOD & BEV',
  healthcare: 'HEALTHCARE',
  'travel-and-hotels': 'TRAVEL',
  'automotive-and-vehicles': 'AUTOMOTIVE',
  'media-and-publishing': 'MEDIA',
  'fashion-and-clothing': 'FASHION',
}

const TOP_ROW: IndustrySlug[] = [
  'manufacturing',
  'technology',
  'retail',
  'wholesale-distribution',
  'media-and-publishing',
]
const BOTTOM_ROW: IndustrySlug[] = [
  'food-beverage',
  'healthcare',
  'travel-and-hotels',
  'automotive-and-vehicles',
  'fashion-and-clothing',
]

export function IndustryPresetLED() {
  const selected = useCockpit((s) => s.selectedIndustry)
  const select = useCockpit((s) => s.selectIndustry)

  const renderRow = (row: IndustrySlug[]) => (
    <div className="flex" style={{ gap: 18 }}>
      {row.map((slug) => {
        const entry = INDUSTRIES.find((i) => i.slug === slug)!
        const isOn = selected === slug
        return (
          <button
            key={slug}
            type="button"
            onClick={() => select(slug)}
            className="flex items-center"
            style={{
              gap: 6,
              border: 'none',
              background: 'transparent',
              padding: '2px 4px',
              cursor: 'pointer',
              minWidth: 0,
            }}
            aria-pressed={isOn}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: isOn
                  ? `radial-gradient(circle at 35% 30%, ${PXM_PURPLE}ff 0%, ${PXM_PURPLE}cc 70%, ${PXM_PURPLE}55 100%)`
                  : 'radial-gradient(circle at 35% 30%, #c4c0b6 0%, #aaa6a0 80%)',
                boxShadow: isOn
                  ? `0 0 8px 1px ${PXM_PURPLE}99, inset 0 1px 1px rgba(255,255,255,0.5)`
                  : 'inset 0 1px 1px rgba(20,20,30,0.18), inset 0 -1px 1px rgba(255,255,255,0.4)',
                flex: 'none',
                transition: 'background 200ms ease, box-shadow 200ms ease',
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.16em',
                color: isOn ? 'var(--pc-text)' : 'var(--pc-text-faint)',
                fontWeight: isOn ? 600 : 500,
                transition: 'color 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {SHORT_LABEL[slug] ?? entry.label.toUpperCase()}
            </span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="panel-inset" style={{ padding: '8px 18px', display: 'inline-block' }}>
      <div className="flex flex-col" style={{ gap: 6 }}>
        {renderRow(TOP_ROW)}
        {renderRow(BOTTOM_ROW)}
      </div>
    </div>
  )
}
