import { Schema, model, Document } from 'mongoose';

export interface IAccount extends Document {
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'other';
  balance: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['cash', 'bank', 'credit', 'other'],
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      required: true,
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

export const Account = model<IAccount>('Account', accountSchema); 