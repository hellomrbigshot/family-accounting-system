import { Request, Response } from 'express';
import { Expense } from '../models/expense';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    roomNumber: string;
  };
}

export const createExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, category, amount, description, tags, isExtra } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const expense = new Expense({
      userId: new Types.ObjectId(req.user._id),
      date,
      category,
      amount,
      description,
      tags: tags || [],
      isExtra: isExtra || false
    });

    await expense.save();

    // 格式化返回数据
    const formattedExpense = {
      id: expense._id,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      tags: expense.tags,
      isExtra: expense.isExtra,
      createdAt: expense.createdAt
    };

    res.status(201).json({
      message: '支出记录创建成功',
      expense: formattedExpense
    });
  } catch (error) {
    console.error('创建支出记录失败:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '支出记录创建失败',
        error: error.message
      });
    } else {
      res.status(500).json({ message: '支出记录创建失败' });
    }
  }
};

export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate, category, isExtra } = req.query;
    
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const query: any = { userId: new Types.ObjectId(req.user._id) };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    if (category) {
      query.category = category;
    }

    if (isExtra !== undefined) {
      query.isExtra = isExtra === 'true';
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1, updatedAt: -1 })
      .exec();

    // 格式化响应数据
    const formattedExpenses = expenses.map(expense => ({
      id: expense._id,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      tags: expense.tags,
      isExtra: expense.isExtra,
      createdAt: expense.createdAt
    }));

    res.json(formattedExpenses);
  } catch (error) {
    console.error('获取支出记录失败:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '获取支出记录失败',
        error: error.message
      });
    } else {
      res.status(500).json({ message: '获取支出记录失败' });
    }
  }
};

export const getExpenseStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const query: any = { userId: new Types.ObjectId(req.user._id) };

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
      dateStats
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '获取统计数据失败',
        error: error.message
      });
    } else {
      res.status(500).json({ message: '获取统计数据失败' });
    }
  }
};

export const deleteExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(req.user._id)
    });

    if (!expense) {
      return res.status(404).json({ message: '支出记录不存在' });
    }

    res.json({ message: '支出记录删除成功' });
  } catch (error) {
    console.error('删除支出记录失败:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '删除支出记录失败',
        error: error.message
      });
    } else {
      res.status(500).json({ message: '删除支出记录失败' });
    }
  }
};

export const updateExpense = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { date, category, amount, description, tags, isExtra } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: id,
        userId: new Types.ObjectId(req.user._id)
      },
      {
        date,
        category,
        amount,
        description,
        tags: tags || [],
        isExtra: isExtra || false
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: '支出记录不存在' });
    }

    // 格式化返回数据
    const formattedExpense = {
      id: expense._id,
      date: expense.date,
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      tags: expense.tags,
      isExtra: expense.isExtra,
      createdAt: expense.createdAt
    };

    res.json({
      message: '支出记录更新成功',
      expense: formattedExpense
    });
  } catch (error) {
    console.error('更新支出记录失败:', error);
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '更新支出记录失败',
        error: error.message
      });
    } else {
      res.status(500).json({ message: '更新支出记录失败' });
    }
  }
}; 