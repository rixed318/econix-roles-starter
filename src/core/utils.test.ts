import { describe, it, expect } from 'vitest'
import rolesJson from '../../data/roles.json'
import { RolesSchema } from './schemas'
import { searchRoles, applyFilters } from './utils'

const roles = RolesSchema.parse(rolesJson)

describe('searchRoles', () => {
  it('finds role by title', () => {
    const res = searchRoles(roles, 'Frontend')
    expect(res.some(r => r.title.includes('Frontend'))).toBe(true)
  })
})

describe('applyFilters', () => {
  it('filters by category', () => {
    const category = roles[0].category
    const res = applyFilters(roles, { category })
    expect(res.every(r => r.category === category)).toBe(true)
  })
})
