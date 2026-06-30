import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import errorMiddleware from './middleware/errorMiddleware'
import authRoutes from './routes/auth.routes'
import propertyRoutes from './routes/property.routes'
import ownerRoutes from './routes/owner.routes'
import savedRoutes from './routes/saved.routes'
import adminRoutes from './routes/admin.routes'
import sliderRoutes from './routes/slider.routes'
import sidebarAdRoutes from './routes/sidebarAd.routes'
import categoryRoutes from './routes/category.routes'
import serviceRoutes from './routes/service.routes'

const app = express()

// Security & parsing middleware
app.use(helmet())
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) {
        callback(null, true)
        return
      }

      // Main allowed origins list (including the dynamically parsed CLIENT_URL)
      const allowedOrigins = [
        env.CLIENT_URL,
        'https://www.brhome.in',
        'https://brhome.in',
        'https://brhomes-app-br-homes-client.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000',
      ].filter(Boolean)

      // Check if origin matches any allowed origin exactly or after normalization
      const isAllowed = allowedOrigins.some((allowed) => {
        if (!allowed) return false
        const normAllowed = allowed.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
        const normOrigin = origin.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
        return normAllowed === normOrigin
      })

      // Check if origin matches domains dynamically
      const host = origin.replace(/^https?:\/\//, '').split(':')[0]
      const isDomainMatch =
        host === 'brhome.in' ||
        host.endsWith('.brhome.in') ||
        host === 'vercel.app' ||
        host.endsWith('.vercel.app') ||
        host === 'localhost' ||
        host === '127.0.0.1'

      if (isAllowed || isDomainMatch) {
        callback(null, origin)
      } else {
        callback(null, false)
      }
    },
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
  res.json({
    success: true,
    message: 'BR-Homes API is running',
    timestamp: new Date().toISOString()
  })
})

// Register routes
app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/owner', ownerRoutes)
app.use('/api/saved', savedRoutes)
app.use('/api/sliders', sliderRoutes)
app.use('/api/sidebar-ads', sidebarAdRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/services', serviceRoutes)

// Global error handler - MUST be last
app.use(errorMiddleware)

export default app
