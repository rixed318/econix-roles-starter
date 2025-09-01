import { useMemo, useState } from 'react'
import roles from '../../data/roles.json'
import salaries from '../../data/salaries.json'
import { create } from 'zustand'
import Fuse from 'fuse.js'

type Role = typeof roles[number]
type Salary = typeof salaries[number]

type Store = {
  query: string
  setQuery: (q: string) => void
  region: 'usa' | 'eu' | 'russia' | 'china'
  setRegion: (r: 'usa' | 'eu' | 'russia' | 'china') => void
}

const useStore = create<Store>((set) => ({
  query: '',
  setQuery: (q) => set({ query: q }),
  region: 'usa',
  setRegion: (r) => set({ region: r }),
}))

const fuse = new Fuse(roles, { keys: ['title', 'subtitle', 'sections.content', 'sections.title'], threshold: 0.3 })

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{role.title}</h3>
      {role.subtitle && <p className="text-sm text-gray-600 mt-1">{role.subtitle}</p>}
      <div className="mt-3 space-y-2">
        {role.sections.slice(0,4).map((s, i) => (
          <div key={i}>
            <div className="text-xs font-medium text-gray-500">{s.title}</div>
            <div className="text-sm">{s.content}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">{role.category}</div>
    </div>
  )
}

function SalaryRow({ item }: { item: Salary }) {
  const region = useStore(s => s.region)
  const val = item.regions?.[region] ?? '—'
  return (
    <div className="flex items-center justify-between card">
      <div className="font-medium">{item.role}</div>
      <div className="tabular-nums text-sm">{val}</div>
    </div>
  )
}

export default function App() {
  const query = useStore(s => s.query)
  const setQuery = useStore(s => s.setQuery)
  const region = useStore(s => s.region)
  const setRegion = useStore(s => s.setRegion)

  const filtered = useMemo(() => {
    if (!query.trim()) return roles
    return fuse.search(query).map(r => r.item)
  }, [query])

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">IT роли и зарплаты • Экспериментальный агрегатор</h1>
          <p className="text-gray-600 text-sm">Демо, данные из статического HTML. Следующий шаг — подключить обновляемые источники.</p>
        </div>
        <div className="flex gap-2">
          {(['usa','eu','russia','china'] as const).map(r => (
            <button key={r}
              onClick={() => setRegion(r)}
              className={"px-3 py-1 rounded border " + (region===r ? "bg-black text-white" : "bg-white")}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-3">
          <div className="card">
            <input
              placeholder="Поиск по ролям, разделам…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((role, idx) => <RoleCard key={idx} role={role} />)}
          </div>
        </section>
        <aside className="space-y-3">
          <div className="card">
            <div className="text-sm font-semibold mb-2">Зарплатная карта (демо)</div>
            <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
              {salaries.map((s, idx) => <SalaryRow key={idx} item={s} />)}
            </div>
          </div>
          <div className="card text-sm text-gray-600">
            Данные — из HTML файла. Источники см. <code>/data/sources.md</code>. В реальном приложении подгрузка через ETL в SQLite/JSON.
          </div>
        </aside>
      </div>
    </div>
  )
}
