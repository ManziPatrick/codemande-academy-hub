import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Users,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Briefcase,
  FileCode,
  Layers,
  Loader2,
} from "lucide-react";
import { TeamChatDialog } from "@/components/portal/dialogs/TeamChatDialog";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_MENTEES } from "@/lib/graphql/queries";
import { ADD_INTERNSHIP_TASK, UPDATE_INTERNSHIP_TASK } from "@/lib/graphql/mutations";

export default function TrainerMentorship() {
  const { data, loading, refetch } = useQuery(GET_MY_MENTEES);
  const mentees = (data as any)?.myMentees || [];

  const [selectedMentee, setSelectedMentee] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskManagerOpen, setTaskManagerOpen] = useState<string | null>(null);
  const [activeChatProject, setActiveChatProject] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const [addTask] = useMutation(ADD_INTERNSHIP_TASK, {
    onCompleted: () => {
      toast.success("Task added successfully!");
      setNewTaskTitle("");
      refetch();
    },
    onError: (err) => toast.error(err.message)
  });

  const [updateTask] = useMutation(UPDATE_INTERNSHIP_TASK, {
    onCompleted: () => {
      toast.success("Task updated!");
      refetch();
    },
    onError: (err) => toast.error(err.message)
  });

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  const handleAddTask = async (internshipId: string) => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }
    
    await addTask({
      variables: {
        internshipId,
        title: newTaskTitle,
        priority: "medium"
      }
    });
  };

  const handleToggleTask = async (internshipId: string, taskId: string, currentStatus: string) => {
    await updateTask({
      variables: {
        internshipId,
        taskId,
        status: currentStatus === "completed" ? "pending" : "completed"
      }
    });
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Mentorship Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and guide your assigned interns through their journey
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-accent/20 text-accent border-0">
              <Users className="w-3 h-3 mr-1" />
              {mentees.length} Mentees
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-0">
              <Briefcase className="w-3 h-3 mr-1" />
              {mentees.filter((m: any) => m.status === "in_progress" || m.status === "enrolled").length} Active
            </Badge>
          </div>
        </motion.div>

        {mentees.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-20 text-center">
              <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-heading text-xl font-medium mb-2">No Mentees Assigned Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don't have any interns assigned to you yet. Once an admin assigns students to your mentorship, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Mentees List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4"
            >
              {mentees.map((mentee: any) => (
                <Card
                  key={mentee.id}
                  className={`border-border/50 cursor-pointer transition-all hover:shadow-lg hover:border-accent/40 ${
                    selectedMentee === mentee.id ? "ring-2 ring-accent shadow-lg" : ""
                  }`}
                  onClick={() => setSelectedMentee(mentee.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-accent/10">
                        <AvatarFallback className="bg-accent/20 text-accent font-bold">
                          {getInitials(mentee.user?.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-card-foreground">
                              {mentee.user?.username}
                            </h4>
                            <p className="text-sm text-card-foreground/60">
                              {mentee.title}
                            </p>
                          </div>
                          <Badge
                            className={
                              mentee.status === "graduated"
                                ? "bg-green-500/20 text-green-400 border-none"
                                : mentee.status === "in_progress" || mentee.status === "enrolled"
                                ? "bg-blue-500/20 text-blue-400 border-none"
                                : "bg-accent/20 text-accent border-none"
                            }
                          >
                            {mentee.status === "graduated" ? "Graduated" : 
                             mentee.status === "in_progress" ? "In Progress" :
                             mentee.status === "enrolled" ? "Enrolled" : "Eligible"}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-card-foreground/60">Progress</span>
                            <span className="text-accent font-medium">{mentee.progress}%</span>
                          </div>
                          <Progress value={mentee.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-card-foreground/60">
                              <Layers className="w-3 h-3 text-accent" />
                              {mentee.stage}
                            </span>
                            <span className="flex items-center gap-1 text-card-foreground/60">
                              <FileCode className="w-3 h-3 text-accent" />
                              {mentee.tasks?.filter((t: any) => t.status === "completed").length || 0}/{mentee.tasks?.length || 0} Tasks
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}</motion.div>

            {/* Mentee Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {selectedMentee ? (
                <Card className="border-border/50 sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading">Intern Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const mentee = mentees.find((m: any) => m.id === selectedMentee);
                      if (!mentee) return null;
                      return (
                        <>
                          <div className="text-center mb-4">
                            <Avatar className="w-16 h-16 mx-auto mb-2 ring-4 ring-accent/10">
                              <AvatarFallback className="bg-accent/20 text-accent text-lg font-bold">
                                {getInitials(mentee.user?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <h4 className="font-medium text-card-foreground">{mentee.user?.username}</h4>
                            <p className="text-sm text-card-foreground/60">{mentee.user?.email}</p>
                          </div>

                          <div className="space-y-3">
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold uppercase text-muted-foreground">Current Stage</span>
                                <Badge variant="outline" className="text-[10px] bg-accent/5 text-accent border-accent/20">
                                  Stage {mentee.currentStage}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">{mentee.stage}</p>
                            </div>

                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase text-muted-foreground">Program Details</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Duration:</span>
                                  <span className="font-medium">{mentee.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className="font-medium">{mentee.type}</span>
                                </div>
                                {mentee.cohort && (
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cohort:</span>
                                    <span className="font-medium">{mentee.cohort}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Tabs defaultValue="tasks" className="w-full">
                              <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="tasks" className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium text-card-foreground flex items-center gap-2">
                                    <FileCode className="w-4 h-4 text-accent" />
                                    Task Management
                                  </h5>
                                  <Badge variant="outline" className="text-[10px]">
                                    {mentee.tasks?.filter((t: any) => t.status === "completed").length || 0}/{mentee.tasks?.length || 0}
                                  </Badge>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="New task title..."
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddTask(mentee.id)}
                                    className="text-sm"
                                  />
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleAddTask(mentee.id)}
                                  >
                                    Add
                                  </Button>
                                </div>

                                <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                                  {mentee.tasks?.map((task: any) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center justify-between p-2 bg-muted/20 rounded border border-border/50 group hover:border-accent/30 transition-all"
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div
                                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${
                                            task.status === "completed"
                                              ? "bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"
                                              : "border-muted-foreground/30 hover:border-accent"
                                          }`}
                                          onClick={() => handleToggleTask(mentee.id, task.id, task.status)}
                                        >
                                          {task.status === "completed" && <CheckCircle className="w-3 h-3 text-white" />}
                                        </div>
                                        <span
                                          className={`text-sm ${
                                            task.status === "completed"
                                              ? "line-through text-muted-foreground"
                                              : "text-foreground font-medium"
                                          }`}
                                        >
                                          {task.title}
                                        </span>
                                      </div>
                                      <Badge variant="outline" className="text-[9px] uppercase opacity-50 font-bold">
                                        {task.priority}
                                      </Badge>
                                    </div>
                                  ))}
                                  {!mentee.tasks?.length && (
                                    <div className="py-8 text-center">
                                      <FileCode className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                      <p className="text-xs text-muted-foreground italic">No tasks assigned yet</p>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>

                              <TabsContent value="projects" className="space-y-4">
                                {mentee.projects && mentee.projects.length > 0 ? (
                                  mentee.projects.map((project: any) => (
                                    <Card key={project.id} className="border-border/50 bg-muted/10">
                                      <CardContent className="p-3 space-y-3">
                                        <div className="flex items-start justify-between">
                                          <div>
                                            <h6 className="text-sm font-medium">{project.title}</h6>
                                            <Badge className="text-[10px] mt-1" variant="outline">
                                              {project.status || "In Progress"}
                                            </Badge>
                                          </div>
                                          <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 text-accent"
                                            onClick={() => {
                                              setActiveChatProject(project);
                                              setChatOpen(true);
                                            }}
                                          >
                                            <MessageSquare className="w-4 h-4" />
                                          </Button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-[10px]">
                                          <div className="flex -space-x-1.5 overflow-hidden">
                                            {project.team?.map((member: any, i: number) => (
                                              <Avatar key={i} className="w-5 h-5 border border-background">
                                                <AvatarFallback className="bg-accent/20 text-accent text-[8px]">
                                                  {member.user?.username?.charAt(0) || member.name?.charAt(0)}
                                                </AvatarFallback>
                                              </Avatar>
                                            ))}
                                          </div>
                                          <span className="text-muted-foreground">
                                            {project.team?.length || 0} Members
                                          </span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))
                                ) : (
                                  <div className="py-12 text-center">
                                    <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground">No projects assigned</p>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="py-12 text-center">
                    <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      Select an intern to view details and manage tasks
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {activeChatProject && (
        <TeamChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          projectId={activeChatProject.id}
          conversationId={activeChatProject.conversationId}
          projectTitle={activeChatProject.title}
          teamMembers={activeChatProject.team || []}
          mentors={activeChatProject.mentors || []}
        />
      )}
    </PortalLayout>
  );
}
