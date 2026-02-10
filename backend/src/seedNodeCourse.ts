import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import { Project } from './models/Project';
import connectDB from './config/db';

dotenv.config();

/**
 * Helper to generate rich, practical lessons
 */
const createRichLessons = (moduleTitle: string, baseLessons: any[]) => {
    return baseLessons.map((l) => ({
        title: l.title,
        content: `
<div class="space-y-6">
  <section>
    <h2 class="text-2xl font-bold text-accent mb-4">${l.title}</h2>
    <p class="text-lg leading-relaxed">
      ${l.description}
    </p>
  </section>

  <section class="bg-card p-6 rounded-xl border border-border/50">
    <h3 class="text-xl font-semibold mb-3">Technical Implementation</h3>
    <ul class="list-disc ml-6 space-y-2">
      ${(l.build || []).map((b: string) => `<li>${b}</li>`).join('')}
    </ul>
  </section>

  <section class="bg-muted p-6 rounded-xl">
    <h3 class="text-xl font-semibold mb-3">Professional Resources</h3>
    <ul class="list-disc ml-6 space-y-2">
      ${(l.resources || []).map(
            (r: any) =>
                `<li><a class="text-blue-500 underline" href="${r.url}" target="_blank">${r.title}</a></li>`
        ).join('')}
    </ul>
  </section>
</div>
    `,
        duration: l.duration || 45,
        type: l.type || 'video',
        videoUrl: l.videoUrl || 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        isAssignment: !!l.isAssignment,
        assignmentDescription: l.assignmentDescription || '',
        assignmentDeliverables: l.assignmentDeliverables || [],
    }));
};

const seedNodeCourse = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting Node.js Course Seeding...');

        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            console.error('❌ No trainer found');
            process.exit(1);
        }

        /**
         * COURSE: Node.js & Backend Engineering – Real Systems
         */
        const courseData = {
            title: 'Node.js & Backend Engineering – Real Systems',
            description:
                'Deep dive into scalable backend engineering. Learn to build production-ready APIs, handle authentication, manage databases with Mongoose, and implement real-time features. This course focuses on building robust systems that can handle real users and complex business logic.',
            instructor: trainer._id,
            price: 10000,
            discountPrice: 10000,
            category: 'Backend Development',
            level: 'Intermediate',
            thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2074&auto=format&fit=crop',
            status: 'published',
            modules: [
                {
                    title: 'Module 1: Node.js & Express Architecture',
                    description: 'Understanding the event loop and structuring professional Express applications.',
                    lessons: createRichLessons('Foundations', [
                        {
                            title: 'The Node.js Event Loop',
                            description: 'How Node.js handles concurrency and high-load without threads.',
                            build: ['Non-blocking I/O demo', 'Custom EventEmitters'],
                            resources: [{ title: 'Node.js Architecture', url: 'https://nodejs.org/en/about' }]
                        },
                        {
                            title: 'Express Setup & Scalable Folder Structure',
                            description: 'Structuring your code for growth using controllers, routes, and services.',
                            build: ['Clean Express API boilerplates', 'Global error handled middleware'],
                            resources: [{ title: 'Express Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-performance.html' }]
                        }
                    ])
                },
                {
                    title: 'Module 2: Database Modeling (MongoDB & Mongoose)',
                    description: 'Designing schemas that work in production.',
                    lessons: createRichLessons('Database', [
                        {
                            title: 'Mongoose Schemas & Relationships',
                            description: 'Defining models, validations, and references.',
                            build: ['User Profile Schema', 'Relationship embedding vs referencing'],
                            resources: [{ title: 'Mongoose Guide', url: 'https://mongoosejs.com/docs/guide.html' }]
                        },
                        {
                            title: 'Advanced Querying & Aggregation',
                            description: 'Calculating metrics and filtering data at scale.',
                            build: ['Product analytics pipeline', 'Search index implementation'],
                            isAssignment: true,
                            assignmentDescription: 'Create a complex Mongoose aggregation for a financial report.',
                            assignmentDeliverables: ['GitHub Link', 'reportService.ts']
                        }
                    ])
                },
                {
                    title: 'Module 3: Authentication & Authorization (RBAC)',
                    description: 'Securing your system with JWT and Role-Based Access Control.',
                    lessons: createRichLessons('Security', [
                        {
                            title: 'JWT Flow & Password Hashing',
                            description: 'Implementing secure login with Argon2 and JSON Web Tokens.',
                            build: ['Auth middleware', 'Refresh token rotation system'],
                            resources: [{ title: 'JWT Intro', url: 'https://jwt.io/introduction/' }]
                        },
                        {
                            title: 'Role-Based Access Control',
                            description: 'Enforcing permissions for Admins, Mentors, and Users.',
                            build: ['Permission checking middleware', 'Protected route guards'],
                            isAssignment: true,
                            assignmentDescription: 'Implement a multifactor authentication flow (simulation).',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 4: Real-time Communication (WebSockets)',
                    description: 'Building interactive applications with Socket.io.',
                    lessons: createRichLessons('Real-time', [
                        {
                            title: 'Socket.io Integration',
                            description: 'Broadcasting messages and managing room state.',
                            build: ['Notification server', 'Live typing indicator system'],
                            resources: [{ title: 'Socket.io Docs', url: 'https://socket.io/docs/v4/' }]
                        },
                        {
                            title: 'Mini Project: Real-Time Chat Backend',
                            description: 'Complete backend for a chat application with message persistence.',
                            build: ['Private messaging', 'Room management', 'Message history storage'],
                            isAssignment: true,
                            assignmentDescription: 'Build a private chat feature with status online/offline indicators.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 5: Payments & File Uploads',
                    description: 'Integrating external services (Simulation).',
                    lessons: createRichLessons('Services', [
                        {
                            title: 'Payment Gateway Integration (Stripe Simulation)',
                            description: 'Handling webhooks and transaction states.',
                            build: ['Payment intent creator', 'Webhook listener system'],
                            resources: [{ title: 'Stripe API Docs', url: 'https://stripe.com/docs/api' }]
                        },
                        {
                            title: 'Cloudinary File Uploads',
                            description: 'Handling images and PDFs using Multer and Cloudinary.',
                            build: ['Image processing middleware', 'Secure upload service'],
                            isAssignment: true,
                            assignmentDescription: 'Build an endpoint that accepts a PDF and returns a signed URL.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                }
            ]
        };

        const course = await Course.findOneAndUpdate(
            { title: courseData.title },
            courseData,
            { upsert: true, new: true }
        );

        console.log('✅ Node.js Course created:', course.title);

        /**
         * PROJECTS
         */
        const projectTemplates = [
            {
                title: 'Real-Time Chat Backend',
                description: 'A scalable WebSocket server with persistent message storage and user presence tracking.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' }
                    ]
                }
            },
            {
                title: 'Admin Dashboard API',
                description: 'A robust REST API with RBAC, audit logs, and analytics aggregation.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' }
                    ]
                }
            },
            {
                title: 'Payment-ready API (E-commerce Backend)',
                description: 'An API for a store with inventory management, cart logic, and Stripe-simulated payments.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' }
                    ]
                }
            }
        ];

        await Project.deleteMany({ course: course.title });

        for (const p of projectTemplates) {
            await new Project({
                ...p,
                userId: trainer._id
            }).save();
        }

        console.log('🎉 Node.js Course & Projects Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedNodeCourse();
