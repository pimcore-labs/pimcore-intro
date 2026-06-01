import { useEffect, useRef, useState, type PropsWithChildren } from 'react'

const W = 1920
const H = 1080

export function Frame16x9({ children }: PropsWithChildren) {
  const outer = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = outer.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = el
      setScale(Math.min(clientWidth / W, clientHeight / H))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={outer}
      className="w-screen h-screen bg-pc-chassis-edge flex items-center justify-center overflow-hidden"
    >
      <div
        style={{
          width: W,
          height: H,
          flex: 'none',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
        }}
        className="bg-pc-chassis"
      >
        {children}
      </div>
    </div>
  )
}
