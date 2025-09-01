import { useEffect, useMemo, useState } from 'react'
import { getSalariesByRegion } from '../core/db'
import { normalizeDisplay } from '../core/pay'

type Row = { role: string; usa?: string; eu?: string; russia?: string; china?: string; usdpm?: number }

export default function ComparePage() {
  const [rows, setRows] = useState<Row[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    Promise.all([
      getSalariesByRegion('usa'),
      getSalariesByRegion('eu'),
      getSalariesByRegion('russia'),
      getSalariesByRegion('china'),
    ]).then(([usa, eu, ru, cn]) => {
      const map = new Map<string, Row>()
      for (const { role, value } of usa) map.set(role, { role, usa: value })
      for (const { role, value } of eu) map.set(role, { ...(map.get(role) || { role }), eu: value })
      for (const { role, value } of ru) map.set(role, { ...(map.get(role) || { role }), russia: value })
      for (const { role, value } of cn) map.set(role, { ...(map.get(role) || { role }), china: value })
      const out = Array.from(map.values()).map(r => {
        const cands = [r.usa, r.eu, r.russia, r.china].filter(Boolean) as string[]
        const best = cands[0] ?? ''
        const n = normalizeDisplay(best)
        return { ...r, usdpm: n.usdPerMonth }
      })
      setRows(out)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return rows
    const q = query.toLowerCase()
    return rows.filter(r => r.role.toLowerCase().includes(q))
  }, [rows, query])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Сравнение ролей и стран</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} className="border rounded px-3 py-2 w-full" placeholder="Найти роль…" />
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Роль</th>
              <th className="p-2">USA</th>
              <th className="p-2">EU</th>
              <th className="p-2">Россия</th>
              <th className="p-2">Китай</th>
              <th className="p-2">≈ USD/мес</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.role}</td>
                <td className="p-2">{r.usa ?? '—'}</td>
                <td className="p-2">{r.eu ?? '—'}</td>
                <td className="p-2">{r.russia ?? '—'}</td>
                <td className="p-2">{r.china ?? '—'}</td>
                <td className="p-2" title="Нормализация, оценка">{r.usdpm ? `$${r.usdpm}/mo` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
