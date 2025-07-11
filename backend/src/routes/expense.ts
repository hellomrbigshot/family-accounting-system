import { Router } from 'express';
import { createExpense, getExpenses, getExpenseStats, deleteExpense, updateExpense } from '../controllers/expense';
import { auth } from '../middlewares/auth';

const router: Router = Router();

// 所有路由都需要认证
router.use(auth);

router.post('/', createExpense);
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router; 