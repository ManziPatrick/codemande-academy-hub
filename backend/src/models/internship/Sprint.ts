import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipSprint extends Document {
  projectId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  title: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  order: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSprintSchema: Schema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: 'InternshipProject', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', required: true, index: true },
    title: { type: String, required: true },
    goal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed'],
      default: 'planning',
      index: true
    },
    order: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipSprint = mongoose.model<IInternshipSprint>('InternshipSprint', InternshipSprintSchema);
