import type { CaseStudy, CaseTag, DomainSlug, IndustrySlug } from '../data/types'
import { HEX_TO_CASE_TAG } from '../data/capabilityTagMap'

export interface ScoredCase extends CaseStudy {
  matches: boolean
}

const REVENUE_RE = /([\d.,]+)\s*(BN|MN|M|B)/i

function revenueRank(rev: string | null): number {
  if (!rev) return -1
  const m = rev.match(REVENUE_RE)
  if (!m) return -1
  const num = parseFloat(m[1].replace(',', '.'))
  const unit = m[2].toUpperCase()
  if (unit === 'BN' || unit === 'B') return num * 1000
  return num
}

export function filteredCases(
  cases: CaseStudy[],
  industry: IndustrySlug,
  active: Set<DomainSlug>,
): ScoredCase[] {
  const wantedTags = new Set<CaseTag>()
  for (const slug of active) wantedTags.add(HEX_TO_CASE_TAG[slug])
  const subset = cases.filter((c) => c.industries.includes(industry))
  const scored = subset.map<ScoredCase>((c) => ({
    ...c,
    matches: wantedTags.size > 0 && c.capabilities.some((t) => wantedTags.has(t as CaseTag)),
  }))
  scored.sort((a, b) => {
    if (a.matches !== b.matches) return a.matches ? -1 : 1
    if (a.top !== b.top) return a.top ? -1 : 1
    const r = revenueRank(b.revenue) - revenueRank(a.revenue)
    if (r !== 0) return r
    return a.company.localeCompare(b.company)
  })
  return scored
}
