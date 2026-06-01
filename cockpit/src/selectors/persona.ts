import type { DomainSlug } from '../data/types'
import { classifyMix, PERSONAS, type PersonaRecord } from '../data/personas'

export function personaFor(active: Set<DomainSlug>, agentsIntensity = 0): PersonaRecord {
  return PERSONAS[classifyMix(active, agentsIntensity)]
}
