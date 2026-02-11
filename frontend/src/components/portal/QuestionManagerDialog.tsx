import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2, HelpCircle, FileQuestion } from "lucide-react";
import { QuestionEditor } from "./QuestionEditor";
import { DeleteConfirmDialog } from "./dialogs"; // Assuming this exists or I'll use generic
import { toast } from "sonner";

const GET_COURSE_QUESTIONS = gql`
  query GetCourseQuestions($courseId: ID!) {
    getCourseQuestions(courseId: $courseId) {
      id
      questionText
      options
      correctOptionIndex
      explanation
    }
  }
`;

const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: ID!) {
    deleteQuestion(id: $id)
  }
`;

interface CourseQuestionsData {
    getCourseQuestions: Array<{
        id: string;
        questionText: string;
        options: string[];
        correctOptionIndex: number;
        explanation?: string;
    }>;
}

interface QuestionManagerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    course: any;
}

export function QuestionManagerDialog({ isOpen, onClose, course }: QuestionManagerDialogProps) {
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [deletingQuestion, setDeletingQuestion] = useState<any>(null);

    const { data, loading, refetch } = useQuery<CourseQuestionsData>(GET_COURSE_QUESTIONS, {
        variables: { courseId: course?.id },
        skip: !course?.id,
        fetchPolicy: "network-only"
    });

    const [deleteQuestion] = useMutation(DELETE_QUESTION, {
        onCompleted: () => {
            toast.success("Question deleted successfully");
            refetch();
            setDeletingQuestion(null);
        },
        onError: (err) => toast.error(err.message)
    });

    const questions = data?.getCourseQuestions || [];

    const handleCreate = () => {
        setEditingQuestion(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (question: any) => {
        setEditingQuestion(question);
        setIsEditorOpen(true);
    };

    const handleDelete = (question: any) => {
        if (confirm("Are you sure you want to delete this question?")) {
            deleteQuestion({ variables: { id: question.id } });
        }
    };

    if (!course) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex justify-between items-center text-xl">
                        <span>Questions for {course.title}</span>
                        <Button onClick={handleCreate} className="bg-accent hover:bg-accent/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar bg-muted/5">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-xl">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileQuestion className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground">No questions yet</h3>
                            <p className="text-muted-foreground mb-4">Create questions to test student knowledge</p>
                            <Button variant="outline" onClick={handleCreate}>
                                Create First Question
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((q: any, index: number) => (
                                <Card key={q.id} className="group hover:border-accent/40 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className="bg-background">Q{index + 1}</Badge>
                                                    <h4 className="font-medium text-foreground">{q.questionText}</h4>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pl-2 border-l-2 border-border/50">
                                                    {q.options.map((opt: string, i: number) => (
                                                        <div key={i} className={`text-sm px-2 py-1 rounded ${i === q.correctOptionIndex ? "bg-green-500/10 text-green-600 font-medium" : "text-muted-foreground"}`}>
                                                            {String.fromCharCode(65 + i)}. {opt}
                                                            {i === q.correctOptionIndex && <span className="ml-2 text-xs">✓</span>}
                                                        </div>
                                                    ))}
                                                </div>

                                                {q.explanation && (
                                                    <div className="mt-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded flex gap-2">
                                                        <HelpCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                                        <span><span className="font-medium">Explanation:</span> {q.explanation}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(q)}>
                                                    <Edit2 className="w-4 h-4 text-muted-foreground hover:text-accent" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(q)}>
                                                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <QuestionEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    courseId={course.id}
                    questionToEdit={editingQuestion}
                    onSuccess={refetch}
                />
            </DialogContent>
        </Dialog>
    );
}
