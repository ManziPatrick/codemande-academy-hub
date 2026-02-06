import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from './models/Blog';
import { User } from './models/User';
import connectDB from './config/db';
import slugify from 'slugify';

dotenv.config();

type BlogCategory = 'Rwanda Tech' | 'Future Tech' | 'Business';

const blogsData = [
    {
        title: "The Rise of Artificial Intelligence in Rwanda's Tech Ecosystem",
        content: "Rwanda is positioning itself as a hub for AI innovation in Africa. With the launch of the National AI Policy, the country is creating an environment where startups and researchers can thrive. At CODEMANDE, we are at the forefront of this revolution, training the next generation of AI practitioners...",
        category: "Rwanda Tech" as BlogCategory,
        tags: ["AI", "Rwanda", "Innovation"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Why Practical Experience Matters More Than a Degree in 2026",
        content: "The global job market is shifting. Employers are no longer just looking at certificates; they want to see what you can build. Our structured internship programs at CODEMANDE are designed to bridge the gap between classroom theory and real-world software delivery...",
        category: "Business" as BlogCategory,
        tags: ["Education", "Career", "Internship"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Future Tech: Quantum Computing and Its Potential Impact on Africa",
        content: "While it might seem far off, Quantum Computing holds the key to solving some of our continent's biggest challenges, from drug discovery to climate modeling. Understanding these emerging technologies today is crucial for staying competitive in the global economy...",
        category: "Future Tech" as BlogCategory,
        tags: ["Quantum", "Future", "EmergingTech"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Kigali: The Emerging Silicon Valley of Africa?",
        content: "With high-speed internet, ease of doing business, and a young, motivated workforce, Kigali is quickly becoming a preferred destination for tech giants and startups alike. We explore the factors driving this growth and what it means for the local population...",
        category: "Rwanda Tech" as BlogCategory,
        tags: ["Kigali", "TechHub", "Growth"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1542382257-80dee8233360?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Leveraging AI for Sustainable Business Growth in Rwanda",
        content: "Small and medium enterprises (SMEs) in Rwanda can significantly benefit from AI-powered automation and analytics. From customer service bots to predictive sales data, the possibilities are endless for businesses willing to embrace digital transformation...",
        category: "Business" as BlogCategory,
        tags: ["SME", "AI", "BusinessGrowth"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "The Ethics of AI: Navigating the Future Responsibly",
        content: "As we integrate AI into more aspects of our lives, the conversation around ethics becomes paramount. How do we ensure bias is minimized? Who is responsible for AI decisions? At CODEMANDE, we incorporate ethical AI considerations into every project and course...",
        category: "Future Tech" as BlogCategory,
        tags: ["Ethics", "AI", "Society"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4628c682c?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Building Scalable Web Applications for the African Market",
        content: "Designing for the African market requires a unique focus on low-bandwidth optimization and mobile-first experiences. We share our best practices for building robust systems that serve users effectively across different regions with varying levels of connectivity...",
        category: "Rwanda Tech" as BlogCategory,
        tags: ["WebDev", "Scalability", "Africa"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Digital Nomadism in Rwanda: A New Frontier",
        content: "With the introduction of special visas and world-class coworking spaces, Rwanda is attracting talent from all over the world. This cross-pollination of ideas is enriching our local tech scene and creating new opportunities for collaboration...",
        category: "Business" as BlogCategory,
        tags: ["DigitalNomad", "Tourism", "Collaboration"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "The Impact of IoT on Rwandan Agriculture",
        content: "Internet of Things (IoT) sensors are transforming how we farm. From soil moisture monitoring to automated irrigation, tech is helping Rwandan farmers increase yields and build resilience against climate change. We look at some successful implementations...",
        category: "Rwanda Tech" as BlogCategory,
        tags: ["IoT", "AgriTech", "ModernFarming"],
        authorName: "Bizimana Eric",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "AI and the Future of Work: Preparing the Rwandan Workforce",
        content: "AI will undoubtedly automate some tasks, but it will also create new roles that didn't exist before. The key is upskilling and reskilling. Our mission at CODEMANDE is to ensure no one is left behind in this digital transition...",
        category: "Future Tech" as BlogCategory,
        tags: ["Workforce", "Skills", "AI"],
        authorName: "Manzi Alain Patrick",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
    }
];

const seedBlogs = async () => {
    try {
        await connectDB();

        // Find an admin user to be the author
        const admin: any = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.error('No admin user found. Please seed users first.');
            process.exit(1);
        }

        // Clear existing blogs
        await Blog.deleteMany({});

        const blogsWithSlugs = blogsData.map(blog => ({
            ...blog,
            author: admin._id,
            slug: slugify(blog.title, { lower: true, strict: true }),
            likes: [],
            comments: []
        }));

        await Blog.insertMany(blogsWithSlugs);
        console.log('✅ Successfully seeded blogs');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding blogs:', error);
        process.exit(1);
    }
};

seedBlogs();
