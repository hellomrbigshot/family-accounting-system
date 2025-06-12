import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  transfer,
  adjustBalance
} from '../controllers/account';

const router: Router = Router();

router.use(authMiddleware);

// 账户管理路由
router.get('/', getAllAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

// 转账和余额调整路由
router.post('/transfer', transfer);
router.post('/:id/adjust', adjustBalance);

export default router; 