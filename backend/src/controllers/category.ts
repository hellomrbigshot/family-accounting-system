import { Request, Response } from 'express';
import { Category } from '../models/category';

export const categoryController = {
  // 获取所有分类
  async getCategories(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: '未授权' });
      }

      const categories = await Category.find({ userId });
      // 将 _id 映射为 id
      const formattedCategories = categories.map(category => ({
        ...category.toObject(),
        id: category._id.toString()
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

      // 验证类型
      if (!['expense', 'income'].includes(type)) {
        return res.status(400).json({ message: '无效的类型' });
      }

      // 检查是否已存在同名分类
      const existingCategory = await Category.findOne({ userId, name });
      if (existingCategory) {
        return res.status(400).json({ message: '已存在同名分类' });
      }

      const category = new Category({
        userId,
        name,
        type,
        icon,
        color
      });

      await category.save();
      // 将 _id 映射为 id
      const formattedCategory = {
        ...category.toObject(),
        id: category._id.toString()
      };
      res.status(201).json(formattedCategory);
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

      // 验证类型
      if (!['expense', 'income'].includes(type)) {
        return res.status(400).json({ message: '无效的类型' });
      }

      // 检查分类是否存在
      const category = await Category.findOne({ _id: id, userId });
      if (!category) {
        return res.status(404).json({ message: '分类不存在' });
      }

      // 检查是否与其他分类重名
      const existingCategory = await Category.findOne({
        userId,
        name,
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: '已存在同名分类' });
      }

      // 更新分类
      category.name = name;
      category.type = type;
      category.icon = icon;
      category.color = color;

      await category.save();
      // 将 _id 映射为 id
      const formattedCategory = {
        ...category.toObject(),
        id: category._id.toString()
      };
      res.json(formattedCategory);
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

      await category.deleteOne();
      res.json({ message: '分类已删除' });
    } catch (error) {
      console.error('删除分类失败:', error);
      res.status(500).json({ message: '删除分类失败' });
    }
  }
}; 