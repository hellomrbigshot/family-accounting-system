import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { Budget } from '../models/budget';
import dayjs from 'dayjs';

export const getCurrentBudget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { year, month } = req.query;
    const now = dayjs();

    // 如果没有指定年月，使用当前年月
    const targetYear = year ? parseInt(year as string) : now.year();
    const targetMonth = month ? parseInt(month as string) : now.month() + 1;

    const budget = await Budget.findOne({
      userId,
      year: targetYear,
      month: targetMonth
    });

    res.json(budget || { amount: 0 });
  } catch (error) {
    console.error('获取预算失败:', error);
    res.status(500).json({ message: '获取预算失败' });
  }
};

export const updateBudget = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { amount, year, month } = req.body;
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: '无效的预算金额' });
    }

    const now = dayjs();
    const targetYear = year || now.year();
    const targetMonth = month || now.month() + 1;

    // 验证月份是否有效
    if (targetMonth < 1 || targetMonth > 12) {
      return res.status(400).json({ message: '无效的月份' });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        userId,
        year: targetYear,
        month: targetMonth
      },
      {
        userId,
        year: targetYear,
        month: targetMonth,
        amount
      },
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (error) {
    console.error('更新预算失败:', error);
    res.status(500).json({ message: '更新预算失败' });
  }
};
