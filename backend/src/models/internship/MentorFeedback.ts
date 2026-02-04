import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipMentorFeedback extends Document {
  mentorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // The intern being reviewed
  teamId?: mongoose.Types.ObjectId;
  score: number; // 1-10
  comments: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipMentorFeedbackSchema: Schema = new Schema(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', index: true },
    score: { type: Number, required: true, min: 1, max: 10 },
    comments: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipMentorFeedback = mongoose.model<IInternshipMentorFeedback>('InternshipMentorFeedback', InternshipMentorFeedbackSchema);
