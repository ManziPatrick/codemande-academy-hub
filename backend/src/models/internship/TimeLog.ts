import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipTimeLog extends Document {
    userId: mongoose.Types.ObjectId;
    teamId: mongoose.Types.ObjectId;
    description: string;
    minutes: number;
    date: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InternshipTimeLogSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', required: true, index: true },
        description: { type: String, required: true },
        minutes: { type: Number, required: true },
        date: { type: Date, default: Date.now, index: true },
        isDeleted: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

export const InternshipTimeLog = mongoose.model<IInternshipTimeLog>('InternshipTimeLog', InternshipTimeLogSchema);
