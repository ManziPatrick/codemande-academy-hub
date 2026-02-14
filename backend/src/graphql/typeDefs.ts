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
    fullName: String
    bio: String
    avatar: String
    phone: String
    location: String
    title: String
    studentProfile: StudentProfile
    status: String
    isDeleted: Boolean
    lastActive: String
    isOnline: Boolean
    totalTimeSpent: Int
    lastPath: String
    createdAt: String
    updatedAt: String
    bookings: [Booking]
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
    id: ID!
    title: String!
    type: String!
    source: String!
    url: String!
    linkedTo: ID
    onModel: String
    visibility: String
    createdBy: User
    createdAt: String
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
    isAssignment: Boolean
    assignmentDescription: String
    assignmentDeliverables: [String]
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
    createdAt: String!
    updatedAt: String!
  }



  input ResourceInput {
    title: String!
    type: String!
    source: String!
    url: String!
    linkedTo: ID
    onModel: String
    visibility: String
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
    proofOfPaymentUrl: String
    adminNotes: String
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
    userId: ID
    user: User
    name: String!
    role: String!
  }

  type Task {
    id: String
    title: String!
    completed: Boolean!
    approved: Boolean
    feedback: String
  }

  type ProjectLink {
    title: String!
    url: String!
  }

  type Documentation {
    images: [String]
    videos: [String]
    links: [ProjectLink]
    inPersonNotes: String
  }

  type MilestoneSubmission {
    url: String
    submittedAt: String
    message: String
    feedback: String
    status: String
    aiReview: String
  }

  type MilestoneDetailed {
    title: String!
    description: String
    dueDate: String
    completed: Boolean
    deliverables: [String]
    submissions: [MilestoneSubmission]
    feedback: String
    aiAnalysis: String
  }

  type Project {
    id: ID!
    userId: ID!
    user: User
    title: String!
    course: String!
    type: String!
    status: String!
    isTemplate: Boolean
    visibility: String
    category: String
    progress: Int!
    deadline: String
    submittedAt: String
    grade: String
    feedback: String
    team: [TeamMember]
    tasks: [Task]
    milestones: [MilestoneDetailed]
    documentation: Documentation
    description: String!
    submissionUrl: String
    mentors: [User]
    conversationId: ID
    conversation: Conversation
    milestoneVideos: [MilestoneVideo]
    createdAt: String!
    updatedAt: String!
  }

  type MilestoneVideo {
    title: String!
    videoUrl: String!
    milestoneIndex: Int!
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
    isPaidProgram: Boolean
    installmentsAllowed: Boolean
  }

  type ApplicationDetails {
    background: String
    currentLevel: String
    goal: String
    locationPreference: String
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
    mentors: [User]
    academicSchool: String
    academicLevel: String
    previousLanguages: String
    skills: String
    phoneNumber: String
    portfolioUrl: String
    payment: Payment!
    applicationDetails: ApplicationDetails
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

  type AssignmentSubmission {
    id: ID!
    userId: ID!
    user: User
    courseId: ID!
    course: Course
    lessonId: String!
    content: String! # URL or Text
    status: String! # 'pending', 'reviewed', 'revision_requested'
    grade: Int
    feedback: String
    createdAt: String!
    updatedAt: String!
  }

  type UploadSignature {
    signature: String!
    timestamp: Int!
    folder: String!
    cloudName: String!
    apiKey: String!
  }

  type Query {
    # Resources
    getResources(linkedTo: ID, onModel: String): [Resource!]!
    getResource(id: ID!): Resource!
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
    projectTemplates(category: String, course: String): [Project]
    myProjects: [Project]

    project(id: ID!): Project
    
    # Certificates
    certificates: [Certificate]
    myCertificates: [Certificate]
    certificate(id: ID!): Certificate
    
    # Internships
    internships: [Internship]
    myInternship: Internship
    myMentees: [Internship]
    internship(id: ID!): Internship
    allInternshipStages: [ProgramStage]
    
    dailyDashboard: DailyDashboard
    notifications: [Notification]
    getCourseQuestions(courseId: ID!): [Question!]!
    getUploadSignature(folder: String): UploadSignature!
    
    # Assignments
    getAssignmentSubmissions(courseId: ID, lessonId: String): [AssignmentSubmission]
  }

  type DailyDashboard {
    tasks: [DashboardTask]
    meetings: [Meeting]
    unreadMessages: Int
    aiSuggestion: String
    motivationalQuote: String
    resources: [Resource!]
  }

  type DashboardTask {
    id: ID!
    title: String!
    deadline: String
    priority: String
    type: String # 'Project Milestone' or 'Internship Task'
    sourceId: ID # Project ID or Internship ID
    status: String
  }



  input LessonInput {
    id: ID
    title: String!
    content: String
    videoUrl: String
    fileUrl: String
    duration: Int
    type: String
    resources: [ResourceInput]
    isAssignment: Boolean
    assignmentDescription: String
    assignmentDeliverables: [String]
  }

  input ModuleInput {
    id: ID
    title: String!
    description: String
    lessons: [LessonInput!]!
  }

  input TeamMemberInput {
    userId: ID
    name: String!
    role: String!
  }

  input TaskInput {
    id: String
    title: String!
    completed: Boolean
    approved: Boolean
    feedback: String
  }

  input ProjectLinkInput {
    title: String!
    url: String!
  }

  input DocumentationInput {
    images: [String]
    videos: [String]
    links: [ProjectLinkInput]
    inPersonNotes: String
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

  type ChatResponse {
    content: String!
    role: String!
    action: String
    actionData: String
  }

  type Mutation {
    # Resources
    createResource(input: ResourceInput!): Resource!
    updateResource(id: ID!, input: ResourceInput!): Resource!
    deleteResource(id: ID!): Boolean!
    updateBranding(
      primaryColor: String
      secondaryColor: String
      accentColor: String
      logoUrl: String
      siteName: String
      portalTitle: String
    ): BrandingConfig

    chatWithAI(message: String!): ChatResponse
    explainTask(taskTitle: String!, description: String!): ChatResponse
    reviewSubmission(taskTitle: String!, submissionContent: String!): ChatResponse

    # Uploads
    getUploadSignature(folder: String): UploadSignature!

    sendMessage(receiverId: ID!, content: String!): Message
    register(username: String!, email: String!, password: String!, role: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    googleLogin(idToken: String!): AuthPayload
    requestPasswordReset(email: String!): Boolean
    resetPassword(token: String!, newPassword: String!): Boolean
    
    # Questions
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

    # Badges
    awardBadge(userId: ID!, badgeId: ID!): User
    


    # Badges

    
    # Project Templates
    enrollInProject(templateId: ID!, type: String!, teamMembers: [ID]): Project @deprecated(reason: "Use requestProjectStart instead")
    requestProjectStart(templateId: ID!, type: String!, teamMembers: [ID]): Project
    approveProjectRequest(projectId: ID!, approved: Boolean!, feedback: String): Project
    toggleProjectTemplate(id: ID!, visibility: String): Project
    assignProjectToUsers(projectId: ID!, userIds: [ID!]!, type: String!, deadline: String): [Project]

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
    createUser(username: String!, email: String!, password: String!, role: String, permissions: [String], fullName: String, bio: String, avatar: String, phone: String, location: String, title: String): User
    updateUser(id: ID!, username: String, email: String, role: String, permissions: [String], fullName: String, bio: String, avatar: String, phone: String, location: String, title: String): User
    deleteUser(id: ID!): Boolean
    
    # Progress Tracking
    updateLessonProgress(courseId: ID!, lessonId: String!, timeSpent: Int!, completed: Boolean): Boolean
    
    completeLesson(courseId: ID!, lessonId: String!): User
    trackActivity(action: String!, details: String): User

    
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
    markNotificationRead(id: ID!): Notification
    markAllNotificationsRead: Boolean
    createBadge(title: String!, description: String!, icon: String, category: String): Badge

    awardBadgeToBatch(userIds: [ID!]!, badgeId: ID!): Boolean
    submitGrade(userId: ID!, courseId: ID!, lessonId: String, score: Int!, feedback: String): User

    # Payment Verification
    submitPaymentProof(paymentId: ID!, proofUrl: String!): PaymentTransaction
    approvePayment(paymentId: ID!, adminNotes: String): PaymentTransaction
    rejectPayment(paymentId: ID!, adminNotes: String!): PaymentTransaction

    promoteStudent(userId: ID!, academicStatus: String!, level: Int): User
    
    updateBadge(id: ID!, title: String, description: String, icon: String, category: String): Badge
    deleteBadge(id: ID!): Boolean
    updateConfig(key: String!, value: String!, description: String): Config

    # Projects
    createProject(
      userId: ID
      title: String!
      course: String!
      type: String!
      description: String!
      deadline: String
      team: [TeamMemberInput]
      tasks: [TaskInput]
      documentation: DocumentationInput
      mentorIds: [ID]
    ): Project
    sendMessageToProject(projectId: ID!, content: String!): Message
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
      documentation: DocumentationInput
      description: String
      submissionUrl: String
      mentorIds: [ID]
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
      academicSchool: String
      academicLevel: String
      previousLanguages: String
      skills: String
      phoneNumber: String
      portfolioUrl: String
      mentorIds: [ID]
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
      academicSchool: String
      academicLevel: String
      previousLanguages: String
      skills: String
      phoneNumber: String
      portfolioUrl: String
      mentorIds: [ID]
    ): Internship
    deleteInternship(id: ID!): Boolean
    applyForInternship(internshipId: ID!): Internship
    promoteIntern(internshipIds: [ID!], targetStage: Int!): Boolean
    updateInternshipPayment(id: ID!, status: String!, paidAt: String): Internship
    payForCourse(courseId: ID!, amount: Float!, paymentMethod: String!): PaymentTransaction
    enrollStudentInCourse(courseId: ID!, userId: ID!): Course
    addInternshipTask(internshipId: ID!, title: String!, priority: String): Internship
    addBatchTask(internshipIds: [ID!], stage: Int, cohort: String, title: String!, priority: String): Boolean
    updateTheme(primaryColor: String, mode: String, lightBg: String, darkBg: String): User
    updateInternshipTask(internshipId: ID!, taskId: ID!, status: String!): Internship
    updateTaskProgress(projectId: ID!, taskId: String!, completed: Boolean!): Project
    approveProjectTask(projectId: ID!, taskId: String!, approved: Boolean!, feedback: String): Project
    gradeProject(id: ID!, grade: String!, feedback: String!): Project
    assignGroupProject(internshipIds: [ID!], title: String!, description: String!, repoUrl: String, deadline: String, mentorIds: [ID!]): Project


    # New Internship Module Mutations
    createInternshipProgram(title: String!, description: String!, duration: String!, startDate: String!, endDate: String!, applicationDeadline: String!, eligibility: [String], rules: String, price: Float, currency: String, image: String): InternshipProgram
    updateInternshipProgram(id: ID!, title: String, description: String, duration: String, startDate: String, endDate: String, applicationDeadline: String, status: String, eligibility: [String], rules: String, price: Float, currency: String, image: String): InternshipProgram
    deleteInternshipProgram(id: ID!): Boolean

    applyToInternshipProgram(internshipProgramId: ID!, skills: [String]!, portfolioUrl: String, resumeUrl: String, availability: String!): InternshipApplication
    reviewInternshipApplication(id: ID!, status: String!, rejectionReason: String): InternshipApplication

    createInternshipProject(internshipProgramId: ID!, title: String!, description: String!, requiredSkills: [String], minTeamSize: Int, maxTeamSize: Int, documentation: DocumentationInput): InternshipProject
    updateInternshipProject(id: ID!, title: String, description: String, requiredSkills: [String], minTeamSize: Int, maxTeamSize: Int, status: String, documentation: DocumentationInput): InternshipProject
    deleteInternshipProject(id: ID!): Boolean

    createInternshipTeam(name: String!, internshipProjectId: ID!, internshipProgramId: ID!, mentorId: ID): InternshipTeam
    updateInternshipTeam(id: ID!, name: String, mentorId: ID, status: String): InternshipTeam
    addInternToTeam(teamId: ID!, userId: ID!, role: String): InternshipTeamMember
    removeInternFromTeam(teamMemberId: ID!): Boolean

    createInternshipMilestone(internshipProjectId: ID!, title: String!, description: String, deadline: String!, order: Int): InternshipMilestone
    submitInternshipWork(milestoneId: ID!, teamId: ID!, contentUrl: String!, description: String): InternshipSubmission
    reviewInternshipSubmission(id: ID!, status: String!, feedback: String): InternshipSubmission

    logInternshipTime(teamId: ID!, description: String!, minutes: Int!, date: String): InternshipTimeLog
    submitMentorFeedback(userId: ID!, teamId: ID, score: Int!, comments: String!): InternshipMentorFeedback
  }

  # New Internship Module Types
  type InternshipProgram {
    id: ID!
    title: String!
    description: String!
    duration: String!
    startDate: String!
    endDate: String!
    applicationDeadline: String!
    eligibility: [String]
    rules: String
    price: Float
    currency: String
    image: String
    status: String!
    isDeleted: Boolean
    createdAt: String
    updatedAt: String
  }

  type InternshipApplication {
    id: ID!
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    userId: ID!
    user: User
    status: String!
    skills: [String]
    portfolioUrl: String
    resumeUrl: String
    availability: String
    rejectionReason: String
    payment: InternshipPayment
    createdAt: String
  }

  type InternshipProject {
    id: ID!
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    title: String!
    description: String!
    requiredSkills: [String]
    teamSizeRange: TeamSizeRange
    milestones: [InternshipMilestone]
    documentation: Documentation
    status: String!
    createdAt: String
  }

  type TeamSizeRange {
    min: Int
    max: Int
  }

  type InternshipTeam {
    id: ID!
    name: String!
    internshipProjectId: ID!
    internshipProject: InternshipProject
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    mentorId: ID
    mentor: User
    members: [InternshipTeamMember]
    status: String!
    createdAt: String
  }

  type InternshipTeamMember {
    id: ID!
    teamId: ID!
    userId: ID!
    user: User
    role: String!
    joinedAt: String
  }

  type InternshipMilestone {
    id: ID!
    internshipProjectId: ID!
    title: String!
    description: String
    deadline: String!
    order: Int
    createdAt: String
  }

  type InternshipSubmission {
    id: ID!
    milestoneId: ID!
    milestone: InternshipMilestone
    teamId: ID!
    team: InternshipTeam
    userId: ID!
    user: User
    contentUrl: String!
    description: String
    status: String!
    feedback: String
    createdAt: String
  }

  type InternshipTimeLog {
    id: ID!
    userId: ID!
    user: User
    teamId: ID!
    description: String!
    minutes: Int!
    date: String!
    createdAt: String
  }

  type InternshipMentorFeedback {
    id: ID!
    mentorId: ID!
    mentor: User
    userId: ID!
    user: User
    teamId: ID
    score: Int!
    comments: String!
    createdAt: String
  }

  type InternshipActivityLog {
    id: ID!
    userId: ID!
    user: User
    action: String!
    module: String!
    targetType: String!
    targetId: ID
    details: String
    createdAt: String
  }

  extend type Query {
    internshipPrograms: [InternshipProgram]
    internshipProgram(id: ID!): InternshipProgram
    internshipApplications(programId: ID, status: String): [InternshipApplication]
    myInternshipApplications: [InternshipApplication]
    internshipProject(id: ID!): InternshipProject
    internshipProjects(programId: ID): [InternshipProject]
    internshipTeams(programId: ID): [InternshipTeam]
    myInternshipTeam: InternshipTeam
    internshipSubmissions(teamId: ID!): [InternshipSubmission]
    internshipTimeLogs(teamId: ID!, userId: ID): [InternshipTimeLog]
    internshipActivityLogs(programId: ID): [InternshipActivityLog]
    
    # Student Profile Queries
    myStudentProfile: StudentProfile
    studentProfile(userId: ID!): StudentProfile
    studentProfiles: [StudentProfile]
    
    # Payment & Invoice Queries
    internshipPayments(programId: ID, status: String): [InternshipPayment]
    myInternshipPayments: [InternshipPayment]
    internshipPayment(id: ID!): InternshipPayment
    internshipInvoices(userId: ID): [InternshipInvoice]
    internshipInvoice(id: ID!): InternshipInvoice
    
    # Certificate Queries
    internshipCertificates(programId: ID): [InternshipCertificate]
    myInternshipCertificates: [InternshipCertificate]
    internshipCertificate(id: ID!): InternshipCertificate
    verifyCertificate(certificateNumber: String!): InternshipCertificate
  }

  # Student Profile Type
  type StudentProfile {
    id: ID!
    userId: ID!
    user: User
    school: String!
    educationLevel: String!
    fieldOfStudy: String!
    skills: [String!]!
    availability: String!
    bio: String
    linkedinUrl: String
    githubUrl: String
    portfolioUrl: String
    completionPercentage: Int!
    isComplete: Boolean!
    createdAt: String
    updatedAt: String
  }

  # Payment Types
  type InternshipPayment {
    id: ID!
    userId: ID!
    user: User
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    amount: Float!
    currency: String!
    status: String!
    paymentMethod: String
    transactionId: String
    paidAt: String
    invoiceId: ID
    waivedBy: ID
    waivedByUser: User
    waivedReason: String
    notes: String
    createdAt: String
    updatedAt: String
  }

  type InternshipInvoice {
    id: ID!
    paymentId: ID!
    payment: InternshipPayment
    invoiceNumber: String!
    userId: ID!
    user: User
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    amount: Float!
    currency: String!
    issuedAt: String!
    dueDate: String!
    pdfUrl: String
    status: String!
    items: [InvoiceItem]
    notes: String
    createdAt: String
  }

  type InvoiceItem {
    description: String!
    quantity: Int!
    unitPrice: Float!
    total: Float!
  }

  # Certificate Types
  type InternshipCertificate {
    id: ID!
    userId: ID!
    user: User
    internshipProgramId: ID!
    internshipProgram: InternshipProgram
    teamId: ID!
    team: InternshipTeam
    certificateNumber: String!
    issuedAt: String!
    trainerId: ID!
    trainer: User
    trainerName: String!
    trainerSignature: String
    internTitle: String!
    programTitle: String!
    duration: String!
    startDate: String!
    endDate: String!
    completionDate: String!
    pdfUrl: String
    verificationUrl: String
    isRevoked: Boolean!
    revokedAt: String
    revokedBy: ID
    revokedByUser: User
    revocationReason: String
    metadata: CertificateMetadata
    createdAt: String
  }

  type CertificateMetadata {
    milestonesCompleted: Int
    totalMilestones: Int
    finalGrade: String
    skills: [String]
  }

  # Profile Validation Response
  type ProfileValidationResult {
    isValid: Boolean!
    missingFields: [String]
    completionPercentage: Int!
    message: String
  }

  # Certificate Eligibility Response
  type CertificateEligibility {
    isEligible: Boolean!
    milestonesCompleted: Boolean!
    trainerApproved: Boolean!
    paymentConfirmed: Boolean!
    message: String
  }

  extend type Mutation {
    # Student Profile Mutations
    createStudentProfile(
      school: String!
      educationLevel: String!
      fieldOfStudy: String!
      skills: [String!]!
      availability: String!
      bio: String
      linkedinUrl: String
      githubUrl: String
      portfolioUrl: String
    ): StudentProfile

    updateStudentProfile(
      school: String
      educationLevel: String
      fieldOfStudy: String
      skills: [String]
      availability: String
      bio: String
      linkedinUrl: String
      githubUrl: String
      portfolioUrl: String
    ): StudentProfile

    validateProfileForInternship: ProfileValidationResult

    # Payment Mutations
    createInternshipPayment(
      internshipProgramId: ID!
      amount: Float!
      currency: String
    ): InternshipPayment

    processInternshipPayment(
      paymentId: ID!
      transactionId: String!
      paymentMethod: String!
    ): InternshipPayment

    waiveInternshipPayment(
      paymentId: ID!
      reason: String!
    ): InternshipPayment

    refundInternshipPayment(
      paymentId: ID!
      reason: String!
    ): InternshipPayment

    # Invoice Mutations
    generateInternshipInvoice(paymentId: ID!): InternshipInvoice
    
    # Certificate Mutations
    checkCertificateEligibility(teamId: ID!): CertificateEligibility

    generateInternshipCertificate(
      userId: ID!
      teamId: ID!
      trainerId: ID!
    ): InternshipCertificate

    revokeCertificate(
      certificateId: ID!
      reason: String!
    ): InternshipCertificate

    # Enhanced Application (with profile validation)
    applyToInternshipWithValidation(
      internshipProgramId: ID!
      skills: [String!]!
      availability: String!
      portfolioUrl: String
    ): InternshipApplication

    # Milestone Approval
    approveMilestone(
      milestoneId: ID!
      teamId: ID!
    ): InternshipMilestone

    approveInternForCertificate(
      userId: ID!
      teamId: ID!
      finalGrade: String!
    ): InternshipMentorFeedback

    # Stripe Payment
    createStripePaymentIntent(programId: ID!): StripePaymentIntent
    subscribeToNewsletter(email: String!): Boolean

    # Assignments
    submitAssignment(
      courseId: ID!
      lessonId: String!
      content: String!
    ): AssignmentSubmission
    
    gradeAssignment(
      submissionId: ID!
      grade: Int!
      feedback: String
    ): AssignmentSubmission
  }

  type StripePaymentIntent {
    clientSecret: String!
    paymentIntentId: String!
    publishableKey: String!
    paymentId: ID!
  }

  type Notification {
    id: ID!
    userId: ID!
    type: String!
    title: String!
    message: String!
    link: String
    read: Boolean!
    createdAt: String!
  }

  type Subscription {
    messageAdded(conversationId: ID!): Message
    notificationAdded(userId: ID!): Notification
  }
`;
