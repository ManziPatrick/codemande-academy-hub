import mongoose, { Schema, Document } from 'mongoose';

export type MeetingFrequency = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface IInternshipMeeting extends Document {
  title: string;
  description?: string;
  type: MeetingFrequency;
  meetLink?: string;
  startTime: Date;
  endTime: Date;
  teamIds: mongoose.Types.ObjectId[];
  userIds: mongoose.Types.ObjectId[]; // Selective users
  mentorIds: mongoose.Types.ObjectId[]; // Selective trainers/mentors
  hostId: mongoose.Types.ObjectId; // Trainer/Admin who created it
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipMeetingSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'],
      default: 'ONCE',
    },
    meetLink: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrenceDays: [{ type: Number, min: 0, max: 6 }], // 0=Sun,1=Mon...6=Sat
    teamIds: [{ type: Schema.Types.ObjectId, ref: 'InternshipTeam', index: true }],
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    mentorIds: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipMeeting = mongoose.model<IInternshipMeeting>('InternshipMeeting', InternshipMeetingSchema);
