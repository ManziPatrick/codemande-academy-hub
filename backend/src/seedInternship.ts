import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { InternshipProgram } from './models/internship/InternshipProgram';
import { InternshipApplication } from './models/internship/InternshipApplication';
import { InternshipProject } from './models/internship/InternshipProject';
import { InternshipTeam } from './models/internship/Team';
import { InternshipTeamMember } from './models/internship/TeamMember';
import { InternshipMilestone } from './models/internship/Milestone';
import connectDB from './config/db';

dotenv.config();

const seedInternshipData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing internship data...');
    await InternshipProgram.deleteMany({});
    await InternshipApplication.deleteMany({});
    await InternshipProject.deleteMany({});
    await InternshipTeam.deleteMany({});
    await InternshipTeamMember.deleteMany({});
    await InternshipMilestone.deleteMany({});

    // 1. Fetch some users
    const admin = await User.findOne({ role: 'admin' }) || await User.findOne({ role: 'super_admin' });
    const trainers = await User.find({ role: 'trainer' }).limit(3);
    const students = await User.find({ role: 'student' }).limit(10);

    if (!admin || trainers.length === 0 || students.length === 0) {
      console.log('Main seed must be run first to have users!');
      process.exit(1);
    }

    console.log('Seeding Internship Program...');
    const program = new InternshipProgram({
      title: 'CODEMANDE Summer Tech Immersion 2026',
      description: 'A 3-month intensive hands-on internship focusing on Full-Stack Development and AI.',
      duration: '3 Months',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-08-31'),
      applicationDeadline: new Date('2026-05-15'),
      eligibility: ['Minimum 2 years of CS study', 'Strong Logic skills', 'Basic Web Dev knowledge'],
      rules: 'Attendance is mandatory for all meetings. Code must follow CODEMANDE style guide.',
      status: 'active'
    });
    await program.save();

    console.log(`Found ${students.length} students. Seeding Applications...`);
    const applicationCount = Math.min(students.length, 8);
    for (let i = 0; i < applicationCount; i++) {
        const app = new InternshipApplication({
            internshipProgramId: program._id,
            userId: students[i]._id,
            status: i % 2 === 0 ? 'approved' : 'pending',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Tailwind'],
            availability: 'Full-time'
        });
        await app.save();
    }

    console.log('Seeding Projects...');
    const mainProject = new InternshipProject({
      internshipProgramId: program._id,
      title: 'Smart City Management System',
      description: 'Building a real-time monitoring system for urban infrastructure using IoT and Web technologies.',
      requiredSkills: ['Node.js', 'Socket.IO', 'Leaflet', 'MongoDB'],
      teamSizeRange: { min: 3, max: 5 },
      status: 'published'
    });
    await mainProject.save();

    console.log('Seeding Milestones...');
    const milestones = [
        { title: 'Project Scoping & Requirement Analysis', order: 1, days: 7 },
        { title: 'Database Design & API Foundation', order: 2, days: 14 },
        { title: 'Frontend Dashboard Development', order: 3, days: 21 },
        { title: 'IoT Integration & Real-time Updates', order: 4, days: 28 },
    ];

    for (const m of milestones) {
        const deadline = new Date(program.startDate);
        deadline.setDate(deadline.getDate() + m.days);
        const milestone = new InternshipMilestone({
            internshipProjectId: mainProject._id,
            title: m.title,
            deadline,
            order: m.order
        });
        await milestone.save();
    }

    console.log('Seeding Team...');
    const team = new InternshipTeam({
      name: 'Alpha Architects',
      internshipProjectId: mainProject._id,
      internshipProgramId: program._id,
      mentorId: trainers[0]._id,
      status: 'active'
    });
    await team.save();

    console.log('Seeding Team Members...');
    const memberCount = Math.min(students.length, 4);
    for (let i = 0; i < memberCount; i++) {
        const member = new InternshipTeamMember({
            teamId: team._id,
            userId: students[i]._id,
            role: i === 0 ? 'Team Lead' : 'Developer'
        });
        await member.save();
    }

    console.log('🚀 Internship seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding internship data:', error);
    process.exit(1);
  }
};

seedInternshipData();
