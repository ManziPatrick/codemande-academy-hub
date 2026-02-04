import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, FileText, Clock, AlertCircle } from "lucide-react";

interface ViewGuidelinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

export function ViewGuidelinesDialog({ open, onOpenChange, projectTitle }: ViewGuidelinesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Project Guidelines
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 custom-scrollbar">
          <div className="space-y-4 py-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="font-medium text-card-foreground">{projectTitle}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Requirements</h4>
              <div className="space-y-2">
                {[
                  "Implement all required features as specified",
                  "Follow coding best practices and patterns",
                  "Include documentation and README file",
                  "Write clean, maintainable code",
                  "Add appropriate error handling",
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-card-foreground/70">
                    <CheckCircle className="w-4 h-4 text-accent" />
                    {req}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Submission Format</h4>
              <div className="space-y-2 p-3 bg-background/50 rounded-lg">
                <p className="text-sm text-card-foreground/70">
                  • Upload as ZIP file or provide GitHub repository link
                </p>
                <p className="text-sm text-card-foreground/70">
                  • Include all source code and assets
                </p>
                <p className="text-sm text-card-foreground/70">
                  • Add a README with setup instructions
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2">Grading Criteria</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-background/50 rounded text-center">
                  <Badge variant="secondary">40%</Badge>
                  <p className="text-xs text-card-foreground/70 mt-1">Functionality</p>
                </div>
                <div className="p-2 bg-background/50 rounded text-center">
                  <Badge variant="secondary">25%</Badge>
                  <p className="text-xs text-card-foreground/70 mt-1">Code Quality</p>
                </div>
                <div className="p-2 bg-background/50 rounded text-center">
                  <Badge variant="secondary">20%</Badge>
                  <p className="text-xs text-card-foreground/70 mt-1">UI/UX Design</p>
                </div>
                <div className="p-2 bg-background/50 rounded text-center">
                  <Badge variant="secondary">15%</Badge>
                  <p className="text-xs text-card-foreground/70 mt-1">Documentation</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-accent/10 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="text-sm text-accent">
                <p className="font-medium">Important:</p>
                <p>Late submissions may receive a penalty. Contact your mentor if you need an extension.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border bg-muted/5">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
