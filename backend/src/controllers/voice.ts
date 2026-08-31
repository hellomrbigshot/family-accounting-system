import dayjs from 'dayjs';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { transcribeAudio } from '../services/mimo/asr';
import { parseExpenseText } from '../services/mimo/parseExpense';
import { resolveExpenseCategoryId } from '../services/voice/resolveCategory';
import {
  getAvailableTagsForPrompt,
  resolveExpenseTagIds,
} from '../services/voice/resolveTags';
import { validateExpenseTags } from '../utils/tag';

export const expenseFromVoice = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id || !req.user?.roomNumber) {
      return res.status(401).json({ message: '未授权访问' });
    }

    if (!req.file?.buffer?.length) {
      return res.status(400).json({ message: '请上传音频文件' });
    }

    const mimeType = req.file.mimetype || 'audio/wav';
    const today = dayjs().format('YYYY-MM-DD');
    const availableTags = await getAvailableTagsForPrompt(req.user.roomNumber, today);
    const rawText = await transcribeAudio(req.file.buffer, mimeType);
    const parsed = await parseExpenseText(rawText, {
      availableTagNames: availableTags.map((tag) => tag.name),
    });
    const categoryId = await resolveExpenseCategoryId(
      req.user._id,
      req.user.roomNumber,
      parsed.categoryName
    );

    if (!categoryId) {
      return res.status(400).json({ message: '未找到可用分类，请先在分类管理中启用分类' });
    }

    const resolvedTags = await resolveExpenseTagIds(
      req.user.roomNumber,
      parsed.tagNames,
      parsed.date
    );
    const validatedTags = await validateExpenseTags({
      tagIds: resolvedTags.map((tag) => tag.id),
      date: parsed.date,
      roomNumber: req.user.roomNumber,
    });

    if (validatedTags.error) {
      return res.status(400).json({ message: validatedTags.error });
    }

    res.json({
      rawText,
      amount: parsed.amount,
      categoryName: parsed.categoryName,
      categoryId,
      description: parsed.description,
      date: parsed.date,
      isExtra: parsed.isExtra,
      tags: resolvedTags.map((tag) => tag.id),
      tagNames: resolvedTags.map((tag) => tag.name),
    });
  } catch (error) {
    console.error('语音记账失败:', error);
    const message = error instanceof Error ? error.message : '语音记账失败';
    res.status(500).json({ message });
  }
};
