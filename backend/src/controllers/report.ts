import { Request, Response } from 'express'
import { Expense } from '../models/expense'
import { Tag } from '../models/tag'
import { Types } from 'mongoose'

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string
    roomNumber: string
  }
}

export const getReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query
    
    if (!req.user?._id) {
      return res.status(401).json({ message: '未授权访问' })
    }

    const query: any = { userId: new Types.ObjectId(req.user._id) }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      }
    }

    // 获取支出统计数据（包含额外支出）
    const expenseStats = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          extraTotal: { $sum: { $cond: ['$isExtra', '$amount', 0] } },
          normalTotal: { $sum: { $cond: ['$isExtra', 0, '$amount'] } },
          byCategory: {
            $push: {
              category: '$category',
              amount: '$amount',
              isExtra: '$isExtra'
            }
          },
          byDate: {
            $push: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date'
                }
              },
              amount: '$amount',
              isExtra: '$isExtra'
            }
          }
        }
      }
    ])

    // 获取标签统计数据
    const tagStats = await Expense.aggregate([
      { $match: query },
      { $unwind: '$tags' },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tagInfo'
        }
      },
      {
        $group: {
          _id: '$tags',
          total: { $sum: '$amount' },
          tagName: { $first: { $arrayElemAt: ['$tagInfo.name', 0] } }
        }
      },
      {
        $group: {
          _id: null,
          byTag: {
            $push: {
              tagId: '$_id',
              tagName: '$tagName',
              amount: '$total'
            }
          }
        }
      }
    ])

    // 处理支出数据
    const expenses = {
      total: 0,
      extraTotal: 0,
      normalTotal: 0,
      byCategory: {} as Record<string, number>,
      byExtraCategory: {} as Record<string, number>,
      byTag: {} as Record<string, number>,
      byDate: {} as Record<string, number>
    }

    if (expenseStats.length > 0) {
      const stats = expenseStats[0]
      expenses.total = stats.total
      expenses.extraTotal = stats.extraTotal || 0
      expenses.normalTotal = stats.normalTotal || 0

      // 按类别聚合（包含额外支出）
      stats.byCategory.forEach((item: any) => {
        expenses.byCategory[item.category] = (expenses.byCategory[item.category] || 0) + item.amount
        // 额外支出分类统计
        if (item.isExtra) {
          expenses.byExtraCategory[item.category] = (expenses.byExtraCategory[item.category] || 0) + item.amount
        }
      })

      // 按日期聚合
      stats.byDate.forEach((item: any) => {
        expenses.byDate[item.date] = (expenses.byDate[item.date] || 0) + item.amount
      })
    }

    // 处理标签数据
    if (tagStats.length > 0) {
      tagStats[0].byTag.forEach((item: any) => {
        if (item.tagId) {
          // 使用 tagId 作为 key，确保转换为字符串
          const tagIdStr = item.tagId.toString()
          expenses.byTag[tagIdStr] = (expenses.byTag[tagIdStr] || 0) + item.amount
        }
      })
    }

    // 生成趋势数据（使用传入的日期范围或默认最近30天）
    const trends = {
      expenses: {} as Record<string, number>,
      extraExpenses: {} as Record<string, number>,
      normalExpenses: {} as Record<string, number>
    }

    // 构建趋势查询条件
    const trendQuery: any = { 
      userId: new Types.ObjectId(req.user._id)
    }

    // 如果有传入日期范围，使用传入的范围；否则使用最近30天
    if (startDate && endDate) {
      trendQuery.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      }
    } else {
      trendQuery.date = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }

    const trendStats = await Expense.aggregate([
      { $match: trendQuery },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date'
            }
          },
          total: { $sum: '$amount' },
          extraTotal: { $sum: { $cond: ['$isExtra', '$amount', 0] } },
          normalTotal: { $sum: { $cond: ['$isExtra', 0, '$amount'] } }
        }
      },
      { $sort: { _id: 1 } }
    ])

    trendStats.forEach((item: any) => {
      trends.expenses[item._id] = item.total
      trends.extraExpenses[item._id] = item.extraTotal || 0
      trends.normalExpenses[item._id] = item.normalTotal || 0
    })

    // 构建响应数据
    const reportData = {
      expenses,
      balance: -expenses.total, // 目前只有支出，所以余额为负
      trends
    }

    res.json(reportData)
  } catch (error) {
    console.error('获取报表数据失败:', error)
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '获取报表数据失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '获取报表数据失败' })
    }
  }
}

export const exportReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 导出功能预留，可以后续实现 Excel 或 CSV 导出
    res.status(501).json({ message: '导出功能暂未实现' })
  } catch (error) {
    console.error('导出报表失败:', error)
    if (error instanceof Error) {
      res.status(500).json({ 
        message: '导出报表失败',
        error: error.message
      })
    } else {
      res.status(500).json({ message: '导出报表失败' })
    }
  }
} 