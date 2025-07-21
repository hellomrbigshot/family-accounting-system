import { Schema, model, Types } from 'mongoose';

export interface IUserCategory {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  isDisabled: boolean; // true 表示用户禁用了该系统分类
  createdAt: Date;
  updatedAt: Date;
}

const userCategorySchema = new Schema<IUserCategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建复合索引，确保每个用户对每个分类只有一条记录
userCategorySchema.index({ userId: 1, categoryId: 1 }, { unique: true });

// 创建索引以提高查询性能
userCategorySchema.index({ userId: 1, isDisabled: 1 });
userCategorySchema.index({ categoryId: 1, isDisabled: 1 });

export const UserCategory = model<IUserCategory>('UserCategory', userCategorySchema); 