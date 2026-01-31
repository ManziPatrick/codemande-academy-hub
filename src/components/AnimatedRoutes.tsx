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

// Student Portal
import StudentDashboard from "@/pages/portal/student/StudentDashboard";
import StudentCourses from "@/pages/portal/student/StudentCourses";
import CourseDetail from "@/pages/portal/student/CourseDetail";
import StudentProjects from "@/pages/portal/student/StudentProjects";
import StudentCertificates from "@/pages/portal/student/StudentCertificates";
import StudentInternship from "@/pages/portal/student/StudentInternship";
import StudentSchedule from "@/pages/portal/student/StudentSchedule";
import StudentSupport from "@/pages/portal/student/StudentSupport";

// Trainer Portal
import TrainerDashboard from "@/pages/portal/trainer/TrainerDashboard";
import TrainerStudents from "@/pages/portal/trainer/TrainerStudents";

// Admin Portal
import AdminDashboard from "@/pages/portal/admin/AdminDashboard";
import AdminUsers from "@/pages/portal/admin/AdminUsers";

// Super Admin Portal
import SuperAdminDashboard from "@/pages/portal/super-admin/SuperAdminDashboard";

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
        <Route path="/portal/student/internship" element={<ProtectedRoute allowedRoles={["student"]}><StudentInternship /></ProtectedRoute>} />
        <Route path="/portal/student/schedule" element={<ProtectedRoute allowedRoles={["student"]}><StudentSchedule /></ProtectedRoute>} />
        <Route path="/portal/student/support" element={<ProtectedRoute allowedRoles={["student"]}><StudentSupport /></ProtectedRoute>} />

        {/* Trainer Portal */}
        <Route path="/portal/trainer" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/portal/trainer/students" element={<ProtectedRoute allowedRoles={["trainer"]}><TrainerStudents /></ProtectedRoute>} />

        {/* Admin Portal */}
        <Route path="/portal/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/portal/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />

        {/* Super Admin Portal */}
        <Route path="/portal/super-admin" element={<ProtectedRoute allowedRoles={["super_admin"]}><SuperAdminDashboard /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
