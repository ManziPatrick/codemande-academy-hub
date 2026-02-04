import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Message } from './models/Message';
import { Conversation } from './models/Conversation';
import { Course } from './models/Course';
import { Project } from './models/Project';
import { Certificate } from './models/Certificate';
import { Internship } from './models/Internship';
import { Booking } from './models/Booking';
import { Question } from './models/Question';
import { Badge } from './models/Badge';
import { Payment } from './models/Payment';
import { StudentProfile } from './models/StudentProfile';
import { InternshipProgram } from './models/internship/InternshipProgram';
import { InternshipPayment } from './models/internship/Payment';
import { InternshipApplication } from './models/internship/InternshipApplication';
import { InternshipProject } from './models/internship/InternshipProject';
import { InternshipTeam } from './models/internship/Team';
import { InternshipTeamMember } from './models/internship/TeamMember';
import { InternshipMilestone } from './models/internship/Milestone';
import { InternshipSubmission } from './models/internship/Submission';
import { InternshipMentorFeedback } from './models/internship/MentorFeedback';
import { InternshipActivityLog } from './models/internship/ActivityLog';
import { InternshipCertificate } from './models/internship/Certificate';
import { InternshipInvoice } from './models/internship/Invoice';
import connectDB from './config/db';

dotenv.config();

