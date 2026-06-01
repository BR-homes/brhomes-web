import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { deleteImages } from '../utils/cloudinaryUtils'
import User from '../models/User.model'
import Property from '../models/Property.model'
import SavedProperty from '../models/SavedProperty.model'
import AdminAction from '../models/AdminAction.model'
import Setting from '../models/Setting.model'
import {
  rejectPropertySchema,
  updateImageLimitSchema,
  updateGlobalImageLimitSchema,
} from '../validations/admin.validation'

/**
 * GET /api/admin/stats
 * Platform overview statistics
 */
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalBuyers,
    totalOwners,
    totalProperties,
    pendingProperties,
    approvedProperties,
    pendingOwners,
    totalSaved,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ role: 'owner' }),
    Property.countDocuments(),
    Property.countDocuments({ status: 'pending' }),
    Property.countDocuments({ status: 'approved' }),
    User.countDocuments({ role: 'owner', ownerApproved: false, isProfileComplete: true }),
    SavedProperty.countDocuments(),
  ])

  sendSuccess(res, 'Admin stats retrieved', {
    users: { total: totalUsers, buyers: totalBuyers, owners: totalOwners },
    properties: {
      total: totalProperties,
      pending: pendingProperties,
      approved: approvedProperties,
    },
    pendingOwners,
    totalSaved,
  })
})

/**
 * GET /api/admin/owners/pending
 * List owners awaiting admin approval
 */
export const getPendingOwners = asyncHandler(
  async (_req: Request, res: Response) => {
    const owners = await User.find({
      role: 'owner',
      ownerApproved: false,
      isProfileComplete: true,
    })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean()

    sendSuccess(res, 'Pending owners retrieved', owners)
  }
)

/**
 * PUT /api/admin/owners/:id/approve
 * Approve an owner account
 */
export const approveOwner = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role !== 'owner') {
    throw new AppError('Owner not found', 404, 'NOT_FOUND')
  }

  user.ownerApproved = true
  await user.save()

  await AdminAction.create({
    adminId: req.sessionUser!.id,
    targetId: user._id,
    targetType: 'user',
    action: 'owner_approved',
    actedAt: new Date(),
  })

  sendSuccess(res, 'Owner approved successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    ownerApproved: true,
  })
})

/**
 * GET /api/admin/properties/pending
 * List properties awaiting approval
 */
export const getPendingProperties = asyncHandler(
  async (_req: Request, res: Response) => {
    const properties = await Property.find({ status: 'pending' })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean()

    sendSuccess(res, 'Pending properties retrieved', properties)
  }
)

/**
 * PUT /api/admin/properties/:id/approve
 * Approve a property listing
 */
export const approveProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    property.status = 'approved'
    property.rejectionNote = null
    await property.save()

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: property._id,
      targetType: 'property',
      action: 'property_approved',
      actedAt: new Date(),
    })

    sendSuccess(res, 'Property approved', property)
  }
)

/**
 * PUT /api/admin/properties/:id/reject
 * Reject a property with a required note
 */
export const rejectProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = rejectPropertySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Rejection note is required (min 10 chars)', 422, 'VALIDATION_ERROR')
    }

    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    property.status = 'rejected'
    property.rejectionNote = parsed.data.rejectionNote
    await property.save()

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: property._id,
      targetType: 'property',
      action: 'property_rejected',
      note: parsed.data.rejectionNote,
      actedAt: new Date(),
    })

    sendSuccess(res, 'Property rejected', property)
  }
)

/**
 * GET /api/admin/properties
 * All properties with filtering and pagination
 */
export const getAllProperties = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      status,
      propertyType,
      city,
      page = '1',
      limit = '12',
    } = req.query

    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (propertyType) filter.propertyType = propertyType
    if (city && typeof city === 'string') filter.city = new RegExp(city, 'i')

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
    const limitNum = Math.min(50, parseInt(limit as string, 10) || 12)
    const skip = (pageNum - 1) * limitNum

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate('ownerId', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Property.countDocuments(filter),
    ])

    sendSuccess(res, 'Properties retrieved', properties, 200, {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    })
  }
)

/**
 * DELETE /api/admin/properties/:id
 * Admin force-delete a property
 */
export const adminDeleteProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    // Delete Cloudinary images
    const publicIds = property.images.map((img) => img.cloudinaryPublicId)
    await deleteImages(publicIds)

    // Remove from saved
    await SavedProperty.deleteMany({ propertyId: property._id })

    // Delete property
    await Property.findByIdAndDelete(property._id)

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: property._id,
      targetType: 'property',
      action: 'property_hidden',
      note: 'Deleted by admin',
      actedAt: new Date(),
    })

    sendSuccess(res, 'Property deleted by admin', null)
  }
)

/**
 * GET /api/admin/users
 * All users with filtering
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { role, page = '1', limit = '20', search } = req.query

  const filter: Record<string, any> = {}
  if (role) filter.role = role
  if (search && typeof search === 'string') {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ]
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
  const limitNum = Math.min(50, parseInt(limit as string, 10) || 20)
  const skip = (pageNum - 1) * limitNum

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    User.countDocuments(filter),
  ])

  sendSuccess(res, 'Users retrieved', users, 200, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  })
})

/**
 * PATCH /api/admin/users/:id/deactivate
 * Toggle user active status
 */
export const toggleUserActive = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND')
    }

    // Prevent deactivating yourself
    if (user._id.toString() === req.sessionUser!.id) {
      throw new AppError('Cannot deactivate your own account', 400, 'VALIDATION_ERROR')
    }

    user.isActive = !user.isActive
    await user.save()

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: user._id,
      targetType: 'user',
      action: user.isActive ? 'user_activated' : 'user_deactivated',
      actedAt: new Date(),
    })

    sendSuccess(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, {
      _id: user._id,
      isActive: user.isActive,
    })
  }
)

/**
 * GET /api/admin/settings
 * Get all platform settings
 */
export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await Setting.find().lean()
  sendSuccess(res, 'Settings retrieved', settings)
})

/**
 * PUT /api/admin/settings/image-limit
 * Update global image limit
 */
export const updateGlobalImageLimit = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateGlobalImageLimitSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
    }

    const setting = await Setting.findOneAndUpdate(
      { key: 'globalImageLimit' },
      {
        value: parsed.data.globalImageLimit,
        updatedBy: req.sessionUser!.id,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    )

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: setting._id,
      targetType: 'user',
      action: 'image_limit_changed',
      note: `Global image limit set to ${parsed.data.globalImageLimit}`,
      actedAt: new Date(),
    })

    sendSuccess(res, 'Global image limit updated', setting)
  }
)

/**
 * PUT /api/admin/users/:id/image-limit
 * Override image limit for a specific owner
 */
export const updateUserImageLimit = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateImageLimitSchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { imageLimit: parsed.data.imageLimit },
      { new: true }
    ).select('-passwordHash')

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND')
    }

    await AdminAction.create({
      adminId: req.sessionUser!.id,
      targetId: user._id,
      targetType: 'user',
      action: 'image_limit_changed',
      note: `Image limit for ${user.name} set to ${parsed.data.imageLimit}`,
      actedAt: new Date(),
    })

    sendSuccess(res, 'User image limit updated', user)
  }
)
