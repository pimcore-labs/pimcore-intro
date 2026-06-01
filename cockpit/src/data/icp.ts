export const DEFAULT_ICP = {
  revenue: '€200m – €2bn',
  geography: 'EU · NA',
  archetype: 'UPPER MID-MARKET',
}

/**
 * Win-driver split. With a single capability, the conversation is point-tool
 * features. The moment a SECOND capability enters the picture, integration
 * (architecture) becomes the dominant buying criterion — no point tool can
 * deliver "any data, any industry, any channel" together. From there the
 * architecture share keeps climbing toward the full-platform story.
 */
const ARCHITECTURE_BY_COUNT = [0, 10, 75, 85, 90, 93, 96] as const

export function winDriverFor(activeCount: number): { architecture: number; features: number } {
  if (activeCount <= 0) return { architecture: 0, features: 0 }
  const n = Math.min(Math.max(activeCount, 0), 6)
  const architecture = ARCHITECTURE_BY_COUNT[n]
  return { architecture, features: 100 - architecture }
}
