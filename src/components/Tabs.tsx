import React from 'react'
import { usePrefersReducedMotion } from '../core/usePrefersReducedMotion'

export interface Tab { id: string; label: string; content: React.ReactNode }
interface Props { tabs: Tab[]; active: number; onChange: (idx: number) => void }

export const Tabs: React.FC<Props> = ({ tabs, active, onChange }) => {
  const reduce = usePrefersReducedMotion()
  return (
    <div>
      <div role="tablist" aria-label="tabs" className="flex gap-2">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            className={`px-3 py-1 rounded border ${active===i?'bg-black text-white':'bg-white'}`}
            onClick={() => onChange(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== i}
          className={`mt-2 ${reduce ? '' : 'transition-opacity duration-300'}`}
        >
          {t.content}
        </div>
      ))}
    </div>
  )
}
