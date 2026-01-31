import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RequestHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: string;
  lessonTitle?: string;
}

const helpCategories = [
  "Technical Issue",
  "Course Content Question",
  "Assignment Help",
  "Project Guidance",
  "Career Advice",
  "Other",
];

export function RequestHelpDialog({ 
  open, 
  onOpenChange, 
  context,
  lessonTitle 
}: RequestHelpDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subject: lessonTitle ? `Help with: ${lessonTitle}` : "",
    message: "",
    preferredContact: "in-app",
  });

  const handleSubmit = async () => {
    if (!formData.category || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Help request submitted! A mentor will respond within 24 hours.");
    setFormData({ category: "", subject: "", message: "", preferredContact: "in-app" });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-accent" />
            Request Help
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {context && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Context: {context}
            </div>
          )}

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {helpCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your question or issue in detail..."
              rows={4}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="contact">Preferred Contact Method</Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-app">In-App Message</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="video-call">Video Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
