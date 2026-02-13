import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from './models/Course';
import connectDB from './config/db';

dotenv.config();

const deleteOldCourses = async () => {
    try {
        await connectDB();
        console.log('\n📦 CONNECTED TO DATABASE\n');

        // Delete all courses EXCEPT the React.js and Node.js courses
        const coursesToKeep = [
            'Complete React.js Mastery: From Zero to Expert',
            'Node.js & Express: Build Scalable Backend APIs'
        ];

        const result = await Course.deleteMany({
            title: { $nin: coursesToKeep }
        });

        console.log(`✅ Deleted ${result.deletedCount} old courses`);
        console.log('\nRemaining courses should be:');
        console.log('- Complete React.js Mastery: From Zero to Expert');
        console.log('- Node.js & Express: Build Scalable Backend APIs');

        // Verify remaining courses
        const remainingCourses = await Course.find({}, 'title');
        console.log('\n📚 Current courses in database:');
        remainingCourses.forEach((course, index) => {
            console.log(`${index + 1}. ${course.title}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

deleteOldCourses();
