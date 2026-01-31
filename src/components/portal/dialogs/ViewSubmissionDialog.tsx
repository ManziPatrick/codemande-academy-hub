import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText, Clock, User } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: number;
  student: string;
  assignment: string;
  course: string;
  submittedAt: string;
  type: string;
}

interface ViewSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
}

export function ViewSubmissionDialog({ open, onOpenChange, submission }: ViewSubmissionDialogProps) {
  if (!submission) return null;

  const handleDownload = () => {
    toast.success("Downloading submission files...");
  };

  const handleOpenExternal = () => {
    toast.info("Opening submission in new tab...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            View Submission
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <h3 className="font-semibold text-card-foreground mb-2">{submission.assignment}</h3>
            <div className="flex items-center gap-4 text-sm text-card-foreground/70">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {submission.student}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {submission.submittedAt}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Course</p>
              <p className="font-medium text-card-foreground text-sm">{submission.course}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Type</p>
              <Badge variant="secondary" className="capitalize">{submission.type}</Badge>
            </div>
          </div>

          <div className="p-4 border border-border/50 rounded-lg">
            <p className="text-sm text-card-foreground/70 mb-3">Submitted Files:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="text-sm text-card-foreground">submission.zip</span>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <span className="text-sm text-card-foreground">README.md</span>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleOpenExternal}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
