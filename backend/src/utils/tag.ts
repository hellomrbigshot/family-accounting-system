import { Types } from 'mongoose';
import { Tag } from '../models/tag';

export const normalizeTagDate = (value: string | Date) => {
  const dateText = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  return new Date(`${dateText}T00:00:00.000Z`);
};

export const isTagActiveOnDate = (tag: any, expenseDate: Date) => {
  if ((tag.type || 'normal') !== 'temporary') return true;
  if (!tag.startDate || !tag.endDate) return false;
  const startDate = normalizeTagDate(tag.startDate);
  const endDate = normalizeTagDate(tag.endDate);
  return expenseDate >= startDate && expenseDate <= endDate;
};

export const validateExpenseTags = async ({
  tagIds,
  date,
  roomNumber,
  existingTagIds = []
}: {
  tagIds: string[];
  date: string | Date;
  roomNumber?: string;
  existingTagIds?: string[];
}) => {
  if (!roomNumber || tagIds.length === 0) {
    return { tags: [] as Types.ObjectId[] };
  }

  const uniqueIds = Array.from(new Set(tagIds.filter(Boolean)));
  if (uniqueIds.some(id => !Types.ObjectId.isValid(id))) {
    return { error: '标签无效' };
  }

  const tags = await Tag.find({
    _id: { $in: uniqueIds.map(id => new Types.ObjectId(id)) },
    roomNumber
  });

  if (tags.length !== uniqueIds.length) {
    return { error: '标签不存在或不可用' };
  }

  const expenseDate = normalizeTagDate(date);
  const existingSet = new Set(existingTagIds.map(id => id.toString()));
  const invalidTag = tags.find(tag => {
    const isExisting = existingSet.has(tag._id.toString());
    return (tag.archived || !isTagActiveOnDate(tag, expenseDate)) && !isExisting;
  });

  if (invalidTag) {
    return { error: `标签「${invalidTag.name}」不在当前支出日期生效` };
  }

  return { tags: uniqueIds.map(id => new Types.ObjectId(id)) };
};
