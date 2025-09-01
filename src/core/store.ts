import { create } from 'zustand'

export type Filters = Record<string, string>

interface Store {
  query: string
  activeRegion: 'usa' | 'eu' | 'russia' | 'china'
  filters: Filters
  setQuery: (q: string) => void
  setRegion: (r: Store['activeRegion']) => void
  setFilters: (f: Filters) => void
}

export const useStore = create<Store>((set) => ({
  query: '',
  activeRegion: 'usa',
  filters: {},
  setQuery: (q) => set({ query: q }),
  setRegion: (r) => set({ activeRegion: r }),
  setFilters: (f) => set({ filters: f }),
}))

export const useFilters = () => useStore((s) => [s.filters, s.setFilters] as const)
