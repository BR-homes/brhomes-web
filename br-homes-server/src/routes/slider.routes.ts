import { Router } from 'express'
import multer from 'multer'
import { getSliderImages } from '../controllers/slider.controller'

const router = Router()

// Public: get slider images
router.get('/', getSliderImages)

export default router
