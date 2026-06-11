import { z } from 'zod'

export const createPropertySchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(150).trim(),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters')
      .max(2000)
      .trim(),
    propertyType: z.enum(['house', 'flat'], {
      errorMap: () => ({ message: 'Invalid property type' }),
    }),
    listingType: z.enum(['sale', 'rent'], {
      errorMap: () => ({ message: 'Listing type must be sale or rent' }),
    }),
    bhk: z.coerce.number().int().min(1).max(5).optional().nullable(),
    areaSqft: z.coerce.number().positive('Property area must be a positive number'),
    price: z.coerce.number().positive('Price must be a positive number'),
    city: z.string().min(2).max(100).trim(),
    areaLocality: z.string().min(2, 'Area/locality is required').max(200).trim(),
    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    contactPhone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  })
  .refine(
    (data) => {
      // BHK is required only for house and flat
      if (['house', 'flat'].includes(data.propertyType)) {
        return data.bhk != null && data.bhk >= 1 && data.bhk <= 5
      }
      return true
    },
    {
      message: 'BHK is required for house and flat (1-5)',
      path: ['bhk'],
    }
  )
    // No need to validate shop/land-specific BHK rules since only house/flat are allowed

export const updatePropertySchema = z.object({
  title: z.string().min(5).max(150).trim().optional(),
  description: z.string().min(20).max(2000).trim().optional(),
  propertyType: z.enum(['house', 'flat']).optional(),
  listingType: z.enum(['sale', 'rent']).optional(),
  bhk: z.coerce.number().int().min(1).max(5).optional().nullable(),
  areaSqft: z.coerce.number().positive().optional().nullable(),
  price: z.coerce.number().positive().optional(),
  city: z.string().min(2).max(100).trim().optional(),
  areaLocality: z.string().min(2).max(200).trim().optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  removeImages: z.preprocess(
    (val) => {
      if (typeof val === 'string') return [val]
      if (Array.isArray(val)) return val
      return val
    },
    z.array(z.string())
  ).optional(),
})

export const markPropertySchema = z.object({
  status: z.enum(['sold', 'rented'], {
    errorMap: () => ({ message: 'Status must be sold or rented' }),
  }),
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
export type MarkPropertyInput = z.infer<typeof markPropertySchema>
