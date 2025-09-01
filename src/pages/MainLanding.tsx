import React, { useMemo } from 'react'
import rolesJson from '../../data/roles.json'
import salariesJson from '../../data/salaries.json'
import { RolesSchema, SalariesSchema, Role, Salary } from '../core/schemas'
import { RoleCard } from '../components/RoleCard'
import { SalaryBoard } from '../components/SalaryBoard'
import { SearchBox } from '../components/SearchBox'
import { Tabs, Tab } from '../components/Tabs'
import { useStore } from '../core/store'
import { useI18n } from '../i18n'
import { searchRoles, applyFilters } from '../core/utils'

const rolesParsed = RolesSchema.safeParse(rolesJson)
if (!rolesParsed.success) console.error(rolesParsed.error)
const roles: Role[] = rolesParsed.success ? rolesParsed.data : []

const salariesParsed = SalariesSchema.safeParse(salariesJson)
if (!salariesParsed.success) console.error(salariesParsed.error)
const salaries: Salary[] = salariesParsed.success ? salariesParsed.data : []

export default function MainLanding() {
  const query = useStore(s => s.query)
  const filters = useStore(s => s.filters)
  const region = useStore(s => s.activeRegion)
  const setRegion = useStore(s => s.setRegion)
  const { t, locale, setLocale } = useI18n()

  const filtered = useMemo(() => {
    const filtered = applyFilters(roles, filters)
    return searchRoles(filtered, query)
  }, [query, filters])

  const regions = ['usa','eu','russia','china'] as const
  const regionTabs: Tab[] = regions.map(r => ({ id: r, label: r.toUpperCase(), content: null }))
  const activeIdx = regions.indexOf(region)

  return (
    <div className="max-w-6xl mx-auto p-4">
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')} • {t('subtitle')}</h1>
          <p className="text-gray-600 text-sm">{t('dataNote')}</p>
        </div>
        <div className="flex gap-2 items-center">
          <Tabs tabs={regionTabs} active={activeIdx} onChange={(i) => setRegion(regions[i])} />
          <button className="border px-2" onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}>{locale.toUpperCase()}</button>
          <a href="#wizard" className="text-sm underline">Wizard</a>
          <a href="#compare" className="text-sm underline">Compare</a>
          <a href="#compare-plus" className="text-sm underline">Compare+</a>
          <a href="#charts" className="text-sm underline">Charts</a>
          <a href="#guide" className="text-sm underline">Guide</a>
          <a href="#unmatched" className="text-sm underline opacity-70">Unmatched</a>
          <a href="#health" className="text-sm underline opacity-70">Health</a>
        </div>
      </header>
      <main id="main" className="grid md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-3">
          <div className="card">
            <SearchBox />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((role, idx) => <RoleCard key={idx} role={role} />)}
          </div>
        </section>
        <aside className="space-y-3">
          <SalaryBoard items={salaries} />
          <div className="card text-sm text-gray-600">
            {t('dataNote')}
          </div>
        </aside>
      </main>
    </div>
  )
}
