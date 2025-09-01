import React from 'react'
import { Salary } from '../core/schemas'
import { useStore } from '../core/store'
import { useI18n } from '../i18n'
import { toCSV, toMarkdownTable, downloadBlob } from '../core/export'
import { normalizeDisplay } from '../core/pay'
import sources from '../../data/sources.json'

const sourceMap = Object.fromEntries((sources as any[]).map((s: any) => [s.id, s]))

export const SalaryBoard: React.FC<{ items: Salary[] }> = ({ items }) => {
  const region = useStore(s => s.activeRegion)
  const { t } = useI18n()

  const rows = items.map(s => ({
    role: s.role,
    USA: typeof s.regions.usa === 'string' ? s.regions.usa : s.regions.usa?.value ?? '',
    EU: typeof s.regions.eu === 'string' ? s.regions.eu : s.regions.eu?.value ?? '',
    Russia: typeof s.regions.russia === 'string' ? s.regions.russia : s.regions.russia?.value ?? '',
    China: typeof s.regions.china === 'string' ? s.regions.china : s.regions.china?.value ?? ''
  }))

  const exportCSV = () => downloadBlob(toCSV(rows), 'salaries.csv')
  const exportMD = () => {
    const md = toMarkdownTable(rows)
    downloadBlob(new Blob([md], { type: 'text/markdown;charset=utf-8;' }), 'salaries.md')
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{t('salaryBoard')}</div>
        <div className="space-x-2 text-xs">
          <button onClick={exportCSV}>{t('exportCSV')}</button>
          <button onClick={exportMD}>{t('exportMD')}</button>
        </div>
      </div>
      <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {items.map((s, idx) => {
          const entry: any = s.regions?.[region]
          const value = typeof entry === 'string' ? entry : entry?.value
          const usdpm = typeof entry === 'object' ? entry?.usdpm : undefined
          const norm = usdpm ? { usdPerMonth: usdpm } : value ? normalizeDisplay(value) : {}
          const title = norm.usdPerMonth ? `≈ $${norm.usdPerMonth} / month (нормализация)` : undefined
          const meta = (s as any).sourceMeta?.[region]
          const info = meta ? (sourceMap as any)[meta.sourceId] : null
          const href = meta?.url || info?.url
          const label = info?.name || meta?.sourceId
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="font-medium">{s.role}</div>
              <div className="tabular-nums text-sm" title={title}>
                {value ?? '—'}
                {value && (
                  meta ? (
                    href ? (
                      <a
                        href={href}
                        target="_blank"
                        className="ml-1 text-[10px] underline"
                        rel="noreferrer"
                      >{label}</a>
                    ) : (
                      <span className="ml-1 text-[10px] underline">{label}</span>
                    )
                  ) : (
                    <span className="ml-1 text-[10px] opacity-60">derived</span>
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
