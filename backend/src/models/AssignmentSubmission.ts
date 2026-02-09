import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignmentSubmission extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    lessonId: string;
    content: string;
    status: 'pending' | 'reviewed' | 'revision_requested';
    grade?: number;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSubmissionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        lessonId: { type: String, required: true },
        content: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'revision_requested'],
            default: 'pending'
        },
        grade: { type: Number },
        feedback: { type: String },
    },
    { timestamps: true }
);

// Index for quick lookups
AssignmentSubmissionSchema.index({ userId: 1, courseId: 1, lessonId: 1 });

export const AssignmentSubmission = mongoose.model<IAssignmentSubmission>('AssignmentSubmission', AssignmentSubmissionSchema);
