import mongoose, { Schema, Document } from 'mongoose';

export interface IAICourse extends Document {
    title: string;
    department: string;
    duration: string;
    level: string;
    description: string;
    thumbnail: string;
    price: number;
    instructor: mongoose.Types.ObjectId;
    modules: {
        title: string;
        description?: string;
        lessons: {
            title: string;
            content?: string;
            videoUrl?: string;
            fileUrl?: string;
            duration: number;
            type: string;
        }[];
    }[];
    keyModules: string[];
    additionalModulesCount: number;
    slug: string;
    featured: boolean;
    enrollmentLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const AICourseSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: [
            'GENERAL',
            'HEALTHCARE',
            'FINANCE',
            'EDUCATION',
            'MARKETING',
            'MANUFACTURING',
            'HR',
            'CYBERSECURITY'
        ]
    },
    duration: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Intermediate']
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modules: [{
        title: { type: String, required: true },
        description: { type: String },
        lessons: [{
            title: { type: String, required: true },
            content: { type: String },
            videoUrl: { type: String },
            fileUrl: { type: String },
            duration: { type: Number, required: true },
            type: { type: String, required: true }
        }]
    }],
    keyModules: [{
        type: String,
        required: true
    }],
    additionalModulesCount: {
        type: Number,
        default: 4
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    enrollmentLink: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model<IAICourse>('AICourse', AICourseSchema);
