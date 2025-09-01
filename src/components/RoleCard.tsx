import React from 'react'
import { Role } from '../core/schemas'

export const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
  <div className="card" tabIndex={0} aria-label={role.title}>
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
