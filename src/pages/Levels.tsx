import { useEffect, useMemo, useState } from 'react'
import { openDb } from '@/core/db'

type L = { role: string; jMin?: number; jMax?: number; mMin?: number; mMax?: number; sMin?: number; sMax?: number }

export default function LevelsPage() {
  const [rows, setRows] = useState<L[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    (async () => {
      const db = await openDb()
      const r = db.exec(`SELECT role, MIN(lvl_j_min), MAX(lvl_j_max), MIN(lvl_m_min), MAX(lvl_m_max), MIN(lvl_s_min), MAX(lvl_s_max)
                         FROM salaries GROUP BY role`)[0]
      const out = (r?.values ?? []).map(v => ({
        role: String(v[0]),
        jMin: (v[1] as number | null) || undefined,
        jMax: (v[2] as number | null) || undefined,
        mMin: (v[3] as number | null) || undefined,
        mMax: (v[4] as number | null) || undefined,
        sMin: (v[5] as number | null) || undefined,
        sMax: (v[6] as number | null) || undefined,
      }))
      setRows(out)
    })()
  }, [])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return !qq ? rows : rows.filter(r => r.role.toLowerCase().includes(qq))
  }, [rows, q])

  const fmt = (n?: number) => (n ? `$${n}/mo` : '—')

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Уровни по ролям (≈ USD/мес)</h1>
      <input className="border rounded px-3 py-2 w-full" placeholder="Найти роль…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Роль</th>
              <th className="p-2 text-left">Junior</th>
              <th className="p-2 text-left">Mid</th>
              <th className="p-2 text-left">Senior</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.role}</td>
                <td className="p-2">{fmt(r.jMin)} — {fmt(r.jMax)}</td>
                <td className="p-2">{fmt(r.mMin)} — {fmt(r.mMax)}</td>
                <td className="p-2">{fmt(r.sMin)} — {fmt(r.sMax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Интервалы рассчитаны на основе P10/P50/P90 where available (или от медианы при их отсутствии). Нормализация: ECB FX, ≈ USD/мес.
      </p>
    </div>
  )
}
