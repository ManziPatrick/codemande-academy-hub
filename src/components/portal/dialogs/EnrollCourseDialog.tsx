import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { BookOpen, Clock, Users, Star, CheckCircle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  totalLessons: number;
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  price: string;
  isFree: boolean;
  freeTrialLessons: number;
}

interface EnrollCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function EnrollCourseDialog({ open, onOpenChange, course }: EnrollCourseDialogProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  if (!course) return null;

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setIsEnrolling(false);
      toast.success(`Successfully enrolled in ${course.title}!`);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Enroll in Course</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-card-foreground">{course.title}</h3>
                <p className="text-sm text-card-foreground/60 mt-1">{course.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <BookOpen className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium text-card-foreground">{course.totalLessons}</p>
              <p className="text-xs text-card-foreground/60">Lessons</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium text-card-foreground">{course.duration}</p>
              <p className="text-xs text-card-foreground/60">Duration</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <Star className="w-5 h-5 fill-accent text-accent mx-auto mb-1" />
              <p className="text-sm font-medium text-card-foreground">{course.rating}</p>
              <p className="text-xs text-card-foreground/60">Rating</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <span className="text-sm text-card-foreground/70">Instructor</span>
            <span className="font-medium text-card-foreground">{course.instructor}</span>
          </div>

          {course.isFree ? (
            <div className="p-3 bg-green-500/10 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400">This course is completely free!</span>
            </div>
          ) : (
            <div className="p-4 border border-accent/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-card-foreground/70">Course Price</span>
                <span className="text-xl font-bold text-accent">{course.price}</span>
              </div>
              <p className="text-xs text-card-foreground/60">
                Includes {course.freeTrialLessons} free trial lessons
              </p>
            </div>
          )}

          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleEnroll} disabled={isEnrolling}>
            {isEnrolling ? "Enrolling..." : course.isFree ? "Enroll Free" : "Enroll Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
