import type { DomainSlug } from './types'

export type WedgeMode =
  | 'standby'
  | 'data-centric'
  | 'experience-centric'
  | 'converged'
  | 'full-platform'
  | 'agentic-pxm'

export interface PersonaRecord {
  primaryBuyer: string
  coBuyers: string[]
  salesCycle: string
  decisionFrame: string
}

const DATA_DOMAINS = new Set<DomainSlug>(['pim', 'mdm', 'dam', 'cdp'])
const XP_DOMAINS = new Set<DomainSlug>(['ecommerce', 'dxp-cms'])

export function classifyMix(active: Set<DomainSlug>, agentsIntensity = 0): WedgeMode {
  if (active.size === 0) return 'standby'
  if (active.size === 6) return agentsIntensity > 50 ? 'agentic-pxm' : 'full-platform'
  let hasData = false
  let hasXp = false
  for (const slug of active) {
    if (DATA_DOMAINS.has(slug)) hasData = true
    if (XP_DOMAINS.has(slug)) hasXp = true
  }
  if (hasData && hasXp) return 'converged'
  if (hasData) return 'data-centric'
  return 'experience-centric'
}

export const PERSONAS: Record<WedgeMode, PersonaRecord> = {
  standby: {
    primaryBuyer: '— STANDBY —',
    coBuyers: ['ACTIVATE CAPABILITIES TO DETECT BUYER'],
    salesCycle: '—',
    decisionFrame: '—',
  },
  'data-centric': {
    primaryBuyer: 'IT / SOLUTION ARCHITECTURE',
    coBuyers: ['BUSINESS DOMAIN OWNER', 'DATA GOVERNANCE'],
    salesCycle: '6–9 MONTHS',
    decisionFrame: 'ARCHITECTURAL FIT',
  },
  'experience-centric': {
    primaryBuyer: 'CMO / MARKETING',
    coBuyers: ['DIGITAL EXPERIENCE LEAD', 'E-COMMERCE'],
    salesCycle: '4–7 MONTHS',
    decisionFrame: 'TIME-TO-CHANNEL',
  },
  converged: {
    primaryBuyer: 'CIO + CMO (JOINT)',
    coBuyers: ['CDO', 'DIGITAL OPERATIONS'],
    salesCycle: '7–12 MONTHS',
    decisionFrame: 'CROSS-FUNCTIONAL ROI',
  },
  'full-platform': {
    primaryBuyer: 'C-SUITE (CIO/CTO/CDO/CMO)',
    coBuyers: ['STRATEGIC PLATFORM DECISION'],
    salesCycle: '9–14 MONTHS',
    decisionFrame: 'PLATFORM CONSOLIDATION',
  },
  'agentic-pxm': {
    primaryBuyer: 'CEO + C-SUITE',
    coBuyers: ['BOARD-LEVEL STRATEGIC'],
    salesCycle: '12–18 MONTHS',
    decisionFrame: 'AGENTIC OPERATING MODEL',
  },
}
