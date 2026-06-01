import { create } from 'zustand'
import type {
  CapabilitiesFile,
  CaseStudy,
  DomainSlug,
  IndustrySlug,
  LocaleCode,
} from '../data/types'
import { HEX_ORDER } from '../data/capabilityTagMap'

const DEFAULT_INDUSTRY: IndustrySlug = 'manufacturing'
const DEFAULT_ACTIVE: DomainSlug[] = ['pim']
const DEFAULT_AGENTS = 15
const DEFAULT_ORDER: DomainSlug[] = HEX_ORDER

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export type SubKnobValues = [number, number, number]

const DEFAULT_SUB_KNOBS: Record<DomainSlug, SubKnobValues> = {
  pim: [60, 70, 50],
  mdm: [55, 65, 60],
  dam: [50, 70, 55],
  cdp: [60, 55, 65],
  'dxp-cms': [60, 70, 55],
  ecommerce: [55, 50, 65],
}

export interface CockpitState {
  selectedIndustry: IndustrySlug
  activeCapabilities: Set<DomainSlug>
  capabilityOrder: DomainSlug[]
  agentsIntensity: number
  subKnobs: Record<DomainSlug, SubKnobValues>
  activeLocale: LocaleCode
  caps: CapabilitiesFile | null
  cases: CaseStudy[] | null
  loadError: string | null

  setData(payload: { caps: CapabilitiesFile; cases: CaseStudy[] }): void
  setLoadError(message: string): void
  toggleCapability(slug: DomainSlug): void
  selectIndustry(slug: IndustrySlug): void
  setLocale(locale: LocaleCode): void
  setAgentsIntensity(value: number): void
  setActiveByCount(n: number): void
  setAllCapabilities(on: boolean): void
  setSubKnob(slug: DomainSlug, idx: 0 | 1 | 2, value: number): void
  reset(): void
}

function cloneDefaultSubKnobs(): Record<DomainSlug, SubKnobValues> {
  return Object.fromEntries(
    Object.entries(DEFAULT_SUB_KNOBS).map(([k, v]) => [k, [...v] as SubKnobValues]),
  ) as Record<DomainSlug, SubKnobValues>
}

export const useCockpit = create<CockpitState>((set, get) => ({
  selectedIndustry: DEFAULT_INDUSTRY,
  activeCapabilities: new Set(DEFAULT_ACTIVE),
  capabilityOrder: [...DEFAULT_ORDER],
  agentsIntensity: DEFAULT_AGENTS,
  subKnobs: cloneDefaultSubKnobs(),
  activeLocale: 'en',
  caps: null,
  cases: null,
  loadError: null,

  setData: ({ caps, cases }) => set({ caps, cases }),
  setLoadError: (message) => set({ loadError: message }),

  toggleCapability: (slug) =>
    set((s) => {
      const next = new Set(s.activeCapabilities)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return { activeCapabilities: next }
    }),

  selectIndustry: (slug) => set({ selectedIndustry: slug }),
  setLocale: (locale) => set({ activeLocale: locale }),

  setAgentsIntensity: (value) => set({ agentsIntensity: clamp(Math.round(value), 0, 100) }),

  setActiveByCount: (n) => {
    const order = get().capabilityOrder
    const count = clamp(Math.round(n), 0, order.length)
    set({ activeCapabilities: new Set(order.slice(0, count)) })
  },

  setAllCapabilities: (on) =>
    set((s) => ({
      activeCapabilities: on ? new Set(s.capabilityOrder) : new Set(),
    })),

  setSubKnob: (slug, idx, value) =>
    set((s) => {
      const cur = s.subKnobs[slug]
      const next: SubKnobValues = [...cur] as SubKnobValues
      next[idx] = clamp(Math.round(value), 0, 100)
      return { subKnobs: { ...s.subKnobs, [slug]: next } }
    }),

  reset: () =>
    set({
      selectedIndustry: DEFAULT_INDUSTRY,
      activeCapabilities: new Set(DEFAULT_ACTIVE),
      capabilityOrder: [...DEFAULT_ORDER],
      agentsIntensity: DEFAULT_AGENTS,
      subKnobs: cloneDefaultSubKnobs(),
      activeLocale: 'en',
    }),
}))
