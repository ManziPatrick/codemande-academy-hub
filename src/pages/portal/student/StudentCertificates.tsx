import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Download,
  ExternalLink,
  Lock,
  CheckCircle,
  Calendar,
  Share2,
} from "lucide-react";
import { ShareCertificateDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string | null;
  credentialId?: string;
  status: string;
  progress?: number;
  requirements?: Array<{
    title: string;
    completed: boolean;
    current?: number;
    total?: number;
  }>;
}

const certificates: Certificate[] = [
  {
    id: "cert-1",
    courseTitle: "JavaScript Fundamentals",
    issueDate: "Dec 15, 2025",
    credentialId: "CMD-2025-JS-1234",
    status: "issued",
  },
  {
    id: "cert-2",
    courseTitle: "Software Development",
    issueDate: null,
    progress: 68,
    status: "in_progress",
    requirements: [
      { title: "Complete all lessons", completed: false, current: 16, total: 24 },
      { title: "Pass all challenges", completed: false, current: 8, total: 12 },
      { title: "Submit final project", completed: false },
    ],
  },
  {
    id: "cert-3",
    courseTitle: "Data Science & AI",
    issueDate: null,
    progress: 35,
    status: "in_progress",
    requirements: [
      { title: "Complete all lessons", completed: false, current: 11, total: 32 },
      { title: "Pass all challenges", completed: false, current: 3, total: 10 },
      { title: "Submit final project", completed: false },
    ],
  },
];

export default function StudentCertificates() {
  const [shareCertificate, setShareCertificate] = useState<{
    id: string;
    courseName: string;
    completedDate: string;
    credentialId: string;
  } | null>(null);

  const issuedCerts = certificates.filter((c) => c.status === "issued");
  const inProgressCerts = certificates.filter((c) => c.status === "in_progress");

  const handleDownload = (cert: Certificate) => {
    toast.success(`Downloading certificate for ${cert.courseTitle}...`);
    // Simulate download
    setTimeout(() => {
      toast.success("Certificate downloaded successfully!");
    }, 1000);
  };

  const handleViewOnline = (cert: Certificate) => {
    window.open(`https://codemande.com/verify/${cert.credentialId}`, "_blank");
    toast.success("Opening certificate verification page...");
  };

  const handleShare = (cert: Certificate) => {
    if (cert.credentialId && cert.issueDate) {
      setShareCertificate({
        id: cert.id,
        courseName: cert.courseTitle,
        completedDate: cert.issueDate,
        credentialId: cert.credentialId,
      });
    }
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
              My Certificates
            </h1>
            <p className="text-muted-foreground mt-1">
              Earn recognized certifications by completing courses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{issuedCerts.length} Earned</span>
            </div>
          </div>
        </motion.div>

        {/* Issued Certificates */}
        {issuedCerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-heading text-lg font-medium text-foreground mb-4">
              Earned Certificates
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {issuedCerts.map((cert) => (
                <Card key={cert.id} className="border-border/50 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-accent/20 via-accent/10 to-card flex items-center justify-center relative">
                    <Award className="w-16 h-16 text-accent/50" />
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                      {cert.courseTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-card-foreground/60 mb-4">
                      <Calendar className="w-4 h-4" />
                      Issued on {cert.issueDate}
                    </div>
                    <p className="text-xs text-card-foreground/50 mb-4">
                      Credential ID: {cert.credentialId}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="gold" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(cert)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleShare(cert)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOnline(cert)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* In Progress Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-lg font-medium text-foreground mb-4">
            Certificates in Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {inProgressCerts.map((cert) => (
              <Card key={cert.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      <Lock className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-card-foreground">
                        {cert.courseTitle}
                      </h3>
                      <p className="text-sm text-card-foreground/60">
                        {cert.progress}% complete
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-card-foreground">Requirements:</p>
                    {cert.requirements?.map((req, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle
                          className={`w-5 h-5 ${
                            req.completed ? "text-accent" : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1">
                          <span className={`text-sm ${
                            req.completed ? "text-card-foreground" : "text-card-foreground/70"
                          }`}>
                            {req.title}
                          </span>
                          {req.current !== undefined && (
                            <span className="text-xs text-card-foreground/50 ml-2">
                              ({req.current}/{req.total})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {certificates.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                No Certificates Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete courses and projects to earn industry-recognized certificates
              </p>
              <Button variant="gold">Browse Courses</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Dialog */}
      <ShareCertificateDialog
        open={!!shareCertificate}
        onOpenChange={(open) => !open && setShareCertificate(null)}
        certificate={shareCertificate}
      />
    </PortalLayout>
  );
}
