# Pimcore Platform Cockpit — Concept & Specification (v2)

A 16:9 single-page web application that lets a viewer dial in any combination of Pimcore platform capabilities and any target industry, and instantly see the resulting use cases, business benefits, ideal customer profile, buyer personas, and matching real customer case studies. The interface is styled as a high-tech mission-control cockpit. Its primary purpose is to make the breadth and combinatorial value of Pimcore's platform legible in under sixty seconds — for investor conversations, partner enablement, and senior-level sales discovery.

**v2 changes from v1:** All product taxonomy, capabilities, and case studies now align to the canonical Pimcore data exports (`capabilities-export.json`, `casestudies-export.json`). Industry coverage expands from seven to ten. Case study library replaced with real high-profile customers (AUDI, Ferrero, Bloomberg, Bauhaus, Saint-Gobain Weber, GANT, Liebherr, Burger King, Eberspächer, Media Saturn). Use cases panel sources content from the real 42-capability descriptions rather than hand-authored strings. Six locales are pre-supported (en, de, nl, fr, it, pl).

---

## 1. Purpose & Audiences

The cockpit exists to solve a single rhetorical problem: Pimcore's "any data, any industry, any channel" platform story is true and powerful, but flat slides cannot show the *combinatorial* nature of the platform — the fact that PIM × DAM × DXP for a manufacturer is a different value story than PIM × Commerce for a wholesaler, and that all six capabilities used together produce PXM, which is more than the sum of its parts.

The cockpit makes this combinatorial story tactile. The viewer drives. They see the platform reconfigure itself to their world.

**Primary audiences**

- **Investors (PSG and similar Tier-1 PE/strategic).** Used live in management-presentation Q&A or as pre-read material. Demonstrates platform depth without forcing a long product tour.
- **C-level prospects.** Used by AEs in discovery sessions to map Pimcore's capability surface against the prospect's specific industry context.
- **Partner enablement.** Used by SI partners as a conversation tool with their own clients.
- **Internal alignment.** Used inside Pimcore as a shared mental model for how capabilities map to industries.

**Non-audiences** (deliberate)

- End users / practitioners. This is not a demo of the product; it is a demo of the *positioning*.
- Highly technical buyers wanting a feature deep-dive. Pimcore Studio and live demos serve that purpose.

---

## 2. Concept Vision

### 2.1 The metaphor

A spacecraft mission-control cockpit. The viewer is at the controls. Two primary inputs (capability cluster, industry dial) drive a set of live readouts (use cases, benefits, ICP profile, personas, case studies). The aesthetic is rooted in Pimcore's own "Pimconauts" identity from Inspire 2026 — aerospace, technical, premium, slightly playful, never cheesy.

### 2.2 The single moment that has to land

When all six capabilities are activated, the central PXM core lights up in Pimcore neon yellow-green and snaps into "PXM MODE ENGAGED." This is the moment that visually proves: *the magic is the suite, not any one module.* Every other design decision is in service of making this moment feel earned.

### 2.3 Tone

- High-tech but not sci-fi cliché. No Tron, no neon-green Matrix waterfalls.
- Mil-spec / aerospace UI cues: corner brackets, segmented displays, LED indicators, mono readouts, subtle scan lines. Used with restraint.
- Premium, not gamified. This is a tool serving a serious business conversation.
- Pimcore brand-coherent: deep black, Pimcore purple, Pimcore gold, neon yellow-green from the Inspire 2026 visual system.

---

## 3. Layout (16:9 Frame)

The application renders inside a fixed 16:9 frame that scales to fit any viewport (letterboxing on top/bottom or sides as needed). All internal proportions are constant; the frame is uniformly scaled. Reference resolution is 1920 × 1080.

### 3.1 Region map

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                              ~70 px high    │
├──────────────────┬─────────────────────────────┬────────────────────────┤
│                  │                             │                        │
│  LEFT PANEL      │      CENTER PANEL           │   RIGHT PANEL          │
│  ~22% width      │      ~52% width             │   ~26% width           │
│  ~420 px         │      ~1000 px               │   ~500 px              │
│                  │                             │                        │
│  - Industry dial │   - Capability hexagon      │   - Capability         │
│  - ICP readout   │   - Central PXM core        │     headlines          │
│  - Gartner MQ    │   - PXM progress meter      │   - Industry benefits  │
│    status        │                             │   - Buyer persona      │
│                  │                             │                        │
├──────────────────┴─────────────────────────────┴────────────────────────┤
│  CASE STUDY STRIP                                       ~140 px high    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Region purposes

| Region | Purpose |
|---|---|
| Header | Branding, global state (PXM mode, capability count), system clock, breadcrumb of current selection. |
| Left panel | Inputs: industry selection. Context: ICP profile, Gartner MQ status. |
| Center panel | Primary input: capability multi-select. Primary visual payoff: PXM core. |
| Right panel | Outputs: capability headlines for the selected domains, industry-level benefits, buyer persona. |
| Case strip | Real-world proof: matching Pimcore customer case studies. |

