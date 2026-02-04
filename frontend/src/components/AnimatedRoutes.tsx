import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import { ProtectedRoute } from "./auth/ProtectedRoute";

// Public Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Training from "@/pages/Training";
import Internships from "@/pages/Internships";
import Projects from "@/pages/Projects";
import Partners from "@/pages/Partners";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import CoursePage from "@/pages/CoursePage";

// Student Portal
import StudentDashboard from "@/pages/portal/student/StudentDashboard";
import StudentCourses from "@/pages/portal/student/StudentCourses";
import CourseDetail from "@/pages/portal/student/CourseDetail";
import StudentProjects from "@/pages/portal/student/StudentProjects";
import StudentCertificates from "@/pages/portal/student/StudentCertificates";
import StudentInternships from "@/pages/portal/student/StudentInternships";
import StudentSchedule from "@/pages/portal/student/StudentSchedule";
import StudentSupport from "@/pages/portal/student/StudentSupport";
import StudentPayments from "@/pages/portal/student/StudentPayments";

// Trainer Portal
import TrainerDashboard from "@/pages/portal/trainer/TrainerDashboard";
import TrainerStudents from "@/pages/portal/trainer/TrainerStudents";
import TrainerCourses from "@/pages/portal/trainer/TrainerCourses";
import TrainerAssignments from "@/pages/portal/trainer/TrainerAssignments";
import TrainerSchedule from "@/pages/portal/trainer/TrainerSchedule";
import TrainerMentorship from "@/pages/portal/trainer/TrainerMentorship";

// Admin Portal
import AdminDashboard from "@/pages/portal/admin/AdminDashboard";
import AdminUsers from "@/pages/portal/admin/AdminUsers";
import AdminCourses from "@/pages/portal/admin/AdminCourses";
import AdminInternships from "@/pages/portal/admin/AdminInternships";
import AdminProjects from "@/pages/portal/admin/AdminProjects";
import AdminPayments from "@/pages/portal/admin/AdminPayments";
import AdminBadges from "@/pages/portal/admin/AdminBadges";
import AdminAnalytics from "@/pages/portal/admin/AdminAnalytics";
import AdminBranding from "@/pages/portal/admin/AdminBranding";

// Super Admin Portal
import SuperAdminDashboard from "@/pages/portal/super-admin/SuperAdminDashboard";
import SuperAdminAdmins from "@/pages/portal/super-admin/SuperAdminAdmins";
import SuperAdminUsers from "@/pages/portal/super-admin/SuperAdminUsers";
import SuperAdminConfig from "@/pages/portal/super-admin/SuperAdminConfig";
import SuperAdminAnalytics from "@/pages/portal/super-admin/SuperAdminAnalytics";

// Shared Portal Pages
import PortalSettings from "@/pages/portal/shared/PortalSettings";
import PortalHelp from "@/pages/portal/shared/PortalHelp";

import { Chat } from "@/components/chat/Chat";

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/training" element={<PageTransition><Training /></PageTransition>} />
        <Route path="/internships" element={<PageTransition><Internships /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/partners" element={<PageTransition><Partners /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/auth" element={<Auth />} />

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

        {/* Trainer Portal */}
        <Route path="/portal/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/portal/trainer/students" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerStudents /></ProtectedRoute>} />
        <Route path="/portal/trainer/courses" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerCourses /></ProtectedRoute>} />
        <Route path="/portal/trainer/assignments" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerAssignments /></ProtectedRoute>} />
        <Route path="/portal/trainer/schedule" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerSchedule /></ProtectedRoute>} />
        <Route path="/portal/trainer/mentorship" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerMentorship /></ProtectedRoute>} />
        <Route path="/portal/trainer/internships" element={<ProtectedRoute allowedRoles={["trainer"]}><AdminInternships /></ProtectedRoute>} />

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
        <Route path="/course/:id" element={<PageTransition><CoursePage /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />

        {/* Catch-all */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
