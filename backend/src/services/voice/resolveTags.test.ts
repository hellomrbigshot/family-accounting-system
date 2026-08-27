import { Types } from 'mongoose';
import { Tag } from '../../models/tag';
import {
  findMatchingTag,
  getAvailableTagsForPrompt,
  resolveExpenseTagIds,
} from './resolveTags';

jest.mock('../../models/tag', () => ({
  Tag: {
    find: jest.fn(),
  },
}));

const mockedFind = Tag.find as jest.Mock;

const makeTag = (overrides: Record<string, unknown> = {}) => ({
  _id: new Types.ObjectId(),
  roomNumber: '1001',
  name: '测试标签',
  type: 'normal',
  archived: false,
  ...overrides,
});

describe('resolveTags', () => {
  beforeEach(() => {
    mockedFind.mockReset();
  });

  describe('findMatchingTag', () => {
    it('matches exact tag names', () => {
      const tag = makeTag({ name: '瑞幸咖啡' });

      const matched = findMatchingTag('瑞幸咖啡', [tag], new Date('2026-08-27T00:00:00.000Z'));

      expect(matched?._id).toEqual(tag._id);
    });

    it('matches tag names case-insensitively', () => {
      const tag = makeTag({ name: 'Starbucks' });

      const matched = findMatchingTag('starbucks', [tag], new Date('2026-08-27T00:00:00.000Z'));

      expect(matched?._id).toEqual(tag._id);
    });

    it('matches substring tag names when unique', () => {
      const tag = makeTag({ name: '星巴克咖啡' });

      const matched = findMatchingTag('星巴克', [tag], new Date('2026-08-27T00:00:00.000Z'));

      expect(matched?._id).toEqual(tag._id);
    });

    it('prefers the closest substring match when multiple tags match', () => {
      const starbucks = makeTag({ name: '星巴克咖啡' });
      const starbucksReserve = makeTag({ name: '星巴克臻选' });

      const matched = findMatchingTag('星巴克咖啡', [starbucksReserve, starbucks], new Date('2026-08-27T00:00:00.000Z'));

      expect(matched?._id).toEqual(starbucks._id);
    });

    it('ignores temporary tags outside the expense date', () => {
      const tag = makeTag({
        name: '五一旅游',
        type: 'temporary',
        startDate: new Date('2026-05-01T00:00:00.000Z'),
        endDate: new Date('2026-05-03T00:00:00.000Z'),
      });

      const matched = findMatchingTag('五一旅游', [tag], new Date('2026-08-27T00:00:00.000Z'));

      expect(matched).toBeNull();
    });
  });

  describe('getAvailableTagsForPrompt', () => {
    it('filters out inactive temporary tags for the given date', async () => {
      const activeTag = makeTag({ name: '日常' });
      const expiredTag = makeTag({
        name: '五一旅游',
        type: 'temporary',
        startDate: new Date('2026-05-01T00:00:00.000Z'),
        endDate: new Date('2026-05-03T00:00:00.000Z'),
      });
      mockedFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue([activeTag, expiredTag]),
      });

      const tags = await getAvailableTagsForPrompt('1001', '2026-08-27');

      expect(tags).toEqual([{ id: activeTag._id.toString(), name: '日常' }]);
    });
  });

  describe('resolveExpenseTagIds', () => {
    it('resolves fuzzy tag names and deduplicates matched ids', async () => {
      const tag = makeTag({ name: '星巴克咖啡' });
      mockedFind.mockResolvedValue([tag]);

      const resolved = await resolveExpenseTagIds('1001', ['星巴克', '星巴克咖啡'], '2026-08-27');

      expect(resolved).toEqual([{ id: tag._id.toString(), name: '星巴克咖啡' }]);
    });
  });
});
