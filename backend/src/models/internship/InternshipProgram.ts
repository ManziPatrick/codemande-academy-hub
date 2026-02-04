import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipProgram extends Document {
  title: string;
  description: string;
  duration: string;
  startDate: Date;
  endDate: Date;
  applicationDeadline: Date;
  eligibility: string[];
  rules: string;
  price: number;
  currency: string;
  maxParticipants: number;
  isActive: boolean;
  batches: { name: string; startDate: Date; endDate: Date }[];
  status: 'active' | 'inactive' | 'closed';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipProgramSchema: Schema = new Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "3 Months"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicationDeadline: { type: Date, required: true },
    eligibility: [{ type: String }],
    rules: { type: String },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'RWF' },
    maxParticipants: { type: Number },
    isActive: { type: Boolean, default: true },
    batches: [{
       name: { type: String },
       startDate: { type: Date },
       endDate: { type: Date }
    }],
    status: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipProgram = mongoose.model<IInternshipProgram>('InternshipProgram', InternshipProgramSchema);
