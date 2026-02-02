import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Users,
  MapPin,
  ExternalLink,
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
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";

export default function StudentSchedule() {
  const [viewSession, setViewSession] = useState<any | null>(null);
  const { data, loading } = useQuery(GET_MY_BOOKINGS);

  const bookings = (data as any)?.myBookings || [];

  const handleJoinSession = (link: string) => {
    if (!link) {
      toast.error("No meeting link available yet.");
      return;
    }
    toast.success(`Joining session...`);
    window.open(link, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      "confirmed": "bg-green-500/20 text-green-400 border-green-400/30",
      "pending": "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
      "cancelled": "bg-red-500/20 text-red-400 border-red-400/30",
    };
    return <Badge variant="outline" className={styles[status] || ""}>{status}</Badge>;
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
              Your booked mentorship calls and sessions
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

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-12 h-12 animate-spin text-accent" /></div>
        ) : bookings.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-20 text-center">
              <CalendarIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-xl font-medium text-foreground mb-2">
                Your Schedule is Clear
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                No upcoming meetings or mentorship sessions found.
              </p>
              <Button variant="gold" onClick={() => toast.info("Go to Courses to book a call with a mentor")}>
                Find a Mentor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <CalendarGrid 
              events={bookings.map((b: any) => ({
                ...b,
                title: b.type.replace('-', ' ') + (b.mentor ? ` with ${b.mentor.username}` : ""),
              }))} 
              onEventClick={(event) => setViewSession(event)} 
            />

            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                Session Queue
              </h3>
              <div className="grid gap-4">
                {bookings.map((booking: any) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className={`border-border/50 hover:border-accent/30 transition-all ${booking.status === 'confirmed' ? 'bg-accent/5' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${booking.status === 'confirmed' ? 'bg-accent/20' : 'bg-muted'}`}>
                              <Video className={`w-7 h-7 ${booking.status === 'confirmed' ? 'text-accent' : 'text-muted-foreground'}`} />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-heading font-semibold text-xl text-card-foreground capitalize">
                                  {booking.type.replace('-', ' ')}
                                </h3>
                                {getStatusBadge(booking.status)}
                              </div>
                              <p className="text-card-foreground/80 font-medium mb-1">{booking.topic || "No topic provided"}</p>
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
                                  Mentor: {booking.mentor?.username || 'Pending Assignment'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex sm:flex-col md:flex-row gap-3">
                            {booking.meetingLink && booking.status === 'confirmed' && (
                              <Button variant="gold" className="flex-1" onClick={() => handleJoinSession(booking.meetingLink)}>
                                <Video className="w-4 h-4 mr-2" />
                                Join Call
                              </Button>
                            )}
                            <Button variant="outline" className="flex-1" onClick={() => setViewSession(booking)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
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

      {/* Reusing ViewSessionDialog but adapted for Booking */}
      <ViewSessionDialog
        open={!!viewSession}
        onOpenChange={(open) => !open && setViewSession(null)}
        session={{
          title: viewSession?.type?.replace('-', ' ') || "Session",
          instructor: viewSession?.mentor?.username || 'TBD',
          date: viewSession?.date,
          time: viewSession?.time,
          course: viewSession?.topic || "Mentorship Session",
          type: viewSession?.type,
          link: viewSession?.meetingLink
        }}
        onJoin={() => handleJoinSession(viewSession?.meetingLink)}
      />
    </PortalLayout>
  );
}