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
  const res = db.exec(`SELECT role, value FROM salaries WHERE region = ?`, [region])
  if (!res.length) return []
  const [table] = res
  return table.values.map(v => ({ role: String(v[0]), value: String(v[1]) }))
}
