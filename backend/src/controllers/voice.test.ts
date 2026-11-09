import { Types } from 'mongoose'
import { Response } from 'express'
import { expenseFromVoice } from './voice'
import { AuthenticatedRequest } from '../middlewares/auth'
import { Tag } from '../models/tag'
import { transcribeAudio } from '../services/stepfun/asr'
import { parseExpenseText } from '../services/stepfun/parseExpense'
import { resolveExpenseCategoryId } from '../services/voice/resolveCategory'

jest.mock('../models/tag', () => ({ Tag: { find: jest.fn() } }))
jest.mock('../services/stepfun/asr')
jest.mock('../services/stepfun/parseExpense')
jest.mock('../services/voice/resolveCategory')

const mockedFind = Tag.find as jest.Mock
const legacyTag = { _id: new Types.ObjectId(), roomNumber: '1001', name: '咖啡' }
const historicalTag = {
  _id: new Types.ObjectId(), roomNumber: '1001', name: '五一旅游',
  type: 'temporary', archived: false,
  startDate: new Date('2026-05-01'), endDate: new Date('2026-05-03'),
}
const archivedTag = { ...legacyTag, _id: new Types.ObjectId(), name: '旧活动', archived: true }
const otherRoomTag = { ...legacyTag, _id: new Types.ObjectId(), roomNumber: '2002', name: '其他房间标签' }
const rows = [legacyTag, historicalTag, archivedTag, otherRoomTag]

describe('voice expense tags', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    // 模拟 MongoDB：archived:false 不匹配缺少字段的旧文档。
    mockedFind.mockImplementation((query) => {
      const found = rows.filter(tag => {
        if (tag.roomNumber !== query.roomNumber) return false
        if (query.archived === false && (!('archived' in tag) || tag.archived !== false)) return false
        if (query.archived?.$ne === true && 'archived' in tag && tag.archived === true) return false
        return !query._id || query._id.$in.some((id: Types.ObjectId) => id.equals(tag._id))
      })
      return Object.assign(Promise.resolve(found), { sort: () => Promise.resolve(found) })
    })
    jest.mocked(transcribeAudio).mockResolvedValue('五月二号买了一杯拿铁十八元')
    jest.mocked(resolveExpenseCategoryId).mockResolvedValue(new Types.ObjectId().toString())
  })

  const recognize = async (tagNames: string[], date = '2026-05-02') => {
    jest.mocked(parseExpenseText).mockResolvedValue({
      amount: 18, categoryName: '餐饮', description: '拿铁', date, isExtra: false, tagNames,
    })
    const req = {
      user: { _id: new Types.ObjectId().toString(), roomNumber: '1001' },
      file: { buffer: Buffer.from('audio fixture'), mimetype: 'audio/wav' },
    } as AuthenticatedRequest
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    await expenseFromVoice(req, res as unknown as Response)
    return res
  }

  it('passes legacy and historical tags to AI and returns their IDs for form selection', async () => {
    const res = await recognize(['咖啡', '五一旅游', '旧活动'])

    expect(parseExpenseText).toHaveBeenCalledWith(expect.any(String), {
      today: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      availableTagNames: ['咖啡', '五一旅游'],
    })
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      tags: [legacyTag._id.toString(), historicalTag._id.toString()],
      tagNames: ['咖啡', '五一旅游'],
    }))
  })

  it('rejects unrelated, foreign-room, archived and out-of-period tags without creating any', async () => {
    const res = await recognize(['五一旅游', '旧活动', '其他房间标签', '不存在的标签'], '2026-05-04')
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ tags: [], tagNames: [] }))
  })
})