---

## 4. The Capability Hexagon (Center)

The defining visual element. Six capability cells arranged hexagonally around a central PXM core.

### 4.1 Capabilities — six cells, mapped to canonical Pimcore data

| Cell label | Hex position | Canonical domain (from `capabilities-export.json`) | Domain slug | Gartner MQ |
|---|---|---|---|---|
| **PIM** | 12 o'clock | PIM (Product Information Management) | `pim` | Entry expected Autumn 2026 |
| **MDM** | 2 o'clock | MDM (Master Data Management) | `mdm` | ✓ Current MQ member |
| **DAM** | 4 o'clock | DAM (Digital Asset Management) | `dam` | — |
| **COMMERCE** | 6 o'clock | ECommerce (Digital Commerce Framework) | `ecommerce` | — |
| **DXP** | 8 o'clock | DXP/CMS (Digital Experience Platform) | `dxp-cms` | ✓ Current MQ member |
| **CDP** | 10 o'clock | CDP (Customer Data Platform) | `cdp` | — |

The hexagon arrangement places the data-management capabilities (PIM, MDM, DAM, CDP) at the four "data side" positions and the experience-management capabilities (DXP, Commerce) at the two "experience side" positions, forming a natural top-half / bottom-half visual narrative.

### 4.2 Capability ↔ case study tag mapping (critical)

The Pimcore case study database tags cases with five capability categories, not six. PIM and MDM share one tag; DXP/CMS is a single tag; Commerce uses the slug `digital-commerce`. The cockpit's six-cell hexagon must map to this five-tag taxonomy when filtering case studies:

| Hex cell selected | Case study tag matched |
|---|---|
| PIM | `pim-mdm` |
| MDM | `pim-mdm` |
| DAM | `dam` |
| CDP | `cdp` |
| DXP | `dxp-cms` |
| COMMERCE | `digital-commerce` |

This means selecting PIM alone, MDM alone, or both PIM and MDM all match the same set of case studies — which is faithful to how the Pimcore catalog actually classifies real-world implementations.

### 4.3 Button states

Each capability cell is a hexagonal shape with three visual states:

- **Inactive.** Dark fill, dim border, label in muted gray.
- **Active.** Border lights up gold/purple gradient, gold LED indicator below label, soft glow.
- **Hover (when inactive).** Border lifts to brighter purple, subtle scale up.

A capability that is in the Gartner Magic Quadrant carries a small "GARTNER MQ" badge in the top-right corner of the cell, in neon yellow-green. PIM carries a smaller "MQ ENTRY 2026" badge in muted form to telegraph the upcoming entry.

### 4.4 The PXM core (center)

A circular element at the geometric center, surrounded by three concentric rings.

| Number of capabilities active | State |
|---|---|
| 0 | Dimmed. Reads "STANDBY". |
| 1–3 | Purple breathing glow. Reads "PARTIAL MODE — N/6". |
| 4–5 | Brighter purple, more intense breathing. Reads "EXPANSION MODE — N/6". |
| 6 | Switches to neon yellow-green. Hard pulse animation. Reads "PXM MODE ENGAGED". |

When a capability is active, a faint connection line draws from the PXM core outward to that capability cell, like radial spokes. With six active, the full radial pattern is visible — visually closing the loop.

### 4.5 PXM progress meter

Below the hexagon, a horizontal six-segment LED bar fills as capabilities are added. Annotated:

```
[ ■ ][ ■ ][ ■ ][ □ ][ □ ][ □ ]    PXM MODE   3/6   PARTIAL
```

When all six are filled, the label changes to "PXM MODE ENGAGED" in neon yellow-green.

---

## 5. The Industry Dial (Left Panel)

A vertical list of industry buttons styled as illuminated hardware switches. Single-select. The list is drawn from the actual industry tagging present in the case study database, ordered by case-count strength.

### 5.1 Industries (v2 — expanded to 10)

| Industry | Industry slug | Active case studies | Manufacturing-share alignment |
|---|---|---:|---|
| Manufacturing | `manufacturing` | 170 | Pimcore primary segment (~65% of customer base) |
| Technology | `technology` | 79 | — |
| Retail | `retail` | 72 | — |
| Wholesale & Distribution | `wholesale-distribution` | 67 | — |
| Food & Beverage | `food-beverage` | 46 | CPG-adjacent |
| Healthcare | `healthcare` | 39 | — |
| Travel & Hospitality | `travel-and-hotels` | 42 | — |
| Automotive & Vehicles | `automotive-and-vehicles` | 42 | Strong overlap with Manufacturing |
| Media & Publishing | `media-and-publishing` | 29 | — |
| Fashion & Clothing | `fashion-and-clothing` | 25 | — |

(Counts as of `casestudies-export.json` snapshot 2026-05-08, active cases only.)

