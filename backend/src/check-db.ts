
import mongoose from 'mongoose';
import { Course } from './models/Course';
import { InternshipProgram } from './models/internship/InternshipProgram';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkCounts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const coursesCount = await Course.countDocuments({ isDeleted: false });
    const internshipProgramsCount = await InternshipProgram.countDocuments({ isDeleted: false });
    
    console.log('--- DATABASE COUNTS ---');
    console.log('Standard Courses:', coursesCount);
    console.log('Internship Programs:', internshipProgramsCount);
    
    if (coursesCount > 0) {
      const courses = await Course.find({ isDeleted: false }).limit(5);
      console.log('Sample Courses:', courses.map(c => c.title));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkCounts();
