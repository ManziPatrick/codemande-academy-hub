import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
}, { timestamps: true });

// Index for efficient querying of user notifications
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
