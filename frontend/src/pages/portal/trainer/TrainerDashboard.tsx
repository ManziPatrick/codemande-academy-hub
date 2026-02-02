import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Video,
  GraduationCap,
  ExternalLink,
  Check,
  X,
  Loader2
} from "lucide-react";
import { StartLiveSessionDialog, AddSessionDialog } from "@/components/portal/dialogs";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_BOOKINGS, GET_TRAINER_STUDENTS, GET_CONVERSATIONS, GET_TRAINER_STATS } from "@/lib/graphql/queries";
import { UPDATE_BOOKING_STATUS, CREATE_BOOKING } from "@/lib/graphql/mutations";
import { toast } from "sonner";

export default function TrainerDashboard() {
  const { user } = useAuth();
  const [isLiveSessionOpen, setIsLiveSessionOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { data: bookingsData, loading: bookingsLoading, refetch: refetchBookings } = useQuery(GET_MY_BOOKINGS);
  const { data: studentsData } = useQuery(GET_TRAINER_STUDENTS);
  const { data: conversationsData } = useQuery(GET_CONVERSATIONS);
  const { data: statsData } = useQuery(GET_TRAINER_STATS);

  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      toast.success("Booking status updated");
      refetchBookings();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update booking");
    }
  });
  
  const [createBooking] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      refetchBookings();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to schedule session");
    }
  });

  const bookings = (bookingsData as any)?.myBookings || [];
  const students = (studentsData as any)?.trainerStudents || [];
  const trainerStats = (statsData as any)?.trainerStats || { activeCourses: 0, totalStudents: 0, pendingReviews: 0, mentees: 0 };

  const handleStatusUpdate = async (id: string, status: string) => {
    let meetingLink = "";
    if (status === 'confirmed') {
      meetingLink = `https://meet.google.com/call-${Math.random().toString(36).substring(7)}`;
    }
    await updateBookingStatus({
      variables: { id, status, meetingLink }
    });
  };


  const handleAddSession = async (session: any) => {
    try {
      await createBooking({
        variables: {
          mentorId: user?.id, // Trainer acts as mentor
          type: session.type,
          date: session.date,
          time: session.time,
          topic: session.title,
          notes: `Course: ${session.course}\n${session.description || ''}`,
          meetingLink: session.link
        }
      });
      setIsScheduleOpen(false);
    } catch (error) {
      console.error("Error scheduling session:", error);
    }
  };

  const handleStartLiveSession = async (session: any) => {
    try {
      await createBooking({
        variables: {
          mentorId: user?.id,
          type: 'live',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          topic: session.title,
          notes: `Course ID: ${session.courseId}\n${session.description || ''}`,
          meetingLink: session.meetingLink
        }
      });
      // Dialog handles its own state for 'Ready' step
    } catch (error) {
      console.error("Error starting live session:", error);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Welcome, {user?.fullName.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your courses today.
            </p>
          </div>
          <Button variant="gold" onClick={() => setIsLiveSessionOpen(true)}>
            <Video className="w-4 h-4 mr-2" />
            Start Live Session
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{trainerStats.activeCourses}</p>
                  <p className="text-xs text-card-foreground/60">Active Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{trainerStats.totalStudents}</p>
                  <p className="text-xs text-card-foreground/60">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{trainerStats.pendingReviews}</p>
                  <p className="text-xs text-card-foreground/60">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{trainerStats.mentees}</p>
                  <p className="text-xs text-card-foreground/60">Mentees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity Placeholder (Simplified) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Your Course Statistics</CardTitle>
                <Link to="/portal/trainer/courses">
                  <Button variant="ghost" size="sm" className="text-accent">
                    Manage Courses <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-12 text-center text-muted-foreground border-t border-border/10">
                 <p>Course performance charts will appear here.</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Course Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No recent course activity found.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions & Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Session Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookingsLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">No pending requests</p>
                    </div>
                  ) : (
                    bookings.map((booking: any) => (
                      <div
                        key={booking.id}
                        className="p-3 bg-background/50 rounded-lg border border-border/30"
                      >
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm text-card-foreground capitalize">{booking.type.replace('-', ' ')}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 
                            booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-xs text-card-foreground/60 mt-1">Student: {booking.user?.username || 'Unknown'}</p>
                        <p className="text-xs text-card-foreground/80 mt-1 line-clamp-1 italic">{booking.topic}</p>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/10">
                          <span className="text-xs text-accent font-medium">{booking.date} @ {booking.time}</span>
                          
                          <div className="flex gap-1">
                            {booking.status === 'pending' ? (
                              <>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-green-400 hover:bg-green-500/10" onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                                  <Check className="h-4 h-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-500/10" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                                  <X className="h-4 h-4" />
                                </Button>
                              </>
                            ) : booking.status === 'confirmed' && booking.meetingLink ? (
                              <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-accent">
                                  <ExternalLink className="h-4 h-4" />
                                </Button>
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setIsScheduleOpen(true)}>
                    Schedule New Class
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Conversations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-accent" />
                    Recent Chats
                  </CardTitle>
                  <Link to="/chat">
                    <Button variant="ghost" size="sm" className="text-accent h-7 px-2">
                       View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!conversationsData?.conversations?.length ? (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">No recent messages</p>
                    </div>
                  ) : (
                    conversationsData.conversations.slice(0, 3).map((conv: any) => {
                      const otherParticipant = conv.participants.find((p: any) => p.id !== user?.id);
                      return (
                        <Link to="/chat" key={conv.id}>
                          <div className="p-2 transition-colors hover:bg-accent/5 rounded-lg border border-transparent hover:border-accent/10">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-xs text-card-foreground">{otherParticipant?.username || 'Chat'}</p>
                              <span className="text-[10px] text-muted-foreground">
                                {conv.lastMessage ? new Date(parseInt(conv.lastMessage.createdAt)).toLocaleDateString() : ''}
                              </span>
                            </div>
                            <p className="text-[10px] text-card-foreground/60 mt-0.5 line-clamp-1">
                              {conv.lastMessage?.content || 'No messages yet'}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/portal/trainer/assignments">
                    <Button variant="ghost" className="w-full justify-start hover:bg-accent/5">
                      <AlertCircle className="w-4 h-4 mr-2 text-accent" />
                      Review Submissions
                    </Button>
                  </Link>
                  <Link to="/portal/trainer/students">
                    <Button variant="ghost" className="w-full justify-start hover:bg-accent/5">
                      <MessageSquare className="w-4 h-4 mr-2 text-accent" />
                      Student Inquiries
                    </Button>
                  </Link>
                  <Link to="/portal/trainer/courses">
                    <Button variant="ghost" className="w-full justify-start hover:bg-accent/5">
                      <BookOpen className="w-4 h-4 mr-2 text-accent" />
                      Update Curriculum
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <StartLiveSessionDialog
        open={isLiveSessionOpen}
        onOpenChange={setIsLiveSessionOpen}
        onStart={handleStartLiveSession}
      />
      <AddSessionDialog
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        onAdd={handleAddSession}
      />
    </PortalLayout>
  );
}
