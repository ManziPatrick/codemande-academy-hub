import mongoose, { Schema, Document } from 'mongoose';

export type ModuleAssignmentStatus = 'pending' | 'approved' | 'rejected';

export interface IModuleAssignment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  submissionLink?: string;
  fileUrl?: string;
  status: ModuleAssignmentStatus;
  feedback?: string;
  score?: number;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  submittedAt?: Date;
}

const moduleAssignmentSchema = new Schema<IModuleAssignment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, required: true, index: true },
    submissionLink: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    feedback: { type: String },
    score: { type: Number, min: 0, max: 100 },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

moduleAssignmentSchema.index({ studentId: 1, courseId: 1, moduleId: 1 }, { unique: true });

export const ModuleAssignment = mongoose.model<IModuleAssignment>('ModuleAssignment', moduleAssignmentSchema);