Industries omitted from the v1 dial but present in the data: Education (35), Arts/Entertainment/Sport (29), Services & Finance (24), Transportation (21), Real Estate & Construction (18), Telecommunication (9), Energy (8). These can be reached through a future "OTHER" expansion option, or kept off-dial entirely. See open question 3.

Manufacturing is selected by default on first load (highest-share segment, richest content, strongest investor narrative).

### 5.2 ICP readout (below the dial)

A boxed "INSTRUMENT READOUT" displaying the ICP for the currently selected industry. Format is mono, like a flight readout:

```
ICP PROFILE ─────────────────
REVENUE         €200m – €2bn
GEOGRAPHY       EU · NA
ARCHETYPE       MID-MARKET
WEDGE           DATA-CENTRIC
WIN DRIVER      75% ARCHITECTURE
                25% FEATURES
```

The "WEDGE" line shifts based on the active capability mix:

| Active mix | Wedge readout |
|---|---|
| Only PIM/MDM/DAM/CDP | DATA-CENTRIC |
| Only DXP/Commerce | EXPERIENCE-CENTRIC |
| Mixed | CONVERGED |
| All 6 | FULL-PLATFORM |

### 5.3 Gartner MQ status (below ICP readout)

A small dedicated panel:

```
GARTNER MAGIC QUADRANT ──────
✓  MDM         CURRENT
✓  DXP         CURRENT
◐  PIM         AUTUMN 2026
```

---

## 6. Output Panels (Right)

Three stacked panels. All content updates live based on the (industry × capabilities) selection.

### 6.1 Capability headlines (top)

Title: `ACTIVE CAPABILITIES — [N] DOMAINS`

For each active capability domain, the panel surfaces 3–5 specific Pimcore capabilities from the canonical capability export, formatted as concise headlines. Source field: `capabilities[].headline` (with `shortDescription` available on hover or in a v2 expanded view).

Example output for PIM + DAM active:

```
[PIM]   Advanced Data Modeling
[PIM]   Comprehensive Product Information Management
[PIM]   Innovative Multi-Channel Publishing
[PIM]   Flexible Data Onboarding Capabilities
[PIM]   Seamless Data Distribution

[DAM]   Digital Asset Management
[DAM]   Brand Portals
[DAM]   Streamlined Digital Asset Access
[DAM]   Flexible and Scalable File Handling
[DAM]   Seamless Asset Conversion
```

Selection logic:

1. Filter the 42 capabilities to those whose `domains[]` array contains a domain that is currently active.
2. Within each domain, prioritize capabilities that are exclusive to that domain (i.e., domain-defining), then cross-domain capabilities ranked by relevance.
3. Cap at 5 per active domain to keep the panel readable.

When zero capabilities are active, the panel shows: `▶ ACTIVATE CAPABILITIES TO VIEW PIMCORE FEATURES`.

### 6.2 Industry benefits (middle)

Title: `OPERATIONAL BENEFITS — [INDUSTRY]`

A list of 3–5 outcome statements scoped to the industry. These are the business case lines an AE or investor would want to remember. Format:

```
▸ Cut new-product time-to-market by 40–60%.
▸ Replace 15–30 disconnected legacy systems with one platform.
▸ Compliance-ready: CE, REACH, RoHS, ETIM, ECLASS.
▸ Distributor and dealer enablement at industrial scale.
```

Benefits are industry-driven (not capability-driven), and curated editorially per industry. The full set is in Section 10. The number shown can scale with the count of active capabilities (e.g., show 3 benefits at 1–2 caps active, 5 benefits at 5–6 caps active) to make the panel feel responsive.

### 6.3 Buyer persona (bottom)

Title: `BUYER PERSONA — DETECTED`

The persona panel computes the likely buying center based on the active capability mix. Format:

```
PRIMARY BUYER     IT / SOLUTION ARCHITECTURE
CO-BUYERS         BUSINESS DOMAIN OWNER
                  DATA GOVERNANCE
SALES CYCLE       6–9 MONTHS
DECISION FRAME    ARCHITECTURAL FIT
```

Persona logic table:

| Active capability mix | Primary buyer | Co-buyers |
|---|---|---|
| Only data-side (PIM, MDM, DAM, CDP) | IT / Solution Architecture | Business Domain Owner, Data Governance |
| Only experience-side (DXP, Commerce) | CMO / Marketing | Digital Experience Lead, E-commerce |
| Mixed (data + experience) | CIO + CMO (joint) | CDO, Digital Operations |
| All six (PXM mode) | C-Suite (CIO/CTO/CDO/CMO) | Strategic platform decision |

When the persona switches due to a selection change, the panel briefly flickers to signal the shift — a small UI cue that buying centers are sensitive to capability mix.

---

## 7. Case Study Strip (Bottom)

A horizontal row of 4–6 case study cards. The cards are filtered to the currently selected industry, sorted by (top-flag desc, revenue desc, name asc). Cards whose capability tags overlap with the active capability selection (after the mapping in Section 4.2) are highlighted with a gold border and brighter background; non-matching cards are visible but dimmed.

