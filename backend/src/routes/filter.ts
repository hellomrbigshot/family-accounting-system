import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import {
  createFilter,
  getFilters,
  updateFilter,
  deleteFilter,
  getFilter
} from '../controllers/filter'

const router: Router = Router()

// 所有路由都需要认证
router.use(authMiddleware)

// 获取筛选器列表
router.get('/', getFilters)

// 创建筛选器
router.post('/', createFilter)

// 获取单个筛选器
router.get('/:id', getFilter)

// 更新筛选器
router.put('/:id', updateFilter)

// 删除筛选器
router.delete('/:id', deleteFilter)

export default router 