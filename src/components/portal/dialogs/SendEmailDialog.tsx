import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
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
            <Textarea
              placeholder="Write your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleSend} disabled={isSending}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