### 7.1 Card content

Each card shows:

- Customer name (display font, Chakra Petch bold) — `company_name_short` or `company_name`
- Country flag codes (mono) — `countries`
- Revenue badge (mono) — `Revenue` field, when present (e.g., `60BN €`, `4BN €`)
- Capability pills (small mono badges) — one per `casestudy_capabilities` tag
- One-line description (40–60 characters) — truncated `casestudy_description` from the locale-active `localizedfields`
- "READ →" link — constructed from `fullPath` (e.g., `https://pimcore.com/en/customers/{key}`)

### 7.2 Card behavior

- Click → opens the canonical Pimcore case study URL in a new tab.
- Hover → border brightens, slight upscale.

### 7.3 Empty state

If the industry has no case studies in the active locale, the strip reads: `▶ ADDITIONAL CASE STUDIES AVAILABLE AT PIMCORE.COM/EN/CUSTOMERS`.

---

## 8. Header Bar

The header is a thin top strip carrying:

- **Left:** Pimcore logo, then `PLATFORM COCKPIT` in display font.
- **Center:** PXM mode indicator (`STANDBY` / `PARTIAL MODE 3/6` / `PXM MODE ENGAGED`) styled as a flight-status callsign.
- **Right cluster:** small live indicators in mono — `542 CUSTOMER STORIES · 17 INDUSTRIES · 6 DOMAINS · 75% ARCH WIN`. These are decorative status indicators that double as confidence-building "live" platform stats. Optional alternate stat block for investor context: `~430 CUSTOMERS · 3,000+ INSTALLS · €13M ARR · 75% ARCH WIN`.
- **Far right:** system clock (HH:MM:SS, mono, slowly ticking) and locale switcher (EN / DE / NL / FR / IT / PL).

---

## 9. Data Model

The cockpit consumes two canonical Pimcore JSON exports plus a small set of editorially curated tables (industry benefits, persona logic). All content is data-driven and refreshable.

### 9.1 Source 1 — `capabilities-export.json`

Top-level shape:

```
{
  "capabilities": [ { ...capability } ],   // 42 items
  "domains":      [ { ...domain } ]        //  6 items
}
```

Domain record:

```
{ "id": "3", "name": "PIM", "slug": "pim" }
```

Capability record (used fields only):

```
{
  "id": "8",
  "name": "Data Modelling",
  "slug": "data-modelling",
  "headline": "Advanced Data Modeling",
  "shortDescription": "Pimcore's advanced data modeling allows ...",
  "longDescription": "<p>...</p>",
  "benefits": [],
  "domains": [
    { "id": "3", "name": "PIM",  "slug": "pim" },
    { "id": "5", "name": "MDM",  "slug": "mdm" },
    { "id": "4", "name": "DAM",  "slug": "dam" },
    { "id": "290","name": "ECommerce", "slug": "ecommerce" },
    { "id": "291","name": "CDP", "slug": "cdp" }
  ]
}
```

The cockpit primarily uses `name`, `headline`, `shortDescription`, and `domains[].slug` for filtering and rendering. `longDescription` is HTML and is reserved for an optional tooltip / expanded view in v2.

### 9.2 Source 2 — `casestudies-export.json`

Top-level shape:

```
{
  "meta":  { "class": "casestudy", "count": 585, "locales": ["en","nl","fr","de","pl","it"] },
  "items": [ { ...case } ]   // 585 items, 542 active
}
```

Case record (used fields only):

```
{
  "id": 652,
  "key": "audi-dealer-b2b-shop",
  "fullPath": "/casestudies/audi-dealer-b2b-shop",
  "published": true,
  "fields": {
    "company_name": "Audi AG",
    "company_name_short": "Audi AG",
    "Revenue": "60BN €",
    "countries": ["DE"],
    "casestudy_active": true,
    "casestudy_top": true,
    "casestudy_industries": [
      { "key": "manufacturing" },
      { "key": "automotive-and-vehicles" }
    ],
    "casestudy_capabilities": [
      { "key": "dxp-cms" },
      { "key": "pim-mdm" },
      { "key": "digital-commerce" },
      { "key": "dam" }
    ],
    "localizedfields": {
      "en": {
        "casestudy_name": "...",
        "casestudy_description": "...",
        "wysiwyg": "..."
      },
      "de": { ... },
      "fr": { ... },
      ...
    }
  }
}
```

The cockpit filters on `casestudy_active = true`, `casestudy_industries[].key`, `casestudy_capabilities[].key`. It renders `company_name_short`, `countries`, `Revenue`, `casestudy_description` (locale-aware), and links to `https://pimcore.com/{locale}/customers/{key}`.

### 9.3 Editorial table — industry benefits

Per-industry curated benefits list (3–5 strings per industry). Maintained as a small JSON file alongside the cockpit code. Full content in Section 10.

### 9.4 Editorial table — persona logic

