import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  PlayCircle,
  Award,
  Briefcase,
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Target,
  Flame,
  ExternalLink,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_ME, GET_MY_BOOKINGS, GET_CONVERSATIONS, GET_MY_PAYMENTS } from "@/lib/graphql/queries";

// No static achievements needed

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: meData, loading: meLoading } = useQuery(GET_ME);
  const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_MY_BOOKINGS);
  const { data: conversationsData } = useQuery(GET_CONVERSATIONS);
  const { data: paymentsData } = useQuery(GET_MY_PAYMENTS);

  if (meLoading || bookingsLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </PortalLayout>
    );
  }

  const me = (meData as any)?.me;
  const enrolledCourses = me?.enrolledCourses || [];
  const completedLessons = me?.completedLessons || [];
  const bookings = (bookingsData as any)?.myBookings || [];
  const payments = (paymentsData as any)?.myPayments || [];

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    if (totalLessons === 0) return 0;
    const completed = completedLessons.filter((l: any) => l.courseId === courseId).length;
    return Math.round((completed / totalLessons) * 100);
  };

  const totalCompleted = completedLessons.length;

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
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Continue your learning journey. You're making great progress!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-xs font-medium text-accent uppercase tracking-wider">{me?.academicStatus || 'Student'}</span>
              <span className="text-sm font-bold">Level {me?.level || 1}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full ml-2">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">{me?.streak || 0} Day Streak!</span>
            </div>
          </div>
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
                  <p className="text-2xl font-bold text-card-foreground">{enrolledCourses.length}</p>
                  <p className="text-xs text-card-foreground/60">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{totalCompleted}</p>
                  <p className="text-xs text-card-foreground/60">Lessons Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{totalCompleted * 15}m</p>
                  <p className="text-xs text-card-foreground/60">Est. Learning Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{Math.floor(totalCompleted / 5)}</p>
                  <p className="text-xs text-card-foreground/60">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Continue Learning</CardTitle>
                <Link to="/portal/student/courses">
                  <Button variant="ghost" size="sm" className="text-accent">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledCourses.length === 0 && (
                   <div className="text-center py-8">
                     <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                     <Link to="/training">
                       <Button variant="gold">Browse Courses</Button>
                     </Link>
                   </div>
                )}
                {enrolledCourses.map((course: any, index: number) => {
                  const courseId = course.id || course._id;
                  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;
                  const progress = getCourseProgress(courseId, totalLessons);
                  const lastCompletedLesson = completedLessons.filter((l: any) => l.courseId === courseId).pop();

                  return (
                    <div
                      key={courseId || index}
                      className="p-4 bg-background/50 rounded-lg border border-border/30 hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-heading font-semibold text-card-foreground">
                            {course.title}
                          </h3>
                          <p className="text-sm text-card-foreground/60 mt-0.5">
                            {lastCompletedLesson ? "Continue where you left off" : "Start your first lesson"}
                          </p>
                        </div>
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                          {progress}% complete
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-card-foreground/60">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            {totalLessons} lessons
                          </span>
                        </div>
                        <Link to={`/portal/student/courses/${course.id || course._id}`}>
                          <Button variant="gold" size="sm">
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    My Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookings.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">No upcoming sessions</p>
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
                        <p className="text-xs text-card-foreground/60 mt-1 truncate">{booking.topic || "No topic specified"}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-accent">{booking.date} at {booking.time}</span>
                          {booking.meetingLink && (
                            <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-accent">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
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
                  {!(conversationsData as any)?.conversations?.length ? (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">No recent messages</p>
                    </div>
                  ) : (
                    ((conversationsData as any).conversations as any[]).slice(0, 3).map((conv: any) => {
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

            {/* My Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    My Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {me?.badges?.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">Keep learning to earn badges!</p>
                    </div>
                  ) : (
                    me?.badges?.map((ub: any, index: number) => (
                      <div
                        key={ub.badge.id}
                        className="flex items-center gap-3 p-2 bg-background/30 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <Award className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{ub.badge.title}</p>
                          <p className="text-[10px] text-card-foreground/60">{new Date(parseInt(ub.awardedAt)).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Billing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-accent" />
                    Billing
                  </CardTitle>
                  <Link to="/portal/student/billing">
                    <Button variant="ghost" size="sm" className="text-accent h-7 px-2">
                       History
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-lg">
                      <p className="text-xs text-muted-foreground">No recent transactions</p>
                    </div>
                  ) : (
                    payments.slice(0, 2).map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center p-2 bg-accent/5 rounded-lg border border-accent/10">
                         <div className="flex-1 min-w-0">
                           <p className="text-[10px] font-bold truncate">{p.itemTitle}</p>
                           <p className="text-[8px] text-muted-foreground">{new Date(p.date).toLocaleDateString()}</p>
                         </div>
                         <p className="text-[10px] font-black">{p.amount.toLocaleString()} {p.currency}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Internship Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-border/50 bg-gradient-to-br from-card to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-card-foreground">Internship Ready</p>
                      <p className="text-xs text-card-foreground/60">Complete 80% to unlock</p>
                    </div>
                  </div>
                  <Progress value={Math.min(totalCompleted * 5, 100)} className="h-2 mb-2" />
                  <p className="text-xs text-card-foreground/70">{Math.max(0, 80 - totalCompleted * 5)}% more to qualify for internship placement</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
