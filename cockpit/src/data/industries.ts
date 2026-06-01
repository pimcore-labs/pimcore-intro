import type { IndustrySlug } from './types'

export interface IndustryEntry {
  slug: IndustrySlug
  label: string
  caseCount: number
}

export const INDUSTRIES: IndustryEntry[] = [
  { slug: 'manufacturing', label: 'Manufacturing', caseCount: 170 },
  { slug: 'technology', label: 'Technology', caseCount: 79 },
  { slug: 'retail', label: 'Retail', caseCount: 72 },
  { slug: 'wholesale-distribution', label: 'Wholesale & Distribution', caseCount: 67 },
  { slug: 'food-beverage', label: 'Food & Beverage', caseCount: 46 },
  { slug: 'travel-and-hotels', label: 'Travel & Hospitality', caseCount: 42 },
  { slug: 'automotive-and-vehicles', label: 'Automotive & Vehicles', caseCount: 42 },
  { slug: 'healthcare', label: 'Healthcare', caseCount: 39 },
  { slug: 'media-and-publishing', label: 'Media & Publishing', caseCount: 29 },
  { slug: 'fashion-and-clothing', label: 'Fashion & Clothing', caseCount: 25 },
]
