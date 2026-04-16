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
  Calendar,
  Globe,
  Activity,
  Server,
  Zap,
} from "lucide-react";

import { useQuery } from "@apollo/client/react";
import { GET_ANALYTICS, GET_ADMIN_DASHBOARD_DATA, GET_RECENT_ACTIVITY } from "@/lib/graphql/queries";


export default function SuperAdminAnalytics() {
  const { data: analyticsData, loading: analyticsLoading } = useQuery(GET_ANALYTICS);
  const { data: dashboardData } = useQuery(GET_ADMIN_DASHBOARD_DATA);
  const { data: activityData } = useQuery(GET_RECENT_ACTIVITY, { pollInterval: 15000 });

  const analytics = (analyticsData as any)?.analytics;
  const liveStats = (dashboardData as any)?.adminDashboardData?.stats || { totalRevenue: 0, totalUsers: 0, totalCourses: 0 };
  const recentActivityLogs = (activityData as any)?.recentActivity || [];

  const monthlyGrowth = analytics ? analytics.userGrowth.map((ug: any, i: number) => ({
    month: ug.label,
    users: ug.value,
    revenue: analytics.revenueGrowth[i]?.value || 0
  })) : [];

  const maxUsers = Math.max(...monthlyGrowth.map((m: any) => m.users), 1);
  const maxRevenue = Math.max(...monthlyGrowth.map((m: any) => m.revenue), 1);

  const globalStats = [
    { label: "Total Revenue", value: liveStats.totalRevenue.toLocaleString() + " RWF", icon: DollarSign },
    { label: "Total Users", value: liveStats.totalUsers.toString(), icon: Users },
    { label: "Active Courses", value: liveStats.totalCourses.toString(), icon: BookOpen },
    { label: "Server Status", value: "Operational", icon: Activity },
  ];

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
              Live platform metrics and performance tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Live Feed
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
            className="lg:col-span-3"
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
                  {monthlyGrowth.map((month: any, index: number) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <span className="w-12 text-sm text-card-foreground/70">{month.month}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="h-4 bg-accent/80 rounded"
                            style={{ width: `${(month.users / maxUsers) * 100}%` }}
                          />
                          <span className="text-xs text-card-foreground/60">{month.users} users</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-4 bg-green-500/60 rounded"
                            style={{ width: `${(month.revenue / maxRevenue) * 100}%` }}
                          />
                          <span className="text-xs text-card-foreground/60">{month.revenue.toLocaleString()} RWF</span>
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
                Live System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivityLogs.length === 0 ? (
                  <div className="text-center py-6 text-sm text-muted-foreground">No recent activity detected.</div>
                ) : recentActivityLogs.slice(0, 10).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-accent/20`}>
                        <Activity className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground capitalize">{activity.action.replace('_', ' ')}</p>
                        <p className="text-xs text-card-foreground/60">{activity.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-card-foreground/50">{new Date(parseInt(activity.timestamp)).toLocaleString()}</span>
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
