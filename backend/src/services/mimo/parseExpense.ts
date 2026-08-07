import dayjs from 'dayjs';
import { mimoChat } from './client';
import { systemCategories } from '../../models/category';

export interface ParsedExpenseFields {
  amount: number;
  categoryName: string;
  description: string;
  date: string;
  isExtra: boolean;
  tagNames: string[];
}

export interface ParseExpenseContext {
  today?: string;
  availableTagNames?: string[];
}

const expenseCategoryNames = systemCategories
  .filter((category) => category.type === 'expense')
  .map((category) => category.name);

const normalizeTagNames = (
  tagNames: unknown,
  availableTagNames: string[]
): string[] => {
  if (!Array.isArray(tagNames)) {
    return [];
  }

  const availableSet = new Set(availableTagNames);
  return tagNames
    .filter((name): name is string => typeof name === 'string')
    .map((name) => name.trim())
    .filter((name) => availableSet.has(name));
};

const normalizeParsedExpense = (
  parsed: Partial<ParsedExpenseFields> & { tagNames?: unknown },
  today: string,
  availableTagNames: string[]
): ParsedExpenseFields => {
  const amount = Number(parsed.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('未能识别有效金额');
  }

  const categoryName = expenseCategoryNames.includes(parsed.categoryName || '')
    ? parsed.categoryName!
    : '其他';

  const date = parsed.date && dayjs(parsed.date, 'YYYY-MM-DD', true).isValid()
    ? parsed.date
    : today;

  return {
    amount: Math.round(amount * 100) / 100,
    categoryName,
    description: (parsed.description || '').trim().slice(0, 200),
    date,
    isExtra: parsed.isExtra === true,
    tagNames: normalizeTagNames(parsed.tagNames, availableTagNames),
  };
};

export async function parseExpenseText(
  text: string,
  context: ParseExpenseContext = {}
): Promise<ParsedExpenseFields> {
  const today = context.today || dayjs().format('YYYY-MM-DD');
  const availableTagNames = context.availableTagNames || [];
  const tagPrompt = availableTagNames.length > 0
    ? `可用标签（tagNames 只能从中选择，可多个）：${availableTagNames.join('、')}`
    : '当前没有可用标签，tagNames 返回空数组 []';

  const result = await mimoChat({
    model: process.env.MIMO_MODEL || 'mimo-v2.5-pro',
    messages: [
      {
        role: 'system',
        content: `你是家庭账本助手。将用户的口语记账内容解析为 JSON，只输出 JSON。
可用支出分类：${expenseCategoryNames.join('、')}
${tagPrompt}
字段说明：
- amount: 数字，必须大于 0
- categoryName: 必须从可用分类中选择最接近的一项；根据消费内容语义推断，不要默认选「其他」
- description: 简短描述，可为空字符串
- date: YYYY-MM-DD 格式；今天日期是 ${today}，请把“今天/昨天/前天”等换算成具体日期
- isExtra: 布尔值；当用户明确说这是额外支出、不计入预算、人情往来、大件采购等时才为 true，否则为 false
- tagNames: 字符串数组；必须从上方「可用标签」列表中精确选取（可多个）。结合用户原话与标签名称的语义做联想，即使用户只提到店铺、商品或场景、没有直说标签名也要匹配。运用常识，并注意不同场景不要混淆（例如过路费/高速费不是停车费；各类咖啡奶茶品牌应对应名称含义相近的标签）。没有相关标签则返回 []`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    max_completion_tokens: 320,
    temperature: 0.1,
    thinking: { type: 'disabled' },
    response_format: { type: 'json_object' },
  });

  const content = result.choices[0]?.message?.content;
  if (!content) {
    throw new Error('AI 未能解析记账内容');
  }

  let parsed: Partial<ParsedExpenseFields> & { tagNames?: unknown };
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('AI 返回格式无效');
  }

  return normalizeParsedExpense(parsed, today, availableTagNames);
}
