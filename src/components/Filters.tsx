import roles from '../../data/roles.json'
import { inferTrack, type Track } from '@/core/track'
import { useEffect, useMemo, useState } from 'react'

const ALL: Track[] = ['Frontend','Backend','Data','ML','DevOps/SRE','Security','Mobile','Other']

export default function Filters({ onChange }: { onChange: (active: Track[]) => void }){
  const [active, setActive] = useState<Track[]>([])
  const counts = useMemo(() => {
    const m = new Map<Track, number>(ALL.map(t => [t, 0]))
    ;(roles as any[]).forEach(r => m.set(inferTrack(r.title), (m.get(inferTrack(r.title)) || 0) + 1))
    return m
  }, [])
  useEffect(() => onChange(active), [active, onChange])

  const toggle = (t: Track) => setActive(a => a.includes(t) ? a.filter(x => x !== t) : [...a, t])

  return (
    <div className="flex flex-wrap gap-2">
      {ALL.map(t => (
        <button key={t} onClick={() => toggle(t)}
          className={"px-3 py-1 rounded-full border text-sm " + (active.includes(t) ? "bg-black text-white" : "bg-white")}
        >
          {t} <span className="opacity-60">({counts.get(t)})</span>
        </button>
      ))}
      {active.length > 0 && <button onClick={() => setActive([])} className="px-3 py-1 rounded-full border text-sm">Сброс</button>}
    </div>
  )
}
