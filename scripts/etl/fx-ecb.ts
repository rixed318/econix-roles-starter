import fs from 'node:fs'
import path from 'node:path'
import { XMLParser } from 'fast-xml-parser'
import { fetchWithCache } from './http'

const URL = process.env.ECB_URL || 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'
const OUT = path.resolve('data/tmp/fx.json')
fs.mkdirSync(path.dirname(OUT), { recursive: true })

async function main() {
  const xml = await fetchWithCache(URL, 'ecb-90d.xml')
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' })
  const j = parser.parse(xml)
  const days = j['gesmes:Envelope'].Cube.Cube
  const out: Record<string, Record<string, number>> = {}
  for (const d of days) {
    const date = d.time
    const m: Record<string, number> = { EUR: 1 }
    for (const c of d.Cube) m[c.currency] = Number(c.rate)
    out[date] = m
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8')
  console.log(`FX saved → ${OUT}`)
}
main().catch(e => { console.error(e); process.exit(1) })
