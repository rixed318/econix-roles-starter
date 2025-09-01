import React from 'react'
import { Salary } from '../core/schemas'
import { useStore } from '../core/store'
import { useI18n } from '../i18n'
import { toCSV, toMarkdownTable, downloadBlob } from '../core/export'
import { normalizeDisplay } from '../core/pay'
import sources from '../../data/sources.json'

export const SalaryBoard: React.FC<{ items: Salary[] }> = ({ items }) => {
  const region = useStore(s => s.activeRegion)
  const { t } = useI18n()

  const rows = items.map(s => ({
    role: s.role,
    USA: s.regions.usa ?? '',
    EU: s.regions.eu ?? '',
    Russia: s.regions.russia ?? '',
    China: s.regions.china ?? ''
  }))

  const exportCSV = () => downloadBlob(toCSV(rows), 'salaries.csv')
  const exportMD = () => {
    const md = toMarkdownTable(rows)
    downloadBlob(new Blob([md], { type: 'text/markdown;charset=utf-8;' }), 'salaries.md')
  }

  const regionMap: Record<string, string> = { usa: 'USA', eu: 'EU', russia: 'RU', china: 'CN' }
  const source = (sources as any[]).find(s => s.region === regionMap[region]) || (sources as any[]).find(s => s.region === 'Global')

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
          const value = s.regions?.[region]
          const norm = value ? normalizeDisplay(value) : {}
          const title = norm.usdPerMonth ? `≈ $${norm.usdPerMonth} / month (нормализация)` : undefined
          return (
            <div key={idx} className="flex items-center justify-between">
              <div className="font-medium">{s.role}</div>
              <div className="tabular-nums text-sm" title={title}>
                {value ?? '—'}
                {value && source && (
                  <a
                    href={source.url}
                    target="_blank"
                    className="ml-1 text-[10px] underline"
                    rel="noreferrer"
                  >Источник: {source.name}</a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
