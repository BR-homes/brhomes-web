import 'dotenv/config'
import app from './app'
import { connectDB } from './config/db'
import { env } from './config/env'

const start = async () => {
  // Connect to MongoDB and run seeds if connection is newly established
  await connectDB()

  // Start local server listener
  app.listen(Number.parseInt(env.PORT, 10), () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
    console.log(`Environment: ${env.NODE_ENV}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
