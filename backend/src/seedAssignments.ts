import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import { AssignmentSubmission } from './models/AssignmentSubmission';
import connectDB from './config/db';

dotenv.config();

const seedAssignments = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting Assignment Submissions Seeding...');

        const students = await User.find({ role: 'student' }).limit(3);
        const course = await Course.findOne({ title: 'React JS: Practical Zero to Scale' });

        if (students.length === 0 || !course) {
            console.error('❌ Missing students or course. Run seedReactCourse first.');
            process.exit(1);
        }

        // Find a lesson that is an assignment
        let assignmentLessonId = 'lesson-1'; // Default backup
        let assignmentLessonTitle = 'React Assignment';

        for (const module of course.modules) {
            const assignment = module.lessons.find((l: any) => l.isAssignment);
            if (assignment) {
                // In a real app we'd have stable IDs, but here we might use title or index
                // For this seed, we'll just mock it or use the title as ID if the schema permits
                // The schema expects lessonId as String.
                assignmentLessonId = assignment.title;
                assignmentLessonTitle = assignment.title;
                break;
            }
        }

        console.log(`Found assignment lesson: ${assignmentLessonTitle}`);

        const submissions = [
            {
                userId: students[0]._id,
                courseId: course._id,
                lessonId: assignmentLessonTitle,
                content: 'https://github.com/student1/react-counter-app',
                status: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
            },
            {
                userId: students[1]._id,
                courseId: course._id,
                lessonId: assignmentLessonTitle,
                content: 'Here is my submission: https://github.com/student2/counter-app. I added extra animations!',
                status: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
            },
            {
                userId: students[2]._id,
                courseId: course._id,
                lessonId: assignmentLessonTitle,
                content: 'https://github.com/student3/react-assignment',
                status: 'reviewed',
                grade: 85,
                feedback: 'Good work, but clean up the useEffect dependency array.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
            }
        ];

        await AssignmentSubmission.deleteMany({ courseId: course._id });

        for (const sub of submissions) {
            await new AssignmentSubmission(sub).save();
        }

        console.log(`✅ Seeded ${submissions.length} assignment submissions.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedAssignments();
