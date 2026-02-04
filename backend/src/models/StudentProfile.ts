import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  school: string;
  educationLevel: 'high_school' | 'undergraduate' | 'graduate' | 'postgraduate' | 'other';
  fieldOfStudy: string;
  skills: string[];
  availability: 'full_time' | 'part_time' | 'weekends' | 'flexible';
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  completionPercentage: number;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    school: {
      type: String,
      required: true,
      trim: true
    },
    educationLevel: {
      type: String,
      enum: ['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other'],
      required: true
    },
    fieldOfStudy: {
      type: String,
      required: true,
      trim: true
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one skill is required'
      }
    },
    availability: {
      type: String,
      enum: ['full_time', 'part_time', 'weekends', 'flexible'],
      required: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    githubUrl: {
      type: String,
      trim: true
    },
    portfolioUrl: {
      type: String,
      trim: true
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Calculate completion percentage before saving
StudentProfileSchema.pre('save', async function() {
  const profile = this as unknown as IStudentProfile;
  
  const requiredFields = ['school', 'educationLevel', 'fieldOfStudy', 'skills', 'availability'];
  const optionalFields = ['bio', 'linkedinUrl', 'githubUrl', 'portfolioUrl'];
  
  let filledRequired = 0;
  let filledOptional = 0;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (profile[field as keyof IStudentProfile]) {
      if (field === 'skills' && Array.isArray(profile.skills) && profile.skills.length > 0) {
        filledRequired++;
      } else if (field !== 'skills') {
        filledRequired++;
      }
    }
  });
  
  // Check optional fields
  optionalFields.forEach(field => {
    if (profile[field as keyof IStudentProfile]) {
      filledOptional++;
    }
  });
  
  // Required fields are 70% weight, optional are 30%
  const requiredPercentage = (filledRequired / requiredFields.length) * 70;
  const optionalPercentage = (filledOptional / optionalFields.length) * 30;
  
  profile.completionPercentage = Math.round(requiredPercentage + optionalPercentage);
  profile.isComplete = filledRequired === requiredFields.length;
});

// Index for faster queries
StudentProfileSchema.index({ userId: 1 });
StudentProfileSchema.index({ isComplete: 1 });

export const StudentProfile = mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
