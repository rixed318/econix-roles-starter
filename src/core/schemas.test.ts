import roles from '../../data/roles.json'
import salaries from '../../data/salaries.json'
import { RoleSchema, SalarySchema } from './schemas'

test('valid roles.json', () => {
  expect(RoleSchema.array().safeParse(roles).success).toBe(true)
})

test('valid salaries.json', () => {
  expect(SalarySchema.array().safeParse(salaries).success).toBe(true)
})
