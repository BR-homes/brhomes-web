import app from '../br-homes-server/src/app'
import { connectDB } from '../br-homes-server/src/config/db'

export default async (req: any, res: any) => {
  try {
    await connectDB()
  } catch (error) {
    console.error('Failed to connect to database in serverless handler:', error)
    res.status(500).json({
      success: false,
      error: 'DATABASE_CONNECTION_FAILURE',
      message: 'Unable to connect to the database. Please try again later.'
    })
    return
  }
  return app(req, res)
}
