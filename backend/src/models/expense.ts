import { Schema, model } from 'mongoose';

export interface IExpense {
  userId: Schema.Types.ObjectId;
  date: Date;
  category: Schema.Types.ObjectId;
  amount: number;
  description?: string;
  tags: Schema.Types.ObjectId[];
  isExtra: boolean;
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
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    maxlength: 200
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  isExtra: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ tags: 1 });

export const Expense = model<IExpense>('Expense', expenseSchema); 