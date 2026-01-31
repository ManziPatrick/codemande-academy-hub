import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Save,
  RefreshCw,
  Database,
  Lock,
  Key,
} from "lucide-react";

export default function SuperAdminConfig() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

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
              Platform Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage global settings and platform configuration
            </p>
          </div>
          <Button variant="gold" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Changes</>
            )}
          </Button>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Platform Name</label>
                      <Input defaultValue="CODEMANDE" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Support Email</label>
                      <Input defaultValue="support@codemande.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Platform Description</label>
                    <Textarea 
                      defaultValue="Africa's premier e-learning platform for software development, data science, and IoT training." 
                      rows={3}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Default Language</label>
                      <Input defaultValue="English" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Timezone</label>
                      <Input defaultValue="Africa/Kigali (CAT)" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Feature Toggles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "New User Registration", description: "Allow new users to register", enabled: true },
                    { label: "Course Reviews", description: "Allow students to review courses", enabled: true },
                    { label: "Discussion Forums", description: "Enable course discussion forums", enabled: false },
                    { label: "Live Sessions", description: "Enable live training sessions", enabled: true },
                    { label: "Internship Module", description: "Enable internship applications", enabled: true },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">{feature.label}</p>
                        <p className="text-sm text-card-foreground/60">{feature.description}</p>
                      </div>
                      <Switch defaultChecked={feature.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Mail className="w-5 h-5 text-accent" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">SMTP Host</label>
                      <Input placeholder="smtp.example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">SMTP Port</label>
                      <Input placeholder="587" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">SMTP Username</label>
                      <Input placeholder="username" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">SMTP Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Email</label>
                    <Input defaultValue="noreply@codemande.com" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Use SSL/TLS</p>
                      <p className="text-sm text-card-foreground/60">Enable secure email connection</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    Payment Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <p className="font-medium text-card-foreground">Internship Fee</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Input defaultValue="20000" className="max-w-[150px]" />
                      <span className="text-card-foreground/70">RWF</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Currency</label>
                    <Input defaultValue="RWF (Rwandan Franc)" />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-card-foreground">Payment Methods</h4>
                    {[
                      { label: "Mobile Money (MTN, Airtel)", enabled: true },
                      { label: "Bank Transfer", enabled: true },
                      { label: "Credit/Debit Card", enabled: false },
                      { label: "PayPal", enabled: false },
                    ].map((method) => (
                      <div key={method.label} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <span className="text-card-foreground">{method.label}</span>
                        <Switch defaultChecked={method.enabled} />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Free Trial for Courses</p>
                      <p className="text-sm text-card-foreground/60">Number of free lessons per course</p>
                    </div>
                    <Input defaultValue="2" className="max-w-[80px]" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Two-Factor Authentication", description: "Require 2FA for admin accounts", enabled: true },
                    { label: "Session Timeout", description: "Auto logout after 30 minutes of inactivity", enabled: true },
                    { label: "Password Complexity", description: "Require strong passwords", enabled: true },
                    { label: "Login Notifications", description: "Email users on new login", enabled: false },
                  ].map((setting) => (
                    <div key={setting.label} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                      <div>
                        <p className="font-medium text-card-foreground">{setting.label}</p>
                        <p className="text-sm text-card-foreground/60">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Key className="w-5 h-5 text-accent" />
                    API Keys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-card-foreground">Production API Key</span>
                      <Badge>Active</Badge>
                    </div>
                    <code className="text-xs text-card-foreground/60 bg-card p-2 rounded block">
                      cm_live_••••••••••••••••
                    </code>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate API Key
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Palette className="w-5 h-5 text-accent" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Color</label>
                      <div className="flex gap-2">
                        <Input defaultValue="#C9A962" className="flex-1" />
                        <div className="w-10 h-10 rounded bg-accent border border-border" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Background Color</label>
                      <div className="flex gap-2">
                        <Input defaultValue="#EDEADE" className="flex-1" />
                        <div className="w-10 h-10 rounded bg-background border border-border" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Logo URL</label>
                    <Input placeholder="https://example.com/logo.png" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Dark Mode</p>
                      <p className="text-sm text-card-foreground/60">Enable dark mode option for users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
