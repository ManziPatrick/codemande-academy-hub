import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog';
import BlogCategory from './models/BlogCategory';
import { User } from './models/User';
import connectDB from './config/db';
import slugify from 'slugify';

dotenv.config();

const categoriesData = [
    { name: 'Rwanda Tech', description: 'Deep dives into the growing technology landscape in Kigali and across Rwanda.' },
    { name: 'Future Tech', description: 'Insights into AI, Blockchain, Quantum Computing, and the next frontier of innovation.' },
    { name: 'Business & Growth', description: 'Strategies for startups, entrepreneurship tips, and navigating the African market.' },
    { name: 'Software Engineering', description: 'Technical articles, best practices, and architecture guides for modern developers.' },
    { name: 'Career & Internship', description: 'Practical advice for junior developers, internship experiences, and career roadmaps.' },
    { name: 'AI & Data Science', description: 'Specialized content focusing on Machine Learning and Data-driven decision making.' }
];

const blogsData = [
    {
        title: "Kigali's Vision: Becoming Africa's Leading Tech Hub by 2030",
        content: `Rwanda's journey towards a knowledge-based economy is accelerating. With the development of Kigali Innovation City and the continuous push for digitalization across all government sectors, the country is setting a precedent for the entire continent. 

At CODEMANDE, we see this transformation every day. Our developers are working on projects that solve real-world problems for local businesses, from agricultural tech to fintech solutions. The focus is no longer just on consumption but on creation. We are moving from being users of technology to being the builders of the future.

The government's commitment to high-speed internet and tech-friendly policies has attracted international giants, but the real heart of the ecosystem is the homegrown startups. These companies are agile, innovative, and deeply connected to the needs of the Rwandan people. In this article, we explore how Kigali is positioning itself as a "Silicon Valley" with a unique African identity.`,
        categoryName: "Rwanda Tech",
        tags: ["Kigali", "Innovation", "RwandaTech", "AfricaTech"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1542382257-80dee8233360?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Mastering the Art of Scalable Microservices with Node.js and TypeScript",
        content: `As applications grow in complexity, the monolithic approach often becomes a bottleneck. Microservices offer a way to decompose large systems into smaller, manageable, and independently deployable units. However, this architectural pattern comes with its own set of challenges, particularly around communication and data consistency.

Using TypeScript with Node.js provides a robust foundation for building these services. The static typing helps catch errors early, and the rich ecosystem of libraries like NestJS makes development efficient. In this guide, we break down our internal best practices for service discovery, inter-service communication using RabbitMQ, and maintaining high availability in production environments.

We also discuss why we chose TypeORM for our database layer and how we manage shared types across different services to ensure seamless integration. If you are building for the scale of millions of users, this is the deep dive you have been waiting for.`,
        categoryName: "Software Engineering",
        tags: ["TypeScript", "Microservices", "NodeJS", "Architecture"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Generative AI: Moving Beyond the Hype to Real-World Value",
        content: `The buzz around Large Language Models (LLMs) and Generative AI is hard to ignore. While the initial wave was driven by chatbots and creative tools, businesses are now looking for sustainable ways to integrate these technologies into their workflows. 

At CODEMANDE, we focus on 'Augmented Intelligence'—using AI to enhance human capabilities rather than replace them. This includes automating repetitive documentation tasks, generating boilerplate code, and creating highly personalized customer experiences. 

In this article, we analyze the cost-benefit ratio of fine-tuning existing models versus using RAG (Retrieval-Augmented Generation) patterns. We also address the ethical considerations of AI deployment in the African context, ensuring that technology remains inclusive and beneficial for all segments of society.`,
        categoryName: "AI & Data Science",
        tags: ["GenerativeAI", "LLM", "RAG", "MachineLearning"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Building a Tech Product for the African Market: What You Need to Know",
        content: `The African market is not a monolith. Each region has its own set of challenges, from varying internet speeds to diverse payment preferences. If you are building a tech product, a "one size fits all" approach will likely fail.

One of the most critical factors is 'Offline-First' design. Many users in remote areas experience intermittent connectivity. Your application must be resilient and provide value even without an active internet connection. Another factor is mobile primacy; the vast majority of users access the web via mobile devices, often with limited hardware specifications.

We also dive into the importance of integrating localized payment solutions like Mobile Money, which remains the primary way people transact across many African nations. Success in this market requires empathy, local knowledge, and technical flexibility.`,
        categoryName: "Business & Growth",
        tags: ["MarketResearch", "Africa", "ProductManagement", "Startup"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "The CODEMANDE Internship Experience: A Path to Professional Excellence",
        content: `Bridging the gap between university theory and professional practice is the core mission of our internship program. We don't just give our interns side tasks; we integrate them into real production teams working on active client projects.

Our 'Mentor-First' philosophy ensures that every junior developer has the support they need to navigate complex codebases. From daily standups to peer code reviews, interns learn the rhythm of professional software development. This immersive environment helps them develop not just technical skills, but also the 'soft skills' like communication and teamwork that are essential for a successful career.

In this post, we hear from three of our recent graduates who have transitioned into full-time roles at leading tech companies. Their stories highlight the importance of grit, curiosity, and a supportive community.`,
        categoryName: "Career & Internship",
        tags: ["Internship", "Learning", "CareerPath", "Mentorship"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "The Future of Quantum Computing in Cryptography",
        content: `Quantum computers have the potential to break many of the encryption algorithms we rely on today. While full-scale fault-tolerant quantum computers are still years away, the threat to long-term data security is real. This has led to the rise of 'Post-Quantum Cryptography' (PQC).

We explore the new mathematical problems that underly these quantum-resistant algorithms and why every organization should start planning their transition now. We also touch upon how Africa can participate in this research frontier, ensuring we are not just consumers of security standards but also contributors.

Quantum technology is not just about faster computers; it's about a fundamental shift in how we process information and secure our digital world.`,
        categoryName: "Future Tech",
        tags: ["QuantumComputation", "Security", "Cryptography", "FutureTech"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Why Continuous Integration (CI/CD) is Non-Negotiable for Startups",
        content: `In the early days of a startup, speed is everything. However, moving fast shouldn't mean breaking things. CI/CD pipelines automate the testing and deployment process, allowing teams to ship code several times a day with confidence.

Automating your builds ensures that your master branch is always in a deployable state. It reduces manual errors, speeds up feedback loops for developers, and allows for much faster recovery if a bug ever hits production. At CODEMANDE, we use GitHub Actions and Docker to streamline our entire pipeline from commit to cloud.

We show you how to set up a basic pipeline that handles linting, unit testing, and staging deployments without spending a fortune on infrastructure.`,
        categoryName: "Software Engineering",
        tags: ["DevOps", "CICD", "Automation", "Startups"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1618401471353-b98aadebc248?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Sustainable Tech: How Green Coding is Saving the Planet",
        content: `Every line of code executed has a carbon footprint. As we build increasingly complex systems, the energy consumption of data centers around the world is skyrocketing. 'Green Coding' is the practice of writing efficient code that minimizes energy usage.

From optimizing database queries to lazy-loading assets, there are many ways developers can contribute to sustainability. We also discuss the role of renewable energy in powering cloud infrastructure and why choosing a 'green' cloud provider is a strategic business decision.

Building for the future means building responsibly. We share tips on how to measure the energy efficiency of your web applications and reduce their environmental impact.`,
        categoryName: "Future Tech",
        tags: ["Sustainability", "GreenTech", "EfficientCoding", "Environment"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Building Inclusive Tech Communities in East Africa",
        content: `The strength of a tech ecosystem lies in its community. We explore the vibrant tech meetups, hackathons, and developer groups that are springing up across Kigali, Nairobi, and Kampala. These communities are vital for knowledge sharing, networking, and fostering innovation.

At CODEMANDE, we believe in giving back. We host monthly workshops and sponsor open-source initiatives to support the next generation of African developers. Inclusivity is at the heart of our efforts, ensuring that women and underrepresented groups have an equal voice in shaping the future of tech.

Join us as we interview community leaders who are making a real difference and learn how you can get involved.`,
        categoryName: "Rwanda Tech",
        tags: ["Community", "EastAfrica", "Networking", "Inclusivity"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    },
    {
        title: "Data-Driven Marketing: How Local SMEs are Scaling with Analytics",
        content: `Marketing is no longer just about intuition; it's about data. Small and Medium Enterprises (SMEs) in Rwanda are increasingly using analytics to understand their customers better and optimize their marketing spend. 

From social media metrics to website traffic analysis, data provides actionable insights that can drive growth. We showcase several local businesses that have successfully transitioned to a data-driven approach and seen significant improvements in their ROI.

We provide a starter kit for SMEs looking to dive into analytics without needing a full-time data scientist.`,
        categoryName: "Business & Growth",
        tags: ["DataAnalytics", "Marketing", "SME", "GrowthHacking"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    }
];

const seedBlogs = async () => {
    try {
        await connectDB();

        // 1. Find an admin user to be the author
        const admin: any = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found. Please seed users first (npm run seed:users).');
            process.exit(1);
        }

        // 2. Clear existing data
        await Blog.deleteMany({});
        await BlogCategory.deleteMany({});

        // 3. Create Categories
        const categoriesWithSlugs = categoriesData.map(cat => ({
            ...cat,
            slug: slugify(cat.name, { lower: true, strict: true })
        }));
        const createdCategories = await BlogCategory.insertMany(categoriesWithSlugs);
        console.log(`✅ Successfully seeded ${createdCategories.length} categories`);

        // Create a map for easy lookup
        const categoryMap = new Map();
        createdCategories.forEach(cat => categoryMap.set(cat.name, cat._id));

        // 4. Create Blogs
        const blogsWithSlugs = blogsData.map(blog => {
            const categoryId = categoryMap.get(blog.categoryName);
            if (!categoryId) {
                console.warn(`Category not found: ${blog.categoryName}`);
            }
            return {
                ...blog,
                category: categoryId,
                author: admin._id,
                slug: slugify(blog.title, { lower: true, strict: true }),
                likes: [],
                comments: []
            };
        });

        await Blog.insertMany(blogsWithSlugs);
        console.log(`✅ Successfully seeded ${blogsWithSlugs.length} blogs with premium content`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();
