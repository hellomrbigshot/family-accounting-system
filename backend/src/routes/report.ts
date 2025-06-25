import { Router } from 'express'
import { getReport, exportReport } from '../controllers/report'
import { authMiddleware } from '../middleware/auth'

const router: Router = Router()

router.use(authMiddleware)

router.get('/', getReport)
router.get('/export', exportReport)

export default router 