Per capability-mix archetype (data-only, experience-only, mixed, full-platform) → persona record (primary buyer, co-buyers, sales cycle band, decision frame). Maintained in code. Full content in Section 6.3.

### 9.5 Editorial table — ICP profile

Per-industry ICP record (revenue band, geography, archetype, win driver). For v1, a single shared ICP applies across all industries (mid-market manufacturing-led, €200m–€2bn, EU+NA). Per-industry overrides can be added incrementally.

### 9.6 Cockpit application state

Two pieces of state drive everything:

```
state = {
  selectedIndustry:    'manufacturing',           // single value, slug
  activeCapabilities:  Set<DomainSlug>,           // 0–6 from the 6 domain slugs
  activeLocale:        'en'                       // one of meta.locales
}
```

All output panels are pure derivations of this state.

---

## 10. Editorial Content

The cockpit is data-driven for capabilities and case studies. Three things require curated editorial copy: industry benefits, persona records, and (optionally) industry-specific ICP overrides.

### 10.1 Industry benefits

| Industry | Benefit lines (3–5) |
|---|---|
| Manufacturing | Cut new-product time-to-market by 40–60%. · Replace 15–30 disconnected legacy systems. · Compliance-ready: CE, REACH, RoHS, ETIM, ECLASS. · Distributor and dealer enablement at industrial scale. |
| Technology | Productize complex offerings as data-defined catalog entities. · Multi-tenant data models for white-label scenarios. · API-first delivery to partner ecosystems. · Self-service onboarding for resellers. |
| Retail | Marketplace-ready syndication to 50+ channels. · One customer view across web, mobile, store. · Launch new brands or markets in weeks, not quarters. · Closed-loop merchandising with real-time signal. |
| Wholesale & Distribution | Unify catalogs from hundreds of suppliers under one experience. · Customer-specific pricing and contracts without separate systems. · Onboard suppliers 5–10× faster. · B2B buying that meets B2C expectations. |
| Food & Beverage | Trade-partner-ready content (GS1/GDSN). · Brand consistency across hundreds of campaigns and packaging variants. · D2C alongside retail without channel conflict. · Faster regulatory updates across markets. |
| Healthcare | Centralize data across multi-entity networks (hospital groups, clinics). · Compliance and audit-grade lineage built in. · Patient portals with WCAG accessibility and multi-language. · Reduce duplicate records, improve care continuity. |
| Travel & Hospitality | Multi-market itineraries with localized pricing and availability. · Sustainable-travel storytelling at brand-quality scale. · Integrate booking, content, and CRM in one platform. · Faster response to seasonal and dynamic packaging. |
| Automotive & Vehicles | Showroom-to-fleet product data unified. · Dealer B2B ordering and parts catalog at OEM scale. · Multi-language, multi-region launch infrastructure. · Aftermarket and service portals connected to core master data. |
| Media & Publishing | Massive asset libraries (millions of items) with rights and workflow. · Multi-brand, multi-platform publishing from one source. · Subscriber 360° across web, app, print, events. · Editorial agility without engineering bottlenecks. |
| Fashion & Clothing | Seasonal collection cycles with PIM-driven release calendars. · Brand-coherent storytelling across DTC and wholesale. · Localized presentations across 70+ markets. · Fast lookbook-to-channel publishing. |

### 10.2 ICP profile (default, v1)

```
REVENUE       €200m – €2bn
GEOGRAPHY     EU · NA
ARCHETYPE     UPPER MID-MARKET
WEDGE         (computed from active capability mix)
WIN DRIVER    75% ARCHITECTURE / 25% FEATURES
```

Per-industry ICP overrides are out of scope for v1. Industries where the ICP differs materially (e.g., Media, Travel — which often skew enterprise) can carry small footnotes in v2.

### 10.3 Persona logic

See Section 6.3 for the full table. Persona is a function of `activeCapabilities` only.

---

## 11. Case Study Library — Curated Highlights

The full library is loaded from `casestudies-export.json` (542 active records). The strip surfaces the top 4–6 per industry, ranked by (top-flag, revenue, name). This section lists the editorially desirable highlights — names that should ideally appear in the strip when their industry is selected.

### Manufacturing (170 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ Audi AG | 60BN € | DE | DXP, PIM-MDM, Commerce, DAM |
| ⭐ Liebherr | — | AT | DXP, CDP |
| ⭐ Saint-Gobain Weber | — | DE | PIM-MDM, DAM |
| Eberspächer | 4.5BN € | — | DXP, PIM-MDM, DAM |
| VACUUMSCHMELZE | 0.37BN € | — | DXP, PIM-MDM, DAM |
| Gerard Lighting | 0.4BN € | — | DXP, PIM-MDM |

### Technology (79 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ Liebherr | — | AT | DXP, CDP |
| VACUUMSCHMELZE | 0.37BN € | — | DXP, PIM-MDM, DAM |
| Avira | 0.01BN € | — | DXP |
| ATS-Tanner Group | — | CH | DXP, PIM-MDM, DAM |
| Albrecht JUNG | — | DE | PIM-MDM, DAM |
| Arduino | — | IT | PIM-MDM, DAM |

