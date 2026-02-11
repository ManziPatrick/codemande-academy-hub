import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';
import connectDB from './config/db';

dotenv.config();

const testUsers = [
    {
        username: 'superadmin',
        fullName: 'Super Admin',
        email: 'superadmin@codemande.com',
        password: 'password123',
        role: 'super_admin',
    },
    {
        username: 'admin',
        fullName: 'Admin User',
        email: 'admin@codemande.com',
        password: 'password123',
        role: 'admin',
    },
    {
        username: 'trainer',
        fullName: 'Trainer User',
        email: 'trainer@codemande.com',
        password: 'password123',
        role: 'trainer',
    },
    {
        username: 'student',
        fullName: 'Student User',
        email: 'student@codemande.com',
        password: 'password123',
        role: 'student',
    },
    {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student',
    },
    {
        username: 'janesmith',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'student',
    },
];

async function seedTestUsers() {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Clear existing test users
        await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
        console.log('🗑️  Cleared existing test users');

        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`⏭️  User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create user
            const user = new User({
                ...userData,
                password: hashedPassword,
            });

            await user.save();
            console.log(`✅ Created ${userData.role}: ${userData.email} (password: ${userData.password})`);
        }

        console.log('\n🎉 Test users seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('━'.repeat(60));
        testUsers.forEach(user => {
            console.log(`${user.role.toUpperCase().padEnd(15)} | ${user.email.padEnd(30)} | ${user.password}`);
        });
        console.log('━'.repeat(60));

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding test users:', error);
        process.exit(1);
    }
}

seedTestUsers();
