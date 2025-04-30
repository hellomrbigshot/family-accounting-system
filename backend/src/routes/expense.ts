import { Router } from 'express';
import { createExpense, getExpenses, getExpenseStats } from '../controllers/expense';
import { auth } from '../middlewares/auth';

const router = Router();

router.use(auth);
router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);

export default router; 