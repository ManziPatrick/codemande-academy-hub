export const typeDefs = `#graphql
  type AuthPayload {
    token: String!
    user: User!
  }

  type CompletedLesson {
    courseId: ID!
    lessonId: String!
  }

  type LessonProgress {
    lessonId: String!
    completed: Boolean!
    timeSpent: Int!
    lastAccessed: String
    visits: Int
  }

  type CourseProgress {
    id: ID!
    userId: ID!
    courseId: ID!
    lessons: [LessonProgress]
    totalTimeSpent: Int
    overallProgress: Int
    status: String
    lastAccessed: String
  }

  type Activity {
    action: String!
    details: String
    timestamp: String!
  }

  type UserBadge {
    badge: Badge
    awardedAt: String
  }

  type Grade {
    courseId: ID!
    lessonId: String
    score: Int
    feedback: String
    gradedBy: User
    gradedAt: String
  }

  type Badge {
    id: ID!
    title: String!
    description: String!
    icon: String
    category: String
  }

  type ThemePreference {
    primaryColor: String
    mode: String
    lightBg: String
    darkBg: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    enrolledCourses: [Course]
    completedLessons: [CompletedLesson]
    activityLog: [Activity]
    badges: [UserBadge]
    grades: [Grade]
    level: Int
    academicStatus: String
    permissions: [String]
    streak: Int
    themePreference: ThemePreference
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    createdAt: String!
    conversationId: ID!
  }

  type Conversation {
    id: ID!
    participants: [User!]!
    lastMessage: Message
    updatedAt: String!
  }

  type Config {
    id: ID!
    key: String!
    value: String!
    description: String
  }

  type Resource {
    title: String!
    url: String!
    type: String!
  }

  type Lesson {
    id: ID!
    title: String!
    content: String
    videoUrl: String
    fileUrl: String
    duration: Int
    type: String
    resources: [Resource]
  }

  type Module {
    id: ID!
    title: String!
    description: String
    lessons: [Lesson!]!
  }

  type ProgramStage {
    id: Int!
    title: String!
    duration: String!
    purpose: String!
    keyActivities: [String!]!
    outcome: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    thumbnail: String
    instructor: User!
    price: Float
    discountPrice: Float
    level: String
    category: String
    status: String
    modules: [Module!]!
    studentsEnrolled: [User!]!
    updatedAt: String!
  }

  type Stats {
    totalUsers: Int!
    totalCourses: Int!
    totalStudents: Int!
    totalRevenue: Float!
  }

  type ActivityLogEntry {
    username: String!
    action: String!
    details: String
    timestamp: String!
  }

  type Question {
    id: ID!
    courseId: ID!
    lessonId: ID
    questionText: String!
    options: [String!]!
    correctOptionIndex: Int!
    explanation: String
    createdAt: String!
  }

  type PaymentTransaction {
    id: ID!
    studentName: String!
    type: String! # 'Course Enrollment' or 'Internship Fee'
    itemTitle: String!
    amount: Float!
    currency: String!
    date: String!
    status: String!
    method: String
  }

  type Booking {
    id: ID!
    userId: ID!
    user: User
    mentorId: ID
    mentor: User
    type: String!
    date: String!
    time: String!
    topic: String
    notes: String
    status: String
    meetingLink: String
    createdAt: String
  }

  type TeamMember {
    name: String!
    role: String!
  }

  type Task {
    title: String!
    completed: Boolean!
  }

  type Project {
    id: ID!
    userId: ID!
    user: User
    title: String!
    course: String!
    type: String!
    status: String!
    progress: Int!
    deadline: String
    submittedAt: String
    grade: String
    feedback: String
    team: [TeamMember]
    tasks: [Task]
    description: String!
    submissionUrl: String
    createdAt: String!
    updatedAt: String!
  }

  type Requirement {
    title: String!
    completed: Boolean!
    current: Int
    total: Int
  }

  type Certificate {
    id: ID!
    userId: ID!
    user: User
    courseId: ID!
    course: Course
    courseTitle: String!
    issueDate: String
    credentialId: String
    status: String!
    progress: Int
    requirements: [Requirement]
    createdAt: String!
    updatedAt: String!
  }

  type Payment {
    amount: Float!
    currency: String!
    status: String!
    paidAt: String
    discount: Int
  }

  type Milestone {
    title: String!
    completed: Boolean!
    date: String!
  }

  type InternshipTask {
    id: ID!
    title: String!
    status: String!
    priority: String!
  }

  type Meeting {
    title: String!
    time: String!
    type: String!
  }

  type Internship {
    id: ID!
    userId: ID!
    user: User
    title: String!
    organization: String!
    company: String
    cohort: String
    startDate: String
    endDate: String
    duration: String!
    type: String!
    status: String!
    stage: String
    currentStage: Int
    completedStages: [String]
    projects: [Project]
    mentorId: ID
    mentor: User
    payment: Payment!
    progress: Int!
    milestones: [Milestone]
    tasks: [InternshipTask]
    meetings: [Meeting]
    createdAt: String!
    updatedAt: String!
  }

  type AnalyticsData {
    userGrowth: [ChartPoint]
    revenueGrowth: [ChartPoint]
    courseDistribution: [DistributionPoint]
    roleDistribution: [DistributionPoint]
    internshipStats: InternshipAnalytics
    projectStats: ProjectAnalytics
  }

  type ChartPoint {
    label: String!
    value: Float!
  }

  type DistributionPoint {
    name: String!
    value: Int!
  }

  type InternshipAnalytics {
    total: Int!
    eligible: Int!
    enrolled: Int!
    graduated: Int!
  }

  type ProjectAnalytics {
    total: Int!
    completed: Int!
    pendingReview: Int!
    inProgress: Int!
  }

  type TrainerStats {
    activeCourses: Int!
    totalStudents: Int!
    pendingReviews: Int!
    mentees: Int!
  }

  type RecentEnrollment {
    studentName: String!
    courseTitle: String!
    enrolledAt: String!
    amount: Float
  }

  type CoursePerformance {
    courseTitle: String!
    studentCount: Int!
    avgCompletion: Int!
    revenue: Float!
  }

  type AdminDashboardData {
    stats: Stats!
    recentEnrollments: [RecentEnrollment!]
    coursePerformance: [CoursePerformance!]
  }

  type Query {
    hello: String
    users: [User]
    conversations: [Conversation]
    messages(conversationId: ID!): [Message]
    courses: [Course]
    course(id: ID!): Course
    stats: Stats
    me: User
    categories: [String]
    trainerStudents: [User]
    recentActivity: [ActivityLogEntry]
    questions(courseId: ID!, lessonId: ID): [Question]
    bookings: [Booking]
    payments: [PaymentTransaction]
    analytics: AnalyticsData
    branding: BrandingConfig
    configs: [Config]
    myBookings: [Booking]
    myPayments: [PaymentTransaction]
    myCourseProgress(courseId: ID!): CourseProgress
    badges: [Badge]
    
    trainerStats: TrainerStats
    adminDashboardData: AdminDashboardData

    # Projects
    projects: [Project]
    myProjects: [Project]
    project(id: ID!): Project
    
    # Certificates
    certificates: [Certificate]
    myCertificates: [Certificate]
    certificate(id: ID!): Certificate
    
    # Internships
    internships: [Internship]
    myInternship: Internship
    internship(id: ID!): Internship
    internshipStages: [ProgramStage]
  }

  input ResourceInput {
    title: String!
    url: String!
    type: String!
  }

  input LessonInput {
    title: String!
    content: String
    videoUrl: String
    fileUrl: String
    duration: Int
    type: String
    resources: [ResourceInput]
  }

  input ModuleInput {
    title: String!
    description: String
    lessons: [LessonInput!]!
  }

  input TeamMemberInput {
    name: String!
    role: String!
  }

  input TaskInput {
    title: String!
    completed: Boolean
  }

  input RequirementInput {
    title: String!
    completed: Boolean
    current: Int
    total: Int
  }

  input MilestoneInput {
    title: String!
    completed: Boolean
    date: String!
  }

  input InternshipTaskInput {
    title: String!
    status: String
    priority: String
  }

  input MeetingInput {
    title: String!
    time: String!
    type: String!
  }

  input PaymentInput {
    amount: Float!
    currency: String
    status: String
    paidAt: String
    discount: Int
  }

  type BrandingConfig {
    primaryColor: String
    secondaryColor: String
    accentColor: String
    logoUrl: String
    siteName: String
    portalTitle: String
  }

  type Mutation {
    updateBranding(
      primaryColor: String
      secondaryColor: String
      accentColor: String
      logoUrl: String
      siteName: String
      portalTitle: String
    ): BrandingConfig

    sendMessage(receiverId: ID!, content: String!): Message
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    enroll(courseId: ID!): Course
    createCourse(
      title: String!
      description: String!
      thumbnail: String
      price: Float
      discountPrice: Float
      level: String
      category: String
      instructorId: ID
      status: String
      modules: [ModuleInput!]!
    ): Course
    updateCourse(
      id: ID!
      title: String
      description: String
      thumbnail: String
      price: Float
      discountPrice: Float
      level: String
      category: String
      instructorId: ID
      status: String
      modules: [ModuleInput!]
    ): Course
    deleteCourse(id: ID!): Boolean
    createUser(username: String!, email: String!, password: String!, role: String, permissions: [String]): User
    updateUser(id: ID!, username: String, email: String, role: String, permissions: [String]): User
    deleteUser(id: ID!): Boolean
    
    # Progress Tracking
    updateLessonProgress(courseId: ID!, lessonId: String!, timeSpent: Int!, completed: Boolean): Boolean
    
    completeLesson(courseId: ID!, lessonId: String!): User
    trackActivity(action: String!, details: String): User
    createQuestion(
      courseId: ID!
      lessonId: ID
      questionText: String!
      options: [String!]!
      correctOptionIndex: Int!
      explanation: String
    ): Question
    updateQuestion(
      id: ID!
      questionText: String
      options: [String!]
      correctOptionIndex: Int
      explanation: String
    ): Question
    deleteQuestion(id: ID!): Boolean
    
    createBooking(
      mentorId: ID,
      type: String!,
      date: String!,
      time: String!,
      topic: String,
      notes: String,
      meetingLink: String
    ): Booking
    updateBookingStatus(id: ID!, status: String!, meetingLink: String): Booking
    
    createBadge(title: String!, description: String!, icon: String, category: String): Badge
    awardBadge(userId: ID!, badgeId: ID!): User
    submitGrade(userId: ID!, courseId: ID!, lessonId: String, score: Int!, feedback: String): User
    promoteStudent(userId: ID!, academicStatus: String!, level: Int): User
    
    updateBadge(id: ID!, title: String, description: String, icon: String, category: String): Badge
    deleteBadge(id: ID!): Boolean
    updateConfig(key: String!, value: String!, description: String): Config

    # Projects
    createProject(
      title: String!
      course: String!
      type: String!
      description: String!
      deadline: String
      team: [TeamMemberInput]
      tasks: [TaskInput]
    ): Project
    updateProject(
      id: ID!
      title: String
      course: String
      type: String
      status: String
      progress: Int
      deadline: String
      submittedAt: String
      grade: String
      feedback: String
      team: [TeamMemberInput]
      tasks: [TaskInput]
      description: String
      submissionUrl: String
    ): Project
    deleteProject(id: ID!): Boolean
    submitProject(id: ID!, submissionUrl: String!): Project
    # Auto-assign students to teams of 3
    autoGroupStudents(courseId: ID!, projectTitle: String!, description: String!, deadline: String): [Project]

    # Certificates
    createCertificate(
      userId: ID!
      courseId: ID!
      courseTitle: String!
      requirements: [RequirementInput]
    ): Certificate
    updateCertificate(
      id: ID!
      status: String
      progress: Int
      issueDate: String
      credentialId: String
      requirements: [RequirementInput]
    ): Certificate
    issueCertificate(id: ID!, credentialId: String!): Certificate
    deleteCertificate(id: ID!): Boolean

    # Internships
    createInternship(
      userId: ID!
      title: String!
      organization: String
      company: String
      cohort: String
      duration: String!
      type: String!
      payment: PaymentInput!
      startDate: String
      endDate: String
      mentorId: ID
      stage: String
      projects: [ID]
      milestones: [MilestoneInput]
      tasks: [InternshipTaskInput]
      meetings: [MeetingInput]
    ): Internship
    updateInternship(
      id: ID!
      title: String
      organization: String
      company: String
      cohort: String
      startDate: String
      endDate: String
      duration: String
      type: String
      status: String
      stage: String
      projects: [ID]
      mentorId: ID
      payment: PaymentInput
      progress: Int
      milestones: [MilestoneInput]
      tasks: [InternshipTaskInput]
      meetings: [MeetingInput]
    ): Internship
    deleteInternship(id: ID!): Boolean
    applyForInternship(internshipId: ID!): Internship
    promoteIntern(id: ID, groupId: String, cohort: String, targetStage: Int): Boolean
    updateInternshipPayment(id: ID!, status: String!, paidAt: String): Internship
    payForCourse(courseId: ID!, amount: Float!, paymentMethod: String!): Course
    addInternshipTask(internshipId: ID!, title: String!, priority: String): Internship
    addBatchTask(internshipIds: [ID!], stage: Int, cohort: String, title: String!, priority: String): Boolean
    updateTheme(primaryColor: String, mode: String, lightBg: String, darkBg: String): User
    updateInternshipTask(internshipId: ID!, taskId: ID!, status: String!): Internship
  }
`;
