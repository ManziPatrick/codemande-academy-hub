import cron from 'node-cron';
import { Internship } from '../models/Internship';
import { Project } from '../models/Project';
import { Booking } from '../models/Booking';
import { CourseProgress } from '../models/CourseProgress';
import { Certificate } from '../models/Certificate';
import { Course } from '../models/Course';

export const initKronos = () => {
    console.log('⏳ Initializing Cron Jobs...');

    // 1. Event Reminders (Daily at 8 AM)
    cron.schedule('0 8 * * *', async () => {
        console.log('Running Event Reminder Job...');
        // Logic to find bookings for tomorrow would go here
    });

    // 2. Deadline Alerts (Daily at 9 AM)
    cron.schedule('0 9 * * *', async () => {
        console.log('Running Deadline Alert Job...');
        // Check for projects due in 3 days
    });

    // 3. Payment Reminders (Weekly on Monday at 10 AM)
    cron.schedule('0 10 * * 1', async () => {
        console.log('Running Payment Reminder Job...');
        // Check internships with status 'enrolled' but payment 'pending'
    });

    // 4. Certificate Auto-Issuance (Hourly)
    // Automatically issues certificates when CourseProgress reaches 100%
    cron.schedule('0 * * * *', async () => {
        try {
            const completedProgress = await CourseProgress.find({
                overallProgress: 100,
                status: { $ne: 'completed' }
            });

            for (const progress of completedProgress) {
                // Check if cert already exists
                const certExists = await Certificate.findOne({
                    userId: progress.userId,
                    courseId: progress.courseId
                });

                if (!certExists) {
                    const course = await Course.findById(progress.courseId);
                    if (course) {
                        await Certificate.create({
                            userId: progress.userId,
                            courseId: progress.courseId,
                            courseTitle: course.title,
                            issueDate: new Date(),
                            status: 'issued',
                            progress: 100,
                            credentialId: `CERT-${Date.now()}-${progress.userId.toString().slice(-4)}`
                        });
                        console.log(`Issued Certificate for User ${progress.userId} in Course ${progress.courseId}`);
                    }
                }

                // Mark progress as formally completed
                progress.status = 'completed';
                progress.completionDate = new Date();
                await progress.save();
            }
        } catch (e) {
            console.error('Error in Certificate Job:', e);
        }
    });
};
