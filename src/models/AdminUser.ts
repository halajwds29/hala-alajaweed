import mongoose, { Schema, Model } from 'mongoose';

export interface AdminUserType {
  _id: string;
  username: string;
  passwordHash: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminUserSchema = new Schema<AdminUserType>(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: 'مدير المتجر' },
  },
  {
    timestamps: true,
  }
);

export const AdminUserModel: Model<AdminUserType> =
  mongoose.models.AdminUser ||
  mongoose.model<AdminUserType>('AdminUser', AdminUserSchema);