### Retail (72 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ Bauhaus | — | CZ/SK | PIM-MDM, DAM |
| ⭐ Media Saturn | — | DE | DXP, PIM-MDM, DAM |
| ⭐ Raiffeisen Salzburg | — | AT | DXP, PIM-MDM, Commerce, DAM |
| Krombacher | 0.86BN € | — | PIM-MDM, DAM, DXP, Commerce |
| 7days | 0.2BN € | AT/BR/CN/FI/DK | DXP, DAM, PIM-MDM |
| Bayer 04 Leverkusen | 0.2BN € | — | PIM-MDM, Commerce |

### Wholesale & Distribution (67 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| Eberspächer | 4.5BN € | — | DXP, PIM-MDM, DAM |
| Krombacher | 0.86BN € | — | PIM-MDM, DAM, DXP, Commerce |
| 7days | 0.2BN € | AT/BR/CN/FI/DK | DXP, DAM, PIM-MDM |
| PF Concept | 0.2BN € | NL | DAM, DXP, PIM-MDM |
| Coup de pates (ARYZTA) | 0.1BN € | FR | DXP, PIM-MDM, Commerce, DAM |
| Ludwig Meister | 0.1BN € | DE | DXP, PIM-MDM, Commerce |

### Food & Beverage (46 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| Ferrero S.p.A. | 10BN € | IT | PIM-MDM, DXP |
| Burger King | 4BN € | — | DXP |
| Krombacher | 0.86BN € | — | PIM-MDM, DAM, DXP, Commerce |
| Coup de pates (ARYZTA) | 0.1BN € | FR | DXP, PIM-MDM, Commerce, DAM |
| Antonio Viani Importe | — | AT/BE/DE/LU/NL/CH | PIM-MDM, Commerce |

### Healthcare (39 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| Helvetas | 0.15BN € | — | DXP |
| Brainlab AG | — | DE | DAM |
| Alpecin / Dr. Wolff Group | — | — | PIM-MDM, DXP |
| Apteki Gemini | — | PL | DXP |
| BDAE Gruppe | — | DE | DXP, PIM-MDM |

### Travel & Hospitality (42 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| Bluserena | 0.1BN € | — | DXP |
| Kleinwalsertal Tourism | 0.01BN € | — | DXP, Commerce, CDP |
| Air Leap | — | DK/FI/NO/SE | DXP, DAM |
| Amatori | — | IT | DXP, Commerce |
| Ameropa-Reisen | — | DE | DXP, PIM-MDM |

### Automotive & Vehicles (42 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ Audi AG | 60BN € | DE | DXP, PIM-MDM, Commerce, DAM |
| Eberspächer | 4.5BN € | — | DXP, PIM-MDM, DAM |
| AutoAnything | — | US | Commerce, DAM, PIM-MDM |
| Automotive Alliance Group | — | EU-wide | DXP, PIM-MDM, DAM |
| Böckmann Fahrzeugwerke | — | DE | DXP, PIM-MDM, DAM |

### Media & Publishing (29 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ Bloomberg | — | — | DXP, PIM-MDM |
| Funke Zeitschriften | 1.3BN € | — | PIM-MDM, DAM |
| Austrian Standards | — | AT | DXP, PIM-MDM, DAM, CDP |
| Agora S.A. | — | PL | PIM-MDM, DAM |

### Fashion & Clothing (25 active cases)

| Customer | Revenue | Country | Capabilities |
|---|---|---|---|
| ⭐ GANT | — | SE | PIM-MDM |
| Bayer 04 Leverkusen | 0.2BN € | — | PIM-MDM, Commerce |
| Deuter | 0.17BN € | DE | Commerce, DAM, PIM-MDM |
| Silvian Heach | 0.1BN € | IT | PIM-MDM, DAM |
| AFEW | — | DE | PIM-MDM, DAM |
| Carter's | — | AE | PIM-MDM |

⭐ = `casestudy_top = true` in the export, regardless of revenue.

---

## 12. Visual Design System

### 12.1 Color tokens

| Token | Value | Usage |
|---|---|---|
| `--pc-black` | `#000000` | Background |
| `--pc-panel` | `#06060a` | Panel base |
| `--pc-panel-2` | `#0c0c14` | Panel highlight (gradient top) |
| `--pc-line` | `#1a1a26` | Dim borders, dividers |
| `--pc-line-bright` | `#2a2a3c` | Active borders |
| `--pc-purple` | `#5924AB` | Pimcore primary |
| `--pc-purple-bright` | `#8B5BD6` | Lifted purple for active states |
| `--pc-purple-glow` | `rgba(139, 91, 214, 0.55)` | Active glow |
| `--pc-gold` | `#F5C842` | "Armed" / selected state |
| `--pc-gold-glow` | `rgba(245, 200, 66, 0.55)` | Selected glow |
| `--pc-neon` | `#CCFF00` | Live data, status, PXM-engaged moment |
| `--pc-neon-glow` | `rgba(204, 255, 0, 0.5)` | Status glow |
| `--pc-text` | `#e8e8f0` | Primary text |
| `--pc-text-dim` | `#6b6b7a` | Secondary text |
| `--pc-text-faint` | `#3a3a48` | Inactive text, faint readouts |
| `--pc-red` | `#ff3b3b` | Reserved for warnings (not used in v1) |

