import React from 'react'
import { Role } from '../core/schemas'
import { readStateFromUrl, writeStateToUrl } from '@/core/share'

export const RoleCard: React.FC<{ role: Role }> = ({ role }) => {
  const shared = readStateFromUrl().role
  const active = shared === role.title
  return (
    <div
      className={`card ${active ? 'ring-2 ring-blue-500' : ''}`}
      tabIndex={0}
      aria-label={role.title}
      onClick={() => writeStateToUrl({ role: role.title })}
    >
      <h3 className="text-lg font-semibold">{role.title}</h3>
      {role.subtitle && <p className="text-sm text-gray-600 mt-1">{role.subtitle}</p>}
      <div className="mt-3 space-y-2">
        {role.sections.slice(0,4).map((s, i) => (
          <div key={i}>
            <div className="text-xs font-medium text-gray-500">{s.title}</div>
            <div className="text-sm">{s.content}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">{role.category}</div>
    </div>
  )
}
