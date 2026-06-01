import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'
import { verifyToken } from '../utils/jwt'

const optionalSessionGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      return next()
    }

    if (!decoded || !decoded.id) {
      return next()
    }

    const dbUser = await User.findById(decoded.id).lean()

    if (dbUser && dbUser.isActive) {
      req.sessionUser = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        image: dbUser.image ?? null,
        phone: dbUser.phone ?? null,
        isActive: dbUser.isActive,
        isProfileComplete: dbUser.isProfileComplete,
        ownerApproved: dbUser.ownerApproved,
      }
    }

    next()
  } catch (error) {
    return next()
  }
}

export default optionalSessionGuard
