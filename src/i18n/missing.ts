export type Dict = Record<string, any>
export function diffKeys(base: Dict, target: Dict, prefix = ''): string[] {
  const out: string[] = []
  for (const k of Object.keys(base)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (!(k in target)) out.push(p)
    else if (typeof base[k] === 'object' && base[k] && typeof target[k] === 'object' && target[k])
      out.push(...diffKeys(base[k], target[k], p))
  }
  return out
}
