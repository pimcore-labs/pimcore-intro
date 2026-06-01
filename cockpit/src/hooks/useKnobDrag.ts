import { useRef } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'

interface KnobDragOptions {
  value: number
  min?: number
  max?: number
  onChange: (next: number) => void
  onReset?: () => void
  disabled?: boolean
  /** Pixels of vertical drag required to traverse the full min→max range. */
  pixelsPerFullRange?: number
  /** Multiplier when Shift is held during drag. */
  fineFactor?: number
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/**
 * Vertical-drag knob interaction. Drag up to increase, down to decrease.
 * Shift fine-adjusts. Double-click triggers onReset.
 */
export function useKnobDrag({
  value,
  min = 0,
  max = 100,
  onChange,
  onReset,
  disabled,
  pixelsPerFullRange = 220,
  fineFactor = 0.2,
}: KnobDragOptions) {
  const startY = useRef(0)
  const startV = useRef(0)
  const dragging = useRef(false)

  function onPointerDown(e: ReactPointerEvent<SVGElement>) {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    startY.current = e.clientY
    startV.current = value
    dragging.current = true
    const sensitivity = (max - min) / pixelsPerFullRange

    const move = (ev: PointerEvent) => {
      if (!dragging.current) return
      const dy = startY.current - ev.clientY
      const factor = ev.shiftKey ? fineFactor : 1
      onChange(clamp(startV.current + dy * sensitivity * factor, min, max))
    }
    const stop = () => {
      dragging.current = false
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  function onDoubleClick(e: ReactMouseEvent<SVGElement>) {
    if (disabled) return
    e.stopPropagation()
    onReset?.()
  }

  return { onPointerDown, onDoubleClick, isDraggable: !disabled }
}
