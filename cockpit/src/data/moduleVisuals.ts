import type { DomainSlug } from './types'

export interface ModuleVisuals {
  number: number
  slug: DomainSlug
  shortName: string
  longName: string
  accent: string
  bgTint: string
  borderTint: string
  subControls: [string, string, string]
  /** SVG <path d="…"/> data on a 24×24 viewBox; rendered with stroke = accent. */
  iconPath: string
}

/** v3 §4.2 — six capability modules with accents, pastel tints, sub-controls, icons.
 *  Pastel tints lifted to ~12-14% saturation so cards read against the cool chassis. */
export const MODULE_VISUALS: Record<DomainSlug, ModuleVisuals> = {
  pim: {
    number: 1,
    slug: 'pim',
    shortName: 'PIM',
    longName: 'Product Information',
    accent: '#5B8DEF',
    bgTint: '#DCE7FA',
    borderTint: '#B8CCEE',
    subControls: ['MODELS', 'CHANNELS', 'VARIANTS'],
    iconPath:
      'M5 4 H19 V20 H5 Z M5 9 H19 M9 4 V20 M9 13 H17 M9 17 H15',
  },
  mdm: {
    number: 2,
    slug: 'mdm',
    shortName: 'MDM',
    longName: 'Master Data',
    accent: '#9E7BD9',
    bgTint: '#E8DFF4',
    borderTint: '#CFC0E5',
    subControls: ['DOMAINS', 'QUALITY', 'LINEAGE'],
    iconPath:
      'M12 4 C7 4 4 5.6 4 7.5 V16.5 C4 18.4 7 20 12 20 C17 20 20 18.4 20 16.5 V7.5 C20 5.6 17 4 12 4 Z M4 7.5 C4 9.4 7 11 12 11 C17 11 20 9.4 20 7.5 M4 12 C4 13.9 7 15.5 12 15.5 C17 15.5 20 13.9 20 12',
  },
  dam: {
    number: 3,
    slug: 'dam',
    shortName: 'DAM',
    longName: 'Digital Asset',
    accent: '#F38B6C',
    bgTint: '#FADCD2',
    borderTint: '#F1B9A6',
    subControls: ['ASSETS', 'FORMATS', 'RIGHTS'],
    iconPath:
      'M4 5 H20 V19 H4 Z M4 16 L9 11 L13 15 L16 12 L20 16 M15 8.5 A1.5 1.5 0 1 0 15 8.499',
  },
  cdp: {
    number: 4,
    slug: 'cdp',
    shortName: 'CDP',
    longName: 'Customer Data',
    accent: '#7BC9A7',
    bgTint: '#DBEFE3',
    borderTint: '#B5DDC4',
    subControls: ['SOURCES', 'IDENTITY', 'SEGMENTS'],
    iconPath:
      'M12 11 A4 4 0 1 0 12 10.999 M5 20 C5 16.7 8.1 14 12 14 C15.9 14 19 16.7 19 20',
  },
  'dxp-cms': {
    number: 5,
    slug: 'dxp-cms',
    shortName: 'DXP',
    longName: 'Digital Experience',
    accent: '#A06CD5',
    bgTint: '#EADDF5',
    borderTint: '#D4BBE9',
    subControls: ['SITES', 'PERSONALIZATION', 'CONTENT'],
    iconPath:
      'M4 5 H20 V19 H4 Z M4 9 H20 M7 7.2 H7.01 M9.5 7.2 H9.51 M12 7.2 H12.01 M8 13 H16 M8 16 H13',
  },
  ecommerce: {
    number: 6,
    slug: 'ecommerce',
    shortName: 'COMMERCE',
    longName: 'Digital Commerce',
    accent: '#E8B547',
    bgTint: '#FAEAC0',
    borderTint: '#EFD180',
    subControls: ['CATALOG', 'CHECKOUT', 'CHANNELS'],
    iconPath:
      'M5 5 H7 L9 16 H18 L20 8 H8 M10 19.5 A1 1 0 1 0 10 19.499 M16 19.5 A1 1 0 1 0 16 19.499',
  },
}

export const MODULE_LIST: ModuleVisuals[] = [
  MODULE_VISUALS.pim,
  MODULE_VISUALS.mdm,
  MODULE_VISUALS.dam,
  MODULE_VISUALS.cdp,
  MODULE_VISUALS['dxp-cms'],
  MODULE_VISUALS.ecommerce,
]
