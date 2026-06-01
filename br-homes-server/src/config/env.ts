import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/br-homes'),
  JWT_SECRET: z.string().min(32).default('dev-secret-change-me-in-production-32chars!!'),
  GOOGLE_CLIENT_ID: z.string().default('placeholder-google-client-id'),
  GOOGLE_CLIENT_SECRET: z.string().default('placeholder-google-client-secret'),
  CLOUDINARY_CLOUD_NAME: z.string().default('placeholder'),
  CLOUDINARY_API_KEY: z.string().default('placeholder'),
  CLOUDINARY_API_SECRET: z.string().default('placeholder'),
  RESEND_API_KEY: z.string().default('re_placeholder'),
  RESEND_FROM_EMAIL: z.string().default('noreply@example.com'),
})

export const env = envSchema.parse(process.env)
