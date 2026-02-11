import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import connectDB from './config/db';

dotenv.config();

/**
 * Cleanup Script: Find and fix courses with null or invalid instructor references
 */
const cleanupCourses = async () => {
    try {
        await connectDB();
        console.log('🔍 Starting course cleanup...\n');

        // Find all courses
        const allCourses = await Course.find({});
        console.log(`📊 Total courses in database: ${allCourses.length}`);

        // Find courses with null instructors
        const coursesWithNullInstructor = await Course.find({ instructor: null });
        console.log(`❌ Courses with null instructor: ${coursesWithNullInstructor.length}`);

        if (coursesWithNullInstructor.length > 0) {
            console.log('\n📝 Courses with null instructor:');
            coursesWithNullInstructor.forEach((course: any) => {
                console.log(`   - ${course.title} (ID: ${course._id})`);
            });
        }

        // Find courses with invalid instructor references (instructor ID doesn't exist)
        const coursesWithInvalidInstructor = [];
        for (const course of allCourses) {
            if (course.instructor) {
                const instructorExists = await User.findById(course.instructor);
                if (!instructorExists) {
                    coursesWithInvalidInstructor.push(course);
                }
            }
        }

        console.log(`❌ Courses with invalid instructor reference: ${coursesWithInvalidInstructor.length}`);
        if (coursesWithInvalidInstructor.length > 0) {
            console.log('\n📝 Courses with invalid instructor reference:');
            coursesWithInvalidInstructor.forEach((course: any) => {
                console.log(`   - ${course.title} (ID: ${course._id}, Instructor ID: ${course.instructor})`);
            });
        }

        // Get a valid trainer to assign as default
        const defaultTrainer = await User.findOne({ role: 'trainer' });
        if (!defaultTrainer) {
            console.error('\n❌ No trainer found in database. Cannot fix courses.');
            console.log('💡 Please run seed script to create users first.');
            process.exit(1);
        }

        console.log(`\n✅ Default trainer found: ${defaultTrainer.username} (${defaultTrainer._id})`);

        // Fix courses with null or invalid instructors
        const coursesToFix = [...coursesWithNullInstructor, ...coursesWithInvalidInstructor];

        if (coursesToFix.length > 0) {
            console.log(`\n🔧 Fixing ${coursesToFix.length} courses...`);

            for (const course of coursesToFix) {
                await Course.findByIdAndUpdate(course._id, {
                    instructor: defaultTrainer._id
                });
                console.log(`   ✓ Fixed: ${course.title}`);
            }

            console.log('\n✨ All courses fixed successfully!');
        } else {
            console.log('\n✨ No courses need fixing. All courses have valid instructors!');
        }

        // Verify the fix
        const remainingNullCourses = await Course.find({ instructor: null });
        console.log(`\n📊 Final verification:`);
        console.log(`   - Courses with null instructor: ${remainingNullCourses.length}`);
        console.log(`   - Total courses: ${(await Course.find({})).length}`);

        if (remainingNullCourses.length === 0) {
            console.log('\n🎉 SUCCESS! All courses now have valid instructors.');
        } else {
            console.log('\n⚠️  WARNING: Some courses still have null instructors.');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
};

cleanupCourses();
