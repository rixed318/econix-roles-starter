import { z } from 'zod'

export const RoleSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const RoleSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  category: z.string(),
  sections: z.array(RoleSectionSchema),
})

export const SalarySchema = z.object({
  role: z.string(),
  regions: z.record(z.string(), z.string()).default({}),
  sourceMeta: z
    .record(z.string(), z.object({ sourceId: z.string(), url: z.string().optional() }))
    .optional(),
})

export const RolesSchema = z.array(RoleSchema)
export const SalariesSchema = z.array(SalarySchema)

export type Role = z.infer<typeof RoleSchema>
export type Salary = z.infer<typeof SalarySchema>
