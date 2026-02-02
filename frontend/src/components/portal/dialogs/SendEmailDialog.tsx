import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/ui/text-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientEmail: string;
}

export function SendEmailDialog({ open, onOpenChange, recipientName, recipientEmail }: SendEmailDialogProps) {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Email sent to ${recipientName}`);
      setFormData({ subject: "", message: "" });
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60">To:</p>
              <p className="font-medium text-card-foreground">{recipientName}</p>
              <p className="text-sm text-card-foreground/70">{recipientEmail}</p>
            </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Subject</label>
            <Input
              placeholder="Email subject..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message</label>
            <TextEditor
              placeholder="Write your message..."
              value={formData.message}
              onChange={(content) => setFormData({ ...formData, message: content })}
            />
          </div>
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleSend} disabled={isSending}>
            <Send className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
