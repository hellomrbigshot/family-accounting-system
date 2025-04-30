import { Schema, model, Document } from 'mongoose';

export interface ITransfer extends Document {
  fromAccount: Schema.Types.ObjectId;
  toAccount: Schema.Types.ObjectId;
  amount: number;
  remark?: string;
  createdAt: Date;
}

const transferSchema = new Schema<ITransfer>(
  {
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    toAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    remark: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Transfer = model<ITransfer>('Transfer', transferSchema); 