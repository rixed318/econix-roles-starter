import { useEffect, useMemo, useRef, useState } from 'react'
import roles from '../../data/roles.json'
import { makeFuse, typeahead, highlight } from '@/core/search'

makeFuse(roles as any)

export default function Typeahead({ onPick }: { onPick: (title: string) => void }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const list = useMemo(() => typeahead(q), [q])
  const boxRef = useRef<HTMLInputElement>(null)

  useEffect(() => setIdx(0), [q])

  return (
    <div className="relative">
      <input
        ref={boxRef}
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { setIdx(i => Math.min(i + 1, Math.max(0, list.length - 1))); e.preventDefault() }
          if (e.key === 'ArrowUp')   { setIdx(i => Math.max(i - 1, 0)); e.preventDefault() }
          if (e.key === 'Enter' && list[idx]) { onPick(list[idx].item.title) }
        }}
        placeholder="Поиск ролей и навыков…"
        className="w-full border rounded px-3 py-2"
        aria-autocomplete="list"
        aria-expanded={list.length > 0}
      />

      {q && list.length > 0 && (
        <div role="listbox" className="absolute z-10 mt-1 w-full bg-white border rounded shadow">
          {list.map((h, i) => (
            <button
              key={h.item.title}
              role="option"
              aria-selected={i === idx}
              onMouseDown={e => { e.preventDefault(); onPick(h.item.title) }}
              className={"w-full text-left px-3 py-2 hover:bg-gray-100 " + (i === idx ? "bg-gray-50" : "")}
            >
              <div className="font-medium">{h.item.title}</div>
              {h.item.subtitle && <div className="text-xs text-gray-600">
                {highlight(h.item.subtitle, h.highlights.find(k => k.key === 'subtitle')?.indices || []).map((p, j) =>
                  p.mark ? <mark key={j}>{p.text}</mark> : <span key={j}>{p.text}</span>
                )}
              </div>}
            </button>
          ))}
          <div className="px-3 py-1 text-[11px] text-gray-500">Enter — открыть, ↑/↓ — навигация</div>
        </div>
      )}
    </div>
  )
}
