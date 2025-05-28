import { Request, Response } from 'express';
import { Category, defaultCategories, IDefaultCategory } from '../models/category';
import Room from '../models/room';
import { Types } from 'mongoose';

export const categoryController = {
  // 获取所有分类
  async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      // 检查房间是否存在
      const room = await Room.findById(userId);
      if (!room) {
        return res.status(404).json({ message: '房间不存在' });
      }

      // 获取房间的所有分类
      let categories = await Category.find({ userId });

      // 如果没有分类，创建默认分类
      if (categories.length === 0) {
        const defaultCategoryDocs = defaultCategories.map((cat: IDefaultCategory) => ({
          ...cat,
          userId: new Types.ObjectId(userId)
        }));
        const insertedCategories = await Category.insertMany(defaultCategoryDocs);
        categories = insertedCategories;
      }

      // 格式化响应数据
      const formattedCategories = categories.map(cat => ({
        id: cat._id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        color: cat.color
      }));

      res.json(formattedCategories);
    } catch (error) {
      console.error('获取分类失败:', error);
      res.status(500).json({ message: '获取分类失败' });
    }
  },

  // 创建分类
  async createCategory(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      const { name, type, icon, color } = req.body;

      // 验证必填字段
      if (!name || !type) {
        return res.status(400).json({ message: '名称和类型为必填项' });
      }

      // 检查分类是否已存在
      const existingCategory = await Category.findOne({ userId, name });
      if (existingCategory) {
        return res.status(400).json({ message: '分类已存在' });
      }

      // 创建新分类
      const category = await Category.create({
        userId: new Types.ObjectId(userId),
        name,
        type,
        icon: icon || '📦',
        color: color || '#6366F1'
      });

      res.status(201).json({
        id: category._id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        color: category.color
      });
    } catch (error) {
      console.error('创建分类失败:', error);
      res.status(500).json({ message: '创建分类失败' });
    }
  },

  // 更新分类
  async updateCategory(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      const { id } = req.params;
      const { name, type, icon, color } = req.body;

      // 验证必填字段
      if (!name || !type) {
        return res.status(400).json({ message: '名称和类型为必填项' });
      }

      // 检查分类是否存在
      const category = await Category.findOne({ _id: id, userId });
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      // 检查新名称是否与其他分类重复
      if (name !== category.name) {
        const existingCategory = await Category.findOne({ userId, name });
        if (existingCategory) {
          return res.status(400).json({ message: '分类名称已存在' });
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
        color: category.color
      });
    } catch (error) {
      console.error('更新分类失败:', error);
      res.status(500).json({ message: '更新分类失败' });
    }
  },

  // 删除分类
  async deleteCategory(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      const { id } = req.params;

      // 检查分类是否存在
      const category = await Category.findOne({ _id: id, userId });
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      // 删除分类
      await category.deleteOne();

      res.json({ message: '分类已删除' });
    } catch (error) {
      console.error('删除分类失败:', error);
      res.status(500).json({ message: '删除分类失败' });
    }
  }
}; 