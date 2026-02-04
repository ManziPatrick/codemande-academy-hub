import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Printer, Award, ShieldCheck, MapPin, Globe, Mail, Phone, Calendar, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useBranding } from "@/components/BrandingProvider";
import { useAuth } from "@/contexts/AuthContext";

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  credentialId: string;
  user?: {
      fullName: string;
  };
}

interface ViewCertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: Certificate | null;
}

export function ViewCertificateDialog({ 
  open, 
  onOpenChange, 
  certificate 
}: ViewCertificateDialogProps) {
  const { branding } = useBranding();
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  if (!certificate) return null;

  const handleDownload = () => {
    const content = document.getElementById('certificate-content');
    if (!content) {
      toast.error("Could not find certificate content");
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to download the certificate");
      return;
    }

    // Get all styles from the current document to preserve look
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${certificate.courseTitle}</title>
          <style>
            ${styles}
            @page { size: landscape; margin: 0; }
            body { 
                background: white !important; 
                margin: 0; 
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            #certificate-content { 
                display: block !important; 
                width: 297mm; /* A4 Landscape width */
                height: 210mm; /* A4 Landscape height */
                box-sizing: border-box;
            }
            .print\\:hidden { display: none !important; }
          </style>
        </head>
        <body>
          <div id="certificate-content">
            ${content.innerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border/50 bg-muted/20 shrink-0 print:hidden">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Award className="w-5 h-5 text-accent" />
            Official Certification
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4 md:p-10 flex justify-center bg-zinc-100 dark:bg-zinc-900/50" id="certificate-view">
            {/* Design for the Certificate */}
            <div 
              id="certificate-content" 
              ref={certificateRef}
              className="w-full max-w-[1000px] aspect-[1.414/1] bg-white dark:bg-zinc-950 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[16px] border-double border-accent/20"
            >
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-accent/60 m-8" />
                <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-accent/60 m-8" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-accent/60 m-8" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-accent/60 m-8" />

                {/* Background Patterns */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
                     <Award className="w-[600px] h-[600px] text-accent rotate-[-15deg]" />
                </div>
                
                {/* Main Content Container */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between p-16 md:p-24 text-center">
                    {/* Header */}
                    <div className="space-y-4">
                         <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-14 h-14 bg-accent flex items-center justify-center rounded-xl shadow-lg">
                                <span className="text-3xl font-bold text-white tracking-tighter">≪</span>
                            </div>
                            <div className="text-left">
                                <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none">{branding.siteName}</h2>
                                <p className="text-[10px] text-accent font-bold tracking-[0.3em] uppercase mt-1">Academy of Innovation</p>
                            </div>
                         </div>
                         <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground tracking-tight uppercase">
                            Certificate of Achievement
                         </h1>
                         <div className="h-1.5 w-48 bg-accent mx-auto rounded-full" />
                    </div>

                    {/* Body */}
                    <div className="space-y-8 flex-1 flex flex-col justify-center">
                        <p className="text-lg md:text-xl text-muted-foreground italic font-medium">
                            This is to certify that
                        </p>
                        <h2 className="text-5xl md:text-7xl font-heading font-black text-accent tracking-tighter break-words px-4">
                            {certificate.user?.fullName || user?.fullName || 'Valued Student'}
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            has successfully completed the comprehensive training program and met all the professional requirements for
                        </p>
                        <h3 className="text-2xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                            {certificate.courseTitle}
                        </h3>
                    </div>

                    {/* Footer */}
                    <div className="w-full grid grid-cols-3 gap-8 items-end pt-8">
                        {/* Issued Date */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-sm font-bold text-foreground border-b-2 border-border/50 pb-2 px-8 w-full">
                                {new Date(certificate.issueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date of Issue</span>
                        </div>

                        {/* Seal */}
                        <div className="relative flex justify-center">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-accent/10 border-4 border-dotted border-accent flex items-center justify-center relative">
                                <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-accent opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                                    <div className="w-full h-full border-2 border-accent/20 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Credential ID */}
                        <div className="flex flex-col items-center gap-2">
                             <div className="text-sm font-bold text-foreground border-b-2 border-border/50 pb-2 px-8 w-full font-mono">
                                {certificate.credentialId}
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verification ID</span>
                        </div>
                    </div>
                </div>

                {/* Footer Badges/Logos */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[8px] font-bold">Kigali, Rwanda</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Globe className="w-3 h-3" />
                        <span className="text-[8px] font-bold">codemande.com</span>
                    </div>
                </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border bg-muted/20 flex gap-4 shrink-0 print:hidden">
          <Button variant="outline" className="flex-1 h-14 gap-3 font-black uppercase tracking-tighter" onClick={handleDownload}>
            <Printer className="w-5 h-5" />
            Print Certificate
          </Button>
          <Button variant="gold" className="flex-1 h-14 gap-3 shadow-xl shadow-gold/30 font-black uppercase tracking-tighter" onClick={handleDownload}>
            <Download className="w-5 h-5" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
