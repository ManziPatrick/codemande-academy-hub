import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/ui/text-editor";
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

interface NewSession {
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

interface AddSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (session: NewSession) => void;
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

export function AddSessionDialog({ open, onOpenChange, onAdd }: AddSessionDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    date: "",
    time: "",
    duration: "2",
    type: "live",
    description: "",
    link: "",
  });

  const handleGenerateMeetLink = async () => {
    setIsGenerating(true);
    // Simulate API delay for generating link
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newLink = generateMeetLink();
    setFormData({ ...formData, link: newLink });
    setIsGenerating(false);
    toast.success("Google Meet link generated!");
  };

  const handleCopyLink = () => {
    if (formData.link) {
      navigator.clipboard.writeText(formData.link);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.course) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Generate link if not already generated
    const meetLink = formData.link || generateMeetLink();

    const newSession: NewSession = {
      id: Date.now(),
      title: formData.title,
      course: formData.course,
      date: formData.date,
      time: formData.time || "TBD",
      type: formData.type,
      attendees: 0,
      link: meetLink,
      description: formData.description,
    };

    onAdd?.(newSession);
    toast.success("Session scheduled successfully! Meet link generated.");
    
    // Reset form
    setFormData({
      title: "",
      course: "",
      date: "",
      time: "",
      duration: "2",
      type: "live",
      description: "",
      link: "",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      title: "",
      course: "",
      date: "",
      time: "",
      duration: "2",
      type: "live",
      description: "",
      link: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            Schedule New Session
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                placeholder="e.g., React Advanced Patterns"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
              <Label htmlFor="course">Course *</Label>
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
              <Label htmlFor="type">Session Type</Label>
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
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="mt-1.5"
            />
          </div>

          {/* Google Meet Link Section */}
          <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
            <Label className="text-sm font-medium">Google Meet Link</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="Click generate or paste your own link"
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
                  Generate Google Meet Link
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              A unique meeting link will be auto-generated if not provided
            </p>
          </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <div className="mt-1.5">
                <TextEditor
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="What will you cover in this session?"
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleSubmit}>
            <Video className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