const createLessons = (baseTitle: string, count: number) => {
  const types = ['video', 'article', 'quiz', 'pdf', 'project'];
  const lessons = [];
  for (let i = 1; i <= count; i++) {
    const type = types[i % types.length];
    const unitTitle = `${baseTitle} - Unit ${i}`;
    
    // Rich HTML Content
    const htmlContent = `
      <div class="space-y-6">
        <section>
          <h2 class="text-2xl font-bold text-accent mb-4">Introduction to ${unitTitle}</h2>
          <p class="text-lg leading-relaxed">
            Welcome to this comprehensive unit where we deep dive into the core principles of <strong>${baseTitle}</strong>. 
            In this session, we will explore the industry standards and real-world applications that make this topic essential 
            for modern professionals.
          </p>
        </section>

        <section class="bg-card p-6 rounded-xl border border-border/50">
          <h3 class="text-xl font-semibold mb-3">Key Learning Objectives</h3>
          <ul class="list-disc pl-6 space-y-2">
            <li>Master the fundamental architecture of ${baseTitle.split(' ')[0]} systems.</li>
            <li>Understand the integration patterns used by top tech companies.</li>
            <li>Develop proficiency in troubleshooting and optimizing performance.</li>
            <li>Learn to apply best practices for security and scalability.</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Industry Context</h3>
          <p>
            As technology evolves, the demand for expertise in ${baseTitle} has grown exponentially. 
            This unit provides the critical foundation needed to navigate complex projects and deliver high-quality results. 
            We will analyze several case studies from leading organizations to see these concepts in action.
          </p>
        </section>

        <section class="border-l-4 border-accent pl-6 italic">
          <p class="text-muted-foreground">
            "The secret to mastering ${baseTitle.split(' ')[0]} is not just understanding the syntax, 
            but mastering the logic behind the implementation." - Senior Academy Mentor
          </p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Practical Exercise</h3>
          <p class="mb-4">
            To solidify your understanding, please complete the following exercise:
          </p>
          <div class="bg-muted/30 p-4 rounded-lg font-mono text-sm">
            1. Analyze the sample dataset provided in the resources.<br/>
            2. Identify the top 3 performance bottlenecks.<br/>
            3. Propose a solution using the ${baseTitle.split(' ')[0]} framework.<br/>
            4. Submit your findings in the project portal.
          </div>
        </section>
      </div>
    `;

    lessons.push({
      title: unitTitle,
      content: htmlContent,
      duration: 15 + (i * 5),
      type: type,
      videoUrl: type === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : null,
      fileUrl: type === 'pdf' ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : null,
    });
  }
  return lessons;
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing data...');
    const models = [
      User, Message, Conversation, Course, Project, Certificate, Internship, Booking, Question, Badge, Payment,
      StudentProfile, InternshipProgram, InternshipPayment, InternshipApplication, InternshipProject,
      InternshipTeam, InternshipTeamMember, InternshipMilestone, InternshipSubmission, 
      InternshipMentorFeedback, InternshipActivityLog, InternshipCertificate, InternshipInvoice
    ];
    
    for (const model of models) {
      await (model as any).deleteMany({});
    }

    console.log('👤 Creating Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const admin = await new User({
      username: 'admin',
      email: 'admin@codemande.com',
      password: hashedPassword,
      role: 'admin',
      fullName: 'System Administrator',
      title: 'Head of Academy',
      avatar: 'https://i.pravatar.cc/150?u=admin'
    }).save();

    const trainer1 = await new User({
      username: 'innovator_john',
      email: 'john@codemande.com',
      password: hashedPassword,
      role: 'trainer',
      fullName: 'John Innovator',
      title: 'Senior Full Stack Engineer',
      bio: 'Ex-Google engineer with 10 years of experience in React and Node.js. Passionate about teaching the next generation of African tech leaders.',
      skills: ['React', 'Node.js', 'System Design', 'Cloud Architecture'],
      avatar: 'https://i.pravatar.cc/150?u=john'
    }).save();

    const trainer2 = await new User({
      username: 'sarah_ai',
      email: 'sarah@codemande.com',
      password: hashedPassword,
      role: 'trainer',
      fullName: 'Sarah Data',
      title: 'Lead Data Scientist',
      bio: 'PhD in Machine Learning. Expert in Python, TensorFlow, and extracting insights from complex datasets.',
      skills: ['Python', 'Machine Learning', 'Data Visualization', 'SQL'],
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    }).save();

    // Students
    const student1 = await new User({
      username: 'student_alice',
      email: 'alice@student.com',
      password: hashedPassword,
      role: 'student',
      fullName: 'Alice Keza',
      title: 'Aspiring Frontend Developer',
      avatar: 'https://i.pravatar.cc/150?u=alice'
    }).save();

    const student2 = await new User({
      username: 'student_bob',
      email: 'bob@student.com',
      password: hashedPassword,
      role: 'student',
      fullName: 'Bob Manzi',
      title: 'Backend Enthusiast',
      avatar: 'https://i.pravatar.cc/150?u=bob'
    }).save();

    console.log('📚 Creating Courses...');
    // Trainer 1 references this course in his internship project
    const fullStackCourse = await new Course({
      title: 'Full Stack Masterclass: React & Node.js',
      description: 'The ultimate guide to building scalable web applications. From zero to hero with modern stack.',
      instructor: trainer1._id,
      price: 0, // Free course
      category: 'Development',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
      modules: [
        {
          title: 'Core Fundamentals',
          description: 'Getting started with the MERN stack',
          lessons: createLessons('Full Stack', 10)
        }
      ],
      published: true,
      studentsEnrolled: [student1._id, student2._id]
    } as any).save();

    const dataScienceCourse = await new Course({
      title: 'Data Science Bootcamp',
      description: 'Master Python and Machine Learning. Real world projects and datasets.',
      instructor: trainer2._id,
      price: 49.99,
      category: 'Data Science',
      level: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-nebda4ff7141?q=80&w=2070&auto=format&fit=crop',
      modules: [
        {
          title: 'Python Basics',
          description: 'Introduction to Python for Data Analysis',
          lessons: createLessons('Data Science', 8)
        }
      ],
      published: true,
      studentsEnrolled: [student2._id]
    } as any).save();

    console.log('🎓 Creating Student Profiles...');
    // Create rich profiles for students
    await new StudentProfile({
      userId: student1._id,
      school: 'University of Rwanda',
      educationLevel: 'undergraduate',
      fieldOfStudy: 'Computer Engineering',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      availability: 'full_time',
      bio: 'Third year student looking for industrial attachment. Passionate about UI/UX.',
      githubUrl: 'https://github.com/alice',
      linkedinUrl: 'https://linkedin.com/in/alice',
      portfolioUrl: 'https://alice.dev',
      phoneNumber: '+250780000001'
    }).save();

    await new StudentProfile({
      userId: student2._id,
      school: 'Carnegie Mellon University Africa',
      educationLevel: 'graduate',
      fieldOfStudy: 'Electrical and Computer Engineering',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      availability: 'part_time',
      bio: 'Graduate student specializing in backend systems and distributed computing.',
      githubUrl: 'https://github.com/bob',
      linkedinUrl: 'https://linkedin.com/in/bob',
      phoneNumber: '+250780000002'
    }).save();

    console.log('🚀 Creating Internship Programs...');
    const program1 = await new InternshipProgram({
      title: 'Advanced Full Stack Internship',
      description: `Join our elite engineering team and work on production-grade applications. 
      Prerequisites: Completion of '${fullStackCourse.title}' is highly recommended.`, // Reference to course
      duration: '3 months',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Starts in 1 week
      endDate: new Date(Date.now() + 97 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      eligibility: ['React', 'Node.js', 'Git'],
      maxParticipants: 10,
      price: 100000, // 100k RWF
      currency: 'RWF',
      status: 'active',
      isActive: true,
      batches: [{ name: 'Batch 1', startDate: new Date(), endDate: new Date() }]
    } as any).save();

    const program2 = await new InternshipProgram({
      title: 'Data Analytics For Business',
      description: 'Learn to drive business decisions with data.',
      duration: '2 months',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 74 * 24 * 60 * 60 * 1000),
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      eligibility: ['Excel', 'Basic Python'],
      maxParticipants: 20,
      price: 0, // Free
      currency: 'RWF',
      status: 'active',
      isActive: true
    } as any).save();

    console.log('🏗️ Creating Internship Projects...');
    // Link Project to Trainer and refer to Course in description
    const project1 = await new InternshipProject({
      internshipProgramId: program1._id,
      title: 'E-Commerce Microservices Migration',
      description: `
        <p>In this project, you will break down a monolithic e-commerce app into microservices.</p>
        <p><strong>Reference Material:</strong> Please review Unit 5 of the <a href="/courses/${fullStackCourse._id}/learn">${fullStackCourse.title}</a> course before starting.</p>
        <p>Your mentor for this project will be <strong>${(trainer1 as any).fullName}</strong>, the author of the course.</p>
      `,
      trainerId: trainer1._id,
      requiredSkills: ['Node.js', 'Docker', 'Kubernetes'],
      objectives: ['Analyze monolith', 'Design service boundaries', 'Implement auth service', 'Deploy to cluster'],
      status: 'published',
      teamSizeRange: { min: 2, max: 4 }
    } as any).save();

    // Create milestones for project
    const m1 = await new InternshipMilestone({
      internshipProjectId: project1._id,
      title: 'System Analysis & Design',
      description: 'Document the existing system and propose microservice architecture.',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      order: 1
    }).save();

    const m2 = await new InternshipMilestone({
      internshipProjectId: project1._id,
      title: 'Service Implementation',
      description: 'Implement the User and Product services using Node.js.',
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      order: 2
    }).save();

    console.log('📝 Creating Applications...');
    // Alice applies to Program 1
    const app1 = await new InternshipApplication({
      userId: student1._id,
      internshipProgramId: program1._id,
      status: 'approved',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      cvUrl: 'https://example.com/cv.pdf'
    }).save();

    // Bob applies to Program 1
    const app2 = await new InternshipApplication({
      userId: student2._id,
      internshipProgramId: program1._id,
      status: 'approved',
      reviewedBy: admin._id,
      reviewedAt: new Date(),
      cvUrl: 'https://example.com/cv-bob.pdf'
    }).save();

    console.log('💳 Creating Payments...');
    // Alice pays
    await new InternshipPayment({
      userId: student1._id,
      internshipProgramId: program1._id,
      amount: 100000,
      currency: 'RWF',
      status: 'paid',
      paymentMethod: 'card',
      transactionId: 'pi_test_12345ABCDE',
      paidAt: new Date()
    }).save();

    // Bob is waived
    await new InternshipPayment({
      userId: student2._id,
      internshipProgramId: program1._id,
      amount: 100000,
      currency: 'RWF',
      status: 'waived',
      waivedReason: 'Merit Scholarship',
      waivedBy: admin._id
    }).save();

    console.log('👥 Creating Teams...');
    // Create Team for Project 1
    const team1 = await new InternshipTeam({
      internshipProgramId: program1._id,
      internshipProjectId: project1._id,
      name: 'Team Alpha',
      status: 'active',
      mentorId: trainer1._id
    }).save();

    // Add members
    await new InternshipTeamMember({
      teamId: team1._id,
      userId: student1._id,
      role: 'lead',
      joinedAt: new Date()
    }).save();

    await new InternshipTeamMember({
      teamId: team1._id,
      userId: student2._id,
      role: 'member',
      joinedAt: new Date()
    }).save();

    console.log('📤 Creating Submissions...');
    // Alice submits Milestone 1
    await new InternshipSubmission({
      milestoneId: m1._id,
      teamId: team1._id,
      userId: student1._id,
      contentUrl: 'https://figma.com/design-doc',
      description: 'Here is our architecture diagram and design doc.',
      status: 'approved',
      feedback: 'Excellent detailed analysis.',
      gradedBy: trainer1._id,
      gradedAt: new Date()
    }).save();

    console.log('✅ Seeding Completed Successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
