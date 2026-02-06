import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TeamMember from './models/TeamMember';
import connectDB from './config/db';

dotenv.config();

const teamMembers = [
    {
        name: 'Patrick Manzi',
        role: 'Founder & Head of Academy',
        bio: 'Visionary leader empowering the next generation of African tech talent through intensive mentorship and real-world project execution.',
        image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1974&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/manzipatrick',
        twitter: 'https://twitter.com/manzipatrick',
        github: 'https://github.com/manzipatrick'
    },
    {
        name: 'Sarah Umutoni',
        role: 'Lead AI Instructor',
        bio: 'Machine Learning expert focusing on Deep Learning. Sarah leads our AI specializations with a hands-on, project-driven approach.',
        image: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=1972&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/sarahumutoni',
        twitter: 'https://twitter.com/sarahumutoni',
        github: 'https://github.com/sarahumutoni'
    },
    {
        name: 'Jean Claude Nsabimana',
        role: 'Senior Full Stack Developer',
        bio: 'Expert in the MERN stack and cloud architecture. Jean Claude mentors students on building scalable production-grade applications.',
        image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1970&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/jeanclaude',
        twitter: 'https://twitter.com/jeanclaude',
        github: 'https://github.com/jeanclaude'
    },
    {
        name: 'Marie Claire Uwase',
        role: 'UI/UX Design Lead',
        bio: 'Creating intuitive user experiences. Marie Claire ensures our graduates design with empathy, precision, and modern aesthetics.',
        image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/marieclaire',
        twitter: 'https://twitter.com/marieclaire',
        github: 'https://github.com/marieclaire'
    },
    {
        name: 'Eric Karekezi',
        role: 'Cybersecurity Mentor',
        bio: 'Dedicated to securing Africa\'s digital future. Eric brings years of experience in ethical hacking and network security.',
        image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=1970&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/erickarekezi',
        twitter: 'https://twitter.com/erickarekezi',
        github: 'https://github.com/erickarekezi'
    },
    {
        name: 'Alice Ishimwe',
        role: 'Data Science Instructor',
        bio: 'Alice specializes in big data analytics. She helps students bridge the gap between complex math and actionable business insights.',
        image: 'https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?q=80&w=1972&auto=format&fit=crop',
        linkedin: 'https://linkedin.com/in/aliceishimwe',
        twitter: 'https://twitter.com/aliceishimwe',
        github: 'https://github.com/aliceishimwe'
    }
];

const seedPublicTeam = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing Team Members...');
        await TeamMember.deleteMany({});

        console.log('👥 Seeding Public Team Members...');
        await TeamMember.insertMany(teamMembers);

        console.log('✅ Public Team Seeding Completed Successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding public team:', error);
        process.exit(1);
    }
};

seedPublicTeam();
