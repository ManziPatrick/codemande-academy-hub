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
    if (currentIndex === -1 && allLessons.length > 0) {
      const nextLesson = allLessons[1] || allLessons[0];
      setActiveLessonId(nextLesson.id || nextLesson._id);
      return;
    }
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      setActiveLessonId(nextLesson.id || nextLesson._id);
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
      // Optionally mark lesson as complete automatically on submission
      handleMarkComplete();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit assignment");
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleStartDiscussion = () => {
    toast.success("Opening discussion forum...");
  };

  const getLessonIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video": return Video;
      case "pdf": return FileText;
      case "ppt": return FileBox;
      case "book": return BookOpen;
      case "article": return FileText;
      case "quiz": return HelpCircle;
      case "challenge": return Code;
      case "project": return FolderOpen;
      case "assignment": return Code;
      default: return BookOpen;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <Link to="/portal/student/courses" className="hover:text-accent font-medium">
            My Tracks
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-semibold">{course.title}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-muted/10 rounded-2xl border border-border/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/50 shadow-xl">
              <img src={course.thumbnail} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-foreground">
                {course.title}
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest text-accent border-accent/20 px-2">
                  {course.level}
                </Badge>
                <p className="text-muted-foreground text-sm font-medium">
                  {completedCount} of {allLessons.length} units finalized
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-background/50 p-3 rounded-xl border border-border/30">
            <div className="text-right">
              <p className="text-2xl font-black text-accent">{progressPercent}%</p>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Current Mastery</p>
            </div>
            <div className="w-32 bg-muted/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="bg-accent h-full shadow-[0_0_10px_rgba(255,184,0,0.5)]"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {currentLesson?.type === 'quiz' ? (
              <Card className="border-border/50 overflow-hidden shadow-2xl">
                <div className="p-8 pb-12">
                  <LessonQuiz
                    courseId={courseId!}
                    lessonId={(currentLesson.id || currentLesson._id)}
                    onComplete={handleMarkComplete}
                  />
                </div>
              </Card>
            ) : (
              <Card className="border-border/50 overflow-hidden shadow-2xl group relative">
                <div className="aspect-video bg-gradient-to-br from-card to-accent/5 flex items-center justify-center relative overflow-hidden">
                  {currentLesson?.videoUrl ? (
                    <iframe
                      src={currentLesson.videoUrl.replace("watch?v=", "embed/")}
                      className="w-full h-full border-none shadow-inner"
                      allowFullScreen
                    />
                  ) : currentLesson?.fileUrl ? (
                    <div className="text-center p-12">
                      <div className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                        {React.createElement(getLessonIcon(currentLesson.type), { className: "w-10 h-10 text-accent" })}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{currentLesson.title}</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">This lesson contains document resources.</p>
                      <Button variant="gold" className="shadow-lg shadow-gold/20" asChild>
                        <a href={currentLesson.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" /> Open Lesson Document
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <div className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-accent" />
                      </div>
                      <p className="text-card-foreground font-bold text-lg">{currentLesson?.title}</p>
                      <p className="text-muted-foreground text-sm font-medium mt-2 italic">Reading Material Only</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-muted/20 p-1 rounded-xl h-12 border border-border/30">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:shadow-lg">Curriculum Guide</TabsTrigger>
                <TabsTrigger value="resources" className="rounded-lg data-[state=active]:shadow-lg">Learning Materials</TabsTrigger>
                <TabsTrigger value="discussion" className="rounded-lg data-[state=active]:shadow-lg">Academy Forum</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg data-[state=active]:shadow-lg">My Logic</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        {React.createElement(getLessonIcon(currentLesson?.type))}
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-bold text-foreground">
                          {currentLesson?.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                          Unit {currentIndex + 1} • {currentLesson?.type || 'Standard'} Experience
                        </p>
                      </div>
                    </div>

                    <div
                      className="prose prose-sm prose-invert max-w-none text-card-foreground/80 mb-8 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentLesson?.content || currentLesson?.description || "No specific instructions provided." }}
                    />

                    <div className="flex items-center gap-6 py-4 px-6 bg-muted/10 rounded-xl border border-border/30">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                        <Clock className="w-4 h-4 text-accent" />
                        {currentLesson?.duration || 0} Minutes
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                        <Users className="w-4 h-4 text-accent" />
                        Discussion Active
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1.5" />
                        Previous Block
                      </Button>

                      {(() => {
                        const isAssignment = currentLesson?.type === 'assignment' || currentLesson?.isAssignment;
                        const submission = (submissionsData as any)?.getAssignmentSubmissions?.[0];
                        const isPending = isAssignment && (!submission || submission.status === 'pending');
                        const isApproved = isAssignment && (submission?.status === 'reviewed' || submission?.status === 'graded');

                        if (isAssignment) {
                          if (!submission) {
                            return (
                              <Button variant="outline" className="px-8 border-accent text-accent" onClick={() => (document.querySelector('button[value="overview"]') as HTMLElement)?.click()}>
                                Submit Assignment to Continue
                              </Button>
                            );
                          } else if (submission.status === 'pending') {
                            return (
                              <Button variant="secondary" className="px-8" disabled>
                                <Clock className="w-4 h-4 mr-2" />
                                Waiting for Review
                              </Button>
                            );
                          }
                        }

                        return (
                          <Button variant="gold" className="px-8 shadow-lg shadow-gold/20" onClick={handleMarkComplete}>
                            {currentIndex === allLessons.length - 1 ? "Complete Track" : "Mark Complete & Continue"}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {currentLesson?.type === 'assignment' && (
                  <Card className="border-accent/20 bg-accent/5 backdrop-blur-sm overflow-hidden mt-6">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                          <Code className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-foreground">Exercise Submission</h3>
                          <p className="text-[10px] uppercase font-bold text-accent tracking-widest">Submit your daily work for review</p>
                        </div>
                      </div>

                      {currentLesson.assignmentDescription && (
                        <div className="bg-background/40 p-4 rounded-xl border border-accent/10">
                          <p className="text-xs font-bold text-accent uppercase mb-2">Instructions</p>
                          <p className="text-sm text-card-foreground/80 leading-relaxed text-secondary-foreground">{currentLesson.assignmentDescription}</p>

                          {currentLesson.assignmentDeliverables?.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Expected Deliverables:</p>
                              <div className="flex flex-wrap gap-2">
                                {currentLesson.assignmentDeliverables.map((d: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-[10px] border-accent/30 bg-accent/5">{d}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-4">
                        <textarea
                          className="w-full h-32 p-4 bg-background border border-accent/20 rounded-xl resize-none text-sm font-mono focus:ring-1 focus:ring-accent focus:border-accent"
                          placeholder="Paste your GitHub URL, Live Link, or notes here..."
                          value={submissionContent}
                          onChange={(e) => setSubmissionContent(e.target.value)}
                        />

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {(submissionsData as any)?.getAssignmentSubmissions?.[0] && (
                              <p className="text-xs font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Last submitted: {new Date(parseInt((submissionsData as any).getAssignmentSubmissions[0].createdAt)).toLocaleDateString()}
                              </p>
                            )}
                            {(submissionsData as any)?.getAssignmentSubmissions?.[0]?.grade !== undefined && (
                              <p className="text-sm font-bold text-gold">
                                Grade: {(submissionsData as any).getAssignmentSubmissions[0].grade}/100
                              </p>
                            )}
                          </div>
                          <Button
                            variant="gold"
                            className="px-8 shadow-lg shadow-gold/20"
                            onClick={handleSubmitAssignment}
                            disabled={isSubmittingAssignment || !submissionContent.trim()}
                          >
                            {isSubmittingAssignment ? "Submitting..." : "Submit Evolution"}
                          </Button>
                        </div>

                        {(submissionsData as any)?.getAssignmentSubmissions?.[0]?.feedback && (
                          <div className="mt-4 p-4 bg-muted/20 rounded-xl border border-border/30">
                            <p className="text-[10px] uppercase font-bold text-accent mb-1 flex items-center gap-1.5">
                              <MessageSquare className="w-3 h-3" /> Trainer Feedback
                            </p>
                            <p className="text-sm italic text-muted-foreground">"{(submissionsData as any).getAssignmentSubmissions[0].feedback}"</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="resources">
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <h3 className="font-heading text-lg font-bold text-card-foreground mb-6">Linked Resources</h3>
                    {currentLesson?.fileUrl ? (
                      <div className="flex items-center justify-between p-4 bg-muted/10 rounded-xl border border-border/30">
                        <div className="flex items-center gap-4">
                          <FileText className="w-5 h-5 text-accent" />
                          <p className="text-sm font-bold">Lesson Material</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={currentLesson.fileUrl} target="_blank" rel="noopener noreferrer"><Download className="w-4 h-4" /></a>
                        </Button>
                      </div>
                    ) : <p className="text-center py-12 text-muted-foreground italic">No additional resources.</p>}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm p-12 text-center">
                  <MessageSquare className="w-10 h-10 text-accent/50 mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-3">Academy Forum</h3>
                  <Button variant="gold" onClick={handleStartDiscussion}>Access Agora Forum</Button>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <Card className="border-border/50 bg-background/50 backdrop-blur-sm p-8">
                  <textarea
                    placeholder="Write notes..."
                    className="w-full h-48 p-4 bg-background border border-border/50 rounded-2xl resize-none text-sm font-mono"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <Button variant="gold" onClick={handleSaveNotes}>Save Evolution</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Curriculum Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4"
          >
            <Card className="border-border/50 bg-background/50 backdrop-blur-sm sticky top-24 shadow-2xl overflow-hidden">
              <div className="p-4 bg-accent/20 border-b border-border/30 flex justify-between items-center">
                <span className="text-[10px] uppercase font-black tracking-widest text-accent">Blueprint</span>
                <Badge variant="secondary" className="bg-background/80 text-[10px]">{allLessons.length} UNITS</Badge>
              </div>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <div className="p-4 space-y-6">
                    {course.modules?.map((module: any, mIdx: number) => (
                      <div key={module.id || mIdx} className="space-y-3">
                        <div className="px-2 border-l-2 border-accent/20 ml-1">
                          <h4 className="text-sm font-bold">{module.title}</h4>
                        </div>
                        <ul className="space-y-1">
                          {module.lessons?.map((lesson: any, lIdx: number) => {
                            const LessonIcon = getLessonIcon(lesson.type);
                            const lessonId = lesson.id || lesson._id;
                            const isActive = lessonId === activeLessonId;
                            const isCompleted = completedLessons.some((cl: any) => cl.courseId === courseId && cl.lessonId === lessonId);

                            return (
                              <li key={lessonId || lIdx}>
                                <button
                                  onClick={() => setActiveLessonId(lessonId)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all group ${isActive ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/10"
                                    }`}
                                >
                                  {isCompleted ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <LessonIcon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : ''}`} />}
                                  <div className="flex-1 truncate">
                                    <p className={`truncate font-semibold ${isActive ? 'text-accent' : ''}`}>{lesson.title}</p>
                                    <span className="text-[8px] opacity-50 uppercase font-bold">{lesson.type || 'Video'} • {lesson.duration || 0}m</span>
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 bg-muted/5 border-t border-border/30 space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => setHelpOpen(true)}>Help Request</Button>
                  <Button variant="gold" className="w-full" onClick={() => setBookingOpen(true)}>Schedule Call</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <RequestHelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        context={course.title}
        lessonTitle={currentLesson?.title}
      />

      <BookCallDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        mentorName={course.instructor?.username}
        mentorId={course.instructor?.id}
        purpose={`Lesson Help: ${currentLesson?.title}`}
      />
    </PortalLayout>
  );
}
