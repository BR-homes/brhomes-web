import { Router } from 'express'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import {
  getServices,
  adminGetServices,
  createService,
  updateService,
  toggleServiceActive,
  deleteService,
} from '../controllers/service.controller'

const router = Router()

// Public: get active services
router.get('/', getServices)

// Protected: Admin-only routes
router.use(sessionGuard, roleGuard('admin'))

router.get('/admin', adminGetServices)
router.post('/', createService)
router.put('/:id', updateService)
router.patch('/:id/toggle', toggleServiceActive)
router.delete('/:id', deleteService)

export default router
