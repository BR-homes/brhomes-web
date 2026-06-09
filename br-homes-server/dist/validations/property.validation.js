"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPropertySchema = exports.updatePropertySchema = exports.createPropertySchema = void 0;
const zod_1 = require("zod");
exports.createPropertySchema = zod_1.z
    .object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters').max(150).trim(),
    description: zod_1.z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .max(2000)
        .trim(),
    propertyType: zod_1.z.enum(['house', 'flat'], {
        errorMap: () => ({ message: 'Invalid property type' }),
    }),
    listingType: zod_1.z.enum(['sale', 'rent'], {
        errorMap: () => ({ message: 'Listing type must be sale or rent' }),
    }),
    bhk: zod_1.z.coerce.number().int().min(1).max(5).optional().nullable(),
    areaSqft: zod_1.z.coerce.number().positive().optional().nullable(),
    price: zod_1.z.coerce.number().positive('Price must be a positive number'),
    city: zod_1.z.string().min(2).max(100).trim(),
    areaLocality: zod_1.z.string().min(2, 'Area/locality is required').max(200).trim(),
    pincode: zod_1.z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
    contactPhone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})
    .refine((data) => {
    // BHK is required only for house and flat
    if (['house', 'flat'].includes(data.propertyType)) {
        return data.bhk != null && data.bhk >= 1 && data.bhk <= 5;
    }
    return true;
}, {
    message: 'BHK is required for house and flat (1-5)',
    path: ['bhk'],
});
// No need to validate shop/land-specific BHK rules since only house/flat are allowed
exports.updatePropertySchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(150).trim().optional(),
    description: zod_1.z.string().min(20).max(2000).trim().optional(),
    propertyType: zod_1.z.enum(['house', 'flat']).optional(),
    listingType: zod_1.z.enum(['sale', 'rent']).optional(),
    bhk: zod_1.z.coerce.number().int().min(1).max(5).optional().nullable(),
    areaSqft: zod_1.z.coerce.number().positive().optional().nullable(),
    price: zod_1.z.coerce.number().positive().optional(),
    city: zod_1.z.string().min(2).max(100).trim().optional(),
    areaLocality: zod_1.z.string().min(2).max(200).trim().optional(),
    pincode: zod_1.z.string().regex(/^\d{6}$/).optional(),
    contactPhone: zod_1.z.string().regex(/^[6-9]\d{9}$/).optional(),
    removeImages: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.markPropertySchema = zod_1.z.object({
    status: zod_1.z.enum(['sold', 'rented'], {
        errorMap: () => ({ message: 'Status must be sold or rented' }),
    }),
});
//# sourceMappingURL=property.validation.js.map