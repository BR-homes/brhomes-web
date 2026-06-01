import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'
import User from '../models/User.model'
import { verifyToken } from '../utils/jwt'

const sessionGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
    }

    if (!decoded || !decoded.id) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
    }

    const dbUser = await User.findById(decoded.id).lean()

    if (!dbUser) {
      return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
    }

    if (!dbUser.isActive) {
      return next(
        new AppError('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED')
      )
    }

    if (!dbUser.isProfileComplete) {
      if (
        !req.originalUrl.includes('/complete-profile') &&
        !req.originalUrl.includes('/me')
      ) {
        return next(
          new AppError('Please complete your profile first', 403, 'PROFILE_INCOMPLETE')
        )
      }
    }

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

    next()
  } catch (error) {
    return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
  }
}

export default sessionGuard
