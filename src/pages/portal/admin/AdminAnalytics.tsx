import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react";

const overviewStats = [
  { label: "Total Visitors", value: "12,847", change: "+24%", trend: "up" },
  { label: "Active Users", value: "1,247", change: "+12%", trend: "up" },
  { label: "Avg. Session", value: "8m 32s", change: "+5%", trend: "up" },
  { label: "Bounce Rate", value: "32%", change: "-8%", trend: "down" },
];

const topPages = [
  { page: "/training", views: 4520, change: "+15%" },
  { page: "/internships", views: 3890, change: "+22%" },
  { page: "/courses/software-development", views: 2340, change: "+8%" },
  { page: "/about", views: 1890, change: "+5%" },
  { page: "/contact", views: 1456, change: "+12%" },
];

const courseEngagement = [
  { course: "Software Development", students: 245, completionRate: 72, avgTime: "45m" },
  { course: "Data Science & AI", students: 189, completionRate: 65, avgTime: "52m" },
  { course: "Internet of Things", students: 156, completionRate: 68, avgTime: "38m" },
  { course: "AI Fundamentals", students: 312, completionRate: 45, avgTime: "25m" },
];

const userLocations = [
  { country: "Rwanda", users: 856, percentage: 69 },
  { country: "Kenya", users: 198, percentage: 16 },
  { country: "Uganda", users: 112, percentage: 9 },
  { country: "Other", users: 81, percentage: 6 },
];

const deviceStats = [
  { device: "Mobile", percentage: 62, icon: Smartphone },
  { device: "Desktop", percentage: 32, icon: Monitor },
  { device: "Tablet", percentage: 6, icon: Monitor },
];

export default function AdminAnalytics() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform performance and user engagement insights
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {overviewStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-card-foreground/60 mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs ${
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
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Charts Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Traffic Chart Placeholder */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Traffic Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-background/50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">Traffic chart visualization</p>
                    <p className="text-xs text-muted-foreground mt-1">Data: 12,847 visitors this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Engagement */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Course Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseEngagement.map((course) => (
                    <div key={course.course} className="p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-card-foreground text-sm">{course.course}</h4>
                        <Badge className="bg-accent/20 text-accent">{course.students} students</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-card-foreground/60 text-xs">Completion</p>
                          <p className="font-medium text-card-foreground">{course.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-card-foreground/60 text-xs">Avg. Time/Lesson</p>
                          <p className="font-medium text-card-foreground">{course.avgTime}</p>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Top Pages */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Eye className="w-5 h-5 text-accent" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-card-foreground/50 w-4">{index + 1}</span>
                      <span className="text-sm text-card-foreground truncate max-w-[150px]">
                        {page.page}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground">{page.views.toLocaleString()}</p>
                      <p className="text-xs text-green-400">{page.change}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* User Locations */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  User Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userLocations.map((location) => (
                  <div key={location.country}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-card-foreground">{location.country}</span>
                      <span className="text-sm text-card-foreground/70">{location.percentage}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-accent" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between p-2 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <device.icon className="w-4 h-4 text-accent" />
                      <span className="text-sm text-card-foreground">{device.device}</span>
                    </div>
                    <span className="text-sm font-medium text-accent">{device.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PortalLayout>
  );
}
