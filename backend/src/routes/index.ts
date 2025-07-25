import { Router, Request, Response } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import categoryRoutes from './category';
import userCategoryRoutes from './user-category';
import tagRoutes from './tag';
import expenseRoutes from './expense';
import accountRoutes from './account';
import healthRoutes from './health';
import budgetRoutes from './budget';
import reportRoutes from './report';
import filterRoutes from './filter';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/user-categories', userCategoryRoutes);
router.use('/tags', tagRoutes);
router.use('/expenses', expenseRoutes);
router.use('/accounts', accountRoutes);
router.use('/health', healthRoutes);
router.use('/budgets', budgetRoutes);
router.use('/reports', reportRoutes);
router.use('/filters', filterRoutes);

export default router; 