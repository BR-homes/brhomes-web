"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    CLIENT_URL: zod_1.z.string().default('http://localhost:5173'),
    MONGODB_URI: zod_1.z.string().default('mongodb://localhost:27017/br-homes'),
    JWT_SECRET: zod_1.z.string().min(32).default('dev-secret-change-me-in-production-32chars!!'),
    GOOGLE_CLIENT_ID: zod_1.z.string().default('placeholder-google-client-id'),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().default('placeholder-google-client-secret'),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().default('placeholder'),
    CLOUDINARY_API_KEY: zod_1.z.string().default('placeholder'),
    CLOUDINARY_API_SECRET: zod_1.z.string().default('placeholder'),
    RESEND_API_KEY: zod_1.z.string().default('re_placeholder'),
    RESEND_FROM_EMAIL: zod_1.z.string().default('noreply@example.com'),
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map