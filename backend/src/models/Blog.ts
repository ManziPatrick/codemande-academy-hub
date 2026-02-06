import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
    user: mongoose.Types.ObjectId;
    userName: string;
    content: string;
    createdAt: Date;
}

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    author: mongoose.Types.ObjectId;
    authorName: string;
    category: 'Rwanda Tech' | 'Future Tech' | 'Business';
    tags: string[];
    image: string;
    likes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'BlogCategory', required: true },
    tags: [{ type: String }],
    image: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema]
}, { timestamps: true });

// Index for faster searching
BlogSchema.index({ title: 'text', content: 'text', category: 'text' });

export default mongoose.model<IBlog>('Blog', BlogSchema);
