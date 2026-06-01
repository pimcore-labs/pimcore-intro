import type { PropsWithChildren } from 'react'

interface Props {
  delay?: number
  duration?: number
  className?: string
}

/**
 * One-shot CSS fade-in/slide-up. Replaces the prior framer-motion version
 * (which was rendering all wrapped regions at opacity 0 on this build).
 */
export function Reveal({ delay = 0, duration = 0.5, className, children }: PropsWithChildren<Props>) {
  return (
    <div
      className={className}
      style={{
        animation: `pcReveal ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
      }}
    >
      {children}
    </div>
  )
}
