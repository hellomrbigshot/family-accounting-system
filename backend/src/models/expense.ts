import { Schema, model } from 'mongoose';

export interface IExpense {
  userId: Schema.Types.ObjectId;
  date: Date;
  category: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      '食品餐饮',
      '购物消费',
      '出行交通',
      '休闲娱乐',
      '医疗健康',
      '教育学习',
      '生活缴费',
      '其他'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['支付宝', '微信', '银联', '现金']
  },
  description: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, paymentMethod: 1 });

export const Expense = model<IExpense>('Expense', expenseSchema); 