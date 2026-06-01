import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const roleGuard = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.sessionUser || !roles.includes(req.sessionUser.role)) {
      return next(new AppError('Access denied', 403, 'ACCESS_DENIED'))
    }
    next()
  }
}

export default roleGuard
