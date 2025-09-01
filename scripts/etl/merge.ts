import fs from 'node:fs'
import path from 'node:path'
import map from './roleMap.json'
import { CanonSalary, MergeRow } from './schemas'

const TMP = path.resolve('data/tmp')
const OUT = path.resolve('data/salaries.json')

function canonRole(name: string): string {
  return (map as Record<string,string>)[name] ?? name
}

function groupByRole(items: CanonSalary[]): MergeRow[] {
  const grouped = new Map<string, MergeRow>()
  for (const it of items) {
    const role = canonRole(it.role)
    const row = grouped.get(role) ?? { role, regions: {}, sourceMeta: {} }
    row.regions[it.region] = it.value
    row.sourceMeta![it.region] = { sourceId: it.sourceId, url: it.url }
    grouped.set(role, row)
  }
  return Array.from(grouped.values())
}

function readJSON(p: string) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

async function main() {
  const parts: CanonSalary[] = []
  for (const f of ['bls.json','eurostat.json']) {
    const p = path.join(TMP, f)
    if (fs.existsSync(p)) parts.push(...readJSON(p))
  }
  const merged = groupByRole(parts)
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf-8')
  console.log(`Merged → ${OUT} (${merged.length})`)
}
main().catch(e => { console.error(e); process.exit(1) })
