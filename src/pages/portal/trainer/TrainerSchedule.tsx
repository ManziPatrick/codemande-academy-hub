import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { 
  EditSessionDialog, 
  DeleteConfirmDialog, 
  AddSessionDialog,
  ViewSessionDialog,
} from "@/components/portal/dialogs";
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

const initialSessions: Session[] = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    course: "Software Development",
    date: "Today",
    time: "6:00 PM - 8:00 PM",
    type: "live",
    attendees: 32,
    link: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "IoT Sensors Workshop",
    course: "Internet of Things",
    date: "Tomorrow",
    time: "4:00 PM - 6:00 PM",
    type: "workshop",
    attendees: 18,
    link: "https://meet.google.com/xyz-uvwx-yz",
  },
  {
    id: 3,
    title: "Office Hours",
    course: "All Courses",
    date: "Wednesday",
    time: "2:00 PM - 4:00 PM",
    type: "office_hours",
    attendees: 8,
    link: "https://meet.google.com/office-hours",
  },
  {
    id: 4,
    title: "Project Review Session",
    course: "Software Development",
    date: "Friday",
    time: "5:00 PM - 7:00 PM",
    type: "review",
    attendees: 12,
    link: "https://meet.google.com/review-session",
  },
];

const currentWeek = [
  { day: "Mon", date: 27, hasSession: false },
  { day: "Tue", date: 28, hasSession: true },
  { day: "Wed", date: 29, hasSession: true },
  { day: "Thu", date: 30, hasSession: false },
  { day: "Fri", date: 31, hasSession: true },
  { day: "Sat", date: 1, hasSession: false },
  { day: "Sun", date: 2, hasSession: false },
];

const sessionTypeColors: Record<string, string> = {
  live: "bg-green-500/20 text-green-400",
  workshop: "bg-blue-500/20 text-blue-400",
  office_hours: "bg-purple-500/20 text-purple-400",
  review: "bg-orange-500/20 text-orange-400",
  mentorship: "bg-accent/20 text-accent",
};

export default function TrainerSchedule() {
  const [selectedDate, setSelectedDate] = useState(28);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  
  // Dialog states
  const [viewSession, setViewSession] = useState<Session | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [deleteSession, setDeleteSession] = useState<Session | null>(null);

  const handleAddSession = (newSession: Session) => {
    setSessions([...sessions, newSession]);
  };

  const handleUpdateSession = (updatedSession: Session) => {
    setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleStartSession = (session: Session) => {
    toast.success(`Starting session: ${session.title}`);
    window.open(session.link, "_blank");
  };

  const handleDeleteSession = () => {
    if (!deleteSession) return;
    setSessions(sessions.filter(s => s.id !== deleteSession.id));
    toast.success("Session deleted successfully!");
    setDeleteSession(null);
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
              Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your live sessions and office hours
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </motion.div>

        {/* Week View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle className="text-lg font-heading">
                  January 2026
                </CardTitle>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(28)}>
                Today
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {currentWeek.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedDate === day.date
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-background/50"
                    }`}
                  >
                    <p className="text-xs text-card-foreground/60">{day.day}</p>
                    <p className="text-lg font-medium mt-1">{day.date}</p>
                    {day.hasSession && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 bg-background/50 rounded-lg border border-border/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-card-foreground">
                          {session.title}
                        </h4>
                        <p className="text-sm text-card-foreground/60 mt-0.5">
                          {session.course}
                        </p>
                      </div>
                      <Badge className={sessionTypeColors[session.type]}>
                        {session.type.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-card-foreground/70 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {session.attendees} registered
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <button 
                        className="flex items-center gap-2 text-xs text-card-foreground/60 hover:text-accent transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(session.link);
                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{session.link}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <div className="flex gap-2">
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
                          onClick={() => setEditSession(session)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => setDeleteSession(session)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="gold" 
                          size="sm"
                          onClick={() => handleStartSession(session)}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats & Office Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-card-foreground/70">Total Sessions</span>
                  <span className="font-bold text-card-foreground">{sessions.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-card-foreground/70">Teaching Hours</span>
                  <span className="font-bold text-card-foreground">8h</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-card-foreground/70">Students Reached</span>
                  <span className="font-bold text-card-foreground">
                    {sessions.reduce((sum, s) => sum + s.attendees, 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Office Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Wednesday</span>
                    <Badge variant="secondary">Weekly</Badge>
                  </div>
                  <p className="text-xs text-card-foreground/60">2:00 PM - 4:00 PM</p>
                </div>
                <div className="p-3 bg-background/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Friday</span>
                    <Badge variant="secondary">Weekly</Badge>
                  </div>
                  <p className="text-xs text-card-foreground/60">10:00 AM - 12:00 PM</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Office Hours
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Dialogs */}
      <AddSessionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onAdd={handleAddSession}
      />
      <ViewSessionDialog
        open={!!viewSession}
        onOpenChange={(open) => !open && setViewSession(null)}
        session={viewSession}
        onJoin={handleStartSession}
      />
      <EditSessionDialog
        open={!!editSession}
        onOpenChange={(open) => !open && setEditSession(null)}
        session={editSession}
        onSave={handleUpdateSession}
      />
      <DeleteConfirmDialog
        open={!!deleteSession}
        onOpenChange={(open) => !open && setDeleteSession(null)}
        title="Delete Session"
        description={`Are you sure you want to delete "${deleteSession?.title}"? All registered attendees will be notified.`}
        onConfirm={handleDeleteSession}
      />
    </PortalLayout>
  );
}
