import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Briefcase,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  DollarSign,
  GraduationCap,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,247", change: "+12%", trend: "up", icon: Users },
  { label: "Active Courses", value: "8", change: "+2", trend: "up", icon: BookOpen },
  { label: "Internships", value: "45", change: "+8%", trend: "up", icon: Briefcase },
  { label: "Revenue (RWF)", value: "2.4M", change: "+18%", trend: "up", icon: DollarSign },
];

const recentEnrollments = [
  { name: "Jean Baptiste", course: "Software Development", date: "Today", amount: "150,000 RWF" },
  { name: "Marie Uwase", course: "Data Science & AI", date: "Today", amount: "180,000 RWF" },
  { name: "Emmanuel K.", course: "IoT Development", date: "Yesterday", amount: "120,000 RWF" },
  { name: "Grace M.", course: "Software Development", date: "Yesterday", amount: "150,000 RWF" },
];

const coursePerformance = [
  { name: "Software Development", students: 245, completion: 72, revenue: "1.2M RWF" },
  { name: "Data Science & AI", students: 189, completion: 65, revenue: "850K RWF" },
  { name: "Internet of Things", students: 156, completion: 68, revenue: "420K RWF" },
];

export default function AdminDashboard() {
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
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and management
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Link to="/portal/admin/users">
              <Button variant="gold">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-card-foreground/60 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      stat.trend === "up" ? "text-green-400" : "text-red-400"
                    }`}>
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Enrollments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Recent Enrollments</CardTitle>
                <Link to="/portal/admin/payments">
                  <Button variant="ghost" size="sm" className="text-accent">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEnrollments.map((enrollment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{enrollment.name}</p>
                          <p className="text-xs text-card-foreground/60">{enrollment.course}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-accent">{enrollment.amount}</p>
                        <p className="text-xs text-card-foreground/60">{enrollment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card className="border-border/50 mt-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Course Performance</CardTitle>
                <Link to="/portal/admin/courses">
                  <Button variant="ghost" size="sm" className="text-accent">
                    Manage Courses <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coursePerformance.map((course, index) => (
                    <div
                      key={index}
                      className="p-4 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-card-foreground">{course.name}</h4>
                        <span className="text-sm text-accent font-medium">{course.revenue}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-card-foreground/60">Students</p>
                          <p className="font-medium text-card-foreground">{course.students}</p>
                        </div>
                        <div>
                          <p className="text-card-foreground/60">Completion</p>
                          <p className="font-medium text-card-foreground">{course.completion}%</p>
                        </div>
                        <div className="text-right">
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent" />
                    Platform Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-card-foreground/60">Active Today</span>
                      <span className="text-lg font-bold text-card-foreground">324</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-accent rounded-full" />
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-card-foreground/60">Lessons Completed</span>
                      <span className="text-lg font-bold text-card-foreground">89</span>
                    </div>
                    <p className="text-xs text-green-400">+15% from yesterday</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-card-foreground/60">Support Tickets</span>
                      <span className="text-lg font-bold text-card-foreground">12</span>
                    </div>
                    <p className="text-xs text-orange-400">3 urgent</p>
                  </div>
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
                  <Link to="/portal/admin/courses">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2 text-accent" />
                      Create New Course
                    </Button>
                  </Link>
                  <Link to="/portal/admin/internships">
                    <Button variant="ghost" className="w-full justify-start">
                      <Briefcase className="w-4 h-4 mr-2 text-accent" />
                      Manage Internships
                    </Button>
                  </Link>
                  <Link to="/portal/admin/analytics">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2 text-accent" />
                      View Analytics
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
