import mongoose, { Schema, Model } from 'mongoose';
import { Order as OrderType, OrderItemSnapshot } from '@/types';

const OrderItemSnapshotSchema = new Schema<OrderItemSnapshot>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variantId: { type: String, required: true },
    variantName: { type: String, required: true },
    saleMethod: { type: String, required: true },
    unitName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderType>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true, index: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
    },
    orderType: {
      type: String,
      enum: ['retail', 'wholesale'],
      default: 'retail',
    },
    deliveryMethod: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'delivery',
    },
    items: { type: [OrderItemSnapshotSchema], required: true },
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        'new',
        'reviewing',
        'confirmed',
        'preparing',
        'ready',
        'delivering',
        'completed',
        'cancelled',
      ],
      default: 'new',
      index: true,
    },
    customerNotes: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    idempotencyKey: { type: String, sparse: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// Search indexes
OrderSchema.index({ 'customer.phone': 1, orderNumber: 1 });
OrderSchema.index({ createdAt: -1 });

export const OrderModel: Model<OrderType> =
  mongoose.models.Order || mongoose.model<OrderType>('Order', OrderSchema);

