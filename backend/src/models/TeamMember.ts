import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
    name: string;
    role: string;
    bio: string;
    image: string;
    linkedin: string;
    twitter: string;
    github: string;
    createdAt: Date;
    updatedAt: Date;
}

const TeamMemberSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String },
    image: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
}, { timestamps: true });

export default mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
