import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["buyer", "owner"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    phone: string;
    role: "buyer" | "owner";
    password: string;
}, {
    name: string;
    email: string;
    phone: string;
    role: "buyer" | "owner";
    password: string;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const completeProfileSchema: z.ZodObject<{
    phone: z.ZodString;
    role: z.ZodEnum<["buyer", "owner"]>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    role: "buyer" | "owner";
}, {
    phone: string;
    role: "buyer" | "owner";
}>;
export declare const resendVerificationSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
//# sourceMappingURL=auth.validation.d.ts.map