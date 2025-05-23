import { Router } from 'express';
import authRoutes from './auth';
import expenseRoutes from './expense';
import categoryRoutes from './category';
import budgetRoutes from './budget';

const router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);

export default router; 