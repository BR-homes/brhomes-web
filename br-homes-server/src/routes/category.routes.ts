import { Router } from 'express'
import multer from 'multer'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import {
  getCategories,
  adminGetCategories,
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
} from '../controllers/category.controller'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'))
  },
})

// Public: get active categories
router.get('/', getCategories)

// Protected: Admin-only routes
router.use(sessionGuard, roleGuard('admin'))

router.get('/admin', adminGetCategories)
router.post('/', upload.single('image'), createCategory)
router.put('/:id', upload.single('image'), updateCategory)
router.patch('/:id/toggle', toggleCategoryActive)
router.delete('/:id', deleteCategory)

export default router
