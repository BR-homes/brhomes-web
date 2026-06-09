import { Router } from 'express'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import {
  getStats,
  getPendingOwners,
  approveOwner,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getAllProperties,
  adminDeleteProperty,
  getAllUsers,
  toggleUserActive,
  getSettings,
  updateGlobalImageLimit,
  updateUserImageLimit,
} from '../controllers/admin.controller'
import multer from 'multer'
import { uploadSliderImages, deleteSliderImage } from '../controllers/slider.controller'
import { uploadSidebarAds, deleteSidebarAd } from '../controllers/sidebarAd.controller'

const router = Router()

// All admin routes require session + admin role
router.use(sessionGuard, roleGuard('admin'))

// Dashboard
router.get('/stats', getStats)

// Owner management
router.get('/owners/pending', getPendingOwners)
router.put('/owners/:id/approve', approveOwner)

// Property management
router.get('/properties/pending', getPendingProperties)
router.put('/properties/:id/approve', approveProperty)
router.put('/properties/:id/reject', rejectProperty)
router.get('/properties', getAllProperties)
router.delete('/properties/:id', adminDeleteProperty)

// User management
router.get('/users', getAllUsers)
router.patch('/users/:id/deactivate', toggleUserActive)

// Settings
router.get('/settings', getSettings)
router.put('/settings/image-limit', updateGlobalImageLimit)
router.put('/users/:id/image-limit', updateUserImageLimit)

// Slider images (admin)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })
router.post('/sliders', upload.array('images', 10), uploadSliderImages)
router.delete('/sliders/:id', deleteSliderImage)

// Sidebar ads (admin) — videos up to 50MB each
const videoUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })
router.post('/sidebar-ads', videoUpload.array('videos', 10), uploadSidebarAds)
router.delete('/sidebar-ads/:id', deleteSidebarAd)

export default router
