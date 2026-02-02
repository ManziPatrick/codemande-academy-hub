import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Users,
  Building2,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  UserPlus,
  Search,
  Filter,
  GraduationCap,
  Layers,
  FileCode,
} from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_INTERNSHIPS, GET_USERS, GET_ALL_PROJECTS } from "@/lib/graphql/queries";
import { CREATE_INTERNSHIP, UPDATE_INTERNSHIP, DELETE_INTERNSHIP, PROMOTE_INTERN, ADD_INTERNSHIP_TASK, UPDATE_INTERNSHIP_TASK, ADD_BATCH_TASK } from "@/lib/graphql/mutations";
import { toast } from "sonner";

const INTERNSHIP_STAGES = [
  { id: 1, title: "Stage 1: Orientation & Onboarding" },
  { id: 2, title: "Stage 2: Foundation Skills Training" },
  { id: 3, title: "Stage 3: Guided Practical Projects" },
  { id: 4, title: "Stage 4: Industry Internship / Work Simulation" },
  { id: 5, title: "Stage 5: Evaluation & Certification" },
  { id: 6, title: "Stage 6: Career Transition & Placement Support" },
];

export default function AdminInternships() {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  
  // GraphQL Data
  const { data: internshipsData, loading: internshipsLoading, refetch: refetchInternships } = useQuery(GET_ALL_INTERNSHIPS);
  const { data: usersData } = useQuery(GET_USERS);
  const { data: projectsData } = useQuery(GET_ALL_PROJECTS);

  // Mutations
  const [createInternship] = useMutation(CREATE_INTERNSHIP);
  const [updateInternship] = useMutation(UPDATE_INTERNSHIP);
  const [deleteInternship] = useMutation(DELETE_INTERNSHIP);
  const [promoteInternMutation] = useMutation(PROMOTE_INTERN);
  const [addTaskMutation] = useMutation(ADD_INTERNSHIP_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_INTERNSHIP_TASK);
  const [addBatchTaskMutation] = useMutation(ADD_BATCH_TASK);

  const [groupPromotionOpen, setGroupPromotionOpen] = useState(false);
  const [batchTaskOpen, setBatchTaskOpen] = useState(false);
  const [batchTaskData, setBatchTaskData] = useState({ stage: "1", cohort: "", title: "", priority: "medium" });
  const [taskManagerOpen, setTaskManagerOpen] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [groupPromotionData, setGroupPromotionData] = useState({ current: "1", cohort: "", target: "2" });

  // Assign form state
  const [assignForm, setAssignForm] = useState({
    userId: "",
    title: "Full Stack Internship",
    organization: "Codemande Academy",
    duration: "3 Months",
    type: "Online",
    mentorId: "",
    stage: "Stage 1: Orientation & Onboarding",
    amount: "20,000",
    cohort: "",
  });

  const internships = (internshipsData as any)?.internships || [];
  const students = (usersData as any)?.users?.filter((u: any) => u.role === "student") || [];
  const trainers = (usersData as any)?.users?.filter((u: any) => u.role === "trainer" || u.role === "admin") || [];
  const projects = (projectsData as any)?.projects || [];
  const uniqueCohorts = Array.from(new Set(internships.map((i: any) => i.cohort).filter(Boolean))) as string[];

  const handleCreate = async () => {
    if (!assignForm.userId || !assignForm.title || !assignForm.mentorId) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createInternship({
        variables: {
          userId: assignForm.userId,
          title: assignForm.title,
          organization: assignForm.organization,
          duration: assignForm.duration,
          type: assignForm.type,
          mentorId: assignForm.mentorId,
          stage: assignForm.stage,
          cohort: assignForm.cohort,
          payment: {
            amount: parseFloat(assignForm.amount),
            currency: "RWF",
            status: "pending"
          }
        }
      });
      toast.success("Internship assigned successfully!");
      refetchInternships();
      setIsAssignOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePromote = async (id: string, currentStageNum: number | undefined) => {
    const nextStageNum = (currentStageNum || 1) + 1;
    if (nextStageNum > 6) {
      toast.info("Intern has completed all stages");
      return;
    }

    try {
      await promoteInternMutation({
        variables: {
          id: id,
          targetStage: nextStageNum
        }
      });
      toast.success(`Intern promoted to Stage ${nextStageNum}!`);
      refetchInternships();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGroupPromote = async () => {
    try {
      await promoteInternMutation({
        variables: {
          groupId: groupPromotionData.current,
          cohort: groupPromotionData.cohort,
          targetStage: parseInt(groupPromotionData.target)
        }
      });
      toast.success("Cohort promoted successfully!");
      refetchInternships();
      setGroupPromotionOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBatchTask = async () => {
    if (!batchTaskData.title) {
        toast.error("Please provide a task title");
        return;
    }
    try {
      await addBatchTaskMutation({
        variables: {
          stage: batchTaskData.stage ? parseInt(batchTaskData.stage) : null,
          cohort: batchTaskData.cohort,
          title: batchTaskData.title,
          priority: batchTaskData.priority
        }
      });
      toast.success(`Task assigned to Stage ${batchTaskData.stage} interns!`);
      refetchInternships();
      setBatchTaskOpen(false);
      setBatchTaskData({ ...batchTaskData, title: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddTask = async (internshipId: string) => {
    if (!newTaskTitle) return;
    try {
      await addTaskMutation({
        variables: { internshipId, title: newTaskTitle }
      });
      setNewTaskTitle("");
      toast.success("Task added");
      refetchInternships();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleTask = async (internshipId: string, taskId: string, currentStatus: string) => {
    try {
      await updateTaskMutation({
        variables: {
          internshipId,
          taskId,
          status: currentStatus === "completed" ? "pending" : "completed"
        }
      });
      refetchInternships();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredInternships = internships.filter((i: any) => 
    i.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  const stats = [
    { label: "Active Interns", value: internships.filter((i: any) => i.status !== "graduated").length, icon: Briefcase },
    { label: "Graduates", value: internships.filter((i: any) => i.status === "graduated").length, icon: GraduationCap },
    { label: "Eligible Students", value: students.length, icon: Users },
    { label: "Projects Tracked", value: projects.length, icon: FileCode },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Internship Management
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage academy interns, assign stages, and track project completion
            </p>
          </div>
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="shadow-lg shadow-gold/20">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Intern
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Enroll Student as Intern</DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Student *</label>
                    <Select onValueChange={(v) => setAssignForm({ ...assignForm, userId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>{s.username} ({s.email})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Program Title *</label>
                      <Input 
                        value={assignForm.title} 
                        onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Initial Stage</label>
                      <Select defaultValue={assignForm.stage} onValueChange={(v) => setAssignForm({ ...assignForm, stage: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERNSHIP_STAGES.map(s => (
                            <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign Mentor *</label>
                    <Select onValueChange={(v) => setAssignForm({ ...assignForm, mentorId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((t: any) => (
                          <SelectItem key={t.id} value={t.id}>{t.username}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Internship Fee (RWF)</label>
                      <Input 
                        type="number"
                        value={assignForm.amount} 
                        onChange={(e) => setAssignForm({ ...assignForm, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration</label>
                      <Input 
                        value={assignForm.duration} 
                        onChange={(e) => setAssignForm({ ...assignForm, duration: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cohort / Group Name</label>
                    <Input 
                      placeholder="e.g. Winter 2026, Cohort Alpha" 
                      value={assignForm.cohort} 
                      onChange={(e) => setAssignForm({ ...assignForm, cohort: e.target.value })}
                    />
                  </div>
                </div>
              </ScrollArea>
              <div className="px-6 pb-6 pt-2">
                <Button variant="gold" className="w-full" onClick={handleCreate}>
                  Confirm Enrollment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 bg-muted/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="active">Active Interns</TabsTrigger>
              <TabsTrigger value="graduated">Graduates</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Dialog open={groupPromotionOpen} onOpenChange={setGroupPromotionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-accent/20 text-accent hover:bg-accent/5">
                  <TrendingUp className="w-4 h-4 mr-2" /> Batch Progression
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Promote Intern Cohort</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 text-center">
                  <p className="text-sm text-muted-foreground">This will advance EVERY intern currently in the source stage to the target stage.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase opacity-60">Source Stage</label>
                       <Select value={groupPromotionData.current} onValueChange={(v) => setGroupPromotionData({...groupPromotionData, current: v})}>
                         <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                         <SelectContent>
                           {INTERNSHIP_STAGES.map(s => <SelectItem key={s.id} value={s.id.toString()}>Stage {s.id}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase opacity-60">Target Stage</label>
                       <Select value={groupPromotionData.target} onValueChange={(v) => setGroupPromotionData({...groupPromotionData, target: v})}>
                         <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                         <SelectContent>
                           {INTERNSHIP_STAGES.map(s => <SelectItem key={s.id} value={s.id.toString()}>Stage {s.id}</SelectItem>)}
                         </SelectContent>
                       </Select>
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase opacity-60">Filter by Cohort (Optional)</label>
                    <Select value={groupPromotionData.cohort} onValueChange={(v) => setGroupPromotionData({...groupPromotionData, cohort: v})}>
                      <SelectTrigger className="h-8 text-xs border-accent/20"><SelectValue placeholder="All Cohorts" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">All Cohorts</SelectItem>
                        {uniqueCohorts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="gold" className="w-full mt-4" onClick={handleGroupPromote}>Execute Batch Promotion</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={batchTaskOpen} onOpenChange={setBatchTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-accent/20 text-accent hover:bg-accent/5">
                  <FileCode className="w-4 h-4 mr-2" /> Batch Tasking
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Batch Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">By Stage</label>
                      <Select value={batchTaskData.stage} onValueChange={(v) => setBatchTaskData({...batchTaskData, stage: v})}>
                        <SelectTrigger><SelectValue placeholder="All Stages" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">All Stages</SelectItem>
                          {INTERNSHIP_STAGES.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">By Cohort</label>
                      <Select value={batchTaskData.cohort} onValueChange={(v) => setBatchTaskData({...batchTaskData, cohort: v})}>
                        <SelectTrigger><SelectValue placeholder="All Cohorts" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="null">All Cohorts</SelectItem>
                          {uniqueCohorts.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Task Title *</label>
                    <Input 
                        placeholder="e.g., Complete Week 1 Assessment" 
                        value={batchTaskData.title}
                        onChange={(e) => setBatchTaskData({...batchTaskData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={batchTaskData.priority} onValueChange={(v) => setBatchTaskData({...batchTaskData, priority: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="gold" className="w-full mt-2" onClick={handleBatchTask}>Assign to Cohort</Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search interns..." 
                className="pl-9 bg-muted/30 border-none h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="wait">
            {internshipsLoading && !internshipsData ? (
              <div className="py-20 flex justify-center w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
              </div>
            ) : filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternships
                  .filter((i: any) => activeTab === "graduated" ? i.status === "graduated" : i.status !== "graduated")
                  .map((intern: any) => (
                  <motion.div
                    key={intern.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden border-border/50 hover:border-accent/40 lg:hover:shadow-2xl lg:hover:shadow-accent/5 transition-all duration-300">
                      <CardHeader className="pb-4 border-b border-border/50 bg-muted/10">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-accent/10">
                              <AvatarFallback className="bg-accent text-accent-foreground text-xs font-bold">
                                {getInitials(intern.user?.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base font-semibold">{intern.user?.username}</CardTitle>
                              <p className="text-xs text-muted-foreground">{intern.title}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant="outline" className="text-[10px] bg-accent/5 text-accent border-accent/20">
                              {intern.stage}
                            </Badge>
                            {intern.cohort && (
                              <Badge variant="outline" className="text-[9px] border-border/50 opacity-70">
                                {intern.cohort}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Duration</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-3 h-3 text-accent" />
                              <span>{intern.duration}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Mentor</p>
                            <div className="flex items-center gap-2 text-sm">
                              <GraduationCap className="w-3 h-3 text-accent" />
                              <span>{intern.mentor?.username || "Not assigned"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-bold">{intern.progress}%</span>
                          </div>
                          <Progress value={intern.progress} className="h-1.5 bg-muted" />
                        </div>

                         <div className="pt-2 flex flex-wrap gap-2">
                           <Button 
                             variant="gold" 
                             size="sm" 
                             className="flex-1 h-8 text-xs"
                             onClick={() => handlePromote(intern.id, intern.currentStage)}
                             disabled={intern.status === "graduated"}
                           >
                             <Layers className="w-3 h-3 mr-1.5" />
                             {intern.status === "graduated" ? "Completed" : "Promote"}
                           </Button>
                           <Dialog open={taskManagerOpen === intern.id} onOpenChange={(open) => setTaskManagerOpen(open ? intern.id : null)}>
                             <DialogTrigger asChild>
                               <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-accent/20">
                                 <FileCode className="w-3 h-3 mr-1.5 text-accent" />
                                 Tasks ({intern.tasks?.filter((t: any) => t.status === 'completed').length || 0}/{intern.tasks?.length || 0})
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="max-w-md">
                               <DialogHeader>
                                 <DialogTitle>Task Console - {intern.user?.username}</DialogTitle>
                               </DialogHeader>
                               <div className="space-y-4 pt-4">
                                 <div className="flex gap-2">
                                   <Input 
                                     placeholder="New assignment title..." 
                                     value={newTaskTitle}
                                     onChange={(e) => setNewTaskTitle(e.target.value)}
                                     onKeyDown={(e) => e.key === 'Enter' && handleAddTask(intern.id)}
                                   />
                                   <Button variant="outline" onClick={() => handleAddTask(intern.id)}>Add Task</Button>
                                 </div>
                                 <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                   {intern.tasks?.map((task: any) => (
                                     <div key={task.id} className="flex items-center justify-between p-2 bg-muted/20 rounded border border-border/50 group hover:border-accent/30 transition-all">
                                       <div className="flex items-center gap-3">
                                         <div 
                                           className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'border-muted-foreground/30 hover:border-accent'}`}
                                           onClick={() => handleToggleTask(intern.id, task.id, task.status)}
                                         >
                                           {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                                         </div>
                                         <span className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>{task.title}</span>
                                       </div>
                                       <Badge variant="outline" className="text-[9px] uppercase opacity-50 font-bold">{task.priority}</Badge>
                                     </div>
                                   ))}
                                   {!intern.tasks?.length && (
                                     <div className="py-12 text-center">
                                        <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileCode className="w-6 h-6 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-xs text-muted-foreground italic">No tasks assigned to this stage yet.</p>
                                     </div>
                                   )}
                                 </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                         </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-heading text-lg font-medium">No Interns Found</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Start by assigning a student to an internship program using the button above.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PortalLayout>
  );
}
