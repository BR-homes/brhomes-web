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

// Global error handler - MUST be last
app.use(errorMiddleware)

export default app
