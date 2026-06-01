import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import { sendSuccess } from '../utils/responseHandler'
import Property from '../models/Property.model'
import Setting from '../models/Setting.model'
import User from '../models/User.model'

/**
 * GET /api/owner/properties
 * Get all properties belonging to the current owner
 */
export const getOwnerProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.sessionUser!.id

    const properties = await Property.find({ ownerId })
      .sort({ createdAt: -1 })
      .lean()

    sendSuccess(res, 'Owner properties retrieved', properties)
  }
)

/**
 * GET /api/owner/stats
 * Get owner dashboard statistics + effective image limit
 */
export const getOwnerStats = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.sessionUser!.id

    const [total, pending, approved, rejected, hidden, sold, rented, user, globalSetting] =
      await Promise.all([
        Property.countDocuments({ ownerId }),
        Property.countDocuments({ ownerId, status: 'pending' }),
        Property.countDocuments({ ownerId, status: 'approved' }),
        Property.countDocuments({ ownerId, status: 'rejected' }),
        Property.countDocuments({ ownerId, status: 'hidden' }),
        Property.countDocuments({ ownerId, status: 'sold' }),
        Property.countDocuments({ ownerId, status: 'rented' }),
        User.findById(ownerId).select('imageLimit').lean(),
        Setting.findOne({ key: 'globalImageLimit' }).lean(),
      ])

    const effectiveImageLimit =
      user?.imageLimit ?? (globalSetting?.value as number) ?? 7

    sendSuccess(res, 'Owner stats retrieved', {
      total,
      pending,
      approved,
      rejected,
      hidden,
      sold,
      rented,
      effectiveImageLimit,
    })
  }
)
