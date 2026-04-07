import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'in_testing'
  | 'in_review'
  | 'done'
  | 'staged'
  | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'task' | 'bug' | 'feature' | 'improvement';

export interface ITaskAttachment {
  name: string;
  url: string;
  type: 'image' | 'link' | 'file';
}

export interface IInternshipTask extends Document {
  sprintId?: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: mongoose.Types.ObjectId;
  storyPoints?: number;
  labels?: string[];
  attachments?: ITaskAttachment[];
  taskType: TaskType;
  dependencies?: mongoose.Types.ObjectId[];
  dueDate?: Date;
  order: number;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskAttachmentSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'link', 'file'], default: 'link' },
  },
  { _id: false }
);

const InternshipTaskSchema: Schema = new Schema(
  {
    sprintId: { type: Schema.Types.ObjectId, ref: 'InternshipSprint', index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'InternshipProject', required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'InternshipTeam', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'in_testing', 'in_review', 'done', 'staged', 'completed'],
      default: 'todo',
      index: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    storyPoints: { type: Number },
    labels: [{ type: String }],
    attachments: [TaskAttachmentSchema],
    taskType: {
      type: String,
      enum: ['task', 'bug', 'feature', 'improvement'],
      default: 'task',
      index: true
    },
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'InternshipTask' }],
    dueDate: { type: Date },
    order: { type: Number, default: 0 },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipTask = mongoose.model<IInternshipTask>('InternshipTask', InternshipTaskSchema);
