import { Router } from 'express'
import sessionGuard from '../middleware/sessionGuard'
import roleGuard from '../middleware/roleGuard'
import {
  getSavedProperties,
  saveProperty,
  unsaveProperty,
} from '../controllers/saved.controller'

const router = Router()

router.use(sessionGuard, roleGuard('buyer'))

router.get('/', getSavedProperties)
router.post('/:propertyId', saveProperty)
router.delete('/:propertyId', unsaveProperty)

export default router
