import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import { Project } from './models/Project';
import connectDB from './config/db';

dotenv.config();

/**
 * PRODUCTION-GRADE COURSE CONTENT TEMPLATE
 */
const renderRichContent = (title: string, desc: string, items: string[], practice: string, resources: { name: string, url: string }[]) => {
    return `
<div class="space-y-8">
  <section class="prose dark:prose-invert max-w-none">
    <h2 class="text-3xl font-bold text-accent mb-4">${title}</h2>
    <p class="text-lg leading-relaxed text-muted-foreground">
      ${desc}
    </p>
  </section>

  <section class="grid md:grid-cols-2 gap-6">
    <div class="bg-card/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm">
      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <span class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">🎯</span>
        Core Objectives
      </h3>
      <ul class="space-y-3">
        ${items.map(i => `<li class="flex items-start gap-3 text-sm"><span class="text-accent mt-1">✓</span> ${i}</li>`).join('')}
      </ul>
    </div>
    
    <div class="bg-accent/5 p-6 rounded-2xl border border-accent/20">
      <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
        <span class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-sm">🛠️</span>
        Practical Exercise
      </h3>
      <p class="text-sm leading-relaxed mb-4">
        ${practice}
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold uppercase text-accent">Hands-on</span>
        <span class="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-bold uppercase text-accent">Review Required</span>
      </div>
    </div>
  </section>

  <section class="bg-muted/30 p-6 rounded-2xl border border-border/50">
    <h3 class="text-xl font-semibold mb-4">Mastery Resources</h3>
    <div class="grid sm:grid-cols-2 gap-4">
      ${resources.map(r => `
        <a href="${r.url}" target="_blank" class="flex items-center justify-between p-3 bg-card border border-border/50 rounded-xl hover:border-accent/50 transition-colors group">
          <span class="text-sm font-medium group-hover:text-accent transition-colors">${r.name}</span>
          <span class="text-xs text-muted-foreground">Open Link ↗</span>
        </a>
      `).join('')}
    </div>
  </section>
</div>
    `;
};

