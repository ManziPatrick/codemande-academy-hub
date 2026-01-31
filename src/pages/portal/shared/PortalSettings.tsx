import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Bell,
  Lock,
  Palette,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function PortalSettings() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

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
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>
          <Button variant="gold" onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <User className="w-5 h-5 text-accent" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-accent/20 text-accent text-2xl">
                          {user?.fullName ? getInitials(user.fullName) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent/90 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-card-foreground">{user?.fullName}</h3>
                      <p className="text-sm text-card-foreground/60 capitalize">{user?.role?.replace("_", " ")}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input defaultValue={user?.fullName} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <div className="flex gap-2">
                        <Input defaultValue={user?.email} disabled />
                        <Button variant="outline" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <div className="flex gap-2">
                        <Input placeholder="+250 7XX XXX XXX" />
                        <Button variant="outline" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <div className="flex gap-2">
                        <Input placeholder="Kigali, Rwanda" />
                        <Button variant="outline" size="icon">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Bell className="w-5 h-5 text-accent" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Email Notifications", description: "Receive updates via email", enabled: true },
                    { label: "Course Updates", description: "New lessons and content", enabled: true },
                    { label: "Session Reminders", description: "Live session notifications", enabled: true },
                    { label: "Progress Reports", description: "Weekly learning reports", enabled: false },
                    { label: "Marketing Emails", description: "News and promotions", enabled: false },
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
                    <Lock className="w-5 h-5 text-accent" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <Button variant="gold">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Two-Factor Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Enable 2FA</p>
                      <p className="text-sm text-card-foreground/60">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Palette className="w-5 h-5 text-accent" />
                    Display Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Dark Mode</p>
                      <p className="text-sm text-card-foreground/60">Use dark theme</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Compact View</p>
                      <p className="text-sm text-card-foreground/60">Show more content in less space</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">Auto-play Videos</p>
                      <p className="text-sm text-card-foreground/60">Automatically play lesson videos</p>
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
