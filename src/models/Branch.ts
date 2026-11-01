import mongoose, { Schema, Model } from 'mongoose';
import { Branch as BranchType } from '@/types';

const BranchSchema = new Schema<BranchType>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    mapUrl: { type: String, default: '' },
    phone: { type: String, required: true },
    workingHours: { type: String, default: 'من 9:00 صباحاً حتى 11:30 مساءً' },
    isActive: { type: Boolean, default: true },
    isHQ: { type: Boolean, default: false },
    serviceAreas: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const BranchModel: Model<BranchType> =
  mongoose.models.Branch || mongoose.model<BranchType>('Branch', BranchSchema);