const seedSpecialCourses = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting High-Fidelity Seeding...');

        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            console.error('❌ No trainer found. Seed users first!');
            process.exit(1);
        }

        const coursesData = [
            {
                title: 'React JS – Practical Frontend Engineering',
                description: 'The definitive guide to modern frontend engineering with React. Master hooks, state management, performance optimization, and professional design patterns. This course is 100% project-based, building industry-standard applications.',
                instructor: trainer._id,
                price: 0,
                category: 'Web Development',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: The React Mental Model',
                        description: 'Understanding how React really works under the hood.',
                        lessons: [
                            {
                                title: 'Declarative UI & The Reconciliation Process',
                                duration: 45,
                                type: 'video',
                                content: renderRichContent(
                                    'Thinking in React',
                                    'Move beyond imperative jQuery-style coding. Learn how React efficiently updates the DOM using the Fiber architecture and synthetic events.',
                                    ['V-DOM vs Shadow DOM vs Real DOM', 'The reconciliation algorithm (Diffing)', 'Key props and their role in performance'],
                                    'Convert a complex imperative JS "To-Do List" with 50+ manual DOM manipulations into a clean, declarative React component.',
                                    [{ name: 'React.dev: Thinking in React', url: 'https://react.dev/learn/thinking-in-react' }]
                                )
                            },
                            {
                                title: 'Advanced Hooks: Beyond useState',
                                duration: 60,
                                type: 'video',
                                content: renderRichContent(
                                    'State & Side Effects Mastery',
                                    'Master useMemo, useCallback, and useRef to prevent unnecessary re-renders in large applications.',
                                    ['Dependency array best practices', 'Memoization for expensive calculations', 'Escaping the React model with useRef'],
                                    'Optimize a data-heavy dashboard grid that currently lags on every keystroke using useMemo and memo components.',
                                    [{ name: 'React Hooks API Reference', url: 'https://react.dev/reference/react' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Professional State & Routing',
                        description: 'Building multi-page applications with clean global state.',
                        lessons: [
                            {
                                title: 'Context API vs Zustand for Global State',
                                duration: 55,
                                type: 'video',
                                content: renderRichContent(
                                    'Architecting State Management',
                                    'Learn when to use the native Context API and when to reach for external libraries like Zustand for high-performance state.',
                                    ['Avoiding the Context re-render trap', 'Slices and actions pattern in Zustand', 'Hydration and persistence'],
                                    'Build a "Dark Mode" and "User Profile" system that persists across sessions without any global prop drilling.',
                                    [{ name: 'Zustand Docs', url: 'https://docs.pmnd.rs/zustand' }]
                                )
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Node.js & Backend Engineering – Real Systems',
                description: 'Build scalable, secure, and production-ready backends. Master the Node.js event loop, asynchronous patterns, and enterprise-grade architecture using Express, MongoDB, and professional middleware.',
                instructor: trainer._id,
                price: 10000,
                category: 'Backend Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: The Node.js Engine',
                        description: 'Mastering the environment that powers the modern web.',
                        lessons: [
                            {
                                title: 'Event Loop & Non-Blocking I/O',
                                duration: 50,
                                type: 'video',
                                content: renderRichContent(
                                    'Understanding Node Concurrency',
                                    'Deep dive into the libuv event loop, phases (Timers, Poll, Check), and how Node handles thousands of concurrent connections.',
                                    ['Microtasks vs Macrotasks', 'Thread Pool management', 'Common blocking pitfalls and how to avoid them'],
                                    'Write a script that benchmarks different I/O strategies and proves why blocking the event loop kills performance.',
                                    [{ name: 'Node.js Event Loop Guide', url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/' }]
                                )
                            },
                            {
                                title: 'Professional Error Handling & Logging',
                                duration: 40,
                                type: 'video',
                                content: renderRichContent(
                                    'Resilient Backend Systems',
                                    'Move beyond console.log. Implement production-grade logging with Winston and global error boundaries.',
                                    ['Centralized error handling middleware', 'Graceful shutdowns', 'Structured logging for monitoring'],
                                    'Implement a "Global Error Interceptor" that logs all unhandled exceptions to a file and sends a clean JSON response to the user.',
                                    [{ name: 'Winston Logger', url: 'https://github.com/winstonjs/winston' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Database & Security',
                        description: 'Building robust data layers and securing your API.',
                        lessons: [
                            {
                                title: 'Advanced Mongoose: Aggregations & Hooks',
                                duration: 75,
                                type: 'video',
                                content: renderRichContent(
                                    'Data Engineering with Mongoose',
                                    'Master the Aggregation pipeline for complex reporting and use Mongoose Middleware (Hooks) for automation.',
                                    ['Complex $group and $lookup stages', 'Pre and Post save hooks for data normalization', 'Virtuals and Population'],
                                    'Create a specialized "Analytics Dashboard" endpoint that computes average student progress using Mongoose Aggregations.',
                                    [{ name: 'Mongoose Aggregation Docs', url: 'https://mongoosejs.com/docs/aggregations.html' }]
                                )
                            }
                        ]
                    }
                ]
            }
        ];

        // Fully wipe existing courses and their projects to ensure NO legacy hardcoded seeds remain
        await Course.deleteMany({});
        await Project.deleteMany({});
        console.log('🗑️ Legacy courses and projects hardcoded seeds deleted successfully.');

        for (const c of coursesData) {
            const course = new Course(c);
            await course.save();
            console.log(`✅ Seeded: ${course.title} (${course.category})`);

            // Add ONE professional project for each
            await Project.findOneAndUpdate(
                { title: `Capstone: ${course.title}`, course: course.title },
                {
                    title: `Capstone: ${course.title}`,
                    description: `Professional level capstone project for the ${course.title} program. Requires implementation of all core concepts.`,
                    course: course.title,
                    type: 'Individual',
                    status: 'in_progress',
                    userId: trainer._id,
                    mentors: [trainer._id],
                    documentation: { links: [{ title: 'Submission Portal', url: 'https://github.com/ManziPatrick/' }] }
                },
                { upsert: true }
            );
        }

        console.log('\n\n✨ ALL SPECIALIZED COURSES SEEDED WITH FULL FIDELITY! ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ FATAL SEEDING ERROR:', e);
        process.exit(1);
    }
};

seedSpecialCourses();
