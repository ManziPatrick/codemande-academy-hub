import { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen, CheckCircle, Clock, User, Calendar, ExternalLink, MessageSquare } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ASSIGNMENT_SUBMISSIONS } from "@/lib/graphql/queries";
import { GRADE_ASSIGNMENT } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AssignmentSubmission {
    id: string;
    userId: string;
    user: {
        id: string;
        username: string;
        fullName?: string;
        avatar?: string;
    };
    courseId: string;
    lessonId: string;
    content: string;
    status: string;
    grade?: number;
    feedback?: string;
    createdAt: string;
}

interface GetAssignmentSubmissionsData {
    getAssignmentSubmissions: AssignmentSubmission[];
}

export default function TrainerProjects() {
    const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
    const [gradeValue, setGradeValue] = useState("");
    const [feedbackValue, setFeedbackValue] = useState("");

    const { data, loading, refetch } = useQuery<GetAssignmentSubmissionsData>(GET_ASSIGNMENT_SUBMISSIONS);
    const [gradeAssignmentMutation, { loading: grading }] = useMutation(GRADE_ASSIGNMENT);

    const submissions = data?.getAssignmentSubmissions || [];
    const pendingSubmissions = submissions.filter((s: AssignmentSubmission) => s.status === "pending");
    const gradedSubmissions = submissions.filter((s: AssignmentSubmission) => s.status === "reviewed" || s.status === "graded" || s.status === "revision_requested");

    const handleGrade = async () => {
        if (!selectedSubmission || !gradeValue) {
            toast.error("Please enter a grade");
            return;
        }

        const grade = parseInt(gradeValue);
        if (isNaN(grade) || grade < 0 || grade > 100) {
            toast.error("Grade must be between 0 and 100");
            return;
        }

        try {
            const result = await gradeAssignmentMutation({
                variables: {
                    submissionId: selectedSubmission.id,
                    grade,
                    feedback: feedbackValue
                },
                // Update the cache to reflect the changes immediately
                refetchQueries: [{ query: GET_ASSIGNMENT_SUBMISSIONS }],
                awaitRefetchQueries: true
            });

            toast.success("Assignment graded successfully!");

            // Refetch to ensure we have the latest data
            await refetch();

            // Reset form state
            setSelectedSubmission(null);
            setGradeValue("");
            setFeedbackValue("");
        } catch (err: any) {
            console.error("Grading error:", err);
            toast.error(err.message || "Failed to grade assignment");
        }
    };

    if (loading) {
        return (
            <PortalLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Student Assignments</h1>
                        <p className="text-muted-foreground mt-1">Review and grade student submissions</p>
                    </div>
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        {pendingSubmissions.length} Pending
                    </Badge>
                </motion.div>

                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList className="bg-muted/20 p-1 rounded-xl h-12 border border-border/30">
                        <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            Pending Review ({pendingSubmissions.length})
                        </TabsTrigger>
                        <TabsTrigger value="graded" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            Graded ({gradedSubmissions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        {pendingSubmissions.length === 0 ? (
                            <Card className="border-border/50">
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                                    <p className="text-muted-foreground">All caught up! No pending submissions.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-6">
                                <ScrollArea className="h-[calc(100vh-300px)]">
                                    <div className="space-y-4 pr-4">
                                        {pendingSubmissions.map((submission: AssignmentSubmission) => (
                                            <Card
                                                key={submission.id}
                                                className={`cursor-pointer transition-all hover:border-accent/50 ${selectedSubmission?.id === submission.id ? "border-accent bg-accent/5" : "border-border/50"
                                                    }`}
                                                onClick={() => setSelectedSubmission(submission)}
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                                <User className="w-5 h-5 text-accent" />
                                                            </div>
                                                            <div>
                                                                <CardTitle className="text-base">{submission.user?.fullName || submission.user?.username}</CardTitle>
                                                                <p className="text-xs text-muted-foreground">Lesson ID: {submission.lessonId}</p>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Pending
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(parseInt(submission.createdAt)).toLocaleDateString()}
                                                    </div>
                                                    <p className="text-sm line-clamp-2 text-muted-foreground">{submission.content}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <Card className="border-border/50 sticky top-6">
                                    <CardHeader className="border-b border-border/30">
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-accent" />
                                            Grade Submission
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {selectedSubmission ? (
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold">Student</label>
                                                    <p className="text-lg">{selectedSubmission.user?.fullName || selectedSubmission.user?.username}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold">Submission Content</label>
                                                    <div className="p-4 bg-muted/20 rounded-lg border border-border/30">
                                                        <p className="text-sm font-mono whitespace-pre-wrap">{selectedSubmission.content}</p>
                                                        {selectedSubmission.content.startsWith("http") && (
                                                            <Button variant="ghost" size="sm" className="mt-2" asChild>
                                                                <a href={selectedSubmission.content} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                                    Open Link
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold">Grade (0-100)</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="Enter grade..."
                                                        value={gradeValue}
                                                        onChange={(e) => setGradeValue(e.target.value)}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold">Feedback (Optional)</label>
                                                    <Textarea
                                                        placeholder="Provide constructive feedback..."
                                                        value={feedbackValue}
                                                        onChange={(e) => setFeedbackValue(e.target.value)}
                                                        rows={4}
                                                    />
                                                </div>

                                                <Button
                                                    variant="gold"
                                                    className="w-full shadow-lg shadow-gold/20"
                                                    onClick={handleGrade}
                                                    disabled={grading || !gradeValue}
                                                >
                                                    {grading ? "Submitting..." : "Submit Grade"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                                <p>Select a submission to grade</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="graded" className="space-y-4">
                        {gradedSubmissions.length === 0 ? (
                            <Card className="border-border/50">
                                <CardContent className="p-12 text-center">
                                    <p className="text-muted-foreground">No graded submissions yet.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gradedSubmissions.map((submission: AssignmentSubmission) => (
                                    <Card key={submission.id} className="border-border/50">
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-accent" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base">{submission.user?.fullName || submission.user?.username}</CardTitle>
                                                        <p className="text-xs text-muted-foreground">Lesson: {submission.lessonId}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                                                    {submission.grade}/100
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {submission.feedback && (
                                                <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                                                    <p className="text-xs font-bold text-accent mb-1">Feedback</p>
                                                    <p className="text-sm italic text-muted-foreground">"{submission.feedback}"</p>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(parseInt(submission.createdAt)).toLocaleDateString()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </PortalLayout>
    );
}
