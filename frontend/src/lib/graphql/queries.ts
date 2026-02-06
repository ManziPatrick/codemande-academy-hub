import { gql } from '@apollo/client';

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalUsers
      totalCourses
      totalStudents
      totalRevenue
    }
  }
`;


export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      role
      permissions
      activityLog {
        action
        details
        timestamp
      }
    }
  }
`;

export const GET_CONVERSATIONS = gql`
  query GetConversations {
    conversations {
      id
      participants {
        id
        username
      }
      lastMessage {
        id
        content
        createdAt
        sender {
           username
        }
      }
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id
      content
      sender {
         id
         username
      }
      createdAt
    }
  }
`;

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      thumbnail
      price
      discountPrice
      level
      category
      status
      instructor {
        id
        username
      }
      studentsEnrolled {
        id
      }
      createdAt
      modules {
        id
        title
        description
        lessons {
          id
          title
          duration
          content
          videoUrl
          fileUrl
          type
        }
      }
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      description
      thumbnail
      price
      discountPrice
      level
      category
      instructor {
        id
        username
      }
      modules {
        id
        title
        description
        lessons {
          id
          title
          duration
          content
          videoUrl
          fileUrl
          type
        }
      }
      studentsEnrolled {
        id
        username
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
      role
      enrolledCourses {
        id
        title
        description
        thumbnail
        price
        discountPrice
        level
        category
        modules {
          title
          description
          lessons {
            title
            duration
            type
            fileUrl
          }
        }
      }
      completedLessons {
        courseId
        lessonId
      }
      badges {
        badge {
          id
          title
          description
          icon
          category
        }
        awardedAt
      }
      grades {
        courseId
        lessonId
        score
        feedback
        gradedAt
      }
      level
      academicStatus
      streak
      themePreference {
        primaryColor
        mode
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;

export const GET_TRAINER_STUDENTS = gql`
  query GetTrainerStudents {
    trainerStudents {
      id
      username
      email
      enrolledCourses {
        id
        title
      }
      completedLessons {
        courseId
        lessonId
      }
      activityLog {
        action
        timestamp
      }
      badges {
        badge {
          id
          title
        }
      }
      grades {
        courseId
        lessonId
        score
        feedback
      }
      level
      academicStatus
    }
  }
`;
export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity {
    recentActivity {
      username
      action
      details
      timestamp
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions($courseId: ID!, $lessonId: ID) {
    questions(courseId: $courseId, lessonId: $lessonId) {
      id
      courseId
      lessonId
      questionText
      options
      correctOptionIndex
      explanation
      createdAt
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    myBookings {
      id
      type
      date
      time
      topic
      notes
      status
      meetingLink
      mentor {
        id
        username
      }
      user {
        id
        username
      }
      createdAt
    }
  }
`;

export const GET_MY_PAYMENTS = gql`
  query GetMyPayments {
    myPayments {
      id
      type
      itemTitle
      amount
      currency
      date
      status
      method
    }
  }
`;

export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    bookings {
      id
      type
      date
      time
      topic
      notes
      status
      meetingLink
      user {
        id
        username
      }
      mentor {
        id
        username
      }
      createdAt
    }
  }
`;

export const GET_BADGES = gql`
  query GetBadges {
    badges {
      id
      title
      description
      icon
      category
    }
  }
`;

export const GET_CONFIGS = gql`
  query GetConfigs {
    configs {
      id
      key
      value
      description
    }
  }
`;

export const GET_MY_PROJECTS = gql`
  query GetMyProjects {
    myProjects {
      id
      title
      course
      type
      status
      progress
      deadline
      submittedAt
      grade
      feedback
      team {
        userId
        name
        role
        user {
          id
          username
        }
      }
      mentors {
        id
        username
      }
      tasks {
        id
        title
        completed
        approved
        feedback
      }
      documentation {
        images
        videos
        links {
          title
          url
        }
        inPersonNotes
      }
      description
      submissionUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      title
      course
      type
      status
      progress
      deadline
      submittedAt
      grade
      feedback
      team {
        userId
        name
        role
        user {
          id
          username
        }
      }
      mentors {
        id
        username
      }
      tasks {
        id
        title
        completed
        approved
        feedback
      }
      documentation {
        images
        videos
        links {
          title
          url
        }
        inPersonNotes
      }
      description
      submissionUrl
      user {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projects {
      id
      title
      course
      type
      status
      progress
      deadline
      submittedAt
      grade
      feedback
      description
      submissionUrl
      conversationId
      team {
        userId
        name
        role
        user {
          id
          username
        }
      }
      mentors {
        id
        username
      }
      tasks {
        title
        completed
      }
      user {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_CERTIFICATES = gql`
  query GetMyCertificates {
    myCertificates {
      id
      courseTitle
      issueDate
      credentialId
      status
      progress
      requirements {
        title
        completed
        current
        total
      }
      course {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CERTIFICATE = gql`
  query GetCertificate($id: ID!) {
    certificate(id: $id) {
      id
      courseTitle
      issueDate
      credentialId
      status
      progress
      requirements {
        title
        completed
        current
        total
      }
      user {
        id
        username
      }
      course {
        id
        title
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_CERTIFICATES = gql`
  query GetAllCertificates {
    certificates {
      id
      courseTitle
      issueDate
      credentialId
      status
      progress
      user {
        id
        username
      }
      createdAt
    }
  }
`;

export const GET_MY_INTERNSHIP = gql`
  query GetMyInternship {
    myInternship {
      id
      title
      organization
      company
      startDate
      endDate
      duration
      type
      status
      stage
      projects {
        id
        title
        status
        grade
        feedback
        conversationId
        team {
          userId
          name
          role
          user {
            id
            username
          }
        }
        mentors {
          id
          username
        }
        conversationId
        team {
          userId
          name
          role
        }
      }
      payment {
        amount
        currency
        status
        paidAt
        discount
      }
      progress
      milestones {
        title
        completed
        date
      }
      tasks {
        id
        title
        status
        priority
      }
      meetings {
        title
        time
        type
      }
      mentor {
        id
        username
      }
      mentors {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INTERNSHIP = gql`
  query GetInternship($id: ID!) {
    internship(id: $id) {
      id
      title
      organization
      company
      startDate
      endDate
      duration
      type
      status
      stage
      cohort
      projects {
        id
        title
        status
        grade
        feedback
        conversationId
        team {
          userId
          name
          role
          user {
            id
            username
          }
        }
        mentors {
          id
          username
        }
      }
      payment {
        amount
        currency
        status
        paidAt
        discount
      }
      progress
      milestones {
        title
        completed
        date
      }
      tasks {
        id
        title
        status
        priority
      }
      meetings {
        title
        time
        type
      }
      user {
        id
        username
      }
      mentor {
        id
        username
      }
      mentors {
        id
        username
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_INTERNSHIPS = gql`
  query GetAllInternships {
    internships {
      id
      title
      organization
      company
      duration
      type
      status
      stage
      cohort
      user {
        id
        username
      }
      mentor {
        id
        username
      }
      mentors {
        id
        username
      }
      progress
      currentStage
      tasks {
        id
        title
        status
        priority
      }
      createdAt
    }
  }
`;

export const GET_TRAINER_STATS = gql`
  query GetTrainerStats {
    trainerStats {
      activeCourses
      totalStudents
      pendingReviews
      mentees
    }
  }
`;

export const GET_ADMIN_DASHBOARD_DATA = gql`
  query GetAdminDashboardData {
    adminDashboardData {
      stats {
        totalUsers
        totalCourses
        totalStudents
        totalRevenue
      }
      recentEnrollments {
        studentName
        courseTitle
        enrolledAt
        amount
      }
      coursePerformance {
        courseTitle
        studentCount
        avgCompletion
        revenue
      }
    }
  }
`;

export const GET_PAYMENTS = gql`
  query GetPayments {
    payments {
      id
      amount
      currency
      itemTitle
      type
      status
      date
      user {
        username
      }
    }
  }
`;

// --- New Internship Module Queries ---

export const GET_INTERNSHIP_PROGRAMS = gql`
  query GetInternshipPrograms {
    internshipPrograms {
      id
      title
      description
      duration
      startDate
      endDate
      applicationDeadline
      status
      price
      currency
      image
      eligibility
      rules
    }
  }
`;

export const GET_INTERNSHIP_PROGRAM = gql`
  query GetInternshipProgram($id: ID!) {
    internshipProgram(id: $id) {
      id
      title
      description
      duration
      startDate
      endDate
      applicationDeadline
      status
      price
      currency
      eligibility
      rules
    }
  }
`;

export const GET_INTERNSHIP_APPLICATIONS = gql`
  query GetInternshipApplications($programId: ID, $status: String) {
    internshipApplications(programId: $programId, status: $status) {
      id
      status
      skills
      availability
      portfolioUrl
      rejectionReason
      createdAt
      user {
        id
        username
        email
        fullName
        studentProfile {
          school
        }
      }
      internshipProgram {
        id
        title
      }
    }
  }
`;

export const GET_MY_INTERNSHIP_APPLICATIONS = gql`
  query GetMyInternshipApplications {
    myInternshipApplications {
      id
      status
      internshipProgram {
        id
        title
        price
        currency
        status
      }
      payment {
        id
        status
        amount
        currency
      }
      createdAt
    }
  }
`;

export const GET_INTERNSHIP_PROJECTS_NEW = gql`
  query GetInternshipProjects($programId: ID) {
    internshipProjects(programId: $programId) {
      id
      title
      description
      requiredSkills
    }
  }
`;

export const GET_INTERNSHIP_PROJECT_NEW = gql`
  query GetInternshipProject($id: ID!) {
    internshipProject(id: $id) {
      id
      title
      description
      requiredSkills
      status
      teamSizeRange {
        min
        max
      }
      milestones {
        id
        title
        deadline
        order
      }
    }
  }
`;

export const GET_INTERNSHIP_TEAMS = gql`
  query GetInternshipTeams($programId: ID) {
    internshipTeams(programId: $programId) {
      id
      name
      status
      internshipProject {
        id
        title
      }
      mentor {
        id
        username
      }
      members {
        id
        role
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_MY_INTERNSHIP_TEAM = gql`
  query GetMyInternshipTeam {
    myInternshipTeam {
      id
      name
      status
      internshipProject {
        id
        title
        description
        milestones {
          id
          title
          deadline
          order
        }
      }
      mentor {
        id
        username
      }
      members {
        id
        role
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_INTERNSHIP_SUBMISSIONS = gql`
  query GetInternshipSubmissions($teamId: ID!) {
    internshipSubmissions(teamId: $teamId) {
      id
      workUrl
      description
      status
      feedback
      createdAt
      user {
        username
      }
      milestone {
        title
      }
    }
  }
`;

export const GET_ANALYTICS = gql`
  query GetAnalytics {
    analytics {
      userGrowth {
        label
        value
      }
      revenueGrowth {
        label
        value
      }
      courseDistribution {
        name
        value
      }
      roleDistribution {
        name
        value
      }
      internshipStats {
        total
        eligible
        enrolled
        graduated
      }
      projectStats {
        total
        completed
        pendingReview
        inProgress
      }
    }
  }
`;

export const GET_BRANDING = gql`
  query GetBranding {
    branding {
      primaryColor
      secondaryColor
      accentColor
      logoUrl
      siteName
      portalTitle
    }
  }
`;

export const GET_MY_MENTEES = gql`
  query GetMyMentees {
    myMentees {
      id
      title
      organization
      duration
      type
      status
      stage
      currentStage
      cohort
      user {
        id
        username
        email
      }
      mentors {
        id
        username
      }
      progress
      tasks {
        id
        title
        status
        priority
      }
      milestones {
        title
        completed
        date
      }
      payment {
        status
        amount
        currency
      }
      projects {
        id
        title
        status
        grade
        feedback
        conversationId
        team {
          userId
          name
          role
          user {
            id
            username
          }
        }
        mentors {
          id
          username
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INTERNSHIP_ACTIVITY_LOGS = gql`
  query GetInternshipActivityLogs {
    internshipActivityLogs {
      id
      action
      targetType
      targetId
      details
      createdAt
      user {
        username
      }
    }
  }
`;

// ========== STUDENT PROFILE QUERIES ==========
export const GET_MY_STUDENT_PROFILE = gql`
  query GetMyStudentProfile {
    myStudentProfile {
      id
      userId
      school
      educationLevel
      fieldOfStudy
      skills
      availability
      bio
      linkedinUrl
      githubUrl
      portfolioUrl
      completionPercentage
      isComplete
      createdAt
      updatedAt
    }
  }
`;

export const GET_STUDENT_PROFILES = gql`
  query GetStudentProfiles {
    studentProfiles {
      id
      userId
      user {
        id
        username
        email
      }
      school
      educationLevel
      fieldOfStudy
      skills
      availability
      completionPercentage
      isComplete
    }
  }
`;

// ========== PAYMENT QUERIES ==========
export const GET_INTERNSHIP_PAYMENTS = gql`
  query GetInternshipPayments($programId: ID, $status: String) {
    internshipPayments(programId: $programId, status: $status) {
      id
      userId
      user {
        id
        username
        email
      }
      internshipProgramId
      internshipProgram {
        id
        title
      }
      amount
      currency
      status
      paymentMethod
      transactionId
      paidAt
      waivedBy
      waivedReason
      createdAt
    }
  }
`;

export const GET_MY_INTERNSHIP_PAYMENTS = gql`
  query GetMyInternshipPayments {
    myInternshipPayments {
      id
      internshipProgramId
      internshipProgram {
        id
        title
      }
      amount
      currency
      status
      paymentMethod
      paidAt
      createdAt
    }
  }
`;

// ========== INVOICE QUERIES ==========
export const GET_INTERNSHIP_INVOICES = gql`
  query GetInternshipInvoices($userId: ID) {
    internshipInvoices(userId: $userId) {
      id
      invoiceNumber
      userId
      user {
        id
        username
        email
      }
      internshipProgram {
        id
        title
      }
      amount
      currency
      issuedAt
      dueDate
      status
      items {
        description
        quantity
        unitPrice
        total
      }
    }
  }
`;

// ========== CERTIFICATE QUERIES ==========
export const GET_INTERNSHIP_CERTIFICATES = gql`
  query GetInternshipCertificates($programId: ID) {
    internshipCertificates(programId: $programId) {
      id
      userId
      user {
        id
        username
        email
      }
      internshipProgram {
        id
        title
      }
      certificateNumber
      issuedAt
      trainerName
      programTitle
      duration
      isRevoked
      verificationUrl
    }
  }
`;

export const GET_MY_INTERNSHIP_CERTIFICATES = gql`
  query GetMyInternshipCertificates {
    myInternshipCertificates {
      id
      certificateNumber
      internshipProgram {
        id
        title
      }
      programTitle
      duration
      startDate
      endDate
      completionDate
      issuedAt
      trainerName
      pdfUrl
      verificationUrl
      metadata {
        milestonesCompleted
        totalMilestones
        finalGrade
        skills
      }
    }
  }
`;

export const VERIFY_CERTIFICATE = gql`
  query VerifyCertificate($certificateNumber: String!) {
    verifyCertificate(certificateNumber: $certificateNumber) {
      id
      certificateNumber
      user {
        username
      }
      programTitle
      duration
      trainerName
      issuedAt
      completionDate
      isRevoked
      verificationUrl
    }
  }
`;
