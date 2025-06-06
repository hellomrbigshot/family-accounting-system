import { Schema, model, Types } from 'mongoose';

export interface ITag {
  userId: Types.ObjectId;
  name: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>({
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
  color: {
    type: String,
    default: '#6366F1'
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
tagSchema.index({ userId: 1 });

// 默认标签
const defaultTags = [
  { name: '备婚', color: '#EC4899' },
  { name: '618大促', color: '#F59E0B' },
  { name: '双十一大促', color: '#EF4444' },
  { name: '装修', color: '#10B981' }
];

export const Tag = model<ITag>('Tag', tagSchema);
export { defaultTags }; 