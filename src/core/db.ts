import initSqlJs, { Database } from 'sql.js'

let _db: Database | null = null

export async function openDb(): Promise<Database> {
  if (_db) return _db
  const SQL = await initSqlJs()
  const resp = await fetch('/data/econix.db').catch(() => null)
  if (resp && resp.ok) {
    const buf = await resp.arrayBuffer()
    _db = new SQL.Database(new Uint8Array(buf))
  } else {
    _db = new SQL.Database()
  }
  return _db!
}

export async function getSalariesByRegion(region: string) {
  const db = await openDb()
  const res = db.exec(`SELECT role, value, p10, p90, usdpm FROM salaries WHERE region = ?`, [region])
  if (!res.length) return []
  const [table] = res
  return table.values.map(v => ({
    role: String(v[0]),
    value: String(v[1]),
    p10: v[2] ? String(v[2]) : undefined,
    p90: v[3] ? String(v[3]) : undefined,
    usdpm: v[4] != null ? Number(v[4]) : undefined
  }))
}

export async function getFxDate(): Promise<string | undefined> {
  try {
    const resp = await fetch('/data/fx.json')
    if (!resp.ok) return undefined
    const j = await resp.json()
    const dates = Object.keys(j).sort()
    return dates[dates.length - 1]
  } catch {
    return undefined
  }
}
