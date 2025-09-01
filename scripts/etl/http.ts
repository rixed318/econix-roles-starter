import fs from 'node:fs'
import path from 'node:path'

const CACHE_DIR = path.resolve('sources/.cache')
fs.mkdirSync(CACHE_DIR, { recursive: true })

export async function fetchWithCache(url: string, cacheName: string) {
  const p = path.join(CACHE_DIR, cacheName)
  if (fs.existsSync(p)) return fs.readFileSync(p, 'utf-8')
  const res = await fetch(url, { headers: { 'user-agent': 'econix-roles-etl/1.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const text = await res.text()
  fs.writeFileSync(p, text, 'utf-8')
  return text
}
