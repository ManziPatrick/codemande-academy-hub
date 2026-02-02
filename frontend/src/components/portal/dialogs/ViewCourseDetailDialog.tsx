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
      <DialogContent className="max-w-lg">
        <DialogHeader>
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
        
        <div className="space-y-4 mt-4">
          {/* Description */}
          <p className="text-muted-foreground">{course.description}</p>

          {/* Progress (if enrolled) */}
          {isEnrolled && course.progress !== undefined && (
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                  {course.progress}% Complete
                </Badge>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <BookOpen className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium">{course.totalLessons}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium">{course.duration}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <Star className="w-5 h-5 fill-accent text-accent mx-auto mb-1" />
              <p className="text-sm font-medium">{course.rating}</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <Users className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-sm font-medium">{course.students}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
          </div>

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

          {/* Actions */}
          <div className="flex gap-2 pt-2">
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
