import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { uploadImage, deleteImage } from '../utils/cloudinaryUtils'
import Category from '../models/Category.model'
import Service from '../models/Service.model'

// GET /api/categories (Public)
export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find({ isActive: true }).sort({ title: 1 }).lean()
  sendSuccess(res, 'Categories retrieved successfully', categories)
})

// GET /api/categories/admin (Admin)
export const adminGetCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ title: 1 }).lean()
  sendSuccess(res, 'Admin categories retrieved successfully', categories)
})

// POST /api/categories (Admin)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { title } = req.body
  const file = req.file

  if (!title) {
    throw new AppError('Title is required', 400, 'VALIDATION_ERROR')
  }
  if (!file) {
    throw new AppError('Category image is required', 400, 'VALIDATION_ERROR')
  }

  // Check if category title already exists
  const existing = await Category.findOne({ title: title.trim() })
  if (existing) {
    throw new AppError('Category with this title already exists', 409, 'ALREADY_EXISTS')
  }

  // Upload to Cloudinary
  const uploadResult = await uploadImage(file.buffer, 'br-homes/categories')

  const category = await Category.create({
    title: title.trim(),
    imageUrl: uploadResult.imageUrl,
    cloudinaryPublicId: uploadResult.cloudinaryPublicId,
    isActive: true,
  })

  sendSuccess(res, 'Category created successfully', category, 201)
})

// PUT /api/categories/:id (Admin)
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { title } = req.body
  const file = req.file

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError('Category not found', 404, 'NOT_FOUND')
  }

  if (title) {
    const trimmedTitle = title.trim()
    // Verify title is unique if it's changing
    if (trimmedTitle !== category.title) {
      const existing = await Category.findOne({ title: trimmedTitle })
      if (existing) {
        throw new AppError('Category with this title already exists', 409, 'ALREADY_EXISTS')
      }
      category.title = trimmedTitle
    }
  }

  if (file) {
    // Upload new image
    const uploadResult = await uploadImage(file.buffer, 'br-homes/categories')
    // Store old public ID to delete after successful upload
    const oldPublicId = category.cloudinaryPublicId

    category.imageUrl = uploadResult.imageUrl
    category.cloudinaryPublicId = uploadResult.cloudinaryPublicId

    // Try deleting old image from Cloudinary
    try {
      await deleteImage(oldPublicId)
    } catch (err) {
      console.warn('Failed to delete old category image from Cloudinary:', err)
    }
  }

  await category.save()
  sendSuccess(res, 'Category updated successfully', category)
})

// PATCH /api/categories/:id/toggle (Admin)
export const toggleCategoryActive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError('Category not found', 404, 'NOT_FOUND')
  }

  category.isActive = !category.isActive
  await category.save()

  sendSuccess(res, `Category ${category.isActive ? 'activated' : 'hidden'} successfully`, category)
})

// DELETE /api/categories/:id (Admin)
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const category = await Category.findById(id)
  if (!category) {
    throw new AppError('Category not found', 404, 'NOT_FOUND')
  }

  // Delete category image from Cloudinary
  try {
    await deleteImage(category.cloudinaryPublicId)
  } catch (err) {
    console.warn('Failed to delete category image from Cloudinary during delete:', err)
  }

  // Delete all associated services
  await Service.deleteMany({ categoryId: category._id })

  // Delete category from DB
  await Category.findByIdAndDelete(id)

  sendSuccess(res, 'Category and all associated services deleted successfully', null)
})
