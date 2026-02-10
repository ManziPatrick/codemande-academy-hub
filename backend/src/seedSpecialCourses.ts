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
                title: 'Full Stack Masterclass: React & Node.js',
                description: 'The ultimate guide to building scalable, production-ready web applications. Move from React fundamentals to advanced Node.js architecture, CI/CD pipelines, and cloud deployment. 90% project-based learning with a focus on enterprise patterns.',
                instructor: trainer._id,
                price: 0,
                category: 'Web Development',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: Professional React Architecture',
                        description: 'Moving beyond basic components to scalable design systems and state management.',
                        lessons: [
                            {
                                title: 'Compound Components & Design Patterns',
                                duration: 60,
                                type: 'video',
                                content: renderRichContent(
                                    'Architecting Reusable UI',
                                    'Learn to build complex, flexible components like Modals, Multi-selects, and Tabs using the Compound Component pattern and Context API.',
                                    ['Understand the "Inversion of Control" principle', 'Master high-level prop-drilling prevention', 'Implement custom hooks for logic abstraction'],
                                    'Build a fully accessible "Command Palette" component that supports keyboard navigation and dynamic search results.',
                                    [{ name: 'Advanced React Patterns', url: 'https://reactpatterns.com/' }, { name: 'Compound Components Guide', url: 'https://kentcdodds.com/blog/compound-components-with-react-hooks' }]
                                )
                            },
                            {
                                title: 'Enterprise State Management with Zustand',
                                duration: 75,
                                type: 'video',
                                content: renderRichContent(
                                    'State Without the Boilerplate',
                                    'Why Redux is often overkill. Master Zustand for lightweight, high-performance global state that scales with your application.',
                                    ['Hydration and persistence logic', 'Selector-based re-render optimization', 'Middleware for logging and devtools'],
                                    'Create a persistent "Shopping Cart" store that handles local storage synchronization and complex discount logic.',
                                    [{ name: 'Zustand Documentation', url: 'https://docs.pmnd.rs/zustand' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Scalable Backend with Node.js',
                        description: 'Building robust, secure, and high-performance server-side systems.',
                        lessons: [
                            {
                                title: 'Clean Architecture & Dependency Injection',
                                duration: 90,
                                type: 'video',
                                content: renderRichContent(
                                    'Software Engineering for Node',
                                    'Structuring your Express/Fastify apps for testability and maintainability using Services and Repositories.',
                                    ['Separation of concerns (API, Logic, Data)', 'Implementing inversify/awilix for DI', 'Robust error handling middleware'],
                                    'Refactor a monolithic route handler into a clean, testable service-based architecture with separate interface definitions.',
                                    [{ name: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices' }]
                                )
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Data Science Bootcamp',
                description: 'End-to-end data training for modern analysts. Master the Python data stack (NumPy, Pandas, Scikit-Learn) and move from raw CSVs to deployable machine learning models that solve business problems.',
                instructor: trainer._id,
                price: 49.99,
                category: 'Data Engineering',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-nebda4ff7141?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: The Python Power Stack',
                        description: 'Core libraries for high-performance data manipulation.',
                        lessons: [
                            {
                                title: 'Pandas Mastery for Complex Datasets',
                                duration: 55,
                                type: 'video',
                                content: renderRichContent(
                                    'High-Performance Data Wrangling',
                                    'Master vectorization and complex groupby operations to process millions of rows of data with local computing resources.',
                                    ['Multi-indexing and pivot table mastery', 'Efficient time-series analysis', 'Memory optimization for large CSVs'],
                                    'Clean and normalize a messy 100k-row e-commerce dataset, handling missing values and outlier detection via Z-scores.',
                                    [{ name: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Applied Machine Learning',
                        description: 'Moving from descriptive statistics to predictive power.',
                        lessons: [
                            {
                                title: 'Predictive Modeling with Scikit-Learn',
                                duration: 120,
                                type: 'video',
                                content: renderRichContent(
                                    'Building Your First Regressor',
                                    'Learn the pipeline of feature engineering, model selection (Linear Regression vs RF), and evaluation metrics (RMSE, R2).',
                                    ['Cross-validation strategies', 'GridSearchCV for hyperparameter tuning', 'Feature importance analysis'],
                                    'Develop a housing price prediction model with at least 85% accuracy using a real-world real estate dataset.',
                                    [{ name: 'Scikit-Learn Guide', url: 'https://scikit-learn.org/stable/modules/linear_model.html' }]
                                )
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Generative AI for Creative Professionals',
                description: 'Unlock the power of Generative AI without losing your creative edge. Master Midjourney, Adobe Firefly, and specialized fine-tuned models to 10x your design and concepting workflow.',
                instructor: trainer._id,
                price: 150000,
                category: 'Design & Creative',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: Visual Storytelling with AI',
                        description: 'Concepting and high-fidelity output generation.',
                        lessons: [
                            {
                                title: 'Advanced Midjourney Control (v6.1+)',
                                duration: 45,
                                type: 'video',
                                content: renderRichContent(
                                    'Professional Prompting Engineering',
                                    'Master --sref (style reference), --cref (character reference), and varying region/pan tools for precise art direction.',
                                    ['Multi-prompting and weight management', 'Consistency across different visual frames', 'Up-scaling for high-resolution print'],
                                    'Create a 4-panel storyboard for a brand campaign that maintains character and lighting consistency across all frames.',
                                    [{ name: 'Midjourney Documentation', url: 'https://docs.midjourney.com/' }]
                                )
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Prompt Engineering for Software Developers',
                description: 'The definitive guide to the "New Programming". Learn to build AI agents, implement RAG (Retrieval Augmented Generation), and secure your LLM-powered applications against prompt injection.',
                instructor: trainer._id,
                price: 0,
                category: 'AI Engineering',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: LLM System Architecture',
                        description: 'Integrating models into production code.',
                        lessons: [
                            {
                                title: 'Retrieval Augmented Generation (RAG)',
                                duration: 80,
                                type: 'video',
                                content: renderRichContent(
                                    'Grounding AI in Reality',
                                    'Build systems that talk to your own data. Learn about Vector Databases (Pinecone, Chroma) and Semantic Chunking.',
                                    ['Embedding generation and similarity search', 'Context window management', 'Hallucination prevention strategies'],
                                    'Build a "Chat with My Docs" CLI tool that indexes a folder of PDFs and answers questions based ONLY on those docs.',
                                    [{ name: 'LangChain Documentation', url: 'https://python.langchain.com/docs/get_started/introduction' }]
                                )
                            }
                        ]
                    }
                ]
            },
            {
                title: 'AI Strategic Leadership',
                description: 'Leading in the age of intelligence. A high-level program for executives and managers to navigate the implementation of enterprise AI, manage risk, and foster an AI-first culture.',
                instructor: trainer._id,
                price: 250000,
                category: 'Strategic Management',
                level: 'Advanced',
                thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: The AI Transformation Roadmap',
                        description: 'Aligning technology with business outcomes.',
                        lessons: [
                            {
                                title: 'AI Opportunity Mapping & ROI',
                                duration: 60,
                                type: 'video',
                                content: renderRichContent(
                                    'Deciding What to Automate',
                                    'Learn the frameworks for identifying high-impact AI use-cases vs shiny distractions. Calculating total cost of ownership.',
                                    ['The "Build vs Buy" AI framework', 'Governance and Responsible AI oversight', 'Talent strategy for the AI era'],
                                    'Draft a 3-page "AI Transformation Memo" for a mock organization, identifying 3 high-ROI AI initiatives.',
                                    [{ name: 'Harvard Business Review on AI', url: 'https://hbr.org/topic/artificial-intelligence' }]
                                )
                            }
                        ]
                    }
                ]
            }
        ];

        // Wipe existing versions to ensure NO DUPLICATION and FRESH CONTENT
        const courseTitles = coursesData.map(c => c.title);
        await Course.deleteMany({ title: { $in: courseTitles } });
        console.log('🗑️ Cleaned up existing versions of specialized courses.');

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
