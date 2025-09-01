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

const fxSrc = path.resolve('data/tmp/fx.json')
if (fs.existsSync(fxSrc)) {
  const fxDest = path.join(destDir, 'fx.json')
  fs.copyFileSync(fxSrc, fxDest)
  console.log(`[copy-db] скопировано → ${path.relative(process.cwd(), fxDest)}`)
}

const pathsSrc = path.resolve('data/paths')
if (fs.existsSync(pathsSrc)) {
  const pathsDest = path.join(destDir, 'paths')
  fs.mkdirSync(pathsDest, { recursive: true })
  for (const f of fs.readdirSync(pathsSrc)) {
    const srcFile = path.join(pathsSrc, f)
    if (fs.statSync(srcFile).isFile()) {
      const destFile = path.join(pathsDest, f)
      fs.copyFileSync(srcFile, destFile)
      console.log(`[copy-db] скопировано → ${path.relative(process.cwd(), destFile)}`)
    }
  }
}
