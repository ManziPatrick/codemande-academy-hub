import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
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
export const ENROLL_COURSE = gql`
  mutation Enroll($courseId: ID!) {
    enroll(courseId: $courseId) {
      id
      studentsEnrolled {
        id
      }
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($title: String!, $description: String!, $thumbnail: String, $price: Float, $discountPrice: Float, $level: String, $category: String, $instructorId: ID, $status: String, $modules: [ModuleInput!]!) {
    createCourse(title: $title, description: $description, thumbnail: $thumbnail, price: $price, discountPrice: $discountPrice, level: $level, category: $category, instructorId: $instructorId, status: $status, modules: $modules) {
      id
      title
      status
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $title: String, $description: String, $thumbnail: String, $price: Float, $discountPrice: Float, $level: String, $category: String, $instructorId: ID, $status: String, $modules: [ModuleInput!]) {
    updateCourse(id: $id, title: $title, description: $description, thumbnail: $thumbnail, price: $price, discountPrice: $discountPrice, level: $level, category: $category, instructorId: $instructorId, status: $status, modules: $modules) {
      id
      title
      status
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $role: String, $permissions: [String]) {
    createUser(username: $username, email: $email, password: $password, role: $role, permissions: $permissions) {
      id
      username
      email
      role
      permissions
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $username: String, $email: String, $role: String, $permissions: [String]) {
    updateUser(id: $id, username: $username, email: $email, role: $role, permissions: $permissions) {
      id
      username
      email
      role
      permissions
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const COMPLETE_LESSON = gql`
  mutation CompleteLesson($courseId: ID!, $lessonId: String!) {
    completeLesson(courseId: $courseId, lessonId: $lessonId) {
      id
      completedLessons {
        courseId
        lessonId
      }
    }
  }
