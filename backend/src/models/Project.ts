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
  mentors: mongoose.Types.ObjectId[];
  team?: Array<{ userId?: mongoose.Types.ObjectId; name: string; role: string }>;
  tasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
    approved?: boolean;
    feedback?: string;
    aiFeedback?: string; // AI review of the task
  }>;
  milestoneVideos?: Array<{
    title: string;
    videoUrl: string;
    milestoneIndex: number;
  }>;
  milestones?: Array<{
    title: string;
    description?: string;
    dueDate?: Date;
    completed: boolean;
    deliverables?: string[];
    submissions?: Array<{
      url: string;
      submittedAt: Date;
      message?: string;
      feedback?: string;
      status: 'pending' | 'approved' | 'rejected';
      aiReview?: string;
    }>;
    feedback?: string;
    aiAnalysis?: string;
  }>;
  description: string;
  documentation?: {
    images?: string[];
    videos?: string[];
    links?: Array<{ title: string; url: string }>;
    inPersonNotes?: string;
  };
  submissionUrl?: string;
  conversationId?: mongoose.Types.ObjectId | string;
  startDate?: Date;
  endDate?: Date;
  skills?: string[];
  parentProject?: mongoose.Types.ObjectId;
  assessmentRubric?: {
    criteria: Array<{
      name: string;
      marks: number;
      achieved: boolean;
      feedback?: string;
    }>;
  };
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
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    team: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        role: { type: String },
      },
    ],
    tasks: [
      {
        id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        title: { type: String },
        completed: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        feedback: { type: String },
        aiFeedback: { type: String },
      },
    ],
    milestoneVideos: [
      {
        title: { type: String },
        videoUrl: { type: String },
        milestoneIndex: { type: Number },
      },
    ],
    // Enhanced Milestones for "Real Work" tracking
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        completed: { type: Boolean, default: false },
        deliverables: [{ type: String }], // List of required files/links
        submissions: [
          {
            url: String,
            submittedAt: { type: Date, default: Date.now },
            message: String,
            feedback: String,
            status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
            aiReview: String
          }
        ],
        feedback: { type: String }, // General mentor feedback
        aiAnalysis: { type: String }, // AI summary of progress
      }
    ],
    documentation: {
      images: [String],
      videos: [String],
      links: [{ title: String, url: String }],
      inPersonNotes: String,
    },
    description: { type: String, required: true },
    submissionUrl: { type: String },
    mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date },
    endDate: { type: Date },
    skills: [String],
    parentProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    assessmentRubric: {
      criteria: [
        {
          name: { type: String },
          marks: { type: Number },
          achieved: { type: Boolean, default: false },
          feedback: { type: String }
        }
      ]
    }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
