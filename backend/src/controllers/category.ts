import { Request, Response } from 'express';
import { Category } from '../models/category';
import Room from '../models/room';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    roomNumber: string;
  };
}

export const getCategories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const roomNumber = req.user?.roomNumber;
    
    if (!userId || !roomNumber) {
      return res.status(401).json({ message: '未授权' });
    }

    // 检查房间是否存在
    const room = await Room.findById(userId);
    if (!room) {
      return res.status(404).json({ message: '房间不存在' });
    }

    // 获取系统固定分类
    const systemCategories = await Category.find({ isSystem: true });

    // 获取当前家庭的自定义分类
    const customCategories = await Category.find({ 
      roomNumber, 
      isSystem: false 
    });

    // 合并系统分类和家庭分类，系统分类在前
    const allCategories = [
      ...systemCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        isSystem: true,
        createdAt: cat.createdAt
      })),
      ...customCategories.map(cat => ({
        id: cat._id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color,
        isSystem: false,
        createdAt: cat.createdAt
      }))
    ];

    res.json(allCategories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ message: '获取分类失败' });
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const roomNumber = req.user?.roomNumber;
    
    if (!userId || !roomNumber) {
      return res.status(401).json({ message: '未授权' });
    }

    const { name, type, icon, color } = req.body;

    // 验证必填字段
    if (!name || !type) {
      return res.status(400).json({ message: '名称和类型为必填项' });
    }

    // 检查家庭自定义分类是否已存在
    const existingCategory = await Category.findOne({ 
      roomNumber, 
      name, 
      isSystem: false 
    });
    if (existingCategory) {
      return res.status(400).json({ message: '分类已存在' });
    }

    // 检查是否与系统分类重名
    const existingSystemCategory = await Category.findOne({ 
      name, 
      isSystem: true 
    });
    if (existingSystemCategory) {
      return res.status(400).json({ message: '分类名称与系统分类重复' });
    }

    // 创建新的家庭自定义分类
    const category = await Category.create({
      roomNumber,
      name,
      type,
      icon: icon || '📦',
      color: color || '#6366F1',
      isSystem: false
    });

    res.status(201).json({
      id: category._id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      isSystem: false
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ message: '创建分类失败' });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const roomNumber = req.user?.roomNumber;
    
    if (!userId || !roomNumber) {
      return res.status(401).json({ message: '未授权' });
    }

    const { id } = req.params;
    const { name, type, icon, color } = req.body;

    // 验证必填字段
    if (!name || !type) {
      return res.status(400).json({ message: '名称和类型为必填项' });
    }

    // 检查分类是否存在
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 系统固定分类不允许编辑
    if (category.isSystem) {
      return res.status(403).json({ message: '系统固定分类不允许编辑' });
    }

    // 只能编辑当前家庭的自定义分类
    if (category.roomNumber !== roomNumber) {
      return res.status(403).json({ message: '只能编辑当前家庭的分类' });
    }

    // 检查新名称是否与其他分类重复
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ 
        roomNumber, 
        name, 
        isSystem: false 
      });
      if (existingCategory) {
        return res.status(400).json({ message: '分类名称已存在' });
      }

      // 检查是否与系统分类重名
      const existingSystemCategory = await Category.findOne({ 
        name, 
        isSystem: true 
      });
      if (existingSystemCategory) {
        return res.status(400).json({ message: '分类名称与系统分类重复' });
      }
    }

    // 更新分类
    category.name = name;
    category.type = type;
    if (icon) category.icon = icon;
    if (color) category.color = color;

    await category.save();

    res.json({
      id: category._id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      isSystem: false
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ message: '更新分类失败' });
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const roomNumber = req.user?.roomNumber;
    
    if (!userId || !roomNumber) {
      return res.status(401).json({ message: '未授权' });
    }

    const { id } = req.params;

    // 检查分类是否存在
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    // 系统固定分类不允许删除
    if (category.isSystem) {
      return res.status(403).json({ message: '系统固定分类不允许删除' });
    }

    // 只能删除当前家庭的自定义分类
    if (category.roomNumber !== roomNumber) {
      return res.status(403).json({ message: '只能删除当前家庭的分类' });
    }

    // 删除分类
    await category.deleteOne();

    res.json({ message: '分类已删除' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ message: '删除分类失败' });
  }
}; 