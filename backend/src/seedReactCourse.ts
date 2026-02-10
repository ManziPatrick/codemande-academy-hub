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
    <h3 class="text-xl font-semibold mb-3">What You Will Build</h3>
    <ul class="list-disc ml-6 space-y-2">
      ${(l.build || []).map((b: string) => `<li>${b}</li>`).join('')}
    </ul>
  </section>

  <section class="bg-muted p-6 rounded-xl">
    <h3 class="text-xl font-semibold mb-3">Resources</h3>
    <ul class="list-disc ml-6 space-y-2">
      ${(l.resources || []).map(
            (r: any) =>
                `<li><a class="text-blue-500 underline" href="${r.url}" target="_blank">${r.title}</a></li>`
        ).join('')}
    </ul>
  </section>
</div>
    `,
        duration: l.duration || 30,
        type: l.type || 'video',
        videoUrl:
            l.type === 'video'
                ? l.videoUrl || 'https://www.youtube.com/watch?v=w7ejDZ8SWv8'
                : null,
        isAssignment: !!l.isAssignment,
        assignmentDescription: l.assignmentDescription || '',
        assignmentDeliverables: l.assignmentDeliverables || [],
    }));
};

const seedReactCourse = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting React Course Seeding...');

        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            console.error('❌ No trainer found');
            process.exit(1);
        }

        /**
         * COURSE: React JS – Practical Frontend Engineering
         */
        const courseData = {
            title: 'React JS – Practical Frontend Engineering',
            description:
                'Master React JS by building production-grade interfaces. This course is 80% practical, moving from fundamentals to advanced state management and performance optimization. You will build cloneable, portfolio-ready projects that simulate real-world engineering tasks.',
            instructor: trainer._id,
            price: 0,
            discountPrice: 0,
            category: 'Web Development',
            level: 'Beginner',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
            status: 'published',
            modules: [
                {
                    title: 'Module 1: Fundamentals (Components, JSX, Props, State)',
                    description: 'The building blocks of React. Understand how to think in components and manage local data.',
                    lessons: createRichLessons('Fundamentals', [
                        {
                            title: 'The Component Architecture',
                            description: 'Learn why React uses components and how to break down a UI into reusable pieces.',
                            build: ['Button component', 'Card component', 'Nav bar layout'],
                            resources: [{ title: 'Thinking in React', url: 'https://react.dev/learn/thinking-in-react' }]
                        },
                        {
                            title: 'JSX and Dynamic Rendering',
                            description: 'Master JSX syntax and how to render lists and conditional content.',
                            build: ['Dynamic user list', 'Conditional alert system'],
                            resources: [{ title: 'Writing Markup with JSX', url: 'https://react.dev/learn/writing-markup-with-jsx' }]
                        },
                        {
                            title: 'Mini Project: Invoice Generator (UI)',
                            description: 'Build the structure of an invoice generator using props and basic state.',
                            build: ['Invoice header', 'Line items table', 'Total calculator'],
                            isAssignment: true,
                            assignmentDescription: 'Create a reusable Invoice Table component that accepts an array of items via props.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 2: Hooks (useState, useEffect, Custom Hooks)',
                    description: 'Logic and side effects. Learn how to handle component lifecycles and reuse logic.',
                    lessons: createRichLessons('Hooks', [
                        {
                            title: 'State Management with useState',
                            description: 'Deep dive into complex state objects and functional updates.',
                            build: ['Multi-step form state', 'Toggleable sidebar'],
                            resources: [{ title: 'useState Hook', url: 'https://react.dev/reference/react/useState' }]
                        },
                        {
                            title: 'Side Effects with useEffect',
                            description: 'Handling data fetching, subscriptions, and manual DOM changes.',
                            build: ['Live clock component', 'Window resize listener'],
                            resources: [{ title: 'useEffect Hook', url: 'https://react.dev/reference/react/useEffect' }]
                        },
                        {
                            title: 'Mini Project: Crypto Tracker',
                            description: 'Fetch live cryptocurrency prices and display them in a dashboard.',
                            build: ['Live price feed', 'Search/Filter coins', 'Refresh mechanism'],
                            isAssignment: true,
                            assignmentDescription: 'Implement a custom useCrypto hook to fetch and cache coin data.',
                            assignmentDeliverables: ['GitHub Repository Link', 'useCrypto.js file']
                        }
                    ])
                },
                {
                    title: 'Module 3: Routing & Navigation',
                    description: 'Building multi-page applications with React Router.',
                    lessons: createRichLessons('Routing', [
                        {
                            title: 'React Router Setup',
                            description: 'Configuring CreateBrowserRouter and dynamic routes.',
                            build: ['App navigation shell', 'Dynamic user profiles'],
                            resources: [{ title: 'React Router Docs', url: 'https://reactrouter.com/' }]
                        },
                        {
                            title: 'Mini Project: Hotel Room Booking System',
                            description: 'Build a multi-page booking platform with route guards.',
                            build: ['Room listings page', 'Booking details page', 'Protected checkout'],
                            isAssignment: true,
                            assignmentDescription: 'Implement a search feature that updates URL query parameters.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 4: Forms & Validation',
                    description: 'Handling user input professionally with React Hook Form and Zod.',
                    lessons: createRichLessons('Forms', [
                        {
                            title: 'Controlled vs Uncontrolled Components',
                            description: 'Understanding manual form handling vs libraries.',
                            build: ['Basic contact form', 'Form status indicators']
                        },
                        {
                            title: 'Validation with Zod',
                            description: 'Defining schemas and handling errors gracefully.',
                            build: ['Secure login form', 'Complex registration flow'],
                            isAssignment: true,
                            assignmentDescription: 'Build a registration form with password strength validation.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 5: API Integration & Data Fetching',
                    description: 'Connecting to backends using Axios and TanStack Query.',
                    lessons: createRichLessons('API', [
                        {
                            title: 'Axios Configuration',
                            description: 'Setting up interceptors and base instances.',
                            build: ['Global API client', 'Error handling wrapper']
                        },
                        {
                            title: 'Mini Project: News Application with Voice Control',
                            description: 'Integrate a news API and add voice navigation features.',
                            build: ['News grid', 'Alan AI integration', 'Category filters'],
                            isAssignment: true,
                            assignmentDescription: 'Connect your app to the NewsAPI and implement pagination.',
                            assignmentDeliverables: ['GitHub Repository Link']
                        }
                    ])
                },
                {
                    title: 'Module 6: State Management (Zustand & Context)',
                    description: 'Managing global state without the boilerplate of Redux.',
                    lessons: createRichLessons('State', [
                        {
                            title: 'Global State with Zustand',
                            description: 'Centralizing app-wide data efficiently.',
                            build: ['Cart state for E-commerce', 'User auth store']
                        },
                        {
                            title: 'Mini Project: Real-time Chat Application',
                            description: 'Build a chat UI that updates instantly using global state.',
                            build: ['Message feed', 'Online users list', 'Settings toggle'],
                            isAssignment: true,
                            assignmentDescription: 'Create a Zustand store to manage chat messages and room state.',
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

        console.log('✅ React Course created:', course.title);

        /**
         * PROJECTS
         */
        const projectTemplates = [
            {
                title: 'Real-time Chat Application',
                description: 'A production-ready chat interface with room management and instant messaging UI.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' },
                        { title: 'Zustand Docs', url: 'https://docs.pmnd.rs/zustand' }
                    ]
                }
            },
            {
                title: 'News Application with Voice Control',
                description: 'Modern news aggregator with voice command integration for hands-free browsing.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' },
                        { title: 'Alan AI Docs', url: 'https://alan.app/docs/' }
                    ]
                }
            },
            {
                title: 'Corona Tracker Dashboard',
                description: 'A data-heavy dashboard with charts and maps visualizing global health data.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        { title: 'Project Overview', url: 'https://classroom.github.com/a/9fCNLdqc' },
                        { title: 'Chart.js Docs', url: 'https://www.chartjs.org/' }
                    ]
                }
            }
        ];

        await Project.deleteMany({ course: course.title });

        for (const p of projectTemplates) {
            await new Project({
                ...p,
                userId: trainer._id // Template projects assigned to trainer initially
            }).save();
        }

        console.log('🎉 React Course & Projects Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedReactCourse();
