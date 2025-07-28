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
    const { 
      startDate, 
      endDate, 
      category, 
      categories,
      isExtra, 
      tags,
      minAmount,
      maxAmount,
      amountOperator,
      amountValue,
      description
    } = req.query;
    
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' });
    }

    const query: any = { userId: new Types.ObjectId(req.user._id) };

    // 时间范围筛选
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    // 分类筛选（支持单个或多个分类）
    if (category) {
      query.category = category;
    } else if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      query.category = { $in: categoryArray };
    }

    // 额外支出筛选
    if (isExtra !== undefined) {
      query.isExtra = isExtra === 'true';
    }

    // 标签筛选
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray.map(tag => new Types.ObjectId(tag as string)) };
    }

    // 金额范围筛选
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) {
        query.amount.$gte = parseFloat(minAmount as string);
      }
      if (maxAmount !== undefined) {
        query.amount.$lte = parseFloat(maxAmount as string);
      }
    }

    // 金额比较筛选
    if (amountOperator && amountValue !== undefined) {
      const value = parseFloat(amountValue as string);
      switch (amountOperator) {
        case 'gt':
          query.amount = { $gt: value };
          break;
        case 'lt':
          query.amount = { $lt: value };
          break;
        case 'eq':
          query.amount = value;
          break;
        case 'gte':
          query.amount = { $gte: value };
          break;
        case 'lte':
          query.amount = { $lte: value };
          break;
      }
    }

    // 描述关键词搜索
    if (description) {
      query.description = { $regex: description as string, $options: 'i' };
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