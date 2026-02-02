import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  topic: { type: String },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  meetingLink: { type: String },
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
