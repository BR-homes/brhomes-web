import { Router } from 'express'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import {
  getOwnerProperties,
  getOwnerStats,
  getOwnerPropertyQueueStatus,
} from '../controllers/owner.controller'

const router = Router()

router.use(sessionGuard, roleGuard('owner'))

router.get('/properties', getOwnerProperties)
router.get('/properties/:id/approval-queue', getOwnerPropertyQueueStatus)
router.get('/stats', getOwnerStats)

export default router
