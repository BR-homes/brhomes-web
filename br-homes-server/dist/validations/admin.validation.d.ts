import { z } from 'zod';
export declare const rejectPropertySchema: z.ZodObject<{
    rejectionNote: z.ZodString;
}, "strip", z.ZodTypeAny, {
    rejectionNote: string;
}, {
    rejectionNote: string;
}>;
export declare const updateImageLimitSchema: z.ZodObject<{
    imageLimit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    imageLimit: number;
}, {
    imageLimit: number;
}>;
export declare const updateGlobalImageLimitSchema: z.ZodObject<{
    globalImageLimit: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    globalImageLimit: number;
}, {
    globalImageLimit: number;
}>;
export type RejectPropertyInput = z.infer<typeof rejectPropertySchema>;
export type UpdateImageLimitInput = z.infer<typeof updateImageLimitSchema>;
export type UpdateGlobalImageLimitInput = z.infer<typeof updateGlobalImageLimitSchema>;
//# sourceMappingURL=admin.validation.d.ts.map