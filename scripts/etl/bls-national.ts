import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import { fetchWithCache } from './http'
import roleMap from './roleMap.json' assert { type: 'json' }

const URL = process.env.BLS_T01_URL || 'https://www.bls.gov/news.release/ocwage.t01.htm'
const OUT = path.resolve('data/tmp/bls.json')
fs.mkdirSync(path.dirname(OUT), { recursive: true })

function canon(name: string) {
  return (roleMap as Record<string, string>)[name] ?? name
}

async function main() {
  const html = await fetchWithCache(URL, 'bls-ocwage-t01.html')
  const $ = cheerio.load(html)
  const rows: any[] = []
  $('table tr').each((_, tr) => {
    const tds = $(tr).find('td')
    if (tds.length < 6) return
    const occ = $(tds[0]).text().trim()
    const median = $(tds[5]).text().trim()
    if (!occ || !median || /occupation|code/i.test(occ)) return
    rows.push({ role: canon(occ), region: 'usa', value: `$${median.replace(/[,$]/g,'')}/yr`, sourceId: 'bls-oews-2024', url: URL })
  })
  fs.writeFileSync(OUT, JSON.stringify(rows, null, 2), 'utf-8')
  console.log(`BLS rows: ${rows.length} → ${OUT}`)
}
main().catch(e => { console.error(e); process.exit(1) })
