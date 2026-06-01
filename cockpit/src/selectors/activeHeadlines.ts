import type { Capability, DomainSlug } from '../data/types'
import { HEX_ORDER, HEX_LABELS } from '../data/capabilityTagMap'

export interface DomainHeadlines {
  domain: DomainSlug
  label: string
  headlines: { name: string; headline: string }[]
}

const PER_DOMAIN_CAP = 5

export function activeHeadlines(
  capabilities: Capability[],
  active: Set<DomainSlug>,
): DomainHeadlines[] {
  if (active.size === 0) return []
  const claimed = new Set<string>()
  const out: DomainHeadlines[] = []
  for (const domain of HEX_ORDER) {
    if (!active.has(domain)) continue
    const headlines = capabilities
      .filter((c) => c.domains.includes(domain) && !claimed.has(c.id))
      .sort((a, b) => a.domains.length - b.domains.length)
      .slice(0, PER_DOMAIN_CAP)
      .map((c) => {
        claimed.add(c.id)
        return { name: c.name, headline: c.headline }
      })
    if (headlines.length === 0) continue
    out.push({ domain, label: HEX_LABELS[domain], headlines })
  }
  return out
}
