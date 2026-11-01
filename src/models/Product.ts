import mongoose, { Schema, Model } from 'mongoose';
import { Product as ProductType, ProductVariant, ProductImage } from '@/types';

const ProductVariantSchema = new Schema<ProductVariant>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    saleMethod: {
      type: String,
      enum: ['piece', 'box', 'weight', 'size'],
      required: true,
    },
    unitValue: { type: Number, default: 1 },
    unitName: { type: String, required: true },
    retailPrice: { type: Number, required: true },
    retailDiscount: { type: Number, default: 0 },
    retailDiscountType: {
      type: String,
      enum: ['percentage', 'amount'],
      default: 'percentage',
    },
    wholesalePrice: { type: Number, default: 0 },
    wholesaleDiscount: { type: Number, default: 0 },
    wholesaleDiscountType: {
      type: String,
      enum: ['percentage', 'amount'],
      default: 'percentage',
    },
    minWholesaleQty: { type: Number, default: 1 },
    isWholesaleAvailable: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<ProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema<ProductType>(
  {
    _id: { type: String },
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    categorySlug: { type: String, required: true, index: true },
    categoryName: { type: String },
    images: {
      type: [ProductImageSchema],
      validate: [
        (val: ProductImage[]) => val.length <= 4,
        'لا يمكن إضافة أكثر من 4 صور للمنتج',
      ],
      default: [],
    },
    calories: { type: Number },
    caloriesBasis: { type: String, default: 'لكل 100 جرام' },
    weight: { type: String },
    isAvailable: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    variants: { type: [ProductVariantSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

// Full text search index
ProductSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

export const ProductModel: Model<ProductType> =
  mongoose.models.Product || mongoose.model<ProductType>('Product', ProductSchema);

