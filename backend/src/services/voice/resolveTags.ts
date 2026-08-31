import { Types } from 'mongoose';
import { Tag } from '../../models/tag';
import { isTagActiveOnDate, normalizeTagDate } from '../../utils/tag';

export interface ResolvedTag {
  id: string;
  name: string;
}

export interface TagCandidate {
  _id: Types.ObjectId;
  name: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  archived?: boolean;
}

const normalizeForMatch = (name: string) => name.trim().toLowerCase();

export function findMatchingTag(
  candidateName: string,
  tags: TagCandidate[],
  expenseDate: Date
): TagCandidate | null {
  const candidate = candidateName.trim();
  if (!candidate) {
    return null;
  }

  const activeTags = tags.filter((tag) => isTagActiveOnDate(tag, expenseDate));
  if (activeTags.length === 0) {
    return null;
  }

  const exactMatch = activeTags.find((tag) => tag.name === candidate);
  if (exactMatch) {
    return exactMatch;
  }

  const normalizedCandidate = normalizeForMatch(candidate);
  const caseInsensitiveMatch = activeTags.find(
    (tag) => normalizeForMatch(tag.name) === normalizedCandidate
  );
  if (caseInsensitiveMatch) {
    return caseInsensitiveMatch;
  }

  const substringMatches = activeTags.filter((tag) => {
    const normalizedTag = normalizeForMatch(tag.name);
    return (
      normalizedTag.includes(normalizedCandidate)
      || normalizedCandidate.includes(normalizedTag)
    );
  });

  if (substringMatches.length === 1) {
    return substringMatches[0];
  }

  if (substringMatches.length > 1) {
    return substringMatches.sort(
      (left, right) =>
        Math.abs(left.name.length - candidate.length)
        - Math.abs(right.name.length - candidate.length)
    )[0];
  }

  return null;
}

export async function getAvailableTagsForPrompt(
  roomNumber: string,
  asOfDate?: string
): Promise<Array<{ id: string; name: string }>> {
  const tags = await Tag.find({ roomNumber, archived: false }).sort({ name: 1 });
  const expenseDate = normalizeTagDate(asOfDate || new Date().toISOString().slice(0, 10));

  return tags
    .filter((tag) => isTagActiveOnDate(tag, expenseDate))
    .map((tag) => ({
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
  const normalizedNames = Array.from(
    new Set(tagNames.map((name) => name.trim()).filter(Boolean))
  );
  const resolved: ResolvedTag[] = [];
  const resolvedIds = new Set<string>();

  for (const name of normalizedNames) {
    const matched = findMatchingTag(name, tags, expenseDateValue);
    if (!matched) {
      continue;
    }

    const matchedId = matched._id.toString();
    if (resolvedIds.has(matchedId)) {
      continue;
    }

    resolvedIds.add(matchedId);
    resolved.push({
      id: matchedId,
      name: matched.name,
    });
  }

  return resolved;
}

export const toObjectIds = (tags: ResolvedTag[]): Types.ObjectId[] => {
  return tags.map((tag) => new Types.ObjectId(tag.id));
};
