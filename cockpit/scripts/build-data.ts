import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../../sources')
// Write into src/ so Vite inlines the JSON into the JS bundle — required for a
// single-file embed (no /data/*.json fetch at runtime).
const OUT = resolve(__dirname, '../src/data/generated')

const IN_SCOPE_INDUSTRIES = new Set([
  'manufacturing',
  'technology',
  'retail',
  'wholesale-distribution',
  'food-beverage',
  'healthcare',
  'travel-and-hotels',
  'automotive-and-vehicles',
  'media-and-publishing',
  'fashion-and-clothing',
])

type RawDomain = { id: string; name: string; slug: string }
type RawCapability = {
  id: string
  name: string
  slug: string
  headline: string
  shortDescription: string
  domains: RawDomain[]
}
type RawCapsFile = { domains: RawDomain[]; capabilities: RawCapability[] }

type RawCase = {
  id: number
  key: string
  fullPath: string
  published: boolean
  fields: {
    company_name?: string
    company_name_short?: string
    Revenue?: string
    countries?: string[]
    casestudy_active?: boolean
    casestudy_top?: boolean
    casestudy_industries?: { key: string }[]
    casestudy_capabilities?: { key: string }[]
    localizedfields?: Record<string, { casestudy_description?: string }>
  }
}
type RawCasesFile = { meta: unknown; items: RawCase[] }

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function truncate(s: string, n: number): string {
  if (!s) return ''
  const flat = stripHtml(s).replace(/\s+/g, ' ').trim()
  if (flat.length <= n) return flat
  return flat.slice(0, n - 1).trimEnd() + '…'
}

function buildCapabilities(): { domains: RawDomain[]; capabilities: unknown[] } {
  const raw = JSON.parse(readFileSync(resolve(SRC, 'capabilities-export.json'), 'utf8')) as RawCapsFile
  const capabilities = raw.capabilities.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    headline: c.headline?.trim() || c.name,
    shortDescription: c.shortDescription ?? '',
    domains: c.domains.map((d) => d.slug),
  }))
  return { domains: raw.domains, capabilities }
}

function buildCases() {
  const raw = JSON.parse(readFileSync(resolve(SRC, 'casestudies-export.json'), 'utf8')) as RawCasesFile
  const seen = new Set<string>()
  const out: unknown[] = []
  for (const item of raw.items) {
    if (!item.fields?.casestudy_active) continue
    if (seen.has(item.key)) continue
    const industries = (item.fields.casestudy_industries ?? [])
      .map((i) => i.key)
      .filter((k) => IN_SCOPE_INDUSTRIES.has(k))
    if (industries.length === 0) continue
    const capabilities = (item.fields.casestudy_capabilities ?? []).map((c) => c.key)
    const description = truncate(
      item.fields.localizedfields?.en?.casestudy_description ?? '',
      120,
    )
    const company = (item.fields.company_name_short ?? item.fields.company_name ?? '').trim()
    seen.add(item.key)
    out.push({
      id: item.id,
      key: item.key,
      fullPath: item.fullPath,
      top: !!item.fields.casestudy_top,
      company,
      revenue: item.fields.Revenue?.trim() || null,
      countries: (item.fields.countries ?? []).filter(Boolean),
      industries,
      capabilities,
      description,
    })
  }
  return out
}

function main() {
  mkdirSync(OUT, { recursive: true })
  const caps = buildCapabilities()
  writeFileSync(resolve(OUT, 'capabilities.json'), JSON.stringify(caps))
  const cases = buildCases()
  writeFileSync(resolve(OUT, 'casestudies.slim.json'), JSON.stringify(cases))
  const capsBytes = JSON.stringify(caps).length
  const casesBytes = JSON.stringify(cases).length
  console.log(
    `[build-data] capabilities: ${caps.capabilities.length} (${(capsBytes / 1024).toFixed(1)} KB)`,
  )
  console.log(
    `[build-data] case studies: ${cases.length} (${(casesBytes / 1024).toFixed(1)} KB)`,
  )
}

main()
