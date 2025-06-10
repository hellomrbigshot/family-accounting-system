import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import categoryRoutes from './category';
import tagRoutes from './tag';
import expenseRoutes from './expense';
import accountRoutes from './account';
import healthRoutes from './health';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/expenses', expenseRoutes);
router.use('/accounts', accountRoutes);
router.use('/health', healthRoutes);

export default router; 