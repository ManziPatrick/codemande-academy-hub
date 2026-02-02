import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Users, Clock, DollarSign, Star } from "lucide-react";

interface ViewCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any | null;
}

export function ViewCourseDialog({ open, onOpenChange, course }: ViewCourseDialogProps) {
  if (!course) return null;

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            {course.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6 overflow-y-auto">
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground text-sm">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <Users className="w-4 h-4" />
                Students
              </div>
              <p className="font-semibold text-card-foreground">{course.studentsEnrolled?.length || 0}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <BookOpen className="w-4 h-4" />
                Lessons
              </div>
              <p className="font-semibold text-card-foreground">{totalLessons}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <DollarSign className="w-4 h-4" />
                Price
              </div>
              <p className="font-semibold text-card-foreground">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <Star className="w-4 h-4" />
                Level
              </div>
              <p className="font-semibold text-card-foreground">{course.level}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-card-foreground/70">Category</span>
              <span className="text-sm font-medium text-accent">{course.category}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div>
              <p className="text-sm text-card-foreground/60">Instructor</p>
              <p className="font-medium text-card-foreground">{course.instructor?.username}</p>
            </div>
            <Badge variant="default">
              Active
            </Badge>
          </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
