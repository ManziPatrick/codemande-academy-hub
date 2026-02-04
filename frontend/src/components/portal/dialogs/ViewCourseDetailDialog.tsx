import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Star, Award, PlayCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  description: string;
  progress?: number;
  totalLessons: number;
  completedLessons?: number;
  duration: string;
  instructor: string;
  rating: number;
  students: number;
  status?: string;
}

interface ViewCourseDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
}

export function ViewCourseDetailDialog({ open, onOpenChange, course }: ViewCourseDetailDialogProps) {
  if (!course) return null;

  const isEnrolled = course.progress !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{course.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">by {course.instructor}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
          <div className="space-y-4 py-4">
            {/* Description */}
            <p className="text-muted-foreground">{course.description}</p>
...
            {/* Course Highlights */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">What You'll Learn</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Industry-relevant skills and best practices
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Hands-on projects with real-world applications
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  Certificate upon successful completion
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-muted/5">
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {isEnrolled ? (
              <Link to={`/portal/student/courses/${course.id}`} className="flex-1">
                <Button variant="gold" className="w-full" onClick={() => onOpenChange(false)}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Button variant="gold" className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Enroll Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
