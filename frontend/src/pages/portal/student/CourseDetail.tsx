import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlayCircle,
  CheckCircle,
  Lock,
  Clock,
  BookOpen,
  FileText,
  Download,
  MessageSquare,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Code,
  FolderOpen,
  HelpCircle,
  Video,
  FileBox,
} from "lucide-react";
import { RequestHelpDialog, BookCallDialog } from "@/components/portal/dialogs";
import { LessonQuiz } from "@/components/portal/LessonQuiz";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COURSE, GET_ME, GET_ASSIGNMENT_SUBMISSIONS } from "@/lib/graphql/queries";
import { COMPLETE_LESSON, SUBMIT_ASSIGNMENT } from "@/lib/graphql/mutations";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  // Queries
  const { data: userData, refetch: refetchUser } = useQuery(GET_ME);
  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: { id: courseId }
  });

  const course = (data as any)?.course;
  const me = (userData as any)?.me;
  const completedLessons = me?.completedLessons || [];

  useEffect(() => {
    if (!activeLessonId && course?.modules?.[0]?.lessons?.[0]) {
      const firstLesson = course.modules[0].lessons[0];
      setActiveLessonId(firstLesson.id || firstLesson._id);
    }
  }, [course, activeLessonId]);

  const [completeLessonMutation] = useMutation(COMPLETE_LESSON);
  const [submitAssignmentMutation] = useMutation(SUBMIT_ASSIGNMENT);

  const { data: submissionsData, refetch: refetchSubmissions } = useQuery(GET_ASSIGNMENT_SUBMISSIONS, {
    variables: { courseId, lessonId: activeLessonId },
    skip: !activeLessonId
  });

  if (loading) return (
    <PortalLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    </PortalLayout>
  );

  if (error || !course) return (
    <PortalLayout>
      <div className="text-center p-12 space-y-4">
        <p className="text-muted-foreground">Course not found or error loading contents.</p>
        {error && <p className="text-red-500 text-sm font-mono bg-red-50 p-2 rounded">{error.message}</p>}
        <Button variant="outline" asChild>
          <Link to="/portal/student/courses">Back to My Courses</Link>
        </Button>
      </div>
    </PortalLayout>
  );

  const allLessons: any[] = course.modules?.flatMap((m: any) => m.lessons || []) || [];
  const currentLesson = allLessons.find(l => (l.id || l._id) === activeLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex(l => (l.id || l._id) === activeLessonId);

  const completedCount = allLessons.filter(l => completedLessons.some((cl: any) => cl.courseId === courseId && cl.lessonId === (l.id || l._id))).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      setActiveLessonId(prevLesson.id || prevLesson._id);
    }
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      const nextId = nextLesson.id || nextLesson._id;

      // Check if next lesson is locked
      const nextIndex = currentIndex + 1;
      const previousRequired = allLessons.slice(0, nextIndex).filter(l =>
        l.requiredAssignment || l.type === 'assignment' || l.type === 'quiz' || l.isAssignment
      );
      const isNextLocked = previousRequired.some(pl => {
        const plId = pl.id || pl._id;
        return !completedLessons.some((cl: any) => cl.courseId === courseId && cl.lessonId === plId);
      });

      if (isNextLocked) {
        toast.error(`Unit Locked: Finish previous requirements first.`);
        return;
      }

      setActiveLessonId(nextId);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeLessonId) return;
    try {
      await completeLessonMutation({
        variables: {
          courseId,
          lessonId: activeLessonId
        }
      });
      toast.success("Lesson marked as complete!");
      refetchUser();
      handleNext();
    } catch (err: any) {
      toast.error(err.message || "Failed to mark lesson as complete");
    }
  };

  const handleSaveNotes = () => {
    toast.success("Notes saved successfully!");
  };

  const handleSubmitAssignment = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please provide your submission content (URL or text)");
      return;
    }

    setIsSubmittingAssignment(true);
    try {
      await submitAssignmentMutation({
        variables: {
          courseId,
          lessonId: activeLessonId,
          content: submissionContent
        }
      });
      toast.success("Assignment submitted successfully!");
      refetchSubmissions();
      handleMarkComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit assignment");
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video": return Video;
      case "quiz": return HelpCircle;
      case "assignment": return Code;
      default: return BookOpen;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header/Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/portal/student/courses" className="hover:text-gold">My Courses</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold">{course.title}</span>
        </motion.div>

        {/* Course Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-muted/10 rounded-2xl border border-border/50"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
              <img src={course.thumbnail} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">{course.title}</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <Badge variant="outline" className="text-[10px] uppercase text-accent">{course.level}</Badge>
                <p className="text-muted-foreground text-sm">{progressPercent}% Completed</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48 bg-muted/20 rounded-full h-2">
              <div className="bg-gold h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            {(() => {
              const lessonIndex = allLessons.findIndex(l => (l.id || l._id) === activeLessonId);
              const previousLessons = allLessons.slice(0, lessonIndex);
              const isLocked = previousLessons.some(pl => {
                const plId = pl.id || pl._id;
                return !completedLessons.some((cl: any) => cl.courseId === courseId && cl.lessonId === plId);
              });

              if (isLocked) {
                return (
                  <Card className="border-border/50 min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
                    <Lock className="w-16 h-16 text-muted-foreground/30 mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Unit Locked</h2>
                    <p className="text-muted-foreground mb-8">Complete the previous module requirements to unlock this content.</p>
                    <div className="p-4 bg-muted/20 rounded-xl border border-border/30 text-left max-w-sm w-full">
                      <p className="text-[10px] font-bold uppercase text-accent mb-2 tracking-widest">Incomplete Requirements:</p>
                      <ul className="space-y-1">
                        {previousLessons.filter(pl => !completedLessons.some((cl: any) => cl.lessonId === (pl.id || pl._id))).map(pl => (
                          <li key={pl.id || pl._id} className="text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            {pl.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              }

              if (currentLesson?.type === 'quiz') {
                return (
                  <Card className="border-border/50 p-8 shadow-2xl">
                    <LessonQuiz
                      courseId={courseId!}
                      lessonId={(currentLesson.id || currentLesson._id)}
                      onComplete={handleMarkComplete}
                    />
                  </Card>
                );
              }

              return (
                <div className="space-y-6">
                  <Card className="border-border/50 overflow-hidden shadow-2xl">
                    <div className="aspect-video bg-black relative">
                      {currentLesson?.videoUrl ? (
                        <iframe src={currentLesson.videoUrl.replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
                          {React.createElement(getLessonIcon(currentLesson?.type), { className: "w-16 h-16 text-accent mb-4" })}
                          <h3 className="text-xl font-bold">{currentLesson?.title}</h3>
                          {currentLesson?.fileUrl && <Button variant="gold" className="mt-6" asChild><a href={currentLesson.fileUrl}>Open File</a></Button>}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-4">{currentLesson?.title}</h2>
                      <div className="prose prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: currentLesson?.content || currentLesson?.description || "" }} />

                      {currentLesson?.type === 'assignment' && (
                        <div className="mt-8 pt-8 border-t border-border/50 space-y-6">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-accent/5 p-6 rounded-2xl border border-accent/20 shadow-sm"
                          >
                            <h4 className="font-bold flex items-center gap-2 text-accent mb-3"><Code className="w-4 h-4" /> Exercise Mission</h4>
                            <p className="text-sm text-card-foreground/90 leading-relaxed">{currentLesson.assignmentDescription || "Complete the task as described above."}</p>
                          </motion.div>
                          <textarea
                            className="w-full h-40 p-5 bg-background border border-border/50 rounded-2xl shadow-inner focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm leading-relaxed"
                            placeholder="Paste your solution link (e.g. GitHub, Vercel) or your written answer here..."
                            value={submissionContent}
                            onChange={(e) => setSubmissionContent(e.target.value)}
                          />
                          <div className="flex justify-between items-center bg-muted/5 p-4 rounded-xl border border-border/20">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gold" />
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Required: 70% Pass Score</p>
                            </div>
                            <Button
                              variant="gold"
                              className="px-10 shadow-xl shadow-gold/20 hover:scale-105 transition-transform"
                              onClick={handleSubmitAssignment}
                              disabled={isSubmittingAssignment || !submissionContent.trim()}
                            >
                              {isSubmittingAssignment ? "Transmitting..." : "Submit Mission"}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between mt-10">
                        <Button variant="outline" className="border-border/50 hover:bg-muted/10" onClick={handlePrevious} disabled={currentIndex === 0}>
                          <ChevronLeft className="w-4 h-4 mr-2" /> Previous Block
                        </Button>
                        <Button
                          variant="gold"
                          className="shadow-lg shadow-gold/10"
                          onClick={handleMarkComplete}
                          disabled={
                            (currentLesson?.type === 'assignment' || currentLesson?.isAssignment) &&
                            !completedLessons.some((cl: any) => cl.lessonId === (currentLesson.id || currentLesson._id))
                          }
                        >
                          {currentIndex === allLessons.length - 1 ? "Complete Journey" : "Mark Finalized"}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 h-fit sticky top-24">
            <Card className="border-border/50">
              <div className="p-4 border-b border-border/30 bg-muted/10 font-bold text-xs uppercase tracking-widest">Track Overview</div>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-6">
                    {course.modules?.map((mod: any, mIdx: number) => {
                      return (
                        <div key={mod.id || mod._id} className="space-y-2">
                          <h4 className="text-xs font-bold text-accent uppercase px-2">{mod.title}</h4>
                          <div className="space-y-1">
                            {mod.lessons?.map((les: any) => {
                              const lesId = les.id || les._id;
                              const isActive = lesId === activeLessonId;
                              const isComp = completedLessons.some((cl: any) => cl.lessonId === lesId);

                              const lIdx = allLessons.findIndex(l => (l.id || l._id) === lesId);
                              const prevLessons = allLessons.slice(0, lIdx);
                              const isLock = prevLessons.some(pl => !completedLessons.some((cl: any) => cl.lessonId === (pl.id || pl._id)));

                              return (
                                <button
                                  key={lesId}
                                  disabled={isLock}
                                  onClick={() => !isLock && setActiveLessonId(lesId)}
                                  className={`w-full text-left p-3 rounded-xl text-sm transition-all flex items-center gap-3 ${isActive ? 'bg-accent/10 border border-accent/20 text-accent font-bold' : isLock ? 'opacity-30 cursor-not-allowed grayscale pointer-events-none' : 'hover:bg-muted/10'}`}
                                >
                                  {isComp ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : isLock ? <Lock className="w-3.5 h-3.5" /> : React.createElement(getLessonIcon(les.type), { className: "w-3.5 h-3.5" })}
                                  <span className="truncate">{les.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
