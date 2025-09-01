// Пример: читает локальный CSV и обновляет data/salaries.json
// Запуск: ts-node scripts/etl/example-bls.ts  (или node с tsx)
import fs from 'node:fs'
import path from 'node:path'

type SalaryRow = { role: string; regions: Partial<Record<'usa'|'eu'|'russia'|'china', string>> }

const SRC = path.resolve('sources/bls/oesw-2024.csv') // положи CSV сюда
const OUT = path.resolve('data/salaries.json')
const csv = fs.readFileSync(SRC, 'utf-8').trim().split(/\r?\n/)
const header = csv.shift()!.split(',')

const roleIdx = header.indexOf('occupation')
const payIdx  = header.indexOf('median_annual_pay_usd')

const out: SalaryRow[] = []
for (const line of csv) {
  const cols = line.split(',')
  const role = cols[roleIdx]
  const pay  = cols[payIdx]
  if (!role || !pay) continue
  out.push({ role, regions: { usa: `$${pay}/yr` } })
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8')
console.log(`Updated ${OUT} from ${SRC}`)
