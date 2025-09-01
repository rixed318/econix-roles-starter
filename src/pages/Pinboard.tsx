import { usePins } from '@/core/pin'
import { useEffect, useState } from 'react'
import { openDb } from '@/core/db'

export default function Pinboard() {
  const { pins, clear } = usePins()
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => { (async () => {
    const db = await openDb()
    const out: any[] = []
    for (const p of pins) {
      const r = db.exec(`SELECT region, value, usdpm, p10, p90 FROM salaries WHERE role = ?`, [p])[0]
      const obj: any = { role: p }
      if (r) for (const [region, value, usdpm, p10, p90] of r.values) {
        obj[region] = value; obj.usdpm = Math.max(obj.usdpm || 0, Number(usdpm) || 0)
        obj.p10 = obj.p10 || p10; obj.p90 = obj.p90 || p90
      }
      out.push(obj)
    }
    setRows(out)
  })() }, [pins])

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pinned roles</h1>
        <button onClick={clear} className="px-3 py-2 rounded border">Очистить</button>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead><tr>
            <th className="p-2 text-left">Роль</th><th className="p-2">USA</th><th className="p-2">EU</th><th className="p-2">Россия</th><th className="p-2">Китай</th><th className="p-2">≈ USD/мес</th>
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.role}</td>
                <td className="p-2">{r.usa || '—'}</td>
                <td className="p-2">{r.eu || '—'}</td>
                <td className="p-2">{r.russia || '—'}</td>
                <td className="p-2">{r.china || '—'}</td>
                <td className="p-2">{r.usdpm ? `$${r.usdpm}/mo` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Подсказка: закрепляй роли «Pin» на карточках.</p>
    </div>
  )
}
