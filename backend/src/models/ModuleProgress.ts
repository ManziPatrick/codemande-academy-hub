import mongoose, { Schema, Document } from 'mongoose';

export interface IModuleProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  currentModuleIndex: number;
  completedLessons: string[];
  unlockedModules: number[];
  overrideUnlockedModules: number[];
  lessonCompletionDates: Record<string, Date>;
  assignmentSubmissionDates: Record<string, Date>;
  approvalDates: Record<string, Date>;
  approvedByMap: Record<string, string>;
}

const moduleProgressSchema = new Schema<IModuleProgress>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    currentModuleIndex: { type: Number, default: 0 },
    completedLessons: [{ type: String }],
    unlockedModules: [{ type: Number }],
    overrideUnlockedModules: [{ type: Number }],
    lessonCompletionDates: { type: Schema.Types.Mixed, default: {} },
    assignmentSubmissionDates: { type: Schema.Types.Mixed, default: {} },
    approvalDates: { type: Schema.Types.Mixed, default: {} },
    approvedByMap: { type: Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

moduleProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const ModuleProgress = mongoose.model<IModuleProgress>('ModuleProgress', moduleProgressSchema);
