import { z } from 'zod'
import roles from '../../data/roles.json'
import salaries from '../../data/salaries.json'
import { RoleSchema, SalarySchema } from './schemas'

export type Diagnostic = { file: 'roles.json'|'salaries.json'; path: string; message: string }

export function runDiagnostics(): Diagnostic[] {
  const diags: Diagnostic[] = []

  const r = z.array(RoleSchema).safeParse(roles)
  if (!r.success) {
    r.error.issues.forEach(i => diags.push({
      file: 'roles.json',
      path: i.path.join('.'),
      message: i.message
    }))
  }

  const s = z.array(SalarySchema).safeParse(salaries)
  if (!s.success) {
    s.error.issues.forEach(i => diags.push({
      file: 'salaries.json',
      path: i.path.join('.'),
      message: i.message
    }))
  }

  try {
    const roleSet = new Set((r.success ? r.data : []).map(x => x.title))
    if (Array.isArray(salaries)) {
      salaries.forEach((row: any, idx: number) => {
        if (row?.role && !roleSet.has(row.role)) {
          diags.push({ file: 'salaries.json', path: String(idx), message: `role "${row.role}" не найден в roles.json` })
        }
      })
    }
  } catch {}

  return diags
}
