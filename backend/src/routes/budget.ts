import { Router } from 'express';
import { getCurrentBudget, updateBudget } from '../controllers/budget';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/current', getCurrentBudget);
router.put('/current', updateBudget);

export default router; 