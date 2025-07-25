import { Schema, model } from 'mongoose'

export interface IFilter {
  userId: Schema.Types.ObjectId
  name: string
  conditions: {
    timeRange?: {
      type: 'preset' | 'custom'
      preset?: 'week' | 'month' | 'quarter' | 'year' | 'lastWeek' | 'lastMonth' | 'lastYear'
      custom?: {
        startDate: Date
        endDate: Date
      }
    }
    amountRanges?: Array<{
      operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
      value: number
    }>
    categories?: Schema.Types.ObjectId[]
    tags?: Schema.Types.ObjectId[]
    isExtra?: boolean
    descriptions?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

const filterSchema = new Schema<IFilter>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  conditions: {
    timeRange: {
      type: {
        type: String,
        enum: ['preset', 'custom'],
        default: 'preset'
      },
      preset: {
        type: String,
        enum: ['week', 'month', 'quarter', 'year', 'lastWeek', 'lastMonth', 'lastYear']
      },
      custom: {
        startDate: Date,
        endDate: Date
      }
    },
    amountRange: {
      operator: {
        type: String,
        enum: ['gt', 'lt', 'eq', 'gte', 'lte']
      },
      value: {
        type: Number,
        min: 0
      }
    },
    tags: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    isExtra: {
      type: Boolean
    },
    description: {
      type: String,
      maxlength: 200
    }
  }
}, {
  timestamps: true
})

// 创建索引以提高查询性能
filterSchema.index({ userId: 1, createdAt: -1 })
filterSchema.index({ userId: 1, name: 1 })

export const Filter = model<IFilter>('Filter', filterSchema) 