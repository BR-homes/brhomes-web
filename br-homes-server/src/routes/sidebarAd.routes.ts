import { Router } from 'express'
import { getSidebarAds } from '../controllers/sidebarAd.controller'

const router = Router()

// Public: get sidebar ads
router.get('/', getSidebarAds)

export default router
