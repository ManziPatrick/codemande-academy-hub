import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface SubmitProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
}

export function SubmitProjectDialog({ open, onOpenChange, projectTitle }: SubmitProjectDialogProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFile = () => {
    setFiles([...files, `file-${files.length + 1}.zip`]);
    toast.success("File added successfully");
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0 && !repoUrl) {
      toast.error("Please upload files or provide a repository URL");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Project submitted successfully!");
      setFiles([]);
      setNotes("");
      setRepoUrl("");
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="p-3 bg-background/50 rounded-lg">
            <p className="text-sm text-card-foreground/60">Submitting:</p>
            <p className="font-medium text-card-foreground">{projectTitle}</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Repository URL (Optional)</label>
            <Input
              placeholder="https://github.com/username/project"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Upload Files</label>
            <div
              className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={handleAddFile}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ZIP, PDF, or document files up to 50MB
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="text-sm text-card-foreground">{file}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:bg-destructive/20 rounded"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Additional Notes</label>
            <Textarea
              placeholder="Any additional information about your submission..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
