import type { DomainSlug, IndustrySlug } from './types'

/** Generic per-capability benefits, used as a fallback when no industry-specific
 *  copy is defined. */
export const CAPABILITY_BENEFITS_BASE: Record<DomainSlug, string[]> = {
  pim: [
    'Cut product time-to-market by 40–60%',
    'Single source of truth for every SKU',
    'Multi-channel publishing on autopilot',
  ],
  mdm: [
    'Replace 15–30 disconnected legacy systems',
    'Cross-domain data quality above 95%',
    'Lineage and stewardship out of the box',
  ],
  dam: [
    'Brand consistency across every touchpoint',
    'Asset reuse rate 3–5× higher',
    'Automated rights and license tracking',
  ],
  cdp: [
    'Single customer view across all channels',
    'Real-time identity resolution',
    'Event-driven personalization at scale',
  ],
  'dxp-cms': [
    'Personalized experiences for every visitor',
    'A/B testing and content modelling natively',
    'Omnichannel publishing — web, app, email, print',
  ],
  ecommerce: [
    'B2B and B2C on one platform',
    'Configurable products and quote-to-cart',
    'Marketplace and partner channels ready',
  ],
}

/** Industry-specific benefits per capability. Falls back to CAPABILITY_BENEFITS_BASE
 *  if a domain isn't explicitly defined for an industry. */
export const INDUSTRY_CAPABILITY_BENEFITS: Record<
  IndustrySlug,
  Partial<Record<DomainSlug, string[]>>
