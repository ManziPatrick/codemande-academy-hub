import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@apollo/client/react";
import { UPDATE_THEME } from "@/lib/graphql/mutations";
import { GET_ME } from "@/lib/graphql/queries";
import { toast } from "sonner";
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
  Sparkles,
  Check,
  RotateCcw,
  Layout,
} from "lucide-react";

const colorPresets = [
  { name: "Academic Gold", color: "#BC9229" },
  { name: "Oxford Blue", color: "#002147" },
  { name: "Royal Purple", color: "#6A0DAD" },
  { name: "Forest Green", color: "#013220" },
  { name: "Modern Indigo", color: "#6366F1" },
  { name: "Classic Slate", color: "#475569" },
];

export default function PortalSettings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [updateThemeMutation, { loading: saving }] = useMutation(UPDATE_THEME, {
    refetchQueries: [{ query: GET_ME }],
    onCompleted: (data: any) => {
      if (data.updateTheme?.themePreference) {
        updateUser({ themePreference: data.updateTheme.themePreference });
        toast.success("Preferences updated successfully");
      }
    },
  });

  const [localTheme, setLocalTheme] = useState({
    primaryColor: user?.themePreference?.primaryColor || "#BC9229",
    mode: theme || "light",
    lightBg: user?.themePreference?.lightBg || "#F8FAFC",
    darkBg: user?.themePreference?.darkBg || "#020617",
  });

  useEffect(() => {
    if (user?.themePreference) {
      setLocalTheme({
        primaryColor: user.themePreference.primaryColor || "#BC9229",
        mode: user.themePreference.mode || theme || "light",
        lightBg: user.themePreference.lightBg || "#F8FAFC",
        darkBg: user.themePreference.darkBg || "#020617",
      });
    }
  }, [user, theme]);

  const handleSavePreferences = async () => {
    try {
      await updateThemeMutation({
        variables: {
          primaryColor: localTheme.primaryColor,
          mode: localTheme.mode,
          lightBg: localTheme.lightBg,
          darkBg: localTheme.darkBg,
        }
      });
      setTheme(localTheme.mode);
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    }
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
              Manage your account and visual preferences
            </p>
          </div>
          <Button variant="gold" onClick={handleSavePreferences} disabled={saving} className="shadow-lg shadow-primary/20">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Apply All Settings"}
          </Button>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-card/50">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
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
                      <Avatar className="w-24 h-24 shadow-xl">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                          {user?.fullName ? getInitials(user.fullName) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-card-foreground">{user?.fullName}</h3>
                      <p className="text-sm text-card-foreground/60 capitalize mb-2">{user?.role?.replace("_", " ")}</p>
                      <Button variant="outline" size="sm" className="h-8">
                        Upload Image
                      </Button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Username / Full Name</label>
                      <Input defaultValue={user?.fullName} className="bg-muted/30" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <div className="flex gap-2">
                        <Input defaultValue={user?.email} disabled className="bg-muted/50" />
                        <Button variant="outline" size="icon" disabled>
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number</label>
                      <div className="flex gap-2">
                        <Input placeholder="+250 7XX XXX XXX" className="bg-muted/30" />
                        <Button variant="outline" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <div className="flex gap-2">
                        <Input placeholder="Kigali, Rwanda" className="bg-muted/30" />
                        <Button variant="outline" size="icon">
                          <MapPin className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Professional Bio</label>
                    <Textarea
                      placeholder="Share a bit about your journey..."
                      rows={4}
                      className="bg-muted/30 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Preferences */}
          <TabsContent value="preferences">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/20">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <Palette className="w-5 h-5 text-primary" />
                      Visual Personalization
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary h-8"
                      onClick={async () => {
                        try {
                          await updateThemeMutation({
                            variables: {
                              primaryColor: null,
                              mode: "light",
                              lightBg: null,
                              darkBg: null,
                            }
                          });
                          toast.success("Reset to default branding");
                        } catch (e) {
                          toast.error("Failed to reset");
                        }
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-2" />
                      Reset to Default
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                  {/* Theme Mode */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Theme Mode</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setLocalTheme({ ...localTheme, mode: 'light' })}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${localTheme.mode === 'light' ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border'
                          }`}
                      >
                        <div className="w-full h-12 bg-white rounded-md border border-border shadow-inner" />
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      <button
                        onClick={() => setLocalTheme({ ...localTheme, mode: 'dark' })}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${localTheme.mode === 'dark' ? 'border-primary bg-primary/20' : 'border-border/50 hover:border-border'
                          }`}
                      >
                        <div className="w-full h-12 bg-slate-900 rounded-md border border-slate-700 shadow-inner" />
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Color Selection */}
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Primary Accent Color</h4>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.color}
                          onClick={() => setLocalTheme({ ...localTheme, primaryColor: preset.color })}
                          className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${localTheme.primaryColor === preset.color
                              ? 'border-primary bg-primary/5'
                              : 'border-transparent hover:border-border'
                            }`}
                        >
                          <div
                            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110"
                            style={{ backgroundColor: preset.color }}
                          >
                            {localTheme.primaryColor === preset.color && <Check className="w-4 h-4 text-white shadow-sm" />}
                          </div>
                          <span className="text-[10px] font-medium text-center leading-tight">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-6 p-4 bg-muted/20 rounded-xl border border-border/50">
                      <div className="relative group overflow-hidden w-12 h-12 rounded-lg border-2 border-border shadow-md">
                        <input
                          type="color"
                          value={localTheme.primaryColor}
                          onChange={(e) => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer scale-[5]"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: localTheme.primaryColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Custom Color</p>
                        <p className="text-xs text-muted-foreground">Choose your own hex code or pick from the spectrum</p>
                      </div>
                      <Input
                        value={localTheme.primaryColor}
                        onChange={(e) => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                        className="w-24 h-9 font-mono uppercase text-xs"
                      />
                    </div>
                  </div>

                  {/* Background Customization */}
                  <div className="space-y-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Layout className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Background Environment</h4>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Light Background */}
                      <div className="p-4 bg-background/40 rounded-xl border-2 border-border/50 space-y-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Light Background Mode</p>
                        <div className="flex items-center gap-4">
                          <div className="relative group overflow-hidden w-10 h-10 rounded-lg border-2 border-border shadow-sm">
                            <input
                              type="color"
                              value={localTheme.lightBg}
                              onChange={(e) => setLocalTheme({ ...localTheme, lightBg: e.target.value })}
                              className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: localTheme.lightBg }} />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={localTheme.lightBg}
                              onChange={(e) => setLocalTheme({ ...localTheme, lightBg: e.target.value })}
                              className="h-8 font-mono text-xs bg-muted/30 border-border"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#FFF7ED'].map(c => (
                            <button
                              key={c}
                              onClick={() => setLocalTheme({ ...localTheme, lightBg: c })}
                              className="w-6 h-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Dark Background */}
                      <div className="p-4 bg-muted/20 rounded-xl border-2 border-border/50 space-y-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Dark Background Mode</p>
                        <div className="flex items-center gap-4">
                          <div className="relative group overflow-hidden w-10 h-10 rounded-lg border-2 border-border shadow-sm">
                            <input
                              type="color"
                              value={localTheme.darkBg}
                              onChange={(e) => setLocalTheme({ ...localTheme, darkBg: e.target.value })}
                              className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                            />
                            <div className="w-full h-full" style={{ backgroundColor: localTheme.darkBg }} />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={localTheme.darkBg}
                              onChange={(e) => setLocalTheme({ ...localTheme, darkBg: e.target.value })}
                              className="h-8 font-mono text-xs bg-muted/30 border-border"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {['#020617', '#0F172A', '#1C1917', '#000000'].map(c => (
                            <button
                              key={c}
                              onClick={() => setLocalTheme({ ...localTheme, darkBg: c })}
                              className="w-6 h-6 rounded-full border border-border shadow-sm hover:scale-110 transition-transform"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ... Other Tabs remain the same for now ... */}
          <TabsContent value="notifications">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Bell className="w-5 h-5 text-accent" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Configure your notification preferences here.</p>
                {/* Mock data or existing content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Manage your account security and password.</p>
                {/* Mock data or existing content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
