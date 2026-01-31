import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Globe,
  Activity,
  Server,
  Database,
  Zap,
} from "lucide-react";

const globalStats = [
  { label: "Total Revenue", value: "24.7M RWF", change: "+32%", trend: "up", icon: DollarSign },
  { label: "Total Users", value: "1,247", change: "+18%", trend: "up", icon: Users },
  { label: "Active Courses", value: "8", change: "+2", trend: "up", icon: BookOpen },
  { label: "Completion Rate", value: "67%", change: "+5%", trend: "up", icon: TrendingUp },
];

const systemHealth = [
  { metric: "API Response Time", value: "125ms", status: "healthy" },
  { metric: "Database Load", value: "23%", status: "healthy" },
  { metric: "Storage Used", value: "45.2 GB", status: "warning" },
  { metric: "Active Sessions", value: "324", status: "healthy" },
];

const recentActivity = [
  { action: "New admin added", user: "Sarah Uwimana", time: "2 hours ago", type: "admin" },
  { action: "Course pricing updated", user: "Emmanuel K.", time: "4 hours ago", type: "course" },
  { action: "New partner company", user: "System", time: "Yesterday", type: "partner" },
  { action: "Security audit completed", user: "System", time: "2 days ago", type: "security" },
];

const monthlyGrowth = [
  { month: "Oct", users: 890, revenue: 18.2 },
  { month: "Nov", users: 1024, revenue: 20.5 },
  { month: "Dec", users: 1156, revenue: 22.1 },
  { month: "Jan", users: 1247, revenue: 24.7 },
];

export default function SuperAdminAnalytics() {
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
              Global Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform-wide metrics and system health
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              All Time
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </motion.div>

        {/* Global Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {globalStats.map((stat) => (
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Platform Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyGrowth.map((month, index) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <span className="w-12 text-sm text-card-foreground/70">{month.month}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="h-4 bg-accent/80 rounded"
                            style={{ width: `${(month.users / 1300) * 100}%` }}
                          />
                          <span className="text-xs text-card-foreground/60">{month.users} users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 bg-green-500/60 rounded"
                            style={{ width: `${(month.revenue / 30) * 100}%` }}
                          />
                          <span className="text-xs text-card-foreground/60">{month.revenue}M RWF</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent/80" />
                    <span className="text-xs text-card-foreground/60">Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500/60" />
                    <span className="text-xs text-card-foreground/60">Revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Server className="w-5 h-5 text-accent" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemHealth.map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === "healthy" ? "bg-green-400" : "bg-orange-400"
                      }`} />
                      <span className="text-sm text-card-foreground">{item.metric}</span>
                    </div>
                    <span className="text-sm font-medium text-card-foreground/70">{item.value}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Zap className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Admin Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Recent Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "admin" ? "bg-purple-500/20" :
                        activity.type === "course" ? "bg-blue-500/20" :
                        activity.type === "partner" ? "bg-green-500/20" : "bg-accent/20"
                      }`}>
                        {activity.type === "admin" ? <Users className="w-5 h-5 text-purple-400" /> :
                         activity.type === "course" ? <BookOpen className="w-5 h-5 text-blue-400" /> :
                         activity.type === "partner" ? <Globe className="w-5 h-5 text-green-400" /> :
                         <Database className="w-5 h-5 text-accent" />}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{activity.action}</p>
                        <p className="text-xs text-card-foreground/60">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-card-foreground/50">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PortalLayout>
  );
}
