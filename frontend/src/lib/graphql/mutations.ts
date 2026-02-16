import { gql } from "@apollo/client";

export const CHAT_WITH_AI = gql`
  mutation ChatWithAI($message: String!) {
    chatWithAI(message: $message) {
      content
      role
      action
      actionData
    }
  }
`; export const EXPLAIN_TASK = gql`
  mutation ExplainTask($taskTitle: String!, $description: String!) {
    explainTask(taskTitle: $taskTitle, description: $description) {
      content
    }
  }
`;

export const REVIEW_SUBMISSION = gql`
  mutation ReviewSubmission($taskTitle: String!, $submissionContent: String!) {
    reviewSubmission(taskTitle: $taskTitle, submissionContent: $submissionContent) {
      content
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        role
        fullName
        avatar
        title
        bio
        phone
        location
        createdAt
        themePreference {
          primaryColor
          mode
          lightBg
          darkBg
        }
      }
    }
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(token: $token) {
      token
      user {
        id
        username
        email
        role
        fullName
        avatar
        title
        bio
        phone
        location
        createdAt
        themePreference {
          primaryColor
          mode
          lightBg
          darkBg
        }
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
        fullName
        avatar
        title
        bio
        phone
        location
        createdAt
        themePreference {
          primaryColor
          mode
          lightBg
          darkBg
        }
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

export const ENROLL_STUDENT_IN_COURSE = gql`
  mutation EnrollStudentInCourse($courseId: ID!, $userId: ID!) {
    enrollStudentInCourse(courseId: $courseId, userId: $userId) {
      id
      studentsEnrolled {
        id
        username
        email
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
  mutation UpdateUser($id: ID!, $username: String, $email: String, $role: String, $permissions: [String], $fullName: String, $bio: String, $avatar: String, $phone: String, $location: String, $title: String) {
    updateUser(id: $id, username: $username, email: $email, role: $role, permissions: $permissions, fullName: $fullName, bio: $bio, avatar: $avatar, phone: $phone, location: $location, title: $title) {
      id
      username
      fullName
      email
      role
      bio
      avatar
      phone
      location
      title
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

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const UPDATE_TASK_PROGRESS = gql`
  mutation UpdateTaskProgress($projectId: ID!, $taskId: String!, $completed: Boolean!) {
    updateTaskProgress(projectId: $projectId, taskId: $taskId, completed: $completed) {
      id
      progress
      tasks {
        id
        title
        completed
        approved
        feedback
      }
    }
  }
`;

export const APPROVE_PROJECT_TASK = gql`
  mutation ApproveProjectTask($projectId: ID!, $taskId: String!, $approved: Boolean!, $feedback: String) {
    approveProjectTask(projectId: $projectId, taskId: $taskId, approved: $approved, feedback: $feedback) {
      id
      tasks {
        id
        title
        completed
        approved
        feedback
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $course: String!
    $type: String!
    $description: String!
    $deadline: String
    $userId: ID
    $mentorIds: [ID]
    $team: [TeamMemberInput]
    $tasks: [TaskInput]
    $documentation: DocumentationInput
  ) {
    createProject(
      title: $title
      course: $course
      type: $type
      description: $description
      deadline: $deadline
      userId: $userId
      mentorIds: $mentorIds
      team: $team
      tasks: $tasks
      documentation: $documentation
    ) {
      id
      title
      status
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
    $documentation: DocumentationInput
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
      documentation: $documentation
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

export const GRADE_PROJECT = gql`
  mutation GradeProject($id: ID!, $grade: String!, $feedback: String!) {
    gradeProject(id: $id, grade: $grade, feedback: $feedback) {
      id
      status
      grade
      feedback
      progress
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
    $mentorId: ID
    $mentorIds: [ID]
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
      mentorId: $mentorId
      mentorIds: $mentorIds
    ) {
      id
      title
      organization
      status
      stage
      cohort
      progress
      mentor {
        id
        username
      }
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
    $academicSchool: String
    $academicLevel: String
    $previousLanguages: String
    $skills: String
    $phoneNumber: String
    $portfolioUrl: String
    $mentorIds: [ID]
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
      academicSchool: $academicSchool
      academicLevel: $academicLevel
      previousLanguages: $previousLanguages
      skills: $skills
      phoneNumber: $phoneNumber
      portfolioUrl: $portfolioUrl
      mentorIds: $mentorIds
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
      status
      amount
      currency
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

export const ASSIGN_GROUP_PROJECT = gql`
  mutation AssignGroupProject($internshipIds: [ID!], $title: String!, $description: String!, $repoUrl: String, $deadline: String, $mentorIds: [ID!]) {
    assignGroupProject(internshipIds: $internshipIds, title: $title, description: $description, repoUrl: $repoUrl, deadline: $deadline, mentorIds: $mentorIds) {
      id
      title
      status
      type
      team {
        name
        role
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

export const SEND_MESSAGE_TO_PROJECT = gql`
  mutation SendMessageToProject($projectId: ID!, $content: String!) {
    sendMessageToProject(projectId: $projectId, content: $content) {
      id
      content
      createdAt
      sender {
         id
         username
      }
    }
  }
`;
// --- New Internship Module Mutations ---

export const CREATE_INTERNSHIP_PROGRAM = gql`
  mutation CreateInternshipProgram($title: String!, $description: String!, $duration: String!, $startDate: String!, $endDate: String!, $applicationDeadline: String!, $eligibility: [String], $rules: String, $price: Float, $currency: String, $image: String) {
    createInternshipProgram(title: $title, description: $description, duration: $duration, startDate: $startDate, endDate: $endDate, applicationDeadline: $applicationDeadline, eligibility: $eligibility, rules: $rules, price: $price, currency: $currency, image: $image) {
      id
      title
      image
    }
  }
`;

export const UPDATE_INTERNSHIP_PROGRAM_NEW = gql`
  mutation UpdateInternshipProgram($id: ID!, $title: String, $description: String, $duration: String, $startDate: String, $endDate: String, $applicationDeadline: String, $status: String, $eligibility: [String], $rules: String, $price: Float, $currency: String, $image: String) {
    updateInternshipProgram(id: $id, title: $title, description: $description, duration: $duration, startDate: $startDate, endDate: $endDate, applicationDeadline: $applicationDeadline, status: $status, eligibility: $eligibility, rules: $rules, price: $price, currency: $currency, image: $image) {
      id
      title
      status
      image
    }
  }
`;

export const DELETE_INTERNSHIP_PROGRAM_NEW = gql`
  mutation DeleteInternshipProgram($id: ID!) {
    deleteInternshipProgram(id: $id)
  }
`;

export const APPLY_TO_INTERNSHIP_PROGRAM = gql`
  mutation ApplyToInternshipProgram($internshipProgramId: ID!, $skills: [String!]!, $availability: String!, $portfolioUrl: String) {
    applyToInternshipProgram(internshipProgramId: $internshipProgramId, skills: $skills, availability: $availability, portfolioUrl: $portfolioUrl) {
      id
      status
    }
  }
`;

export const REVIEW_INTERNSHIP_APPLICATION = gql`
  mutation ReviewInternshipApplication($id: ID!, $status: String!, $rejectionReason: String) {
    reviewInternshipApplication(id: $id, status: $status, rejectionReason: $rejectionReason) {
      id
      status
    }
  }
`;

export const CREATE_INTERNSHIP_PROJECT_NEW = gql`
  mutation CreateInternshipProject($title: String!, $description: String!, $requiredSkills: [String!]!, $minTeamSize: Int!, $maxTeamSize: Int!, $internshipProgramId: ID!, $documentation: DocumentationInput) {
    createInternshipProject(title: $title, description: $description, requiredSkills: $requiredSkills, minTeamSize: $minTeamSize, maxTeamSize: $maxTeamSize, internshipProgramId: $internshipProgramId, documentation: $documentation) {
      id
      title
    }
  }
`;

export const UPDATE_INTERNSHIP_PROJECT_NEW = gql`
  mutation UpdateInternshipProject($id: ID!, $title: String, $description: String, $requiredSkills: [String], $minTeamSize: Int, $maxTeamSize: Int, $status: String, $documentation: DocumentationInput) {
    updateInternshipProject(id: $id, title: $title, description: $description, requiredSkills: $requiredSkills, minTeamSize: $minTeamSize, maxTeamSize: $maxTeamSize, status: $status, documentation: $documentation) {
      id
      title
    }
  }
`;

export const DELETE_INTERNSHIP_PROJECT = gql`
  mutation DeleteInternshipProject($id: ID!) {
    deleteInternshipProject(id: $id)
  }
`;

export const CREATE_INTERNSHIP_TEAM_NEW = gql`
  mutation CreateInternshipTeam($name: String!, $internshipProjectId: ID!, $internshipProgramId: ID!, $mentorId: ID) {
    createInternshipTeam(name: $name, internshipProjectId: $internshipProjectId, internshipProgramId: $internshipProgramId, mentorId: $mentorId) {
      id
      name
    }
  }
`;

export const ADD_INTERN_TO_TEAM_NEW = gql`
  mutation AddInternToTeam($teamId: ID!, $userId: ID!, $role: String!) {
    addInternToTeam(teamId: $teamId, userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const CREATE_INTERNSHIP_MILESTONE_NEW = gql`
  mutation CreateInternshipMilestone($internshipProjectId: ID!, $title: String!, $deadline: String!, $order: Int!) {
    createInternshipMilestone(internshipProjectId: $internshipProjectId, title: $title, deadline: $deadline, order: $order) {
      id
      title
    }
  }
`;

export const SUBMIT_INTERNSHIP_WORK = gql`
  mutation SubmitInternshipWork($teamId: ID!, $milestoneId: ID!, $workUrl: String!, $description: String!) {
    submitInternshipWork(teamId: $teamId, milestoneId: $milestoneId, workUrl: $workUrl, description: $description) {
      id
      status
    }
  }
`;


export const LOG_INTERNSHIP_TIME = gql`
  mutation LogInternshipTime($teamId: ID!, $description: String!, $minutes: Int!, $date: String!) {
    logInternshipTime(teamId: $teamId, description: $description, minutes: $minutes, date: $date) {
      id
      minutes
      description
      date
    }
  }
`;

export const REVIEW_INTERNSHIP_SUBMISSION_NEW = gql`
  mutation ReviewInternshipSubmission($id: ID!, $status: String!, $feedback: String) {
    reviewInternshipSubmission(id: $id, status: $status, feedback: $feedback) {
      id
      status
    }
  }
`;

export const SUBMIT_MENTOR_FEEDBACK_NEW = gql`
  mutation SubmitMentorFeedback($userId: ID!, $teamId: ID!, $score: Int!, $feedback: String!) {
    submitMentorFeedback(userId: $userId, teamId: $teamId, score: $score, feedback: $feedback) {
      id
      score
    }
  }
`;

// ========== STUDENT PROFILE MUTATIONS ==========
export const CREATE_STUDENT_PROFILE = gql`
  mutation CreateStudentProfile(
    $school: String!
    $educationLevel: String!
    $fieldOfStudy: String!
    $skills: [String!]!
    $availability: String!
    $bio: String
    $linkedinUrl: String
    $githubUrl: String
    $portfolioUrl: String
  ) {
    createStudentProfile(
      school: $school
      educationLevel: $educationLevel
      fieldOfStudy: $fieldOfStudy
      skills: $skills
      availability: $availability
      bio: $bio
      linkedinUrl: $linkedinUrl
      githubUrl: $githubUrl
      portfolioUrl: $portfolioUrl
    ) {
      id
      completionPercentage
      isComplete
    }
  }
`;

export const UPDATE_STUDENT_PROFILE = gql`
  mutation UpdateStudentProfile(
    $school: String
    $educationLevel: String
    $fieldOfStudy: String
    $skills: [String]
    $availability: String
    $bio: String
    $linkedinUrl: String
    $githubUrl: String
    $portfolioUrl: String
  ) {
    updateStudentProfile(
      school: $school
      educationLevel: $educationLevel
      fieldOfStudy: $fieldOfStudy
      skills: $skills
      availability: $availability
      bio: $bio
      linkedinUrl: $linkedinUrl
      githubUrl: $githubUrl
      portfolioUrl: $portfolioUrl
    ) {
      id
      completionPercentage
      isComplete
    }
  }
`;

export const VALIDATE_PROFILE_FOR_INTERNSHIP = gql`
  mutation ValidateProfileForInternship {
    validateProfileForInternship {
      isValid
      missingFields
      completionPercentage
      message
    }
  }
`;

export const APPLY_TO_INTERNSHIP_WITH_VALIDATION = gql`
  mutation ApplyToInternshipWithValidation(
    $internshipProgramId: ID!
    $skills: [String!]!
    $availability: String!
    $portfolioUrl: String
  ) {
    applyToInternshipWithValidation(
      internshipProgramId: $internshipProgramId
      skills: $skills
      availability: $availability
      portfolioUrl: $portfolioUrl
    ) {
      id
      status
    }
  }
`;

// ========== PAYMENT MUTATIONS ==========
export const CREATE_INTERNSHIP_PAYMENT = gql`
  mutation CreateInternshipPayment($internshipProgramId: ID!, $amount: Float!, $currency: String) {
    createInternshipPayment(internshipProgramId: $internshipProgramId, amount: $amount, currency: $currency) {
      id
      status
      amount
      currency
    }
  }
`;

export const PROCESS_INTERNSHIP_PAYMENT = gql`
  mutation ProcessInternshipPayment($paymentId: ID!, $transactionId: String!, $paymentMethod: String!) {
    processInternshipPayment(paymentId: $paymentId, transactionId: $transactionId, paymentMethod: $paymentMethod) {
      id
      status
      paidAt
    }
  }
`;

export const WAIVE_INTERNSHIP_PAYMENT = gql`
  mutation WaiveInternshipPayment($paymentId: ID!, $reason: String!) {
    waiveInternshipPayment(paymentId: $paymentId, reason: $reason) {
      id
      status
      waivedReason
    }
  }
`;

export const REFUND_INTERNSHIP_PAYMENT = gql`
  mutation RefundInternshipPayment($paymentId: ID!, $reason: String!) {
    refundInternshipPayment(paymentId: $paymentId, reason: $reason) {
      id
      status
    }
  }
`;

export const GENERATE_INTERNSHIP_INVOICE = gql`
  mutation GenerateInternshipInvoice($paymentId: ID!) {
    generateInternshipInvoice(paymentId: $paymentId) {
      id
      invoiceNumber
      amount
      currency
      issuedAt
      dueDate
      status
    }
  }
`;

// ========== CERTIFICATE MUTATIONS ==========
export const CHECK_CERTIFICATE_ELIGIBILITY = gql`
  mutation CheckCertificateEligibility($teamId: ID!) {
    checkCertificateEligibility(teamId: $teamId) {
      isEligible
      milestonesCompleted
      trainerApproved
      paymentConfirmed
      message
    }
  }
`;

export const GENERATE_INTERNSHIP_CERTIFICATE = gql`
  mutation GenerateInternshipCertificate($userId: ID!, $teamId: ID!, $trainerId: ID!) {
    generateInternshipCertificate(userId: $userId, teamId: $teamId, trainerId: $trainerId) {
      id
      certificateNumber
      issuedAt
      verificationUrl
    }
  }
`;

export const REVOKE_CERTIFICATE = gql`
  mutation RevokeCertificate($certificateId: ID!, $reason: String!) {
    revokeCertificate(certificateId: $certificateId, reason: $reason) {
      id
      isRevoked
      revokedAt
      revocationReason
    }
  }
`;

export const APPROVE_INTERN_FOR_CERTIFICATE = gql`
  mutation ApproveInternForCertificate($userId: ID!, $teamId: ID!, $finalGrade: String!) {
    approveInternForCertificate(userId: $userId, teamId: $teamId, finalGrade: $finalGrade) {
      id
      score
    }
  }
`;

export const APPROVE_MILESTONE = gql`
  mutation ApproveMilestone($milestoneId: ID!, $teamId: ID!) {
    approveMilestone(milestoneId: $milestoneId, teamId: $teamId) {
      id
      title
    }
  }
`;

export const CREATE_STRIPE_PAYMENT_INTENT = gql`
  mutation CreateStripePaymentIntent($programId: ID!) {
    createStripePaymentIntent(programId: $programId) {
      clientSecret
      paymentIntentId
      publishableKey
      paymentId
    }
  }
`;
export const UPDATE_INTERNSHIP_TEAM_NEW = gql`
  mutation UpdateInternshipTeam($id: ID!, $status: String) {
    updateInternshipTeam(id: $id, status: $status) {
      id
      status
    }
  }
`;
export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email)
  }
`;

export const CREATE_RESOURCE = gql`
  mutation CreateResource($input: ResourceInput!) {
    createResource(input: $input) {
      id
      title
      type
      source
      url
      linkedTo
      onModel
      visibility
      createdAt
      createdBy {
        id
        username
      }
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource($id: ID!, $input: ResourceInput!) {
    updateResource(id: $id, input: $input) {
      id
      title
      url
    }
  }
`;

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`;

export const SUBMIT_ASSIGNMENT = gql`
  mutation SubmitAssignment($courseId: ID!, $lessonId: String!, $content: String!) {
    submitAssignment(courseId: $courseId, lessonId: $lessonId, content: $content) {
      id
      content
      status
      grade
      feedback
      createdAt
    }
  }
`;

export const GRADE_ASSIGNMENT = gql`
  mutation GradeAssignment($submissionId: ID!, $grade: Int!, $feedback: String) {
    gradeAssignment(submissionId: $submissionId, grade: $grade, feedback: $feedback) {
      id
      status
      grade
      feedback
    }
  }
`;

export const REJECT_PAYMENT = gql`
  mutation RejectPayment($paymentId: ID!, $adminNotes: String!) {
    rejectPayment(paymentId: $paymentId, adminNotes: $adminNotes) {
      id
      status
      adminNotes
    }
  }
`;

export const APPROVE_PAYMENT = gql`
  mutation ApprovePayment($paymentId: ID!, $adminNotes: String) {
    approvePayment(paymentId: $paymentId, adminNotes: $adminNotes) {
      id
      status
      adminNotes
    }
  }
`;

export const SUBMIT_PAYMENT_PROOF = gql`
  mutation SubmitPaymentProof($paymentId: ID!, $proofUrl: String!) {
    submitPaymentProof(paymentId: $paymentId, proofUrl: $proofUrl) {
      id
      status
      proofOfPaymentUrl
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

export const ASSIGN_PROJECT_TO_USERS = gql`
  mutation AssignProjectToUsers($projectId: ID!, $userIds: [ID!]!, $type: String!, $deadline: String) {
    assignProjectToUsers(projectId: $projectId, userIds: $userIds, type: $type, deadline: $deadline) {
      id
      title
      status
    }
  }
`;

export const REQUEST_PROJECT_START = gql`
  mutation RequestProjectStart($templateId: ID!, $type: String!, $teamMembers: [ID]) {
    requestProjectStart(templateId: $templateId, type: $type, teamMembers: $teamMembers) {
      id
      title
      status
      type
    }
  }
`;

export const APPROVE_PROJECT_REQUEST = gql`
  mutation ApproveProjectRequest($projectId: ID!, $approved: Boolean!, $feedback: String) {
    approveProjectRequest(projectId: $projectId, approved: $approved, feedback: $feedback) {
      id
      status
      feedback
    }
  }
`;

export const TOGGLE_PROJECT_TEMPLATE = gql`
  mutation ToggleProjectTemplate($id: ID!, $visibility: String) {
    toggleProjectTemplate(id: $id, visibility: $visibility) {
      id
      isTemplate
      visibility
    }
  }
`;
