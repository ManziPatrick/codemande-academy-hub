import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipTeam extends Document {
    name: string;
    internshipProjectId: mongoose.Types.ObjectId;
    internshipProgramId: mongoose.Types.ObjectId;
    mentorId?: mongoose.Types.ObjectId;
    status: 'active' | 'disbanded' | 'completed' | 'on_hold' | 'pending';
    type: 'team' | 'individual';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InternshipTeamSchema: Schema = new Schema(
    {
        name: { type: String, required: true, index: true },
        internshipProjectId: { type: Schema.Types.ObjectId, ref: 'InternshipProject', index: true },
        internshipProgramId: { type: Schema.Types.ObjectId, ref: 'InternshipProgram', required: true, index: true },
        mentorId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        status: {
            type: String,
            enum: ['active', 'disbanded', 'completed', 'on_hold', 'pending'],
            default: 'pending',
            index: true
        },
        type: {
            type: String,
            enum: ['team', 'individual'],
            default: 'team',
            index: true
        },
        isDeleted: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

export const InternshipTeam = mongoose.model<IInternshipTeam>('InternshipTeam', InternshipTeamSchema);
