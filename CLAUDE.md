# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two top-level directories:

- `cockpit/` — the Vite + React + TypeScript single-page app (the "Pimcore Platform Cockpit"). All `npm` commands run from here.
- `sources/` — raw inputs that feed the app:
  - `capabilities-export.json`, `casestudies-export.json` — Pimcore exports consumed by the data build step (never imported directly by the app).
  - `pimcore_cockpit_spec_v2.md`, `v3.md` — authoritative product/design specs. `v3.md` is current; the code frequently references it by section (e.g. "v3 §9.4", "v3 §11.4"). Read it before making non-trivial UX/visual changes.
  - Reference images (`sample-interface.png`, `texture-knob.png`) and brand assets.

There is no git repo, no monorepo tooling, and only one package.

## Commands (run from `cockpit/`)

- `npm run dev` — start Vite on `:5173`. Runs `build:data` first via the `predev` hook.
- `npm run build` — typecheck then build. Also runs `build:data` first via `prebuild`.
- `npm run build:data` — runs `scripts/build-data.ts` (via `tsx`). Reads `../sources/*.json`, writes slim JSON to `public/data/`. **`public/data/*.json` is gitignored and must be regenerated** — there is no committed copy.
- `npm run typecheck` — `tsc --noEmit` over `src/` and `scripts/`.
- `npm run lint` — ESLint over `src/` and `scripts/` (`.ts`, `.tsx`).
- `npm run preview` — Vite preview of `dist/`.

No test runner is configured.

## Data flow

1. `scripts/build-data.ts` filters/normalizes the raw Pimcore exports:
   - Capabilities: keeps id/name/slug/headline/shortDescription and flattens `domains` to slug array.
   - Case studies: keeps only `casestudy_active`, dedupes by `key`, restricts to the 10 in-scope industries (hardcoded in the script — must match `src/data/industries.ts`), truncates English description to 120 chars.
   - Outputs `public/data/capabilities.json` and `public/data/casestudies.slim.json`.
2. At app start, `src/data/load.ts` fetches both files in parallel and hands them to the Zustand store.
3. Everything downstream reads from the store; the raw exports are never shipped to the browser.

If you add a new industry, capability domain, or case-study field, the change must be made in both the build script's filters/types and `src/data/types.ts`.

## Architecture

Single-page, no router. Renders inside a fixed 16:9 frame (`components/frame/Frame16x9`) that letterboxes to viewport. `App.tsx` is the only layout — header, three-column grid (left module rail / center knob+headlines / right panels stack), spine strip, case strip. `Reveal` wraps regions for staggered framer-motion entry.

### State (Zustand)

`src/state/cockpit.ts` holds the entire interactive state in one store:

- `selectedIndustry`, `activeLocale` — preset selectors.
- `activeCapabilities: Set<DomainSlug>` + `capabilityOrder: DomainSlug[]` — which of the six modules are on, and their fixed hex order (`HEX_ORDER` in `data/capabilityTagMap.ts`).
- `agentsIntensity: 0..100` — drives Agentic-PXM thresholds.
- `subKnobs: Record<DomainSlug, [n,n,n]>` — three 0–100 sub-controls per capability, semantics defined per module in `data/spineBias.ts` (`SUB_KNOB_LAYOUT`).
- `caps`, `cases`, `loadError` — async-load state.

All mutations go through store actions (`toggleCapability`, `setActiveByCount`, `setSubKnob`, `reset`, …). Components subscribe with narrow selectors.

### Derived state (selectors)

`src/selectors/` are pure functions over the store snapshot — call them inside `useCockpit((s) => selector(s.x))` or compose with `useMemo`:

- `wedge.ts` — `wedgeReadout`/`pxmModeLabel` classify the active mix + agents into one of six `WedgeMode` values (`standby`, `data-centric`, `experience-centric`, `converged`, `full-platform`, `agentic-pxm`). Classification logic lives in `data/personas.ts::classifyMix`.
- `persona.ts` — maps `WedgeMode` → buyer persona record.
- `filteredCases.ts` — filters case studies by selected industry, scores `matches` against active capabilities (via `HEX_TO_CASE_TAG`), and sorts: matches first, then `top`, then revenue (parsed from strings like "1.2 BN"), then alphabetical.
- `activeHeadlines.ts` — picks capability headlines to display.

### Domain model — six modules, six wedges, two halves

`DomainSlug = 'pim' | 'mdm' | 'dam' | 'cdp' | 'dxp-cms' | 'ecommerce'`. This six-element ordering is load-bearing: it drives hex layout, the keyboard 1–6 shortcuts, and the wedge math. Two semantic groupings recur:

- **Data half**: `pim`, `mdm`, `dam`, `cdp`. **Experience half**: `ecommerce`, `dxp-cms`. The `data-centric` / `experience-centric` / `converged` modes come from which halves have any active member (`data/personas.ts`).
- **Case-study tags** are coarser than domain slugs — `pim` and `mdm` both map to the `pim-mdm` tag (`HEX_TO_CASE_TAG`). Always go through this map when comparing capabilities to case-study capabilities.

### Spine bias (`data/spineBias.ts`)

The bottom "Data Spine" is a signal-flow visualization. Each capability has an editorial bias score per spine input (erp/plm/suppliers/web_forms/iot/legacy) and per output (web/app/marketplace/print/partners/agents). Each capability's three sub-knobs target the input side, output side, or both (`SUB_KNOB_LAYOUT`). `combineBias()` mixes contributions across active capabilities via element-wise max, modulated by sub-knob "vigor". Keep this math in one place — don't reimplement per-component.

### Keyboard shortcuts

`hooks/useKeyboardShortcuts.ts` is the single source: `1`–`6` toggle modules, `←/→` cycle industries, `↑/↓` step agents by 5, `Space` toggles all-six, `R` resets. Implemented as a global `keydown` listener that opts out when focus is in an input/textarea/select.

## Visual conventions

- Tailwind tokens are namespaced `pc-*` in `tailwind.config.js` (`pc-pim`, `pc-mdm`, `pc-dam`, `pc-cdp`, `pc-dxp`, `pc-commerce`, plus chassis/metal/text variants). Reuse these — do not hardcode brand hex values in components.
- The whole app is designed against a 1920×1080 frame; sizes are pixel-precise. New layout should slot into the existing `Frame16x9` and respect the v3 spec's region map.
- Fonts (Inter, JetBrains Mono) are loaded via `<link>` in `index.html`, not bundled.

## TypeScript / lint notes

- Strict mode on, including `noUnusedLocals`/`noUnusedParameters`. ESLint adds the typical `react-hooks` rules and warns on unused vars (prefix with `_` to allow).
- Project uses `moduleResolution: "Bundler"` and ESM throughout (`"type": "module"`).
