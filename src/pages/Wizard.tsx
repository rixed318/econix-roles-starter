import { useState } from 'react'
import { recommend, type Answer } from '../core/recommend'
import roles from '../../data/roles.json'

export default function Wizard() {
  const [a, setA] = useState<Answer>({ math:'mid', creativity:'mid', teamwork:'mixed', runtime:'any', risk:'stable', salaryFocus:'ok' })
  const res = recommend(a)
  const inRoles = (roles as any[]).filter(r => res.roles.includes(r.title))

  const Choice = <T extends string>({ value, current, set, label }: { value: T; current: T; set: (v:T)=>void; label: string }) => (
    <button onClick={()=>set(value)} className={'px-3 py-1 rounded border ' + (current===value ? 'bg-black text-white' : 'bg-white')}>
      {label}
    </button>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Подбор направления</h1>

      <section className="card space-y-2">
        <div className="font-semibold">Насколько ок математика?</div>
        <div className="flex gap-2">
          <Choice value="low" current={a.math} set={v=>setA({...a, math:v})} label="Минимум" />
          <Choice value="mid" current={a.math} set={v=>setA({...a, math:v})} label="Средне" />
          <Choice value="high" current={a.math} set={v=>setA({...a, math:v})} label="Сильно" />
        </div>
      </section>

      <section className="card space-y-2">
        <div className="font-semibold">Где хочется строить?</div>
        <div className="flex gap-2 flex-wrap">
          <Choice value="web" current={a.runtime} set={v=>setA({...a, runtime:v})} label="Web" />
          <Choice value="mobile" current={a.runtime} set={v=>setA({...a, runtime:v})} label="Mobile" />
          <Choice value="data" current={a.runtime} set={v=>setA({...a, runtime:v})} label="Data/ML" />
          <Choice value="systems" current={a.runtime} set={v=>setA({...a, runtime:v})} label="Backend/Systems" />
          <Choice value="any" current={a.runtime} set={v=>setA({...a, runtime:v})} label="Любое" />
        </div>
      </section>

      <section className="card space-y-2">
        <div className="font-semibold">Фокус на зарплате?</div>
        <div className="flex gap-2">
          <Choice value="ok" current={a.salaryFocus} set={v=>setA({...a, salaryFocus:v})} label="Не критично" />
          <Choice value="max" current={a.salaryFocus} set={v=>setA({...a, salaryFocus:v})} label="Максимум" />
        </div>
      </section>

      <div className="card">
        <div className="font-semibold mb-2">Рекомендации</div>
        <p className="text-sm mb-3">{res.rationale}</p>
        {inRoles.length ? (
          <ul className="list-disc pl-5 space-y-2">
            {inRoles.map((r: any, i) => (
              <li key={i}>
                <b>{r.title}</b> — <span className="text-gray-600 text-sm">{r.subtitle}</span>
              </li>
            ))}
          </ul>
        ) : <div className="text-sm text-gray-600">Пока нет явных совпадений. Попробуйте изменить ответы выше.</div>}
      </div>
    </div>
  )
}
