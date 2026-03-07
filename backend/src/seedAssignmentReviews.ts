import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import { AssignmentSubmission } from './models/AssignmentSubmission';
import connectDB from './config/db';

dotenv.config();

const seedAssignmentReviews = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting Assignment Reviews Seeding...');

        // 1. Get or Create Trainer
        let trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            trainer = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });
        }
        
        if (!trainer) {
            console.error('❌ No trainer or admin found to assign courses to.');
            process.exit(1);
        }

        // 2. Get Students
        const students = await User.find({ role: 'student' }).limit(5);
        if (students.length < 3) {
            console.error('❌ Not enough students found. Please run seedSpecialCourses first.');
            process.exit(1);
        }

        // 3. Get Courses
        const courses = await Course.find({}).limit(3);
        if (courses.length === 0) {
            console.error('❌ No courses found. Please run seedSpecialCourses first.');
            process.exit(1);
        }

        // Ensure courses have an instructor
        for (const course of courses) {
            if (!course.instructor) {
                course.instructor = trainer._id;
                await course.save();
            }
        }

        console.log(`Using Trainer: ${trainer.fullName} (${trainer.role})`);
        console.log(`Seeding for ${courses.length} courses and ${students.length} students...`);

        // 4. Clear existing submissions to start fresh for these courses
        const courseIds = courses.map(c => c._id);
        await AssignmentSubmission.deleteMany({ courseId: { $in: courseIds } });

        const submissions = [];

        // Create a mix of Pending and Graded submissions
        for (let i = 0; i < courses.length; i++) {
            const course = courses[i];
            
            // Find a lesson that is an assignment or just pick the first one
            let lessonId = 'Lesson 1.1';
            const assignmentLesson = course.modules?.[0]?.lessons?.find((l: any) => l.isAssignment);
            if (assignmentLesson) {
                lessonId = assignmentLesson.title;
            }

            // Student 1: Pending Submission
            submissions.push({
                userId: students[0]._id,
                courseId: course._id,
                lessonId: lessonId,
                content: `https://github.com/${students[0].username}/assignment-${i+1}`,
                status: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * (i + 1) * 2) // staggered hours ago
            });

            // Student 2: Pending Submission (Another one)
            submissions.push({
                userId: students[1]._id,
                courseId: course._id,
                lessonId: lessonId,
                content: `I have completed the tasks for ${lessonId}. Here is my summary...`,
                status: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 1)) // staggered days ago
            });

            // Student 3: Graded Submission
            submissions.push({
                userId: students[2]._id,
                courseId: course._id,
                lessonId: lessonId,
                content: `https://github.com/${students[2].username}/completed-task`,
                status: 'reviewed',
                grade: 90 + i,
                feedback: `Excellent work on ${lessonId}! Your implementation of the core logic is very clean.`,
                gradedBy: trainer._id,
                gradedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
            });
            
            // Student 4: Another Graded Submission
            if (students[3]) {
                submissions.push({
                    userId: students[3]._id,
                    courseId: course._id,
                    lessonId: lessonId,
                    content: `Here is my project link: https://vercel.app/my-project-${i}`,
                    status: 'reviewed',
                    grade: 85 - i,
                    feedback: `Good effort. Consider optimizing the loop in module ${i+1}.`,
                    gradedBy: trainer._id,
                    gradedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
                });
            }
        }

        // Insert all submissions
        await AssignmentSubmission.insertMany(submissions);

        console.log(`✅ Successfully seeded ${submissions.length} assignment submissions!`);
        console.log(`- Pending: ${submissions.filter(s => s.status === 'pending').length}`);
        console.log(`- Graded: ${submissions.filter(s => s.status === 'reviewed').length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedAssignmentReviews();
