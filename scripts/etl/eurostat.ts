import fs from 'node:fs'
import path from 'node:path'
import { CanonSalary } from './schemas'

const URL = process.env.EUROSTAT_URL || 'file://sources/eurostat/ict-earnings-2024.csv'
const OUT = path.resolve('data/tmp/eurostat.json')
fs.mkdirSync(path.dirname(OUT), { recursive: true })

function parseCSV(text: string) {
  const lines = text.trim().split(/\r?\n/)
  const header = lines.shift()!.split(',')
  const out: Record<string, string>[] = []
  for (const line of lines) {
    const cols = line.split(',')
    const row: Record<string, string> = {}
    header.forEach((h, i) => row[h.trim()] = cols[i]?.trim() ?? '')
    out.push(row)
  }
  return out
}

async function main() {
  let text: string
  if (URL.startsWith('file://')) {
    const p = URL.replace('file://', '')
    text = fs.readFileSync(p, 'utf-8')
  } else {
    text = fs.readFileSync('sources/eurostat/ict-earnings-2024.csv', 'utf-8')
  }

  const rows = parseCSV(text)
  const data: CanonSalary[] = rows.flatMap(r => {
    if (!r['occupation'] || !r['median_monthly_eur']) return []
    return [{
      role: r['occupation'],
      region: 'eu',
      value: `€${r['median_monthly_eur']}/mo`,
      sourceId: 'eurostat-ict-2024'
    }]
  })
  fs.writeFileSync(OUT, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`Wrote ${OUT} (${data.length})`)
}
main().catch(e => { console.error(e); process.exit(1) })
