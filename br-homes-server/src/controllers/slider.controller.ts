import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { uploadImage, deleteImage } from '../utils/cloudinaryUtils'
import SliderImage from '../models/SliderImage.model'

export const getSliderImages = asyncHandler(async (_req: Request, res: Response) => {
  const images = await SliderImage.find().sort({ createdAt: -1 }).lean()
  sendSuccess(res, 'Slider images retrieved', images)
})

export const uploadSliderImages = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined
  if (!files || files.length === 0) throw new AppError('No images provided', 400, 'VALIDATION_ERROR')

  const created: any[] = []
  for (let i = 0; i < files.length; i++) {
    const result = await uploadImage(files[i].buffer, 'br-homes/slider')
    const doc = await SliderImage.create({ imageUrl: result.imageUrl, cloudinaryPublicId: result.cloudinaryPublicId })
    created.push(doc)
  }

  sendSuccess(res, 'Slider images uploaded', created, 201)
})

export const deleteSliderImage = asyncHandler(async (req: Request, res: Response) => {
  const img = await SliderImage.findById(req.params.id)
  if (!img) throw new AppError('Image not found', 404, 'NOT_FOUND')

  await deleteImage(img.cloudinaryPublicId)
  await SliderImage.findByIdAndDelete(img._id)

  sendSuccess(res, 'Slider image deleted', null)
})
