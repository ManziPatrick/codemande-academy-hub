import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'ppt', 'book', 'image', 'video', 'link', 'zip'], required: true },
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Markdown content or description
  videoUrl: { type: String }, // URL to video resource
  fileUrl: { type: String }, // URL to primary file resource (PDF, PPT, etc)
  duration: { type: Number }, // in minutes
  type: { type: String, enum: ['video', 'book', 'ppt', 'pdf', 'image', 'article', 'quiz', 'challenge', 'project'], default: 'video' },
  resources: [resourceSchema]
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, default: 0 },
  discountPrice: { type: Number },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  category: { type: String, required: true },
  modules: [moduleSchema],
  studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Configuration & limits
  maxStudents: { type: Number }, // If null, unlimited
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const Course = mongoose.model('Course', courseSchema);
