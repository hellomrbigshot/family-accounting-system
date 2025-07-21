import { Schema, model, Types } from 'mongoose';

export interface ICategory {
  userId?: Types.ObjectId; // 系统分类为 null，家庭分类为房间ID
  roomNumber?: string; // 家庭分类的房间号
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
  isSystem: boolean; // 是否为系统固定分类
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
    required: false // 系统分类为 null
  },
  roomNumber: {
    type: String,
    required: false // 家庭分类的房间号
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
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ roomNumber: 1, type: 1 });
categorySchema.index({ isSystem: 1, type: 1 });
categorySchema.index({ roomNumber: 1, name: 1 });

// 添加虚拟字段，用于关联用户分类权限
categorySchema.virtual('userPermissions', {
  ref: 'UserCategory',
  localField: '_id',
  foreignField: 'categoryId'
});

// 系统固定分类
const systemCategories: IDefaultCategory[] = [
  { name: '餐饮', type: 'expense', icon: '🍜', color: '#F59E0B' },
  { name: '交通', type: 'expense', icon: '🚗', color: '#3B82F6' },
  { name: '购物', type: 'expense', icon: '🛍️', color: '#EC4899' },
  { name: '娱乐', type: 'expense', icon: '🎮', color: '#8B5CF6' },
  { name: '居住', type: 'expense', icon: '🏠', color: '#10B981' },
  { name: '医疗', type: 'expense', icon: '🏥', color: '#EF4444' },
  { name: '教育', type: 'expense', icon: '📚', color: '#8B5CF6' },
  { name: '数码', type: 'expense', icon: '💻', color: '#6366F1' },
  { name: '美容', type: 'expense', icon: '💄', color: '#EC4899' },
  { name: '宠物', type: 'expense', icon: '🐕', color: '#F59E0B' },
  { name: '家居', type: 'expense', icon: '🛋️', color: '#10B981' },
  { name: '水果', type: 'expense', icon: '🍎', color: '#EF4444' },
  { name: '旅游', type: 'expense', icon: '🏖️', color: '#3B82F6' },
  { name: '金融', type: 'expense', icon: '💰', color: '#059669' },
  { name: '通讯', type: 'expense', icon: '📞', color: '#6366F1' },
  { name: '工资', type: 'income', icon: '💰', color: '#059669' },
  { name: '奖金', type: 'income', icon: '🎁', color: '#D97706' },
  { name: '投资', type: 'income', icon: '📈', color: '#10B981' },
  { name: '其他', type: 'expense', icon: '📦', color: '#6B7280' }
];

export { systemCategories };
export const Category = model<ICategory>('Category', categorySchema); 