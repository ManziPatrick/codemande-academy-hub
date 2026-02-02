import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Pencil } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_QUESTIONS } from "@/lib/graphql/queries";
import { CREATE_QUESTION, UPDATE_QUESTION, DELETE_QUESTION } from "@/lib/graphql/mutations";
import { toast } from "sonner";

interface ManageQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
}

export function ManageQuestionsDialog({ 
  open, 
  onOpenChange, 
  courseId, 
  lessonId, 
  lessonTitle 
}: ManageQuestionsDialogProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    explanation: ""
  });

  const { data, loading, refetch } = useQuery(GET_QUESTIONS, {
    variables: { courseId, lessonId },
    skip: !open || !courseId
  });

  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [deleteQuestion] = useMutation(DELETE_QUESTION);

  const questions = (data as any)?.questions || [];

  const handleSave = async () => {
    if (!formData.questionText || formData.options.some(o => !o)) {
      toast.error("Please fill in the question and all options");
      return;
    }

    try {
      if (editingId) {
        await updateQuestion({
          variables: {
            id: editingId,
            ...formData
          }
        });
        toast.success("Question updated!");
      } else {
        await createQuestion({
          variables: {
            courseId,
            lessonId: lessonId || null,
            ...formData
          }
        });
        toast.success("Question added!");
      }
      
      setFormData({ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" });
      setIsAdding(false);
      setEditingId(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save question");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion({ variables: { id } });
      toast.success("Question deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete question");
    }
  };

  const startEdit = (q: any) => {
    setFormData({
      questionText: q.questionText,
      options: [...q.options],
      correctOptionIndex: q.correctOptionIndex,
      explanation: q.explanation || ""
    });
    setEditingId(q.id);
    setIsAdding(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>
            Manage Questions {lessonTitle ? `- ${lessonTitle}` : ""}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="py-4 space-y-6">
            {isAdding ? (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4">
                <h4 className="font-medium text-sm">
                  {editingId ? "Edit Question" : "Add New Question"}
                </h4>
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Question Text *</label>
                  <Input 
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    placeholder="Enter the question here..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formData.options.map((opt, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium">Option {i + 1} *</label>
                        <button 
                          onClick={() => setFormData({ ...formData, correctOptionIndex: i })}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            formData.correctOptionIndex === i 
                              ? "bg-green-500/20 text-green-400 border-green-500/50" 
                              : "text-muted-foreground border-transparent hover:border-border"
                          }`}
                        >
                          {formData.correctOptionIndex === i ? "Correct Answer" : "Mark as Correct"}
                        </button>
                      </div>
                      <Input 
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[i] = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        placeholder={`Option ${i + 1}...`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block">Explanation (Optional)</label>
                  <Input 
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Why is this the correct answer?"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="gold" size="sm" className="flex-1" onClick={handleSave}>
                    {editingId ? "Update Question" : "Save Question"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full border-dashed py-8 border-2"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="w-5 h-5 mr-2" /> Add Your First Question
              </Button>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                Existing Questions
                <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {questions.length}
                </span>
              </h3>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 rounded-xl border border-dashed">
                  <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No questions set yet for this {lessonId ? "lesson" : "course"}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q: any, idx: number) => (
                    <div 
                      key={q.id} 
                      className="p-4 bg-card border border-border/50 rounded-xl hover:shadow-card transition-all group"
                    >
                      <div className="flex justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1 block">Question {idx + 1}</span>
                          <h4 className="font-medium text-card-foreground leading-snug">{q.questionText}</h4>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(q)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(q.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt: string, i: number) => (
                          <div 
                            key={i} 
                            className={`text-xs p-2 rounded-lg border flex items-center gap-2 ${
                              i === q.correctOptionIndex 
                                ? "bg-green-500/10 border-green-500/30 text-green-400" 
                                : "bg-muted/30 border-transparent text-muted-foreground"
                            }`}
                          >
                            {i === q.correctOptionIndex && <CheckCircle2 className="w-3 h-3" />}
                            <span className="truncate">{opt}</span>
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <div className="text-[10px] text-muted-foreground bg-muted/20 p-2 rounded italic">
                          Explanation: {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/10">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
