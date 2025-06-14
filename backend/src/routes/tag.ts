import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getTags,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tag';

const router: Router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取标签列表
router.get('/', getTags);

// 创建标签
router.post('/', createTag);

// 更新标签
router.put('/:id', updateTag);

// 删除标签
router.delete('/:id', deleteTag);

export default router; 