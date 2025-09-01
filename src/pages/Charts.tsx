import { useEffect, useMemo, useState } from 'react'
import { openDb } from '@/core/db'
import { normalizeDisplay } from '@/core/pay'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts'

type Row = { role: string; usa?: string; eu?: string; russia?: string; china?: string; usdpm?: number; p10?: string; p50?: string; p90?: string }

export default function ChartsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [role, setRole] = useState<string>('Backend Engineer')

  useEffect(() => {
    (async () => {
      const db = await openDb()
      const q = (sql: string) => {
        const r = db.exec(sql)[0]
        return r ? r.values : []
      }
      const base = new Map<string, Row>()
      for (const [role, region, value, p10, p90, usdpm] of q(`SELECT role, region, value, p10, p90, usdpm FROM salaries`)) {
        const key = String(role)
        const it = base.get(key) ?? { role: key }
        ;(it as any)[String(region)] = String(value)
        if (p10) (it as any).p10 = String(p10)
        if (p90) (it as any).p90 = String(p90)
        if (usdpm) (it as any).usdpm = Number(usdpm)
        base.set(key, it)
      }
      setRows(Array.from(base.values()))
    })()
  }, [])

  const selected = useMemo(() => rows.find(r => r.role === role), [rows, role])

  const series = useMemo(() => {
    if (!selected) return []
    return [
      { name: 'USA', v: selected.usa },
      { name: 'EU', v: selected.eu },
      { name: 'Russia', v: selected.russia },
      { name: 'China', v: selected.china },
    ].map(s => ({ region: s.name, usdpm: normalizeDisplay(s.v || '').usdPerMonth || null }))
  }, [selected])

  const percentiles = useMemo(() => {
    if (!selected) return []
    const toNum = (x?: string) => normalizeDisplay(x || '').usdPerMonth || null
    return [{ p: 'P10', v: toNum(selected.p10) }, { p: 'P50', v: toNum(selected.usa || selected.eu || selected.p50) }, { p: 'P90', v: toNum(selected.p90) }]
  }, [selected])

  const roles = rows.map(r => r.role).sort()

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Зарплатные графики</h1>
      <div className="card flex gap-2 flex-wrap items-center">
        <span className="text-sm">Роль:</span>
        <select className="border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value)}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <span className="text-xs text-gray-500">Нормализация: ≈ USD/мес</span>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Сравнение регионов (≈ USD/мес)</div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={series.filter(d => d.usdpm !== null)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="usdpm" name="≈ USD/mo" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="font-semibold mb-2">Перцентильная вилка (P10, P50, P90)</div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={percentiles.filter(d => d.v !== null)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="p" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="v" name="≈ USD/mo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
