import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Target,
  MessageSquare,
  CreditCard,
  FileText,
  Star,
  ArrowRight,
  AlertCircle,
  Lock,
} from "lucide-react";
import { ApplyInternshipDialog, BookCallDialog, TeamChatDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

const internshipData = {
  eligible: true,
  enrolled: true,
  status: "in_progress", // not_eligible, eligible, enrolled, in_progress, completed
  payment: {
    amount: 20000,
    currency: "RWF",
    status: "paid", // pending, paid
    paidAt: "Jan 10, 2026",
  },
  details: {
    title: "Software Development Intern",
    company: "CODEMANDE Tech Hub",
    startDate: "Jan 15, 2026",
    endDate: "Apr 15, 2026",
    duration: "3 months",
    type: "Hybrid",
    mentor: {
      name: "Marie Claire",
      role: "Senior Software Engineer",
      avatar: "/placeholder.svg",
    },
  },
  progress: 35,
  milestones: [
    { title: "Onboarding & Setup", completed: true, date: "Jan 15, 2026" },
    { title: "First Sprint Completed", completed: true, date: "Jan 30, 2026" },
    { title: "Mid-term Review", completed: false, date: "Feb 28, 2026" },
    { title: "Final Project Submission", completed: false, date: "Apr 10, 2026" },
    { title: "Internship Completion", completed: false, date: "Apr 15, 2026" },
  ],
  tasks: [
    { id: "t1", title: "Implement user authentication module", status: "completed", priority: "high" },
    { id: "t2", title: "Build dashboard components", status: "in_progress", priority: "medium" },
    { id: "t3", title: "API integration for analytics", status: "pending", priority: "high" },
    { id: "t4", title: "Write unit tests", status: "pending", priority: "medium" },
  ],
  meetings: [
    { title: "Weekly Check-in", time: "Every Monday, 10:00 AM", type: "recurring" },
    { title: "Code Review Session", time: "Wed, 2:00 PM", type: "upcoming" },
    { title: "Project Planning", time: "Fri, 11:00 AM", type: "upcoming" },
  ],
};

const getTaskStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">Done</Badge>;
    case "in_progress":
      return <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">In Progress</Badge>;
    default:
      return <Badge variant="outline" className="bg-muted text-muted-foreground">Pending</Badge>;
  }
};

export default function StudentInternship() {
  const { eligible, enrolled, status, payment, details, progress, milestones, tasks, meetings } = internshipData;
  
  // Dialog states
  const [applyOpen, setApplyOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const handleMessage = () => {
    setChatOpen(true);
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
              Internship Program
            </h1>
            <p className="text-muted-foreground mt-1">
              Gain real-world experience with industry mentorship
            </p>
          </div>
          {status === "in_progress" && (
            <Badge className="bg-accent text-accent-foreground self-start">
              <Briefcase className="w-4 h-4 mr-1" />
              Active Internship
            </Badge>
          )}
        </motion.div>

        {/* Not Eligible State */}
        {!eligible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-xl font-medium text-foreground mb-2">
                  Internship Not Yet Unlocked
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Complete at least 80% of your enrolled courses to qualify for internship placement.
                </p>
                <div className="max-w-xs mx-auto mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current Progress</span>
                    <span className="text-sm font-medium text-foreground">68%</span>
                  </div>
                  <Progress value={68} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">12% more to qualify</p>
                </div>
                <Button variant="gold">Continue Learning</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Eligible but not enrolled */}
        {eligible && !enrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 border-accent/30">
              <CardContent className="p-8">
                <div className="flex items-start gap-6 flex-col lg:flex-row">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-accent" />
                      <span className="text-accent font-medium">You're Eligible!</span>
                    </div>
                    <h2 className="font-heading text-2xl font-medium text-foreground mb-3">
                      Apply for Internship
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Congratulations on completing 80% of your courses! You're now eligible to apply 
                      for our industry internship program. Work on real projects and get mentored by experts.
                    </p>
                    
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="font-medium text-foreground">3 Months</p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="font-medium text-foreground">1:1 Mentorship</p>
                        <p className="text-xs text-muted-foreground">Dedicated Mentor</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <Target className="w-6 h-6 text-accent mx-auto mb-2" />
                        <p className="font-medium text-foreground">Real Projects</p>
                        <p className="text-xs text-muted-foreground">Industry Experience</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 p-6 bg-card rounded-xl border border-border/50">
                    <h3 className="font-heading font-semibold text-card-foreground mb-4">
                      Internship Fee
                    </h3>
                    <div className="text-3xl font-bold text-accent mb-1">
                      20,000 <span className="text-lg font-normal">RWF</span>
                    </div>
                    <p className="text-sm text-card-foreground/60 mb-6">One-time payment</p>
                    <Button variant="gold" className="w-full" onClick={() => setApplyOpen(true)}>
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-xs text-card-foreground/50 text-center mt-3">
                      Payment secures your spot in the next cohort
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Active Internship */}
        {status === "in_progress" && (
          <>
            {/* Internship Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{details.title}</p>
                      <p className="text-xs text-card-foreground/60">{details.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{details.duration}</p>
                      <p className="text-xs text-card-foreground/60">{details.startDate} - {details.endDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </p>
                      <p className="text-xs text-green-400">Paid on {payment.paidAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress & Details */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Progress */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-card-foreground mb-4">
                      Internship Progress
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-card-foreground/70">Overall Completion</span>
                      <span className="text-sm font-medium text-accent">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 mb-6" />

                    {/* Milestones */}
                    <div className="space-y-4">
                      {milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.completed
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {milestone.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              milestone.completed ? "text-card-foreground" : "text-card-foreground/70"
                            }`}>
                              {milestone.title}
                            </p>
                            <p className="text-xs text-card-foreground/50">{milestone.date}</p>
                          </div>
                          {milestone.completed && (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tasks */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-card-foreground mb-4">
                      Current Tasks
                    </h3>
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle className={`w-5 h-5 ${
                              task.status === "completed" ? "text-accent" : "text-muted-foreground"
                            }`} />
                            <span className={`text-sm ${
                              task.status === "completed" ? "text-card-foreground/70 line-through" : "text-card-foreground"
                            }`}>
                              {task.title}
                            </span>
                          </div>
                          {getTaskStatusBadge(task.status)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Mentor */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-card-foreground mb-4">
                      Your Mentor
                    </h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">
                          {details.mentor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{details.mentor.name}</p>
                        <p className="text-sm text-card-foreground/60">{details.mentor.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="gold" size="sm" className="flex-1" onClick={handleMessage}>
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setBookCallOpen(true)}>
                        Book Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Meetings */}
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-card-foreground mb-4">
                      Upcoming Meetings
                    </h3>
                    <div className="space-y-3">
                      {meetings.map((meeting, index) => (
                        <div key={index} className="p-3 bg-background/50 rounded-lg">
                          <p className="text-sm font-medium text-card-foreground">{meeting.title}</p>
                          <p className="text-xs text-card-foreground/60 mt-1">{meeting.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Dialogs */}
      <ApplyInternshipDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        onApply={() => toast.success("Application submitted!")}
      />
      <BookCallDialog
        open={bookCallOpen}
        onOpenChange={setBookCallOpen}
        mentorName={details.mentor.name}
        purpose="mentorship"
      />
      <TeamChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        projectTitle="Internship Discussion"
        teamMembers={[
          { name: details.mentor.name, role: "Mentor" },
          { name: "You", role: "Intern" },
        ]}
      />
    </PortalLayout>
  );
}
