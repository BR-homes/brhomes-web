"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerificationSchema = exports.completeProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
    email: zod_1.z.string().email('Invalid email address').toLowerCase().trim(),
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').max(100),
    role: zod_1.z.enum(['buyer', 'owner'], {
        errorMap: () => ({ message: 'Role must be buyer or owner' }),
    }),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase().trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.completeProfileSchema = zod_1.z.object({
    phone: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    role: zod_1.z.enum(['buyer', 'owner'], {
        errorMap: () => ({ message: 'Role must be buyer or owner' }),
    }),
});
exports.resendVerificationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address').toLowerCase().trim(),
});
//# sourceMappingURL=auth.validation.js.map