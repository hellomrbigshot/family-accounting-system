import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Filter } from '../models/filter'

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string
    roomNumber: string
  }
}

// 创建筛选器
export const createFilter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, conditions } = req.body

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: '筛选器名称不能为空' })
    }

    // 检查名称是否已存在
    const existingFilter = await Filter.findOne({
      userId: new Types.ObjectId(req.user._id),
      name: name.trim()
    })

    if (existingFilter) {
      return res.status(400).json({ message: '筛选器名称已存在' })
    }

    const filter = new Filter({
      userId: new Types.ObjectId(req.user._id),
      name: name.trim(),
      conditions
    })

    await filter.save()

    res.status(201).json({
      message: '筛选器创建成功',
      filter: {
        id: filter._id,
        name: filter.name,
        conditions: filter.conditions,
        createdAt: filter.createdAt
      }
    })
  } catch (error) {
    console.error('创建筛选器失败:', error)
    if (error instanceof Error) {
      res.status(500).json({
        message: '创建筛选器失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '创建筛选器失败' })
    }
  }
}

// 获取用户筛选器列表
export const getFilters = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    const filters = await Filter.find({ userId: new Types.ObjectId(req.user._id) })
      .sort({ createdAt: -1 })
      .exec()

    const formattedFilters = filters.map(filter => ({
      id: filter._id,
      name: filter.name,
      conditions: filter.conditions,
      createdAt: filter.createdAt
    }))

    res.json(formattedFilters)
  } catch (error) {
    console.error('获取筛选器列表失败:', error)
    if (error instanceof Error) {
      res.status(500).json({
        message: '获取筛选器列表失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '获取筛选器列表失败' })
    }
  }
}

// 更新筛选器
export const updateFilter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, conditions } = req.body

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: '筛选器名称不能为空' })
    }

    // 检查名称是否已被其他筛选器使用
    const existingFilter = await Filter.findOne({
      userId: new Types.ObjectId(req.user._id),
      name: name.trim(),
      _id: { $ne: id }
    })

    if (existingFilter) {
      return res.status(400).json({ message: '筛选器名称已存在' })
    }

    const filter = await Filter.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(req.user._id)
      },
      {
        name: name.trim(),
        conditions
      },
      { new: true }
    )

    if (!filter) {
      return res.status(404).json({ message: '筛选器不存在' })
    }

    res.json({
      message: '筛选器更新成功',
      filter: {
        id: filter._id,
        name: filter.name,
        conditions: filter.conditions,
        createdAt: filter.createdAt
      }
    })
  } catch (error) {
    console.error('更新筛选器失败:', error)
    if (error instanceof Error) {
      res.status(500).json({
        message: '更新筛选器失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '更新筛选器失败' })
    }
  }
}

// 删除筛选器
export const deleteFilter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    const filter = await Filter.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(req.user._id)
    })

    if (!filter) {
      return res.status(404).json({ message: '筛选器不存在' })
    }

    res.json({ message: '筛选器删除成功' })
  } catch (error) {
    console.error('删除筛选器失败:', error)
    if (error instanceof Error) {
      res.status(500).json({
        message: '删除筛选器失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '删除筛选器失败' })
    }
  }
}

// 获取单个筛选器
export const getFilter = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    const filter = await Filter.findOne({
      _id: id,
      userId: new Types.ObjectId(req.user._id)
    })

    if (!filter) {
      return res.status(404).json({ message: '筛选器不存在' })
    }

    res.json({
      id: filter._id,
      name: filter.name,
      conditions: filter.conditions,
      createdAt: filter.createdAt
    })
  } catch (error) {
    console.error('获取筛选器失败:', error)
    if (error instanceof Error) {
      res.status(500).json({
        message: '获取筛选器失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '获取筛选器失败' })
    }
  }
} 