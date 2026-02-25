import mongoose, { Schema, Document } from 'mongoose';

export interface IModuleAccessConfig extends Document {
  courseId: mongoose.Types.ObjectId;
  autoUnlockEnabled: boolean;
  autoUnlockScoreThreshold: number;
}

const moduleAccessConfigSchema = new Schema<IModuleAccessConfig>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, unique: true },
    autoUnlockEnabled: { type: Boolean, default: false },
    autoUnlockScoreThreshold: { type: Number, default: 80 }
  },
  { timestamps: true }
);

export const ModuleAccessConfig = mongoose.model<IModuleAccessConfig>('ModuleAccessConfig', moduleAccessConfigSchema);
