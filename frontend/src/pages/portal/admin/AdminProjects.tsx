import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  FolderOpen,
  Plus,
  Search,
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart2,
  Calendar,
  Layers,
  FileText,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_PROJECTS, GET_USERS } from "@/lib/graphql/queries";
import { DELETE_PROJECT, UPDATE_PROJECT } from "@/lib/graphql/mutations";
import { toast } from "sonner";
import { format } from "date-fns";
import { TeamChatDialog, ManageProjectTasksDialog, ProjectDetailsDialog, CreateAgileProjectDialog } from "@/components/portal/dialogs";

export default function AdminProjects() {
  const [createOpen, setCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeChatProject, setActiveChatProject] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [manageTasksProject, setManageTasksProject] = useState<any>(null);
  const [manageTasksOpen, setManageTasksOpen] = useState(false);
  const [activeProjectForDetails, setActiveProjectForDetails] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, loading, refetch } = useQuery(GET_ALL_PROJECTS);
  const projects = (data as any)?.projects || [];

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      toast.success("Project deleted successfully");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen, color: "text-blue-500" },
    { label: "Active", value: projects.filter((p: any) => p.status === "in_progress").length, icon: Clock, color: "text-amber-500" },
    { label: "Completed", value: projects.filter((p: any) => p.status === "completed").length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Pending Review", value: projects.filter((p: any) => p.status === "pending_review").length, icon: AlertCircle, color: "text-rose-500" },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Project Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Oversee all academy projects, track team progress, and provide mentorship
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-accent hover:bg-accent/90 text-white gap-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="w-4 h-4" />
              New Agile Project
            </Button>
          </div>
        </div>

        <CreateAgileProjectDialog 
          open={createOpen} 
          onOpenChange={setCreateOpen} 
          refetch={refetch}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-muted/5">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-background border border-border/50 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by title..."
              className="pl-10 bg-muted/20 border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 bg-muted/20 border border-border/50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="in_progress">In Progress</option>
              <option value="pending_review">Pending Review</option>
              <option value="completed">Completed</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-border/50 py-20 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full border-border/50 bg-card hover:border-accent/30 transition-all group">
                  <CardHeader className="p-5 pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] uppercase font-bold ${
                          project.type === 'Team Project' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                        }`}
                      >
                        {project.type}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setActiveProjectForDetails(project);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 cursor-pointer"
                            onClick={() => {
                              setManageTasksProject(project);
                              setManageTasksOpen(true);
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4" /> Manage Tasks
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this project?")) {
                                deleteProject({ variables: { id: project.id } });
                              }
                            }}
                          >
                            <AlertCircle className="w-4 h-4" /> Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg font-heading line-clamp-1">{project.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Layers className="w-3 h-3" /> {project.course}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="p-5 space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {project.description}
                    </p>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold text-accent">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team?.slice(0, 4).map((member: any, i: number) => (
                          <Avatar key={i} className="w-8 h-8 ring-2 ring-background border-0">
                            <AvatarFallback className="bg-accent/20 text-accent text-[10px] font-bold">
                              {member.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team?.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold ring-2 ring-background">
                            +{project.team.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 border-border/50 hover:bg-accent/10 hover:text-accent"
                          onClick={() => {
                            setActiveChatProject(project);
                            setChatOpen(true);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-8 w-8 border-border/50 hover:bg-accent/10 hover:text-accent"
                          asChild
                        >
                          <a href={project.submissionUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 text-muted-foreground uppercase font-bold tracking-wider">
                        <Calendar className="w-3 h-3" />
                        Deadline: {project.deadline ? format(new Date(project.deadline), "MMM d, yyyy") : "N/A"}
                      </div>
                      <Badge 
                        className={`text-[9px] uppercase font-black ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          project.status === 'pending_review' ? 'bg-rose-500/20 text-rose-500' :
                          'bg-amber-500/20 text-amber-500'
                        }`}
                      >
                        {project.status?.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 font-bold text-xs"
                      onClick={() => {
                        setManageTasksProject(project);
                        setManageTasksOpen(true);
                      }}
                    >
                      Manage Tasks & Marking
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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

      <ManageProjectTasksDialog
        open={manageTasksOpen}
        onOpenChange={setManageTasksOpen}
        project={manageTasksProject}
        refetch={refetch}
      />

      <ProjectDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        project={activeProjectForDetails}
        refetch={refetch}
      />
    </PortalLayout>
  );
}
