import fs from 'node:fs'
import path from 'node:path'
import map from './roleMap.json'
import { CanonSalary, MergeRow, RegionSalary } from './schemas'

const TMP = path.resolve('data/tmp')
const OUT = path.resolve('data/salaries.json')

function canonRole(name: string): string {
  return (map as Record<string,string>)[name] ?? name
}

function parseMoney(input: string) {
  const s = input.trim().toUpperCase()
  let currency: string | null = null
  if (s.includes('$')) currency = 'USD'
  else if (s.includes('€')) currency = 'EUR'
  else if (s.includes('£') || s.includes('GBP')) currency = 'GBP'
  else if (s.includes('¥') || s.includes('CNY')) currency = 'CNY'
  else if (s.includes('₽') || s.includes('RUB')) currency = 'RUB'
  const k = /(\d[\d\s,\.]*)(K)?/.exec(s)
  if (!currency || !k) return null
  let amount = Number(k[1].replace(/[\,\s]/g, ''))
  if (k[2]) amount *= 1000
  const period = /\/M|\/MO|\/МЕС|\/MONTH|\/МЕСЯЦ/i.test(s) ? 'm' : 'y'
  return { amount, currency, period }
}

function toUSD(amount: number, currency: string, rates: Record<string, number>) {
  if (currency === 'USD') return amount
  const usdPerEur = rates['USD']
  if (currency === 'EUR') return amount * usdPerEur
  const rate = rates[currency]
  if (!rate) return amount
  return amount / rate * usdPerEur
}

function usdPerMonth(value: string, rates: Record<string, number>) {
  const m = parseMoney(value)
  if (!m) return undefined
  const usd = toUSD(m.amount, m.currency, rates)
  return m.period === 'm' ? usd : usd / 12
}

function groupByRole(items: CanonSalary[], rates: Record<string, number>, fxDate: string): MergeRow[] {
  const grouped = new Map<string, MergeRow>()
  for (const it of items) {
    const role = canonRole(it.role)
    const row = grouped.get(role) ?? { role, regions: {}, sourceMeta: {}, fxDate }
    const region: RegionSalary = { value: it.value }
    const usdpm = usdPerMonth(it.value, rates)
    if (usdpm) region.usdpm = Math.round(usdpm)
    if (it.p10) region.p10 = it.p10
    if (it.p90) region.p90 = it.p90
    row.regions[it.region] = region
    row.sourceMeta![it.region] = { sourceId: it.sourceId, url: it.url }
    grouped.set(role, row)
  }
  return Array.from(grouped.values())
}

function readJSON(p: string) {
  return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

async function main() {
  const fxPath = path.join(TMP, 'fx.json')
  const fx = fs.existsSync(fxPath) ? readJSON(fxPath) : {}
  const dates = Object.keys(fx).sort()
  const latest = dates[dates.length - 1]
  const rates = latest ? fx[latest] : { USD: 1 }

  const parts: CanonSalary[] = []
  for (const f of ['bls.json','ons.json','eurostat.json']) {
    const p = path.join(TMP, f)
    if (fs.existsSync(p)) parts.push(...readJSON(p))
  }
  const merged = groupByRole(parts, rates, latest)
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf-8')
  console.log(`Merged → ${OUT} (${merged.length})`)
}
main().catch(e => { console.error(e); process.exit(1) })
