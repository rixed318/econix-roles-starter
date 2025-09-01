import React from 'react'
import { Salary } from '../core/schemas'
import { useStore } from '../core/store'
import { useI18n } from '../i18n'

const toCSV = (data: Salary[]) => {
  const header = ['role', 'usa', 'eu', 'russia', 'china']
  const rows = data.map(d => [d.role, d.regions.usa, d.regions.eu, d.regions.russia, d.regions.china].join(','))
  return [header.join(','), ...rows].join('\n')
}
const toMD = (data: Salary[]) => {
  const header = '|role|usa|eu|russia|china|\n|---|---|---|---|---|'
  const rows = data.map(d => `|${d.role}|${d.regions.usa ?? ''}|${d.regions.eu ?? ''}|${d.regions.russia ?? ''}|${d.regions.china ?? ''}|`)
  return [header, ...rows].join('\n')
}

export const SalaryBoard: React.FC<{ items: Salary[] }> = ({ items }) => {
  const region = useStore(s => s.activeRegion)
  const { t } = useI18n()

  const download = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{t('salaryBoard')}</div>
        <div className="space-x-2 text-xs">
          <button onClick={() => download(toCSV(items), 'salaries.csv')}>{t('exportCSV')}</button>
          <button onClick={() => download(toMD(items), 'salaries.md')}>{t('exportMD')}</button>
        </div>
      </div>
      <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {items.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="font-medium">{s.role}</div>
            <div className="tabular-nums text-sm">{s.regions?.[region] ?? '—'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
