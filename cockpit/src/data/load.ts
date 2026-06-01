import type { CapabilitiesFile, CaseStudy } from './types'
import capsData from './generated/capabilities.json'
import casesData from './generated/casestudies.slim.json'

// Data is statically imported so it gets inlined into the JS bundle — required
// for the single-file embed build. Still returns a Promise so the existing
// useEffect callsite doesn't need to change.
export async function loadCockpitData(): Promise<{
  caps: CapabilitiesFile
  cases: CaseStudy[]
}> {
  return {
    caps: capsData as CapabilitiesFile,
    cases: casesData as CaseStudy[],
  }
}
