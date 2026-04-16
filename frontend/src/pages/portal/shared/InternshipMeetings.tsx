import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Calendar
} from "lucide-react";
import { ViewSessionDialog } from "@/components/portal/dialogs";
import { CalendarGrid } from "@/components/portal/CalendarGrid";
import { toast } from "sonner";
import { useQuery } from "@apollo/client/react";
import { GET_MY_INTERNSHIP_MEETINGS } from "@/lib/graphql/queries";

export default function InternshipMeetings() {
  const [viewSession, setViewSession] = useState<any | null>(null);
  const { data: meetingsData, loading: meetingsLoading } = useQuery(GET_MY_INTERNSHIP_MEETINGS);

  const internshipMeetings = (meetingsData as any)?.getMyInternshipMeetings || [];

  const allEvents = internshipMeetings
    .filter((m: any) => m.startTime && !isNaN(new Date(m.startTime).getTime()))
    .map((m: any) => ({
      ...m,
      id: m.id,
      title: m.title,
      date: format(new Date(m.startTime), "yyyy-MM-dd"),
      time: format(new Date(m.startTime), "HH:mm"),
      mentor: m.host,
      meetingLink: m.meetLink,
      status: 'confirmed',
      source: 'internship'
    }))
    .sort((a: any, b: any) => {
      const aTime = new Date(a.startTime).getTime();
      const bTime = new Date(b.startTime).getTime();
      return aTime - bTime;
    });

  const handleJoinSession = (link: string) => {
    if (!link) {
      toast.error("No meeting link available yet.");
      return;
    }
    toast.success(`Joining meeting...`);
    window.open(link, "_blank");
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
              Internship Meetings
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay in sync with your program syncs and team meetings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {meetingsLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>
        ) : allEvents.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-20 text-center">
              <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                No Meetings Scheduled
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no upcoming internship meetings or sync sessions at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <CalendarGrid
              events={allEvents}
              onEventClick={(event) => setViewSession(event)}
            />

            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Upcoming Syncs
              </h3>
              <div className="grid gap-4">
                  {allEvents.map((booking: any) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="border-border/50 hover:border-accent/30 transition-all bg-accent/5">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-accent/20">
                                <Video className="w-7 h-7 text-accent" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-heading font-semibold text-xl text-card-foreground">
                                    {booking.title}
                                  </h3>
                                  <Badge variant="outline" className="bg-gold/10 text-gold border-gold/20">Hub Meeting</Badge>
                                </div>
                                <p className="text-card-foreground/80 font-medium mb-1">{booking.description || "Production Sync Session"}</p>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-card-foreground/60">
                                  <span className="flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4 text-accent" />
                                    {booking.date}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-accent" />
                                    {booking.time}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-accent" />
                                    Host: {booking.host?.fullName || booking.host?.username || 'TBD'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-col md:flex-row gap-3">
                              {booking.meetLink && (
                                <Button variant="gold" className="flex-1" onClick={() => handleJoinSession(booking.meetLink)}>
                                  <Video className="w-4 h-4 mr-2" />
                                  Join Now
                                </Button>
                              )}
                              <Button variant="outline" className="flex-1" onClick={() => setViewSession(booking)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <ViewSessionDialog
        open={!!viewSession}
        onOpenChange={(open) => !open && setViewSession(null)}
        session={{
          title: viewSession?.title || "Meeting",
          instructor: viewSession?.host?.fullName || viewSession?.host?.username || 'TBD',
          date: viewSession?.date,
          time: viewSession?.time,
          course: viewSession?.description || "Internship Sync",
          type: 'internship',
          link: viewSession?.meetLink
        }}
        onJoin={() => handleJoinSession(viewSession?.meetLink)}
      />
    </PortalLayout>
  );
}
