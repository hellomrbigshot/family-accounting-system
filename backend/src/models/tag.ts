import { Schema, model } from 'mongoose';

export interface ITag {
  roomNumber: string; // 家庭房间号
  name: string;
  color?: string;
  type: 'normal' | 'temporary';
  startDate?: Date;
  endDate?: Date;
  autoApply: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tagSchema = new Schema<ITag>({
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#6366F1'
  },
  type: {
    type: String,
    enum: ['normal', 'temporary'],
    default: 'normal'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  autoApply: {
    type: Boolean,
    default: true
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
tagSchema.index({ roomNumber: 1 });
tagSchema.index({ roomNumber: 1, name: 1 });
tagSchema.index({ roomNumber: 1, type: 1, startDate: 1, endDate: 1 });

export const Tag = model<ITag>('Tag', tagSchema);
