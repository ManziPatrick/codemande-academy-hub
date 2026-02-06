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

const generatePosts = (categories: any[], adminId: string) => {
    const posts = [];
    const images = [
        "https://images.unsplash.com/photo-1542382257-80dee8233360",
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
        "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        "https://images.unsplash.com/photo-1618401471353-b98aadebc248",
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    ];

    for (let i = 1; i <= 35; i++) {
        const cat = categories[i % categories.length];
        const title = `Insightful Post #${i}: Exploring ${cat.name} and Beyond`;
        posts.push({
            title,
            slug: slugify(title, { lower: true, strict: true }),
            content: `This is the detailed content for professional blog post #${i}. We are diving deep into ${cat.name} to understand how it impacts the African tech landscape. 

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

In this series, we explore the intersection of technology, culture, and business in Rwanda. As part of our commitment at CODEMANDE, we provide these insights to help developers and business leaders stay ahead of the curve. Post #${i} focuses specifically on the challenges and opportunities presented by ${cat.name} in 2026.

Sustainability, scalability, and impact are the three pillars of our development philosophy. Whether it's ${cat.name} or other emerging frontiers, we believe in building solutions that last. Join us as we continue this journey of innovation and excellence.`,
            category: cat._id,
            author: adminId,
            authorName: "Manzi Alain Patrick",
            tags: [cat.name.split(' ')[0], "Innovation", "2026", "Tech"],
            image: `${images[i % images.length]}?auto=format&fit=crop&q=80&w=1200`,
            likes: [],
            comments: []
        });
    }
    return posts;
};

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

        const categoriesWithSlugs = categoriesData.map(cat => ({
            ...cat,
            slug: slugify(cat.name, { lower: true, strict: true })
        }));
        const createdCategories = await BlogCategory.insertMany(categoriesWithSlugs);
        console.log(`✅ Seeded ${createdCategories.length} categories`);

        const blogs = generatePosts(createdCategories, admin._id);
        await Blog.insertMany(blogs);
        console.log(`✅ Seeded ${blogs.length} premium blogs across all categories`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
};

seedBlogs();