`;

export const TRACK_ACTIVITY = gql`
  mutation TrackActivity($action: String!, $details: String) {
    trackActivity(action: $action, details: $details) {
      id
      activityLog {
        action
        details
        timestamp
      }
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($courseId: ID!, $lessonId: ID, $questionText: String!, $options: [String!]!, $correctOptionIndex: Int!, $explanation: String) {
    createQuestion(courseId: $courseId, lessonId: $lessonId, questionText: $questionText, options: $options, correctOptionIndex: $correctOptionIndex, explanation: $explanation) {
      id
      questionText
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $questionText: String, $options: [String!], $correctOptionIndex: Int, $explanation: String) {
    updateQuestion(id: $id, questionText: $questionText, options: $options, correctOptionIndex: $correctOptionIndex, explanation: $explanation) {
      id
      questionText
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($mentorId: ID, $type: String!, $date: String!, $time: String!, $topic: String, $notes: String, $meetingLink: String) {
    createBooking(mentorId: $mentorId, type: $type, date: $date, time: $time, topic: $topic, notes: $notes, meetingLink: $meetingLink) {
      id
      status
      meetingLink
    }
  }
`;

export const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($id: ID!, $status: String!, $meetingLink: String) {
    updateBookingStatus(id: $id, status: $status, meetingLink: $meetingLink) {
      id
      status
      meetingLink
    }
  }
`;

export const AWARD_BADGE = gql`
  mutation AwardBadge($userId: ID!, $badgeId: ID!) {
    awardBadge(userId: $userId, badgeId: $badgeId) {
      id
      badges {
        badge {
          id
          title
        }
      }
    }
  }
`;

export const SUBMIT_GRADE = gql`
  mutation SubmitGrade($userId: ID!, $courseId: ID!, $lessonId: String, $score: Int!, $feedback: String) {
    submitGrade(userId: $userId, courseId: $courseId, lessonId: $lessonId, score: $score, feedback: $feedback) {
      id
      grades {
        courseId
        score
      }
    }
  }
`;

export const PROMOTE_STUDENT = gql`
  mutation PromoteStudent($userId: ID!, $academicStatus: String!, $level: Int) {
    promoteStudent(userId: $userId, academicStatus: $academicStatus, level: $level) {
      id
      level
      academicStatus
    }
  }
`;

export const CREATE_BADGE = gql`
  mutation CreateBadge($title: String!, $description: String!, $icon: String, $category: String) {
    createBadge(title: $title, description: $description, icon: $icon, category: $category) {
      id
      title
      description
      icon
      category
    }
  }
`;

export const UPDATE_BADGE = gql`
  mutation UpdateBadge($id: ID!, $title: String, $description: String, $icon: String, $category: String) {
    updateBadge(id: $id, title: $title, description: $description, icon: $icon, category: $category) {
      id
      title
      description
      icon
      category
    }
  }
`;

export const DELETE_BADGE = gql`
  mutation DeleteBadge($id: ID!) {
    deleteBadge(id: $id)
  }
`;

export const UPDATE_CONFIG = gql`
  mutation UpdateConfig($key: String!, $value: String!, $description: String) {
    updateConfig(key: $key, value: $value, description: $description) {
      id
      key
      value
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $title: String
    $course: String
    $type: String
    $status: String
    $progress: Int
    $deadline: String
    $submittedAt: String
    $grade: String
    $feedback: String
    $description: String
    $submissionUrl: String
  ) {
    updateProject(
      id: $id
      title: $title
      course: $course
      type: $type
      status: $status
      progress: $progress
      deadline: $deadline
      submittedAt: $submittedAt
      grade: $grade
      feedback: $feedback
      description: $description
      submissionUrl: $submissionUrl
    ) {
      id
      title
      status
      progress
    }
  }
`;

export const SUBMIT_PROJECT = gql`
  mutation SubmitProject($id: ID!, $submissionUrl: String!) {
    submitProject(id: $id, submissionUrl: $submissionUrl) {
      id
      status
      progress
      submittedAt
      submissionUrl
    }
  }
`;

export const UPDATE_CERTIFICATE = gql`
  mutation UpdateCertificate(
    $id: ID!
    $status: String
    $progress: Int
    $issueDate: String
    $credentialId: String
  ) {
    updateCertificate(
      id: $id
      status: $status
      progress: $progress
      issueDate: $issueDate
      credentialId: $credentialId
    ) {
      id
      status
      progress
      issueDate
      credentialId
    }
  }
`;

export const ISSUE_CERTIFICATE = gql`
  mutation IssueCertificate($id: ID!, $credentialId: String!) {
    issueCertificate(id: $id, credentialId: $credentialId) {
      id
      status
      issueDate
      credentialId
    }
  }
`;

export const UPDATE_INTERNSHIP = gql`
  mutation UpdateInternship(
    $id: ID!
    $title: String
    $organization: String
    $company: String
    $startDate: String
    $endDate: String
    $duration: String
    $type: String
    $status: String
    $stage: String
    $cohort: String
    $projects: [ID]
    $progress: Int
  ) {
    updateInternship(
      id: $id
      title: $title
      organization: $organization
      company: $company
      startDate: $startDate
      endDate: $endDate
      duration: $duration
      type: $type
      status: $status
      stage: $stage
      cohort: $cohort
      projects: $projects
      progress: $progress
    ) {
      id
      title
      organization
      status
      stage
      cohort
      progress
      projects {
        id
        title
      }
    }
  }
`;

export const CREATE_INTERNSHIP = gql`
  mutation CreateInternship(
    $userId: ID!
    $title: String!
    $organization: String
    $company: String
    $duration: String!
    $type: String!
    $payment: PaymentInput!
    $startDate: String
    $endDate: String
    $mentorId: ID
    $stage: String
    $cohort: String
    $projects: [ID]
  ) {
    createInternship(
      userId: $userId
      title: $title
      organization: $organization
      company: $company
      duration: $duration
      type: $type
      payment: $payment
      startDate: $startDate
      endDate: $endDate
      mentorId: $mentorId
      stage: $stage
      cohort: $cohort
      projects: $projects
    ) {
      id
      title
      cohort
      user {
        id
        username
      }
      status
    }
  }
`;

export const UPDATE_INTERNSHIP_PAYMENT = gql`
  mutation UpdateInternshipPayment($id: ID!, $status: String!, $paidAt: String) {
    updateInternshipPayment(id: $id, status: $status, paidAt: $paidAt) {
      id
      payment {
        status
        paidAt
      }
      status
    }
  }
`;

export const DELETE_INTERNSHIP = gql`
  mutation DeleteInternship($id: ID!) {
    deleteInternship(id: $id)
  }
`;

export const PAY_FOR_COURSE = gql`
  mutation PayForCourse($courseId: ID!, $amount: Float!, $paymentMethod: String!) {
    payForCourse(courseId: $courseId, amount: $amount, paymentMethod: $paymentMethod) {
      id
      studentsEnrolled {
        id
      }
    }
  }
`;
export const PROMOTE_INTERN = gql`
  mutation PromoteIntern($id: ID, $groupId: String, $cohort: String, $targetStage: Int!) {
    promoteIntern(id: $id, groupId: $groupId, cohort: $cohort, targetStage: $targetStage)
  }
`;

export const ADD_INTERNSHIP_TASK = gql`
  mutation AddInternshipTask($internshipId: ID!, $title: String!, $priority: String) {
    addInternshipTask(internshipId: $internshipId, title: $title, priority: $priority) {
      id
      progress
      tasks {
        id
        title
        status
        priority
      }
    }
  }
`;

export const UPDATE_INTERNSHIP_TASK = gql`
  mutation UpdateInternshipTask($internshipId: ID!, $taskId: ID!, $status: String!) {
    updateInternshipTask(internshipId: $internshipId, taskId: $taskId, status: $status) {
      id
      progress
      tasks {
        id
        title
        status
        priority
      }
    }
  }
`;
export const ADD_BATCH_TASK = gql`
  mutation AddBatchTask($internshipIds: [ID!], $stage: Int, $cohort: String, $title: String!, $priority: String) {
    addBatchTask(internshipIds: $internshipIds, stage: $stage, cohort: $cohort, title: $title, priority: $priority)
  }
`;
export const UPDATE_BRANDING = gql`
  mutation UpdateBranding(
    $primaryColor: String
    $secondaryColor: String
    $accentColor: String
    $logoUrl: String
    $siteName: String
    $portalTitle: String
  ) {
    updateBranding(
      primaryColor: $primaryColor
      secondaryColor: $secondaryColor
      accentColor: $accentColor
      logoUrl: $logoUrl
      siteName: $siteName
      portalTitle: $portalTitle
    ) {
      primaryColor
      secondaryColor
      accentColor
      logoUrl
      siteName
      portalTitle
    }
  }
`;
export const UPDATE_THEME = gql`
  mutation UpdateTheme($primaryColor: String, $mode: String, $lightBg: String, $darkBg: String) {
    updateTheme(primaryColor: $primaryColor, mode: $mode, lightBg: $lightBg, darkBg: $darkBg) {
      id
      themePreference {
        primaryColor
        mode
        lightBg
        darkBg
      }
    }
  }
`;
