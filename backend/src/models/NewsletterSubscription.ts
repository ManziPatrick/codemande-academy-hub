import mongoose from 'mongoose';

const newsletterSubscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

export const NewsletterSubscription = mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);
