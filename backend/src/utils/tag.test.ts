import { Types } from 'mongoose';
import { Tag } from '../models/tag';
import { isTagActiveOnDate, validateExpenseTags } from './tag';

jest.mock('../models/tag', () => ({
  Tag: {
    find: jest.fn()
  }
}));

const mockedFind = Tag.find as jest.Mock;

const makeTag = (overrides: Record<string, any> = {}) => ({
  _id: new Types.ObjectId(),
  roomNumber: '1001',
  name: '测试标签',
  type: 'temporary',
  startDate: new Date('2026-05-01T00:00:00.000Z'),
  endDate: new Date('2026-05-03T00:00:00.000Z'),
  archived: false,
  ...overrides
});

describe('tag utilities', () => {
  beforeEach(() => {
    mockedFind.mockReset();
  });

  it('checks temporary tag date boundaries inclusively', () => {
    const tag = makeTag();

    expect(isTagActiveOnDate(tag, new Date('2026-05-01T00:00:00.000Z'))).toBe(true);
    expect(isTagActiveOnDate(tag, new Date('2026-05-03T00:00:00.000Z'))).toBe(true);
    expect(isTagActiveOnDate(tag, new Date('2026-05-04T00:00:00.000Z'))).toBe(false);
  });

  it('allows tags that are active on the expense date', async () => {
    const tag = makeTag();
    mockedFind.mockResolvedValue([tag]);

    const result = await validateExpenseTags({
      tagIds: [tag._id.toString()],
      date: '2026-05-02',
      roomNumber: '1001'
    });

    expect(result.error).toBeUndefined();
    expect(result.tags).toHaveLength(1);
  });

  it('rejects temporary tags outside their active window', async () => {
    const tag = makeTag({ name: '过期标签' });
    mockedFind.mockResolvedValue([tag]);

    const result = await validateExpenseTags({
      tagIds: [tag._id.toString()],
      date: '2026-05-04',
      roomNumber: '1001'
    });

    expect(result.error).toBe('标签「过期标签」不在当前支出日期生效');
  });

  it('allows keeping an existing expired tag while editing historical expenses', async () => {
    const tag = makeTag({ name: '历史标签' });
    mockedFind.mockResolvedValue([tag]);

    const result = await validateExpenseTags({
      tagIds: [tag._id.toString()],
      date: '2026-05-04',
      roomNumber: '1001',
      existingTagIds: [tag._id.toString()]
    });

    expect(result.error).toBeUndefined();
    expect(result.tags).toHaveLength(1);
  });

  it('rejects archived tags unless they already exist on the expense', async () => {
    const tag = makeTag({ archived: true, name: '已归档标签' });
    mockedFind.mockResolvedValue([tag]);

    const result = await validateExpenseTags({
      tagIds: [tag._id.toString()],
      date: '2026-05-02',
      roomNumber: '1001'
    });

    expect(result.error).toBe('标签「已归档标签」不在当前支出日期生效');

    const existingResult = await validateExpenseTags({
      tagIds: [tag._id.toString()],
      date: '2026-05-02',
      roomNumber: '1001',
      existingTagIds: [tag._id.toString()]
    });

    expect(existingResult.error).toBeUndefined();
  });
});
