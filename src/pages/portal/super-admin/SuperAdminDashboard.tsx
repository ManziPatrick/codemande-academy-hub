import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  Globe,
  Database,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
} from "lucide-react";

const systemStats = [
  { label: "Total Users", value: "1,247", icon: Users },
  { label: "Active Sessions", value: "324", icon: Activity },
  { label: "System Uptime", value: "99.9%", icon: Server },
  { label: "Storage Used", value: "45.2 GB", icon: Database },
];

const adminAccounts = [
  { name: "Sarah Uwimana", email: "sarah@codemande.com", role: "super_admin", lastActive: "Now" },
  { name: "Emmanuel Kwizera", email: "emmanuel@codemande.com", role: "admin", lastActive: "2 hours ago" },
  { name: "Jean Pierre", email: "jean@codemande.com", role: "admin", lastActive: "Yesterday" },
];

const systemAlerts = [
  { type: "info", message: "System backup completed successfully", time: "2 hours ago" },
  { type: "warning", message: "High traffic detected on course pages", time: "5 hours ago" },
  { type: "success", message: "SSL certificates renewed", time: "1 day ago" },
];

const platformConfigs = [
  { name: "Email Notifications", status: "enabled", description: "Send email notifications to users" },
  { name: "Auto-confirm Emails", status: "disabled", description: "Automatically confirm user emails on signup" },
  { name: "Maintenance Mode", status: "disabled", description: "Put the platform in maintenance mode" },
  { name: "Free Trial Lessons", status: "enabled", description: "Allow 2 free lessons per course" },
  { name: "Internship Applications", status: "enabled", description: "Accept internship applications" },
];

export default function SuperAdminDashboard() {
  const { user } = useAuth();

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
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent" />
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Full system oversight and configuration
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Backup System
            </Button>
            <Button variant="gold">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </div>
        </motion.div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {systemStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-xs text-card-foreground/60">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Admin Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Admin Accounts
                </CardTitle>
                <Button variant="outline" size="sm">Add Admin</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminAccounts.map((admin, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          admin.role === "super_admin" ? "bg-red-500/20" : "bg-purple-500/20"
                        }`}>
                          <Shield className={`w-5 h-5 ${
                            admin.role === "super_admin" ? "text-red-400" : "text-purple-400"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{admin.name}</p>
                          <p className="text-sm text-card-foreground/60">{admin.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${
                          admin.role === "super_admin" ? "text-red-400" : "text-purple-400"
                        }`}>
                          {admin.role.replace("_", " ").toUpperCase()}
                        </p>
                        <p className="text-xs text-card-foreground/60">{admin.lastActive}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Configuration */}
            <Card className="border-border/50 mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent" />
                  Platform Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformConfigs.map((config, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-card-foreground">{config.name}</p>
                        <p className="text-sm text-card-foreground/60">{config.description}</p>
                      </div>
                      <Button
                        variant={config.status === "enabled" ? "default" : "outline"}
                        size="sm"
                        className={config.status === "enabled" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {config.status === "enabled" ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="p-3 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        {alert.type === "success" && (
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        )}
                        {alert.type === "warning" && (
                          <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                        )}
                        {alert.type === "info" && (
                          <Activity className="w-4 h-4 text-blue-400 mt-0.5" />
                        )}
                        <div>
                          <p className="text-sm text-card-foreground">{alert.message}</p>
                          <p className="text-xs text-card-foreground/60 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                  <Button variant="ghost" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2 text-accent" />
                    View Public Site
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Lock className="w-4 h-4 mr-2 text-accent" />
                    Security Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2 text-accent" />
                    Full Analytics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2 text-accent" />
                    Performance Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
