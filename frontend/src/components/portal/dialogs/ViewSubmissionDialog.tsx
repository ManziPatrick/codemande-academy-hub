import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, FileText, Clock, User, Link as LinkIcon, AlignLeft } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string | number;
  student: string;
  assignment: string;
  course: string;
  submittedAt: string;
  type: string;
  description?: string;
  submissionUrl?: string;
}

interface ViewSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: Submission | null;
}

export function ViewSubmissionDialog({ open, onOpenChange, submission }: ViewSubmissionDialogProps) {
  if (!submission) return null;

  const handleDownload = () => {
    if (submission.submissionUrl) {
      window.open(submission.submissionUrl, '_blank');
      toast.success("Opening submission URL...");
    } else {
      toast.error("No submission URL available.");
    }
  };

  const handleOpenExternal = () => {
    if (submission.submissionUrl) {
      window.open(submission.submissionUrl, '_blank');
    } else {
      toast.error("No preview URL available.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            View Submission
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
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

          {submission.description && (
            <div className="p-4 border border-border/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlignLeft className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-card-foreground/70">Description</p>
              </div>
              <p className="text-sm text-card-foreground">{submission.description}</p>
            </div>
          )}

          <div className="p-4 border border-border/50 rounded-lg">
            <p className="text-sm text-card-foreground/70 mb-3">Submitted Content:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-background/50 rounded">
                <div className="flex items-center gap-2">
                   <LinkIcon className="w-4 h-4 text-accent" />
                   <span className="text-sm text-card-foreground truncate max-w-[200px]">
                     {submission.submissionUrl || 'No URL provided'}
                   </span>
                </div>
                {submission.submissionUrl && (
                  <Button variant="ghost" size="sm" onClick={handleOpenExternal}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleDownload}
            disabled={!submission.submissionUrl}
          >
            <Download className="w-4 h-4 mr-2" />
            Download / Open
          </Button>
          <Button 
            variant="gold" 
            className="flex-1" 
            onClick={handleOpenExternal}
            disabled={!submission.submissionUrl}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
