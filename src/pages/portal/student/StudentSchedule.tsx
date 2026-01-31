import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  Users,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { ViewSessionDialog } from "@/components/portal/dialogs";
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
  instructor?: string;
  isOnline?: boolean;
}

const scheduleData: { today: Session[]; upcoming: Session[] } = {
  today: [
    { 
      id: 1, 
      title: "React Hooks Deep Dive", 
      time: "6:00 PM - 7:30 PM", 
      type: "Live Session", 
      course: "Software Development", 
      instructor: "Marie Claire", 
      isOnline: true,
      attendees: 32,
      date: "Today",
      link: "https://meet.google.com/abc-defg-hij",
    },
  ],
  upcoming: [
    { 
      id: 2, 
      title: "Office Hours", 
      time: "Wed, 2:00 PM", 
      type: "Mentorship", 
      course: "Data Science", 
      instructor: "Emmanuel", 
      isOnline: true,
      attendees: 8,
      date: "Wednesday",
      link: "https://meet.google.com/xyz-uvwx-yz",
    },
    { 
      id: 3, 
      title: "Project Review", 
      time: "Fri, 5:00 PM", 
      type: "Review", 
      course: "Software Development", 
      instructor: "Marie Claire", 
      isOnline: true,
      attendees: 12,
      date: "Friday",
      link: "https://meet.google.com/project-review",
    },
    { 
      id: 4, 
      title: "ML Algorithms Workshop", 
      time: "Sat, 10:00 AM", 
      type: "Workshop", 
      course: "Data Science", 
      instructor: "Emmanuel", 
      isOnline: true,
      attendees: 24,
      date: "Saturday",
      link: "https://meet.google.com/ml-workshop",
    },
    { 
      id: 5, 
      title: "Weekly Check-in", 
      time: "Mon, 10:00 AM", 
      type: "Internship", 
      course: "Internship", 
      instructor: "Marie Claire", 
      isOnline: true,
      attendees: 5,
      date: "Monday",
      link: "https://meet.google.com/weekly-checkin",
    },
  ],
};

const getTypeBadge = (type: string) => {
  const styles: Record<string, string> = {
    "Live Session": "bg-accent/20 text-accent border-accent/30",
    "Mentorship": "bg-blue-500/20 text-blue-400 border-blue-400/30",
    "Review": "bg-purple-500/20 text-purple-400 border-purple-400/30",
    "Workshop": "bg-green-500/20 text-green-400 border-green-400/30",
    "Internship": "bg-orange-500/20 text-orange-400 border-orange-400/30",
  };
  return <Badge variant="outline" className={styles[type] || ""}>{type}</Badge>;
};

export default function StudentSchedule() {
  const [viewSession, setViewSession] = useState<Session | null>(null);

  const handleJoinSession = (session: Session) => {
    toast.success(`Joining ${session.title}...`);
    window.open(session.link, "_blank");
  };

  const handleAddToCalendar = (session: Session) => {
    toast.success(`Added "${session.title}" to your calendar!`);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              My Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Upcoming sessions, workshops, and meetings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">
              January 2026
            </span>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Today's Sessions */}
        {scheduleData.today.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-heading text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Today
            </h2>
            <div className="space-y-3">
              {scheduleData.today.map((session) => (
                <Card key={session.id} className="border-accent/30 bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Video className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-card-foreground">
                              {session.title}
                            </h3>
                            {getTypeBadge(session.type)}
                          </div>
                          <p className="text-sm text-card-foreground/60">{session.course}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-card-foreground/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {session.instructor}
                            </span>
                            {session.isOnline && (
                              <span className="flex items-center gap-1 text-accent">
                                <MapPin className="w-3.5 h-3.5" />
                                Online
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewSession(session)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="gold" onClick={() => handleJoinSession(session)}>
                          <Video className="w-4 h-4 mr-2" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-heading text-lg font-medium text-foreground mb-4">
            Upcoming
          </h2>
          <div className="space-y-3">
            {scheduleData.upcoming.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading font-semibold text-card-foreground">
                              {session.title}
                            </h3>
                            {getTypeBadge(session.type)}
                          </div>
                          <p className="text-sm text-card-foreground/60">{session.course}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-card-foreground/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {session.instructor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddToCalendar(session)}
                        >
                          Add to Calendar
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewSession(session)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(session.link, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {scheduleData.today.length === 0 && scheduleData.upcoming.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                No Upcoming Sessions
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Your scheduled live sessions and meetings will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Session Dialog */}
      <ViewSessionDialog
        open={!!viewSession}
        onOpenChange={(open) => !open && setViewSession(null)}
        session={viewSession}
        onJoin={handleJoinSession}
      />
    </PortalLayout>
  );
}