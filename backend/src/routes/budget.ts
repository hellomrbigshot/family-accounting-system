import { Router } from 'express';
import { getCurrentBudget, updateBudget } from '../controllers/budget';
import { auth } from '../middlewares/auth';

const router: Router = Router();

router.use(auth);

router.get('/current', getCurrentBudget);
router.put('/current', updateBudget);

export default router;
