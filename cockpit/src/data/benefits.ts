import type { IndustrySlug } from './types'

export const INDUSTRY_BENEFITS: Record<IndustrySlug, string[]> = {
  manufacturing: [
    'Cut new-product time-to-market by 40–60%.',
    'Replace 15–30 disconnected legacy systems with one platform.',
    'Compliance-ready: CE, REACH, RoHS, ETIM, ECLASS.',
    'Distributor and dealer enablement at industrial scale.',
  ],
  technology: [
    'Productize complex offerings as data-defined catalog entities.',
    'Multi-tenant data models for white-label scenarios.',
    'API-first delivery to partner ecosystems.',
    'Self-service onboarding for resellers.',
  ],
  retail: [
    'Marketplace-ready syndication to 50+ channels.',
    'One customer view across web, mobile, store.',
    'Launch new brands or markets in weeks, not quarters.',
    'Closed-loop merchandising with real-time signal.',
  ],
  'wholesale-distribution': [
    'Unify catalogs from hundreds of suppliers under one experience.',
    'Customer-specific pricing and contracts without separate systems.',
    'Onboard suppliers 5–10× faster.',
    'B2B buying that meets B2C expectations.',
  ],
  'food-beverage': [
    'Trade-partner-ready content (GS1/GDSN).',
    'Brand consistency across hundreds of campaigns and packaging variants.',
    'D2C alongside retail without channel conflict.',
    'Faster regulatory updates across markets.',
  ],
  healthcare: [
    'Centralize data across multi-entity networks (hospital groups, clinics).',
    'Compliance and audit-grade lineage built in.',
    'Patient portals with WCAG accessibility and multi-language.',
    'Reduce duplicate records, improve care continuity.',
  ],
  'travel-and-hotels': [
    'Multi-market itineraries with localized pricing and availability.',
    'Sustainable-travel storytelling at brand-quality scale.',
    'Integrate booking, content, and CRM in one platform.',
    'Faster response to seasonal and dynamic packaging.',
  ],
  'automotive-and-vehicles': [
    'Showroom-to-fleet product data unified.',
    'Dealer B2B ordering and parts catalog at OEM scale.',
    'Multi-language, multi-region launch infrastructure.',
    'Aftermarket and service portals connected to core master data.',
  ],
  'media-and-publishing': [
    'Massive asset libraries (millions of items) with rights and workflow.',
    'Multi-brand, multi-platform publishing from one source.',
    'Subscriber 360° across web, app, print, events.',
    'Editorial agility without engineering bottlenecks.',
  ],
  'fashion-and-clothing': [
    'Seasonal collection cycles with PIM-driven release calendars.',
    'Brand-coherent storytelling across DTC and wholesale.',
    'Localized presentations across 70+ markets.',
    'Fast lookbook-to-channel publishing.',
  ],
}
