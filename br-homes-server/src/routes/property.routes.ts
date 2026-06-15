import { Router } from 'express'
import multer from 'multer'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import ownerApprovedGuard from '../middleware/ownerApprovedGuard'
import imageLimitGuard from '../middleware/imageLimitGuard'
import optionalSessionGuard from '../middleware/optionalSessionGuard'
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  toggleHideProperty,
  markProperty,
  deleteProperty,
} from '../controllers/property.controller'

const router = Router()

// Multer config - memory storage, 5MB limit, max 10 files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Public routes
router.get('/', optionalSessionGuard, getProperties)
router.get('/:id', optionalSessionGuard, getPropertyById)

// Owner/Admin routes
router.post(
  '/',
  sessionGuard,
  roleGuard('owner', 'admin'),
  ownerApprovedGuard,
  imageLimitGuard,
  upload.array('images', 10),
  createProperty
)

router.put(
  '/:id',
  sessionGuard,
  roleGuard('owner', 'admin'),
  imageLimitGuard,
  upload.array('images', 10),
  updateProperty
)

router.patch(
  '/:id/hide',
  sessionGuard,
  roleGuard('owner', 'admin'),
  toggleHideProperty
)

router.patch(
  '/:id/mark',
  sessionGuard,
  roleGuard('owner', 'admin'),
  markProperty
)

router.delete(
  '/:id',
  sessionGuard,
  roleGuard('owner', 'admin'),
  deleteProperty
)

export default router
