import fs from 'node:fs'
import path from 'node:path'

const src = path.resolve('data/econix.db')
const destDir = path.resolve('public/data')
const dest = path.join(destDir, 'econix.db')

if (!fs.existsSync(src)) {
  console.warn('[copy-db] data/econix.db не найден — пропускаю (запусти etl:db или etl:all)')
  process.exit(0)
}
fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(src, dest)
console.log(`[copy-db] скопировано → ${path.relative(process.cwd(), dest)}`)
