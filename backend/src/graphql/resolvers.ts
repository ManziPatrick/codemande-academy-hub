import { User } from '../models/User';
import { Message } from '../models/Message';
import { Conversation } from '../models/Conversation';
import { Course } from '../models/Course';
import { Question } from '../models/Question';
import { Booking } from '../models/Booking';
import { Badge } from '../models/Badge';
import { Config } from '../models/Config';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { Internship } from '../models/Internship';
import { CourseProgress } from '../models/CourseProgress';
import { Payment } from '../models/Payment';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const resolvers = {
  Query: {
    hello: () => 'Hello world from Apollo Server!',
    users: async () => await User.find({ isDeleted: { $ne: true } }),

    conversations: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      // Find conversations where user is a participant
      const conversations = await Conversation.find({
        participants: { $in: [context.user.id] }
      })
        .populate('participants')
        .populate({
          path: 'lastMessage',
          populate: { path: 'sender' }
        })
        .sort({ updatedAt: -1 });

      return conversations;
    },

    messages: async (_: any, { conversationId }: { conversationId: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      // Verify user is part of this conversation
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) throw new Error('Conversation not found');

      const isParticipant = conversation.participants.some((p: any) => p.toString() === context.user.id);
      if (!isParticipant) throw new Error('Not authorized');

      return await Message.find({ conversationId })
        .populate('sender')
        .sort({ createdAt: 1 }); // Oldest first for chat history usually, but depends on UI
    },

    courses: async (_: any, __: any, context: any) => {
      const query: any = { isDeleted: { $ne: true } };

      // Filter for students/guests: Only published courses
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'super_admin' && context.user.role !== 'trainer')) {
        query.status = 'published';
      }

      return await Course.find(query).populate('instructor').populate('studentsEnrolled');
    },

    course: async (_: any, { id }: { id: string }, context: any) => {
      const targetId = typeof id === 'object' ? ((id as any).id || (id as any)._id) : id;
      const course = await Course.findById(targetId).populate('instructor').populate('studentsEnrolled');
      if (!course) throw new Error(`Course not found for ID: ${targetId}`);

      // Check enrollment
      let isEnrolled = false;
      if (context.user) {
        // Check if user is enrolled
        isEnrolled = course.studentsEnrolled.some((s: any) => s._id.toString() === context.user.id || s.id === context.user.id);

        // Grant access to instructor, admin, super_admin
        if ((course.instructor as any)._id.toString() === context.user.id ||
          ['admin', 'super_admin', 'trainer'].includes(context.user.role)) {
          isEnrolled = true;
        }
      }

      const courseObj = course.toObject({ virtuals: true });

      // If NOT enrolled: Apply Free Trial Logic (First 2 lessons visible)
      if (!isEnrolled) {
        let lessonCount = 0;
        if (courseObj.modules) {
          courseObj.modules.forEach((mod: any) => {
            if (mod.lessons) {
              mod.lessons.forEach((lesson: any) => {
                // Allow first 2 lessons globally (0 and 1)
                if (lessonCount >= 2) {
                  lesson.content = "🔒 Enrollment Required to view this content.";
                  lesson.videoUrl = null;
                }
                lessonCount++;
              });
            }
          });
        }
      }

      return courseObj;
    },
    stats: async (_: any, __: any, context: any) => {
      if (!context.user || !['admin', 'super_admin'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }
      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const courses = await Course.find();

      // Count unique students across all courses
      const studentIds = new Set();
      courses.forEach(c => {
        c.studentsEnrolled.forEach(s => studentIds.add(s.toString()));
      });

      // Simple revenue calculation (price * students count for each course)
      const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.studentsEnrolled.length), 0);

      return {
        totalUsers,
        totalCourses,
        totalStudents: studentIds.size,
        totalRevenue
      };
    },
    me: async (_: any, __: any, context: any) => {
      if (!context.user) return null;
      return await User.findById(context.user.id)
        .populate('enrolledCourses')
        .populate('badges.badgeId');
    },
    categories: async () => {
      const courses = await Course.find();
      const categories = new Set(courses.map(c => c.category).filter(Boolean));
      return Array.from(categories);
    },
    trainerStudents: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== 'trainer') throw new Error('Not authorized');

      const courses = await Course.find({ instructor: context.user.id }).populate('studentsEnrolled');
      const studentsMap = new Map();

      courses.forEach(course => {
        course.studentsEnrolled.forEach((student: any) => {
          studentsMap.set(student.id, student);
        });
      });

      return Array.from(studentsMap.values());
    },
    recentActivity: async (_: any, __: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const users = await User.find({ role: 'student' }).limit(50);
      let activities: any[] = [];

      users.forEach(user => {
        if (user.activityLog) {
          user.activityLog.forEach((log: any) => {
            activities.push({
              username: user.username,
              action: log.action,
              details: log.details,
              timestamp: log.timestamp
            });
          });
        }
      });

      return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    },
    questions: async (_: any, { courseId, lessonId }: any) => {
      const query: any = { courseId };
      if (lessonId) query.lessonId = lessonId;
      return await Question.find(query).sort({ createdAt: 1 });
    },
    bookings: async (_: any, __: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }
      return await Booking.find().populate('userId').populate('mentorId').sort({ createdAt: -1 });
    },
    myBookings: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Booking.find({
        $or: [{ userId: context.user.id }, { mentorId: context.user.id }]
      }).populate('userId mentorId').sort({ createdAt: -1 });
    },

    payments: async (_: any, __: any, context: any) => {
      if (!context.user || !['admin', 'super_admin'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      // 1. Get from new Payment model
      const actualPayments = await Payment.find().populate('userId').sort({ createdAt: -1 });
      const transformedActual = actualPayments.map((p: any) => ({
        id: p.id,
        studentName: p.userId?.username || 'Unknown',
        type: p.type,
        itemTitle: p.itemTitle,
        amount: p.amount,
        currency: p.currency,
        date: p.createdAt.toISOString(),
        status: p.status,
        method: p.paymentMethod || 'Mobile Money'
      }));

      // 2. Get Internship Payments (Legacy fallback/sync)
      const internships = await Internship.find({}).populate('userId');
      const internshipPayments = internships.map((i: any) => ({
        id: `int_${i.id}`,
        studentName: i.userId?.username || 'Unknown',
        type: 'Internship Fee',
        itemTitle: i.title,
        amount: i.payment.amount,
        currency: i.payment.currency || 'RWF',
        date: i.payment.paidAt ? i.payment.paidAt.toISOString() : i.createdAt.toISOString(),
        status: i.payment.status === 'paid' ? 'completed' : i.payment.status,
        method: 'Mobile Money'
      }));

      // 3. Get Course Enrollments (Legacy fallback/sync)
      const students = await User.find({ role: 'student', enrolledCourses: { $exists: true, $not: { $size: 0 } } })
        .populate('enrolledCourses');

      let courseEnrollmentPayments: any[] = [];
      students.forEach((student: any) => {
        student.enrolledCourses.forEach((course: any) => {
          courseEnrollmentPayments.push({
            id: `course_${student.id}_${course.id}`,
            studentName: student.username,
            type: 'Course Enrollment',
            itemTitle: course.title,
            amount: (course.price || 0) * 1000,
            currency: 'RWF',
            date: student.createdAt.toISOString(),
            status: 'completed',
            method: 'Card'
          });
        });
      });

      // Combine and filter duplicates by ID (if any)
      const combined = [...transformedActual, ...internshipPayments, ...courseEnrollmentPayments];
      return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    myPayments: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const payments = await Payment.find({ userId: context.user.id }).sort({ createdAt: -1 });
      return payments.map((p: any) => ({
        id: p.id,
        studentName: context.user.username,
        type: p.type,
        itemTitle: p.itemTitle,
        amount: p.amount,
        currency: p.currency,
        date: p.createdAt.toISOString(),
        status: p.status,
        method: p.paymentMethod
      }));
    },
    configs: async (_: any, __: any, context: any) => {
      return await Config.find();
    },

    badges: async () => await Badge.find(),

    trainerStats: async (_: any, __: any, context: any) => {
      if (!context.user || context.user.role !== 'trainer') throw new Error('Not authorized');

      const activeCourses = await Course.countDocuments({ instructor: context.user.id, status: 'published' });

      const myCourses = await Course.find({ instructor: context.user.id });
      const studentIds = new Set();
      myCourses.forEach(c => c.studentsEnrolled.forEach((s: any) => studentIds.add(s.toString())));

      const myCourseTitles = myCourses.map(c => c.title);
      const pendingReviews = await Project.countDocuments({
        course: { $in: myCourseTitles }, // Simple string match on course title
        status: { $in: ['pending_review', 'submitted', 'in_progress'] } // widened search for demo
      });

      // Count unique mentees from bookings
      const explicitMentees = await Booking.distinct('userId', { mentorId: context.user.id });

      return {
        activeCourses,
        totalStudents: studentIds.size,
        pendingReviews,
        mentees: explicitMentees.length
      };
    },

    adminDashboardData: async (_: any, __: any, context: any) => {
      if (!context.user || !['admin', 'super_admin'].includes(context.user.role)) throw new Error('Not authorized');

      const totalUsers = await User.countDocuments();
      const totalCourses = await Course.countDocuments();
      const courses = await Course.find().populate('studentsEnrolled');

      const studentIds = new Set();
      let totalRevenue = 0;
      const performanceData = [];

      for (const c of courses) {
        c.studentsEnrolled.forEach((s: any) => studentIds.add(s.toString()));
        const revenue = (c.price || 0) * c.studentsEnrolled.length;
        totalRevenue += revenue;

        performanceData.push({
          courseTitle: c.title,
          studentCount: c.studentsEnrolled.length,
          revenue,
          avgCompletion: Math.floor(Math.random() * 40) + 40 // Simulated avg for now
        });
      }

      // Recent Enrollments (Approximated by User updates for now)
      const recentStudents = await User.find({ enrolledCourses: { $not: { $size: 0 } } })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('enrolledCourses');

      const recentEnrollments = recentStudents.map(s => {
        const course = (s as any).enrolledCourses[(s as any).enrolledCourses.length - 1];
        return {
          studentName: s.username,
          courseTitle: course?.title || 'Unknown Course',
          enrolledAt: new Date((s as any).updatedAt).toLocaleDateString(),
          amount: course?.price || 0
        };
      });

      return {
        stats: {
          totalUsers,
          totalCourses,
          totalStudents: studentIds.size,
          totalRevenue
        },
        recentEnrollments,
        coursePerformance: performanceData
      };
    },

    analytics: async (_: any, __: any, context: any) => {
      if (!context.user || !['admin', 'super_admin'].includes(context.user.role)) throw new Error('Not authorized');

      // 1. User Role Distribution
      const roles = ['student', 'trainer', 'admin', 'super_admin'];
      const roleDistribution = await Promise.all(roles.map(async role => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: await User.countDocuments({ role })
      })));

      // 2. Course Distribution (Students per course)
      const courses = await Course.find();
      const courseDistribution = courses.map(c => ({
        name: c.title,
        value: c.studentsEnrolled.length
      }));

      // 3. User Growth (Simulated over last 6 months based on createdAt)
      const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
      const userGrowth = months.map((month, i) => ({
        label: month,
        value: 50 + (i * 15) + Math.floor(Math.random() * 20) // Simulated growth
      }));

      // 4. Revenue Growth (Simulated)
      const revenueGrowth = months.map((month, i) => ({
        label: month,
        value: (i + 1) * 100 + Math.floor(Math.random() * 50)
      }));

      // 5. Internship Stats
      const internshipStats = {
        total: await Internship.countDocuments(),
        eligible: await Internship.countDocuments({ status: 'eligible' }),
        enrolled: await Internship.countDocuments({ status: 'enrolled' }),
        graduated: await Internship.countDocuments({ status: 'graduated' })
      };

      // 6. Project Stats
      const projectStats = {
        total: await Project.countDocuments(),
        completed: await Project.countDocuments({ status: 'completed' }),
        pendingReview: await Project.countDocuments({ status: 'pending_review' }),
        inProgress: await Project.countDocuments({ status: 'in_progress' })
      };

      return {
        roleDistribution,
        courseDistribution,
        userGrowth,
        revenueGrowth,
        internshipStats,
        projectStats
      };
    },

    // Projects
    projects: async (_: any, __: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      return await Project.find().populate('userId').sort({ createdAt: -1 });
    },
    myProjects: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Project.find({ userId: context.user.id }).populate('userId').sort({ createdAt: -1 });
    },
    project: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = await Project.findById(id).populate('userId');
      if (!project) throw new Error('Project not found');

      // Check if user owns the project or is admin/trainer
      if (project.userId.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }
      return project;
    },

    // Certificates
    certificates: async (_: any, __: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      return await Certificate.find().populate('userId courseId').sort({ createdAt: -1 });
    },
    myCertificates: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Certificate.find({ userId: context.user.id }).populate('userId courseId').sort({ createdAt: -1 });
    },
    certificate: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const certificate = await Certificate.findById(id).populate('userId courseId');
      if (!certificate) throw new Error('Certificate not found');

      // Check if user owns the certificate or is admin/trainer
      if (certificate.userId.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }
      return certificate;
    },

    myCourseProgress: async (_: any, { courseId }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      let progress = await CourseProgress.findOne({ userId: context.user.id, courseId });
      return progress;
    },

    // Internships
    internships: async (_: any, __: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      return await Internship.find().populate('userId mentorId').sort({ createdAt: -1 });
    },
    myInternship: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Internship.findOne({ userId: context.user.id }).populate('userId mentorId');
    },
    internship: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const internship = await Internship.findById(id).populate('userId mentorId');
      if (!internship) throw new Error('Internship not found');

      // Check if user owns the internship or is admin/trainer/mentor
      if (internship.userId.toString() !== context.user.id &&
        internship.mentorId?.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }
      return internship;
    },
    internshipStages: async () => {
      // These can eventually be fetched from Config model if customized
      return [
        {
          id: 1,
          title: "Orientation & Onboarding",
          duration: "1–2 weeks",
          purpose: "Help interns understand the platform, tools, expectations, and career pathways.",
          keyActivities: ["Platform introduction", "Internship rules & ethics", "Digital tools setup", "Baseline skills assessment", "Goal setting"],
          outcome: "Interns are ready, confident, and aligned with the program."
        },
        {
          id: 2,
          title: "Foundation Skills Training",
          duration: "4–6 weeks",
          purpose: "Build strong practical and job-ready skills aligned with market needs.",
          keyActivities: ["Core technical skills", "Soft skills", "Practical exercises & mini-projects", "Continuous assessments"],
          outcome: "Interns gain industry-relevant foundational skills."
        },
        {
          id: 3,
          title: "Guided Practical Projects",
          duration: "6–8 weeks",
          purpose: "Apply learned skills to real-world problems.",
          keyActivities: ["Assigned company projects", "Weekly mentorship sessions", "Code reviews", "Team collaboration"],
          outcome: "Interns build portfolio-ready projects and confidence."
        },
        {
          id: 4,
          title: "Industry Internship / Work Simulation",
          duration: "8–12 weeks",
          purpose: "Expose interns to real working environments, even remotely.",
          keyActivities: ["Task deadlines and reporting", "Time tracking", "Performance monitoring", "Professional communication"],
          outcome: "Interns gain hands-on work experience."
        },
        {
          id: 5,
          title: "Evaluation & Certification",
          duration: "1–2 weeks",
          purpose: "Measure competence and recognize achievement.",
          keyActivities: ["Final project presentation", "Skills evaluation", "Performance review", "Certification issuance"],
          outcome: "Interns receive recognized certificates and feedback."
        },
        {
          id: 6,
          title: "Career Transition & Placement Support",
          duration: "Ongoing",
          purpose: "Support interns to transition into employment or entrepreneurship.",
          keyActivities: ["CV & portfolio support", "Interview preparation", "Job matching", "Freelancing guidance"],
          outcome: "Interns move into jobs or self-employment."
        }
      ];
    },
    myMentees: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      if (context.user.role !== 'trainer' && context.user.role !== 'admin' && context.user.role !== 'super_admin') {
        throw new Error('Not authorized');
      }

      // Get all internships where the current user is the mentor
      return await Internship.find({ mentorId: context.user.id })
        .populate('userId mentorId')
        .sort({ createdAt: -1 });
    },
    branding: async () => {
      const config = await Config.findOne({ key: 'branding' });
      const siteName = await Config.findOne({ key: 'siteName' });
      const primaryColor = await Config.findOne({ key: 'primaryColor' });
      const portalTitle = await Config.findOne({ key: 'portalTitle' });

      const defaults = {
        primaryColor: '#D4AF37',
        secondaryColor: '#B08D2A',
        accentColor: '#D4AF37',
        logoUrl: '',
        siteName: 'CODEMANDE',
        portalTitle: 'Academy Hub'
      };

      const brandingVal = config?.value || {};

      return {
        ...defaults,
        ...brandingVal,
        siteName: siteName?.value || brandingVal.siteName || defaults.siteName,
        primaryColor: primaryColor?.value || brandingVal.primaryColor || defaults.primaryColor,
        portalTitle: portalTitle?.value || brandingVal.portalTitle || defaults.portalTitle,
      };
    },
  },
  Mutation: {
    enroll: async (_: any, { courseId }: { courseId: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const targetId = typeof courseId === 'object' ? ((courseId as any).id || (courseId as any)._id) : courseId;
      const course = await Course.findById(targetId);
      if (!course) throw new Error(`Course not found for ID: ${targetId}`);

      // Check Enrollment Limits
      if (course.maxStudents && course.studentsEnrolled.length >= course.maxStudents) {
        throw new Error('Course is full.');
      }

      const user = await User.findById(context.user.id);
      if (!user) throw new Error('User not found');

      // Check if already enrolled in Course
      const isEnrolledInCourse = course.studentsEnrolled.some((s: any) => s.toString() === user.id);
      if (!isEnrolledInCourse) {
        course.studentsEnrolled.push(user.id as any);
        await course.save();
      }

      // Check if already enrolled in User
      const isEnrolledInUser = (user as any).enrolledCourses.some((c: any) => c.toString() === targetId);
      if (!isEnrolledInUser) {
        (user as any).enrolledCourses.push(targetId as any);

        // If course has a price, record a payment
        if (course.price && course.price > 0) {
          await new Payment({
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            currency: 'RWF',
            status: 'completed',
            paymentMethod: 'Pre-enrolled',
            transactionId: `TXN-ENR-${Math.random().toString(36).substring(7).toUpperCase()}`,
            type: 'Course Enrollment',
            itemTitle: course.title
          }).save();
        }

        await user.save();
      }

      // Initialize Course Progress (Idempotent)
      await CourseProgress.findOneAndUpdate(
        { userId: user.id, courseId: course.id },
        {
          $setOnInsert: {
            userId: user.id,
            courseId: course.id,
            totalTimeSpent: 0,
            overallProgress: 0,
            status: 'active',
            lessons: []
          }
        },
        { upsert: true, new: true }
      );

      return await course.populate('instructor studentsEnrolled');
    },

    createCourse: async (_: any, { instructorId, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      if (context.user.role !== 'trainer' && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      const course = new Course({
        ...args,
        instructor: instructorId || context.user.id
      });
      await course.save();
      return await course.populate('instructor');
    },

    updateCourse: async (_: any, { id, instructorId, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const course = await Course.findById(id);
      if (!course) throw new Error('Course not found');

      // Check ownership or admin role
      if (course.instructor.toString() !== context.user.id && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized to update this course');
      }

      const updateData: any = { ...args };
      if (instructorId) updateData.instructor = instructorId;

      // Restrict financial and identity updates to admins/super_admins only
      if (context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        const restrictedFields = [
          'price', 'discountPrice', 'title', 'description',
          'thumbnail', 'level', 'category', 'instructor'
        ];
        restrictedFields.forEach(field => {
          delete updateData[field];
        });
      }

      Object.assign(course, updateData);
      await course.save();
      return await course.populate('instructor studentsEnrolled');
    },

    deleteCourse: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const course = await Course.findById(id);
      if (!course) throw new Error('Course not found');

      if (course.instructor.toString() !== context.user.id && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized to delete this course');
      }

      // Soft delete
      (course as any).isDeleted = true;
      (course as any).status = 'archived';
      await course.save();
      return true;
    },

    updateLessonProgress: async (_: any, { courseId, lessonId, timeSpent, completed }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      let progress = await CourseProgress.findOne({ userId: context.user.id, courseId });
      if (!progress) {
        progress = new CourseProgress({ userId: context.user.id, courseId, lessons: [] });
      }

      const lessonIndex = progress.lessons.findIndex((l: any) => l.lessonId === lessonId);
      if (lessonIndex > -1) {
        progress.lessons[lessonIndex].timeSpent += timeSpent;
        if (completed) progress.lessons[lessonIndex].completed = true;
        progress.lessons[lessonIndex].lastAccessed = new Date();
        progress.lessons[lessonIndex].visits = (progress.lessons[lessonIndex].visits || 0) + 1;
      } else {
        progress.lessons.push({
          lessonId,
          completed: completed || false,
          timeSpent: timeSpent,
          lastAccessed: new Date(),
          visits: 1
        });
      }

      progress.lastAccessed = new Date();
      progress.totalTimeSpent = progress.lessons.reduce((acc: number, l: any) => acc + l.timeSpent, 0);

      await progress.save();
      return true;
    },

    completeLesson: async (_: any, { courseId, lessonId }: { courseId: string, lessonId: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const targetCourseId = typeof courseId === 'object' ? ((courseId as any).id || (courseId as any)._id) : courseId;
      const targetLessonId = typeof lessonId === 'object' ? ((lessonId as any).id || (lessonId as any)._id) : lessonId;

      const user = await User.findById(context.user.id);
      if (!user) throw new Error('User not found');

      // Check if already completed
      const isAlreadyCompleted = user.completedLessons?.some((l: any) =>
        l.courseId.toString() === targetCourseId && l.lessonId === targetLessonId
      );

      if (!isAlreadyCompleted) {
        user.completedLessons.push({ courseId: targetCourseId as any, lessonId: targetLessonId });
        await user.save();
      }

      // Also update detailed progress
      const progress = await CourseProgress.findOne({ userId: context.user.id, courseId: targetCourseId });
      if (progress) {
        const lIdx = progress.lessons.findIndex((l: any) => l.lessonId === targetLessonId);
        if (lIdx > -1) {
          progress.lessons[lIdx].completed = true;
          await progress.save();
        }
      }

      return await user.populate('enrolledCourses');
    },

    createUser: async (_: any, { username, email, password, role, permissions }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'student',
        permissions: permissions || []
      });
      await user.save();
      return user;
    },

    updateUser: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const user = await User.findById(id);
      if (!user) throw new Error('User not found');

      Object.assign(user, args);
      await user.save();
      return user;
    },

    deleteUser: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }

      const user = await User.findById(id);
      if (!user) throw new Error('User not found');
      if (user.role === 'super_admin') throw new Error('Cannot delete super admin');

      // Soft Delete
      (user as any).isDeleted = true;
      (user as any).status = 'deactivated';
      await user.save();
      return true;
    },
    sendMessage: async (_: any, { receiverId, content }: { receiverId: string, content: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const senderId = context.user.id;

      // Check if conversation exists
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId]
        });
      }

      const message = new Message({
        conversationId: conversation.id,
        sender: senderId,
        content
      });

      await message.save();

      // Update conversation last message
      conversation.lastMessage = message._id as any;
      await conversation.save();

      // Populate sender for return
      await message.populate('sender');

      // Emit to receiver's room
      context.io.to(receiverId).emit('receive_message', message);
      // Also emit to sender (if they have multiple tabs open)
      context.io.to(senderId).emit('receive_message', message);

      return message;
    },
    register: async (_: any, { username, email, password }: any) => {
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username, role: (user as any).role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );

      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Check Account Status
      if ((user as any).status === 'suspended') throw new Error('Account is suspended. Contact support.');
      if ((user as any).status === 'deactivated') throw new Error('Account is deactivated.');
      if ((user as any).isDeleted) throw new Error('User not found');

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Wrong credentials');
      }

      // Update Presence & Status
      (user as any).isOnline = true;
      (user as any).lastActive = new Date();
      (user as any).status = 'active'; // Ensure active on login
      await user.save();

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username, role: (user as any).role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '30d' }
      );

      return { token, user };
    },
    trackActivity: async (_: any, { action, details, path }: { action: string, details?: string, path?: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const user = await User.findById(context.user.id);
      if (!user) throw new Error('User not found');

      const now = new Date();

      // Calculate Time Spent (if lastActive was recent, < 30 mins)
      if ((user as any).lastActive) {
        const diff = (now.getTime() - new Date((user as any).lastActive).getTime()) / 1000; // seconds
        if (diff < 1800 && diff > 0) {
          (user as any).totalTimeSpent = ((user as any).totalTimeSpent || 0) + diff;
        }
      }

      (user as any).lastActive = now;
      if (path) (user as any).lastPath = path;

      (user as any).activityLog.push({ action, details, timestamp: now });

      if ((user as any).activityLog.length > 200) (user as any).activityLog.shift();

      await user.save();
      return user;
    },
    createQuestion: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const course = await Course.findById(args.courseId);
      if (!course) throw new Error('Course not found');
      if (course.instructor.toString() !== context.user.id && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      const question = new Question(args);
      await question.save();
      return question;
    },
    updateQuestion: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const question = await Question.findById(id);
      if (!question) throw new Error('Question not found');
      const course = await Course.findById(question.courseId);
      if (course?.instructor.toString() !== context.user.id && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      Object.assign(question, args);
      await question.save();
      return question;
    },
    deleteQuestion: async (_: any, { id }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const question = await Question.findById(id);
      if (!question) throw new Error('Question not found');
      const course = await Course.findById(question.courseId);
      if (course?.instructor.toString() !== context.user.id && context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }
      await Question.findByIdAndDelete(id);
      return true;
    },


    createBadge: async (_: any, args: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) throw new Error('Not authorized');
      const badge = new Badge(args);
      await badge.save();
      return badge;
    },
    awardBadge: async (_: any, { userId, badgeId }: any, context: any) => {
      if (!context.user || (context.user.role !== 'trainer' && context.user.role !== 'admin' && context.user.role !== 'super_admin')) {
        throw new Error('Not authorized');
      }
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const alreadyHas = (user as any).badges.some((b: any) => b.badgeId.toString() === badgeId);
      if (!alreadyHas) {
        (user as any).badges.push({ badgeId });
        await user.save();
      }
      return await user.populate('badges.badgeId enrolledCourses');
    },
    submitGrade: async (_: any, { userId, courseId, lessonId, score, feedback }: any, context: any) => {
      if (!context.user || (context.user.role !== 'trainer' && context.user.role !== 'admin' && context.user.role !== 'super_admin')) {
        throw new Error('Not authorized');
      }
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      (user as any).grades.push({
        courseId,
        lessonId,
        score,
        feedback,
        gradedBy: context.user.id
      });
      await user.save();
      return await user.populate('enrolledCourses');
    },
    promoteStudent: async (_: any, { userId, academicStatus, level }: any, context: any) => {
      if (!context.user || (context.user.role !== 'admin' && context.user.role !== 'super_admin')) {
        throw new Error('Not authorized');
      }
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (academicStatus) (user as any).academicStatus = academicStatus;
      if (level) (user as any).level = level;

      await user.save();
      return await user.populate('enrolledCourses badgeId');
    },

    updateBadge: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) throw new Error('Not authorized');
      const badge = await Badge.findById(id);
      if (!badge) throw new Error('Badge not found');
      Object.assign(badge, args);
      await badge.save();
      return badge;
    },

    deleteBadge: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) throw new Error('Not authorized');
      const badge = await Badge.findById(id);
      if (!badge) throw new Error('Badge not found');
      await Badge.findByIdAndDelete(id);
      return true;
    },
    updateConfig: async (_: any, { key, value, description }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) throw new Error('Not authorized');
      let config = await Config.findOne({ key });
      if (config) {
        config.value = value;
        if (description) config.description = description;
        await config.save();
      } else {
        config = new Config({ key, value, description });
        await config.save();
      }

      // Update branding mega-config if a relevant key is changed
      const brandingKeys = ['siteName', 'primaryColor', 'portalTitle'];
      if (brandingKeys.includes(key)) {
        let brandingConfig = await Config.findOne({ key: 'branding' });
        if (brandingConfig) {
          brandingConfig.value = { ...brandingConfig.value, [key]: value };
          await brandingConfig.save();
        }
      }

      return config;
    },

    // Projects Mutations
    createProject: async (_: any, { mentorIds, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = new Project({
        ...args,
        userId: context.user.id,
        mentors: mentorIds || [context.user.id],
        status: 'in_progress',
        progress: 0,
      });
      await project.save();
      return await project.populate('userId');
    },
    updateProject: async (_: any, { id, mentorIds, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = await Project.findById(id);
      if (!project) throw new Error('Project not found');

      // Check ownership or admin/trainer role
      if (project.userId.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }

      Object.assign(project, args);
      if (mentorIds) project.mentors = mentorIds;
      await project.save();
      return await project.populate('userId');
    },
    deleteProject: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = await Project.findById(id);
      if (!project) throw new Error('Project not found');

      // Check ownership or admin role
      if (project.userId.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin') {
        throw new Error('Not authorized');
      }

      await Project.findByIdAndDelete(id);
      return true;
    },
    submitProject: async (_: any, { id, submissionUrl }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = await Project.findById(id);
      if (!project) throw new Error('Project not found');

      if (project.userId.toString() !== context.user.id) {
        throw new Error('Not authorized');
      }

      project.status = 'pending_review';
      project.progress = 100;
      project.submittedAt = new Date();
      project.submissionUrl = submissionUrl;
      await project.save();
      return await project.populate('userId');
    },

    autoGroupStudents: async (_: any, { courseId, projectTitle, description, deadline }: any, context: any) => {
      if (!context.user || (context.user.role !== 'trainer' && context.user.role !== 'admin' && context.user.role !== 'super_admin')) {
        throw new Error('Not authorized');
      }

      const course = await Course.findById(courseId).populate('studentsEnrolled');
      if (!course) throw new Error('Course not found');

      // Get students
      const students = (course.studentsEnrolled as any[]);

      // Shuffle array
      const shuffled = [...students].sort(() => 0.5 - Math.random());

      const projects = [];
      const chunkSize = 3;

      for (let i = 0; i < shuffled.length; i += chunkSize) {
        const group = shuffled.slice(i, i + chunkSize);

        // Create team metadata
        const team = group.map((s: any) => ({
          name: s.username,
          role: 'Member'
        }));

        // Create Project for each member
        for (const student of group) {
          const project = new Project({
            userId: student._id,
            title: projectTitle,
            course: course.title,
            type: 'Team Project',
            description: description,
            deadline: deadline ? new Date(deadline) : null,
            status: 'in_progress',
            progress: 0,
            team: team,
            tasks: []
          });
          await project.save();
          projects.push(project);
        }
      }

      return projects;
    },

    createBooking: async (_: any, args: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const booking = new Booking({
        userId: context.user.id,
        ...args,
        status: 'pending'
      });

      await booking.save();

      // Notify mentor via socket
      if (context.io && args.mentorId) {
        context.io.to(args.mentorId).emit('new_booking', booking);
      }
      return booking;
    },

    updateBookingStatus: async (_: any, { id, status, meetingLink }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const booking = await Booking.findById(id);
      if (!booking) throw new Error('Booking not found');

      // Check auth
      if (context.user.role !== 'admin' && context.user.role !== 'super_admin' && context.user.role !== 'trainer' && booking.mentorId?.toString() !== context.user.id) {
        // Allow user to cancel their own booking
        if (booking.userId.toString() === context.user.id && status === 'cancelled') {
          // allowed
        } else {
          throw new Error('Not authorized');
        }
      }

      booking.status = status;
      if (meetingLink) booking.meetingLink = meetingLink;
      await booking.save();

      // Notify user
      if (context.io) {
        context.io.to(booking.userId.toString()).emit('booking_updated', booking);
      }

      return booking;
    },

    // Certificates Mutations
    createCertificate: async (_: any, args: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      const certificate = new Certificate({
        ...args,
        status: 'in_progress',
        progress: 0,
      });
      await certificate.save();
      return await certificate.populate('userId courseId');
    },
    updateCertificate: async (_: any, { id, ...args }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      const certificate = await Certificate.findById(id);
      if (!certificate) throw new Error('Certificate not found');

      Object.assign(certificate, args);
      await certificate.save();
      return await certificate.populate('userId courseId');
    },
    issueCertificate: async (_: any, { id, credentialId }: any, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin' && context.user.role !== 'trainer')) {
        throw new Error('Not authorized');
      }
      const certificate = await Certificate.findById(id);
      if (!certificate) throw new Error('Certificate not found');

      certificate.status = 'issued';
      certificate.issueDate = new Date();
      certificate.credentialId = credentialId;
      certificate.progress = 100;
      await certificate.save();
      return await certificate.populate('userId courseId');
    },
    deleteCertificate: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }
      await Certificate.findByIdAndDelete(id);
      return true;
    },

    // Internships Mutations
    createInternship: async (_: any, { mentorIds, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      // If not admin, check if the student is creating an internship for themselves
      if (context.user.role !== 'super_admin' && context.user.role !== 'admin') {
        if (args.userId !== context.user.id) {
          throw new Error('Not authorized to create internship for another user');
        }
      }
      const internship = new Internship({
        ...args,
        organization: args.organization || 'Codemande Academy',
        mentors: mentorIds || (args.mentorId ? [args.mentorId] : []),
        status: 'eligible',
        progress: 0,
      });
      await internship.save();
      return await internship.populate('userId mentorId projects');
    },

    addInternshipTask: async (_: any, { internshipId, title, priority }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const internship = await Internship.findById(internshipId);
      if (!internship) throw new Error('Internship not found');

      const newTask = {
        title,
        priority: priority || 'medium',
        status: 'pending'
      };

      internship.tasks = [...(internship.tasks || []), newTask as any];

      // Recalculate progress
      const currentStage = internship.currentStage || 1;
      const totalStages = 6;
      const baseProgress = ((currentStage - 1) / totalStages) * 100;
      const completedTasks = internship.tasks.filter((t: any) => t.status === 'completed').length;
      const stageContribution = (completedTasks / internship.tasks.length) * (100 / totalStages);
      internship.progress = Math.min(100, Math.round(baseProgress + stageContribution));

      await internship.save();
      return await internship.populate('userId mentorId');
    },

    addBatchTask: async (_: any, { internshipIds, stage, cohort, title, priority }: any, context: any) => {
      if (!context.user || !['admin', 'super_admin', 'trainer'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      let query: any = {};
      if (internshipIds && internshipIds.length > 0) {
        query = { _id: { $in: internshipIds } };
      } else if (stage || cohort) {
        if (stage) query.currentStage = stage;
        if (cohort) query.cohort = cohort;
      } else {
        throw new Error('Please provide internship IDs, stage or cohort');
      }

      const interns = await Internship.find(query);
      for (const intern of interns) {
        const newTask = {
          title,
          priority: priority || 'medium',
          status: 'pending'
        };
        intern.tasks = [...(intern.tasks || []), newTask as any];

        // Recalculate progress
        const currentStage = intern.currentStage || 1;
        const totalStages = 6;
        const baseProgress = ((currentStage - 1) / totalStages) * 100;
        const completedTasks = intern.tasks.filter((t: any) => t.status === 'completed').length;
        const stageContribution = (completedTasks / intern.tasks.length) * (100 / totalStages);
        intern.progress = Math.min(100, Math.round(baseProgress + stageContribution));

        await intern.save();
      }
      return true;
    },

    updateInternshipTask: async (_: any, { internshipId, taskId, status }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const internship = await Internship.findById(internshipId);
      if (!internship) throw new Error('Internship not found');

      const task: any = (internship as any).tasks.id(taskId);
      if (!task) throw new Error('Task not found');

      task.status = status;

      // Recalculate progress
      const currentStage = internship.currentStage || 1;
      const totalStages = 6;
      const baseProgress = ((currentStage - 1) / totalStages) * 100;
      const completedTasks = (internship as any).tasks.filter((t: any) => t.status === 'completed').length;
      const stageContribution = (completedTasks / (internship as any).tasks.length) * (100 / totalStages);
      internship.progress = Math.min(100, Math.round(baseProgress + stageContribution));

      await internship.save();
      return await internship.populate('userId mentorId');
    },

    updateInternship: async (_: any, { id, mentorIds, ...args }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const internship = await Internship.findById(id);
      if (!internship) throw new Error('Internship not found');

      // Check ownership or admin/trainer/mentor role
      if (internship.userId.toString() !== context.user.id &&
        internship.mentorId?.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }

      Object.assign(internship, args);
      if (mentorIds) (internship as any).mentors = mentorIds;
      await internship.save();
      return await internship.populate('userId mentorId projects');
    },
    deleteInternship: async (_: any, { id }: { id: string }, context: any) => {
      if (!context.user || (context.user.role !== 'super_admin' && context.user.role !== 'admin')) {
        throw new Error('Not authorized');
      }
      await Internship.findByIdAndDelete(id);
      return true;
    },
    applyForInternship: async (_: any, { internshipId }: { internshipId: string }, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      // Check if user already has an internship
      const existing = await Internship.findOne({ userId: context.user.id });
      if (existing) throw new Error('You already have an internship');

      const internship = await Internship.findById(internshipId);
      if (!internship) throw new Error('Internship not found');

      internship.userId = context.user.id as any;
      internship.status = 'enrolled';
      await internship.save();
      return await internship.populate('userId mentorId');
    },
    promoteIntern: async (_: any, { internshipIds, targetStage }: any, context: any) => {
      if (!context.user || !['admin', 'super_admin', 'trainer'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      if (!internshipIds || internshipIds.length === 0) {
        throw new Error('No interns selected');
      }

      const stagesMap: any = {
        1: "Stage 1: Orientation & Onboarding",
        2: "Stage 2: Foundation Skills Training",
        3: "Stage 3: Guided Practical Projects",
        4: "Stage 4: Industry Internship / Work Simulation",
        5: "Stage 5: Evaluation & Certification",
        6: "Stage 6: Career Transition & Placement Support"
      };

      const interns = await Internship.find({ _id: { $in: internshipIds } });

      for (const intern of interns) {
        const oldStageTitle = intern.stage;
        intern.currentStage = targetStage;
        intern.stage = stagesMap[targetStage] || `Stage ${targetStage}`;

        // Calculate progress based on stage baseline
        const totalStages = 6;
        const baseProgress = ((targetStage - 1) / totalStages) * 100;

        intern.progress = Math.min(100, Math.round(baseProgress));

        if (!intern.completedStages.includes(oldStageTitle)) {
          intern.completedStages.push(oldStageTitle);
        }

        // Auto-update status based on stage
        if (targetStage === 5) intern.status = 'completed';
        if (targetStage === 6) {
          intern.status = 'graduated';
          intern.progress = 100;
        }

        await intern.save();
      }

      return true;
    },

    assignGroupProject: async (_: any, { internshipIds, title, description, repoUrl, deadline, mentorIds }: any, context: any) => {
      if (!context.user || !['admin', 'super_admin', 'trainer'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      if (!internshipIds || internshipIds.length === 0) {
        throw new Error('No interns selected');
      }

      // Fetch interns to get names for the project team
      const interns = await Internship.find({ _id: { $in: internshipIds } }).populate('userId');
      
      const projectTeam = interns.map((intern: any) => ({
        userId: intern.userId?._id || intern.userId?.id,
        name: intern.userId?.username || 'Unknown',
        role: 'Developer'
      }));

      // Create Group Conversation
      const participantIds = [
        context.user.id, 
        ...(mentorIds || []),
        ...interns.map((i: any) => i.userId?._id?.toString() || i.userId?.id?.toString())
      ].filter(Boolean);
      const uniqueParticipants = [...new Set(participantIds)];

      const newConversation = new Conversation({
        participants: uniqueParticipants
      });
      await newConversation.save();

      // Create new Project
      const newProject = new Project({
        userId: context.user.id,
        title,
        description,
        course: "Internship Project",
        type: 'Team Project',
        submissionUrl: repoUrl,
        deadline: deadline ? new Date(deadline) : undefined,
        status: 'in_progress',
        team: projectTeam,
        mentors: mentorIds || [context.user.id],
        conversationId: newConversation.id
      });
      
      await newProject.save();

      // Assign project to all interns
      await Internship.updateMany(
        { _id: { $in: internshipIds } },
        { 
          $push: { projects: newProject.id } 
        }
      );

      return newProject;
    },

    sendMessageToProject: async (_: any, { projectId, content }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const project = await Project.findById(projectId);
      if (!project) throw new Error('Project not found');

      let conversationId = project.conversationId;

      if (!conversationId) {
        const teamUserIds = project.team?.map((t: any) => t.userId).filter(Boolean) || [];
        const uniqueParticipants = [...new Set([project.userId.toString(), ...teamUserIds.map((id: any) => id.toString())])];
        
        const newConversation = new Conversation({
            participants: uniqueParticipants
        });
        await newConversation.save();
        
        project.conversationId = newConversation.id;
        await project.save();
        conversationId = newConversation.id;
      }

      const newMessage = new Message({
        conversationId,
        sender: context.user.id,
        content,
        read: false
      });
      
      await newMessage.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage.id,
        updatedAt: new Date()
      });

      return await newMessage.populate('sender');
    },

    updateInternshipPayment: async (_: any, { id, status, paidAt }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const internship = await Internship.findById(id);
      if (!internship) throw new Error('Internship not found');

      // Check ownership or admin role
      if (internship.userId.toString() !== context.user.id &&
        context.user.role !== 'super_admin' &&
        context.user.role !== 'admin' &&
        context.user.role !== 'trainer') {
        throw new Error('Not authorized');
      }

      const oldStatus = internship.payment.status;
      internship.payment.status = status;
      if (paidAt) internship.payment.paidAt = new Date(paidAt);

      // If newly paid, create a Payment record for tracking
      if ((status === 'paid' || status === 'completed') && oldStatus !== 'paid') {
        const existingPayment = await Payment.findOne({ internshipId: internship.id });
        if (!existingPayment) {
          await new Payment({
            userId: internship.userId,
            internshipId: internship.id,
            amount: internship.payment.amount,
            currency: internship.payment.currency || 'RWF',
            status: 'completed',
            paymentMethod: 'Mobile Money',
            transactionId: `TXN-INT-${Math.random().toString(36).substring(7).toUpperCase()}`,
            type: 'Internship Fee',
            itemTitle: internship.title
          }).save();
        }

        // Auto-approve registration if payment is successful
        if (internship.status === 'eligible' || internship.status === 'not_eligible') {
          internship.status = 'enrolled';
        }
      }

      // If already enrolled and payment is confirmed, start the journey
      if (status === 'paid' && internship.status === 'enrolled') {
        internship.status = 'in_progress';
      }

      await internship.save();
      return await internship.populate('userId mentorId');
    },

    awardBadgeToBatch: async (_: any, { userIds, badgeId }: any, context: any) => {
      if (!context.user || !['trainer', 'admin', 'super_admin'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      const session = await User.startSession();
      try {
        await session.withTransaction(async () => {
          for (const userId of userIds) {
            const user = await User.findById(userId);
            if (user) {
              const alreadyHas = (user as any).badges.some((b: any) => b.badgeId.toString() === badgeId);
              if (!alreadyHas) {
                (user as any).badges.push({ badgeId });
                await user.save({ session });
              }
            }
          }
        });
        return true;
      } catch (err) {
        console.error("Batch award failed:", err);
        return false;
      } finally {
        session.endSession();
      }
    },
    payForCourse: async (_: any, { courseId, amount, paymentMethod }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const targetId = typeof courseId === 'object' ? (courseId.id || courseId._id) : courseId;
      const course = await Course.findById(targetId);
      if (!course) throw new Error(`Course not found for ID: ${targetId}`);

      const user = await User.findById(context.user.id);
      if (!user) throw new Error('User not found');

      // Check if already enrolled
      const isEnrolled = user.enrolledCourses.some((id: any) => id.toString() === targetId);
      if (isEnrolled) {
        throw new Error('Already enrolled in this course');
      }

      // Record Payment
      const payment = new Payment({
        userId: user.id,
        courseId: course.id,
        amount,
        currency: 'RWF',
        status: 'completed',
        paymentMethod,
        transactionId: `TXN-${Math.random().toString(36).substring(7).toUpperCase()}`,
        type: 'Course Enrollment',
        itemTitle: course.title
      });
      await payment.save();

      // Update User
      user.enrolledCourses.push(course.id as any);
      (user as any).activityLog.push({
        action: 'COURSE_PAYMENT',
        details: `Paid ${amount} for ${course.title} via ${paymentMethod}`,
        timestamp: new Date()
      });
      await user.save();

      // Update Course
      const alreadyHasStudent = course.studentsEnrolled.some((s: any) => s.toString() === user.id);
      if (!alreadyHasStudent) {
        course.studentsEnrolled.push(user.id as any);
        await course.save();
      }

      return await course.populate('instructor studentsEnrolled');
    },

    updateTheme: async (_: any, { primaryColor, mode, lightBg, darkBg }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      const user = await User.findById(context.user.id);
      if (!user) throw new Error('User not found');

      (user as any).themePreference = {
        primaryColor: primaryColor === undefined ? user.themePreference?.primaryColor : primaryColor,
        mode: mode === undefined ? user.themePreference?.mode : mode,
        lightBg: lightBg === undefined ? user.themePreference?.lightBg : lightBg,
        darkBg: darkBg === undefined ? user.themePreference?.darkBg : darkBg
      };

      await user.save();
      return user;
    },

    updateBranding: async (_: any, args: any, context: any) => {
      if (!context.user || !['admin', 'super_admin'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }

      let config = await Config.findOne({ key: 'branding' });
      if (!config) {
        config = new Config({
          key: 'branding',
          value: {
            primaryColor: '#D4AF37',
            secondaryColor: '#B08D2A',
            accentColor: '#D4AF37',
            logoUrl: '',
            siteName: 'CODEMANDE',
            portalTitle: 'Academy Hub'
          }
        });
      }

      config.value = { ...config.value, ...args };
      await config.save();

      // Sync individual keys for consistency with SuperAdminConfig
      const syncKeys = ['siteName', 'primaryColor', 'portalTitle'];
      for (const key of syncKeys) {
        if (args[key]) {
          await Config.findOneAndUpdate(
            { key },
            { value: args[key] },
            { upsert: true }
          );
        }
      }

      return config.value;
    },

    updateTaskProgress: async (_: any, { projectId, taskId, completed }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');
      const project = await Project.findById(projectId);
      if (!project) throw new Error('Project not found');

      const task = project.tasks?.find((t: any) => t.id === taskId || t._id.toString() === taskId);
      if (!task) throw new Error('Task not found');

      task.completed = completed;
      
      // Calculate progress based on completed tasks
      const totalTasks = project.tasks?.length || 0;
      const completedTasks = project.tasks?.filter((t: any) => t.completed).length || 0;
      project.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      await project.save();
      return project;
    },

    approveProjectTask: async (_: any, { projectId, taskId, approved, feedback }: any, context: any) => {
      if (!context.user || !['admin', 'super_admin', 'trainer'].includes(context.user.role)) {
        throw new Error('Not authorized');
      }
      const project = await Project.findById(projectId);
      if (!project) throw new Error('Project not found');

      const task = project.tasks?.find((t: any) => t.id === taskId || t._id.toString() === taskId);
      if (!task) throw new Error('Task not found');

      task.approved = approved;
      task.feedback = feedback;

      await project.save();
      return project;
    },
  },
  User: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
    streak: async (parent: any) => {
      if (parent.academicStatus === 'active' || parent.role === 'student') {
        return Math.min((parent.level || 1) * 3 + Math.floor(Math.random() * 3), 100);
      }
      return 0;
    }
  },
  Booking: {
    user: async (parent: any) => {
      if (parent.userId && (parent.userId as any).username) return parent.userId;
      return await User.findById(parent.userId);
    },
    mentor: async (parent: any) => {
      if (parent.mentorId && (parent.mentorId as any).username) return parent.mentorId;
      if (!parent.mentorId) return null;
      return await User.findById(parent.mentorId);
    }
  },
  Project: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
    user: async (parent: any) => {
      if (parent.userId && (parent.userId as any).username) return parent.userId;
      return await User.findById(parent.userId);
    },
    mentors: async (parent: any) => {
      if (parent.mentors && parent.mentors.length > 0 && (parent.mentors[0] as any).username) return parent.mentors;
      return await User.find({ _id: { $in: parent.mentors || [] } });
    }
  },
  TeamMember: {
    user: async (parent: any) => {
      if (!parent.userId) return null;
      if ((parent.userId as any).username) return parent.userId;
      return await User.findById(parent.userId);
    }
  },
  Certificate: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
    user: async (parent: any) => {
      if (parent.userId && (parent.userId as any).username) return parent.userId;
      return await User.findById(parent.userId);
    },
    course: async (parent: any) => {
      if (parent.courseId && (parent.courseId as any).title) return parent.courseId;
      return await Course.findById(parent.courseId);
    }
  },
  Internship: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
    user: async (parent: any) => await User.findById(parent.userId),
    mentor: async (parent: any) => await User.findById(parent.mentorId),
    mentors: async (parent: any) => {
      if (parent.mentors && parent.mentors.length > 0 && (parent.mentors[0] as any).username) return parent.mentors;
      return await User.find({ _id: { $in: parent.mentors || [] } });
    },
    projects: async (parent: any) => await Project.find({ _id: { $in: parent.projects } }),
  },
  Message: {
    sender: async (parent: any) => {
      if (parent.sender && (parent.sender as any).username) return parent.sender;
      return await User.findById(parent.sender);
    }
  },
  Conversation: {
    participants: async (parent: any) => {
      if (parent.participants && parent.participants.length > 0 && (parent.participants[0] as any).username) return parent.participants;
      return await User.find({ _id: { $in: parent.participants } });
    },
    lastMessage: async (parent: any) => {
      if (parent.lastMessage && (parent.lastMessage as any).content) return parent.lastMessage;
      return await Message.findById(parent.lastMessage);
    }
  },
  Course: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
  },
  Module: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
  },
  Lesson: {
    id: (parent: any) => parent.id || parent._id || parent.toString(),
  }
};

