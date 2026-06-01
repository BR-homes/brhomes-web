import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'
import Setting from '../models/Setting.model'

/**
 * Resolves the effective image limit for the current user.
 * Priority: user.imageLimit > globalImageLimit setting > fallback (7)
 * Attaches to req as effectiveImageLimit.
 */
const imageLimitGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.sessionUser?.id
    if (!userId) return next()

    const user = await User.findById(userId).select('imageLimit').lean()

    if (user?.imageLimit != null) {
      ;(req as any).effectiveImageLimit = user.imageLimit
      return next()
    }

    const setting = await Setting.findOne({ key: 'globalImageLimit' }).lean()
    ;(req as any).effectiveImageLimit = (setting?.value as number) ?? 7

    next()
  } catch {
    ;(req as any).effectiveImageLimit = 7
    next()
  }
}

export default imageLimitGuard
