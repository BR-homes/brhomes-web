import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { uploadImage, deleteImages } from '../utils/cloudinaryUtils'
import Property from '../models/Property.model'
import SavedProperty from '../models/SavedProperty.model'
import User from '../models/User.model'
import { Types } from 'mongoose'
import {
  createPropertySchema,
  updatePropertySchema,
  markPropertySchema,
} from '../validations/property.validation'

/**
 * GET /api/properties
 * Browse approved listings with filtering, pagination, and sorting
 */
export const getProperties = asyncHandler(async (req: Request, res: Response) => {
  const {
    city,
    propertyType,
    listingType,
    bhk,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = '1',
    limit = '12',
    search,
  } = req.query

  // Build filter query - only show approved properties to public
  const filter: Record<string, any> = { status: 'approved' }

  if (city && typeof city === 'string') filter.city = new RegExp(city, 'i')
  if (propertyType) filter.propertyType = propertyType
  if (listingType) filter.listingType = listingType
  if (bhk) filter.bhk = Number(bhk)
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (search && typeof search === 'string') {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { areaLocality: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
    ]
  }

  // Sorting
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
  if (sort === 'price_asc') sortOption = { price: 1 }
  if (sort === 'price_desc') sortOption = { price: -1 }

  // Pagination
  const pageNum = Math.max(1, Number.parseInt(page as string, 10) || 1)
  const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit as string, 10) || 12))
  const skip = (pageNum - 1) * limitNum

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .sort(sortOption)
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
})

/**
 * GET /api/properties/:id
 * Property detail with owner info (name + phone)
 */
export const getPropertyById = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
      .populate('ownerId', 'name phone image')
      .lean()

    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    // Public users can only see approved (or sold/rented) properties
    if (!['approved', 'sold', 'rented'].includes(property.status)) {
      // Allow owner and admin to see any status
      const userId = req.sessionUser?.id
      const isOwner = property.ownerId?._id?.toString() === userId
      const isAdmin = req.sessionUser?.role === 'admin'
      if (!isOwner && !isAdmin) {
        throw new AppError('Property not found', 404, 'NOT_FOUND')
      }
    }

    sendSuccess(res, 'Property retrieved', property)
  }
)

/**
 * POST /api/properties
 * Create a new property listing (owner only, approved owner)
 */
export const createProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createPropertySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
    }

    const files = req.files as Express.Multer.File[] | undefined
    const effectiveImageLimit = (req as any).effectiveImageLimit || 7

    if (files && files.length > effectiveImageLimit) {
      throw new AppError(
        `You can upload a maximum of ${effectiveImageLimit} images`,
        400,
        'IMAGE_LIMIT_EXCEEDED'
      )
    }

    // Upload images to Cloudinary
    const images = []
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const result = await uploadImage(files[i].buffer)
        images.push({
          imageUrl: result.imageUrl,
          cloudinaryPublicId: result.cloudinaryPublicId,
          isPrimary: i === 0,
        })
      }
    }

    const { customOwnerName, ...propertyData } = parsed.data
    const bhk = propertyData.bhk

    const isAdmin = req.sessionUser!.role === 'admin'

    const property = await Property.create({
      ...propertyData,
      bhk,
      ownerId: new Types.ObjectId(req.sessionUser!.id),
      customOwnerName: isAdmin && customOwnerName ? customOwnerName : null,
      status: isAdmin ? 'approved' : 'pending',
      approvedAt: isAdmin ? new Date() : null,
      approvedBy: isAdmin ? new Types.ObjectId(req.sessionUser!.id) : null,
      approvalRequestedAt: isAdmin ? null : new Date(),
      images,
    })

    sendSuccess(
      res,
      isAdmin ? 'Property created successfully' : 'Property created and submitted for review',
      property,
      201
    )
  }
)

/**
 * PUT /api/properties/:id
 * Update own property
 */
