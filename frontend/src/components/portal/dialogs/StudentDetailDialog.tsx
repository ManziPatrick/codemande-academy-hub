import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@apollo/client/react";
import { APPROVE_LESSON_PROGRESS } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Award,
    TrendingUp,
    GraduationCap,
    Activity,
    CheckCircle,
    Clock,
    Lock,
} from "lucide-react";

interface StudentDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: any | null;
}

export function StudentDetailDialog({ open, onOpenChange, student }: StudentDetailDialogProps) {
    if (!student) return null;

    const getInitials = (name: string) => (name || "").split(" ").map(n => n[0]).join("").toUpperCase();

    const getRoleBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: "bg-green-500/20 text-green-400 border-green-400/30",
            intern: "bg-blue-500/20 text-blue-400 border-blue-400/30",
            graduate: "bg-purple-500/20 text-purple-400 border-purple-400/30",
            alumni: "bg-gold/20 text-gold border-gold/30",
        };
        return styles[status] || "bg-accent/20 text-accent border-accent/30";
    };

    // Calculate overall progress across all courses
    const calculateOverallProgress = () => {
        if (!student.enrolledCourses || student.enrolledCourses.length === 0) return 0;

        let totalAcademyLessons = 0;
        let totalAcademyCompleted = 0;

        const completedList = Array.isArray(student.completedLessons) ? student.completedLessons : [];

        student.enrolledCourses.forEach((course: any) => {
            const courseTotal = course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;

            const currentCourseId = (course.id || course._id || "").toString();
            const courseCompleted = completedList.filter((cl: any) => {
                const clCourseId = (cl.courseId || (cl.course && (cl.course.id || cl.course._id)) || "").toString();
                return clCourseId === currentCourseId;
            }).length;

            totalAcademyLessons += courseTotal;
            totalAcademyCompleted += courseCompleted;
        });

        return totalAcademyLessons > 0 ? Math.round((totalAcademyCompleted / totalAcademyLessons) * 100) : 0;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Student Profile</DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 pb-6 overflow-y-auto">
                    <div className="space-y-6 py-4">
                        {/* Header Section */}
                        <div className="flex items-start gap-6">
                            <Avatar className="w-20 h-20 ring-4 ring-accent/10">
                                <AvatarFallback className="bg-accent/20 text-accent text-2xl font-bold">
                                    {getInitials(student.username || student.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-heading text-2xl font-semibold text-card-foreground mb-1">
                                    {student.fullName || student.username || student.name}
                                </h3>
                                <p className="text-card-foreground/60 mb-3">{student.email}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className={getRoleBadge(student.academicStatus || "active")}>
                                        <GraduationCap className="w-3 h-3 mr-1" />
                                        {(student.academicStatus || "active").charAt(0).toUpperCase() + (student.academicStatus || "active").slice(1)}
                                    </Badge>
                                    <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                                        Level {student.level || 1}
                                    </Badge>
                                    {student.badges && student.badges.length > 0 && (
                                        <Badge variant="outline" className="bg-gold/20 text-gold border-gold/30">
                                            <Award className="w-3 h-3 mr-1" />
                                            {student.badges.length} Badge{student.badges.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <h4 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-accent" />
                                    Contact Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {student.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-card-foreground/60" />
                                            <span className="text-card-foreground/80">{student.phone}</span>
                                        </div>
                                    )}
                                    {student.location && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-card-foreground/60" />
                                            <span className="text-card-foreground/80">{student.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-card-foreground/60" />
                                        <span className="text-card-foreground/80">{student.email}</span>
                                    </div>
                                    {student.createdAt && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-card-foreground/60" />
                                            <span className="text-card-foreground/80">
                                                Joined {new Date(parseInt(student.createdAt) || student.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {student.bio && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <p className="text-sm text-card-foreground/70">{student.bio}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Overall Progress */}
                        <Card className="border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-card-foreground flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-accent" />
                                        Overall Progress
                                    </h4>
                                    <span className="text-sm font-medium text-accent">{calculateOverallProgress()}%</span>
                                </div>
                                <Progress value={calculateOverallProgress()} className="h-2" />
                                <div className="mt-2 text-xs text-card-foreground/60">
                                    {Array.isArray(student.completedLessons) ? student.completedLessons.length : 0} lessons completed across {student.enrolledCourses?.length || 0} course{student.enrolledCourses?.length !== 1 ? 's' : ''}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs for detailed information */}
                        <Tabs defaultValue="courses" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="courses">Courses</TabsTrigger>
                                <TabsTrigger value="meetings">Meetings</TabsTrigger>
                                <TabsTrigger value="badges">Badges</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                            </TabsList>

                            <TabsContent value="courses" className="space-y-3 mt-4">
                                {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                                    student.enrolledCourses.map((course: any) => {
                                        const totalLessons = course.modules?.reduce((acc: number, mod: any) => {
                                            return acc + (mod.lessons?.length || 0);
                                        }, 0) || 0;
                                        const completedLessonsArray = Array.isArray(student.completedLessons) ? student.completedLessons : [];

                                        // Normalize course ID for comparison
                                        const currentCourseId = (course.id || course._id || "").toString();

                                        const completedInCourse = completedLessonsArray.filter((cl: any) => {
                                            const clCourseId = (cl.courseId || (cl.course && (cl.course.id || cl.course._id)) || "").toString();
                                            return clCourseId === currentCourseId;
                                        }).length;

                                        const courseProgress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

                                        const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
                                        const [approveProgress] = useMutation(APPROVE_LESSON_PROGRESS);

                                        const handleApprove = async (lessonId: string) => {
                                            try {
                                                await approveProgress({
                                                    variables: {
                                                        userId: student.id,
                                                        courseId: currentCourseId,
                                                        lessonId
                                                    }
                                                });
                                                toast.success("Lesson progress approved!");
                                                // Note: Ideally we'd refetch or update local state here
                                            } catch (err: any) {
                                                toast.error(err.message || "Failed to approve progress");
                                            }
                                        };

                                        return (
                                            <Card key={course.id} className="border-border/50">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h5 className="font-medium text-card-foreground">{course.title}</h5>
                                                            <p className="text-xs text-card-foreground/60 mt-1">
                                                                {course.modules?.length || 0} modules • {totalLessons} lessons
                                                            </p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-xs h-7"
                                                                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                                            >
                                                                {expandedCourse === course.id ? "Hide Units" : "View Units"}
                                                            </Button>
                                                            <Badge variant="outline" className="text-xs">
                                                                {course.level || 'Beginner'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Progress value={courseProgress} className="flex-1 h-2" />
                                                        <span className="text-xs font-medium text-accent min-w-[40px] text-right">
                                                            {courseProgress}%
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-card-foreground/60 mt-1">
                                                        {completedInCourse}/{totalLessons} lessons completed
                                                    </p>

                                                    {expandedCourse === course.id && (
                                                        <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
                                                            {course.modules?.map((mod: any) => (
                                                                <div key={mod.id || mod._id} className="space-y-2">
                                                                    <p className="text-[10px] font-bold uppercase text-accent/70 tracking-wider px-1">{mod.title}</p>
                                                                    <div className="space-y-1">
                                                                        {mod.lessons?.map((les: any) => {
                                                                            const lesId = (les.id || les._id).toString();
                                                                            const isLesCompleted = completedLessonsArray.some((cl: any) => {
                                                                                const clCourseId = (cl.courseId || (cl.course && (cl.course.id || cl.course._id)) || "").toString();
                                                                                return clCourseId === currentCourseId && cl.lessonId === lesId;
                                                                            });

                                                                            return (
                                                                                <div key={lesId} className="flex items-center justify-between p-2 rounded-lg bg-background/40 text-xs">
                                                                                    <div className="flex items-center gap-2">
                                                                                        {isLesCompleted ? <CheckCircle className="w-3 h-3 text-green-500" /> : <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />}
                                                                                        <span className={isLesCompleted ? "text-card-foreground/50 line-through" : "text-card-foreground"}>{les.title}</span>
                                                                                        {les.type === 'assignment' && <Badge variant="outline" className="text-[8px] h-4 py-0">Assignment</Badge>}
                                                                                        {les.type === 'quiz' && <Badge variant="outline" className="text-[8px] h-4 py-0 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Quiz</Badge>}
                                                                                    </div>
                                                                                    {!isLesCompleted && (
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="h-6 text-[10px] hover:text-accent"
                                                                                            onClick={() => handleApprove(lesId)}
                                                                                        >
                                                                                            Approve Progress
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No courses enrolled yet</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="meetings" className="space-y-3 mt-4">
                                {student.bookings && student.bookings.length > 0 ? (
                                    student.bookings.slice(0, 10).map((booking: any, index: number) => (
                                        <Card key={index} className="border-border/50">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-accent" />
                                                        <h5 className="font-medium text-card-foreground">{booking.topic || booking.type}</h5>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                                                                booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                                                                    booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                                                                        'bg-accent/20 text-accent border-accent/30'
                                                        }
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-xs text-card-foreground/60">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                                                    </div>
                                                    {booking.mentor && (
                                                        <div className="flex items-center gap-2">
                                                            <GraduationCap className="w-3 h-3" />
                                                            <span>Mentor: {booking.mentor.username}</span>
                                                        </div>
                                                    )}
                                                    {booking.notes && (
                                                        <p className="mt-2 text-card-foreground/70">{booking.notes}</p>
                                                    )}
                                                    {booking.meetingLink && booking.status !== 'cancelled' && (
                                                        <a
                                                            href={booking.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-accent hover:underline inline-flex items-center gap-1 mt-2"
                                                        >
                                                            Join Meeting →
                                                        </a>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No meetings scheduled</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="badges" className="space-y-3 mt-4">
                                {student.badges && student.badges.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {student.badges.filter((ub: any) => ub && ub.badge).map((userBadge: any, index: number) => {
                                            const badge = userBadge.badge;
                                            return (
                                                <Card key={index} className="border-border/50">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                                                                <Award className="w-5 h-5 text-gold" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-medium text-card-foreground">{badge.title}</h5>
                                                                <p className="text-xs text-card-foreground/60 mt-1">{badge.description}</p>
                                                                {userBadge.awardedAt && (
                                                                    <p className="text-xs text-card-foreground/40 mt-2">
                                                                        Awarded {new Date(parseInt(userBadge.awardedAt) || userBadge.awardedAt).toLocaleDateString()}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Award className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No badges earned yet</p>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="activity" className="space-y-2 mt-4">
                                {student.activityLog && student.activityLog.length > 0 ? (
                                    student.activityLog.slice().reverse().slice(0, 10).map((log: any, index: number) => (
                                        <Card key={index} className="border-border/50">
                                            <CardContent className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-accent" />
                                                        <span className="text-sm font-medium text-card-foreground capitalize">
                                                            {log.action.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-card-foreground/40">
                                                        {log.timestamp ? new Date(parseInt(log.timestamp) || log.timestamp).toLocaleString() : 'Recently'}
                                                    </span>
                                                </div>
                                                {log.details && (
                                                    <p className="text-xs text-card-foreground/60 mt-1 ml-6">{log.details}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Activity className="w-12 h-12 mx-auto text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground">No recent activity</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
