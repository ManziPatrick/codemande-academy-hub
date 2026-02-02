import mongoose from 'mongoose';
import connectDB from './config/db';
import { Course } from './models/Course';
import { User } from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const verifyCourses = async () => {
    await connectDB();
    const courses = await Course.find({}).populate('instructor');
    console.log(`Found ${courses.length} courses`);
    courses.forEach(c => {
        console.log(`- ${c.title} (${c.status}) modules: ${c.modules.length}`);
        c.modules.forEach(m => {
            console.log(`  - Module: ${m.title} lessons: ${m.lessons.length}`);
        });
    });
    process.exit(0);
};

verifyCourses();
