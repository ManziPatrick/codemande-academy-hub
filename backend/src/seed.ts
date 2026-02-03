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

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Course.deleteMany({});
    await Project.deleteMany({});
    await Certificate.deleteMany({});
    await Internship.deleteMany({});
    await Booking.deleteMany({});
    await Question.deleteMany({});
    await Badge.deleteMany({});
    await Payment.deleteMany({});

    console.log('Seeding Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Fixed IDs for stability if possible, but mongoose generate is fine
    const userData = [
      { username: 'StartAdmin', email: 'admin@codemande.com', password: hashedPassword, role: 'super_admin', permissions: ['all'], currentStage: 6, level: 10, academicStatus: 'alumni' },
      { username: 'Admin User', email: 'adminuser@codemande.com', password: hashedPassword, role: 'admin', permissions: ['manage_users', 'manage_courses', 'manage_internships', 'manage_projects', 'manage_certificates'] },
      { username: 'Dr. Smith', email: 'smith@codemande.com', password: hashedPassword, role: 'trainer', level: 8, academicStatus: 'graduate' },
      { username: 'Jane Doe', email: 'jane@codemande.com', password: hashedPassword, role: 'trainer', level: 7, academicStatus: 'graduate' },
      { username: 'Alice Student', email: 'alice@example.com', password: hashedPassword, role: 'student', level: 3, academicStatus: 'active' },
      { username: 'Bob Learner', email: 'bob@example.com', password: hashedPassword, role: 'student', level: 2, academicStatus: 'active' },
      { username: 'Charlie Newbie', email: 'charlie@example.com', password: hashedPassword, role: 'student', level: 1, academicStatus: 'active' },
      { username: 'Diana Intern', email: 'diana@example.com', password: hashedPassword, role: 'student', level: 4, academicStatus: 'intern' },
    ];

    const users: any[] = [];
    for (const u of userData) {
      const user = new User(u);
      await user.save();
      users.push(user);
    }

    const instructor1 = users[1]; // Admin/Instructor
    const instructor2 = users[2]; // Dr. Smith
    const instructor3 = users[3]; // Jane Doe
    const student1 = users[4]; // Alice
    const student2 = users[5]; // Bob
    const student3 = users[6]; // Charlie
    const student4 = users[7]; // Diana

    console.log('Seeding Badges...');
    const badgesData = [
       { title: 'Code Warrior', description: 'Awarded for completing 5 coding challenges.', icon: 'trophy', category: 'Achievement' },
       { title: 'Bug Hunter', description: 'Awarded for finding and fixing critical bugs in assignments.', icon: 'bug', category: 'Skill' },
       { title: 'Top Performer', description: 'Ranked in the top 10% of the class.', icon: 'star', category: 'Performance' },
       { title: 'Fast Learner', description: 'Completed a module in record time.', icon: 'zap', category: 'Speed' },
    ];

    const badges: any[] = [];
    for (const b of badgesData) {
        const badge = new Badge(b);
        await badge.save();
        badges.push(badge);
    }
    
    // Award a badge to Alice
    student1.badges.push({ badgeId: badges[0]._id, awardedAt: new Date() });
    await student1.save();


    console.log('Seeding Courses (Full Content)...');
    const courseTemplate = [
      { title: 'Full Stack Web Development Bootcamp', price: 99.99, instructor: instructor2, category: 'Development', level: 'Intermediate', thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
      { title: 'Data Science with Python', price: 89.99, instructor: instructor2, category: 'Data Science', level: 'Beginner', thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
      { title: 'UI/UX Design Masterclass', price: 79.99, instructor: instructor3, category: 'Design', level: 'Beginner', thumb: 'https://images.unsplash.com/photo-1561070791-2526d30994b5' },
      { title: 'Cybersecurity Fundamentals', price: 129.99, instructor: instructor1, category: 'Cybersecurity', level: 'Advanced', thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b' },
      { title: 'Cloud Computing with AWS', price: 149.99, instructor: instructor1, category: 'Cloud', level: 'Intermediate', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa' },
      { title: 'Mobile App Development with Flutter', price: 95.00, instructor: instructor3, category: 'Development', level: 'Intermediate', thumb: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c' },
      { title: 'Advanced DevOps & CI/CD', price: 199.00, instructor: instructor1, category: 'DevOps', level: 'Advanced', thumb: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb' },
      { title: 'AI & Machine Learning Engineering', price: 159.00, instructor: instructor2, category: 'AI', level: 'Advanced', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995' },
      { title: 'Digital Marketing & Content Strategy', price: 65.00, instructor: instructor3, category: 'Business', level: 'Beginner', thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f' },
      { title: 'Blockchain & Web3 Development', price: 175.00, instructor: instructor1, category: 'Blockchain', level: 'Advanced', thumb: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0' },
    ];

    const courses: any[] = [];
    for (const t of courseTemplate) {
      const course = new Course({
        title: t.title,
        description: `Experience the highest quality education with our ${t.title}. This course is designed to take you from a complete beginner to a job-ready professional in the field of ${t.category}. You will learn through hands-on projects, expert mentorship, and a comprehensive curriculum developed by industry leaders.`,
        thumbnail: t.thumb,
        instructor: t.instructor._id,
        price: t.price,
        discountPrice: t.price * 0.8,
        level: t.level,
        category: t.category,
        status: 'published',
        studentsEnrolled: [],
        modules: [
          {
            title: 'I. Foundational Mastery',
            description: 'Building the core foundations required for advanced concepts.',
            lessons: createLessons(`${t.title} Foundation`, 5)
          },
          {
            title: 'II. Advanced Implementation',
            description: 'Moving into complex structures and professional application.',
            lessons: createLessons(`${t.title} Advanced`, 5)
          }
        ]
      });
      await course.save();
      courses.push(course);
    }

    // Enroll students and populate the reciprocal studentsEnrolled array
    const studentMap = [
      { student: student1, idxs: [0, 2, 5, 7] },
      { student: student2, idxs: [0, 1, 6, 7] },
      { student: student3, idxs: [1, 3, 8] },
      { student: student4, idxs: [0, 2, 4, 8] },
    ];

    for (const sm of studentMap) {
      const enrolledIds = sm.idxs.map(i => courses[i]._id);
      await User.findByIdAndUpdate(sm.student._id, { $set: { enrolledCourses: enrolledIds } });
      
      // Update each course to include this student
      for (const courseId of enrolledIds) {
        await Course.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: sm.student._id } });
      }
    }

    console.log('Seeding Payments...');
    // Create payments for enrolled courses
    for (const sm of studentMap) {
      for (const i of sm.idxs) {
        const c = courses[i];
        await new Payment({
          userId: sm.student._id,
          courseId: c._id,
          amount: c.price,
          currency: 'RWF',
          status: 'completed',
          paymentMethod: 'Mobile Money',
          transactionId: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
          type: 'Course Enrollment',
          itemTitle: c.title
        }).save();
      }
    }

    console.log('Seeding Questions...');
    // Add questions to each course
    for (const course of courses) {
      await new Question({
        courseId: course._id,
        questionText: `What is the primary goal of ${course.title}?`,
        options: ["Master the skills", "Just watch videos", "Nothing", "Skip everything"],
        correctOptionIndex: 0,
        explanation: "The goal is to provide deep mastery of the subject matter."
      }).save();
      
      await new Question({
        courseId: course._id,
        questionText: `Which level is ${course.title} designed for?`,
        options: ["Beginner", "Intermediate", "Advanced", "All Levels"],
        correctOptionIndex: course.level === 'Beginner' ? 0 : (course.level === 'Intermediate' ? 1 : 2),
        explanation: `This course is specifically tailored for ${course.level} learners.`
      }).save();
    }

    console.log('Seeding Conversations...');
    const conv1 = new Conversation({ participants: [student1._id, instructor2._id] });
    await conv1.save();
    const msg1 = new Message({ conversationId: conv1._id, sender: instructor2._id, content: 'Welcome to the bootcamp, Alice! I am looking forward to seeing your progress.', read: true });
    await msg1.save();
    conv1.lastMessage = msg1._id as any;
    await conv1.save();

    console.log('Seeding Internships...');
    const internshipData = [
      {
        userId: student4._id,
        title: 'Full Stack Developer Intern',
        company: 'CODEMANDE Tech',
        duration: '3 months',
        status: 'in_progress',
        mentorId: instructor2._id,
        progress: 45,
        payment: { amount: 50000, currency: 'RWF', status: 'paid', paidAt: new Date() }
      },
      {
        userId: student1._id,
        title: 'Software Engineering Trainee',
        company: 'Apex Solutions',
        duration: '6 months',
        status: 'eligible',
        mentorId: instructor1._id,
        progress: 0,
        payment: { amount: 25000, currency: 'RWF', status: 'pending' }
      }
    ];

    for (const idata of internshipData) {
      await new Internship(idata).save();
    }

    console.log('Seeding Projects...');
    const projectsData = [
      {
        userId: student1._id,
        title: 'E-Commerce Platform for Local Artisans',
        course: courses[0].title, // Full Stack Dev
        type: 'Individual',
        status: 'in_progress',
        progress: 65,
        description: 'Building a fully functional e-commerce site using MERN stack, featuring user authentication, product management, and payment integration.',
        deadline: new Date(Date.now() + 86400000 * 14), // 2 weeks from now
        tasks: [
          { title: 'Setup React Frontend', completed: true },
          { title: 'Design Database Schema', completed: true },
          { title: 'Implement Stripe Payment', completed: false },
          { title: 'Deploy to Vercel', completed: false }
        ]
      },
      {
        userId: student1._id,
        title: 'Smart Home IoT Dashboard',
        course: courses[6].title, // DevOps
        type: 'Team Project',
        status: 'completed',
        progress: 100,
        description: 'A centralized dashboard to monitor and control IoT devices, deployed using Kubernetes and ensuring high availability.',
        submittedAt: new Date(),
        grade: 'A',
        feedback: 'Excellent work on the CI/CD pipeline implementation.',
        team: [
          { name: 'Alice Student', role: 'DevOps Engineer' },
          { name: 'David Lee', role: 'Frontend Developer' }
        ],
        tasks: [
          { title: 'Containerize Applications', completed: true },
          { title: 'Setup Jenkins Pipeline', completed: true },
          { title: 'Configure Monitoring (Prometheus/Grafana)', completed: true }
        ],
        submissionUrl: 'https://github.com/alice/iot-dashboard'
      },
      {
        userId: student2._id,
        title: 'Predictive Analytics for Retail',
        course: courses[1].title, // Data Science
        type: 'Individual',
        status: 'pending_review',
        progress: 95,
        description: 'Using Python and Pandas to analyze retail sales data and predict future trends using machine learning models.',
        submittedAt: new Date(),
        submissionUrl: 'https://github.com/bob/retail-analytics',
        tasks: [
          { title: 'Data Cleaning', completed: true },
          { title: 'Exploratory Data Analysis', completed: true },
          { title: 'Model Training', completed: true },
          { title: 'Final Report Generation', completed: false }
        ]
      },
      {
        userId: student3._id,
        title: 'Blockchain Voting System',
        course: courses[9].title, // Blockchain
        type: 'Team Project',
        status: 'in_progress',
        progress: 40,
        description: 'A decentralized voting application built on Ethereum to ensure transparency and security in local elections.',
        team: [
          { name: 'Charlie Newbie', role: 'Smart Contract Dev' },
          { name: 'Sarah Jones', role: 'UI/UX Designer' }
        ],
        tasks: [
          { title: 'Write Smart Contracts', completed: true },
          { title: 'Integrate Web3.js', completed: false },
          { title: 'Test on Ropsten Network', completed: false }
        ]
      }
    ];

    for (const p of projectsData) {
      const project = new Project(p);
      await project.save();
    }

    console.log('Seeding Certificates...');
    const certificatesData = [
      {
        userId: student1._id,
        courseId: courses[0]._id, // Full Stack Dev
        courseTitle: courses[0].title,
        issueDate: new Date(),
        credentialId: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        status: 'issued',
        progress: 100,
        requirements: [
          { title: 'Complete all video lessons', completed: true, current: 50, total: 50 },
          { title: 'Pass final exam with >80%', completed: true, current: 1, total: 1 },
          { title: 'Submit final project', completed: true, current: 1, total: 1 }
        ]
      },
      {
        userId: student2._id,
        courseId: courses[1]._id,
        courseTitle: courses[1].title,
        status: 'in_progress',
        progress: 60,
        requirements: [
          { title: 'Complete all video lessons', completed: false, current: 20, total: 40 },
          { title: 'Pass final exam with >80%', completed: false, current: 0, total: 1 },
          { title: 'Submit final project', completed: false, current: 0, total: 1 }
        ]
      },
      {
         userId: student4._id,
         courseId: courses[4]._id, // Cloud
         courseTitle: courses[4].title,
         status: 'issued',
         issueDate: new Date(Date.now() - 86400000 * 30), // 1 month ago
         credentialId: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
         progress: 100,
         requirements: [
             { title: 'Complete AWS Cloud Practitioner Essentials', completed: true },
             { title: 'Pass Capstone Project', completed: true }
         ]
      }
    ];

    for (const c of certificatesData) {
      const certificate = new Certificate(c);
      await certificate.save();
    }

    console.log('Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
