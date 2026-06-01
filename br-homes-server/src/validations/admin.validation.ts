import { z } from 'zod'

export const rejectPropertySchema = z.object({
  rejectionNote: z
    .string()
    .min(10, 'Rejection note must be at least 10 characters')
    .max(500)
    .trim(),
})

export const updateImageLimitSchema = z.object({
  imageLimit: z
    .number()
    .int()
    .min(1, 'Minimum image limit is 1')
    .max(20, 'Maximum image limit is 20'),
})

export const updateGlobalImageLimitSchema = z.object({
  globalImageLimit: z
    .number()
    .int()
    .min(1, 'Minimum limit is 1')
    .max(20, 'Maximum limit is 20'),
})

export type RejectPropertyInput = z.infer<typeof rejectPropertySchema>
export type UpdateImageLimitInput = z.infer<typeof updateImageLimitSchema>
export type UpdateGlobalImageLimitInput = z.infer<typeof updateGlobalImageLimitSchema>
