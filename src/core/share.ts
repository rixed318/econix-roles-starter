export function readStateFromUrl() {
  const h = window.location.hash
  const [, q] = h.split('?')
  const p = new URLSearchParams(q || '')
  return {
    query: p.get('q') || '',
    region: (p.get('r') as any) || 'usa',
    role: p.get('role') || ''
  }
}
export function writeStateToUrl(state: {query?: string; region?: string; role?: string}) {
  const base = window.location.hash.split('?')[0] || '#/'
  const p = new URLSearchParams()
  if (state.query) p.set('q', state.query)
  if (state.region) p.set('r', state.region)
  if (state.role) p.set('role', state.role)
  const next = `${base}${p.toString() ? '?' + p.toString() : ''}`
  history.replaceState(null, '', next)
  return location.href
}
