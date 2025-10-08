import { Router } from 'express'
import { getReport, exportReport } from '../controllers/report'
import { auth } from '../middlewares/auth'

const router: Router = Router()

router.use(auth)

router.get('/', getReport)
router.get('/export', exportReport)

export default router
