import { Request, Response } from 'express';
import { Tag, defaultTags } from '../models/tag';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    roomNumber: string;
  };
}

// 获取标签列表
export const getTags = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const tags = await Tag.find({ userId: req.user._id });
    res.json(tags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    res.status(500).json({ message: '获取标签列表失败' });
  }
};

// 创建标签
export const createTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { name, color } = req.body;

    const tag = new Tag({
      userId: new Types.ObjectId(req.user._id),
      name,
      color
    });

    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    console.error('创建标签失败:', error);
    res.status(500).json({ message: '创建标签失败' });
  }
};

// 更新标签
export const updateTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { id } = req.params;
    const { name, color } = req.body;

    const tag = await Tag.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { name, color },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    res.json(tag);
  } catch (error) {
    console.error('更新标签失败:', error);
    res.status(500).json({ message: '更新标签失败' });
  }
};

// 删除标签
export const deleteTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { id } = req.params;

    const tag = await Tag.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    res.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('删除标签失败:', error);
    res.status(500).json({ message: '删除标签失败' });
  }
};

// 初始化默认标签
export const initDefaultTags = async (userId: string) => {
  try {
    const existingTags = await Tag.find({ userId });
    if (existingTags.length === 0) {
      const tags = defaultTags.map(tag => ({
        ...tag,
        userId: new Types.ObjectId(userId)
      }));
      await Tag.insertMany(tags);
    }
  } catch (error) {
    console.error('初始化默认标签失败:', error);
  }
}; 