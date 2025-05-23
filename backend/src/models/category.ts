import { Schema, model } from 'mongoose';

export interface ICategory {
  userId: Schema.Types.ObjectId;
  name: string;
  type: 'expense' | 'income';
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
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
    type: String
  },
  color: {
    type: String
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
categorySchema.index({ userId: 1, type: 1 });
categorySchema.index({ userId: 1, name: 1 });

export const Category = model<ICategory>('Category', categorySchema); 