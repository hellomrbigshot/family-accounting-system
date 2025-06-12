import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category';

const router: Router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取所有分类
router.get('/', getCategories);

// 创建分类
router.post('/', createCategory);

// 更新分类
router.put('/:id', updateCategory);

// 删除分类
router.delete('/:id', deleteCategory);

export default router; 