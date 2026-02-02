import { useState, useMemo } from "react";
import { isSameDay } from "date-fns";
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
  Loader2,
  Check,
  X
} from "lucide-react";
import { 
  EditSessionDialog, 
  DeleteConfirmDialog, 
  AddSessionDialog,
  ViewSessionDialog,
} from "@/components/portal/dialogs";
import { CalendarGrid } from "@/components/portal/CalendarGrid";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";
import { UPDATE_BOOKING_STATUS } from "@/lib/graphql/mutations";

export default function TrainerSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const { data, loading, refetch } = useQuery(GET_MY_BOOKINGS);
  const [showAllStatus, setShowAllStatus] = useState(false);
  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      toast.success("Booking updated");
      refetch();
    }
  });

  const allBookings = (data as any)?.myBookings || [];
  const activeBookings = useMemo(() => {
    if (showAllStatus) return allBookings;
    return allBookings.filter((b: any) => b.status === 'pending' || b.status === 'confirmed');
  }, [allBookings, showAllStatus]);

  const calendarEvents = useMemo(() => {
    return activeBookings.map((b: any) => ({
      ...b,
      title: b.type.replace('-', ' ') + (b.user ? ` - ${b.user.username}` : ""),
    }));
  }, [activeBookings]);

  const handleStatusUpdate = async (id: string, status: string) => {
    let meetingLink = "";
    if (status === 'confirmed') {
      meetingLink = `https://meet.google.com/call-${Math.random().toString(36).substring(7)}`;
    }
    await updateBookingStatus({
      variables: { id, status, meetingLink }
    });
  };

  const [viewSession, setViewSession] = useState<any | null>(null);

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
              Master Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage student mentorship requests and your live classes
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Live Class
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant={!showAllStatus ? "gold" : "outline"} 
                  size="sm" 
                  onClick={() => setShowAllStatus(false)}
                  className="h-8 text-[11px]"
                >
                  Active Only
                </Button>
                <Button 
                  variant={showAllStatus ? "gold" : "outline"} 
                  size="sm" 
                  onClick={() => setShowAllStatus(true)}
                  className="h-8 text-[11px]"
                >
                  Show All History
                </Button>
              </div>
            </div>

            <CalendarGrid 
              events={calendarEvents} 
              onEventClick={(event) => setViewSession(event)} 
            />

            <Card className="border-border/50">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Upcoming Requests Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                ) : activeBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No active mentorship bookings found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {activeBookings.filter((b: any) => b.status === 'pending').map((booking: any) => (
                      <div
                        key={booking.id}
                        className="p-4 bg-muted/5 hover:bg-muted/10 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                            {booking.user?.username?.[0] || "S"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm capitalize">{booking.type.replace('-', ' ')}</h4>
                            <p className="text-xs text-muted-foreground">{booking.user?.username} • {booking.date} at {booking.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-400 border-green-500/20 hover:bg-green-500/10 h-8" onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10 h-8" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                            <X className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-accent/5 overflow-hidden">
               <div className="h-1 bg-accent w-full" />
              <CardHeader>
                <CardTitle className="text-lg font-heading">Schedule Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Confirmed Today</p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeBookings.filter((b: any) => b.status === 'confirmed' && isSameDay(new Date(b.date), new Date())).length}
                    </p>
                 </div>
                 <div className="p-3 bg-background/50 rounded-lg border border-border/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Pending Requests</p>
                    <p className="text-2xl font-bold text-foreground">
                      {activeBookings.filter((b: any) => b.status === 'pending').length}
                    </p>
                 </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Calendar Sync</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground mb-4">Sync your schedule with Google or Outlook calendar to never miss a session.</p>
                 <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Sync External Calendar
                 </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                 <p>• Confirm requests as soon as possible to help students plan.</p>
                 <p>• Join sessions at least 2 minutes before the scheduled time.</p>
                 <p>• Add brief notes after each mentorship call for student progress tracking.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddSessionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

        <ViewSessionDialog
          open={!!viewSession}
          onOpenChange={(open) => !open && setViewSession(null)}
          session={viewSession ? {
            title: viewSession.type?.replace('-', ' ') || "Session",
            instructor: viewSession.mentor?.username || viewSession.user?.username,
            date: viewSession.date,
            time: viewSession.time,
            course: viewSession.topic || "Mentorship Session",
            type: viewSession.type,
            link: viewSession.meetingLink
          } : undefined}
          onJoin={() => viewSession?.meetingLink && window.open(viewSession.meetingLink, "_blank")}
        />
    </PortalLayout>
  );
}
