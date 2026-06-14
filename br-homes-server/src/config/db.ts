import mongoose from 'mongoose'
import dns from 'node:dns'
import { env } from './env'
import { seedSettings, seedAdmin } from './seed'

// Force Node.js to use Google DNS for SRV lookups (fixes issues with some ISPs/VPNs)
dns.setServers(['8.8.8.8', '8.8.4.4'])

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  let retries = 0

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URI, {
        dbName: 'br-homes',
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true,
        }
      })

      console.log(`MongoDB connected: ${mongoose.connection.host}`)

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB runtime error:', err.message)
      })

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected')
      })

      // Seed default configurations and admin user after connecting
      await seedSettings()
      await seedAdmin()

      return
    } catch (err) {
      retries++
      const message = err instanceof Error ? err.message : String(err)
      console.error(
        `MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${message}`
      )

      if (retries >= MAX_RETRIES) {
        console.error('All MongoDB connection attempts exhausted. Exiting.')
        process.exit(1)
      }

      console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }
}