import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from './config/env'
import errorMiddleware from './middleware/errorMiddleware'
import authRoutes from './routes/auth.routes'
import propertyRoutes from './routes/property.routes'
import ownerRoutes from './routes/owner.routes'
import savedRoutes from './routes/saved.routes'
import adminRoutes from './routes/admin.routes'
import User from './models/User.model'
import Setting from './models/Setting.model'

const app = express()

// Security & parsing middleware
app.use(helmet())
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging (dev only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'BR-Homes API is running', timestamp: new Date().toISOString() })
})

// No need to redirect for Auth.js anymore

const start = async () => {
  // 1. Connect to MongoDB
  await mongoose.connect(env.MONGODB_URI)
  console.log('✅ MongoDB connected')

  // 3. Register routes
  app.use('/api/auth', authRoutes)
  app.use('/api/properties', propertyRoutes)
  app.use('/api/owner', ownerRoutes)
  app.use('/api/saved', savedRoutes)
  app.use('/api/admin', adminRoutes)

  // 4. Global error handler — MUST be last
  app.use(errorMiddleware)

  // 5. Seed default settings
  await seedSettings()

  // 6. Seed admin user
  await seedAdmin()

  // 7. Start server
  app.listen(Number.parseInt(env.PORT, 10), () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
    console.log(`📦 Environment: ${env.NODE_ENV}`)
  })
}

/**
 * Seed default platform settings
 */
const seedSettings = async () => {
  await Setting.findOneAndUpdate(
    { key: 'globalImageLimit' },
    {
      $setOnInsert: {
        key: 'globalImageLimit',
        value: 7,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  )
  console.log('✅ Settings seeded')
}

/**
 * Seed admin user — creates or updates admin account
 */
const seedAdmin = async () => {
  const adminEmail = 'brhomes.app@gmail.com'
  const existingAdmin = await User.findOne({ email: adminEmail })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  {
    const passwordHash = await bcrypt.hash('Admin@123', 10)
    await User.create({
      name: 'BR-Homes Admin',
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
      isProfileComplete: true,
      ownerApproved: true,
      emailVerified: new Date(),
      phone: '0000000000',
    })
    // console.log('✅ Admin user created (brhomes.app@gmail.com / Admin@123)')
  }
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})
