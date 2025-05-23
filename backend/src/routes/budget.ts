import { Router } from 'express';
import { getCurrentBudget, updateBudget } from '../controllers/budget';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/current', authMiddleware, getCurrentBudget);
router.put('/current', authMiddleware, updateBudget);

export default router; 