The black + purple is the calm background. Gold marks user intent (what you have selected). Neon yellow-green marks live system state (what the platform is telling you back). These three accent colors are never mixed loosely; they each carry a specific semantic.

### 12.2 Typography

| Role | Font | Notes |
|---|---|---|
| Display, headings, button labels | Chakra Petch | Pulled from Google Fonts. Geometric, slightly cyberpunk, reads cleanly at small sizes. |
| Mono readouts, data, code, numbers | JetBrains Mono | Pulled from Google Fonts. Crisp, technical, instrument-cluster feel. |

Weights used: Chakra Petch 400, 500, 600, 700; JetBrains Mono 300, 400, 500, 600. Letter-spacing is generous (0.05–0.32em) on headers and labels to reinforce the technical/aerospace tone.

### 12.3 Motion principles

- **Restraint over abundance.** One coordinated reveal on load (staggered fade-in of regions) rather than constant micro-animation.
- **Breathing, not bouncing.** Active states use slow opacity/glow pulses (2.4–3.0s cycles), never bouncing or playful spring physics.
- **The PXM moment.** When the sixth capability is activated, the PXM core pulse-flashes once at 1.4× intensity and the color transitions over 600ms. This is the only moment of overt "celebration."
- **Selection feedback.** All toggle/select actions complete in 200–300ms with eased transitions (`cubic-bezier(0.4, 0, 0.2, 1)`).

### 12.4 Texture & atmosphere

- **Subtle grain.** A barely-visible procedural noise overlay (~5% opacity) at the canvas level breaks up flat black.
- **Scan lines.** A 3–4px vertical scan-line pattern at ~1% opacity, suggestive of a CRT but not retro.
- **Background grid.** Faint purple grid lines (80px × 80px) masked by a radial gradient so they fade toward the edges. Implies a coordinate plane without dominating.
- **Corner brackets.** Each panel carries small purple brackets at its four corners — a mil-spec UI cue.

---

## 13. Interaction Design

### 13.1 State machine

Two pieces of state drive everything (plus locale):

```
state = {
  selectedIndustry:    'manufacturing',
  activeCapabilities:  Set<DomainSlug>,    // 0–6
  activeLocale:        'en'
}
```

All output panels are pure derivations of this state. There is no transient state, no modal flow, no save/load (in v1).

### 13.2 Default state on load

```
selectedIndustry   = 'manufacturing'
activeCapabilities = { 'pim' }
activeLocale       = (browser preference or 'en')
```

This produces a non-empty, recognizable default scene. The viewer immediately sees the cockpit "in use."

### 13.3 Interactions

- **Click a capability cell** → toggles that domain in the active set. Updates: PXM core, progress meter, capability-headlines panel, persona panel, case study highlights.
- **Click an industry button** → replaces the selected industry. Updates: ICP readout, benefits panel, case study filter and reordering.
- **Click a case study card** → opens canonical Pimcore URL in new tab.
- **Locale switcher** → re-renders all locale-aware content (case study descriptions). Capability headlines remain English-only in v1 unless the capability export includes other locales (current export is English only).
- **Hover any input** → standard hover state (lift, glow). No tooltips in v1.

### 13.4 No keyboard shortcuts in v1

Pure mouse/touch interaction. Could be added in v2 (e.g., `1`–`6` for capabilities, arrow keys for industries) for live demo speed.

---

## 14. Implementation Notes (Recommendations)

### 14.1 Stack

A single-file HTML application with React 18 + Tailwind via CDN, JSX compiled in-browser with Babel Standalone. Rationale:

- Zero build step. The file can be opened locally, hosted statically anywhere, embedded into Notion/Confluence, or shipped as an attachment to investors.
- Full design freedom. CDN-loaded Tailwind supports arbitrary values which the constrained artifact-style React environment does not.
- Single source of truth — the entire app, including content, lives in one file Dietz can hand to anyone. The two JSON exports load alongside via `fetch` or are inlined at build/refresh time.

### 14.2 Scaling for 16:9

Render the app at a fixed 1920×1080 internal resolution and apply a uniform `transform: scale(s)` based on viewport, where `s = min(width/1920, height/1080)`. Letterbox bars (pure black) fill any leftover space.

### 14.3 Data refresh strategy

The cockpit is downstream of two canonical Pimcore exports. Recommended pattern:

