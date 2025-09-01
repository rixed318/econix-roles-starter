import { create } from 'zustand'

type PinState = { pins: string[]; toggle: (title: string) => void; clear: () => void }
export const usePins = create<PinState>(set => ({
  pins: [],
  toggle: t => set(s => s.pins.includes(t) ? { pins: s.pins.filter(x => x !== t) } : s.pins.length < 5 ? { pins: [...s.pins, t] } : s),
  clear: () => set({ pins: [] })
}))
