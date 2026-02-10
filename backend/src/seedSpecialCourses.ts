import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Course } from './models/Course';
import { Project } from './models/Project';
import connectDB from './config/db';

dotenv.config();

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
    <h3 class="text-xl font-semibold mb-3">Implementation Details</h3>
    <ul class="list-disc ml-6 space-y-2">
      ${(l.build || []).map((b: string) => `<li>${b}</li>`).join('')}
    </ul>
  </section>

  <section class="bg-muted p-6 rounded-xl">
    <h3 class="text-xl font-semibold mb-3">Key Resources</h3>
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

const seedSpecialCourses = async () => {
    try {
        await connectDB();
        console.log('🚀 Starting Specialized Course Seeding...');

        const trainer = await User.findOne({ role: 'trainer' });
        if (!trainer) {
            console.error('❌ No trainer found');
            process.exit(1);
        }

        const coursesData = [
            {
                title: 'Full Stack Masterclass: React & Node.js',
                description: 'The ultimate guide to building scalable web applications. From zero to hero with modern stack. Covers frontend mastery with React and robust backend systems with Node.js.',
                instructor: trainer._id,
                price: 0,
                category: 'Web Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
                modules: [
                    {
                        title: 'Module 1: Advanced React Patterns',
                        description: 'Mastering performance and state with React.',
                        lessons: createRichLessons('React', [
                            { title: 'Compound Components', description: 'Building flexible and reusable component APIs.', build: ['Selectable Menu', 'Custom Modal System'] },
                            { title: 'Performance Optimization', description: 'Using useMemo, useCallback and Profiler.', build: ['Large Data Grid Optimization'] }
                        ])
                    },
                    {
                        title: 'Module 2: Scalable Node.js Architecture',
                        description: 'Building production-grade backend systems.',
                        lessons: createRichLessons('Node.js', [
                            { title: 'Event-Driven Architecture', description: 'Leveraging EventEmitter and Streams.', build: ['Real-time Log Processor'] },
                            { title: 'Microservices with Node', description: 'Breaking down monoliths into services.', build: ['Auth Service', 'Communication Service'] }
                        ])
                    }
                ]
            },
            {
                title: 'Data Science Bootcamp',
                description: 'Master Python and Machine Learning. Real world projects and datasets. Move from spreadsheets to predictive models in 12 intensive weeks.',
                instructor: trainer._id,
                price: 49.99,
                category: 'Data Science',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-nebda4ff7141?q=80&w=2070&auto=format&fit=crop',
                modules: [
                    {
                        title: 'Module 1: Python for Data Science',
                        description: 'Pandas, Numpy and Matplotlib mastery.',
                        lessons: createRichLessons('Python', [
                            { title: 'Data Cleaning at Scale', description: 'Handling missing values and outliers programmatically.', build: ['E-commerce dataset cleaner'] },
                            { title: 'Exploratory Data Analysis', description: 'Storytelling through data visualization.', build: ['Market trend dashboard'] }
                        ])
                    }
                ]
            },
            {
                title: 'Generative AI for Creative Professionals',
                description: 'Learn to use ChatGPT, Midjourney, and DALL-E to revolutionize your creative workflow. Scale your output with AI while maintaining your unique artistic voice.',
                instructor: trainer._id,
                price: 150000,
                category: 'Design & AI',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
                modules: [
                    {
                        title: 'Module 1: Creative Prompting',
                        description: 'Advanced techniques for image and text generation.',
                        lessons: createRichLessons('AI Creative', [
                            { title: 'Mastering Midjourney v6', description: 'Deep dive into parameters, styles and composition.', build: ['Commercial poster concept'] },
                            { title: 'Storyboarding with AI', description: 'Accelerating pre-production workflows.', build: ['Interactive comic storyboard'] }
                        ])
                    }
                ]
            },
            {
                title: 'Prompt Engineering for Software Developers',
                description: 'Master the art of prompt engineering to build smarter AI-integrated applications and leverage LLMs in your code. Learn how to program with natural language.',
                instructor: trainer._id,
                price: 0,
                category: 'Software Engineering',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2070&auto=format&fit=crop',
                modules: [
                    {
                        title: 'Module 1: Programmatic Prompting',
                        description: 'Few-shot, Chain-of-Thought and ReAct patterns.',
                        lessons: createRichLessons('Dev Prompting', [
                            { title: 'Structured Output with LLMs', description: 'Ensuring JSON/XML responses for system integration.', build: ['Automated unit test generator'] },
                            { title: 'Prompt Injection Defense', description: 'Securing your AI agents from user manipulation.', build: ['Secure chatbot filter'] }
                        ])
                    }
                ]
            },
            {
                title: 'AI Strategic Leadership',
                description: 'Lead your organization through the AI revolution. Understand the strategic, ethical, and operational shifts required for AI success at the enterprise level.',
                instructor: trainer._id,
                price: 250000,
                category: 'Management',
                level: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
                modules: [
                    {
                        title: 'Module 1: AI Transformation Strategy',
                        description: 'Building an AI-first organization.',
                        lessons: createRichLessons('Strategy', [
                            { title: 'Gap Analysis for AI Readiness', description: 'Evaluating data infrastructure and talent.', build: ['AI Readiness Assessment Report'] },
                            { title: 'Ethical AI Governance', description: 'Drafting policies for responsible AI usage.', build: ['Corporate AI Ethics Charter'] }
                        ])
                    }
                ]
            }
        ];

        for (const courseData of coursesData) {
            const course = await Course.findOneAndUpdate(
                { title: courseData.title },
                courseData,
                { upsert: true, new: true }
            );
            console.log(`✅ Course synced: ${course.title}`);

            // Add a template project for each
            await Project.findOneAndUpdate(
                { title: `Project: ${courseData.title}`, course: course.title },
                {
                    title: `Project: ${courseData.title}`,
                    description: `The capstone project for the ${courseData.title} course.`,
                    course: course.title,
                    type: 'Individual',
                    status: 'in_progress',
                    userId: trainer._id,
                    mentors: [trainer._id],
                    documentation: { links: [{ title: 'Github Template', url: 'https://github.com/ManziPatrick/' }] }
                },
                { upsert: true }
            );
        }

        console.log('🎉 Specialized Course Seeding Completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedSpecialCourses();
