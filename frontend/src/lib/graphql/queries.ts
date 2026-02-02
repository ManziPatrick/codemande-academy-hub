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
        name
        role
      }
      tasks {
        title
        completed
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
        name
        role
      }
      tasks {
        title
        completed
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
      studentName
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
