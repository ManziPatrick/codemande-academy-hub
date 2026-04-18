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
  X,
  Filter,
  MoreVertical,
  Activity
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ViewSessionDialog,
  DeleteConfirmDialog,
  EditSessionDialog,
} from "@/components/portal/dialogs";
import { CalendarGrid } from "@/components/portal/CalendarGrid";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_BOOKINGS, GET_INTERNSHIP_MEETINGS } from "@/lib/graphql/queries";
import { 
  UPDATE_BOOKING_STATUS, 
  UPDATE_INTERNSHIP_MEETING, 
  DELETE_INTERNSHIP_MEETING 
} from "@/lib/graphql/mutations";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminSchedule() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'year' | 'all' | 'pending'>('month');
  const [sessionTypeFilter, setSessionTypeFilter] = useState<'all' | 'mentorship' | 'internship'>('all');
  
  // Queries
  const { data: bookingsData, loading: bookingsLoading, refetch: refetchBookings } = useQuery(GET_ALL_BOOKINGS, {
    variables: { limit: 100 }
  });
  const { data: meetingsData, loading: meetingsLoading, refetch: refetchMeetings } = useQuery(GET_INTERNSHIP_MEETINGS, {
    variables: { teamId: null, programId: null }
  });

  // Mutations
  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      toast.success("Booking updated");
      refetchBookings();
    }
  });

  const [updateInternshipMeeting] = useMutation(UPDATE_INTERNSHIP_MEETING, {
    onCompleted: () => {
      toast.success("Meeting updated successfully");
      refetchMeetings();
      refetchBookings();
    },
    onError: (err) => toast.error(`Failed to update: ${err.message}`)
  });

  const [deleteInternshipMeeting] = useMutation(DELETE_INTERNSHIP_MEETING, {
    onCompleted: () => {
      toast.success("Meeting removed successfully");
      refetchMeetings();
    },
    onError: (err) => toast.error(`Failed to delete: ${err.message}`)
  });

  const [viewSession, setViewSession] = useState<any | null>(null);
  const [editSession, setEditSession] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [confirmingBooking, setConfirmingBooking] = useState<any | null>(null);
  const [manualLink, setManualLink] = useState("");

  const allBookings = (bookingsData as any)?.bookings?.items || [];
  const allInternshipMeetings = (meetingsData as any)?.getInternshipMeetings || [];

  const calendarEvents = useMemo(() => {
    // 1. Process Mentorship Bookings
    const bookings = allBookings.map((b: any) => ({
      ...b,
      title: `${b.type.replace('-', ' ')}: ${b.user?.username || 'Student'} w/ ${b.mentor?.username || 'Mentor'}`,
      source: 'booking'
    }));

    // 2. Expand Recurring Internship Meetings
    const expandMeeting = (m: any) => {
      const instances: any[] = [];
      const startTimestamp = Number(m.startTime);
      const isTimestamp = !isNaN(startTimestamp);
      const startDateObj = new Date(isTimestamp ? startTimestamp : m.startTime);
      
      if (isNaN(startDateObj.getTime())) return [];

      const now = new Date();
      const rangeStart = addDays(now, -30);
      let rangeEnd = addDays(now, 90);

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
        status: m.status || 'confirmed',
        source: 'internship'
      };

      if (m.type === 'DAILY') {
        let current = startDateObj;
        if (isBefore(current, rangeStart)) current = rangeStart;
        while (isBefore(current, rangeEnd) || isSameDay(current, rangeEnd)) {
          if (!m.recurrenceDays || m.recurrenceDays.length === 0 || m.recurrenceDays.includes(getDay(current))) {
            instances.push({
              ...baseEvent,
              id: `${m.id}-${format(current, "yyyy-MM-dd")}`,
              date: format(current, "yyyy-MM-dd"),
              time: format(startDateObj, "HH:mm"),
            });
          }
          current = addDays(current, 1);
          if (instances.length > 365) break;
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
          if (instances.length > 365) break;
        }
      } else if (m.type === 'MONTHLY') {
        let current = startDateObj;
        if (isBefore(current, rangeStart)) {
          while (isBefore(current, rangeStart)) {
            current = new Date(current.setMonth(current.getMonth() + 1));
          }
        }

        while (isBefore(current, rangeEnd) || isSameDay(current, rangeEnd)) {
          instances.push({
            ...baseEvent,
            id: `${m.id}-${format(current, "yyyy-MM-dd")}`,
            date: format(current, "yyyy-MM-dd"),
            time: format(startDateObj, "HH:mm"),
          });
          current = new Date(current.setMonth(current.getMonth() + 1));
          if (instances.length > 365) break;
        }
      } else {
        instances.push({
          ...baseEvent,
          date: format(startDateObj, "yyyy-MM-dd"),
          time: format(startDateObj, "HH:mm"),
        });
      }
      return instances;
    };

    const expandedMeetings = allInternshipMeetings.flatMap((m: any) => expandMeeting(m));

    return [...bookings, ...expandedMeetings];
  }, [allBookings, allInternshipMeetings]);

  const filteredEvents = useMemo(() => {
    const today = startOfToday();
    const now = new Date();

    return calendarEvents.filter((event: any) => {
      // 1. Approval Filter (Priority)
      if (timeFilter === 'pending') return event.status === 'pending';

      // 2. Type Filter
      if (sessionTypeFilter === 'mentorship' && event.source !== 'booking') return false;
      if (sessionTypeFilter === 'internship' && event.source !== 'internship') return false;

      const eventDate = new Date(event.date + "T12:00:00");
      
      // 3. Date Filters
      if (timeFilter === 'today') return isToday(eventDate);
      if (timeFilter === 'week') return isSameWeek(eventDate, now);
      if (timeFilter === 'month') return isSameMonth(eventDate, now);
      if (timeFilter === 'year') return isSameYear(eventDate, now);
      if (timeFilter === 'all') return true;
      
      // Default: show everything from yesterday onwards if no specific time filter
      return !isBefore(eventDate, addDays(today, -1));
    }).sort((a: any, b: any) => {
      const aTime = new Date(`${a.date}T${a.time}:00`).getTime();
      const bTime = new Date(`${b.date}T${b.time}:00`).getTime();
      return aTime - bTime;
    });
  }, [calendarEvents, timeFilter, sessionTypeFilter]);

  const handleUpdate = async (session: any) => {
    if (session.source === 'internship') {
      const startTime = new Date(`${session.date}T${session.time}:00`).getTime().toString();
      // Assume 1 hour duration if not specified
      const endTime = (new Date(`${session.date}T${session.time}:00`).getTime() + 60 * 60 * 1000).toString();

      await updateInternshipMeeting({
        variables: {
          id: session.id.split('-')[0],
          title: session.title,
          description: session.description,
          type: session.type.toUpperCase(),
          startTime,
          endTime,
          meetLink: session.link
        }
      });
    } else {
      // For mentorship bookings, only status and link can currently be updated
      await updateBookingStatus({
        variables: {
          id: session.id,
          status: session.status,
          meetingLink: session.link
        }
      });
    }
  };

  const handleDelete = (session: any) => {
    if (session.source === 'internship') {
      deleteInternshipMeeting({ variables: { id: session.id.split('-')[0] } });
    } else {
      updateBookingStatus({
        variables: { id: session.id, status: 'cancelled' }
      });
    }
    setDeleteConfirm(null);
  };

  const handleStatusUpdate = async (id: string, status: string, providedLink?: string, source?: string) => {
    let meetingLink = providedLink || "";
    if (source === 'internship') {
      await updateInternshipMeeting({
        variables: { id, status, meetLink: meetingLink }
      });
    } else {
      await updateBookingStatus({
        variables: { id, status, meetingLink }
      });
    }
  };

  const handleAcceptClick = (booking: any) => {
    setConfirmingBooking(booking);
    setManualLink(booking.meetingLink || "");
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Global Schedule Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Overview and management of all platform-wide meetings and bookings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { refetchBookings(); refetchMeetings(); }}>
              <Activity className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </motion.div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' },
              { id: 'pending', label: 'To Approve' },
              { id: 'all', label: 'All Time' },
            ].map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id as any)}
                variant={timeFilter === filter.id ? 'gold' : 'ghost'}
                size="sm"
                className={`rounded-[12px] px-4 text-xs font-bold transition-all duration-300 ${
                  timeFilter === filter.id ? 'shadow-lg shadow-gold/20' : 'text-muted-foreground'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-2xl border border-border/50">
            {[
              { id: 'all', label: 'All Sessions' },
              { id: 'mentorship', label: 'Mentorships' },
              { id: 'internship', label: 'Syncs' },
            ].map((type) => (
              <Button
                key={type.id}
                onClick={() => setSessionTypeFilter(type.id as any)}
                variant={sessionTypeFilter === type.id ? 'outline' : 'ghost'}
                size="sm"
                className={`rounded-[12px] px-4 text-xs font-bold ${
                  sessionTypeFilter === type.id ? 'bg-background border-border text-foreground' : 'text-muted-foreground'
                }`}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <CalendarGrid
              events={filteredEvents}
              onEventClick={(event) => setViewSession(event)}
            />

            <Card className="border-border/50">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-lg font-heading flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Global Session Queue
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-muted/50">
                    {filteredEvents.length} Sessions Listed
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {bookingsLoading || meetingsLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No sessions scheduled for this period.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {filteredEvents.map((session: any) => {
                      const activeToday = isToday(new Date(session.date + "T12:00:00"));
                      return (
                        <div
                          key={session.id}
                          className={`p-5 transition-all duration-300 relative overflow-hidden group ${
                            activeToday ? 'bg-gold/5' : 'hover:bg-muted/5'
                          }`}
                        >
                          {activeToday && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-gold shadow-[0_0_10px_2px_rgba(255,215,0,0.3)]" />
                          )}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                                session.source === 'internship' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                              }`}>
                                <Video className={`w-6 h-6 ${session.source === 'internship' ? 'text-purple-500' : 'text-blue-500'}`} />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h4 className={`font-bold text-base ${activeToday ? 'text-gold' : 'text-foreground'}`}>
                                    {session.title}
                                  </h4>
                                  <Badge variant="secondary" className="text-[9px] h-5 uppercase tracking-tighter">
                                    {session.source === 'internship' ? 'Internship Sync' : 'Mentorship'}
                                  </Badge>
                                  {session.status && (
                                    <Badge variant="outline" className={`text-[9px] h-5 ${
                                      session.status === 'confirmed' ? 'text-green-500 border-green-500/20 bg-green-500/5' :
                                      session.status === 'pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                                      'text-red-500 border-red-500/20 bg-red-500/5'
                                    }`}>
                                      {session.status}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{session.date}</span>
                                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{session.time}</span>
                                  <span className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    {session.source === 'internship' ? `Host: ${session.mentor?.username}` : `Mentor: ${session.mentor?.username}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.status === 'pending' && (
                                <Button size="sm" variant="outline" className="text-green-500 border-green-500/20 hover:bg-green-500/10 h-8" onClick={() => handleAcceptClick(session)}>
                                  Accept
                                </Button>
                              )}
                              {session.meetingLink && session.status !== 'pending' && (
                                <Button size="sm" variant="gold" className="h-8" onClick={() => window.open(session.meetingLink, "_blank")}>
                                  Join
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem onClick={() => setViewSession(session)}>
                                    <Eye className="w-4 h-4 mr-2" /> Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setEditSession(session)}>
                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-500 focus:text-red-500" 
                                    onClick={() => setDeleteConfirm(session)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> 
                                    {session.source === 'booking' ? 'Cancel Booking' : 'Delete Meeting'}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                <CardTitle className="text-lg font-heading">Admin Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-background/50 rounded-2xl border border-border/20">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Total Mentorships</p>
                  <p className="text-2xl font-bold">{allBookings.length}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-2xl border border-border/20">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Total Internship Syncs</p>
                  <p className="text-2xl font-bold">{allInternshipMeetings.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">System Advice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Avoid overlapping global syncs for the same student tracks.</p>
                <p>• Monitor pending mentorship calls older than 24 hours.</p>
                <p>• Use "Edit Time" to adjust syncs if trainers have conflicts.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ViewSessionDialog
        open={!!viewSession}
        onOpenChange={(open) => !open && setViewSession(null)}
        session={viewSession ? {
          title: viewSession.title,
          instructor: viewSession.mentor?.username || 'N/A',
          date: viewSession.date,
          time: viewSession.time,
          course: viewSession.topic || "Core Session",
          type: viewSession.type,
          link: viewSession.meetingLink
        } : undefined}
      />

      <EditSessionDialog
        open={!!editSession}
        onOpenChange={(open) => !open && setEditSession(null)}
        session={editSession ? {
          id: editSession.id,
          title: editSession.title,
          course: editSession.topic || "Core Session",
          date: editSession.date,
          time: editSession.time,
          type: editSession.type?.toLowerCase() || "live",
          attendees: editSession.teams?.length || 0,
          link: editSession.meetingLink || "",
          description: editSession.description || ""
        } : null}
        onSave={(updated) => {
          handleUpdate({ ...editSession, ...updated });
          setEditSession(null);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title={deleteConfirm?.source === 'booking' ? "Cancel Mentorship Booking" : "Delete Internship Sync"}
        description="This action cannot be undone. Notifications will be sent to the host and attendees."
      />

      {/* Confirmation Dialog for Approvals */}
      <Dialog open={!!confirmingBooking} onOpenChange={(open) => !open && setConfirmingBooking(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Approve Session
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-sm font-medium">{confirmingBooking?.title}</p>
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
                className="bg-background border-border focus:border-accent"
              />
              <p className="text-[10px] text-muted-foreground">
                Enter the meeting link to confirm this session.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmingBooking(null)} className="flex-1">
              Cancel
            </Button>
            <Button variant="gold" onClick={() => {
              handleStatusUpdate(confirmingBooking.id.split('-')[0], 'confirmed', manualLink, confirmingBooking.source);
              setConfirmingBooking(null);
            }}
              disabled={!manualLink || manualLink.length < 5}
              className="flex-1">
              Approve & Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
