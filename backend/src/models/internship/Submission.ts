import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipSubmission extends Document {
  milestoneId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The person who submitted
  contentUrl: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSubmissionSchema: Schema = new Schema(
  {
    milestoneId: { type: Schema.Types.ObjectId, ref: 'InternshipMilestone', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentUrl: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    feedback: { type: String },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipSubmission = mongoose.model<IInternshipSubmission>('InternshipSubmission', InternshipSubmissionSchema);