1. The two JSON files (`capabilities-export.json`, `casestudies-export.json`) are placed alongside `index.html` and loaded at app start.
2. Re-export from Pimcore on a cadence (monthly, or before major investor or sales events).
3. A small build script (optional) can pre-flatten the case studies to drop unused fields and shrink the case studies file from ~15MB to ~1–2MB. Fields kept: `id`, `key`, `fullPath`, `fields.company_name_short`, `fields.Revenue`, `fields.countries`, `fields.casestudy_active`, `fields.casestudy_top`, `fields.casestudy_industries[].key`, `fields.casestudy_capabilities[].key`, `fields.localizedfields.{locale}.casestudy_description`. This keeps the cockpit fast even on slow networks.

### 14.4 Localization

The `casestudies-export.json` ships six locales (en, de, nl, fr, it, pl). The cockpit can switch case-study descriptions by reading `localizedfields[activeLocale].casestudy_description`. The capability export is English-only in the current snapshot; if Pimcore extends it with localized headlines, the cockpit picks that up automatically.

The cockpit's own UI strings (panel titles, persona records, benefits list, ICP labels) are editorial and need a small `i18n.json` file maintained alongside the cockpit. For v1, English-only is acceptable for investor use; German is the highest-priority second locale given the DACH customer concentration.

### 14.5 Future-state hooks (not v1)

- **Cortex panel** — a placeholder slot for the learning layer. Likely position: small panel beneath the PXM core that lights up as a "second core" once specific capability combinations are active. Held until naming and trademark are settled.
- **Live counters** — header stats currently static; could pull from a Pimcore data API.
- **Capability deep-dive view** — expanding the capability headlines panel to a full per-capability detail view (using `longDescription` from the export).
- **Export** — "Print this view" action that captures the current selection as a one-page PDF for follow-up.
- **URL state** — encoding `(industry, capabilities, locale)` in the URL for shareable deep-links (e.g., `?ind=manufacturing&caps=pim,mdm,dam&loc=en`).

---

## 15. Out of Scope (v1)

- Live demo of actual Pimcore product UI.
- Authentication or user accounts.
- Saved configurations beyond URL encoding (could be a v2 quick win).
- Mobile-optimized layout (16:9 scaling is fine on tablets in landscape; phones are not a target use case).
- Translation of editorial UI strings beyond English (German optional for v1.5).
- Analytics/telemetry.
- Real-time data feeds from Pimcore production systems.

---

## 16. Open Questions

1. **Cortex inclusion timing.** Does Cortex appear in the cockpit at all in v1, in muted form, or held entirely until naming and trademark are settled? Recommended: hold until the official Cortex naming is committed and an LOI process is open.
2. **Stat values in the header.** Investor-context numbers (€13M ARR, 3,000+ installs) versus general-context numbers (542 customer stories, 17 industries, 6 domains)? Recommended: ship both as a config flag, defaulting to general-context and switching to investor numbers when used in PSG-style settings.
3. **Industry coverage.** Ten industries on the dial (current spec) versus a deeper set with an "OTHER" expander, versus the full 17 from the data? Recommended: ship 10, hide the rest behind "OTHER" in v2.
4. **PIM/MDM combined cell.** The case study taxonomy merges PIM and MDM into one tag. Should the cockpit hexagon also merge them into one cell labeled `PIM / MDM`, reducing the hexagon to five cells but matching the data exactly? Recommended: keep six cells (the marketing taxonomy is six), and handle the merge in the case-study filter only. The visual story of six capabilities is too valuable to compromise.
5. **Capability headlines vs hand-authored use cases.** The v2 spec sources the capability-headlines panel directly from `capabilities-export.json`. The trade-off is that the panel reads as feature-list-y rather than industry-flavored. Should v1 carry hand-authored industry × capability strings as well (the v1 spec's content matrix), losing data-faithfulness but gaining narrative tightness? Recommended: data-driven for v1, with optional editorial overlays per industry × capability in v2.
6. **Locale switcher UI presence.** Is the locale switcher visible in the header from day one, or hidden until a non-English locale is needed? Recommended: visible from day one — signals platform-level multi-language support to international investors.
7. **Audio cues.** A subtle click on selection and a quiet "engage" sound when PXM mode locks could amplify the cockpit feel — but most browsers block autoplay audio, and most live demo settings don't have speakers. Recommendation: skip in v1.

---

## 17. Success Criteria

The cockpit succeeds if, in a live investor or prospect conversation, the viewer:

1. Understands within 30 seconds that Pimcore is *one platform with six capabilities*, not six products.
2. Sees the combinatorial story land — that capabilities used together produce something more than their sum.
3. Recognizes their own industry's use case story without it being narrated to them.
4. Remembers the PXM mode-engaged moment as the visual takeaway.
5. Walks away with a concrete sense that real customers — including AUDI, Bloomberg, Burger King, Saint-Gobain, Bauhaus — have already done what they would want to do.

If the cockpit cannot reliably produce the first four within the first 60 seconds of unguided interaction, it has failed regardless of how beautiful it looks.
