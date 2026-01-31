import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Video,
  GraduationCap,
} from "lucide-react";

const assignedCourses = [
  {
    id: "software-dev",
    title: "Software Development",
    students: 45,
    progress: 68,
    nextSession: "Today, 6:00 PM",
    pendingAssignments: 12,
  },
  {
    id: "iot",
    title: "Internet of Things",
    students: 28,
    progress: 55,
    nextSession: "Tomorrow, 4:00 PM",
    pendingAssignments: 8,
  },
];

const recentActivity = [
  { type: "submission", student: "Jean Baptiste", action: "submitted Project 3", time: "2 hours ago" },
  { type: "question", student: "Marie Uwase", action: "asked a question in React Hooks", time: "3 hours ago" },
  { type: "completion", student: "Emmanuel K.", action: "completed Module 4", time: "5 hours ago" },
  { type: "submission", student: "Grace M.", action: "submitted Challenge 7", time: "Yesterday" },
];

const upcomingSessions = [
  { title: "React Hooks Deep Dive", time: "Today, 6:00 PM", course: "Software Development", attendees: 32 },
  { title: "IoT Sensors Workshop", time: "Tomorrow, 4:00 PM", course: "Internet of Things", attendees: 18 },
  { title: "Office Hours", time: "Wed, 2:00 PM", course: "All Courses", attendees: 8 },
];

export default function TrainerDashboard() {
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
              Welcome, {user?.fullName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your courses today.
            </p>
          </div>
          <Button variant="gold">
            <Video className="w-4 h-4 mr-2" />
            Start Live Session
          </Button>
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
                  <p className="text-xs text-card-foreground/60">Active Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">73</p>
                  <p className="text-xs text-card-foreground/60">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">20</p>
                  <p className="text-xs text-card-foreground/60">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">5</p>
                  <p className="text-xs text-card-foreground/60">Mentees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Your Courses</CardTitle>
                <Link to="/portal/trainer/courses">
                  <Button variant="ghost" size="sm" className="text-accent">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 bg-background/50 rounded-lg border border-border/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading font-semibold text-card-foreground">
                          {course.title}
                        </h3>
                        <p className="text-sm text-card-foreground/60 mt-0.5">
                          {course.students} students enrolled
                        </p>
                      </div>
                      {course.pendingAssignments > 0 && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                          {course.pendingAssignments} pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-card-foreground/60">Course Progress</span>
                      <span className="text-xs font-medium text-accent">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-card-foreground/60 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Next: {course.nextSession}
                      </span>
                      <Link to={`/portal/trainer/courses/${course.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border/50 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "submission" ? "bg-green-500/20" :
                        activity.type === "question" ? "bg-blue-500/20" : "bg-accent/20"
                      }`}>
                        {activity.type === "submission" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : activity.type === "question" ? (
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground">
                          <span className="font-medium">{activity.student}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-card-foreground/60">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
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
                        <span className="text-xs text-card-foreground/60 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {session.attendees}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Schedule New Session
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/portal/trainer/assignments">
                    <Button variant="ghost" className="w-full justify-start">
                      <AlertCircle className="w-4 h-4 mr-2 text-accent" />
                      Review Submissions (20)
                    </Button>
                  </Link>
                  <Link to="/portal/trainer/students">
                    <Button variant="ghost" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2 text-accent" />
                      Answer Questions (5)
                    </Button>
                  </Link>
                  <Link to="/portal/trainer/courses">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2 text-accent" />
                      Upload New Content
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
