import { Request, Response } from 'express'
import asyncHandler from '../utils/asyncHandler'
import AppError from '../utils/AppError'
import { sendSuccess } from '../utils/responseHandler'
import { uploadVideo, deleteVideo } from '../utils/cloudinaryUtils'
import SidebarAd from '../models/SidebarAd.model'

export const getSidebarAds = asyncHandler(async (_req: Request, res: Response) => {
  const ads = await SidebarAd.find().sort({ createdAt: -1 }).lean()
  sendSuccess(res, 'Sidebar ads retrieved', ads)
})

export const uploadSidebarAds = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined
  if (!files || files.length === 0) throw new AppError('No videos provided', 400, 'VALIDATION_ERROR')

  const created: any[] = []
  for (let i = 0; i < files.length; i++) {
    const result = await uploadVideo(files[i].buffer, 'br-homes/sidebar-ads')
    const doc = await SidebarAd.create({ videoUrl: result.videoUrl, cloudinaryPublicId: result.cloudinaryPublicId })
    created.push(doc)
  }

  sendSuccess(res, 'Sidebar ads uploaded', created, 201)
})

export const deleteSidebarAd = asyncHandler(async (req: Request, res: Response) => {
  const ad = await SidebarAd.findById(req.params.id)
  if (!ad) throw new AppError('Video not found', 404, 'NOT_FOUND')

  // Try to delete from Cloudinary, but don't block DB cleanup if it fails
  try {
    await deleteVideo(ad.cloudinaryPublicId)
  } catch (err) {
    console.warn('Cloudinary video delete failed (continuing with DB cleanup):', err)
  }

  await SidebarAd.findByIdAndDelete(ad._id)
  sendSuccess(res, 'Sidebar ad deleted', null)
})
