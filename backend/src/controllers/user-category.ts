import { Request, Response } from 'express';
import { UserCategory } from '../models/user-category';
import { Category } from '../models/category';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    roomNumber: string;
  };
}

// 获取用户分类权限列表
export const getUserCategoryPermissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    // 获取所有系统分类
    const systemCategories = await Category.find({ isSystem: true });

    // 获取用户对系统分类的权限设置
    const userPermissions = await UserCategory.find({ 
      userId: new Types.ObjectId(userId),
      categoryId: { $in: systemCategories.map(cat => cat._id) }
    });

    // 创建权限映射
    const permissionMap = new Map();
    userPermissions.forEach(up => {
      permissionMap.set(up.categoryId.toString(), up.isDisabled);
    });

    // 构建响应数据
    const permissions = systemCategories.map(cat => ({
      categoryId: cat._id,
      categoryName: cat.name,
      categoryIcon: cat.icon,
      categoryType: cat.type,
      isDisabled: permissionMap.get(cat._id.toString()) || false
    }));

    res.json(permissions);
  } catch (error) {
    console.error('获取用户分类权限失败:', error);
    res.status(500).json({ message: '获取用户分类权限失败' });
  }
};

// 更新用户分类权限
export const updateUserCategoryPermission = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { categoryId } = req.params;
    const { isDisabled } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    // 验证分类是否存在且为系统分类
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: '分类不存在' });
    }

    if (!category.isSystem) {
      return res.status(400).json({ message: '只能管理系统分类的权限' });
    }

    // 更新或创建用户分类权限记录
    const userCategory = await UserCategory.findOneAndUpdate(
      { 
        userId: new Types.ObjectId(userId),
        categoryId: new Types.ObjectId(categoryId)
      },
      { 
        isDisabled: Boolean(isDisabled)
      },
      { 
        upsert: true,
        new: true
      }
    );

    res.json({
      categoryId: userCategory.categoryId,
      isDisabled: userCategory.isDisabled,
      message: isDisabled ? '分类已禁用' : '分类已启用'
    });
  } catch (error) {
    console.error('更新用户分类权限失败:', error);
    res.status(500).json({ message: '更新用户分类权限失败' });
  }
};

// 批量更新用户分类权限
export const batchUpdateUserCategoryPermissions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { permissions } = req.body; // [{ categoryId: string, isDisabled: boolean }]
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: '权限数据格式错误' });
    }

    // 验证所有分类都是系统分类
    const categoryIds = permissions.map(p => p.categoryId);
    const categories = await Category.find({ 
      _id: { $in: categoryIds },
      isSystem: true 
    });

    if (categories.length !== categoryIds.length) {
      return res.status(400).json({ message: '存在非系统分类或分类不存在' });
    }

    // 批量更新权限
    const updateOperations = permissions.map(permission => ({
      updateOne: {
        filter: {
          userId: new Types.ObjectId(userId),
          categoryId: new Types.ObjectId(permission.categoryId)
        },
        update: {
          $set: { isDisabled: Boolean(permission.isDisabled) }
        },
        upsert: true
      }
    }));

    await UserCategory.bulkWrite(updateOperations);

    res.json({ 
      message: '批量更新权限成功',
      updatedCount: permissions.length
    });
  } catch (error) {
    console.error('批量更新用户分类权限失败:', error);
    res.status(500).json({ message: '批量更新用户分类权限失败' });
  }
}; 