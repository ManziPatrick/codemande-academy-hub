import { useState, useMemo, useEffect } from "react";
import { 
  isSameDay, 
  format, 
  addDays, 
  isBefore, 
  isAfter, 
  getDay, 
  isToday, 
  isSameWeek, 
  isSameMonth, 
  isSameYear, 
  startOfToday 
} from "date-fns";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { GET_MY_BOOKINGS, GET_MY_INTERNSHIP_MEETINGS, GET_MY_MENTEES } from "@/lib/graphql/queries";
import { UPDATE_BOOKING_STATUS, CREATE_BOOKING } from "@/lib/graphql/mutations";
import { usePusher } from "@/hooks/use-pusher";
import { useAuth } from "@/contexts/AuthContext";

export default function TrainerSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month');

  const { data, loading, refetch } = useQuery(GET_MY_BOOKINGS);
  const { data: meetingsData, loading: meetingsLoading } = useQuery(GET_MY_INTERNSHIP_MEETINGS);
  const { data: menteesData, loading: menteesLoading } = useQuery(GET_MY_MENTEES);
  const [showAllStatus, setShowAllStatus] = useState(false);
  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      toast.success("Booking updated");
      refetch();
    }
  });

  const [createBooking, { loading: creating }] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      toast.success("Session scheduled successfully");
      refetch();
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to schedule session: ${error.message}`);
    }
  });

  const { user } = useAuth();
  const pusher = usePusher();

  useEffect(() => {
    if (!pusher || !user) return;

    const channel = pusher.subscribe(`user-${user.id}`);

    const handleNewBooking = () => {
      refetch();
    };

    const handleBookingUpdate = () => {
      refetch();
    };

    channel.bind('new_booking', handleNewBooking);
    channel.bind('booking_updated', handleBookingUpdate);

    return () => {
      channel.unbind('new_booking', handleNewBooking);
      channel.unbind('booking_updated', handleBookingUpdate);
    };
  }, [pusher, user, refetch]);

  const allBookings = (data as any)?.myBookings || [];
  const activeBookings = useMemo(() => {
    if (showAllStatus) return allBookings;
    return allBookings.filter((b: any) => b.status === 'pending' || b.status === 'confirmed');
  }, [allBookings, showAllStatus]);

  const calendarEvents = useMemo(() => {
    const bookings = activeBookings.map((b: any) => ({
      ...b,
      title: b.type.replace('-', ' ') + (b.user ? ` - ${b.user.username}` : ""),
      source: 'booking'
    }));

    const internshipMeetings = (meetingsData as any)?.getMyInternshipMeetings || [];
    
    // Helper to expand recurring meetings
    const expandMeeting = (m: any) => {
      const instances: any[] = [];
      const startTimestamp = Number(m.startTime);
      const isTimestamp = !isNaN(startTimestamp);
      const startDateObj = new Date(isTimestamp ? startTimestamp : m.startTime);
      
      if (isNaN(startDateObj.getTime())) return [];

      const now = new Date();
      const rangeStart = addDays(now, -30); // Show up to 30 days in the past
      let rangeEnd = addDays(now, 90);    // Show up to 90 days in the future by default

      const recurrenceEnd = m.recurrenceEndDate ? new Date(isNaN(Number(m.recurrenceEndDate)) ? m.recurrenceEndDate : Number(m.recurrenceEndDate)) : null;
      if (recurrenceEnd && !isNaN(recurrenceEnd.getTime())) {
        rangeEnd = recurrenceEnd;
      }

      const baseEvent = {
        ...m,
        id: m.id,
        title: m.title,
        mentor: m.host,
        meetingLink: m.meetLink,
        status: 'confirmed',
        source: 'internship'
      };

      if (m.type === 'DAILY') {
        let current = startDateObj;
        if (isBefore(current, rangeStart)) current = rangeStart;
        
        while (isBefore(current, rangeEnd) || isSameDay(current, rangeEnd)) {
          // If recurrenceDays is specified for a DAILY meeting, honor it (e.g. workdays only)
          // Otherwise, show it every day
          if (m.recurrenceDays?.length === 0 || m.recurrenceDays?.includes(getDay(current))) {
            instances.push({
              ...baseEvent,
              id: `${m.id}-${format(current, "yyyy-MM-dd")}`,
              date: format(current, "yyyy-MM-dd"),
              time: format(startDateObj, "HH:mm"),
            });
          }
          current = addDays(current, 1);
          if (instances.length > 365) break; // Safety break
        }
      } else if (m.type === 'WEEKLY' && m.recurrenceDays?.length > 0) {
        let current = startDateObj;
        if (isBefore(current, rangeStart)) current = rangeStart;

        while (isBefore(current, rangeEnd) || isSameDay(current, rangeEnd)) {
          if (m.recurrenceDays.includes(getDay(current))) {
            instances.push({
              ...baseEvent,
              id: `${m.id}-${format(current, "yyyy-MM-dd")}`,
              date: format(current, "yyyy-MM-dd"),
              time: format(startDateObj, "HH:mm"),
            });
          }
          current = addDays(current, 1);
          if (instances.length > 365) break; // Safety break
        }
      } else {
        // ONCE or fallback
        instances.push({
          ...baseEvent,
          date: format(startDateObj, "yyyy-MM-dd"),
          time: format(startDateObj, "HH:mm"),
        });
      }
      return instances;
    };

    const expandedMeetings = internshipMeetings.flatMap((m: any) => expandMeeting(m));

    const mentees = (menteesData as any)?.myMentees || [];
    const milestoneEvents = mentees.flatMap((m: any) => 
      (m.milestones || []).map((milestone: any, idx: number) => {
        const dateObj = new Date(isNaN(Number(milestone.date)) ? milestone.date : Number(milestone.date));
        return {
          id: `milestone-${m.id}-${idx}`,
          title: `Milestone: ${milestone.title}`,
          date: !isNaN(dateObj.getTime()) ? format(dateObj, "yyyy-MM-dd") : "N/A",
          time: "09:00",
          status: milestone.completed ? 'completed' : 'pending',
          source: 'milestone',
          mentor: m.user, 
          meetingLink: ""
        };
      })
    );

    const reviewEvents = mentees.flatMap((m: any) => 
      (m.sprintReviews || []).map((review: any, idx: number) => {
        const dateObj = new Date(isNaN(Number(review.date)) ? review.date : Number(review.date));
        return {
          id: `review-${m.id}-${idx}`,
          title: `Sprint Review W${review.week} - ${m.user?.username}`,
          date: !isNaN(dateObj.getTime()) ? format(dateObj, "yyyy-MM-dd") : "N/A",
          time: "17:00",
          status: 'confirmed',
          source: 'review',
          mentor: m.user,
          meetingLink: ""
        };
      })
    );

    return [...bookings, ...expandedMeetings, ...milestoneEvents, ...reviewEvents];
  }, [activeBookings, meetingsData, menteesData]);

  const filteredEvents = useMemo(() => {
    const today = startOfToday();
    const now = new Date();

    return calendarEvents.filter((event: any) => {
      const eventDate = new Date(event.date + "T12:00:00");
      
      // Rule: Hide past events
      if (isBefore(eventDate, today)) return false;

      if (timeFilter === 'all') return true;
      if (timeFilter === 'today') return isToday(eventDate);
      if (timeFilter === 'week') return isSameWeek(eventDate, now);
      if (timeFilter === 'month') return isSameMonth(eventDate, now);
      if (timeFilter === 'year') return isSameYear(eventDate, now);
      
      return true;
    }).sort((a: any, b: any) => {
      const aTime = new Date(`${a.date}T${a.time}:00`).getTime();
      const bTime = new Date(`${b.date}T${b.time}:00`).getTime();
      return aTime - bTime;
    });
  }, [calendarEvents, timeFilter]);

  const generateMeetLink = (): string => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const generateSegment = (length: number) =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `https://meet.google.com/${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
  };

  const [confirmingBooking, setConfirmingBooking] = useState<any | null>(null);
  const [manualLink, setManualLink] = useState("");

  const handleStatusUpdate = async (id: string, status: string, providedLink?: string) => {
    let meetingLink = providedLink || "";
    if (status === 'confirmed' && !meetingLink) {
      meetingLink = generateMeetLink();
    }
    await updateBookingStatus({
      variables: { id, status, meetingLink }
    });
  };

  const handleAcceptClick = (booking: any) => {
    setConfirmingBooking(booking);
    setManualLink(""); // Clear it so they must enter one
  };

  const handleCreateSession = async (session: any) => {
    try {
      await createBooking({
        variables: {
          type: session.type,
          date: session.date,
          time: session.time,
          topic: session.title, // Map title to topic
          notes: session.description,
          meetingLink: session.link
        }
      });
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const downloadICS = (bookings: any[]) => {
    const confirmedOnes = bookings.filter(b => b.status === "confirmed");
    if (confirmedOnes.length === 0) {
      toast.error("No confirmed bookings to sync");
      return;
    }

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Codemande//Academy Hub//EN\n";

    confirmedOnes.forEach(booking => {
      try {
        const dateStr = booking.date.includes('/') ? booking.date.split('/').reverse().join('-') : booking.date;
        const [year, month, day] = dateStr.split('-').map(Number);
        let [hour, minute] = booking.time.split(':').map(Number);
        const isPM = booking.time.toLowerCase().includes('pm');
        const isAM = booking.time.toLowerCase().includes('am');

        if (isPM && hour < 12) hour += 12;
        if (isAM && hour === 12) hour = 0;

        const start = new Date(year, month - 1, day, hour, minute);
        if (isNaN(start.getTime())) return;

        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

        const formatICSDate = (date: Date) => {
          return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };

        icsContent += "BEGIN:VEVENT\n";
        icsContent += `SUMMARY:Codemande: ${booking.type.replace('-', ' ')} (${booking.user?.username || 'Student'})\n`;
        icsContent += `DTSTART:${formatICSDate(start)}\n`;
        icsContent += `DTEND:${formatICSDate(end)}\n`;
        icsContent += `DESCRIPTION:Mentorship session with ${booking.user?.username}. Link: ${booking.meetingLink || 'No link provided'}\n`;
        if (booking.meetingLink) icsContent += `LOCATION:${booking.meetingLink}\n`;
        icsContent += "END:VEVENT\n";
      } catch (e) {
        console.error("Error processing booking for ICS:", booking, e);
      }
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `codemande-schedule.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSyncCalendar = () => {
    downloadICS(allBookings);
    toast.success("Calendar file (.ics) downloaded! You can import this into Google Calendar or Outlook.");
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
            <Button variant="gold" size="sm" className="ml-2 gap-2" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4" />
              Schedule Session
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-muted/30 p-1.5 rounded-2xl w-fit border border-border/50">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'year', label: 'This Year' },
            { id: 'all', label: 'Show All' },
          ].map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id as any)}
              variant={timeFilter === filter.id ? 'gold' : 'ghost'}
              size="sm"
              className={`rounded-[14px] px-6 text-xs font-bold transition-all duration-300 ${
                timeFilter === filter.id ? 'shadow-lg shadow-gold/20' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Session Queue
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-muted/50">
                    {filteredEvents.length} {timeFilter} sessions
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading || meetingsLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No sessions found for this timeframe.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {filteredEvents.map((booking: any) => {
                      const activeToday = isToday(new Date(booking.date + "T12:00:00"));
                      return (
                        <div
                          key={booking.id}
                          className={`p-5 transition-all duration-300 relative overflow-hidden group ${
                            activeToday ? 'bg-gold/5' : 'hover:bg-muted/5'
                          }`}
                        >
                          {activeToday && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
                          )}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                                activeToday ? 'bg-gold/20' : (booking.status === 'confirmed' ? 'bg-accent/20' : 'bg-muted')
                              }`}>
                                <Video className={`w-6 h-6 ${activeToday ? 'text-gold' : (booking.status === 'confirmed' ? 'text-accent' : 'text-muted-foreground')}`} />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className={`font-bold text-base capitalize ${activeToday ? 'text-gold' : 'text-foreground'}`}>
                                    {booking.title}
                                  </h4>
                                  {activeToday && (
                                    <Badge className="bg-gold text-black hover:bg-gold/90 font-black text-[9px] h-5 uppercase tracking-tighter">Happening Today</Badge>
                                  )}
                                  {!activeToday && (
                                    <Badge variant="outline" className={`text-[10px] h-5 ${
                                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                      booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                      'bg-red-500/10 text-red-500 border-red-500/20'
                                    }`}>
                                      {booking.status}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{booking.date}</span>
                                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{booking.time}</span>
                                  <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    {booking.source === 'internship' ? 'Hub Class' : (booking.user?.username || 'Student')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {booking.status === 'pending' && (
                                <Button size="sm" variant="outline" className="text-green-400 border-green-500/20 hover:bg-green-500/10 h-8" onClick={() => handleAcceptClick(booking)}>
                                  <Check className="w-3.5 h-3.5 mr-1" />
                                  Accept
                                </Button>
                              )}
                              {(booking.status === 'confirmed' || booking.source === 'internship') && booking.meetingLink && (
                                <Button size="sm" variant="gold" className="h-8" onClick={() => window.open(booking.meetingLink, "_blank")}>
                                  <Video className="w-3.5 h-3.5 mr-1.5" />
                                  Join
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="h-8" onClick={() => setViewSession(booking)}>
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                <Button variant="outline" className="w-full" onClick={handleSyncCalendar}>
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
        onAdd={handleCreateSession}
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

      {/* Confirmation Dialog for Bookings */}
      <Dialog open={!!confirmingBooking} onOpenChange={(open) => !open && setConfirmingBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Confirm Mentorship Call
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-sm font-medium">{confirmingBooking?.type?.replace('-', ' ')} with {confirmingBooking?.user?.username}</p>
              <p className="text-xs text-muted-foreground">{confirmingBooking?.date} at {confirmingBooking?.time}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-link" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Meeting Link
              </Label>
              <Input
                id="meeting-link"
                value={manualLink}
                onChange={(e) => setManualLink(e.target.value)}
                placeholder="https://meet.google.com/xxx-yyyy-zzz"
                className="bg-background border-accent/10 focus:border-accent"
              />
              <p className="text-[10px] text-muted-foreground">
                You can use the auto-generated link above or paste your own (e.g., from Google Calendar or Zoom).
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmingBooking(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="gold" onClick={() => {
              handleStatusUpdate(confirmingBooking.id, 'confirmed', manualLink);
              setConfirmingBooking(null);
            }}
              disabled={!manualLink || manualLink.length < 5}
              className="flex-1">
              Approve & Send Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
