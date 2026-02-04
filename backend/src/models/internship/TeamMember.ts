import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipTeamMember extends Document {
  teamId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipTeamMemberSchema: Schema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, default: 'Intern' }, // e.g., "Team Lead", "Frontend", etc.
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Ensure a user is only in a team once
InternshipTeamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const InternshipTeamMember = mongoose.model<IInternshipTeamMember>('InternshipTeamMember', InternshipTeamMemberSchema);
