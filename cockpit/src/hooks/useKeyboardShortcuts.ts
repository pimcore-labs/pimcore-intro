import { useEffect } from 'react'
import { useCockpit } from '../state/cockpit'
import { INDUSTRIES } from '../data/industries'

/** v3 §11.4 — global keyboard shortcuts. */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in inputs/textareas
      const target = e.target as HTMLElement | null
      if (target && /input|textarea|select/i.test(target.tagName)) return

      const store = useCockpit.getState()

      // 1–6 toggle modules in capabilityOrder
      if (e.key >= '1' && e.key <= '6') {
        const idx = Number(e.key) - 1
        const slug = store.capabilityOrder[idx]
        if (slug) {
          e.preventDefault()
          store.toggleCapability(slug)
        }
        return
      }

      // ←/→ cycle industries
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const list = INDUSTRIES.map((i) => i.slug)
        const i = list.indexOf(store.selectedIndustry)
        const next = e.key === 'ArrowRight' ? (i + 1) % list.length : (i - 1 + list.length) % list.length
        store.selectIndustry(list[next])
        return
      }

      // ↑/↓ adjust agents in 5% steps
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const delta = e.key === 'ArrowUp' ? 5 : -5
        store.setAgentsIntensity(store.agentsIntensity + delta)
        return
      }

      // Space toggles all-six
      if (e.code === 'Space') {
        e.preventDefault()
        store.setAllCapabilities(store.activeCapabilities.size < 6)
        return
      }

      // R resets state
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        store.reset()
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
}
