import React from 'react'
import { Role } from '../core/schemas'
import { readStateFromUrl, writeStateToUrl } from '@/core/share'
import { usePins } from '@/core/pin'
import { inferTrack } from '@/core/track'

export const RoleCard: React.FC<{ role: Role }> = ({ role }) => {
  const shared = readStateFromUrl().role
  const active = shared === role.title
  const { pins, toggle } = usePins()
  const pinned = pins.includes(role.title)
  return (
    <div
      className={`card ${active ? 'ring-2 ring-blue-500' : ''}`}
      tabIndex={0}
      aria-label={role.title}
      onClick={() => writeStateToUrl({ role: role.title })}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold">{role.title}</h3>
        <button
          onClick={e => { e.stopPropagation(); toggle(role.title) }}
          className={"px-2 py-1 rounded border text-xs " + (pinned ? 'bg-black text-white' : 'bg-white')}
        >
          {pinned ? 'Pinned' : 'Pin'}
        </button>
      </div>
      {role.subtitle && <p className="text-sm text-gray-600 mt-1">{role.subtitle}</p>}
      <div className="mt-3 space-y-2">
        {role.sections.slice(0,4).map((s, i) => (
          <div key={i}>
            <div className="text-xs font-medium text-gray-500">{s.title}</div>
            <div className="text-sm">{s.content}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-gray-500">{inferTrack(role.title)}</div>
    </div>
  )
}
