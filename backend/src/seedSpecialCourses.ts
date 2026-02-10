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
                description: 'End-to-end data training for modern analysts. Master the Python data stack (NumPy, Pandas, Scikit-Learn) and move from raw CSVs to deployable machine learning models that solve business problems. This course focuses on real-world datasets and production-grade ML pipelines.',
                instructor: trainer._id,
                price: 49.99,
                category: 'Data Science',
                level: 'Beginner',
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: Professional Python Data Stack',
                        description: 'Engineering high-performance data transformation pipelines.',
                        lessons: [
                            {
                                title: 'Pandas Vectorization & Memory Optimization',
                                duration: 60,
                                type: 'video',
                                content: renderRichContent(
                                    'High-Performance Data Engineering',
                                    'Stop using loops. Master vectorization techniques in Pandas and NumPy to process millions of records in seconds. Learn memory management for large-scale datasets.',
                                    ['Vectorized string operations and mathematical functions', 'Effective use of dtypes for memory reduction', 'Parallel processing with Dask for massive datasets'],
                                    'Optimize a legacy data script processing 5 million rows, reducing execution time from 10 minutes to under 30 seconds.',
                                    [{ name: 'Pandas Optimization Guide', url: 'https://pandas.pydata.org/pandas-docs/stable/user_guide/enhancingperf.html' }]
                                )
                            },
                            {
                                title: 'EDA: Beyond Basic Charting',
                                duration: 45,
                                type: 'video',
                                content: renderRichContent(
                                    'Statistical Storytelling',
                                    'Use Seaborn and Plotly to uncover hidden correlations. Master feature importance analysis before ever touching a model.',
                                    ['Correlation heatmaps and pair plots', 'Handling imbalanced classes with SMOTE', 'Automated EDA tools'],
                                    'Perform a deep multivariate analysis on a financial fraud dataset to identify top predictive indicators of fraudulent activity.',
                                    [{ name: 'Seaborn Documentation', url: 'https://seaborn.pydata.org/' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: Production Machine Learning',
                        description: 'Building, evaluating, and deploying models that stick.',
                        lessons: [
                            {
                                title: 'Scikit-Learn Pipelines & Tuning',
                                duration: 90,
                                type: 'video',
                                content: renderRichContent(
                                    'ML Lifecycle Management',
                                    'Learn to use Sklearn Pipelines to prevent data leakage. Master GridSearchCV and RandomizedSearchCV for hyperparameter optimization.',
                                    ['Building robust transformation pipelines', 'Cross-validation for reliable performance metrics', 'Saving models with Joblib/Pickle'],
                                    'Build a complete end-to-end pipeline for predicting customer churn, including preprocessing, model selection, and hyperparameter tuning.',
                                    [{ name: 'Scikit-Learn Pipelines', url: 'https://scikit-learn.org/stable/modules/compose.html' }]
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
                description: 'The definitive guide to the "New Programming". Master advanced techniques for LLM integration, from Chain-of-Thought reasoning to defensive prompting and RAG architecture. Built by developers, for developers.',
                instructor: trainer._id,
                price: 0,
                category: 'AI Engineering',
                level: 'Intermediate',
                thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000',
                status: 'published',
                modules: [
                    {
                        title: 'Module 1: Advanced Prompting Patterns',
                        description: 'Moving beyond simple instructions to structured AI control.',
                        lessons: [
                            {
                                title: 'Programmatic Reasoning with CoT & ReAct',
                                duration: 60,
                                type: 'video',
                                content: renderRichContent(
                                    'Enforcing Logical Continuity',
                                    'Master Chain-of-Thought (CoT) and ReAct patterns to make LLMs "think" before they act, significantly reducing hallucinations in complex tasks.',
                                    ['Few-shot vs. Zero-shot reasoning templates', 'Implementing ReAct (Reason + Act) loop pattern', 'Techniques for structured JSON output enforcement'],
                                    'Create a specialized SQL-generating agent that reasoning through schema relationships before outputting the final query.',
                                    [{ name: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' }, { name: 'ReAct Pattern Paper', url: 'https://arxiv.org/abs/2210.03629' }]
                                )
                            },
                            {
                                title: 'Defensive Prompting & Security',
                                duration: 45,
                                type: 'video',
                                content: renderRichContent(
                                    'Securing the AI Layer',
                                    'Protect your applications from prompt injection, jailbreaking, and data leakage. Learn to build "Dual-LLM" validation patterns.',
                                    ['Sanitizing user inputs for LLM safety', 'Implementing system-level instruction guards', 'Detection of adversarial prompt patterns'],
                                    'Build a "Secure Gateway" that validates and sanitizes incoming user prompts before they reach your core proprietary prompt template.',
                                    [{ name: 'OWASP for LLMs', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' }]
                                )
                            }
                        ]
                    },
                    {
                        title: 'Module 2: RAG & AI Agent Desktop',
                        description: 'Building practical tools with external data.',
                        lessons: [
                            {
                                title: 'RAG Architecture with LangChain',
                                duration: 75,
                                type: 'video',
                                content: renderRichContent(
                                    'Connecting LLMs to Private Data',
                                    'Deep dive into the Retrieval Augmented Generation (RAG) pipeline: Loaders, Splitters, Embeddings, and Vector Stores.',
                                    ['Efficient semantic search within vector databases', 'Context window optimization and reranking', 'Hybrid search (Keyword + Vector) implementation'],
                                    'Develop a local "Documentation Expert" that can answer technical questions about a specific internal codebase.',
                                    [{ name: 'LangChain RAG Documentation', url: 'https://python.langchain.com/docs/use_cases/question_answering/' }]
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
