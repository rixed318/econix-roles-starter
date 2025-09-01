import Fuse from 'fuse.js'
import { Role } from './schemas'
import { Filters } from './store'

export const searchRoles = (roles: Role[], query: string) => {
  if (!query.trim()) return roles
  const fuse = new Fuse(roles, { keys: ['title', 'subtitle', 'sections.content', 'sections.title'], threshold: 0.3 })
  return fuse.search(query).map(r => r.item)
}

export const applyFilters = (roles: Role[], filters: Filters) => {
  let list = roles
  if (filters.category) list = list.filter(r => r.category === filters.category)
  return list
}
