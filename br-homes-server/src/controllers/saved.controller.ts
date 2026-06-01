import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import SavedProperty from '../models/SavedProperty.model'

/**
 * GET /api/saved
 * Get all saved properties for the current buyer
 */
export const getSavedProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const saved = await SavedProperty.find({ userId: req.sessionUser!.id })
      .populate({
        path: 'propertyId',
        match: { status: { $in: ['approved', 'sold', 'rented'] } },
      })
      .sort({ savedAt: -1 })
      .lean()

    // Filter out nulls (deleted or non-approved properties)
    const properties = saved
      .filter((s) => s.propertyId != null)
      .map((s) => ({
        _id: s._id,
        savedAt: s.savedAt,
        property: s.propertyId,
      }))

    sendSuccess(res, 'Saved properties retrieved', properties)
  }
)

/**
 * POST /api/saved/:propertyId
 * Save a property to favorites
 */
export const saveProperty = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId } = req.params
  const userId = req.sessionUser!.id

  try {
    const saved = await SavedProperty.create({
      userId,
      propertyId,
      savedAt: new Date(),
    })
    sendSuccess(res, 'Property saved', saved, 201)
  } catch (error: any) {
    if (error.code === 11000) {
      throw new AppError('Property is already saved', 409, 'ALREADY_EXISTS')
    }
    throw error
  }
})

/**
 * DELETE /api/saved/:propertyId
 * Remove a property from saved list
 */
export const unsaveProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const { propertyId } = req.params
    const userId = req.sessionUser!.id

    const result = await SavedProperty.findOneAndDelete({
      userId,
      propertyId,
    })

    if (!result) {
      throw new AppError('Saved property not found', 404, 'NOT_FOUND')
    }

    sendSuccess(res, 'Property removed from saved', null)
  }
)
