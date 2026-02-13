import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";
import { Chat } from "@/components/chat/Chat";

// Public Pages
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Training = lazy(() => import("@/pages/Training"));
const Internships = lazy(() => import("@/pages/Internships"));
const Projects = lazy(() => import("@/pages/Projects"));
const Partners = lazy(() => import("@/pages/Partners"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Team = lazy(() => import("@/pages/Team"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const CoursePage = lazy(() => import("@/pages/CoursePage"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));

// Student Portal
const StudentDashboard = lazy(() => import("@/pages/portal/student/StudentDashboard"));
const StudentCourses = lazy(() => import("@/pages/portal/student/StudentCourses"));
const CourseDetail = lazy(() => import("@/pages/portal/student/CourseDetail"));
const StudentProjects = lazy(() => import("@/pages/portal/student/StudentProjects"));
const StudentCertificates = lazy(() => import("@/pages/portal/student/StudentCertificates"));
const StudentInternships = lazy(() => import("@/pages/portal/student/StudentInternships"));
const StudentSchedule = lazy(() => import("@/pages/portal/student/StudentSchedule"));
const StudentSupport = lazy(() => import("@/pages/portal/student/StudentSupport"));
const StudentPayments = lazy(() => import("@/pages/portal/student/StudentPayments"));

// Trainer Portal
const TrainerDashboard = lazy(() => import("@/pages/portal/trainer/TrainerDashboard"));
const TrainerStudents = lazy(() => import("@/pages/portal/trainer/TrainerStudents"));
const TrainerCourses = lazy(() => import("@/pages/portal/trainer/TrainerCourses"));
const TrainerAssignments = lazy(() => import("@/pages/portal/trainer/TrainerAssignments"));
const TrainerSchedule = lazy(() => import("@/pages/portal/trainer/TrainerSchedule"));
const TrainerMentorship = lazy(() => import("@/pages/portal/trainer/TrainerMentorship"));
const TrainerInternships = lazy(() => import("@/pages/portal/trainer/TrainerInternships"));
const TrainerProjects = lazy(() => import("@/pages/portal/trainer/TrainerProjects"));

// Admin Portal
const AdminDashboard = lazy(() => import("@/pages/portal/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/portal/admin/AdminUsers"));
const AdminCourses = lazy(() => import("@/pages/portal/admin/AdminCourses"));
const AdminInternships = lazy(() => import("@/pages/portal/admin/AdminInternships"));
const AdminProjects = lazy(() => import("@/pages/portal/admin/AdminProjects"));
const AdminPayments = lazy(() => import("@/pages/portal/admin/AdminPayments"));
const AdminBadges = lazy(() => import("@/pages/portal/admin/AdminBadges"));
const AdminAnalytics = lazy(() => import("@/pages/portal/admin/AdminAnalytics"));
const AdminBranding = lazy(() => import("@/pages/portal/admin/AdminBranding"));
const AdminTools = lazy(() => import("@/pages/portal/admin/AdminTools"));
const AdminBlogManager = lazy(() => import("@/pages/portal/admin/AdminBlogManager"));
const AdminTeamManager = lazy(() => import("@/pages/portal/admin/AdminTeamManager"));

// Super Admin Portal
const SuperAdminDashboard = lazy(() => import("@/pages/portal/super-admin/SuperAdminDashboard"));
const SuperAdminAdmins = lazy(() => import("@/pages/portal/super-admin/SuperAdminAdmins"));
const SuperAdminUsers = lazy(() => import("@/pages/portal/super-admin/SuperAdminUsers"));
const SuperAdminConfig = lazy(() => import("@/pages/portal/super-admin/SuperAdminConfig"));
const SuperAdminAnalytics = lazy(() => import("@/pages/portal/super-admin/SuperAdminAnalytics"));

// Shared Portal Pages
const PortalSettings = lazy(() => import("@/pages/portal/shared/PortalSettings"));
const PortalHelp = lazy(() => import("@/pages/portal/shared/PortalHelp"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
          <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
          <Route path="/internships" element={<PageTransition><Internships /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/partners" element={<PageTransition><Partners /></PageTransition>} />
          <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogDetail /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<PaymentSuccess />} />

          {/* Student Portal */}
          <Route path="/portal/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/portal/student/courses" element={<ProtectedRoute allowedRoles={["student"]}><StudentCourses /></ProtectedRoute>} />
          <Route path="/portal/student/courses/:courseId" element={<ProtectedRoute allowedRoles={["student"]}><CourseDetail /></ProtectedRoute>} />
          <Route path="/portal/student/projects" element={<ProtectedRoute allowedRoles={["student"]}><StudentProjects /></ProtectedRoute>} />
          <Route path="/portal/student/certificates" element={<ProtectedRoute allowedRoles={["student"]}><StudentCertificates /></ProtectedRoute>} />
          <Route path="/portal/student/internship" element={<ProtectedRoute allowedRoles={["student"]}><StudentInternships /></ProtectedRoute>} />
          <Route path="/portal/student/schedule" element={<ProtectedRoute allowedRoles={["student"]}><StudentSchedule /></ProtectedRoute>} />
          <Route path="/portal/student/support" element={<ProtectedRoute allowedRoles={["student"]}><StudentSupport /></ProtectedRoute>} />
          <Route path="/portal/student/billing" element={<ProtectedRoute allowedRoles={["student"]}><StudentPayments /></ProtectedRoute>} />
          <Route path="/portal/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><PortalSettings /></ProtectedRoute>} />

          {/* Trainer Portal */}
          <Route path="/portal/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerDashboard /></ProtectedRoute>} />
          <Route path="/portal/trainer/students" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerStudents /></ProtectedRoute>} />
          <Route path="/portal/trainer/courses" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerCourses /></ProtectedRoute>} />
          <Route path="/portal/trainer/assignments" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerAssignments /></ProtectedRoute>} />
          <Route path="/portal/trainer/schedule" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerSchedule /></ProtectedRoute>} />
          <Route path="/portal/trainer/mentorship" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerMentorship /></ProtectedRoute>} />
          <Route path="/portal/trainer/internships" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerInternships /></ProtectedRoute>} />
          <Route path="/portal/trainer/projects" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerProjects /></ProtectedRoute>} />

          {/* Admin Portal */}
          <Route path="/portal/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/portal/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/portal/admin/courses" element={<ProtectedRoute allowedRoles={["admin"]}><AdminCourses /></ProtectedRoute>} />
          <Route path="/portal/admin/internships" element={<ProtectedRoute allowedRoles={["admin"]}><AdminInternships /></ProtectedRoute>} />
          <Route path="/portal/admin/projects" element={<ProtectedRoute allowedRoles={["admin"]}><AdminProjects /></ProtectedRoute>} />
          <Route path="/portal/admin/payments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminPayments /></ProtectedRoute>} />
          <Route path="/portal/admin/badges" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBadges /></ProtectedRoute>} />
          <Route path="/portal/admin/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/portal/admin/branding" element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><AdminBranding /></ProtectedRoute>} />
          <Route path="/portal/admin/blogs" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBlogManager /></ProtectedRoute>} />
          <Route path="/portal/admin/team" element={<ProtectedRoute allowedRoles={["admin"]}><AdminTeamManager /></ProtectedRoute>} />
          <Route path="/portal/admin/tools" element={<ProtectedRoute allowedRoles={["admin", "super_admin"]}><AdminTools /></ProtectedRoute>} />

          {/* Super Admin Portal */}
          <Route path="/portal/super-admin" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/portal/super-admin/admins" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminAdmins /></ProtectedRoute>} />
          <Route path="/portal/super-admin/users" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminUsers /></ProtectedRoute>} />
          <Route path="/portal/super-admin/config" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminConfig /></ProtectedRoute>} />
          <Route path="/portal/super-admin/analytics" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminAnalytics /></ProtectedRoute>} />

          {/* Shared Portal Routes */}
          <Route path="/portal/settings" element={<ProtectedRoute allowedRoles={["student", "trainer", "admin", "super_admin"]}><PortalSettings /></ProtectedRoute>} />
          <Route path="/portal/help" element={<ProtectedRoute allowedRoles={["student", "trainer", "admin", "super_admin"]}><PortalHelp /></ProtectedRoute>} />

          {/* Experimental/Testing */}
          <Route path="/courses/:id" element={<PageTransition><CoursePage /></PageTransition>} />
          <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />

          {/* Catch-all */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
