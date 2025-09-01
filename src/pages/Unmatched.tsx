import roles from '../../data/roles.json'
import { openDb } from '@/core/db'
import { useEffect, useState } from 'react'

export default function Unmatched() {
  const [bad, setBad] = useState<string[]>([])
  useEffect(() => {
    (async () => {
      const db = await openDb()
      const res = db.exec(`SELECT DISTINCT role FROM salaries`)[0]
      const titles = new Set(roles.map(r => r.title))
      const arr = (res?.values ?? []).map(v => String(v[0])).filter(r => !titles.has(r)).sort()
      setBad(arr)
    })()
  }, [])
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unmatched roles</h1>
      {bad.length === 0 ? <div className="p-4 rounded bg-green-50 border">Все роли сматчены ✅</div> :
        <ul className="list-disc pl-5">{bad.map((r,i)=><li key={i} className="py-1">{r}</li>)}</ul>}
      <p className="text-xs text-gray-500 mt-3">Добавь соответствия в <code>scripts/etl/roleMap.json</code>.</p>
    </div>
  )
}
