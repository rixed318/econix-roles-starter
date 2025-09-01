import fs from 'node:fs'
import path from 'node:path'
import initSqlJs from 'sql.js'

async function main() {
  const SQL = await initSqlJs()
  const db = new SQL.Database()

  const roles = JSON.parse(fs.readFileSync('data/roles.json','utf-8'))
  const salaries = JSON.parse(fs.readFileSync('data/salaries.json','utf-8'))
  const sources = JSON.parse(fs.readFileSync('data/sources.json','utf-8'))

  db.run(`CREATE TABLE roles (id INTEGER PRIMARY KEY, title TEXT, subtitle TEXT, category TEXT)`)
  db.run(`CREATE TABLE role_sections (role_id INTEGER, title TEXT, content TEXT)`)
  db.run(`CREATE TABLE salaries (role TEXT, region TEXT, value TEXT, p10 TEXT, p90 TEXT, usdpm REAL)`)
  db.run(`CREATE TABLE sources (id TEXT PRIMARY KEY, name TEXT, region TEXT, type TEXT, url TEXT, license TEXT, update_freq TEXT)`)

  const insRole = db.prepare('INSERT INTO roles(title, subtitle, category) VALUES (?,?,?)')
  const insSec = db.prepare('INSERT INTO role_sections(role_id, title, content) VALUES (?,?,?)')
  roles.forEach((r: any) => {
    insRole.run([r.title, r.subtitle ?? '', r.category ?? ''])
  })
  insRole.free()

  const roleIdByTitle = new Map<string, number>()
  const selRoles = db.exec(`SELECT rowid as id, title FROM roles`)[0]
  if (selRoles) {
    for (const row of selRoles.values) {
      roleIdByTitle.set(row[1] as string, row[0] as number)
    }
  }
  roles.forEach((r: any) => {
    const id = roleIdByTitle.get(r.title)
    if (id && Array.isArray(r.sections)) {
      r.sections.forEach((s: any) => insSec.run([id, s.title ?? '', s.content ?? '']))
    }
  })
  insSec.free()

  const insSal = db.prepare('INSERT INTO salaries(role, region, value, p10, p90, usdpm) VALUES (?,?,?,?,?,?)')
  salaries.forEach((s: any) => {
    for (const [region, entry] of Object.entries(s.regions ?? {})) {
      if (typeof entry === 'string') {
        insSal.run([s.role, region, entry, null, null, null])
      } else {
        insSal.run([s.role, region, entry.value, entry.p10 ?? null, entry.p90 ?? null, entry.usdpm ?? null])
      }
    }
  })
  insSal.free()

  const insSrc = db.prepare('INSERT INTO sources(id, name, region, type, url, license, update_freq) VALUES (?,?,?,?,?,?,?)')
  sources.forEach((s: any) => insSrc.run([s.id, s.name, s.region, s.type, s.url, s.license, s.update || s.update_freq || '']))
  insSrc.free()

  const data = db.export()
  const out = path.resolve('data/econix.db')
  fs.writeFileSync(out, Buffer.from(data))
  console.log(`Built SQLite snapshot → ${out}`)
}
main().catch(e => { console.error(e); process.exit(1) })
