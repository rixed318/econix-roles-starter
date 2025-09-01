import fs from 'node:fs'
import path from 'node:path'

const SRC = process.env.ONS_CSV || 'sources/ons/ashe_table14_2024.csv'
const OUT = path.resolve('data/tmp/ons.json')
fs.mkdirSync(path.dirname(OUT), { recursive: true })

function parseCSV(text: string) {
  const [head, ...lines] = text.trim().split(/\r?\n/)
  const H = head.split(',').map(s=>s.trim())
  const idx = (k:string) => H.findIndex(h => h.toLowerCase().includes(k))
  const iOcc = idx('occupation'), iMed = idx('median'), iP10 = idx('p10'), iP90 = idx('p90')
  const out:any[]=[]
  for (const line of lines) {
    const cols = line.split(',')
    const occ = cols[iOcc]?.trim(); const med = cols[iMed]?.trim()
    if (!occ || !med) continue
    out.push({
      role: occ, region: 'eu', value: `£${med}/yr`, p10: cols[iP10]?.trim(), p90: cols[iP90]?.trim(), sourceId: 'ons-ashe-2024'
    })
  }
  return out
}

async function main() {
  const csv = fs.readFileSync(SRC, 'utf-8')
  const rows = parseCSV(csv)
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2), 'utf-8')
  console.log(`ONS rows: ${rows.length} → ${OUT}`)
}
main().catch(e => { console.error(e); process.exit(1) })
