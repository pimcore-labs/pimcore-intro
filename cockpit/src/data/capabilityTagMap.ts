import type { CaseTag, DomainSlug } from './types'

export const HEX_TO_CASE_TAG: Record<DomainSlug, CaseTag> = {
  pim: 'pim-mdm',
  mdm: 'pim-mdm',
  dam: 'dam',
  cdp: 'cdp',
  'dxp-cms': 'dxp-cms',
  ecommerce: 'digital-commerce',
}

export const HEX_LABELS: Record<DomainSlug, string> = {
  pim: 'PIM',
  mdm: 'MDM',
  dam: 'DAM',
  ecommerce: 'COMMERCE',
  'dxp-cms': 'DXP',
  cdp: 'CDP',
}

export const HEX_ORDER: DomainSlug[] = ['pim', 'mdm', 'dam', 'cdp', 'dxp-cms', 'ecommerce']

export const GARTNER_MQ_STATUS: Record<DomainSlug, 'current' | 'entry-2026' | null> = {
  mdm: 'current',
  'dxp-cms': 'current',
  pim: 'entry-2026',
  dam: null,
  ecommerce: null,
  cdp: null,
}
