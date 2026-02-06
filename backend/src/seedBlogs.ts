import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog';
import BlogCategory from './models/BlogCategory';
import { User } from './models/User';
import connectDB from './config/db';
import slugify from 'slugify';

dotenv.config();

const categoriesData = [
    { name: 'Software Engineering', description: 'Technical articles, best practices, and architecture guides for modern developers.' },
    { name: 'Rwanda Tech', description: 'Deep dives into the growing technology landscape in Kigali and across Rwanda.' },
    { name: 'Future Tech', description: 'Insights into AI, Blockchain, Quantum Computing, and the next frontier of innovation.' },
    { name: 'Business & Growth', description: 'Strategies for startups, entrepreneurship tips, and navigating the African market.' },
    { name: 'Career & Internship', description: 'Practical advice for junior developers, internship experiences, and career roadmaps.' },
    { name: 'AI & Data Science', description: 'Specialized content focusing on Machine Learning and Data-driven decision making.' }
];

const blogTopics = [
    {
        title: "Kigali Tech Renaissance: Architecting Africa’s Digital Future by 2030",
        content: `## Introduction: The Landlocked Reality vs. The Digital Opportunity

Rwanda has long been defined by its geography. A beautiful, mountainous, landlocked nation in the heart of East Africa, its traditional economic pathways were limited by borders and logistics. However, over the last two decades, a new vision has emerged—one that renders physical borders irrelevant. This is the vision of a digital Rwanda, a "Silicon Valley" for Africa, where the primary export isn't minerals or coffee, but lines of code and innovative intellectual property.

The problem is clear: for many African nations, the transition from an agrarian economy to a digital one is fraught with "digital divide" challenges—lack of high-speed internet, expensive hardware, and a severe shortage of high-level technical talent. But where others see problems, Rwanda sees an unprecedented opportunity. By 2030, Kigali aims to be the undisputed leading tech hub of the continent.

This isn't just about buildling shiny buildings in the Kigali Innovation City. It’s about building a sustainable ecosystem. At CODEMANDE, we believe that for this renaissance to be real, it must be architected from the ground up, starting with the most valuable resource: human capital.

## The Infrastructure Pillar: Beyond Fiber Optics

To understand the future of tech in Rwanda, we must first look at the foundation. The Rwandan government’s "Vision 2030" isn't just a document; it’s a living blueprint. The rollout of 4G (and now 5G) LTE across nearly 100% of the country was the first major milestone. But infrastructure is more than just wires and frequencies.

### The Rise of Kigali Innovation City (KIC)
KIC is more than just a real estate project. It is a cluster of universities (like Carnegie Mellon Africa), tech companies, and incubators. The goal is to create a "collision space" where academic research meets commercial feasibility. For a professional software engineer, this means having access to a world-class environment without ever having to leave the continent.

## Human Capital: The Real Source Code of Innovation

You can buy hardware and rent cloud space, but you cannot "download" an experienced engineering team. The global shortage of senior developers is well-known, but in Africa, the challenge is compounded by the "Junior Gap." We have many young people interested in tech, but few have been through the rigorous, project-based training required to build enterprise-grade software.

### The CODEMANDE Approach: Bridge the Gap
This is why CODEMANDE’s Internship Programs are designed the way they are. We don't just teach syntax; we teach "Architecture." We believe a senior software writer isn't someone who knows a library, but someone who knows how to solve a business problem using technology. 

Our Technical Training focuses on:
- Clean Code & Design Patterns: Moving beyond "it works" to "it's maintainable."
- Full-Stack Mastery: From React 18 Concurrent Mode to scalable Node.js backends.
- Soft Skills: Communications, Agile methodologies, and project management.

## Building for the African Market: The "Offline-First" Mandate

A major mistake international tech firms make when entering the African market is assuming the same infrastructure parity as the West. In New York, a 50MB JavaScript bundle might load in a second. In some parts of rural Rwanda, that same bundle could take minutes or fail entirely.

### Practical Example: The Agritech Revolution
Imagine a farmer in Nyagatare using an app to diagnose crop diseases. If the app requires a persistent, high-speed connection, it’s useless the moment they step into a remote field. 
The Solution: Localized caching and PWA (Progressive Web Apps) technology. By building with an "offline-first" mentality, we ensure that data is synced once a connection becomes available, providing a seamless user experience regardless of the environment.

## Conclusion: Join the Renaissance

The "Kigali Tech Renaissance" is not a distant dream; it's happening in every coworking space, every university lab, and every line of code written by a Rwandan developer. By 2030, the world will look to Kigali not just for recovery stories, but for innovation stories.

The question isn't whether Rwanda will become a tech hub, but whether you will be part of the architecture.`,
        cat: 'Rwanda Tech',
        img: "https://images.unsplash.com/photo-1444417824417-c54c30bd3fd5"
    },
    {
        title: "Introduction to React 18 and Concurrent Mode",
        content: "React 18 introduced a powerful new concept called Concurrent Mode. This allows React to interrupt a long-running render to handle a high-priority event, like a user click or an animation. Understanding transitions (useTransition) and deferred values (useDeferredValue) is crucial for building butter-smooth interfaces in 2026. At CODEMANDE, we use these features to ensure our academy's platform remains responsive even with complex data visualizations.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
    },
    {
        title: "Advanced TypeScript Patterns: Generics and Mapped Types",
        content: "TypeScript is more than just adding types to JavaScript. Advanced features like Mapped Types, Conditional Types, and Template Literal Types allow us to create highly dynamic and type-safe libraries. Learn how to use 'infer' to extract types and create utility types that make your codebase self-documenting and virtually bug-free under proper linting.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1516116216624-53e697fedbea"
    },
    {
        title: "Building Scalable Backend with Node.js and NestJS",
        content: "Scaling a Node.js application requires a structured approach. NestJS provides a modular architecture influenced by Angular, making it easy to build microservices. We explore dependency injection, interceptors, and guards to build a robust security layer for our enterprise clients in Rwanda.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
    },
    {
        title: "Mastering MongoDB Aggregation Framework",
        content: "MongoDB's Aggregation Framework is a powerful tool for data processing. Instead of pulling large amounts of data into the application layer, we use stages like $lookup, $group, and $facet to perform complex analytics directly on the server. This significantly reduces latency and cloud costs.",
        cat: 'AI & Data Science',
        img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e"
    },
    {
        title: "State Management in 2026: React Query vs. Redux",
        content: "The landscape of state management has shifted. While Redux is still relevant for complex global states, React Query (TanStack Query) has become the gold standard for server state. Automatic caching, background refetching, and optimistic updates are now built-in features that every modern frontend developer should master.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
    },
    {
        title: "The Future of Web Development: AI-Powered Coding",
        content: "AI tools like Copilot and Antigravity are changing how we write code. It's not about replacing developers, but enhancing their productivity. We explore how to leverage AI for boilerplate generation, unit testing, and refactoring, allowing engineers to focus on high-level architecture and problem-solving.",
        cat: 'Future Tech',
        img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
    },
    {
        title: "Clean Architecture in JavaScript Projects",
        content: "Maintaining a large codebase requires a clear separation of concerns. Clean Architecture suggests dividing the app into Entities, Use Cases, and Adapters. This makes the business logic independent of frameworks and databases, ensuring longevity and ease of testing.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
    },
    {
        title: "DevOps for Frontend Developers: GitHub Actions",
        content: "DevOps is no longer just for backend engineers. Automating your deployment pipeline with GitHub Actions ensures that every PR is linted, tested, and built before reaching production. Learn how to set up staging environments and automatic Netlify/Vercel deployments.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
    },
    {
        title: "Building Accessible Web Applications (WCAG 2.2)",
        content: "Web accessibility (a11y) is a fundamental right. Using semantic HTML, managing focus, and providing proper ARIA labels ensures that users with visual or motor impairments can navigate your site. We explore the latest WCAG 2.2 guidelines and testing tools like Axe.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
    },
    {
        title: "UI/UX Trends for 2026: Glassmorphism and Micro-interactions",
        content: "Modern UI is all about depth and feedback. Glassmorphism uses blurred backgrounds to create a sense of layers, while micro-interactions provide subtle visual feedback to user actions. These details differentiate a good product from a great one.",
        cat: 'Business & Growth',
        img: "https://images.unsplash.com/photo-1594913366159-1832ffefc334"
    },
    {
        title: "Career in Tech: From Junior to Senior Developer",
        content: "The path from junior to senior is paved with more than just coding skills. It requires system design thinking, mentorship ability, and cross-team communication. We discuss the key milestones and how to build a career roadmap that leads to technical leadership.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
    },
    {
        title: "How to Ace Technical Interviews in Rwanda",
        content: "Technical interviews in the local market focus on both fundamental knowledge and practical problem-solving. We break down the most common algorithm challenges and system design questions asked by top tech firms in Kigali.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
    },
    {
        title: "Understanding Blockchain: Beyond Cryptocurrencies",
        content: "Blockchain technology has applications far beyond Bitcoin. From supply chain transparency to decentralized identity (DID), we explore how smart contracts are revolutionizing trust in digital transactions across Africa.",
        cat: 'Future Tech',
        img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0"
    },
    {
        title: "Cybersecurity Best Practices for Startups",
        content: "Data breaches can kill a startup. Implementing OWASP Top 10 defenses, using HTTPS everywhere, and keeping dependencies updated are non-negotiable. Learn how to perform basic security audits on your own codebase.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
    },
    {
        title: "Data Science with Python: A Beginner's Guide",
        content: "Python has become the language of data. Libraries like Pandas, NumPy, and Scikit-Learn make it easy to clean data and build predictive models. We show you how to start your data journey with real-world datasets.",
        cat: 'AI & Data Science',
        img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    },
    {
        title: "Machine Learning in Production: Challenges & Solutions",
        content: "Training a model is only 10% of the work. Deploying it to production (MLOps) requires monitoring for drift, managing model versions, and ensuring low-latency inference. Discover how to build sustainable ML systems.",
        cat: 'AI & Data Science',
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
    },
    {
        title: "Cloud Native Applications with Docker & Kubernetes",
        content: "Containerization allows your app to run anywhere. Kubernetes (K8s) automates the scaling and management of these containers. We explain the basics of pods, deployments, and services in a cloud-native world.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1605792657660-596af9009e82"
    },
    {
        title: "Serverless Computing: When to Use It?",
        content: "Serverless functions (AWS Lambda, Netlify Functions) allow you to run code without managing servers. It's cost-effective for event-driven tasks but can suffer from cold starts. We analyze the trade-offs.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
    },
    {
        title: "Performance Optimization: Making Your Web Apps Blazing Fast",
        content: "Load speed directly impacts conversion. Techniques like image lazy-loading, code splitting, and using Edge Networks (CDNs) can bring your Lighthouse score to 100. We share our optimization checklist.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
    {
        title: "The Importance of Soft Skills for Engineers",
        content: "Great engineers aren't just great coders. Empathy, active listening, and the ability to explain complex technical concepts to non-technical stakeholders are what truly makes an engineer valuable in a team.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
    },
    {
        title: "Agile Project Management: Scrum vs. Kanban",
        content: "How you manage work is as important as the work itself. Scrum's time-boxed sprints are great for feature development, while Kanban's continuous flow excels in maintenance. Learn which one fits your team.",
        cat: 'Business & Growth',
        img: "https://images.unsplash.com/photo-1531403009284-440f080d1e12"
    },
    {
        title: "Remote Work in Tech: How to Stay Productive",
        content: "Remote work is here to stay. Mastering asynchronous communication Tools like Slack and Linear, setting boundaries, and maintaining a work-life balance are key to long-term success in a distributed team.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1588702547919-26089e690922"
    },
    {
        title: "Building a Portfolio that Gets You Hired",
        content: "Your portfolio is more than a list of projects. It should tell a story of how you solve problems. Focus on the impact of your work and the technical decisions you made along the way.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8"
    },
    {
        title: "Open Source Contribution: A Guide for Beginners",
        content: "Contributing to open source is the best way to learn and build a reputation. Start small with documentation fixes and work your way up to core features. We list the most beginner-friendly projects in 2026.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    },
    {
        title: "Testing in React: Jest and React Testing Library",
        content: "Unit and integration tests are your safety net. We show you how to write meaningful tests that don't just check implementation details but ensure your components work for the user.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
    },
    {
        title: "GraphQL vs. REST: Choosing the Right API Style",
        content: "GraphQL offers flexibility while REST offers simplicity. We compare the two and discuss scenarios where one might be superior to the other, focusing on bandwidth and developer experience.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48"
    },
    {
        title: "Mobile App Development: React Native vs. Flutter",
        content: "Cross-platform development is the standard. React Native uses JavaScript while Flutter uses Dart. We analyze the performance, ecosystem, and learning curve of both frameworks.",
        cat: 'Software Engineering',
        img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
    },
    {
        title: "Progressive Web Apps (PWAs): The Future of Mobile",
        content: "PWAs provide a native-like experience in the browser. Offline support, push notifications, and home screen installation are making specialized mobile apps redundant for many businesses.",
        cat: 'Future Tech',
        img: "https://images.unsplash.com/photo-1484417824417-c54c30bd3fd5"
    },
    {
        title: "E-commerce Development: Best Practices",
        content: "Building an online store requires a focus on security and performance. From secure checkout flows to inventory management, we share our experience building e-commerce platforms in Rwanda.",
        cat: 'Business & Growth',
        img: "https://images.unsplash.com/photo-1556742049-0ad345653344"
    },
    {
        title: "Fintech in Africa: Opportunities and Challenges",
        content: "The African fintech landscape is thriving. Mobile money integration and micro-lending platforms are increasing financial inclusion. We discuss the tech stacks driving this revolution.",
        cat: 'Business & Growth',
        img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e40"
    },
    {
        title: "Agritech: Transforming Agriculture in Rwanda",
        content: "Technology is helping farmers optimize yields and connect with markets. From IOT sensors to data-driven weather forecasting, tech is the future of sustainable farming in Rwanda.",
        cat: 'Rwanda Tech',
        img: "https://images.unsplash.com/photo-1523348830342-d01f9fc11339"
    },
    {
        title: "EdTech: The Future of Learning",
        content: "Online learning platforms like CODEMANDE Academy are making high-quality education accessible to everyone. We explore the tech behind modern LMS systems and personalized learning paths.",
        cat: 'Rwanda Tech',
        img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8"
    },
    {
        title: "HealthTech: Innovation in Healthcare",
        content: "Digital health records and telemedicine are improving healthcare delivery. We discuss the privacy and security challenges of building healthtech applications.",
        cat: 'Rwanda Tech',
        img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528"
    },
    {
        title: "The Role of Mentorship in Tech Careers",
        content: "Having a mentor can accelerate your career growth significantly. We discuss how to find a mentor and how to be an effective mentee in the tech industry.",
        cat: 'Career & Internship',
        img: "https://images.unsplash.com/photo-1515169067868-5387ec356754"
    },
    {
        title: "Entrepreneurship 101: Starting Your Tech Company in Kigali",
        content: "Starting a company requires more than just a great idea. We share a step-by-step guide to registering your business, finding talent, and securing funding in the Rwandan ecosystem.",
        cat: 'Business & Growth',
        img: "https://images.unsplash.com/photo-1497366216548-37526070297c"
    }
];

const seedBlogs = async () => {
    try {
        await connectDB();
        const admin: any = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found. Please seed users first.');
            process.exit(1);
        }

        await Blog.deleteMany({});
        await BlogCategory.deleteMany({});

        const createdCategories = await BlogCategory.insertMany(categoriesData.map(cat => ({
            ...cat,
            slug: slugify(cat.name, { lower: true, strict: true })
        })));
        console.log(`✅ Seeded ${createdCategories.length} categories`);

        const categoryMap = new Map();
        createdCategories.forEach(cat => categoryMap.set(cat.name, cat._id));

        const blogs = blogTopics.map(topic => ({
            title: topic.title,
            slug: slugify(topic.title, { lower: true, strict: true }),
            content: topic.content + "\n\n" +
                "Continuously learning is the key to success in the ever-evolving world of technology. " +
                "Build, experiment, and share your knowledge with the community to grow as a professional engineer.",
            category: categoryMap.get(topic.cat),
            author: admin._id,
            authorName: "Manzi Alain Patrick",
            tags: [topic.cat.split(' ')[0], "Tech", "Learning", "2026"],
            image: topic.img + "?auto=format&fit=crop&q=80&w=1200",
            likes: [],
            comments: []
        }));

        await Blog.insertMany(blogs);
        console.log(`✅ Seeded ${blogs.length} professional educational blogs`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
};

seedBlogs();
