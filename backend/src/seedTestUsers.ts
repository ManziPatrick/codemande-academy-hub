import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codemande';

const testUsers = [
    {
        username: 'superadmin',
        name: 'Super Admin',
        email: 'superadmin@codemande.com',
        password: 'Admin@123',
        role: 'super_admin',
        isEmailVerified: true,
    },
    {
        username: 'admin',
        name: 'Admin User',
        email: 'admin@codemande.com',
        password: 'Admin@123',
        role: 'admin',
        isEmailVerified: true,
    },
    {
        username: 'trainer',
        name: 'Trainer User',
        email: 'trainer@codemande.com',
        password: 'Trainer@123',
        role: 'trainer',
        isEmailVerified: true,
    },
    {
        username: 'student',
        name: 'Student User',
        email: 'student@codemande.com',
        password: 'Student@123',
        role: 'student',
        isEmailVerified: true,
    },
    {
        username: 'johndoe',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Student@123',
        role: 'student',
        isEmailVerified: true,
    },
    {
        username: 'janesmith',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'Student@123',
        role: 'student',
        isEmailVerified: true,
    },
];

async function seedTestUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing test users (optional - comment out if you want to keep existing users)
        // await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
        // console.log('🗑️  Cleared existing test users');

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
