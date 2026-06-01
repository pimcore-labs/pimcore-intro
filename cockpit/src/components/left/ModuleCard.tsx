import { useCallback } from 'react'
import { Knob } from '../center/Knob'
import { useKnobDrag } from '../../hooks/useKnobDrag'
import { useCockpit } from '../../state/cockpit'
import type { DomainSlug } from '../../data/types'
import type { ModuleVisuals } from '../../data/moduleVisuals'

interface ModuleCardProps {
  visuals: ModuleVisuals
}

export function ModuleCard({ visuals }: ModuleCardProps) {
  const isOn = useCockpit((s) => s.activeCapabilities.has(visuals.slug))
  const toggle = useCockpit((s) => s.toggleCapability)

  const onToggle = useCallback(() => toggle(visuals.slug), [toggle, visuals.slug])

  return (
    <div
      className="card-lift flex flex-col"
      style={{
        background: visuals.bgTint,
        borderRadius: 14,
        boxShadow: isOn
          ? `0 1px 0 rgba(255,255,255,0.85) inset, 0 0 0 1.5px ${visuals.accent}55, 0 0 18px ${visuals.accent}1F, 0 12px 28px var(--pc-shadow-soft), 0 2px 6px var(--pc-shadow-glow)`
          : `0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 1px ${visuals.borderTint}, 0 10px 24px var(--pc-shadow-soft), 0 2px 4px var(--pc-shadow-glow)`,
        transition: 'box-shadow 220ms ease, transform 220ms ease',
        padding: '8px 12px',
        position: 'relative',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div className="flex items-center" style={{ gap: 10, height: 28 }}>
        <span
          className="font-mono"
          style={{
            color: visuals.accent,
            fontWeight: 600,
            fontSize: 18,
            opacity: isOn ? 1 : 0.55,
            width: 18,
            textAlign: 'center',
            transition: 'opacity 220ms ease',
          }}
        >
          {visuals.number}
        </span>
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={visuals.accent}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: isOn ? 1 : 0.55, transition: 'opacity 220ms ease' }}
        >
          <path d={visuals.iconPath} />
        </svg>
        <div className="flex flex-col" style={{ marginLeft: 2, lineHeight: 1.05 }}>
          <span
            className="font-display"
            style={{
              color: 'var(--pc-text)',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.05em',
            }}
          >
            {visuals.shortName}
          </span>
          <span
            className="font-mono"
            style={{
              color: 'var(--pc-text-faint)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {visuals.longName}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <PowerButton on={isOn} accent={visuals.accent} onClick={onToggle} />
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: 'rgba(20,20,30,0.05)',
          margin: '6px -12px 4px',
        }}
      />

      {/* Sub-knob row */}
      <div
        className="flex items-start flex-1 min-h-0"
        style={{ gap: 4 }}
      >
        {visuals.subControls.map((label, i) => (
          <SubKnob
            key={label}
            label={label}
            accent={visuals.accent}
            active={isOn}
            slug={visuals.slug}
            idx={i as 0 | 1 | 2}
          />
        ))}
      </div>
    </div>
  )
}

function PowerButton({
  on,
  accent,
  onClick,
}: {
  on: boolean
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: 'none',
        background: on
          ? `radial-gradient(circle at 35% 30%, ${accent}ff 0%, ${accent} 60%, ${accent}aa 100%)`
          : 'radial-gradient(circle at 35% 30%, #fafafa 0%, #d8d8de 80%, #b8b8c0 100%)',
        boxShadow: on
          ? `0 0 0 1.5px ${accent}aa, 0 0 14px 2px ${accent}99, 0 0 24px 4px ${accent}55, inset 0 1px 2px rgba(255,255,255,0.7)`
          : 'inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(20,20,30,0.18), 0 1px 2px var(--pc-shadow-glow)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 220ms ease, box-shadow 220ms ease',
      }}
    >
      <svg
        width={13}
        height={13}
        viewBox="0 0 24 24"
        fill="none"
        stroke={on ? '#fff' : 'var(--pc-text-faint)'}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      >
        <path d="M12 4 V11" />
        <path d="M7 7.5 A6 6 0 1 0 17 7.5" />
      </svg>
    </button>
  )
}

function SubKnob({
  label,
  accent,
  active,
  slug,
  idx,
}: {
  label: string
  accent: string
  active: boolean
  slug: DomainSlug
  idx: 0 | 1 | 2
}) {
  const value = useCockpit((s) => s.subKnobs[slug][idx])
  const setSubKnob = useCockpit((s) => s.setSubKnob)

  const { onPointerDown, onDoubleClick } = useKnobDrag({
    value,
    onChange: (v) => setSubKnob(slug, idx, v),
    onReset: () => setSubKnob(slug, idx, [60, 70, 50][idx]),
    pixelsPerFullRange: 140,
  })

  return (
    <div
      className="flex flex-col items-center"
      style={{
        flex: 1,
        opacity: active ? 1 : 0.55,
        transition: 'opacity 220ms ease',
      }}
    >
      <Knob
        size={28}
        value={value}
        tickCount={9}
        halo={active ? { mode: 'continuous', color: accent } : { mode: 'off' }}
        onPointerDown={onPointerDown}
        onDoubleClick={onDoubleClick}
      />
      <span
        className="font-mono"
        style={{
          fontSize: 8,
          letterSpacing: '0.14em',
          color: 'var(--pc-text-dim)',
          marginTop: 2,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}