> = {
  manufacturing: {
    pim: [
      'New-product TTM cut by 40–60%',
      'Multi-language datasheet publishing',
      'ECLASS / ETIM classification enforced',
    ],
    mdm: [
      'Replace 15–30 fragmented PLM/ERP systems',
      'Distributor master across 100+ partners',
      'Unified supplier and material catalog',
    ],
    dam: [
      'CAD and 3D asset management',
      'Branded distributor asset portals',
      'Multi-region campaign asset reuse',
    ],
    cdp: [
      'Account-level B2B personalization',
      'Distributor and dealer behavior insights',
      'Lead scoring across long sales cycles',
    ],
    'dxp-cms': [
      'Multi-region brand sites at scale',
      'Self-service partner and dealer portals',
      'Localized landing pages by vertical',
    ],
    ecommerce: [
      'Spare-parts e-commerce at industrial scale',
      'B2B configurator to quote-to-cart',
      'Dealer ordering and contract pricing',
    ],
  },

  technology: {
    pim: [
      'Hardware + software SKU master',
      'Auto-generated datasheets and spec pages',
      'Release-cycle aware versioning',
    ],
    mdm: [
      'Customer master across SaaS and on-prem',
      'Account hierarchy and entitlement data',
      'Partner channel master',
    ],
    dam: [
      'Demo videos and screenshot library',
      'Sales collateral version control',
      'Partner co-brand asset templates',
    ],
    cdp: [
      'Free-trial → paid customer journey',
      'Product-led growth signal capture',
      'Real-time account-based marketing',
    ],
    'dxp-cms': [
      'Developer portal and docs hub',
      'Localized product marketing sites',
      'In-product help and embedded content',
    ],
    ecommerce: [
      'Subscription and licensing flows',
      'Channel partner portal commerce',
      'Self-service plan upgrade and renewal',
    ],
  },

  retail: {
    pim: [
      'Omnichannel SKU consistency',
      'Seasonal collection rollout in days',
      'Variant master — size, color, fit',
    ],
    mdm: [
      'Customer master across web, app, store',
      'Loyalty data unified across brands',
      'Vendor and supplier master',
    ],
    dam: [
      'Lookbook and campaign asset library',
      'Auto-format for every retail channel',
      'Influencer asset rights tracked',
    ],
    cdp: [
      '360° customer view across touchpoints',
      'RFM segmentation and triggers',
      'Real-time abandoned-cart recovery',
    ],
    'dxp-cms': [
      'Personalized homepage by audience',
      'Editorial content powering commerce',
      'Rapid landing pages for promotions',
    ],
    ecommerce: [
      'Headless commerce across web, app, kiosk',
      'BOPIS and click-and-collect ready',
      'Promotion engine with 1000s of rules',
    ],
  },

  'wholesale-distribution': {
    pim: [
      'Curated catalog per dealer tier',
      'Bulk SKU import from suppliers',
      'Multi-language catalog publishing',
    ],
    mdm: [
      'Master partner and dealer hierarchy',
      'Tax and regulatory master per region',
      'Cross-dealer pricing master',
    ],
    dam: [
      'Dealer-branded asset portals',
      'Auto-imprint partner logos and codes',
      'Spec sheet and warranty doc library',
    ],
    cdp: [
      'B2B account intelligence',
      'Distributor segment scoring',
      'Cross-dealer demand signals',
    ],
    'dxp-cms': [
      'Branded dealer microsites',
      'Channel-wide promotion publishing',
      'Localized content per region',
    ],
    ecommerce: [
      'Quote-to-cart B2B flows',
      'Tier-based pricing and contracts',
      'Bulk reorder and fast-cart',
    ],
  },

  'food-beverage': {
    pim: [
      'Allergen and nutrition master',
      'Multi-region label compliance',
      'Recipe and ingredient catalog',
    ],
    mdm: [
      'Supplier and ingredient master',
      'Plant and SKU origin tracking',
      'Regulatory master per market',
    ],
    dam: [
      'Brand asset library across regions',
      'Packaging design version control',
      'Campaign asset reuse',
    ],
    cdp: [
      'Loyalty and subscription customer view',
      'Channel preference signals',
      'Direct-to-consumer journey insight',
    ],
    'dxp-cms': [
      'Brand and recipe content sites',
      'Regional language and labeling sites',
      'Chef and creator content management',
    ],
    ecommerce: [
      'Subscription delivery commerce',
      'D2C with regional fulfillment',
      'Cross-sell on dietary preference',
    ],
  },

  healthcare: {
    pim: [
      'Medical device master data',
      'Indication and contraindication mgmt',
      'Multi-region regulatory master',
    ],
    mdm: [
      'Provider and patient master',
      'Drug interaction master',
      'Insurance and plan master',
    ],
    dam: [
      'Compliance-grade asset access control',
      'Clinical imagery library',
      'Patient education asset reuse',
    ],
    cdp: [
      'Patient journey orchestration',
      'Provider engagement signals',
      'Compliance-aware segmentation',
    ],
    'dxp-cms': [
      'Patient portal experience',
      'Provider portal content',
      'Multi-language patient education',
    ],
    ecommerce: [
      'Direct-to-patient supplies commerce',
      'Provider procurement portal',
      'Compliant prescription fulfillment',
    ],
  },

  'travel-and-hotels': {
    pim: [
      'Property, room, and amenity catalog',
      'Activity and tour SKU master',
      'Seasonal package management',
    ],
    mdm: [
      'Guest master across brands',
      'Property and supplier master',
      'Loyalty program master',
    ],
    dam: [
      'Property photography library',
      'Auto-format for OTA channels',
      'Brand asset reuse across portfolio',
    ],
    cdp: [
      'Guest 360° across stays and trips',
      'Real-time upsell triggers',
      'Loyalty tier journey management',
    ],
    'dxp-cms': [
      'Brand and property sites at scale',
      'Localized destination content',
      'Personalized homepage by trip stage',
    ],
    ecommerce: [
      'Direct-booking commerce',
      'Ancillary services upsell',
      'Multi-currency, multi-language flows',
    ],
  },

  'automotive-and-vehicles': {
    pim: [
      'Vehicle config and spec master',
      'Multi-region trim and option mgmt',
      'Parts and accessory catalog',
    ],
    mdm: [
      'Dealer and customer master',
      'VIN lifecycle master',
      'Service and warranty data',
    ],
    dam: [
      'Configurator imagery library',
      'Regional campaign asset reuse',
      'Owner manual and spec docs',
    ],
    cdp: [
      'Owner journey across ownership cycle',
      'Dealer-aware lead scoring',
      'Service-appointment triggers',
    ],
    'dxp-cms': [
      'Brand site with vehicle configurator',
      'Dealer portal content management',
      'Owner portal experiences',
    ],
    ecommerce: [
      'Online vehicle reservation',
      'Parts and accessories commerce',
      'Service-package booking',
    ],
  },

  'media-and-publishing': {
    pim: [
      'Title and edition master',
      'Rights and territories metadata',
      'ISBN and channel-fee management',
    ],
    mdm: [
      'Author, talent, and IP master',
      'Subscriber master across titles',
      'Channel partner master',
    ],
    dam: [
      'Editorial and image asset library',
      'Rights-managed asset workflow',
      'Auto-format for print and digital',
    ],
    cdp: [
      'Subscriber and reader journey',
      'Content engagement signals',
      'Renewal and churn triggers',
    ],
    'dxp-cms': [
      'Publishing platform across titles',
      'Paywall and member-only content',
      'Live / breaking news rapid publish',
    ],
    ecommerce: [
      'Subscription commerce across formats',
      'Single-issue and back-catalog sales',
      'Bundles and gift commerce',
    ],
  },

  'fashion-and-clothing': {
    pim: [
      'Seasonal collection PIM',
      'Variant master — size, color, fit',
      'Sustainability attribute mgmt',
    ],
    mdm: [
      'Brand and supplier master',
      'Material and sourcing master',
      'Customer master across channels',
    ],
    dam: [
      'Lookbook and campaign assets',
      'Influencer and UGC rights tracked',
      'Auto-format for every channel',
    ],
    cdp: [
      'Style preference profiling',
      'Loyalty journey with stylist signals',
      'Cross-brand wardrobe insight',
    ],
    'dxp-cms': [
      'Editorial-driven brand experience',
      'Personalized lookbook and styling',
      'Localized brand site rollout',
    ],
    ecommerce: [
      'Direct-to-consumer at scale',
      'Showroom-to-cart flows',
      'Returns and exchange UX',
    ],
  },
}

export function benefitsFor(industry: IndustrySlug, domain: DomainSlug): string[] {
  return INDUSTRY_CAPABILITY_BENEFITS[industry]?.[domain] ?? CAPABILITY_BENEFITS_BASE[domain]
}
