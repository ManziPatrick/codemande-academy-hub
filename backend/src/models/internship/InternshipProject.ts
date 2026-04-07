import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipProject extends Document {
  internshipProgramId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  document?: string; // Full markdown documentation
  objectives?: string[];
  requiredSkills: string[];
  teamSizeRange: {
    min: number;
    max: number;
  };
  status: 'draft' | 'published' | 'archived';
  documentation?: {
    links?: Array<{ title: string; url: string }>;
  };
  defaultTickets?: Array<{
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    taskType: 'task' | 'bug' | 'feature' | 'improvement';
    labels?: string[];
    suggestedRole?: string;
    order: number;
  }>;
  workflow?: Array<{
    id: string;
    label: string;
    color: string;
    order: number;
    type: 'todo' | 'progress' | 'testing' | 'review' | 'done' | 'staged' | 'completed';
  }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipProjectSchema: Schema = new Schema(
  {
    internshipProgramId: { type: Schema.Types.ObjectId, ref: 'InternshipProgram', required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    document: { type: String }, // Rich markdown: full project spec
    trainer: { type: Schema.Types.ObjectId, ref: 'User' },
    objectives: [{ type: String }],
    requiredSkills: [{ type: String }],
    teamSizeRange: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 10 }
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true
    },
    documentation: {
      links: [{ title: String, url: String }],
    },
    defaultTickets: [{
      title: { type: String, required: true },
      description: { type: String },
      priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
      taskType: { type: String, enum: ['task', 'bug', 'feature', 'improvement'], default: 'task' },
      labels: [{ type: String }],
      suggestedRole: { type: String },
      order: { type: Number, default: 0 }
    }],
    workflow: [{
      id: String,
      label: String,
      color: String,
      order: Number,
      type: { type: String, enum: ['todo', 'progress', 'testing', 'review', 'done', 'staged', 'completed'] }
    }],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipProject = mongoose.model<IInternshipProject>('InternshipProject', InternshipProjectSchema);
