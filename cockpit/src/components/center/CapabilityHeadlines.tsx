import { useMemo, useState } from 'react'
import { useCockpit } from '../../state/cockpit'
import { activeHeadlines } from '../../selectors/activeHeadlines'
import { MODULE_VISUALS, MODULE_LIST } from '../../data/moduleVisuals'
import { benefitsFor } from '../../data/capabilityBenefits'
import type { DomainSlug } from '../../data/types'

type Tab = 'capabilities' | 'benefits'

export function CapabilityHeadlines() {
  const caps = useCockpit((s) => s.caps)
  const active = useCockpit((s) => s.activeCapabilities)
  const industry = useCockpit((s) => s.selectedIndustry)
  const [tab, setTab] = useState<Tab>('capabilities')

  const headlineGroups = useMemo(
    () => (caps ? activeHeadlines(caps.capabilities, active) : []),
    [caps, active],
  )

  // Order benefit groups by MODULE_LIST so visual sequence is stable; pull benefits
  // for the currently selected industry × domain pair (falls back to generic copy).
  const benefitGroups = useMemo(
    () =>
      MODULE_LIST.filter((m) => active.has(m.slug)).map((m) => ({
        domain: m.slug,
        benefits: benefitsFor(industry, m.slug),
      })),
    [active, industry],
  )

  if (!caps) return null

  const isCaps = tab === 'capabilities'

  return (
    <section
      className="panel-inset flex flex-col"
      style={{
        padding: '12px 14px 10px',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 10, flexShrink: 0, paddingBottom: 6, borderBottom: '1px solid rgba(20,20,30,0.06)' }}
      >
        <div className="flex items-center" style={{ gap: 6 }}>
          <TabButton label="Active Capabilities" selected={isCaps} onClick={() => setTab('capabilities')} />
          <TabButton label="Active Benefits" selected={!isCaps} onClick={() => setTab('benefits')} />
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.18em',
            color: 'var(--pc-text-faint)',
            fontWeight: 500,
          }}
        >
          {active.size} {active.size === 1 ? 'DOMAIN' : 'DOMAINS'}
        </span>
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-auto" style={{ gap: 6, paddingRight: 4 }}>
        {active.size === 0 && <EmptyState tab={tab} />}
        {isCaps &&
          headlineGroups.map((g) => {
            const visuals = MODULE_VISUALS[g.domain as DomainSlug]
            if (!visuals) return null
            return (
              <DomainBlock
                key={g.domain}
                accent={visuals.accent}
                bgTint={visuals.bgTint}
                borderTint={visuals.borderTint}
                iconPath={visuals.iconPath}
                shortName={visuals.shortName}
                longName={visuals.longName}
                number={visuals.number}
                items={g.headlines.slice(0, 3).map((h) => h.headline)}
              />
            )
          })}
        {!isCaps &&
          benefitGroups.map((g) => {
            const visuals = MODULE_VISUALS[g.domain]
            return (
              <DomainBlock
                key={g.domain}
                accent={visuals.accent}
                bgTint={visuals.bgTint}
                borderTint={visuals.borderTint}
                iconPath={visuals.iconPath}
                shortName={visuals.shortName}
                longName={visuals.longName}
                number={visuals.number}
                items={g.benefits.slice(0, 4)}
              />
            )
          })}
      </div>
    </section>
  )
}

function TabButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono"
      style={{
        background: selected ? 'var(--pc-chassis-2)' : 'transparent',
        border: 'none',
        padding: '4px 10px',
        borderRadius: 6,
        cursor: 'pointer',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: selected ? 700 : 500,
        color: selected ? 'var(--pc-text)' : 'var(--pc-text-dim)',
        boxShadow: selected
          ? '0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 1px rgba(20,20,30,0.06), 0 1px 2px rgba(20,20,30,0.06)'
          : 'none',
        transition: 'background 180ms ease, color 180ms ease, box-shadow 180ms ease',
      }}
    >
      {selected ? '▾' : '▸'} {label}
    </button>
  )
}

interface DomainBlockProps {
  accent: string
  bgTint: string
  borderTint: string
  iconPath: string
  shortName: string
  longName: string
  number: number
  items: string[]
}

function DomainBlock({
  accent,
  bgTint,
  borderTint,
  iconPath,
  shortName,
  longName,
  number,
  items,
}: DomainBlockProps) {
  return (
    <div
      style={{
        background: bgTint,
        borderRadius: 8,
        padding: '6px 10px',
        boxShadow: `0 0 0 1px ${borderTint}, 0 1px 0 rgba(255,255,255,0.6) inset`,
      }}
    >
      <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
        <span
          className="font-mono"
          style={{
            color: accent,
            fontWeight: 700,
            fontSize: 11,
            width: 12,
            textAlign: 'center',
          }}
        >
          {number}
        </span>
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
        <span
          className="font-display"
          style={{
            color: 'var(--pc-text)',
            fontWeight: 700,
            fontSize: 11.5,
            letterSpacing: '0.06em',
          }}
        >
          {shortName}
        </span>
        <span
          className="font-mono"
          style={{
            color: 'var(--pc-text-faint)',
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          {longName}
        </span>
      </div>
      <ul className="flex flex-col" style={{ gap: 1, paddingLeft: 22 }}>
        {items.map((h) => (
          <li
            key={h}
            className="font-display flex items-start"
            style={{
              fontSize: 10.5,
              color: 'var(--pc-text)',
              lineHeight: 1.3,
              gap: 6,
            }}
          >
            <span
              style={{
                color: accent,
                fontSize: 8,
                lineHeight: 1.6,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ▸
            </span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyState({ tab }: { tab: Tab }) {
  const isCaps = tab === 'capabilities'
  return (
    <div
      className="flex flex-col items-center justify-center self-center font-mono"
      style={{
        flex: 1,
        gap: 8,
        padding: '24px 16px',
        color: 'var(--pc-text-faint)',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 24 }}>◌</span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        Engage a module
      </span>
      <span
        style={{
          fontSize: 9,
          letterSpacing: '0.14em',
          maxWidth: 220,
          lineHeight: 1.4,
        }}
      >
        {isCaps
          ? 'Power on a capability in the rail to surface its headline features here.'
          : 'Power on a capability in the rail to see the value it delivers.'}
      </span>
    </div>
  )
}
