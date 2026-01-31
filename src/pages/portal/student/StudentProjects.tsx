import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Upload,
  FileText,
  ExternalLink,
} from "lucide-react";
import { SubmitProjectDialog, TeamChatDialog, ViewGuidelinesDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

interface TeamMember {
  name: string;
  role: string;
}

interface Task {
  title: string;
  completed: boolean;
}

interface Project {
  id: string;
  title: string;
  course: string;
  type: string;
  status: string;
  progress: number;
  deadline?: string;
  daysLeft?: number;
  submittedAt?: string;
  grade?: string;
  feedback?: string;
  team?: TeamMember[];
  tasks?: Task[];
  description: string;
}

const projects: Project[] = [
  {
    id: "p1",
    title: "E-Commerce Dashboard",
    course: "Software Development",
    type: "Team Project",
    status: "in_progress",
    progress: 65,
    deadline: "Feb 15, 2026",
    daysLeft: 14,
    team: [
      { name: "Jean Baptiste", role: "Frontend Lead" },
      { name: "Marie Uwase", role: "Backend" },
      { name: "Emmanuel K.", role: "UI/UX" },
    ],
    tasks: [
      { title: "Setup project structure", completed: true },
      { title: "Design UI components", completed: true },
      { title: "Implement authentication", completed: true },
      { title: "Build product listing", completed: false },
      { title: "Shopping cart functionality", completed: false },
      { title: "Payment integration", completed: false },
    ],
    description: "Build a full-featured e-commerce dashboard with product management, order tracking, and analytics.",
  },
  {
    id: "p2",
    title: "Data Analysis Report",
    course: "Data Science & AI",
    type: "Individual",
    status: "pending_review",
    progress: 100,
    deadline: "Jan 28, 2026",
    daysLeft: 0,
    submittedAt: "Jan 25, 2026",
    description: "Analyze customer data to identify purchasing patterns and provide actionable insights.",
  },
  {
    id: "p3",
    title: "Portfolio Website",
    course: "Software Development",
    type: "Individual",
    status: "completed",
    progress: 100,
    grade: "A",
    feedback: "Excellent work! Clean design and well-structured code.",
    description: "Create a personal portfolio website showcasing your projects and skills.",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in_progress":
      return <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">In Progress</Badge>;
    case "pending_review":
      return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-400/30">Pending Review</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">Completed</Badge>;
    default:
      return null;
  }
};

export default function StudentProjects() {
  // Dialog states
  const [submitProject, setSubmitProject] = useState<Project | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [guidelinesProject, setGuidelinesProject] = useState<Project | null>(null);

  const handleViewSubmission = (projectTitle: string) => {
    toast.info(`Opening submission for ${projectTitle}...`);
  };

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
              My Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-world projects to build your portfolio
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-full">
              <FolderOpen className="w-4 h-4 text-accent" />
              <span className="text-foreground">{projects.length} Projects</span>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-heading text-lg font-semibold text-card-foreground">
                              {project.title}
                            </h3>
                            {getStatusBadge(project.status)}
                          </div>
                          <p className="text-sm text-card-foreground/60">
                            {project.course} • {project.type}
                          </p>
                        </div>
                      </div>

                      <p className="text-card-foreground/70 text-sm mb-4">
                        {project.description}
                      </p>

                      {/* Progress */}
                      {project.status !== "completed" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-card-foreground/70">Progress</span>
                            <span className="text-sm font-medium text-accent">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                      )}

                      {/* Team Members */}
                      {project.team && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4 text-accent" />
                            Team Members
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {project.team.map((member, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-full text-xs"
                              >
                                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">
                                  {member.name.charAt(0)}
                                </div>
                                <span className="text-card-foreground">{member.name}</span>
                                <span className="text-card-foreground/50">({member.role})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grade & Feedback */}
                      {project.status === "completed" && (
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <span className="text-lg font-bold text-green-400">{project.grade}</span>
                            </div>
                            <div>
                              <p className="font-medium text-card-foreground">Graded</p>
                              <p className="text-xs text-card-foreground/60">Great job!</p>
                            </div>
                          </div>
                          <p className="text-sm text-card-foreground/70">{project.feedback}</p>
                        </div>
                      )}

                      {/* Pending Review Status */}
                      {project.status === "pending_review" && (
                        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="font-medium text-card-foreground">Submitted for Review</p>
                              <p className="text-xs text-card-foreground/60">Submitted on {project.submittedAt}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-64 space-y-4">
                      {/* Deadline */}
                      {project.status === "in_progress" && project.deadline && (
                        <div className="p-4 bg-background/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-card-foreground">Deadline</span>
                          </div>
                          <p className="text-lg font-semibold text-card-foreground">{project.deadline}</p>
                          <p className="text-xs text-accent">{project.daysLeft} days remaining</p>
                        </div>
                      )}

                      {/* Tasks Checklist */}
                      {project.tasks && (
                        <div className="p-4 bg-background/50 rounded-lg">
                          <p className="text-sm font-medium text-card-foreground mb-3">Tasks</p>
                          <div className="space-y-2">
                            {project.tasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle
                                  className={`w-4 h-4 ${
                                    task.completed ? "text-accent" : "text-card-foreground/30"
                                  }`}
                                />
                                <span
                                  className={`text-xs ${
                                    task.completed
                                      ? "text-card-foreground/70 line-through"
                                      : "text-card-foreground"
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="space-y-2">
                        {project.status === "in_progress" && (
                          <>
                            <Button 
                              variant="gold" 
                              size="sm" 
                              className="w-full"
                              onClick={() => setSubmitProject(project)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Project
                            </Button>
                            {project.team && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => setChatProject(project)}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Team Chat
                              </Button>
                            )}
                          </>
                        )}
                        {project.status === "completed" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleViewSubmission(project.title)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Submission
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setGuidelinesProject(project)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Guidelines
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <SubmitProjectDialog
        open={!!submitProject}
        onOpenChange={(open) => !open && setSubmitProject(null)}
        projectTitle={submitProject?.title || ""}
      />
      <TeamChatDialog
        open={!!chatProject}
        onOpenChange={(open) => !open && setChatProject(null)}
        projectTitle={chatProject?.title || ""}
        teamMembers={chatProject?.team || []}
      />
      <ViewGuidelinesDialog
        open={!!guidelinesProject}
        onOpenChange={(open) => !open && setGuidelinesProject(null)}
        projectTitle={guidelinesProject?.title || ""}
      />
    </PortalLayout>
  );
}
