import mongoose, { Schema, Model } from 'mongoose';
import { Category as CategoryType } from '@/types';

const CategorySchema = new Schema<CategoryType>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel: Model<CategoryType> =
  mongoose.models.Category || mongoose.model<CategoryType>('Category', CategorySchema);

