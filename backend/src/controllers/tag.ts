import { Request, Response } from 'express';
import { Tag } from '../models/tag';
import { normalizeTagDate } from '../utils/tag';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    roomNumber: string;
  };
}

const formatTag = (tag: any) => ({
  id: tag._id,
  name: tag.name,
  color: tag.color,
  type: tag.type || 'normal',
  startDate: tag.startDate ? tag.startDate.toISOString().slice(0, 10) : undefined,
  endDate: tag.endDate ? tag.endDate.toISOString().slice(0, 10) : undefined,
  autoApply: tag.autoApply !== false,
  archived: tag.archived === true,
  createdAt: tag.createdAt
});

const validateTagPayload = (body: any) => {
  const type = body.type || 'normal';
  if (!['normal', 'temporary'].includes(type)) {
    return { error: '标签类型无效' };
  }

  if (type === 'temporary') {
    if (!body.startDate || !body.endDate) {
      return { error: '限时标签需要设置开始和结束日期' };
    }
    const startDate = normalizeTagDate(body.startDate);
    const endDate = normalizeTagDate(body.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return { error: '日期格式无效' };
    }
    if (startDate > endDate) {
      return { error: '开始日期不能晚于结束日期' };
    }
    return {
      value: {
        type,
        startDate,
        endDate,
        autoApply: body.autoApply !== false
      }
    };
  }

  return {
    value: {
      type,
      startDate: undefined,
      endDate: undefined,
      autoApply: false
    }
  };
};

// 获取标签列表
export const getTags = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id || !req.user?.roomNumber) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const tags = await Tag.find({ roomNumber: req.user.roomNumber })
      .sort({ archived: 1, type: 1, startDate: -1, createdAt: -1 });

    // 格式化响应数据
    const formattedTags = tags.map(formatTag);

    res.json(formattedTags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    res.status(500).json({ message: '获取标签列表失败' });
  }
};

// 创建标签
export const createTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id || !req.user?.roomNumber) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { name, color } = req.body;

    // 验证必填字段
    if (!name) {
      return res.status(400).json({ message: '标签名称为必填项' });
    }

    const parsedPayload = validateTagPayload(req.body);
    if (parsedPayload.error) {
      return res.status(400).json({ message: parsedPayload.error });
    }

    // 检查标签是否已存在
    const existingTag = await Tag.findOne({
      roomNumber: req.user.roomNumber,
      name
    });
    if (existingTag) {
      return res.status(400).json({
        message: existingTag.archived
          ? '标签名称曾被使用，请换一个名称'
          : '标签名称已存在'
      });
    }

    const tag = new Tag({
      roomNumber: req.user.roomNumber,
      name,
      color,
      ...parsedPayload.value
    });

    await tag.save();

    // 格式化响应数据
    res.status(201).json(formatTag(tag));
  } catch (error) {
    console.error('创建标签失败:', error);
    res.status(500).json({ message: '创建标签失败' });
  }
};

// 更新标签
export const updateTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id || !req.user?.roomNumber) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { id } = req.params;
    const { name, color } = req.body;

    // 验证必填字段
    if (!name) {
      return res.status(400).json({ message: '标签名称为必填项' });
    }

    const parsedPayload = validateTagPayload(req.body);
    if (parsedPayload.error) {
      return res.status(400).json({ message: parsedPayload.error });
    }

    // 检查标签是否存在
    const tag = await Tag.findOne({
      _id: id,
      roomNumber: req.user.roomNumber,
      archived: { $ne: true }
    });
    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    // 检查新名称是否与其他标签重复
    if (name !== tag.name) {
      const existingTag = await Tag.findOne({
        roomNumber: req.user.roomNumber,
        name
      });
      if (existingTag) {
        return res.status(400).json({
          message: existingTag.archived
            ? '标签名称曾被使用，请换一个名称'
            : '标签名称已存在'
        });
      }
    }

    // 更新标签
    tag.name = name;
    if (color) tag.color = color;
    tag.type = parsedPayload.value!.type;
    tag.startDate = parsedPayload.value!.startDate;
    tag.endDate = parsedPayload.value!.endDate;
    tag.autoApply = parsedPayload.value!.autoApply;

    await tag.save();

    // 格式化响应数据
    res.json(formatTag(tag));
  } catch (error) {
    console.error('更新标签失败:', error);
    res.status(500).json({ message: '更新标签失败' });
  }
};

// 删除标签
export const deleteTag = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id || !req.user?.roomNumber) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const { id } = req.params;

    const tag = await Tag.findOne({
      _id: id,
      roomNumber: req.user.roomNumber,
      archived: { $ne: true }
    });

    if (!tag) {
      return res.status(404).json({ message: '标签不存在' });
    }

    tag.archived = true;
    await tag.save();

    res.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('删除标签失败:', error);
    res.status(500).json({ message: '删除标签失败' });
  }
};
