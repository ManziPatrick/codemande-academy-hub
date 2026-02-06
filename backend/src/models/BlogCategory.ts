import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogCategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema);
