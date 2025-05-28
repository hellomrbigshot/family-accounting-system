import { Schema, model, Types } from 'mongoose';

export interface ICategory {
  userId: Types.ObjectId;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDefaultCategory {
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
}

const categorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'income']
  },
  icon: {
    type: String,
    default: '📦'
  },
  color: {
    type: String,
    default: '#6366F1'
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, name: 1 });

// 默认分类
const defaultCategories: IDefaultCategory[] = [
  { name: '餐饮', type: 'expense', icon: '🍜', color: '#F59E0B' },
  { name: '交通', type: 'expense', icon: '🚗', color: '#3B82F6' },
  { name: '购物', type: 'expense', icon: '🛍️', color: '#EC4899' },
  { name: '娱乐', type: 'expense', icon: '🎮', color: '#8B5CF6' },
  { name: '居住', type: 'expense', icon: '🏠', color: '#10B981' },
  { name: '工资', type: 'income', icon: '💰', color: '#059669' },
  { name: '奖金', type: 'income', icon: '🎁', color: '#D97706' },
  { name: '其他', type: 'expense', icon: '📦', color: '#6B7280' }
];

export { defaultCategories };
export const Category = model<ICategory>('Category', categorySchema); 