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
        const students = await User.find({ role: 'student' }).limit(5);

        if (!trainer) {
            console.error('❌ No trainer found');
            process.exit(1);
        }

        /**
         * COURSE
         */
        const courseData = {
            title: 'React JS: Practical Zero to Scale',
            description:
                'A hands-on React.js course focused on building real applications. No theory overload — you learn by building projects from day one.',
            instructor: trainer._id,
            price: 150000,
            discountPrice: 120000,
            category: 'Web Development',
            level: 'Beginner → Advanced',
            thumbnail:
                'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
            status: 'published',
            modules: [
                /**
                 * MODULE 1
                 */
                {
                    title: 'React Foundations (Build First)',
                    description: 'Learn React by building small components immediately.',
                    lessons: createRichLessons('Foundations', [
                        {
                            title: 'React Project Setup (Vite)',
                            description:
                                'Set up a modern React project using Vite and understand the folder structure.',
                            build: [
                                'Create a Vite + React project',
                                'Clean default files',
                                'Run development server',
                            ],
                            resources: [
                                {
                                    title: 'Vite Docs',
                                    url: 'https://vitejs.dev/guide/',
                                },
                            ],
                        },
                        {
                            title: 'Components & JSX',
                            description:
                                'Learn how to create reusable components and render dynamic UI using JSX.',
                            build: [
                                'Create Header, Footer, and Card components',
                                'Pass props to components',
                            ],
                            resources: [
                                {
                                    title: 'React Components',
                                    url: 'https://react.dev/learn/your-first-component',
                                },
                            ],
                        },
                        {
                            title: 'State & Events',
                            description:
                                'Learn how to handle user interaction using state and events.',
                            build: [
                                'Counter app',
                                'Toggle dark/light mode',
                            ],
                            isAssignment: true,
                            assignmentDescription:
                                'Build a counter with increment, decrement, and reset.',
                            assignmentDeliverables: ['GitHub Repository Link'],
                        },
                    ]),
                },

                /**
                 * MODULE 2
                 */
                {
                    title: 'Hooks & Data Handling',
                    description: 'Work with real data and side effects.',
                    lessons: createRichLessons('Hooks', [
                        {
                            title: 'useEffect & API Calls',
                            description:
                                'Fetch data from APIs and handle loading & error states.',
                            build: [
                                'Fetch users from public API',
                                'Display loading and error UI',
                            ],
                            resources: [
                                {
                                    title: 'JSONPlaceholder',
                                    url: 'https://jsonplaceholder.typicode.com/',
                                },
                            ],
                        },
                        {
                            title: 'Custom Hooks',
                            description:
                                'Create reusable logic using custom hooks.',
                            build: ['Create useFetch hook'],
                            isAssignment: true,
                            assignmentDescription:
                                'Create a reusable useFetch hook and document it.',
                            assignmentDeliverables: ['GitHub Link', 'README.md'],
                        },
                    ]),
                },

                /**
                 * MODULE 3
                 */
                {
                    title: 'Routing & State at Scale',
                    description:
                        'Build multi-page applications with global state.',
                    lessons: createRichLessons('Advanced', [
                        {
                            title: 'React Router',
                            description:
                                'Create multi-page navigation using React Router.',
                            build: [
                                'Home, About, Details pages',
                                'Dynamic routes',
                            ],
                            resources: [
                                {
                                    title: 'React Router Docs',
                                    url: 'https://reactrouter.com/en/main',
                                },
                            ],
                        },
                        {
                            title: 'Global State (Context / Zustand)',
                            description:
                                'Manage application-wide state cleanly.',
                            build: [
                                'Auth context',
                                'Theme context',
                            ],
                        },
                    ]),
                },
            ],
        };

        const course = await Course.findOneAndUpdate(
            { title: courseData.title },
            courseData,
            { upsert: true, new: true }
        );

        console.log('✅ Course created:', course.title);

        /**
         * PROJECTS (Progressive)
         */
        const projectTemplates = [
            {
                title: 'Mini Project: Star Wars Characters App',
                description:
                    'Build a React app that fetches and displays Star Wars characters using SWAPI.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        {
                            title: 'SWAPI',
                            url: 'https://swapi.dev/',
                        },
                        {
                            title: 'Starter Repo',
                            url: 'https://github.com/react-academy/starwars-starter',
                        },
                    ],
                },
            },
            {
                title: 'Personal Portfolio Website',
                description:
                    'Create a professional portfolio using React and animations.',
                course: course.title,
                type: 'Individual',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        {
                            title: 'Figma Design',
                            url: 'https://figma.com/file/react-portfolio-template',
                        },
                    ],
                },
            },
            {
                title: 'Capstone: Analytics Dashboard',
                description:
                    'A team-based dashboard with charts, authentication, and role-based access.',
                course: course.title,
                type: 'Team Project',
                status: 'in_progress',
                mentors: [trainer._id],
                documentation: {
                    links: [
                        {
                            title: 'API Docs',
                            url: 'https://api.react-academy.com',
                        },
                    ],
                },
            },
        ];

        // Clear existing projects for this course to avoid duplicates if re-running
        await Project.deleteMany({ course: course.title });

        for (const p of projectTemplates) {
            if (students.length > 0) {
                await new Project({
                    ...p,
                    userId: students[0]._id,
                    team:
                        p.type === 'Team Project'
                            ? students.map((s) => ({
                                userId: s._id,
                                name: s.username,
                                role: 'Developer',
                            }))
                            : [],
                }).save();
            }
        }

        console.log('🎉 React Course & Projects Seeded Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedReactCourse();
