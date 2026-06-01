export type DomainSlug = 'pim' | 'mdm' | 'dam' | 'ecommerce' | 'dxp-cms' | 'cdp'
export type CaseTag = 'pim-mdm' | 'dam' | 'cdp' | 'dxp-cms' | 'digital-commerce'
export type IndustrySlug =
  | 'manufacturing'
  | 'technology'
  | 'retail'
  | 'wholesale-distribution'
  | 'food-beverage'
  | 'healthcare'
  | 'travel-and-hotels'
  | 'automotive-and-vehicles'
  | 'media-and-publishing'
  | 'fashion-and-clothing'

export type LocaleCode = 'en' | 'de' | 'nl' | 'fr' | 'it' | 'pl'

export interface Domain {
  id: string
  name: string
  slug: DomainSlug
}

export interface Capability {
  id: string
  name: string
  slug: string
  headline: string
  shortDescription: string
  domains: DomainSlug[]
}

export interface CapabilitiesFile {
  domains: Domain[]
  capabilities: Capability[]
}

export interface CaseStudy {
  id: number
  key: string
  fullPath: string
  top: boolean
  company: string
  revenue: string | null
  countries: string[]
  industries: IndustrySlug[]
  capabilities: CaseTag[]
  description: string
}
