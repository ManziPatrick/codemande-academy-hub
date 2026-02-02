import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/ui/text-editor";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Lock } from "lucide-react";
import { ManageQuestionsDialog } from "./ManageQuestionsDialog";
import { useAuth } from "@/contexts/AuthContext";

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any | null;
  trainers?: any[];
  onSave?: (course: any) => void;
}

export function EditCourseDialog({ open, onOpenChange, course, trainers = [], onSave }: EditCourseDialogProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    thumbnail: "",
    price: "0",
    discountPrice: "0",
    isFree: false,
    level: "Beginner",
    category: "Development",
    instructorId: "",
    status: "draft",
    modules: []
  });

  const [questionLesson, setQuestionLesson] = useState<{ id: string, title: string } | null>(null);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        price: course.price?.toString() || "0",
        discountPrice: course.discountPrice?.toString() || "0",
        isFree: course.price === 0,
        level: course.level || "Beginner",
        category: course.category || "Development",
        instructorId: course.instructor?.id || "",
        status: course.status || "draft",
        modules: course.modules || []
      });
    }
  }, [course]);

  const handleSave = () => {
    if (!course) return;
    
    const updatedCourse = {
      ...course,
      title: formData.title,
      description: formData.description,
      thumbnail: formData.thumbnail,
      price: formData.isFree ? 0 : parseFloat(formData.price) || 0,
      discountPrice: parseFloat(formData.discountPrice) || 0,
      level: formData.level,
      category: formData.category,
      instructorId: formData.instructorId,
      status: formData.status,
      modules: formData.modules.map((m: any) => ({
        title: m.title,
        description: m.description || "",
        lessons: m.lessons.map((l: any) => ({
            title: l.title,
            duration: Number(l.duration) || 0,
            videoUrl: l.videoUrl || "",
            fileUrl: l.fileUrl || "",
            type: l.type || "video",
            content: l.content || ""
        }))
      }))
    };
    
    onSave?.(updatedCourse);
    onOpenChange(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <div className="flex-1 px-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  Price ($) 
                  {!formData.isFree && isAdmin && <span className="text-[10px] text-accent font-normal">(Editable)</span>}
                  {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={formData.isFree || !isAdmin}
                  className={formData.isFree || !isAdmin ? "opacity-50" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  Discount Price ($)
                  {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
                </label>
                <Input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  disabled={!isAdmin}
                  className={!isAdmin ? "opacity-50" : ""}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/5 border border-accent/20 rounded-lg">
              <div>
                <p className="font-medium text-sm">Make Course Free</p>
                <p className="text-xs text-muted-foreground">Disables price and makes content public</p>
              </div>
              <Switch
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                Course Title
                {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={!isAdmin}
                className={!isAdmin ? "opacity-50" : ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Course Visibility</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      formData.status === 'published' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 
                      formData.status === 'archived' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                      'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    }`} />
                    <div>
                      <p className="font-semibold text-sm capitalize">{formData.status === 'published' ? 'Live' : formData.status}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formData.status === 'published' ? 'Visible to all students' : 
                         formData.status === 'archived' ? 'Hidden and locked' : 
                         'Visible only to staff'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant={formData.status === 'draft' ? 'gold' : 'outline'} 
                      size="sm" 
                      className="h-7 text-[10px] px-2"
                      onClick={() => setFormData({ ...formData, status: 'draft' })}
                    >
                      Draft
                    </Button>
                    <Button 
                      variant={formData.status === 'published' ? 'gold' : 'outline'} 
                      size="sm" 
                      className="h-7 text-[10px] px-2"
                      onClick={() => setFormData({ ...formData, status: 'published' })}
                    >
                      Live
                    </Button>
                    <Button 
                      variant={formData.status === 'archived' ? 'gold' : 'outline'} 
                      size="sm" 
                      className="h-7 text-[10px] px-2"
                      onClick={() => setFormData({ ...formData, status: 'archived' })}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                Description
                {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
              </label>
              <div className={!isAdmin ? "pointer-events-none opacity-50" : ""}>
                <TextEditor
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                  placeholder="Full course overview and curriculum details..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  Level
                  {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
                </label>
                <Input
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  disabled={!isAdmin}
                  className={!isAdmin ? "opacity-50" : ""}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  Category
                  {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={!isAdmin}
                  className={!isAdmin ? "opacity-50" : ""}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                Thumbnail URL
                {!isAdmin && <Lock className="w-3 h-3 text-muted-foreground" />}
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    disabled={!isAdmin}
                    className={!isAdmin ? "opacity-50" : ""}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Provide a direct link to the course cover image</p>
                </div>
                {formData.thumbnail && (
                  <div className={`w-20 h-20 rounded-lg border border-border overflow-hidden bg-muted flex-shrink-0 ${!isAdmin ? 'grayscale' : ''}`}>
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e: any) => e.target.src = "https://placehold.co/200x200?text=Invalid+Link"}
                    />
                  </div>
                )}
              </div>
            </div>
            {isAdmin && (
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1.5">
                  Assign Instructor
                </label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                >
                  <option value="">Select Instructor</option>
                  {trainers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.username} ({t.role})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Curriculum</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuestionLesson({ id: "", title: "Course Wide" })}
                  >
                    Manage Course Questions
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newModules = [...(formData.modules || []), { title: "New Module", lessons: [] }];
                      setFormData({ ...formData, modules: newModules });
                    }}
                  >
                    Add Module
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {formData.modules?.map((module: any, mIdx: number) => (
                  <div key={mIdx} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Input 
                          className="font-bold bg-background/50" 
                          placeholder="Module Title (e.g., Introduction)"
                          value={module.title}
                          onChange={(e) => {
                            const newModules = [...formData.modules];
                            newModules[mIdx] = { ...module, title: e.target.value };
                            setFormData({ ...formData, modules: newModules });
                          }}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive bg-destructive/5"
                          onClick={() => {
                            const newModules = formData.modules.filter((_: any, i: number) => i !== mIdx);
                            setFormData({ ...formData, modules: newModules });
                          }}
                        >
                          Remove Module
                        </Button>
                      </div>
                      <Input 
                        className="text-xs h-8"
                        placeholder="Module Description (optional)"
                        value={module.description || ""}
                        onChange={(e) => {
                          const newModules = [...formData.modules];
                          newModules[mIdx] = { ...module, description: e.target.value };
                          setFormData({ ...formData, modules: newModules });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-3 ml-4">
                      {module.lessons?.map((lesson: any, lIdx: number) => (
                        <div key={lIdx} className="p-3 bg-background/40 rounded-lg border border-border/30 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-accent border-accent/30">
                              L{lIdx + 1}
                            </Badge>
                            <Input 
                              placeholder="Lesson Title" 
                              className="h-8 text-sm flex-1 font-medium"
                              value={lesson.title}
                              onChange={(e) => {
                                const newModules = [...formData.modules];
                                const newLessons = [...module.lessons];
                                newLessons[lIdx] = { ...lesson, title: e.target.value };
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            />
                            <select
                              className="h-8 px-2 rounded-md border border-input bg-background text-[10px] font-bold uppercase"
                              value={lesson.type || "video"}
                              onChange={(e) => {
                                const newModules = [...formData.modules];
                                const newLessons = [...module.lessons];
                                newLessons[lIdx] = { ...lesson, type: e.target.value };
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            >
                              <option value="video">Video</option>
                              <option value="pdf">PDF</option>
                              <option value="ppt">PPT</option>
                              <option value="book">Book</option>
                              <option value="article">Article</option>
                              <option value="quiz">Quiz</option>
                            </select>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => {
                                const newModules = [...formData.modules];
                                const newLessons = module.lessons.filter((_: any, i: number) => i !== lIdx);
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            >
                              ×
                            </Button>
                          </div>

                          {/* Lesson Content Editor Toggle */}
                          <div className="px-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full h-7 text-[10px] justify-start font-bold text-muted-foreground hover:text-accent"
                              onClick={() => {
                                const newModules = [...formData.modules];
                                const newLessons = [...module.lessons];
                                newLessons[lIdx] = { ...lesson, _showEditor: !lesson._showEditor };
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            >
                              {lesson._showEditor ? "Hide Content Editor" : "Show Content Editor (Rich Text)"}
                            </Button>
                            {lesson._showEditor && (
                              <div className="mt-2">
                                <TextEditor 
                                  value={lesson.content || ""}
                                  onChange={(content) => {
                                    const newModules = [...formData.modules];
                                    const newLessons = [...module.lessons];
                                    newLessons[lIdx] = { ...lesson, content };
                                    newModules[mIdx] = { ...module, lessons: newLessons };
                                    setFormData({ ...formData, modules: newModules });
                                  }}
                                  placeholder="Write lesson instructions, reading material, or notes..."
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input 
                              placeholder="Video URL (YouTube/Vimeo)" 
                              className="h-7 text-[10px]"
                              value={lesson.videoUrl || ""}
                              onChange={(e) => {
                                const newModules = [...formData.modules];
                                const newLessons = [...module.lessons];
                                newLessons[lIdx] = { ...lesson, videoUrl: e.target.value };
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            />
                            <Input 
                              placeholder="File URL (PDF/PPT/Link)" 
                              className="h-7 text-[10px]"
                              value={lesson.fileUrl || ""}
                              onChange={(e) => {
                                const newModules = [...formData.modules];
                                const newLessons = [...module.lessons];
                                newLessons[lIdx] = { ...lesson, fileUrl: e.target.value };
                                newModules[mIdx] = { ...module, lessons: newLessons };
                                setFormData({ ...formData, modules: newModules });
                              }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground">Duration (min):</span>
                              <input 
                                type="number"
                                className="w-12 h-6 px-1 rounded border border-input bg-background text-[10px]"
                                value={lesson.duration || 0}
                                onChange={(e) => {
                                  const newModules = [...formData.modules];
                                  const newLessons = [...module.lessons];
                                  newLessons[lIdx] = { ...lesson, duration: parseInt(e.target.value) || 0 };
                                  newModules[mIdx] = { ...module, lessons: newLessons };
                                  setFormData({ ...formData, modules: newModules });
                                }}
                              />
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-[10px] text-accent hover:text-accent"
                              onClick={() => {
                                const lessonId = lesson.id || `${mIdx}-${lIdx}`;
                                setQuestionLesson({ id: lessonId, title: lesson.title });
                              }}
                            >
                              <HelpCircle className="w-3 h-3 mr-1" />
                              Questions
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-8 w-full border border-dashed border-border hover:bg-accent/5 hover:border-accent/30"
                        onClick={() => {
                          const newModules = [...formData.modules];
                          const newLessons = [...module.lessons, { title: "New Lesson", duration: 10, type: "video" }];
                          newModules[mIdx] = { ...module, lessons: newLessons };
                          setFormData({ ...formData, modules: newModules });
                        }}
                      >
                        + Add New Lesson to This Module
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-6 border-t border-border bg-background/50">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Discard Changes
          </Button>
          <Button variant="gold" className="flex-1 shadow-lg shadow-gold/20" onClick={handleSave}>
            Publish Curriculum Updates
          </Button>
        </div>
      </DialogContent>
      <ManageQuestionsDialog
        open={!!questionLesson}
        onOpenChange={(open) => !open && setQuestionLesson(null)}
        courseId={course.id}
        lessonId={questionLesson?.id}
        lessonTitle={questionLesson?.title}
      />
    </Dialog>
  );
}
