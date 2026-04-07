import mongoose, { Schema, Document } from 'mongoose';

export interface IStandup extends Document {
  internshipId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  yesterday: string;
  today: string;
  blockers: string;
  workLink?: string; // general work/commitment link
  attendanceStatus: 'present' | 'absent' | 'excused';
  trainerFeedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StandupSchema: Schema = new Schema(
  {
    internshipId: { type: Schema.Types.ObjectId, ref: 'Internship', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    yesterday: { type: String, required: true },
    today: { type: String, required: true },
    blockers: { type: String, default: 'None' },
    workLink: { type: String },
    attendanceStatus: { 
      type: String, 
      enum: ['present', 'absent', 'excused'], 
      default: 'present' 
    },
    trainerFeedback: { type: String }
  },
  { timestamps: true }
);

export const Standup = mongoose.model<IStandup>('Standup', StandupSchema);
