import type { DomainSlug } from '../data/types'
import { classifyMix, type WedgeMode } from '../data/personas'

export function wedgeReadout(
  active: Set<DomainSlug>,
  agentsIntensity = 0,
): { mode: WedgeMode; label: string; tag: string } {
  const mode = classifyMix(active, agentsIntensity)
  switch (mode) {
    case 'standby':
      return { mode, label: 'STANDBY', tag: 'STANDBY' }
    case 'data-centric':
      return { mode, label: 'DATA-CENTRIC', tag: `PARTIAL ${active.size}/6` }
    case 'experience-centric':
      return { mode, label: 'EXPERIENCE-CENTRIC', tag: `PARTIAL ${active.size}/6` }
    case 'converged':
      return {
        mode,
        label: 'CONVERGED',
        tag: active.size >= 4 ? `EXPANSION ${active.size}/6` : `PARTIAL ${active.size}/6`,
      }
    case 'full-platform':
      return { mode, label: 'FULL-PLATFORM', tag: 'PXM MODE ENGAGED' }
    case 'agentic-pxm':
      return { mode, label: 'AGENTIC PXM', tag: 'AGENTIC ORCHESTRATION' }
  }
}

export function pxmModeLabel(active: Set<DomainSlug>, agentsIntensity = 0): string {
  if (active.size === 0) return 'STANDBY'
  if (active.size === 6) {
    return agentsIntensity > 50 ? 'AGENTIC PXM' : 'PXM MODE ENGAGED'
  }
  if (active.size >= 4) return `EXPANSION MODE — ${active.size}/6`
  return `PARTIAL MODE — ${active.size}/6`
}
