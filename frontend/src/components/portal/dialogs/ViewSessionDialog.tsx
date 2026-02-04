import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Users, Video, MapPin, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id?: string | number;
  title: string;
  course?: string;
  date?: string;
  time?: string;
  type?: string;
  attendees?: number;
  link?: string;
  description?: string;
  instructor?: string;
}

interface ViewSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: any | null;
  onJoin?: (session: any) => void;
}

const sessionTypeLabels: Record<string, string> = {
  live: "Live Session",
  workshop: "Workshop",
  office_hours: "Office Hours",
  review: "Project Review",
  mentorship: "Mentorship Call",
  "Live Session": "Live Session",
  "Mentorship": "Mentorship",
  "Review": "Review",
  "Workshop": "Workshop",
  "Internship": "Internship",
};

const sessionTypeColors: Record<string, string> = {
  live: "bg-green-500/20 text-green-400",
  workshop: "bg-blue-500/20 text-blue-400",
  office_hours: "bg-purple-500/20 text-purple-400",
  review: "bg-orange-500/20 text-orange-400",
  mentorship: "bg-accent/20 text-accent",
  "Live Session": "bg-green-500/20 text-green-400",
  "Mentorship": "bg-accent/20 text-accent",
  "Review": "bg-purple-500/20 text-purple-400",
  "Workshop": "bg-blue-500/20 text-blue-400",
  "Internship": "bg-orange-500/20 text-orange-400",
};

export function ViewSessionDialog({ open, onOpenChange, session, onJoin }: ViewSessionDialogProps) {
  if (!session) return null;

  const handleCopyLink = () => {
    if (session.link) {
      navigator.clipboard.writeText(session.link);
      toast.success("Meeting link copied to clipboard!");
    }
  };

  const handleJoinMeeting = () => {
    if (session.link) {
      window.open(session.link, "_blank");
      onJoin?.(session);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{session.title}</DialogTitle>
            <Badge className={sessionTypeColors[session.type] || "bg-muted text-muted-foreground"}>
              {sessionTypeLabels[session.type] || session.type}
            </Badge>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-4 sm:px-6 custom-scrollbar">
          <div className="space-y-4 py-4">
          {/* Course */}
          <div className="text-sm text-muted-foreground">
            {session.course}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{session.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{session.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{session.attendees} attendees</span>
            </div>
            {session.instructor && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{session.instructor}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {session.description && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{session.description}</p>
            </div>
          )}

          {/* Meeting Link */}
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Meeting Link</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background/50 p-2 rounded truncate">
                {session.link}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleJoinMeeting}>
            <Video className="w-4 h-4 mr-2" />
            Join Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
