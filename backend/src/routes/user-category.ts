import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getUserCategoryPermissions,
  updateUserCategoryPermission,
  batchUpdateUserCategoryPermissions
} from '../controllers/user-category';

const router: Router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取用户分类权限列表
router.get('/permissions', getUserCategoryPermissions);

// 更新单个用户分类权限
router.put('/permissions/:categoryId', updateUserCategoryPermission);

// 批量更新用户分类权限
router.put('/permissions', batchUpdateUserCategoryPermissions);

export default router; 