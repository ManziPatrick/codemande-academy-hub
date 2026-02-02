import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BRANDING } from "@/lib/graphql/queries";
import { UPDATE_BRANDING } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { Palette, Save, Layout, Type, Image as ImageIcon, Globe } from "lucide-react";

export default function AdminBranding() {
  const { data, loading } = useQuery(GET_BRANDING);
  const [updateBranding, { loading: updating }] = useMutation(UPDATE_BRANDING, {
    refetchQueries: [{ query: GET_BRANDING }],
  });

  const [formData, setFormData] = useState({
    primaryColor: "#D4AF37",
    secondaryColor: "#B08D2A",
    accentColor: "#D4AF37",
    logoUrl: "",
    siteName: "CODEMANDE",
    portalTitle: "Academy Hub"
  });

  useEffect(() => {
    const branding = (data as any)?.branding;
    if (branding) {
      setFormData({
        primaryColor: branding.primaryColor || "#D4AF37",
        secondaryColor: branding.secondaryColor || "#B08D2A",
        accentColor: branding.accentColor || "#D4AF37",
        logoUrl: branding.logoUrl || "",
        siteName: branding.siteName || "CODEMANDE",
        portalTitle: branding.portalTitle || "Academy Hub"
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateBranding({
        variables: { ...formData }
      });
      toast.success("Branding updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update branding");
    }
  };

  if (loading) return null;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Branding & Theme
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize the look and feel of your portal
            </p>
          </div>
          <Button variant="gold" onClick={handleSave} disabled={updating}>
            <Save className="w-4 h-4 mr-2" />
            {updating ? "Saving..." : "Save Branding"}
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Identity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Platform Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Site Name</label>
                <Input 
                  value={formData.siteName} 
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  placeholder="e.g. CODEMANDE"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Portal Title</label>
                <Input 
                  value={formData.portalTitle} 
                  onChange={(e) => setFormData({...formData, portalTitle: e.target.value})}
                  placeholder="e.g. Academy Hub"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Logo URL</label>
                <div className="flex gap-2">
                  <Input 
                    value={formData.logoUrl} 
                    onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                    placeholder="https://..."
                  />
                  <Button variant="outline" size="icon">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Palette className="w-5 h-5 text-accent" />
                Theme Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium block text-muted-foreground uppercase tracking-wider">Quick Presets</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: 'Gold', color: '#D4AF37' },
                    { name: 'Indigo', color: '#6366F1' },
                    { name: 'Emerald', color: '#10B981' },
                    { name: 'Rose', color: '#F43F5E' },
                    { name: 'Slate', color: '#475569' },
                    { name: 'Amethyst', color: '#9333EA' }
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => setFormData({ ...formData, primaryColor: preset.color, accentColor: preset.color })}
                      className={`group relative w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                        formData.primaryColor === preset.color ? "border-foreground" : "border-transparent"
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    >
                      {formData.primaryColor === preset.color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/30">
                <div className="space-y-3">
                  <label className="text-sm font-medium block">Primary Color</label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input 
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-12 h-10 rounded-lg border border-border shadow-sm transition-transform active:scale-95" 
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                    </div>
                    <Input 
                      value={formData.primaryColor} 
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                      className="font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium block">Accent Color</label>
                  <div className="flex gap-3">
                    <div className="relative">
                      <input 
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <div 
                        className="w-12 h-10 rounded-lg border border-border shadow-sm transition-transform active:scale-95" 
                        style={{ backgroundColor: formData.accentColor }}
                      />
                    </div>
                    <Input 
                      value={formData.accentColor} 
                      onChange={(e) => setFormData({...formData, accentColor: e.target.value})}
                      className="font-mono"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium block">Secondary/Gradient Color</label>
                <div className="flex gap-3">
                  <div className="relative">
                    <input 
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div 
                      className="w-12 h-10 rounded-lg border border-border shadow-sm transition-transform active:scale-95" 
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                  </div>
                  <Input 
                    value={formData.secondaryColor} 
                    onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Layout className="w-5 h-5 text-accent" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-8 rounded-xl border border-border bg-background/50 flex flex-col items-center justify-center space-y-6">
                 <div className="flex items-center gap-3">
                   <div 
                     className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                     style={{ backgroundColor: formData.primaryColor }}
                   >
                     ≪
                   </div>
                   <div className="text-2xl font-bold tracking-tighter" style={{ color: formData.primaryColor }}>
                     {formData.siteName}
                   </div>
                 </div>
                 <h2 className="text-4xl font-heading font-medium text-center">
                   Welcome to the <span style={{ color: formData.accentColor }}>{formData.portalTitle}</span>
                 </h2>
                 <Button style={{ backgroundColor: formData.primaryColor, color: 'white' }}>
                   Get Started
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
