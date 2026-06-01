import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['buyer', 'owner'], {
    errorMap: () => ({ message: 'Role must be buyer or owner' }),
  }),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
})

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  role: z.enum(['buyer', 'owner'], {
    errorMap: () => ({ message: 'Role must be buyer or owner' }),
  }),
})

export const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>
