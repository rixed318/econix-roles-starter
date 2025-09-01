import fs from 'node:fs'
import path from 'node:path'

const SRC = process.env.EUROSTAT_TSV || 'sources/eurostat/earn_gr_isco.tsv'
const OUT = path.resolve('data/tmp/eurostat.json')
fs.mkdirSync(path.dirname(OUT), { recursive: true })

function parseTSV(tsv: string) {
  const lines = tsv.trim().split(/\r?\n/)
  const out:any[]=[]
  for (let i=1;i<lines.length;i++){
    const [key, val] = lines[i].split('\t')
    const parts = key.split(',')
    const country = parts[0], isco = parts[2], year = parts.at(-1)
    const amount = val?.trim()
    if (!amount || !year?.includes('202')) continue
    out.push({ role: isco, region: 'eu', value: `€${amount}/yr`, sourceId: 'eurostat-earn_gr_isco' })
  }
  return out
}

async function main(){
  const tsv = fs.readFileSync(SRC,'utf-8')
  const rows = parseTSV(tsv)
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2),'utf-8')
  console.log(`Eurostat rows: ${rows.length} \u2192 ${OUT}`)
}
main().catch(e => { console.error(e); process.exit(1) })
