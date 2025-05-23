import { Schema, model } from 'mongoose';

export interface IBudget {
  userId: string;
  year: number;
  month: number;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  userId: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  amount: { type: Number, required: true, min: 0 }
}, {
  timestamps: true
});

// 创建复合索引，确保每个用户每个月只有一个预算记录
budgetSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

export const Budget = model<IBudget>('Budget', budgetSchema); 