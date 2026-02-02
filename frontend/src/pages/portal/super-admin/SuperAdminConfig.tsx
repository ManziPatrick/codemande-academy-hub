import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cog,
  Shield,
  Palette,
  Mail,
  CreditCard,
  Save,
  Globe,
  Bell,
  Lock,
  Database,
  Cloud,
  Zap,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CONFIGS, GET_BRANDING } from "@/lib/graphql/queries";
import { UPDATE_CONFIG } from "@/lib/graphql/mutations";
import { toast } from "sonner";

export default function SuperAdminConfig() {
  const [activeTab, setActiveTab] = useState("general");
  const { data, loading, refetch } = useQuery(GET_CONFIGS);
  const [updateConfigMutation] = useMutation(UPDATE_CONFIG, {
    refetchQueries: [{ query: GET_CONFIGS }, { query: GET_BRANDING }]
  });

  const [settings, setSettings] = useState({
    siteName: "Codemande Academy",
    siteDescription: "Leading tech education in Rwanda.",
    contactEmail: "contact@codemande.com",
    maintenanceMode: false,
    registrationEnabled: true,
    emailServer: "smtp.gmail.com",
    emailPort: "587",
    paymentGateway: "Mobile Money",
    primaryColor: "#EAB308",
    darkMode: true,
  });

  useEffect(() => {
    const configs = (data as any)?.configs;
    if (configs) {
      const newSettings = { ...settings };
      configs.forEach((c: any) => {
        try {
          (newSettings as any)[c.key] = JSON.parse(c.value);
        } catch {
          (newSettings as any)[c.key] = c.value;
        }
      });
      setSettings(newSettings);
    }
  }, [data]);

  const handleSaveAll = async () => {
    toast.promise(
      Promise.all(Object.entries(settings).map(([key, value]) => 
        updateConfigMutation({
          variables: {
            key,
            value: typeof value === "string" ? value : JSON.stringify(value),
          }
        })
      )),
      {
        loading: 'Saving all settings...',
        success: 'All settings updated successfully!',
        error: 'Error saving settings'
      }
    );
  };

  if (loading) return <PortalLayout><div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-accent" /></div></PortalLayout>;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Platform Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage global settings, security, and appearance
            </p>
          </div>
          <Button variant="gold" className="shadow-lg shadow-gold/20" onClick={handleSaveAll}>
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border/50 p-1 h-auto flex-wrap justify-start">
            <TabsTrigger value="general" className="gap-2 px-4 py-2">
              <Globe className="w-4 h-4" /> General
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2 px-4 py-2">
              <Mail className="w-4 h-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 px-4 py-2">
              <CreditCard className="w-4 h-4" /> Payments
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 px-4 py-2">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2 px-4 py-2">
              <Palette className="w-4 h-4" /> Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                  <CardDescription>Basic details about your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input 
                        id="siteName" 
                        value={settings.siteName} 
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDesc">Site Description</Label>
                    <Textarea 
                        id="siteDesc" 
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Control platform availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Only admins can access the site when on</p>
                    </div>
                    <Switch 
                        checked={settings.maintenanceMode}
                        onCheckedChange={(v) => setSettings({...settings, maintenanceMode: v})}
                    />
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Registrations</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
                    </div>
                    <Switch 
                        checked={settings.registrationEnabled}
                        onCheckedChange={(v) => setSettings({...settings, registrationEnabled: v})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure your email server for notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Server</Label>
                    <Input 
                        value={settings.emailServer}
                        onChange={(e) => setSettings({...settings, emailServer: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input 
                        value={settings.emailPort}
                        onChange={(e) => setSettings({...settings, emailPort: e.target.value})}
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Zap className="w-4 h-4 mr-2 text-gold" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
                <CardDescription>Configure how you receive payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium">MTN Mobile Money Rwanda</h4>
                      <p className="text-xs text-muted-foreground">Connected and Active</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="font-medium">Admin 2FA</p>
                  <p className="text-sm text-muted-foreground">Require Two-Factor Authentication for all admins</p>
                  <Switch className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Branding & Theme</CardTitle>
                <CardDescription>Customize the look and feel of your portal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Accent Color</Label>
                  <div className="flex flex-wrap gap-4 items-center">
                    {["#EAB308", "#3B82F6", "#8B5CF6", "#10B981", "#F43F5E", "#10B981"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSettings({...settings, primaryColor: color})}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          settings.primaryColor === color ? "border-foreground scale-110" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <Separator orientation="vertical" className="h-8 mx-2 bg-border/50" />
                    <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-border/30">
                      <div className="relative w-8 h-8 rounded-full border border-border overflow-hidden">
                        <input 
                          type="color" 
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                        />
                        <div className="w-full h-full" style={{ backgroundColor: settings.primaryColor }} />
                      </div>
                      <Input 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-24 h-8 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
                <Separator className="bg-border/30" />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Forced Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Override user theme preferences</p>
                  </div>
                  <Switch 
                    checked={settings.darkMode}
                    onCheckedChange={(v) => setSettings({...settings, darkMode: v})}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
