import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import Service from '../models/Service.model'
import Category from '../models/Category.model'

// GET /api/services (Public)
// Optional query parameter: ?categoryId=...
export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.query

  const query: any = { isActive: true }
  if (categoryId) {
    query.categoryId = categoryId
  }

  const services = await Service.find(query).sort({ title: 1 }).lean()
  sendSuccess(res, 'Services retrieved successfully', services)
})

// GET /api/services/admin (Admin)
// Optional query parameter: ?categoryId=...
export const adminGetServices = asyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.query

  const query: any = {}
  if (categoryId) {
    query.categoryId = categoryId
  }

  const services = await Service.find(query)
    .populate('categoryId', 'title')
    .sort({ title: 1 })
    .lean()

  sendSuccess(res, 'Admin services retrieved successfully', services)
})

// POST /api/services (Admin)
export const createService = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, contactPhone, categoryId } = req.body

  if (!title || !description || !contactPhone || !categoryId) {
    throw new AppError('Title, description, contact phone, and category ID are required', 400, 'VALIDATION_ERROR')
  }

  // Verify category exists
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new AppError('Category not found', 404, 'NOT_FOUND')
  }

  const service = await Service.create({
    title: title.trim(),
    description: description.trim(),
    contactPhone: contactPhone.trim(),
    categoryId,
    isActive: true,
  })

  // Return populated service
  const populated = await Service.findById(service._id).populate('categoryId', 'title').lean()

  sendSuccess(res, 'Service created successfully', populated, 201)
})

// PUT /api/services/:id (Admin)
export const updateService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, description, contactPhone, categoryId } = req.body

  const service = await Service.findById(id)
  if (!service) {
    throw new AppError('Service not found', 404, 'NOT_FOUND')
  }

  if (title) service.title = title.trim()
  if (description) service.description = description.trim()
  if (contactPhone) service.contactPhone = contactPhone.trim()

  if (categoryId) {
    const category = await Category.findById(categoryId)
    if (!category) {
      throw new AppError('Category not found', 404, 'NOT_FOUND')
    }
    service.categoryId = categoryId
  }

  await service.save()

  // Return populated
  const populated = await Service.findById(service._id).populate('categoryId', 'title').lean()

  sendSuccess(res, 'Service updated successfully', populated)
})

// PATCH /api/services/:id/toggle (Admin)
export const toggleServiceActive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const service = await Service.findById(id)
  if (!service) {
    throw new AppError('Service not found', 404, 'NOT_FOUND')
  }

  service.isActive = !service.isActive
  await service.save()

  const populated = await Service.findById(service._id).populate('categoryId', 'title').lean()

  sendSuccess(res, `Service ${service.isActive ? 'activated' : 'hidden'} successfully`, populated)
})

// DELETE /api/services/:id (Admin)
export const deleteService = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params

  const service = await Service.findByIdAndDelete(id)
  if (!service) {
    throw new AppError('Service not found', 404, 'NOT_FOUND')
  }

  sendSuccess(res, 'Service deleted successfully', null)
})
