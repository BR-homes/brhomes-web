import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
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

    const pendingQueue = await Property.find({ status: 'pending' })
      .select('_id')
      .sort({ approvalRequestedAt: 1, createdAt: 1 })
      .lean()

    const queueMap = new Map<string, number>()
    pendingQueue.forEach((item, index) => {
      queueMap.set(item._id.toString(), index + 1)
    })

    const enriched = properties.map((property) => ({
      ...property,
      queuePosition:
        property.status === 'pending'
          ? queueMap.get(property._id.toString()) || null
          : null,
    }))

    sendSuccess(res, 'Owner properties retrieved', enriched)
  }
)

/**
 * GET /api/owner/properties/:id/approval-queue
 * Queue position for one owner property
 */
export const getOwnerPropertyQueueStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const ownerId = req.sessionUser!.id
    const property = await Property.findById(req.params.id)
      .select('ownerId status approvalRequestedAt createdAt')
      .lean()

    if (property?.ownerId?.toString() !== ownerId) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    if (property.status !== 'pending') {
      sendSuccess(res, 'Property is not in approval queue', {
        status: property.status,
        approvalRequestedAt: property.approvalRequestedAt,
        queuePosition: null,
        totalPendingAhead: null,
      })
      return
    }

    const pendingAhead = await Property.countDocuments({
      status: 'pending',
      $or: [
        {
          approvalRequestedAt: {
            $lt: property.approvalRequestedAt || property.createdAt,
          },
        },
        {
          approvalRequestedAt: property.approvalRequestedAt || property.createdAt,
          createdAt: { $lt: property.createdAt },
        },
      ],
    })

    sendSuccess(res, 'Property queue status retrieved', {
      status: property.status,
      approvalRequestedAt: property.approvalRequestedAt || property.createdAt,
      queuePosition: pendingAhead + 1,
      totalPendingAhead: pendingAhead,
    })
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
