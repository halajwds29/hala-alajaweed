import mongoose, { Schema, Model } from 'mongoose';

export interface InquiryType {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  targetEmail: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const InquirySchema = new Schema<InquiryType>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    targetEmail: { type: String, default: 'info@halajwds.com' },
    status: { type: String, default: 'new', enum: ['new', 'read', 'replied', 'archived'] },
    source: { type: String, default: 'contact_form' },
  },
  {
    timestamps: true,
  }
);

export const InquiryModel: Model<InquiryType> =
  mongoose.models.Inquiry || mongoose.model<InquiryType>('Inquiry', InquirySchema);

