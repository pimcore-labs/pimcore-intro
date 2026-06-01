# Pimcore Platform Cockpit

An interactive single-page "cockpit" that demonstrates the Pimcore platform as
a configurable control surface. Toggle the six platform modules, dial in agentic
intensity, and watch the buyer persona, headlines, data-spine signal flow, and
matching customer case studies update live.

It's built as a fixed **16:9 stage** (designed pixel-precise against 1920×1080)
that letterboxes to any viewport — intended for demos and presentations.

## Repository layout

- **`cockpit/`** — the Vite + React + TypeScript app. All `npm` commands run from here.
- **`sources/`** — raw inputs and design specs that feed the app:
  - `capabilities-export.json`, `casestudies-export.json` — Pimcore exports consumed by the data build step (never imported directly by the app).
  - `pimcore_cockpit_spec_v2.md`, `v3.md` — product/design specs (`v3.md` is current).
  - Reference images and brand assets.

## Prerequisites

- **Node.js 20+** (developed on Node 24)
- **npm**

## Getting started

```bash
cd cockpit
npm install
npm run dev
```

Vite serves the app at **http://localhost:5173/**. The `predev` hook runs
`build:data` first, so the slim JSON the app loads is always regenerated from
`sources/`.

> **Note:** the generated data under `cockpit/public/data/` is git-ignored and
> has **no committed copy** — it is regenerated on every `dev`/`build` via the
> `predev`/`prebuild` hooks. A fresh clone just needs `npm install`.

## Commands (run from `cockpit/`)

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Vite on `:5173` (regenerates data first). |
| `npm run build` | Typecheck then production build (regenerates data first). |
| `npm run build:single` | Single-file bundle build (`BUILD_TARGET=single`). |
| `npm run build:single:twig` | Single-file build, then wrap as a Twig template. |
| `npm run build:data` | Run `scripts/build-data.ts` — read `../sources/*.json`, write slim JSON to `public/data/`. |
| `npm run preview` | Vite preview of `dist/`. |
| `npm run typecheck` | `tsc --noEmit` over `src/` and `scripts/`. |
| `npm run lint` | ESLint over `src/` and `scripts/`. |

No test runner is configured.

## Architecture overview

- **Data flow** — `scripts/build-data.ts` filters and normalizes the raw Pimcore
  exports into slim JSON in `public/data/`. At startup `src/data/load.ts` fetches
  both files in parallel and hands them to the Zustand store; the raw exports are
  never shipped to the browser.
- **State** — one Zustand store (`src/state/cockpit.ts`) holds the entire
  interactive state: selected industry, locale, active capabilities and their
  order, agentic intensity, and per-module sub-knobs. All mutations go through
  store actions; components subscribe with narrow selectors.
- **Derived state** — pure selectors in `src/selectors/` compute the wedge/PXM
  mode, buyer persona, filtered + scored case studies, and active headlines.
- **Domain model** — six modules (`pim`, `mdm`, `dam`, `cdp`, `dxp-cms`,
  `ecommerce`) split into a **data half** and an **experience half**, which drive
  the wedge classification and the data-spine signal-flow visualization.
- **Keyboard shortcuts** — `1`–`6` toggle modules, `←/→` cycle industries,
  `↑/↓` step agentic intensity, `Space` toggles all six, `R` resets.

The build stack is React 18 + Zustand, framer-motion for entry animation,
d3-shape for the spine geometry, and Tailwind (tokens namespaced `pc-*`).

See [`CLAUDE.md`](CLAUDE.md) for deeper architectural notes and conventions.
