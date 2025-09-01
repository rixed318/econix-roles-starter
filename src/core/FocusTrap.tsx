import React, { useEffect, useRef } from 'react'

export const FocusTrap: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const focusable = node.querySelectorAll<HTMLElement>('a, button, input, textarea, select, [tabindex]')
    focusable[0]?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    node.addEventListener('keydown', handleKey)
    return () => node.removeEventListener('keydown', handleKey)
  }, [])

  return <div ref={ref}>{children}</div>
}
