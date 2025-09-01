import { useState, useMemo } from 'react'
import Typeahead from '@/components/Typeahead'
import Filters from '@/components/Filters'
import RolePage from '@/pages/Role'
import Pinboard from '@/pages/Pinboard'
import { usePins } from '@/core/pin'
import { inferTrack } from '@/core/track'
import { slugify } from '@/core/slug'
import roles from '../../data/roles.json'
import Guide from '@/pages/Guide'
import Wizard from '@/pages/Wizard'
import ComparePage from '@/pages/Compare'
import ComparePlus from '@/pages/ComparePlus'
import ChartsPage from '@/pages/Charts'
import LevelsPage from '@/pages/Levels'
import PathPage from '@/pages/Path'
import ResumePage from '@/pages/Resume'
import Unmatched from '@/pages/Unmatched'
import HealthPage from '@/pages/Health'
import { writeStateToUrl, readStateFromUrl } from '@/core/share'

function useRoute(){
  const h = (typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '/') || '/'
  const [path, ...rest] = h.split('/')
  return { path, rest }
}

function RoleCardInline({ role }: { role: any }){
  const { pins, toggle } = usePins()
  const pinned = pins.includes(role.title)
  const shared = readStateFromUrl().role
  const active = shared === role.title
  return (
    <div className={`card ${active ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => writeStateToUrl({ role: role.title })}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{role.title}</h3>
        <button
          onClick={e => { e.stopPropagation(); toggle(role.title) }}
          className={"px-2 py-1 rounded border text-xs " + (pinned ? 'bg-black text-white' : 'bg-white')}
        >{pinned ? 'Pinned' : 'Pin'}</button>
      </div>
      {role.subtitle && <p className="text-sm text-gray-600 mt-1">{role.subtitle}</p>}
      <div className="mt-3 text-xs text-gray-500">{inferTrack(role.title)}</div>
      <div className="mt-3">
        <a className="underline text-sm" href={`#role/${slugify(role.title)}`}>Подробнее</a>
      </div>
    </div>
  )
}

export default function App(){
  const { path, rest } = useRoute()
  const [tracks, setTracks] = useState<string[]>([])
  const [queryPick, setQueryPick] = useState<string>('')

  const filtered = useMemo(() => {
    let list = roles as any[]
    if (tracks.length) list = list.filter(r => tracks.includes(inferTrack(r.title)))
    if (queryPick) list = list.filter(r => r.title === queryPick)
    return list
  }, [tracks, queryPick])

  if (path === 'role' && rest[0]) return <RolePage slug={rest[0]} />
  if (path === 'pinboard') return <Pinboard />
  if (path === 'guide') return <Guide />
  if (path === 'wizard') return <Wizard />
  if (path === 'compare') return <ComparePage />
  if (path === 'compare-plus') return <ComparePlus />
  if (path === 'charts') return <ChartsPage />
  if (path === 'levels') return <LevelsPage />
  if (path === 'path') return <PathPage />
  if (path === 'resume') return <ResumePage />
  if (path === 'unmatched') return <Unmatched />
  if (path === 'health') return <HealthPage />

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">IT роли и зарплаты</h1>
          <div className="text-xs text-gray-500 flex gap-3 flex-wrap">
            <a href="#guide" className="underline">Guide</a>
            <a href="#wizard" className="underline">Wizard</a>
            <a href="#compare" className="underline">Compare</a>
            <a href="#compare-plus" className="underline">Compare+</a>
            <a href="#levels" className="underline">Levels</a>
            <a href="#charts" className="underline">Charts</a>
            <a href="#path" className="underline">Path</a>
            <a href="#resume" className="underline">Resume</a>
            <a href="#pinboard" className="underline">Pinboard</a>
            <a href="#unmatched" className="underline">Unmatched</a>
            <a href="#health" className="underline opacity-70">Health</a>
            <button className="px-2 border rounded" onClick={() => { const url = location.href; navigator.clipboard.writeText(url) }}>Share</button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-[420px]">
          <Typeahead onPick={(t) => setQueryPick(t)} />
          <Filters onChange={setTracks} />
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((r, i) => <RoleCardInline key={i} role={r} />)}
      </div>
    </div>
  )
}
