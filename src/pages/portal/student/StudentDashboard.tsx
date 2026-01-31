import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  PlayCircle,
  Award,
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Target,
  Users,
  Flame,
} from "lucide-react";

// Mock data for student dashboard
const enrolledCourses = [
  {
    id: "software-dev",
    title: "Software Development",
    progress: 68,
    currentLesson: "React Hooks & State Management",
    totalLessons: 24,
    completedLessons: 16,
    nextSession: "Today, 6:00 PM",
    instructor: "Marie Claire",
  },
  {
    id: "data-science",
    title: "Data Science & AI",
    progress: 35,
    currentLesson: "Introduction to Machine Learning",
    totalLessons: 32,
    completedLessons: 11,
    nextSession: "Tomorrow, 4:00 PM",
    instructor: "Emmanuel Kwizera",
  },
];

const upcomingSessions = [
  { title: "React Advanced Patterns", time: "Today, 6:00 PM", course: "Software Development", type: "Live Session" },
  { title: "Office Hours", time: "Wed, 2:00 PM", course: "Data Science", type: "Mentorship" },
  { title: "Project Review", time: "Fri, 5:00 PM", course: "Software Development", type: "Review" },
];

const recentAchievements = [
  { title: "First Project Completed", date: "2 days ago", icon: CheckCircle },
  { title: "5-Day Streak", date: "Today", icon: Flame },
  { title: "Quiz Master: JavaScript", date: "1 week ago", icon: Award },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Welcome back, {user?.fullName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your learning journey. You're making great progress!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">5 Day Streak!</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">2</p>
                  <p className="text-xs text-card-foreground/60">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">27</p>
                  <p className="text-xs text-card-foreground/60">Lessons Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">48h</p>
                  <p className="text-xs text-card-foreground/60">Learning Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">3</p>
                  <p className="text-xs text-card-foreground/60">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Continue Learning</CardTitle>
                <Link to="/portal/student/courses">
                  <Button variant="ghost" size="sm" className="text-accent">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 bg-background/50 rounded-lg border border-border/30 hover:border-accent/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading font-semibold text-card-foreground">
                          {course.title}
                        </h3>
                        <p className="text-sm text-card-foreground/60 mt-0.5">
                          {course.currentLesson}
                        </p>
                      </div>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                        {course.progress}% complete
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-card-foreground/60">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {course.nextSession}
                        </span>
                      </div>
                      <Link to={`/portal/student/courses/${course.id}`}>
                        <Button variant="gold" size="sm">
                          <PlayCircle className="w-4 h-4 mr-1" />
                          Continue
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="p-3 bg-background/50 rounded-lg border border-border/30"
                    >
                      <p className="font-medium text-sm text-card-foreground">{session.title}</p>
                      <p className="text-xs text-card-foreground/60 mt-1">{session.course}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-accent">{session.time}</span>
                        <span className="text-xs bg-card px-2 py-0.5 rounded text-card-foreground/70">
                          {session.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <achievement.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{achievement.title}</p>
                        <p className="text-xs text-card-foreground/60">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Internship Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-card-foreground">Internship Ready</p>
                      <p className="text-xs text-card-foreground/60">Complete 80% to unlock</p>
                    </div>
                  </div>
                  <Progress value={68} className="h-2 mb-2" />
                  <p className="text-xs text-card-foreground/70">12% more to qualify for internship placement</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
