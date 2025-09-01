import roles from '../../data/roles.json'
import { slugify } from '@/core/slug'
import { useMemo } from 'react'

export default function RolePage({ slug }: { slug: string }) {
  const role = useMemo(() => (roles as any[]).find(r => slugify(r.title) === slug), [slug])
  if (!role) return <div className="p-4">Роль не найдена</div>

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{role.title}</h1>
      {role.subtitle && <p className="text-gray-600">{role.subtitle}</p>}
      <div className="space-y-3">
        {role.sections?.map((s: any, i: number) => (
          <section key={i} className="card">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm">{s.content}</div>
          </section>
        ))}
      </div>
      <a href="#path" className="underline text-sm">Посмотреть учебный маршрут для этой роли</a>
    </div>
  )
}
