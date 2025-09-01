import fs from 'node:fs'
import path from 'node:path'
import { fetchWithCache } from './http'
import { CanonSalary } from './schemas'

const URL = process.env.BLS_URL || 'file://sources/bls/oesw-2024.csv'
const OUT = path.resolve('data/tmp/bls.json')
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
    text = await fetchWithCache(URL, 'bls-2024.csv')
  }

  const rows = parseCSV(text)
  const data: CanonSalary[] = rows.flatMap(r => {
    const occ = r['occupation']
    const pay = r['median_annual_pay_usd']
    if (!occ || !pay) return []
    return [{
      role: occ,
      region: 'usa',
      value: `$${pay}/yr`,
      sourceId: 'bls-oews-2024'
    }]
  })

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`Wrote ${OUT} (${data.length})`)
}
main().catch(e => { console.error(e); process.exit(1) })
