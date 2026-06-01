import { useEffect } from 'react'
import { Frame16x9 } from './components/frame/Frame16x9'
import { Reveal } from './components/frame/Reveal'
import { Header } from './components/Header'
import { ModuleRail } from './components/left/ModuleRail'
import { PxmKnob } from './components/center/PxmKnob'
import { ConnectionLines } from './components/center/ConnectionLines'
import { CapabilityHeadlines } from './components/center/CapabilityHeadlines'
import { SpineStrip } from './components/spine/SpineStrip'
import { IcpPanel } from './components/right/IcpPanel'
import { PersonaPanelLight } from './components/right/PersonaPanelLight'
import { GartnerBenefitsPanel } from './components/right/GartnerBenefitsPanel'
import { CaseStrip } from './components/strip/CaseStrip'
import { useCockpit } from './state/cockpit'
import { loadCockpitData } from './data/load'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const setData = useCockpit((s) => s.setData)
  const setLoadError = useCockpit((s) => s.setLoadError)
  const loaded = useCockpit((s) => !!s.caps && !!s.cases)
  const loadError = useCockpit((s) => s.loadError)

  useKeyboardShortcuts()

  useEffect(() => {
    let cancelled = false
    loadCockpitData()
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((e) => {
        if (!cancelled) setLoadError(String(e))
      })
    return () => {
      cancelled = true
    }
  }, [setData, setLoadError])

  return (
    <Frame16x9>
      <div className="absolute inset-0 chassis-grain" />
      <ConnectionLines />

      <div className="absolute inset-0 flex flex-col">
        <Reveal delay={0.05}>
          <Header />
        </Reveal>

        <div className="flex-1 grid min-h-0" style={{ gridTemplateColumns: '500px 1fr 480px' }}>
          {/* LEFT — six capability module cards */}
          <Reveal delay={0.18}>
            <ModuleRail />
          </Reveal>

          {/* CENTER — PXM hero knob (left) + capability headlines (right), on a platform */}
          <Reveal delay={0.4} className="relative flex flex-col items-center justify-center px-3 py-2">
            <div
              className="center-stage-platform relative flex items-stretch"
              style={{ padding: '20px 24px', width: 'min(840px, 100%)', gap: 20 }}
            >
              <div className="flex flex-col items-center justify-center" style={{ flexShrink: 0 }}>
                <PxmKnob />
              </div>
              <div className="flex-1 min-w-0 flex">
                <CapabilityHeadlines />
              </div>
            </div>
          </Reveal>

          {/* RIGHT — ICP / Persona / Gartner+Benefits */}
          <div className="flex flex-col" style={{ gap: 12, padding: '14px 16px 14px 14px', minHeight: 0 }}>
            <Reveal delay={0.22}>
              <IcpPanel />
            </Reveal>
            <Reveal delay={0.3}>
              <PersonaPanelLight />
            </Reveal>
            <Reveal delay={0.38}>
              <GartnerBenefitsPanel />
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.46}>
          <SpineStrip />
        </Reveal>

        <Reveal delay={0.55}>
          <CaseStrip />
        </Reveal>
      </div>

      {!loaded && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-pc-text-dim text-sm tracking-widest">
          INITIALIZING COCKPIT…
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-pc-red text-sm tracking-widest">
          LOAD ERROR · {loadError}
        </div>
      )}
    </Frame16x9>
  )
}
