import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipProject extends Document {
  internshipProgramId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSizeRange: {
    min: number;
    max: number;
  };
  status: 'draft' | 'published' | 'archived';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipProjectSchema: Schema = new Schema(
  {
    internshipProgramId: { type: Schema.Types.ObjectId, ref: 'InternshipProgram', required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
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
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipProject = mongoose.model<IInternshipProject>('InternshipProject', InternshipProjectSchema);
