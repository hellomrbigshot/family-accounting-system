import { parseExpenseText } from './parseExpense'
import { stepfunChat } from './client'

jest.mock('./client', () => ({ stepfunChat: jest.fn() }))

describe('parseExpenseText', () => {
  beforeEach(() => jest.resetAllMocks())

  it('preserves inferred multiple tag names for the resolver and normalizes duplicates', async () => {
    jest.mocked(stepfunChat).mockResolvedValue({ choices: [{
      finish_reason: 'stop',
      message: { content: JSON.stringify({
        amount: 18, categoryName: '餐饮', description: '旅游时买拿铁', date: '2026-05-02',
        tagNames: [' 咖啡奶茶 ', '五一旅游', '咖啡奶茶', null, ''],
      }) },
    }] })

    const result = await parseExpenseText('五月二号旅游时买拿铁十八元', {
      today: '2026-11-09', availableTagNames: ['咖啡奶茶', '五一旅游'],
    })

    expect(result).toEqual({
      amount: 18, categoryName: '餐饮', description: '旅游时买拿铁', date: '2026-05-02',
      isExtra: false, tagNames: ['咖啡奶茶', '五一旅游'],
    })
  })

  it('rejects truncated output even when a partial result happens to be valid JSON', async () => {
    jest.mocked(stepfunChat).mockResolvedValue({ choices: [{
      finish_reason: 'length', message: { content: '{"amount":18}' },
    }] })

    await expect(parseExpenseText('拿铁十八元')).rejects.toThrow('AI 解析结果不完整')
  })

  it('keeps an empty tag selection when AI finds no related tags', async () => {
    jest.mocked(stepfunChat).mockResolvedValue({ choices: [{
      finish_reason: 'stop', message: { content: '{"amount":18,"tagNames":[]}' },
    }] })

    expect((await parseExpenseText('十八元')).tagNames).toEqual([])
  })
})
