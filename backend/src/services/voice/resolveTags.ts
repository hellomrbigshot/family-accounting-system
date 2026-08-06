import { Types } from 'mongoose';
import { Tag } from '../../models/tag';
import { isTagActiveOnDate, normalizeTagDate } from '../../utils/tag';

export interface ResolvedTag {
  id: string;
  name: string;
}

export async function getAvailableTagsForPrompt(roomNumber: string): Promise<Array<{ id: string; name: string }>> {
  const tags = await Tag.find({ roomNumber, archived: false }).sort({ name: 1 });
  return tags.map((tag) => ({
    id: tag._id.toString(),
    name: tag.name,
  }));
}

export async function resolveExpenseTagIds(
  roomNumber: string,
  tagNames: string[],
  expenseDate: string
): Promise<ResolvedTag[]> {
  if (tagNames.length === 0) {
    return [];
  }

  const tags = await Tag.find({ roomNumber, archived: false });
  const expenseDateValue = normalizeTagDate(expenseDate);
  const normalizedNames = new Set(tagNames.map((name) => name.trim()).filter(Boolean));
  const resolved: ResolvedTag[] = [];

  for (const name of normalizedNames) {
    const matched = tags.find((tag) => tag.name === name);
    if (!matched) {
      continue;
    }
    if (!isTagActiveOnDate(matched, expenseDateValue)) {
      continue;
    }
    resolved.push({
      id: matched._id.toString(),
      name: matched.name,
    });
  }

  return resolved;
}

export const toObjectIds = (tags: ResolvedTag[]): Types.ObjectId[] => {
  return tags.map((tag) => new Types.ObjectId(tag.id));
};
