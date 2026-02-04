import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    module: string; // e.g., "Internship"
    targetType: string; // e.g., "Submission", "Team"
    targetId?: mongoose.Types.ObjectId;
    details: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const InternshipActivityLogSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        action: { type: String, required: true, index: true },
        module: { type: String, default: 'Internship', index: true },
        targetType: { type: String, required: true, index: true },
        targetId: { type: Schema.Types.ObjectId, index: true },
        details: { type: String },
        isDeleted: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
);

export const InternshipActivityLog = mongoose.model<IInternshipActivityLog>('InternshipActivityLog', InternshipActivityLogSchema);
