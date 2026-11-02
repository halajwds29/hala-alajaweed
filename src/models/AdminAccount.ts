import mongoose, { Schema, Model } from 'mongoose';

export interface AdminAccountDocument {
  username: string;
  passwordHash: string;
  tokenVersion?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

const AdminAccountSchema = new Schema<AdminAccountDocument>(
  {
    username: { type: String, required: true, default: 'admin', unique: true },
    passwordHash: { type: String, required: true },
    tokenVersion: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export const AdminAccountModel: Model<AdminAccountDocument> =
  mongoose.models.AdminAccount ||
  mongoose.model<AdminAccountDocument>('AdminAccount', AdminAccountSchema);
