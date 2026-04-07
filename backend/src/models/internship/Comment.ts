import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipComment extends Document {
  taskId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  attachments?: Array<{ name: string; url: string }>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipCommentSchema: Schema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'InternshipTask', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    attachments: [
      {
        name: { type: String },
        url: { type: String }
      }
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const InternshipComment = mongoose.model<IInternshipComment>('InternshipComment', InternshipCommentSchema);
