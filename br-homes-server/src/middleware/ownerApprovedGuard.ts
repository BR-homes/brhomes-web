import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const ownerApprovedGuard = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.sessionUser?.ownerApproved) {
    return next(
      new AppError(
        'Your owner account is pending admin approval',
        403,
        'OWNER_NOT_APPROVED'
      )
    )
  }
  next()
}

export default ownerApprovedGuard
