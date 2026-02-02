import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Clock, CheckCircle, Target } from "lucide-react";

interface ViewProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  progress: number;
  type: "mentorship" | "internship";
}

export function ViewProgressDialog({ open, onOpenChange, studentName, progress, type }: ViewProgressDialogProps) {
  const milestones = type === "internship" 
    ? [
        { title: "Week 1: Orientation", completed: progress >= 10 },
        { title: "Week 2-3: Training", completed: progress >= 30 },
        { title: "Week 4-6: Project Work", completed: progress >= 50 },
        { title: "Week 7-9: Advanced Tasks", completed: progress >= 75 },
        { title: "Week 10-12: Final Review", completed: progress >= 100 },
      ]
    : [
        { title: "Foundation Course", completed: progress >= 20 },
        { title: "Intermediate Skills", completed: progress >= 40 },
        { title: "Advanced Topics", completed: progress >= 60 },
        { title: "Project Completion", completed: progress >= 80 },
        { title: "Ready for Internship", completed: progress >= 100 },
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            {studentName}'s Progress
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-card-foreground/70">Overall Progress</span>
              <span className="text-lg font-bold text-accent">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <Calendar className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xs text-card-foreground/60">Started</p>
              <p className="text-sm font-medium text-card-foreground">Jan 15</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xs text-card-foreground/60">Duration</p>
              <p className="text-sm font-medium text-card-foreground">3 months</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg text-center">
              <Target className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-xs text-card-foreground/60">Status</p>
              <Badge className="mt-1 text-xs">On Track</Badge>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-3">Milestones</h4>
            <div className="space-y-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    milestone.completed ? "bg-green-500/10" : "bg-background/50"
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 ${
                      milestone.completed ? "text-green-400" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      milestone.completed
                        ? "text-card-foreground"
                        : "text-card-foreground/60"
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
