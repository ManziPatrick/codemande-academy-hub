import { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Copy, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id: number;
  title: string;
  course: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
  link: string;
  description?: string;
}

interface EditSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: Session | null;
  onSave?: (session: Session) => void;
}

const courses = [
  "Software Development",
  "Data Science",
  "Internet of Things",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
  "All Courses",
];

const sessionTypes = [
  { value: "live", label: "Live Session" },
  { value: "workshop", label: "Workshop" },
  { value: "office_hours", label: "Office Hours" },
  { value: "review", label: "Project Review" },
  { value: "mentorship", label: "Mentorship Call" },
];

// Generate a Google Meet-like link
const generateMeetLink = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const generateSegment = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
};

export function EditSessionDialog({ open, onOpenChange, session, onSave }: EditSessionDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    date: "",
    time: "",
    type: "live",
    description: "",
    link: "",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title,
        course: session.course,
        date: session.date,
        time: session.time,
        type: session.type,
        description: session.description || "",
        link: session.link,
      });
    }
  }, [session]);

  const handleGenerateMeetLink = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newLink = generateMeetLink();
    setFormData({ ...formData, link: newLink });
    setIsGenerating(false);
    toast.success("New Google Meet link generated!");
  };

  const handleCopyLink = () => {
    if (formData.link) {
      navigator.clipboard.writeText(formData.link);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSave = () => {
    if (!session) return;
    
    if (!formData.title || !formData.course) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedSession: Session = {
      ...session,
      title: formData.title,
      course: formData.course,
      date: formData.date || session.date,
      time: formData.time || session.time,
      type: formData.type,
      link: formData.link || session.link,
      description: formData.description,
    };

    onSave?.(updatedSession);
    toast.success("Session updated successfully!");
    onOpenChange(false);
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            Edit Session
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Session Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
              <Label htmlFor="edit-course">Course *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => setFormData({ ...formData, course: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-type">Session Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {sessionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Google Meet Link Section */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
            <Label className="text-sm font-medium">Google Meet Link</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="Meeting link"
                className="flex-1"
              />
              {formData.link && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(formData.link, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={handleGenerateMeetLink}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Generate New Link
                </>
              )}
            </Button>
          </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Session description..."
                rows={3}
                className="mt-1.5"
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
