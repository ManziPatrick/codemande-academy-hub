import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Stars, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { GRADE_PROJECT } from "@/lib/graphql/mutations";

interface GradeProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: {
        id: string;
        title: string;
        grade?: string;
        feedback?: string;
        submissionUrl?: string;
    } | null;
    refetch: () => void;
}

export function GradeProjectDialog({ open, onOpenChange, project, refetch }: GradeProjectDialogProps) {
    const [grade, setGrade] = useState("");
    const [feedback, setFeedback] = useState("");

    const [gradeProjectMutation, { loading }] = useMutation(GRADE_PROJECT, {
        onCompleted: () => {
            toast.success("Project graded successfully!");
            refetch();
            onOpenChange(false);
        },
        onError: (err) => {
            toast.error(err.message || "Failed to grade project");
        }
    });

    useEffect(() => {
        if (project) {
            setGrade(project.grade || "");
            setFeedback(project.feedback || "");
        }
    }, [project]);

    const handleSubmit = async () => {
        if (!project) return;
        if (!grade) {
            toast.error("Please provide a grade");
            return;
        }

        try {
            await gradeProjectMutation({
                variables: {
                    id: project.id,
                    grade,
                    feedback
                }
            });
        } catch (error) {
            console.error("Grading error:", error);
        }
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Stars className="w-5 h-5 text-gold" />
                        Grade Project
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Project</p>
                        <p className="font-bold text-lg">{project.title}</p>
                    </div>

                    {project.submissionUrl && (
                        <div className="p-3 bg-muted/20 rounded-lg border border-border/30">
                            <p className="text-xs font-bold text-accent uppercase mb-1">Student Submission</p>
                            <a
                                href={project.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline flex items-center gap-2"
                            >
                                View Repository / Work <AlertCircle className="w-3 h-3" />
                            </a>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold">Grade (e.g. 95/100, A+, Excellent)</label>
                        <Input
                            placeholder="Enter grade..."
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="bg-muted/10 border-border/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-accent" />
                            Feedback for Student
                        </label>
                        <Textarea
                            placeholder="Provide constructive feedback..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="min-h-[120px] bg-muted/10 border-border/50"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="gold"
                            className="flex-1 shadow-lg shadow-gold/20"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Finalize Grade
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

