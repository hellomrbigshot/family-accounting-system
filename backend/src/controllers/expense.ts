import { Request, Response } from 'express';
import { Expense } from '../models/expense';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    roomNumber: string;
  };
}

export const createExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, category, amount, paymentMethod, description } = req.body;

    const expense = new Expense({
      userId: new Types.ObjectId(req.user?.userId),
      date,
      category,
      amount,
      paymentMethod,
      description
    });

    await expense.save();

    res.status(201).json({
      message: '支出记录创建成功',
      expense
    });
  } catch (error) {
    res.status(500).json({ message: '支出记录创建失败' });
  }
};

export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, category, paymentMethod } = req.query;
    const userId = req.user?.userId;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (category) {
      query.category = category;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .exec();

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: '获取支出记录失败' });
  }
};

export const getExpenseStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user?.userId;

    const query: any = { userId: new Types.ObjectId(userId) };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // 按类别统计
    const categoryStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // 按支付方式统计
    const paymentMethodStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' }
        }
      }
    ]);

    // 按日期统计
    const dateStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date'
            }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      categoryStats,
      paymentMethodStats,
      dateStats
    });
  } catch (error) {
    res.status(500).json({ message: '获取统计数据失败' });
  }
}; 