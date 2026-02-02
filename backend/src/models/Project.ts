import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  course: string;
  type: string; // 'Team Project' or 'Individual'
  status: string; // 'in_progress', 'pending_review', 'completed'
  progress: number;
  deadline?: Date;
  submittedAt?: Date;
  grade?: string;
  feedback?: string;
  team?: Array<{ name: string; role: string }>;
  tasks?: Array<{ title: string; completed: boolean }>;
  description: string;
  submissionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    course: { type: String, required: true },
    type: { type: String, required: true, enum: ['Team Project', 'Individual'] },
    status: { type: String, required: true, enum: ['in_progress', 'pending_review', 'completed'], default: 'in_progress' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: { type: Date },
    submittedAt: { type: Date },
    grade: { type: String },
    feedback: { type: String },
    team: [
      {
        name: { type: String },
        role: { type: String },
      },
    ],
    tasks: [
      {
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    description: { type: String, required: true },
    submissionUrl: { type: String },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
