import { motion } from "framer-motion";
import { Hammer, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/components/BrandingProvider";
import { Link } from "react-router-dom";

const Maintenance = () => {
  const { branding } = useBranding();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center relative z-10">
                <Hammer className="w-12 h-12 text-primary" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-primary/20 rounded-lg flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <Lock className="w-4 h-4 text-primary" />
              </motion.div>
            </div>
          </div>

          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Development Mode Active
          </h1>
          
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />

          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            {branding.siteName} is currently undergoing scheduled maintenance or system updates. 
            Access is currently restricted to <span className="text-foreground font-semibold">Authorized Administrators</span> only.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
            <div className="bg-accent/5 border border-border/50 p-6 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Are you an Admin?</h3>
              <p className="text-sm text-muted-foreground mb-4">You can still log in to manage the platform and settings.</p>
              <Button asChild variant="gold" className="w-full">
                <Link to="/auth">
                  Admin Login <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="bg-accent/5 border border-border/50 p-6 rounded-xl">
              <Mail className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground mb-4">If you are a student or partner, please contact support for urgent matters.</p>
              <Button variant="outline" className="w-full border-primary/20">
                Contact Support
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 {branding.siteName} — Building Africa's Tech Talent.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;
