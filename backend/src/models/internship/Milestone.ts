import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipMilestone extends Document {
  internshipProjectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipMilestoneSchema: Schema = new Schema(
  {
    internshipProjectId: { type: Schema.Types.ObjectId, ref: 'InternshipProject', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    order: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipMilestone = mongoose.model<IInternshipMilestone>('InternshipMilestone', InternshipMilestoneSchema);
