import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Target, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  TrendingUp,
  Shield
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MyInternshipDashboardProps {
  team: any;
  loading: boolean;
}

export function MyInternshipDashboard({ team, loading }: MyInternshipDashboardProps) {
  if (loading) {
    return <div className="flex items-center justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>;
  }

  if (!team) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Internship</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            You haven't been assigned to an internship team yet. Check the "Available Tracks" tab to apply, 
            or wait for admin approval if you've already submitted an application.
          </p>
          <Button variant="gold">Browse Programs</Button>
        </CardContent>
      </Card>
    );
  }

  const project = team.internshipProject;
  const milestones = project?.milestones || [];
  const completedMilestones = milestones.filter((m: any) => m.completed).length;
  const progressPercentage = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Team Overview Card */}
      <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-background overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="gold" className="mb-3">Active Internship</Badge>
              <CardTitle className="text-2xl font-heading">{team.name}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {project?.title || 'Project assignment pending'}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {team.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-accent" />
                <p className="text-xs uppercase font-bold text-muted-foreground">Mentor</p>
              </div>
              <p className="text-lg font-semibold">{team.mentor?.username || 'Not Assigned'}</p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-accent" />
                <p className="text-xs uppercase font-bold text-muted-foreground">Team Size</p>
              </div>
              <p className="text-lg font-semibold">{team.members?.length || 0} Members</p>
            </div>

            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <p className="text-xs uppercase font-bold text-muted-foreground">Progress</p>
              </div>
              <p className="text-lg font-semibold">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details & Milestones */}
      {project && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No milestones defined yet. Your mentor will set these up soon.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-semibold">{completedMilestones} / {milestones.length}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      {milestones.map((milestone: any, idx: number) => {
                        const isPast = new Date(milestone.deadline) < new Date();
                        const isCompleted = milestone.completed;
                        
                        return (
                          <div 
                            key={milestone.id} 
                            className={`p-4 rounded-lg border transition-all ${
                              isCompleted 
                                ? 'bg-green-500/5 border-green-500/20' 
                                : isPast 
                                ? 'bg-destructive/5 border-destructive/20' 
                                : 'bg-muted/30 border-border/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">{milestone.title}</h4>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    Due: {new Date(milestone.deadline).toLocaleDateString()}
                                    {isPast && !isCompleted && (
                                      <Badge variant="destructive" className="text-[10px] ml-2">Overdue</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {!isCompleted && (
                                <Button size="sm" variant="outline" className="gap-2">
                                  <Upload className="w-3 h-3" />
                                  Submit
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Members Sidebar */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {team.members.map((member: any) => (
                  <div 
                    key={member.id} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-sm font-bold text-accent">
                      {member.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.user.username}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Clock className="w-4 h-4" />
                  Log Time
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Upload className="w-4 h-4" />
                  Submit Work
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4" />
                  Team Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
