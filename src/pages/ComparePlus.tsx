import { useEffect, useMemo, useState } from 'react'
import { getSalariesByRegion, getFxDate } from '../core/db'

interface RegionEntry { value?: string; p10?: string; p90?: string; usdpm?: number }
type Row = { role: string; usa?: RegionEntry; eu?: RegionEntry; russia?: RegionEntry; china?: RegionEntry; usdpm?: number }

export default function ComparePlus() {
  const [rows, setRows] = useState<Row[]>([])
  const [fxDate, setFxDate] = useState<string>()

  useEffect(() => {
    getFxDate().then(d => setFxDate(d))
    Promise.all([
      getSalariesByRegion('usa'),
      getSalariesByRegion('eu'),
      getSalariesByRegion('russia'),
      getSalariesByRegion('china')
    ]).then(([usa, eu, ru, cn]) => {
      const map = new Map<string, Row>()
      for (const r of usa) map.set(r.role, { role: r.role, usa: r, usdpm: r.usdpm })
      for (const r of eu) {
        const row = map.get(r.role) || { role: r.role }
        row.eu = r
        row.usdpm = row.usdpm || r.usdpm
        map.set(r.role, row)
      }
      for (const r of ru) {
        const row = map.get(r.role) || { role: r.role }
        row.russia = r
        row.usdpm = row.usdpm || r.usdpm
        map.set(r.role, row)
      }
      for (const r of cn) {
        const row = map.get(r.role) || { role: r.role }
        row.china = r
        row.usdpm = row.usdpm || r.usdpm
        map.set(r.role, row)
      }
      setRows(Array.from(map.values()))
    })
  }, [])

  const tooltip = 'P50 = медиана; P10/P90 = нижний/верхний дециль'
  const fxLabel = fxDate ? `Нормализация FX: ECB (${fxDate})` : undefined

  const sorted = useMemo(() => rows.sort((a,b)=> (b.usdpm||0)-(a.usdpm||0)), [rows])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Compare+</h1>
      {fxLabel && <div className="text-sm text-gray-600">{fxLabel}</div>}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Роль</th>
              <th className="p-2">USA</th>
              <th className="p-2">EU</th>
              <th className="p-2">Россия</th>
              <th className="p-2">Китай</th>
              <th className="p-2" title={tooltip}>P10</th>
              <th className="p-2" title={tooltip}>P50</th>
              <th className="p-2" title={tooltip}>P90</th>
              <th className="p-2">≈ USD/мес</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r,i) => {
              const p10 = r.usa?.p10 || r.eu?.p10 || r.russia?.p10 || r.china?.p10
              const p50 = r.usa?.value || r.eu?.value || r.russia?.value || r.china?.value
              const p90 = r.usa?.p90 || r.eu?.p90 || r.russia?.p90 || r.china?.p90
              return (
                <tr key={i} className="border-t">
                  <td className="p-2">{r.role}</td>
                  <td className="p-2">{r.usa?.value ?? '—'}</td>
                  <td className="p-2">{r.eu?.value ?? '—'}</td>
                  <td className="p-2">{r.russia?.value ?? '—'}</td>
                  <td className="p-2">{r.china?.value ?? '—'}</td>
                  <td className="p-2">{p10 ?? '—'}</td>
                  <td className="p-2">{p50 ?? '—'}</td>
                  <td className="p-2">{p90 ?? '—'}</td>
                  <td className="p-2" title="Нормализация, оценка">{r.usdpm ? `$${r.usdpm}/mo` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
