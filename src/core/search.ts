import Fuse from 'fuse.js'

type Role = { title: string; subtitle?: string; sections?: { title: string; content: string }[]; category?: string }

let fuse: Fuse<Role> | null = null
export function makeFuse(data: Role[]) {
  fuse = new Fuse(data, {
    includeMatches: true,
    threshold: 0.28,
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'subtitle', weight: 0.2 },
      { name: 'sections.title', weight: 0.1 },
      { name: 'sections.content', weight: 0.1 },
    ],
  })
}

export type TAHit = { item: Role; highlights: Array<{ key: string; indices: Array<[number, number]> }> }
export function typeahead(q: string, limit = 8): TAHit[] {
  if (!fuse || !q.trim()) return []
  return fuse.search(q, { limit }).map(r => ({
    item: r.item,
    highlights: (r.matches || []).map(m => ({ key: m.key as string, indices: m.indices as any }))
  }))
}

export function highlight(text: string, indices: Array<[number, number]>) {
  if (!indices?.length) return [{ text, mark: false }]
  const out: Array<{ text: string; mark: boolean }> = []
  let last = 0
  indices.forEach(([from, to]) => {
    if (from > last) out.push({ text: text.slice(last, from), mark: false })
    out.push({ text: text.slice(from, to + 1), mark: true })
    last = to + 1
  })
  if (last < text.length) out.push({ text: text.slice(last), mark: false })
  return out
}
