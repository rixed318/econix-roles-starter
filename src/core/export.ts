export function toCSV(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return new Blob([])
  const keys = Object.keys(rows[0])
  const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => esc(r[k])).join(','))].join('\n')
  return new Blob([new Uint8Array([0xef,0xbb,0xbf]), csv], { type: 'text/csv;charset=utf-8;' })
}
export function toMarkdownTable(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return ''
  const keys = Object.keys(rows[0])
  const header = `| ${keys.join(' | ')} |`
  const sep = `| ${keys.map(()=>'---').join(' | ')} |`
  const body = rows.map(r => `| ${keys.map(k => String(r[k] ?? '')).join(' | ')} |`).join('\n')
  return [header, sep, body].join('\n')
}
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
