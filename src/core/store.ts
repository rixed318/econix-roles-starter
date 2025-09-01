import { create } from 'zustand'
import { readStateFromUrl, writeStateToUrl } from './share'

export type Filters = Record<string, string>

interface Store {
  query: string
  activeRegion: 'usa' | 'eu' | 'russia' | 'china'
  filters: Filters
  setQuery: (q: string) => void
  setRegion: (r: Store['activeRegion']) => void
  setFilters: (f: Filters) => void
}

const initial = readStateFromUrl()

export const useStore = create<Store>((set) => ({
  query: initial.query,
  activeRegion: initial.region,
  filters: {},
  setQuery: (q) => {
    set({ query: q })
    writeStateToUrl({ query: q })
  },
  setRegion: (r) => {
    set({ activeRegion: r })
    writeStateToUrl({ region: r })
  },
  setFilters: (f) => set({ filters: f }),
}))

export const useFilters = () => useStore((s) => [s.filters, s.setFilters] as const)