export const updateProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    const isAdmin = req.sessionUser!.role === 'admin'

    // Only the owner or admin can edit
    if (property.ownerId.toString() !== req.sessionUser!.id && !isAdmin) {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED')
    }

    const parsed = updatePropertySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
    }

    const { removeImages, customOwnerName, ...updateData } = parsed.data
    const effectiveImageLimit = (req as any).effectiveImageLimit || 7

    // Update custom owner name if admin
    if (isAdmin && customOwnerName !== undefined) {
      property.customOwnerName = customOwnerName || null
    }

    // Remove specified images from Cloudinary
    if (removeImages && removeImages.length > 0) {
      await deleteImages(removeImages)
      property.images = property.images.filter(
        (img) => !removeImages.includes(img.cloudinaryPublicId)
      )
    }

    // Upload new images
    const files = req.files as Express.Multer.File[] | undefined
    const currentImageCount = property.images.length
    const newFileCount = files?.length || 0

    if (currentImageCount + newFileCount > effectiveImageLimit) {
      throw new AppError(
        `Total images cannot exceed ${effectiveImageLimit}`,
        400,
        'IMAGE_LIMIT_EXCEEDED'
      )
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const result = await uploadImage(file.buffer)
        property.images.push({
          imageUrl: result.imageUrl,
          cloudinaryPublicId: result.cloudinaryPublicId,
          isPrimary: property.images.length === 0,
        })
      }
    }

    // Ensure at least one primary image
    if (property.images.length > 0 && !property.images.some((img) => img.isPrimary)) {
      property.images[0].isPrimary = true
    }

    // Apply text updates
    Object.assign(property, updateData)

    // Re-set status to pending on edit (needs re-approval) - bypass for admin
    if (!isAdmin && ['approved', 'rejected'].includes(property.status)) {
      property.status = 'pending'
      property.approvalRequestedAt = new Date()
      property.approvedAt = null
      property.approvedBy = null
      property.rejectedAt = null
      property.rejectedBy = null
      property.rejectionNote = null
    }

    await property.save()

    sendSuccess(res, 'Property updated successfully', property)
  }
)

/**
 * PATCH /api/properties/:id/hide
 * Toggle property between approved and hidden
 */
export const toggleHideProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    if (property.ownerId.toString() !== req.sessionUser!.id && req.sessionUser!.role !== 'admin') {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED')
    }

    if (!['approved', 'hidden'].includes(property.status)) {
      throw new AppError(
        'Only approved or hidden properties can be toggled',
        400,
        'VALIDATION_ERROR'
      )
    }

    property.status = property.status === 'approved' ? 'hidden' : 'approved'
    await property.save()

    sendSuccess(
      res,
      `Property ${property.status === 'hidden' ? 'hidden' : 'visible'} successfully`,
      property
    )
  }
)

/**
 * PATCH /api/properties/:id/mark
 * Mark property as sold or rented
 */
export const markProperty = asyncHandler(async (req: Request, res: Response) => {
  const property = await Property.findById(req.params.id)
  if (!property) {
    throw new AppError('Property not found', 404, 'NOT_FOUND')
  }

  if (property.ownerId.toString() !== req.sessionUser!.id && req.sessionUser!.role !== 'admin') {
    throw new AppError('Access denied', 403, 'ACCESS_DENIED')
  }

  const parsed = markPropertySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new AppError('Validation failed', 422, 'VALIDATION_ERROR')
  }

  property.status = parsed.data.status
  await property.save()

  sendSuccess(res, `Property marked as ${parsed.data.status}`, property)
})

/**
 * DELETE /api/properties/:id
 * Delete property and all its Cloudinary images
 */
export const deleteProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const property = await Property.findById(req.params.id)
    if (!property) {
      throw new AppError('Property not found', 404, 'NOT_FOUND')
    }

    if (property.ownerId.toString() !== req.sessionUser!.id && req.sessionUser!.role !== 'admin') {
      throw new AppError('Access denied', 403, 'ACCESS_DENIED')
    }

    // Delete all images from Cloudinary
    const publicIds = property.images.map((img) => img.cloudinaryPublicId)
    await deleteImages(publicIds)

    // Remove from saved properties
    await SavedProperty.deleteMany({ propertyId: property._id })

    // Delete property
    await Property.findByIdAndDelete(property._id)

    sendSuccess(res, 'Property deleted successfully', null)
  }
)
