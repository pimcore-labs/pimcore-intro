import type { DomainSlug } from './types'

export const SPINE_INPUTS = ['erp', 'plm', 'suppliers', 'web_forms', 'iot', 'legacy'] as const
export const SPINE_OUTPUTS = ['web', 'app', 'marketplace', 'print', 'partners', 'agents'] as const

export type SpineInput = (typeof SPINE_INPUTS)[number]
export type SpineOutput = (typeof SPINE_OUTPUTS)[number]

export interface SpineBias {
  inputs: Record<SpineInput, number>
  outputs: Record<SpineOutput, number>
}

export const SPINE_INPUT_LABELS: Record<SpineInput, string> = {
  erp: 'ERP',
  plm: 'PLM',
  suppliers: 'SUPPLIERS',
  web_forms: 'WEB FORMS',
  iot: 'IoT',
  legacy: 'LEGACY',
}

export const SPINE_OUTPUT_LABELS: Record<SpineOutput, string> = {
  web: 'WEB',
  app: 'APP',
  marketplace: 'MARKETPLACE',
  print: 'PRINT',
  partners: 'PARTNERS',
  agents: 'AGENTS',
}

/** v3 §9.4 — editorial bias scores per capability domain. Combine via max. */
export const SPINE_BIAS: Record<DomainSlug, SpineBias> = {
  pim: {
    inputs: { erp: 1.0, plm: 0.9, suppliers: 0.8, web_forms: 0.1, iot: 0.0, legacy: 0.7 },
    outputs: { web: 1.0, app: 0.9, marketplace: 1.0, print: 1.0, partners: 0.8, agents: 0.6 },
  },
  mdm: {
    inputs: { erp: 1.0, plm: 0.6, suppliers: 0.7, web_forms: 0.2, iot: 0.3, legacy: 1.0 },
    outputs: { web: 0.7, app: 0.7, marketplace: 0.7, print: 0.6, partners: 0.9, agents: 0.8 },
  },
  dam: {
    inputs: { erp: 0.4, plm: 0.7, suppliers: 0.6, web_forms: 0.3, iot: 0.0, legacy: 0.5 },
    outputs: { web: 1.0, app: 0.9, marketplace: 0.8, print: 1.0, partners: 0.7, agents: 0.4 },
  },
  cdp: {
    inputs: { erp: 0.3, plm: 0.0, suppliers: 0.1, web_forms: 1.0, iot: 0.9, legacy: 0.4 },
    outputs: { web: 0.9, app: 1.0, marketplace: 0.5, print: 0.0, partners: 0.3, agents: 1.0 },
  },
  'dxp-cms': {
    inputs: { erp: 0.4, plm: 0.2, suppliers: 0.3, web_forms: 1.0, iot: 0.5, legacy: 0.5 },
    outputs: { web: 1.0, app: 1.0, marketplace: 0.4, print: 0.2, partners: 0.5, agents: 0.7 },
  },
  ecommerce: {
    inputs: { erp: 0.9, plm: 0.5, suppliers: 0.6, web_forms: 0.7, iot: 0.2, legacy: 0.6 },
    outputs: { web: 1.0, app: 0.9, marketplace: 1.0, print: 0.3, partners: 0.7, agents: 0.6 },
  },
}

export type SubKnobSide = 'input' | 'output' | 'both'

/** Which spine side each capability's three sub-knobs influence.
 *  Sub-knob order matches MODULE_VISUALS.subControls. */
export const SUB_KNOB_LAYOUT: Record<DomainSlug, [SubKnobSide, SubKnobSide, SubKnobSide]> = {
  // PIM:        MODELS,   CHANNELS, VARIANTS
  pim: ['input', 'output', 'output'],
  // MDM:        DOMAINS,  QUALITY,  LINEAGE
  mdm: ['input', 'both', 'both'],
  // DAM:        ASSETS,   FORMATS,  RIGHTS
  dam: ['input', 'output', 'both'],
  // CDP:        SOURCES,  IDENTITY, SEGMENTS
  cdp: ['input', 'both', 'output'],
  // DXP:        SITES,    PERSONALIZATION, CONTENT
  'dxp-cms': ['output', 'output', 'both'],
  // COMMERCE:   CATALOG,  CHECKOUT, CHANNELS
  ecommerce: ['input', 'output', 'output'],
}

/** Map a sub-knob value (0-100) to a vigor multiplier (0-1.2).
 *  At 0% the capability barely contributes that side; at 100% it pushes harder
 *  than its base bias (slight amplification cap is enforced in combineBias). */
function vigor(value: number): number {
  return Math.max(0, Math.min(1.2, (value / 100) * 1.1 + 0.1))
}

/** Combine bias for a set of active capabilities via max, weighted by per-side
 *  sub-knob vigor. */
export function combineBias(
  active: ReadonlySet<DomainSlug>,
  subKnobs: Record<DomainSlug, [number, number, number]>,
): SpineBias {
  const inputs = { erp: 0, plm: 0, suppliers: 0, web_forms: 0, iot: 0, legacy: 0 }
  const outputs = { web: 0, app: 0, marketplace: 0, print: 0, partners: 0, agents: 0 }
  for (const slug of active) {
    const b = SPINE_BIAS[slug]
    const layout = SUB_KNOB_LAYOUT[slug]
    const knobs = subKnobs[slug] ?? [50, 50, 50]
    let inSum = 0,
      inCnt = 0,
      outSum = 0,
      outCnt = 0
    for (let i = 0; i < 3; i++) {
      const side = layout[i]
      if (side === 'input' || side === 'both') {
        inSum += vigor(knobs[i])
        inCnt++
      }
      if (side === 'output' || side === 'both') {
        outSum += vigor(knobs[i])
        outCnt++
      }
    }
    const inMul = inCnt > 0 ? inSum / inCnt : 1
    const outMul = outCnt > 0 ? outSum / outCnt : 1
    for (const k of SPINE_INPUTS) {
      inputs[k] = Math.max(inputs[k], Math.min(1, b.inputs[k] * inMul))
    }
    for (const k of SPINE_OUTPUTS) {
      outputs[k] = Math.max(outputs[k], Math.min(1, b.outputs[k] * outMul))
    }
  }
  return { inputs, outputs }
}
